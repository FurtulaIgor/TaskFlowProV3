/*
  # Fix search_path for get_clients_with_users function

  1. Security Fix
    - Drop existing get_clients_with_users function
    - Recreate with proper search_path configuration
    - Add SECURITY DEFINER with immutable search_path

  2. Function Updates
    - Fix "Function Search Path Mutable" warning
    - Ensure proper admin-only access
    - Add comprehensive error handling

  3. Security Verification
    - Audit all public functions for search_path
    - Verify admin functions are properly secured
    - Provide detailed security status report
*/

-- 1. Drop the existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.get_clients_with_users();

-- 2. Recreate the function with proper search_path and return type
CREATE OR REPLACE FUNCTION public.get_clients_with_users()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  email text,
  phone text,
  notes text,
  last_interaction timestamptz,
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

  -- Return all clients with user information
  RETURN QUERY
  SELECT 
    c.id,
    c.user_id,
    c.name,
    c.email,
    c.phone,
    c.notes,
    c.last_interaction,
    c.created_at,
    COALESCE(au.email, 'Unknown') as user_email
  FROM public.clients c
  LEFT JOIN auth.users au ON c.user_id = au.id
  ORDER BY c.created_at DESC;

EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error fetching clients with users: %', SQLERRM;
END;
$$;

-- 3. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_clients_with_users() TO authenticated;

-- 4. Add helpful comment
COMMENT ON FUNCTION public.get_clients_with_users() IS 'Admin-only function to get all clients with their user information - secure search_path version';

-- 5. Comprehensive audit of all functions for search_path issues
DO $$
DECLARE
  func_record RECORD;
  functions_without_search_path TEXT := '';
  functions_with_search_path TEXT := '';
  total_functions INTEGER := 0;
  fixed_functions INTEGER := 0;
BEGIN
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
      p.proconfig
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
      functions_without_search_path := functions_without_search_path || func_record.function_name || ' (' || func_record.search_path_status || '), ';
    END IF;
  END LOOP;
  
  -- Log comprehensive results
  RAISE NOTICE '=== FUNCTION SEARCH_PATH AUDIT RESULTS ===';
  RAISE NOTICE 'Total functions in public schema: %', total_functions;
  RAISE NOTICE 'Functions with proper search_path: %', fixed_functions;
  RAISE NOTICE 'Functions still needing fixes: %', (total_functions - fixed_functions);
  
  IF functions_with_search_path != '' THEN
    RAISE NOTICE 'Functions WITH search_path: %', 
      rtrim(functions_with_search_path, ', ');
  END IF;
  
  IF functions_without_search_path != '' THEN
    RAISE WARNING 'Functions WITHOUT search_path (need fixing): %', 
      rtrim(functions_without_search_path, ', ');
  ELSE
    RAISE NOTICE '✅ ALL PUBLIC FUNCTIONS NOW HAVE PROPER SEARCH_PATH CONFIGURATION!';
  END IF;
  
  RAISE NOTICE '=== END AUDIT ===';
END $$;

-- 6. Security audit for admin functions
DO $$
DECLARE
  admin_func_record RECORD;
  admin_functions_status TEXT := '';
  security_issues INTEGER := 0;
BEGIN
  RAISE NOTICE '=== ADMIN FUNCTIONS SECURITY AUDIT ===';
  
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
      OR p.proname IN ('get_all_users_with_roles', 'get_users_with_roles', 'get_clients_with_users')
    )
    ORDER BY p.proname
  LOOP
    -- Count security issues
    IF NOT admin_func_record.prosecdef OR admin_func_record.proconfig IS NULL THEN
      security_issues := security_issues + 1;
    END IF;
    
    admin_functions_status := admin_functions_status || 
      admin_func_record.function_name || ': ' || 
      admin_func_record.security_type || ' | ' || 
      admin_func_record.search_path_status || E'\n';
  END LOOP;
  
  IF admin_functions_status != '' THEN
    RAISE NOTICE 'Admin Functions Security Status:
%', admin_functions_status;
  END IF;
  
  IF security_issues = 0 THEN
    RAISE NOTICE '✅ ALL ADMIN FUNCTIONS ARE PROPERLY SECURED!';
  ELSE
    RAISE WARNING '⚠️  Found % admin functions with security issues', security_issues;
  END IF;
  
  RAISE NOTICE '=== END ADMIN SECURITY AUDIT ===';
END $$;

-- 7. Final verification - check if this specific function is now properly configured
DO $$
DECLARE
  func_config TEXT[];
  has_search_path BOOLEAN := FALSE;
BEGIN
  -- Get the configuration for get_clients_with_users function
  SELECT proconfig INTO func_config
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' 
  AND p.proname = 'get_clients_with_users';
  
  -- Check if search_path is configured
  IF func_config IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM unnest(func_config) AS config 
      WHERE config LIKE 'search_path=%'
    ) INTO has_search_path;
  END IF;
  
  IF has_search_path THEN
    RAISE NOTICE '✅ get_clients_with_users function now has proper search_path configuration';
  ELSE
    RAISE WARNING '❌ get_clients_with_users function still missing search_path';
  END IF;
END $$;