/*
  # Comprehensive RLS Fix Migration
  
  This migration completely rebuilds all RLS policies and admin functions to:
  1. Eliminate infinite recursion issues
  2. Fix "Function Search Path Mutable" warnings
  3. Ensure proper admin role checking
  4. Maintain data security and access control
  
  ## Steps:
  1. Disable RLS on all tables
  2. Drop all problematic policies and functions
  3. Create new, non-recursive admin check functions
  4. Create proper RLS policies for all tables
  5. Create admin-only RPC functions with proper security
  6. Re-enable RLS on all tables
*/

-- =============================================
-- STEP 1: DISABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 2: DROP ALL PROBLEMATIC POLICIES
-- =============================================

-- Drop all policies on user_roles
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_view_own_role" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_read_own_role" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_read_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_read_own_roles_simple" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_insert_own_role" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_insert_own_roles_simple" ON public.user_roles;
DROP POLICY IF EXISTS "allow_insert_user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update their own role" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_update_own_role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can delete their own role" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_delete_own_role" ON public.user_roles;
DROP POLICY IF EXISTS "admins_can_view_all_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins_can_insert_any_role" ON public.user_roles;
DROP POLICY IF EXISTS "admins_can_update_any_role" ON public.user_roles;
DROP POLICY IF EXISTS "admins_can_delete_any_role" ON public.user_roles;
DROP POLICY IF EXISTS "admins_can_insert_any_user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins_can_update_any_user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins_can_view_all_user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "existing_admins_can_manage_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admin_manage_all_roles_v2" ON public.user_roles;
DROP POLICY IF EXISTS "service_role_can_manage_all_roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_read_own_v2" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_own_v2" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_read_own_final" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_own_final" ON public.user_roles;
DROP POLICY IF EXISTS "service_role_manage_all_final" ON public.user_roles;
DROP POLICY IF EXISTS "admin_manage_roles_final" ON public.user_roles;

-- Drop policies on clients
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;
DROP POLICY IF EXISTS "users_can_view_own_clients" ON public.clients;
DROP POLICY IF EXISTS "admins_can_view_all_clients" ON public.clients;
DROP POLICY IF EXISTS "admins_can_view_all_clients_new" ON public.clients;
DROP POLICY IF EXISTS "admin_view_all_clients_v2" ON public.clients;

-- Drop policies on services
DROP POLICY IF EXISTS "Users can view their own services" ON public.services;
DROP POLICY IF EXISTS "Users can insert their own services" ON public.services;
DROP POLICY IF EXISTS "Users can update their own services" ON public.services;
DROP POLICY IF EXISTS "Users can delete their own services" ON public.services;
DROP POLICY IF EXISTS "users_can_view_own_services" ON public.services;
DROP POLICY IF EXISTS "admins_can_view_all_services" ON public.services;
DROP POLICY IF EXISTS "admins_can_view_all_services_new" ON public.services;
DROP POLICY IF EXISTS "admin_view_all_services_v2" ON public.services;

-- Drop policies on appointments
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can insert their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "users_can_view_own_appointments" ON public.appointments;
DROP POLICY IF EXISTS "admins_can_view_all_appointments" ON public.appointments;
DROP POLICY IF EXISTS "admins_can_view_all_appointments_new" ON public.appointments;
DROP POLICY IF EXISTS "admin_view_all_appointments_v2" ON public.appointments;

-- Drop policies on invoices
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can insert their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "users_can_view_own_invoices" ON public.invoices;
DROP POLICY IF EXISTS "admins_can_view_all_invoices" ON public.invoices;
DROP POLICY IF EXISTS "admins_can_view_all_invoices_new" ON public.invoices;
DROP POLICY IF EXISTS "admin_view_all_invoices_v2" ON public.invoices;

-- Drop policies on admin_actions
DROP POLICY IF EXISTS "admins_can_manage_actions" ON public.admin_actions;
DROP POLICY IF EXISTS "admins_can_view_admin_actions" ON public.admin_actions;
DROP POLICY IF EXISTS "admins_can_view_admin_actions_new" ON public.admin_actions;
DROP POLICY IF EXISTS "admin_view_admin_actions_v2" ON public.admin_actions;
DROP POLICY IF EXISTS "authenticated_users_can_read_admin_actions" ON public.admin_actions;
DROP POLICY IF EXISTS "authenticated_users_can_insert_admin_actions" ON public.admin_actions;
DROP POLICY IF EXISTS "admins_can_insert_admin_actions" ON public.admin_actions;
DROP POLICY IF EXISTS "admins_can_insert_admin_actions_new" ON public.admin_actions;
DROP POLICY IF EXISTS "admin_insert_admin_actions_v2" ON public.admin_actions;
DROP POLICY IF EXISTS "admins_can_view_admin_actions_simple" ON public.admin_actions;
DROP POLICY IF EXISTS "admins_can_insert_admin_actions_simple" ON public.admin_actions;
DROP POLICY IF EXISTS "admin_actions_admin_only_final" ON public.admin_actions;

