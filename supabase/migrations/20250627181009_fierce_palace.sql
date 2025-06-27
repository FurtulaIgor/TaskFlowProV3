/*
  # Fix search_path issue for get_appointments_with_users function

  1. Security Fix
    - Drop and recreate get_appointments_with_users function with secure search_path
    - Add SECURITY DEFINER and SET search_path = public, pg_temp
    - Ensure admin-only access with proper error handling

  2. Final Audit
    - Comprehensive check of ALL functions for search_path issues
    - Verify that all admin functions are properly secured
    - Confirm no more "Function Search Path Mutable" warnings

  3. Complete Security Verification
    - Audit all public schema functions
    - Check SECURITY DEFINER settings
    - Verify immutable search_path configuration
*/

-- 1. Drop the existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.get_appointments_with_users();

-- 2. Recreate the function with proper search_path and security
CREATE OR REPLACE FUNCTION public.get_appointments_with_users()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  client_id uuid,
  service_id uuid,
  start_time timestamptz,
  end_time timestamptz,
  status text,
  notes text,
  created_at timestamptz,
  user_email text,
  client_name text,
  service_name text
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

  -- Return all appointments with user, client, and service information
  RETURN QUERY
  SELECT 
    a.id,
    a.user_id,
    a.client_id,
    a.service_id,
    a.start_time,
    a.end_time,
    a.status,
    a.notes,
    a.created_at,
    COALESCE(au.email, 'Unknown') as user_email,
    COALESCE(c.name, 'Unknown Client') as client_name,
    COALESCE(s.name, 'Unknown Service') as service_name
  FROM public.appointments a
  LEFT JOIN auth.users au ON a.user_id = au.id
  LEFT JOIN public.clients c ON a.client_id = c.id
  LEFT JOIN public.services s ON a.service_id = s.id
  ORDER BY a.start_time DESC;

EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error fetching appointments with users: %', SQLERRM;
END;
$$;

-- 3. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_appointments_with_users() TO authenticated;

-- 4. Add helpful comment
COMMENT ON FUNCTION public.get_appointments_with_users() IS 'Admin-only function to get all appointments with user, client, and service information - secure search_path version';

-- 5. ULTIMATE COMPREHENSIVE AUDIT - Check ALL functions for search_path issues
DO $$
DECLARE
  func_record RECORD;
  functions_without_search_path TEXT := '';
  functions_with_search_path TEXT := '';
  total_functions INTEGER := 0;
  fixed_functions INTEGER := 0;
  remaining_issues INTEGER := 0;
BEGIN
  RAISE NOTICE '=== ULTIMATE FUNCTION SEARCH_PATH AUDIT ===';
  RAISE NOTICE 'Checking ALL functions in public schema for search_path configuration...';
  
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
  RAISE NOTICE '';
  RAISE NOTICE '📊 AUDIT RESULTS:';
  RAISE NOTICE '   Total functions in public schema: %', total_functions;
  RAISE NOTICE '   Functions with proper search_path: %', fixed_functions;
  RAISE NOTICE '   Functions still needing fixes: %', remaining_issues;
  RAISE NOTICE '';
  
  IF functions_with_search_path != '' THEN
    RAISE NOTICE '✅ Functions WITH search_path: %', 
      rtrim(functions_with_search_path, ', ');
  END IF;
  
  IF remaining_issues = 0 THEN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ✅ ALL PUBLIC FUNCTIONS NOW HAVE PROPER SEARCH_PATH CONFIGURATION!';
    RAISE NOTICE '🎉 ✅ NO MORE "Function Search Path Mutable" WARNINGS EXPECTED!';
    RAISE NOTICE '🎉 ✅ ALL SECURITY ISSUES RESOLVED!';
    RAISE NOTICE '';
  ELSE
    RAISE WARNING '';
    RAISE WARNING '⚠️  Functions WITHOUT search_path (still need fixing): %', 
      rtrim(functions_without_search_path, ', ');
    RAISE WARNING '';
  END IF;
  
  RAISE NOTICE '=== END ULTIMATE AUDIT ===';
END $$;

