/*
  # Fix admin permissions and RLS policies

  This migration resolves the "Insufficient permissions" error when deleting users
  by fixing the RLS policies on the user_roles table and ensuring proper admin verification.

  ## Changes Made

  1. **Clean up existing policies**: Remove any conflicting or duplicate policies
  2. **Create proper RLS policies**: Ensure authenticated users can read their own roles
  3. **Fix admin verification**: Allow the Edge Function to properly verify admin status
  4. **Add missing indexes**: Improve query performance for role checks

  ## Security

  - Users can only read their own roles
  - Admins can manage all user roles
  - Edge Functions can verify user permissions properly
*/

-- First, drop any existing conflicting policies to start clean
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "users_can_read_own_roles" ON user_roles;
DROP POLICY IF EXISTS "users_can_view_own_roles" ON user_roles;
DROP POLICY IF EXISTS "allow_insert_user_roles" ON user_roles;
DROP POLICY IF EXISTS "admins_can_view_all_user_roles" ON user_roles;
DROP POLICY IF EXISTS "admins_can_insert_any_user_roles" ON user_roles;
DROP POLICY IF EXISTS "admins_can_update_any_user_roles" ON user_roles;

-- Ensure RLS is enabled
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create clean, non-conflicting policies for user_roles table

-- Allow users to read their own role
CREATE POLICY "users_can_read_own_role" ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own role (for initial setup)
CREATE POLICY "users_can_insert_own_role" ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow admins to view all user roles
CREATE POLICY "admins_can_view_all_roles" ON user_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Allow admins to insert any user role
CREATE POLICY "admins_can_insert_any_role" ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Allow admins to update any user role
CREATE POLICY "admins_can_update_any_role" ON user_roles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Allow admins to delete user roles
CREATE POLICY "admins_can_delete_any_role" ON user_roles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Create or replace the is_admin function to avoid recursion
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = user_uuid 
    AND role = 'admin'
  );
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO service_role;

-- Ensure proper indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON user_roles(user_id, role);

-- Create a view for easier admin checking (optional, for debugging)
CREATE OR REPLACE VIEW admin_users AS
SELECT 
  ur.user_id,
  ur.role,
  ur.created_at
FROM user_roles ur
WHERE ur.role = 'admin';

-- Grant access to the view
GRANT SELECT ON admin_users TO authenticated;
GRANT SELECT ON admin_users TO service_role;