# Database Migration Instructions

## Option 1: Supabase Dashboard (Recommended for Production)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/wxwbxupdisbofesaygqj
2. Navigate to SQL Editor
3. Copy the contents of `migration-combined.sql`
4. Paste and execute the SQL

## Option 2: Supabase CLI (Development)

Run the following command:
```bash
npm run deploy:migrations
```

## Option 3: Individual Migrations

If you prefer to run migrations individually, execute them in this order:

- 001_create_custom_templates_table.sql
- 20231002_customer_journey.sql
- 20240000000000_workflow_nodes.sql
- 20240320000000_create_integration_configs.sql
- 20240320000000_email_system.sql
- 20240320_make_job_number_required.sql
- 20240321000000_add_client_secret_to_integration_configs.sql
- 20240321000000_create_workflow_tables.sql
- 20240321000001_add_xero_token_fields.sql
- 20240321000001_create_logs_table.sql
- 20240321000001_create_workflow_executions.sql
- 20240321000002_create_workflow_schedules_table.sql
- 20240321000002_fix_rls_policies.sql
- 20240321000003_create_integrations_table.sql
- 20240321000004_create_webhooks_table.sql
- 20240321000005_create_user_configuration_trigger.sql
- 20240420000000_create_roles_system.sql
- 20240501000000_create_two_factor_auth.sql
- 20240520000001_create_docuseal_submissions_table.sql
- 20240522000001_create_join_requests.sql
- 20240522000002_create_join_request_functions.sql
- 20240601000000_create_user_profiles_table.sql
- 20240601_add_customer_addresses.sql
- 20240608_user_profiles.sql
- 20240701_add_customer_id.sql
- 20250122000000_multi_business_system.sql
- 20250122000001_subscription_features.sql
- 20250122000002_create_user_subscriptions_table.sql
- 20250122000002_enhance_subscription_features.sql
- 20250123000000_create_ncc_codes_table.sql
- 20250124000000_create_qbcc_forms_table.sql
- 20250124000001_create_timber_queensland_data_table.sql
- 20250124000002_add_qbcc_timber_voice_search_features.sql
- 20250124000002_add_voice_search_features.sql
- 20250529_setup_rls_policies.sql
- create_n8n_webhooks.sql
- create_n8n_webhooks_configured.sql
- create_trades_table.sql

## Verification

After migration, verify the following tables exist:
- ncc_codes
- subscription_features (with ncc_voice_search feature)
- user_subscriptions
- feature_requests

## Rollback (if needed)

To rollback, you can drop the tables:
```sql
DROP TABLE IF EXISTS ncc_codes CASCADE;
```

## Solution: Apply Database Migrations

The error is occurring because the `get_user_organizations` function hasn't been created in your database yet. This function is defined in the migration file `20250122000000_multi_business_system.sql`.

### Recommended Approach: Use Supabase Dashboard

1. **Go to your Supabase Dashboard**: 
   - Open this URL: https://supabase.com/dashboard/project/wxwbxupdisbofesaygqj
   
2. **Navigate to the SQL Editor**:
   - In the left sidebar, click on "SQL Editor"

3. **Apply the migrations**:
   - Open the file `migration-combined.sql` that was just generated in your project root
   - Copy its entire contents
   - Paste it into the SQL Editor
   - Click "Run" to execute the SQL

This will create all the necessary tables and functions, including the `get_user_organizations` function that's currently missing.

### Alternative: If you only want to fix this specific error quickly

You can run just the function creation SQL in the Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION get_user_organizations()
RETURNS TABLE (
  organization_id UUID,
  organization_name TEXT,
  role TEXT,
  access_type TEXT,
  is_current BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  -- Get organizations where user is a member
  SELECT 
    o.id,
    o.name,
    om.role,
    'member'::TEXT as access_type,
    (up.current_organization_id = o.id) as is_current
  FROM organizations o
  JOIN organization_members om ON o.id = om.organization_id
  LEFT JOIN user_profiles up ON up.user_id = auth.uid()
  WHERE om.user_id = auth.uid()
  AND o.is_active = true
  
  UNION
  
  -- Get organizations where user has agency access
  SELECT 
    o.id,
    o.name,
    'agency'::TEXT as role,
    'agency'::TEXT as access_type,
    (up.current_organization_id = o.id) as is_current
  FROM organizations o
  JOIN agency_client_relationships acr ON o.id = acr.client_organization_id
  LEFT JOIN user_profiles up ON up.user_id = auth.uid()
  WHERE acr.agency_user_id = auth.uid()
  AND acr.status = 'active'
  AND o.is_active = true
  
  ORDER BY is_current DESC, organization_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_user_organizations TO authenticated;
```

After running the migrations, refresh your application and the error should be resolved!

## Fix for the Missing Column Error

The error "column up.current_organization_id does not exist" indicates that the `user_profiles` table is missing the `current_organization_id` column. This should have been added by the migration, but it seems it wasn't applied properly.

### Quick Fix:

1. **Go to your Supabase Dashboard**: 
   - Open: https://supabase.com/dashboard/project/wxwbxupdisbofesaygqj
   
2. **Navigate to SQL Editor**

3. **Run this SQL to add the missing column**:

```sql
-- Fix for missing current_organization_id column
-- This adds the missing column to user_profiles table

-- First, check if the column exists and add it if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'current_organization_id'
    ) THEN
        ALTER TABLE user_profiles 
        ADD COLUMN current_organization_id UUID REFERENCES organizations(id);
    END IF;
END $$;

-- Also ensure the index exists
CREATE INDEX IF NOT EXISTS idx_user_profiles_current_org ON user_profiles(current_organization_id);
```

### Alternative: Run the Full Migration

If you continue to have issues, I recommend running the complete migration from the `migration-combined.sql` file that was generated. This will ensure all tables, columns, and functions are properly created.

The file `fix-current-organization-id.sql` has been created in your project root with the SQL commands needed to fix this specific issue.

After running this SQL, refresh your application and the error should be resolved!
