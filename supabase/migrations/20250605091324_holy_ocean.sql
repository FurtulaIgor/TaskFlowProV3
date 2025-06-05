/*
  # Add trigger for automatic user role creation
  
  1. Changes
    - Create function to handle new user creation
    - Create trigger to automatically insert user role
    
  2. Security
    - Function runs with SECURITY DEFINER to ensure it has proper permissions
    - Automatically assigns 'user' role to new users
*/

-- Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();