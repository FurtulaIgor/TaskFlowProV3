-- Drop the existing function if it exists (to avoid conflicts)
DROP FUNCTION IF EXISTS public.test_admin_functions();

-- Recreate the function with proper error handling
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
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'check_admin_role'
  ) THEN
    BEGIN
      test_result := public.check_admin_role();
      RETURN QUERY SELECT 'check_admin_role'::text, test_result, NULL::text;
    EXCEPTION
      WHEN OTHERS THEN
        RETURN QUERY SELECT 'check_admin_role'::text, false, SQLERRM;
    END;
  ELSE
    RETURN QUERY SELECT 'check_admin_role'::text, false, 'Function does not exist';
  END IF;
  
  -- Test is_user_admin function
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'is_user_admin'
  ) THEN
    BEGIN
      test_result := public.is_user_admin(current_user_id);
      RETURN QUERY SELECT 'is_user_admin'::text, test_result, NULL::text;
    EXCEPTION
      WHEN OTHERS THEN
        RETURN QUERY SELECT 'is_user_admin'::text, false, SQLERRM;
    END;
  ELSE
    RETURN QUERY SELECT 'is_user_admin'::text, false, 'Function does not exist';
  END IF;
  
  -- Test get_all_users_with_roles function
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'get_all_users_with_roles'
  ) THEN
    BEGIN
      -- Only attempt if user is admin
      IF current_user_id IS NOT NULL AND (
        SELECT EXISTS (
          SELECT 1 FROM public.user_roles 
          WHERE user_id = current_user_id AND role = 'admin'
        )
      ) THEN
        -- Just check if the function runs without error
        PERFORM * FROM public.get_all_users_with_roles() LIMIT 1;
        RETURN QUERY SELECT 'get_all_users_with_roles'::text, true, NULL::text;
      ELSE
        RETURN QUERY SELECT 'get_all_users_with_roles'::text, false, 'Skipped - user is not admin';
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        RETURN QUERY SELECT 'get_all_users_with_roles'::text, false, SQLERRM;
    END;
  ELSE
    RETURN QUERY SELECT 'get_all_users_with_roles'::text, false, 'Function does not exist';
  END IF;
  
  -- Test make_user_admin function
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'make_user_admin'
  ) THEN
    BEGIN
      -- Don't actually execute, just check if it exists
      RETURN QUERY SELECT 'make_user_admin'::text, true, 'Function exists but not executed';
    EXCEPTION
      WHEN OTHERS THEN
        RETURN QUERY SELECT 'make_user_admin'::text, false, SQLERRM;
    END;
  ELSE
    RETURN QUERY SELECT 'make_user_admin'::text, false, 'Function does not exist';
  END IF;
  
  -- Test RLS policies on user_roles
  RETURN QUERY SELECT 
    'user_roles_rls_policies'::text, 
    EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'user_roles' AND schemaname = 'public'
    ),
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' AND schemaname = 'public'
      ) THEN 
        (SELECT COUNT(*)::text FROM pg_policies WHERE tablename = 'user_roles' AND schemaname = 'public') || ' policies found'
      ELSE 
        'No policies found'
    END;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.test_admin_functions() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.test_admin_functions() IS 'Test function to validate admin role checking functions';

-- Create a simpler test function that doesn't depend on other functions
CREATE OR REPLACE FUNCTION public.simple_db_test()
RETURNS TABLE (
  test_name text,
  result text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_user_id uuid;
  user_count integer;
  role_count integer;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Return current user info
  RETURN QUERY SELECT 
    'current_user'::text, 
    CASE WHEN current_user_id IS NULL THEN 'Not authenticated' 
         ELSE current_user_id::text END;
  
  -- Count users in auth.users
  SELECT COUNT(*) INTO user_count FROM auth.users;
  RETURN QUERY SELECT 'auth_users_count'::text, user_count::text;
  
  -- Count roles in user_roles
  SELECT COUNT(*) INTO role_count FROM public.user_roles;
  RETURN QUERY SELECT 'user_roles_count'::text, role_count::text;
  
  -- Check if current user has any roles
  IF current_user_id IS NOT NULL THEN
    RETURN QUERY SELECT 
      'current_user_roles'::text, 
      (SELECT string_agg(role, ', ') FROM public.user_roles WHERE user_id = current_user_id);
  ELSE
    RETURN QUERY SELECT 'current_user_roles'::text, 'Not authenticated';
  END IF;
  
  -- Check if RLS is enabled on user_roles
  RETURN QUERY SELECT 
    'user_roles_rls_enabled'::text, 
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'user_roles' AND rowsecurity = true
      ) THEN 'Yes' 
      ELSE 'No' 
    END;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.simple_db_test() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.simple_db_test() IS 'Simple database test function that does not depend on other functions';

-- Final verification message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ================================================================';
  RAISE NOTICE '🎯 TEST FUNCTIONS FIXED';
  RAISE NOTICE '🎯 ================================================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Fixed test_admin_functions function';
  RAISE NOTICE '✅ Added simple_db_test function';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 HOW TO TEST:';
  RAISE NOTICE '   1. Run: SELECT * FROM public.simple_db_test();';
  RAISE NOTICE '   2. If that works, try: SELECT * FROM public.test_admin_functions();';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ================================================================';
END $$;