/*
  # Comprehensive RLS Policy Reset and Cleanup
  
  This migration performs a complete reset of all RLS policies and functions to eliminate:
  - Recursive policy dependencies
  - Duplicate policy conflicts  
  - Inconsistent naming conventions
  
  Strategy:
  1. Drop ALL existing RLS policies on all tables
  2. Drop ALL existing custom functions that may cause recursion
  3. Create clean, non-recursive helper functions
  4. Create new RLS policies with consistent naming and no circular dependencies
  5. Ensure proper admin role checking without recursion
*/

-- =================================================================
-- STEP 1: Drop ALL existing RLS policies to start fresh
-- =================================================================

-- Drop all policies on user_roles table
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN 
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_roles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles', policy_record.policyname);
    END LOOP;
END $$;

-- Drop all policies on clients table
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN 
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'clients' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.clients', policy_record.policyname);
    END LOOP;
END $$;

-- Drop all policies on services table
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN 
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'services' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.services', policy_record.policyname);
    END LOOP;
END $$;

-- Drop all policies on appointments table
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN 
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'appointments' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.appointments', policy_record.policyname);
    END LOOP;
END $$;

-- Drop all policies on invoices table
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN 
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'invoices' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.invoices', policy_record.policyname);
    END LOOP;
END $$;

-- Drop all policies on admin_actions table
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN 
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'admin_actions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_actions', policy_record.policyname);
    END LOOP;
END $$;

-- Drop all policies on user_profiles table (if it exists)
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN 
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', policy_record.policyname);
    END LOOP;
END $$;

-- =================================================================
-- STEP 2: Drop ALL existing custom functions that may cause recursion
-- =================================================================

DROP FUNCTION IF EXISTS public.is_admin(uuid);
DROP FUNCTION IF EXISTS public.check_admin_role();
DROP FUNCTION IF EXISTS public.get_user_role(uuid);
DROP FUNCTION IF EXISTS public.has_role(text);
DROP FUNCTION IF EXISTS public.user_has_role(uuid, text);

-- =================================================================
-- STEP 3: Create clean, non-recursive helper functions
-- =================================================================

-- Simple function to check if a user has admin role without recursion
CREATE OR REPLACE FUNCTION public.user_is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND role = 'admin'
    AND user_uuid IS NOT NULL
  );
$$;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_primary_role(user_uuid uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role 
     FROM public.user_roles 
     WHERE user_id = user_uuid 
     ORDER BY 
       CASE 
         WHEN role = 'admin' THEN 1
         WHEN role = 'user' THEN 2
         ELSE 3
       END
     LIMIT 1), 
    'user'
  );
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.user_is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_primary_role(uuid) TO authenticated;

-- =================================================================
-- STEP 4: Create new, clean RLS policies with consistent naming
-- =================================================================

-- USER_ROLES table policies
CREATE POLICY "rls_user_roles_select_own"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "rls_user_roles_insert_own"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "rls_user_roles_update_own"
  ON public.user_roles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "rls_user_roles_admin_all"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.user_is_admin())
  WITH CHECK (public.user_is_admin());

-- CLIENTS table policies
CREATE POLICY "rls_clients_crud_own"
  ON public.clients
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "rls_clients_admin_read"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (public.user_is_admin());

-- SERVICES table policies
CREATE POLICY "rls_services_crud_own"
  ON public.services
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "rls_services_admin_read"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (public.user_is_admin());

-- APPOINTMENTS table policies
CREATE POLICY "rls_appointments_crud_own"
  ON public.appointments
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "rls_appointments_admin_read"
  ON public.appointments
  FOR SELECT
  TO authenticated
  USING (public.user_is_admin());

-- INVOICES table policies
CREATE POLICY "rls_invoices_crud_own"
  ON public.invoices
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "rls_invoices_admin_read"
  ON public.invoices
  FOR SELECT
  TO authenticated
  USING (public.user_is_admin());

-- ADMIN_ACTIONS table policies (admin only)
CREATE POLICY "rls_admin_actions_admin_only"
  ON public.admin_actions
  FOR ALL
  TO authenticated
  USING (public.user_is_admin() AND admin_id = auth.uid())
  WITH CHECK (public.user_is_admin() AND admin_id = auth.uid());

-- USER_PROFILES table policies (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
    
    EXECUTE 'CREATE POLICY "rls_user_profiles_crud_own"
      ON public.user_profiles
      FOR ALL
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid())';
    
    EXECUTE 'CREATE POLICY "rls_user_profiles_admin_read"
      ON public.user_profiles
      FOR SELECT
      TO authenticated
      USING (public.user_is_admin())';
      
  END IF;
END
$$;

-- =================================================================
-- STEP 5: Ensure RLS is enabled on all tables
-- =================================================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Enable RLS on admin_actions if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_actions') THEN
    ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- Enable RLS on user_profiles if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END
$$;

-- =================================================================
-- STEP 6: Create indexes for performance
-- =================================================================

-- Index on user_roles for fast role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role 
ON public.user_roles(user_id, role);

-- Index on foreign keys for better performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_services_user_id ON public.services(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);

-- =================================================================
-- VERIFICATION: Comment block for manual verification
-- =================================================================

/*
After running this migration, verify:

1. Check that no recursive policies exist:
   SELECT schemaname, tablename, policyname, cmd, qual, with_check 
   FROM pg_policies 
   WHERE schemaname = 'public' 
   ORDER BY tablename, policyname;

2. Test admin functionality:
   - Create a test user
   - Assign admin role: INSERT INTO user_roles (user_id, role) VALUES ('test-user-id', 'admin');
   - Test admin access to other users' data

3. Test regular user functionality:
   - Regular users should only see their own data
   - Regular users should not be able to access admin functions

4. Check function definitions:
   SELECT proname, prosrc FROM pg_proc WHERE proname IN ('user_is_admin', 'get_user_primary_role');
*/