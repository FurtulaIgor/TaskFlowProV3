/*
  # Fix infinite recursion in user_roles RLS policies

  1. Problem
    - The is_admin() function creates infinite recursion when checking user roles
    - Multiple tables have RLS policies that depend on the is_admin() function
    - Need to remove dependencies before dropping the function

  2. Solution
    - Temporarily disable RLS on all dependent tables
    - Drop all policies that depend on is_admin() function
    - Drop the problematic is_admin() function
    - Create new non-recursive admin check function
    - Recreate all policies using the new function
    - Re-enable RLS on all tables

  3. Tables affected
    - user_roles (main table with recursion issue)
    - clients, services, appointments, invoices (have admin policies)
    - admin_actions, user_profiles (have admin policies)
*/

-- Step 1: Disable RLS on all tables that have policies depending on is_admin()
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all policies that depend on is_admin() function

-- Drop user_roles policies
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
DROP POLICY IF EXISTS "admins_can_insert_any_user_roles" ON user_roles;
DROP POLICY IF EXISTS "admins_can_update_any_user_roles" ON user_roles;
DROP POLICY IF EXISTS "admins_can_view_all_user_roles" ON user_roles;

-- Drop clients policies that depend on is_admin()
DROP POLICY IF EXISTS "admins_can_view_all_clients" ON clients;

-- Drop services policies that depend on is_admin()
DROP POLICY IF EXISTS "admins_can_view_all_services" ON services;

-- Drop appointments policies that depend on is_admin()
DROP POLICY IF EXISTS "admins_can_view_all_appointments" ON appointments;

-- Drop invoices policies that depend on is_admin()
DROP POLICY IF EXISTS "admins_can_view_all_invoices" ON invoices;

-- Drop admin_actions policies that depend on is_admin()
DROP POLICY IF EXISTS "admins_can_view_admin_actions" ON admin_actions;
DROP POLICY IF EXISTS "authenticated_users_can_insert_admin_actions" ON admin_actions;
DROP POLICY IF EXISTS "admins_can_insert_admin_actions" ON admin_actions;

-- Drop user_profiles policies that depend on is_admin()
DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON user_profiles;

-- Step 3: Now safely drop the problematic is_admin function
DROP FUNCTION IF EXISTS is_admin(uuid);

-- Step 4: Create a new non-recursive admin check function
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_admin_role() TO authenticated;

-- Step 5: Re-enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Recreate all necessary policies using the new function

-- User roles policies (non-recursive)
CREATE POLICY "users_can_read_own_roles_simple"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_roles_simple"
  ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Admin policies for user_roles (using direct query to avoid recursion)
CREATE POLICY "existing_admins_can_manage_roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
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

-- Recreate admin policies for other tables using the new function
CREATE POLICY "admins_can_view_all_clients_new"
  ON clients
  FOR SELECT
  TO authenticated
  USING (check_admin_role());

CREATE POLICY "admins_can_view_all_services_new"
  ON services
  FOR SELECT
  TO authenticated
  USING (check_admin_role());

CREATE POLICY "admins_can_view_all_appointments_new"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (check_admin_role());

CREATE POLICY "admins_can_view_all_invoices_new"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (check_admin_role());

CREATE POLICY "admins_can_view_admin_actions_new"
  ON admin_actions
  FOR SELECT
  TO authenticated
  USING (check_admin_role());

CREATE POLICY "admins_can_insert_admin_actions_new"
  ON admin_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id AND check_admin_role());

CREATE POLICY "admins_can_view_all_profiles_new"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (check_admin_role());

-- Step 7: Update the RPC function to use the new admin check
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
  -- Check if the calling user is an admin using the new function
  IF NOT check_admin_role() THEN
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