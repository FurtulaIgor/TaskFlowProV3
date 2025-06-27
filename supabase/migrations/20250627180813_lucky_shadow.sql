/*
  # Fix search_path issue for get_services_with_users function

  1. Security Fix
    - Drop and recreate get_services_with_users function with proper search_path
    - Add SECURITY DEFINER and SET search_path = public, pg_temp
    - Ensure admin-only access with proper error handling

  2. Comprehensive Audit
    - Final check of all public functions for search_path issues
    - Verify all admin functions are properly secured
    - Confirm no remaining "Function Search Path Mutable" warnings

  3. Security Verification
    - Validate that all functions have immutable search_path
    - Check that admin functions use SECURITY DEFINER
    - Ensure proper access control for sensitive operations
*/

-- 1. Drop the existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.get_services_with_users();

-- 2. Recreate the function with proper search_path and security
CREATE OR REPLACE FUNCTION public.get_services_with_users()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  description text,
  duration integer,
  price numeric,
  created_at timestamptz,
  user_email text
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

  -- Return all services with user information
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.name,
    s.description,
    s.duration,
    s.price,
    s.created_at,
    COALESCE(au.email, 'Unknown') as user_email
  FROM public.services s
  LEFT JOIN auth.users au ON s.user_id = au.id
  ORDER BY s.created_at DESC;

EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error fetching services with users: %', SQLERRM;
END;
$$;

-- 3. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_services_with_users() TO authenticated;

-- 4. Add helpful comment
COMMENT ON FUNCTION public.get_services_with_users() IS 'Admin-only function to get all services with their user information - secure search_path version';

-- 5. FINAL COMPREHENSIVE AUDIT - Check ALL functions for search_path issues
DO $$
DECLARE
  func_record RECORD;
  functions_without_search_path TEXT := '';
  functions_with_search_path TEXT := '';
  total_functions INTEGER := 0;
  fixed_functions INTEGER := 0;
  remaining_issues INTEGER := 0;
BEGIN
  RAISE NOTICE '=== FINAL FUNCTION SEARCH_PATH AUDIT ===';
  
  -- Check all functions in public schema
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
      END as search_path_status,
      p.proconfig,
      p.prosecdef as is_security_definer
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.prokind = 'f'  -- Only functions, not procedures
    ORDER BY p.proname
  LOOP
    total_functions := total_functions + 1;
    
    IF func_record.search_path_status = 'search_path configured' THEN
      fixed_functions := fixed_functions + 1;
      functions_with_search_path := functions_with_search_path || func_record.function_name || ', ';
    ELSE
      remaining_issues := remaining_issues + 1;
      functions_without_search_path := functions_without_search_path || func_record.function_name || ' (' || func_record.search_path_status || '), ';
    END IF;
  END LOOP;
  
  -- Log comprehensive results
  RAISE NOTICE 'Total functions in public schema: %', total_functions;
  RAISE NOTICE 'Functions with proper search_path: %', fixed_functions;
  RAISE NOTICE 'Functions still needing fixes: %', remaining_issues;
  
  IF functions_with_search_path != '' THEN
    RAISE NOTICE 'Functions WITH search_path: %', 
      rtrim(functions_with_search_path, ', ');
  END IF;
  
  IF remaining_issues = 0 THEN
    RAISE NOTICE '🎉 ✅ ALL PUBLIC FUNCTIONS NOW HAVE PROPER SEARCH_PATH CONFIGURATION!';
    RAISE NOTICE '🎉 ✅ NO MORE "Function Search Path Mutable" WARNINGS EXPECTED!';
  ELSE
    RAISE WARNING '⚠️  Functions WITHOUT search_path (need fixing): %', 
      rtrim(functions_without_search_path, ', ');
  END IF;
  
  RAISE NOTICE '=== END FINAL AUDIT ===';
END $$;

-- 6. FINAL SECURITY AUDIT for all admin and sensitive functions
DO $$
DECLARE
  admin_func_record RECORD;
  admin_functions_status TEXT := '';
  security_issues INTEGER := 0;
  total_admin_functions INTEGER := 0;
