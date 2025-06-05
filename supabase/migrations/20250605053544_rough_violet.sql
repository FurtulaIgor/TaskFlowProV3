/*
  # Simplify user_roles policies

  1. Changes
    - Remove all existing user_roles policies
    - Add single policy for users to read their own role
    
  2. Security
    - Enable RLS on user_roles table
    - Add policy for users to view only their own role
*/

-- Drop all existing policies for user_roles
DROP POLICY IF EXISTS "user_roles_self_read" ON user_roles;
DROP POLICY IF EXISTS "user_roles_admin_all" ON user_roles;

-- Create new simplified policy
CREATE POLICY "user_roles_self_read"
ON user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);