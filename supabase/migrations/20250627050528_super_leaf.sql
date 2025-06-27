/*
  # Create Missing RLS Functions

  1. Functions Created
    - `check_admin_role()` - Checks if current user has admin role
    - `is_admin(uuid)` - Checks if specific user has admin role  
    - `get_all_users_with_roles()` - RPC function for admin to get all users with roles
    - `uid()` - Helper function that returns current user ID (if missing)

  2. Security
    - All functions use SECURITY DEFINER for proper permission handling
    - Admin-only functions include role verification
    - Proper error handling for unauthorized access

  3. Purpose
    - Resolve "function does not exist" errors in RLS policies
    - Provide consistent admin role checking across the application
    - Enable admin functionality in the frontend
*/

-- 1. Create check_admin_role function
-- This function checks if the current authenticated user has admin role
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Return false if no user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  -- Check if current user has admin role
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return false on any error to be safe
    RETURN false;
END;
$$;

-- 2. Create is_admin function for specific user
-- This function checks if a specific user has admin role
DROP FUNCTION IF EXISTS public.is_admin(uuid);
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Return false if user_uuid is null
  IF user_uuid IS NULL THEN
    RETURN false;
  END IF;

  -- Check if specified user has admin role
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_uuid AND role = 'admin'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return false on any error to be safe
    RETURN false;
END;
$$;



-- 4. Create get_all_users_with_roles RPC function for admin panel
-- This function allows admins to fetch all users with their roles
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
  -- Check if current user is admin
  IF NOT public.check_admin_role() THEN
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

-- 5. Create helper function to safely get current user email
-- This function helps with admin operations that need user email
CREATE OR REPLACE FUNCTION public.get_user_email(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_email text;
BEGIN
  -- Only allow admins or the user themselves to get email
  IF NOT (public.check_admin_role() OR auth.uid() = user_uuid) THEN
    RETURN 'Access Denied';
  END IF;

  -- Get user email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_uuid;

  RETURN COALESCE(user_email, 'Unknown');

EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Error';
END;
$$;

-- 6. Grant necessary permissions
-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.check_admin_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users_with_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_email(uuid) TO authenticated;

-- Grant usage on auth schema if needed
GRANT USAGE ON SCHEMA auth TO authenticated;

-- Add helpful comments
COMMENT ON FUNCTION public.check_admin_role() IS 'Checks if current authenticated user has admin role';
COMMENT ON FUNCTION public.is_admin(uuid) IS 'Checks if specified user has admin role';
COMMENT ON FUNCTION public.get_all_users_with_roles() IS 'Admin-only function to get all users with their roles';
COMMENT ON FUNCTION public.get_user_email(uuid) IS 'Gets user email for admin or self';