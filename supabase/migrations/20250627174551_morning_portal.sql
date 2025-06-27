/*
  # Fix admin_users view security issue

  1. Security Changes
    - Change admin_users view from SECURITY DEFINER to SECURITY INVOKER
    - This ensures that permissions of the querying user are enforced
    - Removes potential security risks from SECURITY DEFINER

  2. View Updates
    - Recreate admin_users view with proper security settings
    - Ensure RLS policies are properly enforced
    - Maintain functionality while improving security
*/

-- Drop the existing admin_users view if it exists
DROP VIEW IF EXISTS public.admin_users;

-- Recreate the admin_users view with SECURITY INVOKER
-- This ensures that the permissions of the user executing the query are used
CREATE VIEW public.admin_users
WITH (security_invoker = on) AS
SELECT 
  ur.user_id,
  ur.role,
  ur.created_at
FROM public.user_roles ur
WHERE ur.role = 'admin';

-- Add comment explaining the security model
COMMENT ON VIEW public.admin_users IS 'View of admin users with SECURITY INVOKER for proper RLS enforcement';

-- Grant appropriate permissions
GRANT SELECT ON public.admin_users TO authenticated;

-- Ensure RLS is properly configured on the underlying user_roles table
-- (This should already be done, but we verify it here)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Verify that proper RLS policies exist for user_roles table
-- If the policies don't exist, create them

-- Policy for users to read their own roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' 
    AND policyname = 'users_can_read_own_roles_simple'
  ) THEN
    CREATE POLICY "users_can_read_own_roles_simple" ON public.user_roles
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Policy for admins to read all roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' 
    AND policyname = 'admins_can_view_all_roles_simple'
  ) THEN
    CREATE POLICY "admins_can_view_all_roles_simple" ON public.user_roles
      FOR SELECT TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles ur
          WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
      );
  END IF;
END $$;

-- Policy for users to insert their own roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' 
    AND policyname = 'users_can_insert_own_roles_simple'
  ) THEN
    CREATE POLICY "users_can_insert_own_roles_simple" ON public.user_roles
      FOR INSERT TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Policy for admins to manage all roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' 
    AND policyname = 'admin_manage_all_roles_v2'
  ) THEN
    CREATE POLICY "admin_manage_all_roles_v2" ON public.user_roles
      FOR ALL TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.user_roles ur
          WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM public.user_roles ur
          WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
      );
  END IF;
END $$;