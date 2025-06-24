/*
  # Fix RPC function type mismatch

  1. Problem
    - The `get_all_users_with_roles` RPC function has a type mismatch
    - Column 5 (email) is returning `character varying(255)` but declared as `text`
    - This causes a 400 error when calling the function from the frontend

  2. Solution
    - Drop and recreate the `get_all_users_with_roles` function
    - Fix the return type declaration to match actual data types
    - Ensure the function returns proper user and role data for admin view

  3. Changes
    - Update function return type for email column
    - Maintain compatibility with existing frontend code
*/

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_all_users_with_roles();

-- Create the corrected function with proper return types
CREATE OR REPLACE FUNCTION get_all_users_with_roles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role text,
  created_at timestamptz,
  email character varying(255)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Return user roles with email information
  RETURN QUERY
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.created_at,
    au.email
  FROM user_roles ur
  JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_users_with_roles() TO authenticated;