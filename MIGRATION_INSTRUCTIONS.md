
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
