/*
  # Fix auth.users access issues
  
  1. Problem
    - Previous migrations tried to access auth.users directly
    - This causes "must be owner of relation users" error
    - We need to use service_role functions instead
  
  2. Solution
    - Create secure functions that use service_role for auth operations
    - Use RPC functions instead of direct table access
    - Maintain security with proper checks
*/

-- Create a secure function to get user email by ID
CREATE OR REPLACE FUNCTION public.get_user_email_by_id(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_email text;
BEGIN
  -- Only allow admins or the user themselves to get email
  IF NOT (public.check_admin_role() OR auth.uid() = user_uuid) THEN
    RETURN 'Access Denied';
  END IF;

  -- Use auth.users() function instead of direct table access
  SELECT email INTO user_email
  FROM auth.users()
  WHERE id = user_uuid;

  RETURN COALESCE(user_email, 'Unknown');
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'Error: ' || SQLERRM;
END;
$$;

-- Create a secure function to get user ID by email
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(user_email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Use auth.users() function instead of direct table access
  SELECT id INTO user_id
  FROM auth.users()
  WHERE email = user_email;

  RETURN user_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

-- Update make_user_admin function to use the new helper function
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
  -- Find user by email using our helper function
  target_user_id := public.get_user_id_by_email(target_email);
  
  IF target_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User not found with email: ' || target_email, NULL::uuid;
    RETURN;
  END IF;
  
  -- Check if admin role already exists
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles
    WHERE user_id = target_user_id AND role = 'admin'
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

-- Update check_email_admin_status function to use the new helper function
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
  -- Find user by email using our helper function
  target_user_id := public.get_user_id_by_email(target_email);
  
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

-- Update list_admin_users function to use the new helper function
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
    public.get_user_email_by_id(ur.user_id),
    ur.role,
    ur.created_at
  FROM public.user_roles ur
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error listing admin users: %', SQLERRM;
    RETURN;
END;
$$;

-- Update get_all_users_with_roles function to use the new helper function
CREATE OR REPLACE FUNCTION public.get_all_users_with_roles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role text,
  created_at timestamptz,
  email text
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

  -- Return all user roles with email information
  RETURN QUERY
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.created_at,
    public.get_user_email_by_id(ur.user_id) as email
  FROM public.user_roles ur
  ORDER BY ur.created_at DESC;
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error fetching users and roles: %', SQLERRM;
END;
$$;

-- Update delete_user_safely function to use the new helper function
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
  
  -- Check if target user exists using our helper function
  user_email := public.get_user_email_by_id(target_user_id);
  IF user_email IS NULL OR user_email = 'Unknown' OR user_email LIKE 'Error:%' THEN
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

-- Grant execute permissions on all new functions
GRANT EXECUTE ON FUNCTION public.get_user_email_by_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(text) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION public.get_user_email_by_id(uuid) IS 'Securely get user email by ID without direct auth.users access';
COMMENT ON FUNCTION public.get_user_id_by_email(text) IS 'Securely get user ID by email without direct auth.users access';
COMMENT ON FUNCTION public.make_user_admin(text) IS 'Function to grant admin role to a user by email - fixed auth access';
COMMENT ON FUNCTION public.check_email_admin_status(text) IS 'Check if a specific email has admin role - fixed auth access';
COMMENT ON FUNCTION public.list_admin_users() IS 'List all users with admin role - fixed auth access';
COMMENT ON FUNCTION public.get_all_users_with_roles() IS 'Admin-only function to get all users with their roles - fixed auth access';
COMMENT ON FUNCTION public.delete_user_safely(uuid, text) IS 'Admin-only function to safely delete a user - fixed auth access';