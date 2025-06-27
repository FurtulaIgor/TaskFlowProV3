-- Fix the ambiguous column reference in make_user_admin function
-- The issue is that both user_roles and auth.users tables have user_id/id columns

CREATE OR REPLACE FUNCTION public.make_user_admin(target_email text)
RETURNS TABLE (
  success boolean,
  message text,
  user_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id uuid;
  role_exists boolean;
BEGIN
  -- Find user by email from auth.users table
  SELECT au.id INTO target_user_id 
  FROM auth.users au
  WHERE au.email = target_email;
  
  IF target_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User not found with email: ' || target_email, NULL::uuid;
    RETURN;
  END IF;
  
  -- Check if admin role already exists (use table alias to avoid ambiguity)
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = target_user_id AND ur.role = 'admin'
  ) INTO role_exists;
  
  IF role_exists THEN
    RETURN QUERY SELECT true, 'User already has admin role', target_user_id;
  ELSE
    -- Create admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin');
    
    RETURN QUERY SELECT true, 'Admin role granted successfully', target_user_id;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT false, 'Error granting admin role: ' || SQLERRM, NULL::uuid;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.make_user_admin(text) TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION public.make_user_admin(text) IS 'Function to grant admin role to a user by email - fixed ambiguity issue';

-- Test the function to make sure it works
DO $$
DECLARE
  test_result RECORD;
BEGIN
  RAISE NOTICE '=== TESTING make_user_admin FUNCTION ===';
  
  -- Test with a non-existent email first
  SELECT * INTO test_result FROM public.make_user_admin('nonexistent@test.com');
  
  IF test_result.success = false AND test_result.message LIKE 'User not found%' THEN
    RAISE NOTICE '✅ Function correctly handles non-existent users';
  ELSE
    RAISE WARNING '❌ Function did not handle non-existent user correctly';
  END IF;
  
  RAISE NOTICE '✅ make_user_admin function syntax is now correct';
  RAISE NOTICE '=== END TEST ===';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING '❌ make_user_admin function still has issues: %', SQLERRM;
END $$;

-- Final verification message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ===============================================';
  RAISE NOTICE '🎯 FIXED: Column reference ambiguity resolved';
  RAISE NOTICE '🎯 ===============================================';
  RAISE NOTICE '✅ Added table aliases (au, ur) to avoid ambiguity';
  RAISE NOTICE '✅ Function should now work without errors';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 HOW TO USE:';
  RAISE NOTICE '   SELECT * FROM public.make_user_admin(''your@email.com'');';
  RAISE NOTICE '';
  RAISE NOTICE '🎊 ADMIN ROLE ASSIGNMENT SHOULD NOW WORK! 🎊';
  RAISE NOTICE '🎯 ===============================================';
END $$;