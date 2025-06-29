-- Step 1: Create a temporary table to identify duplicates
CREATE TEMP TABLE duplicate_roles AS
SELECT 
  user_id, 
  role, 
  COUNT(*) as count,
  (array_agg(id ORDER BY created_at ASC))[1] as keep_id -- We'll keep the oldest record by created_at
FROM public.user_roles
GROUP BY user_id, role
HAVING COUNT(*) > 1;

-- Step 2: Log the duplicates for reference
DO $$
DECLARE
  dup_count integer;
  r record;
BEGIN
  SELECT COUNT(*) INTO dup_count FROM duplicate_roles;
  
  IF dup_count > 0 THEN
    RAISE NOTICE 'Found % duplicate user_role combinations', dup_count;
    
    -- Log details of duplicates
    FOR r IN SELECT * FROM duplicate_roles LOOP
      RAISE NOTICE 'Duplicate: user_id=%, role=%, count=%, keeping id=%', 
        r.user_id, r.role, r.count, r.keep_id;
    END LOOP;
  ELSE
    RAISE NOTICE 'No duplicates found in user_roles table';
  END IF;
END $$;

-- Step 3: Delete the duplicates, keeping only the oldest record for each combination
DELETE FROM public.user_roles ur
WHERE EXISTS (
  SELECT 1 FROM duplicate_roles dr
  WHERE dr.user_id = ur.user_id
  AND dr.role = ur.role
  AND dr.keep_id != ur.id
);

-- Step 4: Now try to add the unique constraint
DO $$
BEGIN
  -- Check if constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_role_key'
  ) THEN
    -- Add the constraint
    ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);
    RAISE NOTICE 'Successfully added unique constraint user_roles_user_id_role_key';
  ELSE
    RAISE NOTICE 'Constraint user_roles_user_id_role_key already exists';
  END IF;
EXCEPTION
  WHEN duplicate_table THEN
    RAISE NOTICE 'Constraint already exists';
  WHEN unique_violation THEN
    RAISE WARNING 'Still have duplicates in the table that need to be resolved';
END $$;

-- Step 5: Verify the constraint was added
DO $$
DECLARE
  constraint_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_roles_user_id_role_key'
  ) INTO constraint_exists;
  
  IF constraint_exists THEN
    RAISE NOTICE 'Verification: Unique constraint user_roles_user_id_role_key exists';
  ELSE
    RAISE WARNING 'Verification: Unique constraint user_roles_user_id_role_key does NOT exist';
  END IF;
END $$;

-- Step 6: Drop the temporary table
DROP TABLE IF EXISTS duplicate_roles;

-- Step 7: Final verification of user_roles table
DO $$
DECLARE
  total_count integer;
  distinct_count integer;
BEGIN
  -- Count total records
  SELECT COUNT(*) INTO total_count FROM public.user_roles;
  
  -- Count distinct combinations
  SELECT COUNT(*) INTO distinct_count 
  FROM (
    SELECT DISTINCT user_id, role FROM public.user_roles
  ) as distinct_roles;
  
  RAISE NOTICE 'Final verification:';
  RAISE NOTICE '  - Total records in user_roles: %', total_count;
  RAISE NOTICE '  - Distinct user_id/role combinations: %', distinct_count;
  
  IF total_count = distinct_count THEN
    RAISE NOTICE '✅ Table is now free of duplicates';
  ELSE
    RAISE WARNING '⚠️ Table still contains duplicates: % records but only % distinct combinations',
      total_count, distinct_count;
  END IF;
END $$;