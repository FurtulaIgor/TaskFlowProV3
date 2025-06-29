/*
  # Fix duplicate trigger issue

  1. Changes
    - Drop the existing trigger if it exists
    - Recreate the trigger with proper error handling
    - Ensure the trigger only exists once

  2. Security
    - Maintain existing functionality
    - Preserve the automatic updated_at timestamp updates
*/

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;

-- Recreate the trigger
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TRIGGER update_user_profiles_updated_at ON public.user_profiles 
  IS 'Automatically updates the updated_at timestamp when a profile is modified';