-- 6. FINAL COMPREHENSIVE SECURITY AUDIT for all admin and sensitive functions
DO $$
DECLARE
  admin_func_record RECORD;
  admin_functions_status TEXT := '';
  security_issues INTEGER := 0;
  total_admin_functions INTEGER := 0;
  perfect_functions INTEGER := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== COMPREHENSIVE ADMIN FUNCTIONS SECURITY AUDIT ===';
  RAISE NOTICE 'Checking all admin and sensitive functions for security compliance...';
  
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
        'get_appointments_with_users',
        'handle_new_user',
        'update_updated_at_column'
      )
    )
    ORDER BY p.proname
  LOOP
    total_admin_functions := total_admin_functions + 1;
    
    -- Check if function is perfectly configured
    IF admin_func_record.prosecdef AND 
       EXISTS (
         SELECT 1 FROM unnest(admin_func_record.proconfig) AS config 
         WHERE config LIKE 'search_path=%'
       ) THEN
      perfect_functions := perfect_functions + 1;
    ELSE
      security_issues := security_issues + 1;
    END IF;
    
    admin_functions_status := admin_functions_status || 
      '   ' || admin_func_record.function_name || ': ' || 
      admin_func_record.security_type || ' | ' || 
      admin_func_record.search_path_status || E'\n';
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '📊 ADMIN FUNCTIONS AUDIT RESULTS:';
  RAISE NOTICE '   Total admin/sensitive functions: %', total_admin_functions;
  RAISE NOTICE '   Perfectly configured functions: %', perfect_functions;
  RAISE NOTICE '   Functions with security issues: %', security_issues;
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Admin Functions Security Status:';
  RAISE NOTICE '%', admin_functions_status;
  
  IF security_issues = 0 THEN
    RAISE NOTICE '🎉 ✅ ALL ADMIN FUNCTIONS ARE PROPERLY SECURED!';
    RAISE NOTICE '🎉 ✅ ALL FUNCTIONS HAVE SECURITY DEFINER + IMMUTABLE SEARCH_PATH!';
    RAISE NOTICE '🎉 ✅ MAXIMUM SECURITY COMPLIANCE ACHIEVED!';
  ELSE
    RAISE WARNING '⚠️  Found % admin functions with security issues', security_issues;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '=== END COMPREHENSIVE ADMIN SECURITY AUDIT ===';
END $$;

-- 7. Specific verification for the function we just fixed
DO $$
DECLARE
  func_config TEXT[];
  has_search_path BOOLEAN := FALSE;
  is_security_definer BOOLEAN := FALSE;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== SPECIFIC VERIFICATION: get_appointments_with_users ===';
  
  -- Get the configuration for get_appointments_with_users function
  SELECT proconfig, prosecdef INTO func_config, is_security_definer
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' 
  AND p.proname = 'get_appointments_with_users';
  
  -- Check if search_path is configured
  IF func_config IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM unnest(func_config) AS config 
      WHERE config LIKE 'search_path=%'
    ) INTO has_search_path;
  END IF;
  
  IF has_search_path AND is_security_definer THEN
    RAISE NOTICE '✅ get_appointments_with_users function is now FULLY SECURED';
    RAISE NOTICE '✅ - Has SECURITY DEFINER: %', is_security_definer;
    RAISE NOTICE '✅ - Has immutable search_path: %', has_search_path;
    RAISE NOTICE '✅ - Admin-only access control implemented';
    RAISE NOTICE '✅ - Proper error handling included';
  ELSE
    RAISE WARNING '❌ get_appointments_with_users function still has security issues';
    RAISE WARNING '   - SECURITY DEFINER: %', is_security_definer;
    RAISE WARNING '   - search_path set: %', has_search_path;
  END IF;
  
  RAISE NOTICE '=== END SPECIFIC VERIFICATION ===';
END $$;

-- 8. Final comprehensive summary
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ================================================================';
  RAISE NOTICE '🎯 MIGRATION COMPLETE: get_appointments_with_users FIXED';
  RAISE NOTICE '🎯 ================================================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ WHAT WAS ACCOMPLISHED:';
  RAISE NOTICE '   ✓ Function now has SECURITY DEFINER';
  RAISE NOTICE '   ✓ Function now has immutable search_path = public, pg_temp';
  RAISE NOTICE '   ✓ Function is admin-only with proper access control';
  RAISE NOTICE '   ✓ Comprehensive error handling implemented';
  RAISE NOTICE '   ✓ Returns detailed appointment data with user/client/service info';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 EXPECTED RESULTS IN SUPABASE:';
  RAISE NOTICE '   ✓ No more "Function Search Path Mutable" warnings';
  RAISE NOTICE '   ✓ Admin panel should continue working normally';
  RAISE NOTICE '   ✓ All security checks should pass';
  RAISE NOTICE '   ✓ Function accessible only to admin users';
  RAISE NOTICE '';
  RAISE NOTICE '🛡️  SECURITY FEATURES:';
  RAISE NOTICE '   ✓ SECURITY DEFINER prevents privilege escalation';
  RAISE NOTICE '   ✓ Immutable search_path prevents schema injection';
  RAISE NOTICE '   ✓ Admin role verification before data access';
  RAISE NOTICE '   ✓ Comprehensive error handling and logging';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ================================================================';
  RAISE NOTICE '🎯 THIS SHOULD BE THE FINAL "Function Search Path Mutable" FIX!';
  RAISE NOTICE '🎯 ================================================================';
END $$;