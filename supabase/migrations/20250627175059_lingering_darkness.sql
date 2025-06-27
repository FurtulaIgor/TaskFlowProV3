/*
  # Fix Function Search Path Issues

  1. Security Fixes
    - Fix `update_updated_at_column` function to have immutable search_path
    - Ensure all functions have proper security settings
    - Add explicit schema references where needed

  2. Function Updates
    - Update trigger function with secure search_path
    - Add proper error handling
    - Ensure consistent behavior across schema changes
*/

-- Fix the update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Update the updated_at column to current timestamp
  NEW.updated_at = now();
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and return NEW to prevent transaction failure
    RAISE WARNING 'Error in update_updated_at_column trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Add comment explaining the function
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Trigger function to automatically update updated_at column with secure search_path';

-- Verify that the trigger is properly attached to user_profiles table
-- (This should already exist, but we ensure it's correct)
DO $$
BEGIN
  -- Check if trigger exists and recreate if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_user_profiles_updated_at'
    AND event_object_table = 'user_profiles'
  ) THEN
    -- Drop and recreate trigger to ensure it uses the updated function
    DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
  END IF;
  
  -- Create the trigger
  CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
END $$;

-- Also fix any other functions that might have search_path issues
-- Update check_admin_role function to have explicit search_path
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
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

-- Update is_admin function with explicit search_path
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
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

-- Update get_all_users_with_roles function with explicit search_path
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

-- Update get_user_email function with explicit search_path
CREATE OR REPLACE FUNCTION public.get_user_email(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
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

-- Update debug functions with explicit search_path
CREATE OR REPLACE FUNCTION public.debug_current_user_roles()
RETURNS TABLE (
  current_user_id uuid,
  user_email text,
  role_count bigint,
  roles text[],
  is_admin_check boolean,
  check_admin_role_result boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_uid uuid;
  current_email text;
BEGIN
  -- Get current user ID
  current_uid := auth.uid();
  
  -- Get current user email
  SELECT email INTO current_email FROM auth.users WHERE id = current_uid;
  
  -- Return debug information
  RETURN QUERY
  SELECT 
    current_uid as current_user_id,
    COALESCE(current_email, 'No email found') as user_email,
    (SELECT COUNT(*) FROM public.user_roles WHERE user_id = current_uid) as role_count,
    (SELECT ARRAY_AGG(role) FROM public.user_roles WHERE user_id = current_uid) as roles,
    (SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = current_uid AND role = 'admin')) as is_admin_check,
    public.check_admin_role() as check_admin_role_result;
END;
$$;

CREATE OR REPLACE FUNCTION public.debug_all_user_roles()
RETURNS TABLE (
  user_id uuid,
  user_email text,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ur.user_id,
    COALESCE(au.email, 'Unknown') as user_email,
    ur.role,
    ur.created_at
  FROM public.user_roles ur
  LEFT JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_admin_role(target_email text)
RETURNS TABLE (
  success boolean,
  message text,
  user_id uuid,
  role_created boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id uuid;
  role_exists boolean;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User not found with email: ' || target_email, NULL::uuid, false;
    RETURN;
  END IF;
  
  -- Check if admin role already exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles 
    WHERE user_id = target_user_id AND role = 'admin'
  ) INTO role_exists;
  
  IF role_exists THEN
    RETURN QUERY SELECT true, 'Admin role already exists', target_user_id, false;
  ELSE
    -- Create admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin');
    
    RETURN QUERY SELECT true, 'Admin role created successfully', target_user_id, true;
  END IF;
END;
$$;

-- Add comments to all updated functions
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Secure trigger function with immutable search_path';
COMMENT ON FUNCTION public.check_admin_role() IS 'Secure admin role check with immutable search_path';
COMMENT ON FUNCTION public.is_admin(uuid) IS 'Secure user admin check with immutable search_path';
COMMENT ON FUNCTION public.get_all_users_with_roles() IS 'Secure admin function with immutable search_path';
COMMENT ON FUNCTION public.get_user_email(uuid) IS 'Secure email getter with immutable search_path';