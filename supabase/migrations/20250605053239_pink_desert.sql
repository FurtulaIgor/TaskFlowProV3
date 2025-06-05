/*
  # Fix user_roles RLS policies

  1. Changes
    - Remove all existing user_roles policies
    - Add simplified policies without recursion
    - Fix admin access policy
    
  2. Security
    - Basic read access for users
    - Admin access using a subquery pattern
*/

-- Drop all existing policies for user_roles
DROP POLICY IF EXISTS "user_roles_self_read" ON user_roles;
DROP POLICY IF EXISTS "user_roles_admin_all" ON user_roles;

-- Create new simplified policies
CREATE POLICY "user_roles_self_read"
ON user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "user_roles_admin_all"
ON user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.role = 'admin'
    AND ur.id <> user_roles.id
  )
);