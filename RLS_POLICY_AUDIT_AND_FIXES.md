# RLS Policy Audit and Fix Tasks

## 🔍 Current Issues Identified

### 1. Missing Functions
- `check_admin_role()` function is referenced in policies but may not exist
- `is_admin()` function is referenced but may not exist
- `uid()` function usage needs verification

### 2. Duplicate Policies
- Multiple policies with similar names exist on some tables
- Some policies may conflict with each other

### 3. Inconsistent Policy Logic
- Mix of different approaches for admin checking
- Some policies use `check_admin_role()`, others use direct role checks

## 📋 Tasks to Fix RLS Policies

### Task 1: Create Missing Functions
**Priority: HIGH**

Create the missing functions that are referenced in RLS policies:

```sql
-- 1. Create check_admin_role function
CREATE OR REPLACE FUNCTION public.check_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 2. Create is_admin function
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$$;

-- 3. Create get_all_users_with_roles RPC function for admin
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
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    ur.created_at,
    au.email
  FROM public.user_roles ur
  LEFT JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.created_at DESC;
END;
$$;
```

### Task 2: Clean Up Duplicate Policies
**Priority: HIGH**

Remove duplicate and conflicting policies:

```sql
-- Drop old/duplicate policies on user_roles table
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "allow_insert_user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "users_can_read_own_roles" ON public.user_roles;

-- Drop old admin policies that might conflict
DROP POLICY IF EXISTS "admin_view_all_clients" ON public.clients;
DROP POLICY IF EXISTS "admin_view_all_services" ON public.services;
DROP POLICY IF EXISTS "admin_view_all_appointments" ON public.appointments;
DROP POLICY IF EXISTS "admin_view_all_invoices" ON public.invoices;
DROP POLICY IF EXISTS "admin_view_admin_actions" ON public.admin_actions;
DROP POLICY IF EXISTS "admin_view_all_profiles" ON public.user_profiles;
```

### Task 3: Standardize RLS Policies
**Priority: HIGH**

Create consistent RLS policies for all tables:

```sql
-- USER_ROLES table policies
CREATE POLICY "users_can_read_own_roles_v3" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users_can_insert_own_roles_v3" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_can_manage_all_roles_v3" ON public.user_roles
  FOR ALL TO authenticated
  USING (check_admin_role())
  WITH CHECK (check_admin_role());

-- CLIENTS table policies
CREATE POLICY "users_can_manage_own_clients_v3" ON public.clients
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_can_view_all_clients_v3" ON public.clients
  FOR SELECT TO authenticated
  USING (check_admin_role());

-- SERVICES table policies  
CREATE POLICY "users_can_manage_own_services_v3" ON public.services
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_can_view_all_services_v3" ON public.services
  FOR SELECT TO authenticated
  USING (check_admin_role());

-- APPOINTMENTS table policies
CREATE POLICY "users_can_manage_own_appointments_v3" ON public.appointments
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_can_view_all_appointments_v3" ON public.appointments
  FOR SELECT TO authenticated
  USING (check_admin_role());

-- INVOICES table policies
CREATE POLICY "users_can_manage_own_invoices_v3" ON public.invoices
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_can_view_all_invoices_v3" ON public.invoices
  FOR SELECT TO authenticated
  USING (check_admin_role());

-- USER_PROFILES table policies
CREATE POLICY "users_can_manage_own_profile_v3" ON public.user_profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "admins_can_view_all_profiles_v3" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (check_admin_role());

-- ADMIN_ACTIONS table policies
CREATE POLICY "admins_can_manage_admin_actions_v3" ON public.admin_actions
  FOR ALL TO authenticated
  USING (check_admin_role())
  WITH CHECK (check_admin_role() AND admin_id = auth.uid());
```

### Task 4: Verify RLS is Enabled
**Priority: MEDIUM**

Ensure RLS is enabled on all tables:

```sql
-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
```

### Task 5: Test RLS Policies
**Priority: MEDIUM**

Test the policies with different user roles:

```sql
-- Test queries (run as different users)

-- 1. Test as regular user - should only see own data
SELECT * FROM public.clients; -- Should only return user's clients
SELECT * FROM public.user_roles; -- Should only return user's roles

-- 2. Test as admin user - should see all data
SELECT * FROM public.clients; -- Should return all clients
SELECT * FROM public.user_roles; -- Should return all user roles

-- 3. Test admin functions
SELECT * FROM public.get_all_users_with_roles(); -- Should work for admin only
```

### Task 6: Create Admin User (if needed)
**Priority: LOW**

If you don't have an admin user, create one:

```sql
-- Insert admin role for a specific user (replace with actual user ID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

## 🔧 Execution Order

1. **Execute Task 1** - Create missing functions
2. **Execute Task 2** - Clean up duplicate policies  
3. **Execute Task 3** - Create standardized policies
4. **Execute Task 4** - Verify RLS is enabled
5. **Execute Task 5** - Test the policies
6. **Execute Task 6** - Create admin user (if needed)

## ⚠️ Important Notes

- **Backup First**: Always backup your database before making these changes
- **Test Thoroughly**: Test each policy after creation
- **Monitor Logs**: Check Supabase logs for any policy violations
- **Gradual Rollout**: Apply changes incrementally and test between each step

## 🎯 Expected Outcome

After completing these tasks:
- ✅ All RLS policies will use consistent function calls
- ✅ No duplicate or conflicting policies
- ✅ Admin users can access all data
- ✅ Regular users can only access their own data
- ✅ No more "function does not exist" errors
- ✅ Clean, maintainable security model

## 🔍 Verification Checklist

- [ ] All functions created successfully
- [ ] No duplicate policies remain
- [ ] RLS enabled on all tables
- [ ] Admin user can access admin panel
- [ ] Regular user cannot access admin data
- [ ] No console errors in application
- [ ] All CRUD operations work correctly