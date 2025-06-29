-- Drop the existing function first
DROP FUNCTION IF EXISTS public.check_email_admin_status(text);

-- Recreate the function with the same return type
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_email_admin_status(text) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.check_email_admin_status(text) IS 'Check if a specific email has admin role and return detailed status - fixed return type';