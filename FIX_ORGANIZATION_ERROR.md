# Fix for "Error loading organizations" Error

## Problem
You're seeing an error that says:
```
Error loading organizations
invalid UNION/INTERSECT/EXCEPT ORDER BY clause
```

This error occurs because the `get_user_organizations` database function has a SQL syntax error where it tries to use `ORDER BY` directly after a `UNION` statement, which is not allowed in PostgreSQL.

## Solution

### Quick Fix (Recommended)

1. **Open your Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/wxwbxupdisbofesaygqj
   
2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the Fix SQL**
   - Copy the entire contents of the file `fix-organization-error.sql` that was just created
   - Paste it into the SQL Editor
   - Click "Run"

This SQL file will:
- ✅ Create all required tables if they don't exist
- ✅ Add the missing `current_organization_id` column to `user_profiles`
- ✅ Fix the `get_user_organizations` function with proper ORDER BY syntax
- ✅ Set up proper permissions and indexes
- ✅ Verify that everything was created successfully

### What the Fix Does

The main issue is in the `get_user_organizations` function. The original version had:
```sql
SELECT ... FROM organizations
UNION
SELECT ... FROM agency_relationships
ORDER BY is_current DESC, organization_name;  -- ❌ This causes the error
```

The fixed version uses a CTE (Common Table Expression) to properly handle the ORDER BY:
```sql
WITH all_organizations AS (
  SELECT ... FROM organizations
  UNION
  SELECT ... FROM agency_relationships
)
SELECT * FROM all_organizations
ORDER BY is_current DESC, name;  -- ✅ This works correctly
```

### After Running the Fix

1. Refresh your application in the browser
2. The error should be gone and organizations should load properly

### If You Still Have Issues

If you continue to see errors after running the fix:

1. Check the SQL Editor output for any error messages
2. Make sure all the verification checks at the bottom show `true`
3. Try logging out and logging back in to refresh your session

### Alternative: Full Migration

If you want to ensure all database tables and functions are properly set up, you can run the complete migration from `migration-combined.sql` instead. This will create/update all database objects needed by the application. 