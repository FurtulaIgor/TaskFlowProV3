/*
  # Fix admin role management policies

  1. Security Updates
    - Add policy for admins to insert user roles for any user
    - Add policy for admins to update user roles for any user
    - Ensure admins can manage roles while maintaining security for regular users

  2. Changes
    - Create new INSERT policy allowing admins to assign roles to any user
    - Create new UPDATE policy allowing admins to modify any user's role
    - Keep existing policies for regular users to manage their own roles
*/

-- Add policy for admins to insert user roles for any user
CREATE POLICY "admins_can_insert_any_user_roles"
  ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

-- Add policy for admins to update any user's role
CREATE POLICY "admins_can_update_any_user_roles"
  ON user_roles
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Add policy for admins to view all user roles
CREATE POLICY "admins_can_view_all_user_roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));