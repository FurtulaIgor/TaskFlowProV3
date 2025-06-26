/*
  # Add RPC function for safe user deletion

  1. New Function
    - `delete_user_safely(target_user_id uuid, admin_notes text)` - Safely delete user and all related data
    - Uses SECURITY DEFINER to access auth.users
    - Performs cascading deletion of all user data
    - Logs admin action

  2. Security
    - Function runs with elevated privileges
    - Only admins can execute the function
    - Prevents self-deletion
*/

-- Create function to safely delete user and all related data
CREATE OR REPLACE FUNCTION public.delete_user_safely(
  target_user_id uuid,
  admin_notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_admin_id uuid;
BEGIN
  -- Get current user ID
  current_admin_id := auth.uid();
  
  -- Check if current user is admin
  IF NOT is_admin(current_admin_id) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;
  
  -- Prevent self-deletion
  IF current_admin_id = target_user_id THEN
    RAISE EXCEPTION 'Cannot delete your own account.';
  END IF;
  
  -- Delete user_profiles
  DELETE FROM public.user_profiles WHERE user_id = target_user_id;
  
  -- Delete user_roles
  DELETE FROM public.user_roles WHERE user_id = target_user_id;
  
  -- Delete clients
  DELETE FROM public.clients WHERE user_id = target_user_id;
  
  -- Delete services
  DELETE FROM public.services WHERE user_id = target_user_id;
  
  -- Delete appointments
  DELETE FROM public.appointments WHERE user_id = target_user_id;
  
  -- Delete invoices
  DELETE FROM public.invoices WHERE user_id = target_user_id;
  
  -- Log admin action
  INSERT INTO public.admin_actions (admin_id, action_type, target_user_id, notes)
  VALUES (current_admin_id, 'delete_user', target_user_id, admin_notes);
  
  -- Delete user from auth.users (this must be last)
  DELETE FROM auth.users WHERE id = target_user_id;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and re-raise
    RAISE EXCEPTION 'Error deleting user: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users (admin check is inside function)
GRANT EXECUTE ON FUNCTION public.delete_user_safely(uuid, text) TO authenticated;