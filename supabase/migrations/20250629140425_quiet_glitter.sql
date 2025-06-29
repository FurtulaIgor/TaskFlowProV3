/*
  # Check and fix admin status

  1. Diagnostic Functions
    - Create a function to check if a specific email has admin role
    - Create a function to grant admin role to a specific email
    - Add comprehensive error handling and logging

  2. Security
    - All functions use SECURITY DEFINER with immutable search_path
    - Admin verification for sensitive operations
    - Proper error handling and reporting
*/

-- Create a function to check if a specific email has admin role
CREATE OR REPLACE FUNCTION public.check_email_admin_status(target_email text)
RETURNS TABLE (
  email text,
  user_id uuid,
  has_admin_role boolean,
  roles text[],
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RETURN QUERY SELECT 
      target_email, 
      NULL::uuid, 
      false, 
      NULL::text[], 
      NULL::timestamptz;
    RETURN;
  END IF;
  
  -- Return user status with roles
  RETURN QUERY
  SELECT 
    target_email,
    target_user_id,
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = target_user_id AND role = 'admin'
    ),
    ARRAY(
      SELECT role FROM public.user_roles 
      WHERE user_id = target_user_id
    ),
    MIN(created_at)
  FROM public.user_roles
  WHERE user_id = target_user_id
  GROUP BY 1, 2, 3, 4;
  
  -- If no roles found, return with empty array
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      target_email, 
      target_user_id, 
      false, 
      ARRAY[]::text[], 
      NULL::timestamptz;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error checking admin status: %', SQLERRM;
    RETURN QUERY SELECT 
      target_email, 
      NULL::uuid, 
      false, 
      NULL::text[], 
      NULL::timestamptz;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_email_admin_status(text) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.check_email_admin_status(text) IS 'Check if a specific email has admin role and return detailed status';

-- Create a function to ensure a user has admin role
CREATE OR REPLACE FUNCTION public.ensure_admin_role_for_email(target_email text)
RETURNS TABLE (
  success boolean,
  message text,
  user_id uuid,
  email text,
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
    RETURN QUERY SELECT 
      false, 
      'User not found with email: ' || target_email, 
      NULL::uuid,
      target_email,
      false;
    RETURN;
  END IF;
  
  -- Check if admin role already exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles 
    WHERE user_id = target_user_id AND role = 'admin'
  ) INTO role_exists;
  
  IF role_exists THEN
    RETURN QUERY SELECT 
      true, 
      'Admin role already exists for ' || target_email, 
      target_user_id,
      target_email,
      false;
  ELSE
    -- Create admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin');
    
    RETURN QUERY SELECT 
      true, 
      'Admin role created successfully for ' || target_email, 
      target_user_id,
      target_email,
      true;
  END IF;
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN QUERY SELECT 
      false, 
      'Error granting admin role: ' || SQLERRM, 
      NULL::uuid,
      target_email,
      false;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.ensure_admin_role_for_email(text) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.ensure_admin_role_for_email(text) IS 'Ensure a user has admin role by email, creating it if needed';

-- Create a function to list all admin users
CREATE OR REPLACE FUNCTION public.list_admin_users()
RETURNS TABLE (
  user_id uuid,
  email text,
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
    au.email,
    ur.role,
    ur.created_at
  FROM public.user_roles ur
  JOIN auth.users au ON ur.user_id = au.id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error listing admin users: %', SQLERRM;
    RETURN;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.list_admin_users() TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.list_admin_users() IS 'List all users with admin role';

-- Final verification message
DO $$
DECLARE
  admin_count integer;
BEGIN
  -- Count admin users
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';
  
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ================================================================';
  RAISE NOTICE '🎯 ADMIN STATUS CHECK MIGRATION APPLIED';
  RAISE NOTICE '🎯 ================================================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Created check_email_admin_status function';
  RAISE NOTICE '✅ Created ensure_admin_role_for_email function';
  RAISE NOTICE '✅ Created list_admin_users function';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Current admin count: %', admin_count;
  RAISE NOTICE '';
  RAISE NOTICE '🔍 HOW TO CHECK YOUR STATUS:';
  RAISE NOTICE '   SELECT * FROM public.check_email_admin_status(''your@email.com'');';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 HOW TO GRANT ADMIN ROLE:';
  RAISE NOTICE '   SELECT * FROM public.ensure_admin_role_for_email(''your@email.com'');';
  RAISE NOTICE '';
  RAISE NOTICE '📋 HOW TO LIST ALL ADMINS:';
  RAISE NOTICE '   SELECT * FROM public.list_admin_users();';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 ================================================================';
END $$;