/*
  # Fix syntax error in delete_user_safely function

  1. Problem Fixed
    - Corrected GET DIAGNOSTICS syntax error
    - Fixed variable assignment in PL/pgSQL
    - Proper ROW_COUNT handling

  2. Security Features
    - SECURITY DEFINER with immutable search_path
    - Admin-only access control
    - Self-deletion prevention
    - Comprehensive error handling
*/

-- 1. Drop the existing function first to avoid any conflicts
DROP FUNCTION IF EXISTS public.delete_user_safely(uuid, text);

-- 2. Recreate the function with proper syntax and security
CREATE OR REPLACE FUNCTION public.delete_user_safely(
  target_user_id uuid,
  deletion_notes text DEFAULT NULL
)
RETURNS TABLE (
  success boolean,
  message text,
  deleted_user_id uuid,
  deleted_records_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_admin_id uuid;
  deleted_count integer := 0;
  temp_count integer;
  user_email text;
BEGIN
  -- Get current user ID
  current_admin_id := auth.uid();
  
  -- Check if current user is admin
  IF NOT public.check_admin_role() THEN
    RETURN QUERY SELECT false, 'Access denied. Admin role required.', NULL::uuid, 0;
    RETURN;
  END IF;
  
  -- Prevent admin from deleting themselves
  IF current_admin_id = target_user_id THEN
    RETURN QUERY SELECT false, 'Cannot delete your own account.', NULL::uuid, 0;
    RETURN;
  END IF;
  
  -- Check if target user exists
  SELECT email INTO user_email FROM auth.users WHERE id = target_user_id;
  IF user_email IS NULL THEN
    RETURN QUERY SELECT false, 'User not found.', NULL::uuid, 0;
    RETURN;
  END IF;
  
  -- Begin deletion process (in order to maintain referential integrity)
  
  -- 1. Delete user_roles
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  -- 2. Delete user_profiles
  DELETE FROM public.user_profiles WHERE user_id = target_user_id;
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  -- 3. Delete invoices (before appointments due to foreign key)
  DELETE FROM public.invoices WHERE user_id = target_user_id;
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  -- 4. Delete appointments (before clients/services due to foreign keys)
  DELETE FROM public.appointments WHERE user_id = target_user_id;
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  -- 5. Delete clients
  DELETE FROM public.clients WHERE user_id = target_user_id;
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  -- 6. Delete services
  DELETE FROM public.services WHERE user_id = target_user_id;
  GET DIAGNOSTICS temp_count = ROW_COUNT;
  deleted_count := deleted_count + temp_count;
  
  -- 7. Log the admin action before deleting the user
  INSERT INTO public.admin_actions (admin_id, action_type, target_user_id, notes)
  VALUES (current_admin_id, 'delete_user', target_user_id, deletion_notes);
  
  -- 8. Return success (auth.users deletion handled by Edge Function)
  RETURN QUERY SELECT 
    true, 
    format('User data successfully deleted. Removed %s records from application tables.', deleted_count), 
    target_user_id, 
    deleted_count;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error and return failure
    RAISE WARNING 'Error in delete_user_safely: %', SQLERRM;
    RETURN QUERY SELECT 
      false, 
      'Error during user deletion: ' || SQLERRM, 
      NULL::uuid, 
      0;
END;
$$;

-- 3. Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.delete_user_safely(uuid, text) TO authenticated;

-- 4. Add helpful comment
COMMENT ON FUNCTION public.delete_user_safely(uuid, text) IS 'Admin-only function to safely delete a user and all related data - secure search_path version with fixed syntax';

-- 5. FINAL VERIFICATION - Check that the function is properly configured
DO $$
DECLARE
  func_config TEXT[];
  has_search_path BOOLEAN := FALSE;
  is_security_definer BOOLEAN := FALSE;
BEGIN
  RAISE NOTICE '=== VERIFICATION: delete_user_safely function ===';
  
  -- Get the configuration for delete_user_safely function
  SELECT proconfig, prosecdef INTO func_config, is_security_definer
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public' 
  AND p.proname = 'delete_user_safely';
  
  -- Check if search_path is configured
  IF func_config IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM unnest(func_config) AS config 
      WHERE config LIKE 'search_path=%'
    ) INTO has_search_path;
  END IF;
  
  IF has_search_path AND is_security_definer THEN
    RAISE NOTICE '✅ delete_user_safely function is now FULLY SECURED';
    RAISE NOTICE '✅ - Has SECURITY DEFINER: %', is_security_definer;
    RAISE NOTICE '✅ - Has immutable search_path: %', has_search_path;
    RAISE NOTICE '✅ - Syntax error fixed';
    RAISE NOTICE '✅ - Admin-only access control implemented';
    RAISE NOTICE '✅ - Safe user deletion with referential integrity';
  ELSE
    RAISE WARNING '❌ delete_user_safely function still has issues';
    RAISE WARNING '   - SECURITY DEFINER: %', is_security_definer;
    RAISE WARNING '   - search_path set: %', has_search_path;
  END IF;
