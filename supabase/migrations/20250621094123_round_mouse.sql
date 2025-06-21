/*
  # Create function to get users with roles

  1. New Function
    - `get_users_with_roles()` - Returns users with their roles and email
    - Joins user_roles and auth.users tables
    - Uses SECURITY DEFINER to access auth.users
    - Returns structured data for admin interface

  2. Security
    - Function runs with elevated privileges
    - Grant execute permission to authenticated users
    - Maintains data access control
*/

-- Create function to get users with their roles
CREATE OR REPLACE FUNCTION public.get_users_with_roles()
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
  FROM
    public.user_roles ur
  JOIN
    auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_users_with_roles() TO authenticated;

-- Create function to get all auth users (for admin purposes)
CREATE OR REPLACE FUNCTION public.get_all_users_with_roles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role text,
  created_at timestamptz,
  email text,
  user_created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(ur.id, gen_random_uuid()) as id,
    au.id as user_id,
    COALESCE(ur.role, 'pending') as role,
    COALESCE(ur.created_at, au.created_at) as created_at,
    au.email,
    au.created_at as user_created_at
  FROM
    auth.users au
  LEFT JOIN
    public.user_roles ur ON au.id = ur.user_id
  ORDER BY au.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_all_users_with_roles() TO authenticated;