BEGIN
  RAISE NOTICE '=== FINAL ADMIN FUNCTIONS SECURITY AUDIT ===';
  
  FOR admin_func_record IN
    SELECT 
      p.proname as function_name,
      CASE 
        WHEN p.prosecdef THEN 'SECURITY DEFINER ✅'
        ELSE 'SECURITY INVOKER ⚠️'
      END as security_type,
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM unnest(p.proconfig) AS config 
          WHERE config LIKE 'search_path=%'
        ) THEN 'search_path set ✅'
        ELSE 'search_path missing ❌'
      END as search_path_status,
      p.prosecdef,
      p.proconfig
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.prokind = 'f'
    AND (
      p.proname LIKE '%admin%' 
      OR p.proname LIKE '%user%role%'
      OR p.proname LIKE '%check%admin%'
      OR p.proname IN (
        'get_all_users_with_roles', 
        'get_users_with_roles', 
        'get_clients_with_users',
        'get_services_with_users',
        'handle_new_user',
        'update_updated_at_column'
      )
    )
    ORDER BY p.proname
  LOOP
    total_admin_functions := total_admin_functions + 1;
    
    -- Count security issues
    IF NOT admin_func_record.prosecdef OR 
       NOT EXISTS (
         SELECT 1 FROM unnest(admin_func_record.proconfig) AS config 
         WHERE config LIKE 'search_path=%'
       ) THEN
      security_issues := security_issues + 1;
    END IF;
    
    admin_functions_status := admin_functions_status || 
      admin_func_record.function_name || ': ' || 
      admin_func_record.security_type || ' | ' || 
      admin_func_record.search_path_status || E'\n';
  END LOOP;
  
  RAISE NOTICE 'Total admin/sensitive functions: %', total_admin_functions;
  RAISE NOTICE 'Admin Functions Security Status:
%', admin_functions_status;
  
  IF security_issues = 0 THEN
    RAISE NOTICE '🎉 ✅ ALL ADMIN FUNCTIONS ARE PROPERLY SECURED!';
    RAISE NOTICE '🎉 ✅ ALL FUNCTIONS HAVE SECURITY DEFINER + IMMUTABLE SEARCH_PATH!';
  ELSE
    RAISE WARNING '⚠️  Found % admin functions with security issues', security_issues;
  END IF;
  
  RAISE NOTICE '=== END FINAL ADMIN SECURITY AUDIT ===';
END $$;

-- 7. Specific verification for the function we just fixed
DO $$
DECLARE
  func_config TEXT[];
  has_search_path BOOLEAN := FALSE;
  is_security_definer BOOLEAN := FALSE;
BEGIN
  -- Get the configuration for get_services_with_users function
  SELECT proconfig, prosecdef INTO func_config, is_security_definer
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' 
  AND p.proname = 'get_services_with_users';
  
  -- Check if search_path is configured
  IF func_config IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM unnest(func_config) AS config 
      WHERE config LIKE 'search_path=%'
    ) INTO has_search_path;
  END IF;
  
  IF has_search_path AND is_security_definer THEN
    RAISE NOTICE '✅ get_services_with_users function is now FULLY SECURED';
    RAISE NOTICE '✅ - Has SECURITY DEFINER: %', is_security_definer;
    RAISE NOTICE '✅ - Has immutable search_path: %', has_search_path;
  ELSE
    RAISE WARNING '❌ get_services_with_users function still has security issues';
    RAISE WARNING '   - SECURITY DEFINER: %', is_security_definer;
    RAISE WARNING '   - search_path set: %', has_search_path;
  END IF;
END $$;

-- 8. Final summary message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎯 =================================================';
  RAISE NOTICE '🎯 MIGRATION COMPLETE: get_services_with_users FIXED';
  RAISE NOTICE '🎯 =================================================';
  RAISE NOTICE '✅ Function now has SECURITY DEFINER';
  RAISE NOTICE '✅ Function now has immutable search_path';
  RAISE NOTICE '✅ Function is admin-only with proper access control';
  RAISE NOTICE '✅ This should resolve the "Function Search Path Mutable" warning';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Expected result in Supabase:';
  RAISE NOTICE '   - No more warnings for get_services_with_users';
  RAISE NOTICE '   - Admin panel should continue working normally';
  RAISE NOTICE '   - All security checks should pass';
  RAISE NOTICE '🎯 =================================================';
END $$;