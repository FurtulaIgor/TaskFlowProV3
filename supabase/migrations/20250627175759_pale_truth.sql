-- Fix search_path issue for get_users_with_roles function
-- This migration addresses the "Function Search Path Mutable" warning for public.get_users_with_roles

-- Update get_users_with_roles function with explicit search_path
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

-- Also ensure any other similar functions have proper search_path
-- Check if there are any other functions that might need fixing

-- Update handle_new_user function if it exists (common trigger function)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
  ) THEN
    -- Update handle_new_user function with secure search_path
    EXECUTE '
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, pg_temp
    AS $func$
    BEGIN
      -- Insert default user role for new users
      INSERT INTO public.user_roles (user_id, role)
      VALUES (NEW.id, ''user'')
      ON CONFLICT (user_id, role) DO NOTHING;
      
      RETURN NEW;
    EXCEPTION
      WHEN OTHERS THEN
        -- Log error but don''t fail the user creation
        RAISE WARNING ''Error in handle_new_user trigger: %'', SQLERRM;
        RETURN NEW;
    END;
    $func$;
    ';
  END IF;
END $$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_users_with_roles() TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.get_users_with_roles() IS 'Admin-only function to get all users with their roles - secure search_path version';

-- Verify all functions now have proper search_path
-- This query can be used to check which functions still need fixing
DO $$
DECLARE
  func_record RECORD;
  functions_without_search_path TEXT := '';
BEGIN
  -- Check for functions in public schema without search_path
  FOR func_record IN
    SELECT 
      p.proname as function_name,
      CASE 
        WHEN p.proconfig IS NULL THEN 'No search_path set'
        WHEN NOT EXISTS (
          SELECT 1 FROM unnest(p.proconfig) AS config 
          WHERE config LIKE 'search_path=%'
        ) THEN 'No search_path in config'
        ELSE 'search_path configured'
      END as search_path_status
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.prokind = 'f'  -- Only functions, not procedures
    AND (
      p.proconfig IS NULL 
      OR NOT EXISTS (
        SELECT 1 FROM unnest(p.proconfig) AS config 
        WHERE config LIKE 'search_path=%'
      )
    )
  LOOP
    functions_without_search_path := functions_without_search_path || func_record.function_name || ', ';
  END LOOP;
  
  -- Log results
  IF functions_without_search_path != '' THEN
    RAISE NOTICE 'Functions that may still need search_path fixes: %', 
      rtrim(functions_without_search_path, ', ');
  ELSE
    RAISE NOTICE 'All public functions now have proper search_path configuration';
  END IF;
END $$;