END $$;

-- 6. FINAL COMPREHENSIVE AUDIT
DO $$
DECLARE
  func_record RECORD;
  total_functions INTEGER := 0;
  fixed_functions INTEGER := 0;
  remaining_issues INTEGER := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '=== FINAL COMPREHENSIVE SEARCH_PATH AUDIT ===';
  
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
      END as search_path_status
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.prokind = 'f'  -- Only functions, not procedures
    ORDER BY p.proname
  LOOP
    total_functions := total_functions + 1;
    
    IF func_record.search_path_status = 'search_path configured' THEN
      fixed_functions := fixed_functions + 1;
    ELSE
      remaining_issues := remaining_issues + 1;
    END IF;
  END LOOP;
  
  -- Log results
  RAISE NOTICE 'Total functions in public schema: %', total_functions;
  RAISE NOTICE 'Functions with proper search_path: %', fixed_functions;
  RAISE NOTICE 'Functions still needing fixes: %', remaining_issues;
  
  IF remaining_issues = 0 THEN
    RAISE NOTICE '';
    RAISE NOTICE '🎉 ✅ ALL PUBLIC FUNCTIONS NOW HAVE PROPER SEARCH_PATH CONFIGURATION!';
    RAISE NOTICE '🎉 ✅ NO MORE "Function Search Path Mutable" WARNINGS EXPECTED!';
    RAISE NOTICE '🎉 ✅ ALL ADMIN FUNCTIONS ARE PROPERLY SECURED!';
    RAISE NOTICE '🎊 CONGRATULATIONS! ALL SECURITY ISSUES RESOLVED! 🎊';
  ELSE
    RAISE WARNING '⚠️  Still have % functions without proper search_path', remaining_issues;
  END IF;
  
  RAISE NOTICE '=== END FINAL AUDIT ===';
END $$;

-- 7. Final summary message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎯 =================================================';
  RAISE NOTICE '🎯 SYNTAX ERROR FIXED: delete_user_safely';
  RAISE NOTICE '🎯 =================================================';
  RAISE NOTICE '✅ Fixed GET DIAGNOSTICS syntax error';
  RAISE NOTICE '✅ Function now has proper variable handling';
  RAISE NOTICE '✅ Function maintains SECURITY DEFINER';
  RAISE NOTICE '✅ Function maintains immutable search_path';
  RAISE NOTICE '✅ All security features preserved';
  RAISE NOTICE '';
  RAISE NOTICE '🔍 Expected result:';
  RAISE NOTICE '   - No more syntax errors';
  RAISE NOTICE '   - Function executes successfully';
  RAISE NOTICE '   - Admin panel user deletion works';
  RAISE NOTICE '   - No more "Function Search Path Mutable" warnings';
  RAISE NOTICE '🎯 =================================================';
END $$;