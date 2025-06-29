# Admin Functionality Test Plan

## 🎯 Overview
This document outlines the comprehensive testing plan for admin functionality after the RLS policy reset migration.

## 📋 Pre-Test Setup

### 1. Apply the RLS Reset Migration
```bash
cd supabase
npx supabase db push
```

### 2. Verify Database State
Check that the migration was applied successfully:
```sql
-- Check that new policies exist
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND policyname LIKE 'rls_%'
ORDER BY tablename, policyname;

-- Check that new functions exist
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN ('user_is_admin', 'get_user_primary_role');
```

## 🔧 Test Scenarios

### Scenario 1: User Registration & Default Role Assignment

**Test Steps:**
1. Register a new user via `/auth/register`
2. Check that user gets default 'user' role

**Expected Results:**
- User can register successfully
- Default 'user' role is automatically assigned
- User can access their own data only

**SQL Verification:**
```sql
SELECT ur.user_id, ur.role, au.email
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
ORDER BY ur.created_at DESC
LIMIT 5;
```

### Scenario 2: Admin Role Assignment

**Test Steps:**
1. Create a test user (or use existing user)
2. Manually assign admin role:
```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('USER_UUID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```
3. Test admin access

**Expected Results:**
- User with admin role can access `/app/admin`
- Admin can see all users in admin panel
- Admin can modify user roles
- Admin can delete users

### Scenario 3: Regular User Restrictions

**Test Steps:**
1. Login as regular user (role: 'user')
2. Try to access `/app/admin`
3. Test data access via API

**Expected Results:**
- Regular user redirected away from admin routes
- Regular user can only see their own clients, appointments, invoices
- Regular user cannot access other users' data

### Scenario 4: Admin Data Access

**Test Steps:**
1. Login as admin user
2. Navigate to admin panel
3. Test viewing all users' data

**Expected Results:**
- Admin can see user management interface
- Admin can view all users and their roles
- Admin can view system-wide statistics
- Admin actions are logged in admin_actions table

## 🧪 Manual Test Checklist

### ✅ Authentication Flow
- [ ] User registration works
- [ ] Login works without setTimeout delay
- [ ] Navigation is immediate after login
- [ ] Default roles assigned correctly

### ✅ Regular User Functionality
- [ ] User can create/view/edit/delete their own clients
- [ ] User can create/view/edit/delete their own appointments
- [ ] User can create/view/edit/delete their own invoices
- [ ] User can create/view/edit/delete their own services
- [ ] User cannot access admin routes
- [ ] User cannot see other users' data

### ✅ Admin Functionality
- [ ] Admin can access `/app/admin` route
- [ ] Admin can view all users in system
- [ ] Admin can change user roles
- [ ] Admin can delete users
- [ ] Admin can view all users' data (read-only)
- [ ] Admin actions are logged
- [ ] Admin panel shows correct statistics

### ✅ RLS Policy Verification
- [ ] No recursive policy errors in console
- [ ] Database queries execute without infinite loops
- [ ] Performance is acceptable (no slowdowns)
- [ ] Policies enforce proper data isolation

## 🐛 Common Issues to Check

### Issue 1: Infinite Recursion
**Symptoms:** Browser hangs, database timeouts, high CPU usage
**Check:** Look for recursive function calls in policies
**Fix:** Ensure new `user_is_admin()` function doesn't reference itself

### Issue 2: Admin Access Denied
**Symptoms:** Admin users redirected from admin routes
**Check:** Verify role assignment and `checkRole()` function
**Fix:** Ensure roles are properly fetched and stored in auth store

### Issue 3: Data Leakage
**Symptoms:** Users seeing other users' data
**Check:** Test with multiple user accounts
**Fix:** Verify RLS policies are properly enforced

## 📊 Performance Testing

### Database Query Performance
Test critical queries for performance:

```sql
-- Test role lookup performance
EXPLAIN ANALYZE 
SELECT public.user_is_admin('USER_UUID_HERE');

-- Test user data access performance
EXPLAIN ANALYZE 
SELECT * FROM clients WHERE user_id = 'USER_UUID_HERE';

-- Test admin data access performance
EXPLAIN ANALYZE 
SELECT c.*, u.email as user_email
FROM clients c
JOIN auth.users u ON c.user_id = u.id
WHERE public.user_is_admin('ADMIN_USER_UUID');
```

### Frontend Performance
- [ ] Dashboard loads quickly after login
- [ ] Admin panel loads without delays
- [ ] Navigation is responsive
- [ ] No console errors related to auth/permissions

## 🎉 Test Completion Criteria

The admin functionality testing is complete when:

1. ✅ All manual test checklist items are verified
2. ✅ No RLS policy recursion errors occur
3. ✅ Performance is within acceptable limits
4. ✅ Security boundaries are properly enforced
5. ✅ Admin operations work as expected
6. ✅ Regular user restrictions are enforced

## 📝 Test Results Log

### Test Run Date: ___________
### Tester: ___________

**Results Summary:**
- [ ] PASS - All tests completed successfully
- [ ] FAIL - Issues found (document below)

**Issues Found:**
1. ________________________________
2. ________________________________
3. ________________________________

**Resolution Actions:**
1. ________________________________
2. ________________________________
3. ________________________________

---

## 🔄 Post-Test Actions

After successful testing:
1. Document any configuration changes made
2. Update user documentation if needed
3. Create backup of working database state
4. Plan for production deployment 