/*
  # Fix search_path issue for get_clients_with_users function

  1. Security Enhancement
    - Add SET search_path = public, pg_temp to get_clients_with_users function
    - This prevents "Function Search Path Mutable" security warning
    - Protects against schema injection attacks

  2. Function Updates
    - Update get_clients_with_users function with secure search_path
    - Maintain existing functionality while improving security
    - Add proper error handling and comments

  3. Verification
    - Check all remaining functions for search_path issues
    - Report any functions that still need fixing
*/

-- Fix search_path issue for get_clients_with_users function
-- This migration addresses the "Function Search Path Mutable" warning

-- Update get_clients_with_users function with explicit search_path
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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_clients_with_users() TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.get_clients_with_users() IS 'Admin-only function to get all clients with their user information - secure search_path version';

-- Comprehensive check for any remaining functions without search_path
-- This will help identify if there are any other functions that need fixing
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

-- Additional security check: Verify that all our admin functions are properly secured
DO $$
DECLARE
  admin_func_record RECORD;
  admin_functions_status TEXT := '';
BEGIN
  RAISE NOTICE '=== ADMIN FUNCTIONS SECURITY CHECK ===';
  
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
      END as search_path_status
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
    admin_functions_status := admin_functions_status || 
      admin_func_record.function_name || ': ' || 
      admin_func_record.security_type || ' | ' || 
      admin_func_record.search_path_status || E'\n';
  END LOOP;
  
  IF admin_functions_status != '' THEN
    RAISE NOTICE 'Admin Functions Security Status:
%', admin_functions_status;
  END IF;
  
  RAISE NOTICE '=== END ADMIN FUNCTIONS CHECK ===';
END $$;