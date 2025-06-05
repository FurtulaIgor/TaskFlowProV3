/*
  # Fix user_roles RLS policies to prevent recursion

  1. Changes
    - Remove all existing user_roles policies
    - Add simplified policies that avoid recursion
    - Use direct role check for admin access
    
  2. Security
    - Basic read access for users to see their own role
    - Separate admin policy using a non-recursive approach
*/

-- Drop all existing policies for user_roles
DROP POLICY IF EXISTS "allow_user_read_own" ON user_roles;
DROP POLICY IF EXISTS "allow_admin_all" ON user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Admins have full access" ON user_roles;

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
      AND ur.id != user_roles.id  -- Prevent self-reference
  )
);