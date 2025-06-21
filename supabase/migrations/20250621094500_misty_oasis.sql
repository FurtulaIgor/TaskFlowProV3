/*
  # Fix RPC function type mismatch

  1. Function Updates
    - Update `get_all_users_with_roles` function to use correct return types
    - Change email column type from `character varying(255)` to `text` to match auth.users.email type
    - Ensure all return types match the actual column types in the database

  2. Changes Made
    - Modified the RETURNS TABLE clause to use `text` for email column
    - This resolves the "structure of query does not match function result type" error
*/

-- Drop the existing function first
DROP FUNCTION IF EXISTS public.get_all_users_with_roles();

-- Recreate the function with correct return types
CREATE OR REPLACE FUNCTION public.get_all_users_with_roles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role text,
  created_at timestamptz,
  email text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.created_at,
    au.email
  FROM user_roles ur
  LEFT JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_all_users_with_roles() TO authenticated;