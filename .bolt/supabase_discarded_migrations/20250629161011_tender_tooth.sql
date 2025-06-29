/*
  # Fix is_admin function dependency issue
  
  1. Problem
    - Cannot drop is_admin(uuid) function because other objects depend on it
    - Policy admins_can_view_all_profiles on table user_profiles depends on function is_admin(uuid)
  
  2. Solution
    - Drop dependent policies first
    - Then drop the function
    - Create new function with the same name
    - Recreate dependent policies
*/

-- First, drop the dependent policy
DROP POLICY IF EXISTS "admins_can_view_all_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "admins_can_view_all_profiles_new" ON public.user_profiles;
DROP POLICY IF EXISTS "admins_can_view_all_profiles_v2" ON public.user_profiles;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- Create a new version of the function
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
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

  -- Check if specified user has admin role
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- Recreate the dependent policy
CREATE POLICY "admins_can_view_all_profiles_v2"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Add comment for documentation
COMMENT ON FUNCTION public.is_admin(uuid) IS 'Check if a specific user has admin role - fixed dependency issue';