-- Drop policies on user_profiles
DROP POLICY IF EXISTS "users_can_view_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_delete_own_profile" ON public.user_profiles;
DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "admins_can_view_all_profiles_new" ON public.user_profiles;
DROP POLICY IF EXISTS "admins_can_view_all_profiles_v2" ON public.user_profiles;

-- =============================================
-- STEP 3: DROP ALL PROBLEMATIC FUNCTIONS
-- =============================================

-- Drop all admin-related functions
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.check_admin_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_user_admin(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_all_users_with_roles() CASCADE;
DROP FUNCTION IF EXISTS public.get_users_with_roles() CASCADE;
DROP FUNCTION IF EXISTS public.get_clients_with_users() CASCADE;
DROP FUNCTION IF EXISTS public.get_services_with_users() CASCADE;
DROP FUNCTION IF EXISTS public.get_appointments_with_users() CASCADE;
DROP FUNCTION IF EXISTS public.get_invoices_with_users() CASCADE;
DROP FUNCTION IF EXISTS public.delete_user_safely(uuid, text) CASCADE;
DROP FUNCTION IF EXISTS public.make_user_admin(text) CASCADE;
DROP FUNCTION IF EXISTS public.ensure_admin_role(text) CASCADE;
DROP FUNCTION IF EXISTS public.ensure_admin_role_for_email(text) CASCADE;
DROP FUNCTION IF EXISTS public.debug_current_user_roles() CASCADE;
DROP FUNCTION IF EXISTS public.debug_all_user_roles() CASCADE;
DROP FUNCTION IF EXISTS public.test_database_connection() CASCADE;
DROP FUNCTION IF EXISTS public.test_admin_functions() CASCADE;
DROP FUNCTION IF EXISTS public.simple_db_test() CASCADE;
DROP FUNCTION IF EXISTS public.check_email_admin_status(text) CASCADE;
DROP FUNCTION IF EXISTS public.list_admin_users() CASCADE;

-- Drop views
DROP VIEW IF EXISTS public.admin_users CASCADE;
DROP VIEW IF EXISTS public.user_roles_diagnostic CASCADE;

-- =============================================
-- STEP 4: CREATE CORE ADMIN CHECK FUNCTIONS
-- =============================================

-- Create a secure, non-recursive function to check if current user is admin
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Return false if no user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  -- Direct query to check if current user has admin role
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return false on any error to be safe
    RETURN false;
END;
$$;

-- Create a secure function to check if a specific user has admin role
CREATE OR REPLACE FUNCTION public.is_user_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Return false if user_uuid is null
  IF user_uuid IS NULL THEN
    RETURN false;
  END IF;

  -- Direct query to check if specified user has admin role
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_uuid AND role = 'admin'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return false on any error to be safe
    RETURN false;
END;
$$;

-- Create a function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in update_updated_at_column trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- =============================================
-- STEP 5: CREATE ADMIN RPC FUNCTIONS
-- =============================================

-- Create function to get all users with roles
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
    COALESCE(au.email, 'Unknown') as email
  FROM public.user_roles ur
  LEFT JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;

EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error fetching users and roles: %', SQLERRM;
END;
$$;

-- Create function to get clients with user information
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

-- Create function to get services with user information
CREATE OR REPLACE FUNCTION public.get_services_with_users()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  name text,
  description text,
  duration integer,
  price numeric,
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

  -- Return all services with user information
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.name,
    s.description,
    s.duration,
    s.price,
    s.created_at,
    COALESCE(au.email, 'Unknown') as user_email
  FROM public.services s
  LEFT JOIN auth.users au ON s.user_id = au.id
  ORDER BY s.created_at DESC;

EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error fetching services with users: %', SQLERRM;
END;
$$;

-- Create function to get appointments with user information
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

-- Create function to get invoices with user information
CREATE OR REPLACE FUNCTION public.get_invoices_with_users()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  client_id uuid,
  appointment_id uuid,
  amount numeric,
  status text,
  due_date timestamptz,
  paid_date timestamptz,
  pdf_url text,
  created_at timestamptz,
  user_email text,
  client_name text,
  client_email text
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

  -- Return all invoices with user and client information
  RETURN QUERY
  SELECT 
    i.id,
    i.user_id,
    i.client_id,
    i.appointment_id,
    i.amount,
    i.status,
    i.due_date,
    i.paid_date,
    i.pdf_url,
    i.created_at,
    COALESCE(au.email, 'Unknown') as user_email,
    COALESCE(c.name, 'Unknown Client') as client_name,
    COALESCE(c.email, 'Unknown Email') as client_email
  FROM public.invoices i
  LEFT JOIN auth.users au ON i.user_id = au.id
  LEFT JOIN public.clients c ON i.client_id = c.id
  ORDER BY i.created_at DESC;

EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error fetching invoices with users: %', SQLERRM;
END;
$$;

-- Create function to safely delete a user
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

-- =============================================
-- STEP 6: CREATE UTILITY FUNCTIONS
-- =============================================

-- Create function to make a user admin
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

-- Create function to check admin status by email
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

-- Create function to list all admin users
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

-- Create a simple database test function
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

-- =============================================
-- STEP 7: CREATE VIEWS
-- =============================================

-- Create admin_users view
CREATE OR REPLACE VIEW public.admin_users
WITH (security_invoker = on) AS
SELECT 
  ur.user_id,
  ur.role,
  ur.created_at
FROM public.user_roles ur
WHERE ur.role = 'admin';

-- Create user_roles_diagnostic view
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

-- =============================================
-- STEP 8: CREATE RLS POLICIES
-- =============================================

-- Create policies for user_roles table
CREATE POLICY "user_roles_read_own"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_roles_insert_own"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "service_role_manage_all_roles"
  ON public.user_roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "admin_manage_roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.check_admin_role())
  WITH CHECK (public.check_admin_role());

-- Create policies for clients table
CREATE POLICY "users_can_view_own_clients"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_clients"
  ON public.clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_clients"
  ON public.clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_clients"
  ON public.clients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_view_all_clients"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (public.check_admin_role());

-- Create policies for services table
CREATE POLICY "users_can_view_own_services"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_services"
  ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_services"
  ON public.services
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_services"
  ON public.services
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_view_all_services"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (public.check_admin_role());

-- Create policies for appointments table
CREATE POLICY "users_can_view_own_appointments"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_appointments"
  ON public.appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_appointments"
  ON public.appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_appointments"
  ON public.appointments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_view_all_appointments"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (public.check_admin_role());

-- Create policies for invoices table
CREATE POLICY "users_can_view_own_invoices"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_invoices"
  ON public.invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_invoices"
  ON public.invoices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_invoices"
  ON public.invoices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_view_all_invoices"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (public.check_admin_role());

-- Create policies for admin_actions table
CREATE POLICY "admin_actions_admin_only"
  ON public.admin_actions
  FOR ALL
  TO authenticated
  USING (public.check_admin_role())
  WITH CHECK (
    auth.uid() = admin_id AND public.check_admin_role()
  );

-- Create policies for user_profiles table
CREATE POLICY "users_can_view_own_profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_profile"
  ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_view_all_profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (public.check_admin_role());

-- =============================================
-- STEP 9: RE-ENABLE RLS ON ALL TABLES
-- =============================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 10: GRANT PERMISSIONS
-- =============================================

-- Grant execute permissions on all functions
GRANT EXECUTE ON FUNCTION public.check_admin_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users_with_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_clients_with_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_services_with_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_appointments_with_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_invoices_with_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_safely(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.make_user_admin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_email_admin_status(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_admin_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.simple_db_test() TO authenticated;

-- Grant select permissions on views
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT ON public.user_roles_diagnostic TO authenticated;

-- =============================================
-- STEP 11: RECREATE TRIGGERS
-- =============================================

-- Recreate trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Recreate trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- STEP 12: ADD UNIQUE CONSTRAINT TO USER_ROLES
-- =============================================

-- Add unique constraint to user_roles to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- =============================================
-- STEP 13: ADD COMMENTS
-- =============================================

-- Add comments to functions
COMMENT ON FUNCTION public.check_admin_role() IS 'Checks if current authenticated user has admin role';
COMMENT ON FUNCTION public.is_user_admin(uuid) IS 'Checks if specified user has admin role';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Trigger function to automatically update updated_at column';
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to automatically assign user role to new users';
COMMENT ON FUNCTION public.get_all_users_with_roles() IS 'Admin-only function to get all users with their roles';
COMMENT ON FUNCTION public.get_clients_with_users() IS 'Admin-only function to get all clients with their user information';
COMMENT ON FUNCTION public.get_services_with_users() IS 'Admin-only function to get all services with their user information';
COMMENT ON FUNCTION public.get_appointments_with_users() IS 'Admin-only function to get all appointments with user, client, and service information';
COMMENT ON FUNCTION public.get_invoices_with_users() IS 'Admin-only function to get all invoices with user and client information';
COMMENT ON FUNCTION public.delete_user_safely(uuid, text) IS 'Admin-only function to safely delete a user and all related data';
COMMENT ON FUNCTION public.make_user_admin(text) IS 'Function to grant admin role to a user by email';
COMMENT ON FUNCTION public.check_email_admin_status(text) IS 'Check if a specific email has admin role and return detailed status';
COMMENT ON FUNCTION public.list_admin_users() IS 'List all users with admin role';
COMMENT ON FUNCTION public.simple_db_test() IS 'Simple database test function that does not depend on other functions';

-- Add comments to views
COMMENT ON VIEW public.admin_users IS 'View of admin users with SECURITY INVOKER for proper RLS enforcement';
COMMENT ON VIEW public.user_roles_diagnostic IS 'Diagnostic view for user roles with security_invoker for proper RLS enforcement';

-- Add comments to triggers
COMMENT ON TRIGGER update_user_profiles_updated_at ON public.user_profiles IS 'Automatically updates the updated_at timestamp when a profile is modified';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Automatically assigns user role to new users';