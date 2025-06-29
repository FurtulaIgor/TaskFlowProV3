/*
  # Fix get_all_users_with_roles function return type

  1. Changes
    - Drop existing function first as suggested by error message
    - Recreate the function with the correct return type
    - Maintain all security features (SECURITY DEFINER, search_path)
    - Preserve admin-only access control

  2. Security
    - Function maintains SECURITY DEFINER
    - Immutable search_path to prevent injection
    - Admin role verification
*/

-- First drop the existing function as suggested by the error
DROP FUNCTION IF EXISTS public.get_all_users_with_roles();

-- Recreate the function with the correct return type
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
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Check if current user is admin using the safe function
  IF NOT public.is_user_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.'
      USING HINT = 'Only users with admin role can access this function';
  END IF;

  -- Return all user roles with email information
  RETURN QUERY
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.created_at,
    COALESCE(au.email, 'Unknown') as email
  FROM public.user_roles ur
  LEFT JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;

EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error fetching users and roles: %', SQLERRM;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_all_users_with_roles() TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.get_all_users_with_roles() IS 'Admin-only function to get all users with their roles - fixed return type';