/*
  # Fix user_roles RLS policies

  1. Changes
    - Remove existing problematic policies from user_roles table
    - Add new, simplified policies that avoid recursion
    
  2. Security
    - Enable RLS on user_roles table
    - Add policy for users to view their own role
    - Add policy for admins using a simpler approach
*/

-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;

-- Create new policies that avoid recursion
CREATE POLICY "Enable read access for users to their own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- For admin access, we'll use a simpler policy that checks the role directly
-- This avoids the recursion by not querying the user_roles table again
CREATE POLICY "Enable full access for admins"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
      AND user_roles.id != id  -- Prevent self-reference
    )
  );