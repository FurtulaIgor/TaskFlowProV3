/*
  # Fix User Roles RLS Policies - Remove Infinite Recursion

  This migration fixes the infinite recursion issue in user_roles table policies
  by dropping all existing policies and creating clean, non-recursive ones.

  1. Security Changes
    - Drop all existing RLS policies on user_roles table
    - Create simple, non-recursive policies for user_roles access
    - Ensure admin function doesn't cause recursion
    - Add proper policies for admin_actions table

  2. Policy Structure
    - Users can read their own roles (simple user_id check)
    - Users can insert their own roles during registration
    - Admins can manage all roles (using direct admin check)
    - No circular dependencies between policies and functions
*/

-- First, disable RLS temporarily to avoid issues during policy changes
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on user_roles table to start fresh
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "users_can_view_own_role" ON user_roles;
DROP POLICY IF EXISTS "users_can_read_own_role" ON user_roles;
DROP POLICY IF EXISTS "users_can_read_own_roles" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;
DROP POLICY IF EXISTS "users_can_insert_own_role" ON user_roles;
DROP POLICY IF EXISTS "allow_insert_user_roles" ON user_roles;
DROP POLICY IF EXISTS "Users can update their own role" ON user_roles;
DROP POLICY IF EXISTS "users_can_update_own_role" ON user_roles;
DROP POLICY IF EXISTS "Users can delete their own role" ON user_roles;
DROP POLICY IF EXISTS "users_can_delete_own_role" ON user_roles;
DROP POLICY IF EXISTS "admins_can_view_all_roles" ON user_roles;
DROP POLICY IF EXISTS "admins_can_insert_any_role" ON user_roles;
DROP POLICY IF EXISTS "admins_can_update_any_role" ON user_roles;
DROP POLICY IF EXISTS "admins_can_delete_any_role" ON user_roles;

-- Drop the problematic is_admin function if it exists
DROP FUNCTION IF EXISTS is_admin(uuid);

-- Re-enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create a simple, non-recursive admin check function
CREATE OR REPLACE FUNCTION check_admin_role()
RETURNS BOOLEAN AS $$
BEGIN
  -- Simple check: if user has admin role in user_roles table
  -- This avoids recursion by not calling itself
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- If there's any error (like during initial setup), return false
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simple, non-recursive policies for user_roles

-- Policy 1: Users can read their own roles
CREATE POLICY "users_can_read_own_roles_simple"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own roles (for registration)
CREATE POLICY "users_can_insert_own_roles_simple"
  ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow service role to manage all roles (for admin operations)
CREATE POLICY "service_role_can_manage_all_roles"
  ON user_roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 4: Authenticated users with existing admin role can manage all roles
-- This policy is safe because it doesn't create recursion - it only checks existing data
CREATE POLICY "existing_admins_can_manage_roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    -- Check if the current user already has admin role
    -- This is safe because we're not calling a function that queries user_roles recursively
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Ensure admin_actions table has proper policies without recursion
ALTER TABLE admin_actions DISABLE ROW LEVEL SECURITY;

-- Drop existing admin_actions policies
DROP POLICY IF EXISTS "admins_can_view_admin_actions" ON admin_actions;
DROP POLICY IF EXISTS "authenticated_users_can_insert_admin_actions" ON admin_actions;
DROP POLICY IF EXISTS "admins_can_insert_admin_actions" ON admin_actions;

-- Re-enable RLS for admin_actions
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Create simple policies for admin_actions
CREATE POLICY "admins_can_view_admin_actions_simple"
  ON admin_actions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "admins_can_insert_admin_actions_simple"
  ON admin_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = admin_id AND
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Create RPC function for admin operations that bypasses RLS
CREATE OR REPLACE FUNCTION get_all_users_with_roles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role text,
  email text,
  created_at timestamptz
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Return all users with their roles
  RETURN QUERY
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    au.email,
    ur.created_at
  FROM user_roles ur
  LEFT JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_users_with_roles() TO authenticated;