-- Drop all existing policies for user_roles to start fresh
DROP POLICY IF EXISTS "user_roles_self_read" ON user_roles;
DROP POLICY IF EXISTS "user_roles_admin_all" ON user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Enable read access for users to their own role" ON user_roles;
DROP POLICY IF EXISTS "Enable full access for admins" ON user_roles;
DROP POLICY IF EXISTS "admins_can_manage_actions" ON admin_actions;

-- Create simple policy for users to read their own roles
CREATE POLICY "users_can_read_own_roles"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy for inserting new user roles (for registration)
CREATE POLICY "allow_insert_user_roles"
  ON user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- For admin_actions, create a simpler policy that doesn't depend on user_roles recursion
-- We'll handle admin checks in the application layer instead
CREATE POLICY "authenticated_users_can_read_admin_actions"
  ON admin_actions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "authenticated_users_can_insert_admin_actions"
  ON admin_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id);

-- Create a function to safely check if user is admin without recursion
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = user_uuid 
    AND role = 'admin'
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;