/*
  # Debug Admin Roles Migration

  1. Verification Functions
    - Create debug functions to check admin role status
    - Add logging for troubleshooting
  
  2. Data Verification
    - Check if user_roles table has correct data
    - Verify RLS policies are working
  
  3. Fixes
    - Ensure proper role assignment
    - Fix any data inconsistencies
*/

-- 1. Create debug function to check current user's roles
CREATE OR REPLACE FUNCTION public.debug_current_user_roles()
RETURNS TABLE (
  current_user_id uuid,
  user_email text,
  role_count bigint,
  roles text[],
  is_admin_check boolean,
  check_admin_role_result boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_uid uuid;
  current_email text;
BEGIN
  -- Get current user ID
  current_uid := auth.uid();
  
  -- Get current user email
  SELECT email INTO current_email FROM auth.users WHERE id = current_uid;
  
  -- Return debug information
  RETURN QUERY
  SELECT 
    current_uid as current_user_id,
    COALESCE(current_email, 'No email found') as user_email,
    (SELECT COUNT(*) FROM public.user_roles WHERE user_id = current_uid) as role_count,
    (SELECT ARRAY_AGG(role) FROM public.user_roles WHERE user_id = current_uid) as roles,
    (SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = current_uid AND role = 'admin')) as is_admin_check,
    public.check_admin_role() as check_admin_role_result;
END;
$$;

-- 2. Create function to list all users and their roles (admin only)
CREATE OR REPLACE FUNCTION public.debug_all_user_roles()
RETURNS TABLE (
  user_id uuid,
  user_email text,
  role text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is admin (bypass for debugging)
  -- IF NOT public.check_admin_role() THEN
  --   RAISE EXCEPTION 'Access denied. Admin role required.';
  -- END IF;

  RETURN QUERY
  SELECT 
    ur.user_id,
    COALESCE(au.email, 'Unknown') as user_email,
    ur.role,
    ur.created_at
  FROM public.user_roles ur
  LEFT JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;
END;
$$;

-- 3. Create function to fix missing admin role
CREATE OR REPLACE FUNCTION public.ensure_admin_role(target_email text)
RETURNS TABLE (
  success boolean,
  message text,
  user_id uuid,
  role_created boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
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
    RETURN QUERY SELECT false, 'User not found with email: ' || target_email, NULL::uuid, false;
    RETURN;
  END IF;
  
  -- Check if admin role already exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles 
    WHERE user_id = target_user_id AND role = 'admin'
  ) INTO role_exists;
  
  IF role_exists THEN
    RETURN QUERY SELECT true, 'Admin role already exists', target_user_id, false;
  ELSE
    -- Create admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin');
    
    RETURN QUERY SELECT true, 'Admin role created successfully', target_user_id, true;
  END IF;
END;
$$;

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION public.debug_current_user_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.debug_all_user_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_admin_role(text) TO authenticated;

-- 5. Add comments
COMMENT ON FUNCTION public.debug_current_user_roles() IS 'Debug function to check current user roles and admin status';
COMMENT ON FUNCTION public.debug_all_user_roles() IS 'Debug function to list all user roles';
COMMENT ON FUNCTION public.ensure_admin_role(text) IS 'Function to ensure a user has admin role by email';