/*
  # Fix User Roles RLS Policies
  
  1. Changes
    - Remove all existing user_roles policies
    - Create single simplified policy for user access
    - Create single simplified policy for admin access without recursion
    
  2. Security
    - Maintain data access control
    - Prevent infinite recursion
    - Simplify policy logic
*/

-- Drop all existing policies for user_roles
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Admins have full access" ON user_roles;

-- Create new simplified policies
CREATE POLICY "allow_user_read_own"
ON user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "allow_admin_all"
ON user_roles
FOR ALL
TO authenticated
USING (
  (SELECT role FROM user_roles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
);