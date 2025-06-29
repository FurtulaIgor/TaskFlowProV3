/*
  # Test Migration to Validate Database Setup
  
  1. Purpose
    - Validate that previous migrations have been applied correctly
    - Test that admin role checking functions work properly
    - Verify that RLS policies are functioning as expected
    
  2. Tests
    - Create a simple test function that queries user_roles
    - Test check_admin_role function
    - Test is_user_admin function
    - Add diagnostic view for easier troubleshooting
*/

-- Create a simple test function to validate database access
CREATE OR REPLACE FUNCTION public.test_database_connection()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Simple test query to verify database access
  PERFORM COUNT(*) FROM public.user_roles;
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Database connection test failed: %', SQLERRM;
    RETURN false;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.test_database_connection() TO authenticated;

-- Create a diagnostic view for user roles (with security invoker)
CREATE OR REPLACE VIEW public.user_roles_diagnostic
WITH (security_invoker = on) AS
SELECT 
  ur.id,
  ur.user_id,
  ur.role,
  ur.created_at,
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ) AS current_user_is_admin,
  auth.uid() = ur.user_id AS is_own_role
FROM public.user_roles ur;

-- Grant access to the view
GRANT SELECT ON public.user_roles_diagnostic TO authenticated;

-- Add comment for documentation
COMMENT ON VIEW public.user_roles_diagnostic IS 'Diagnostic view for user roles with security_invoker for proper RLS enforcement';

-- Create a function to test admin role checking
CREATE OR REPLACE FUNCTION public.test_admin_functions()
RETURNS TABLE (
  function_name text,
  result boolean,
  error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_user_id uuid;
  test_result boolean;
  error_text text;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Test database connection
  BEGIN
    test_result := public.test_database_connection();
    RETURN QUERY SELECT 'test_database_connection'::text, test_result, NULL::text;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 'test_database_connection'::text, false, SQLERRM;
  END;
  
  -- Test check_admin_role function
  BEGIN
    test_result := public.check_admin_role();
    RETURN QUERY SELECT 'check_admin_role'::text, test_result, NULL::text;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 'check_admin_role'::text, false, SQLERRM;
  END;
  
  -- Test is_user_admin function
  BEGIN
    test_result := public.is_user_admin(current_user_id);
    RETURN QUERY SELECT 'is_user_admin'::text, test_result, NULL::text;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 'is_user_admin'::text, false, SQLERRM;
  END;
  
  -- Test get_all_users_with_roles function (only attempt if user is admin)
  BEGIN
    IF public.is_user_admin(current_user_id) THEN
      PERFORM * FROM public.get_all_users_with_roles() LIMIT 1;
      RETURN QUERY SELECT 'get_all_users_with_roles'::text, true, NULL::text;
    ELSE
      RETURN QUERY SELECT 'get_all_users_with_roles'::text, false, 'Skipped - user is not admin';
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN QUERY SELECT 'get_all_users_with_roles'::text, false, SQLERRM;
  END;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.test_admin_functions() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.test_admin_functions() IS 'Test function to validate admin role checking functions';

-- Final verification message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ================================================================';
  RAISE NOTICE '🎯 TEST MIGRATION APPLIED SUCCESSFULLY';
  RAISE NOTICE '🎯 ================================================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Created test_database_connection function';
  RAISE NOTICE '✅ Created user_roles_diagnostic view';
  RAISE NOTICE '✅ Created test_admin_functions function';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 HOW TO TEST:';
  RAISE NOTICE '   1. Run: SELECT * FROM public.test_admin_functions();';
  RAISE NOTICE '   2. Check results to verify admin functions are working';
  RAISE NOTICE '   3. If needed, run: SELECT * FROM public.make_user_admin(''your@email.com'');';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ================================================================';
END $$;