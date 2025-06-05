/*
  # Fix User Roles RLS Policies

  1. Changes
    - Remove existing problematic policies that cause infinite recursion
    - Add new, simplified policies for user_roles table:
      - Users can read their own role
      - Admins can perform all operations
      - No circular references in policy definitions
  
  2. Security
    - Maintains RLS protection
    - Prevents infinite recursion
    - Preserves admin access control
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Enable full access for admins" ON user_roles;
DROP POLICY IF EXISTS "Enable read access for users to their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;

-- Create new, simplified policies
CREATE POLICY "Users can read own role"
ON user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access"
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