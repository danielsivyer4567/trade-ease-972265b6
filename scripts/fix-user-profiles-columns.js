import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixUserProfilesColumns() {
  console.log('Checking and fixing user_profiles table columns...');

  try {
    // Check if columns exist
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'user_profiles' });

    if (columnsError) {
      console.error('Error checking columns:', columnsError);
      
      // If the function doesn't exist, try to check directly
      const { data: testData, error: testError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.error('Error accessing user_profiles table:', testError);
        return;
      }
    }

    // Apply the missing columns from the multi_business_system migration
    const alterTableSQL = `
      -- Add missing columns to user_profiles table
      ALTER TABLE user_profiles 
      ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free_starter' 
        CHECK (subscription_tier IN ('free_starter', 'growing_pain_relief', 'premium_edge', 'skeleton_key')),
      ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS max_organizations INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS max_team_members INTEGER DEFAULT 5,
      ADD COLUMN IF NOT EXISTS current_organization_id UUID REFERENCES organizations(id),
      ADD COLUMN IF NOT EXISTS subscription_features JSONB DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ DEFAULT now(),
      ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ;

      -- Create index for current organization
      CREATE INDEX IF NOT EXISTS idx_user_profiles_current_org 
      ON user_profiles(current_organization_id);
    `;

    // Execute the SQL
    const { error: alterError } = await supabase.rpc('execute_sql', { 
      sql: alterTableSQL 
    });

    if (alterError) {
      console.error('Error altering table:', alterError);
      
      // Try a different approach - execute each ALTER separately
      const alterCommands = [
        `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free_starter' CHECK (subscription_tier IN ('free_starter', 'growing_pain_relief', 'premium_edge', 'skeleton_key'))`,
        `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active'`,
        `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS max_organizations INTEGER DEFAULT 1`,
        `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS max_team_members INTEGER DEFAULT 5`,
        `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS current_organization_id UUID REFERENCES organizations(id)`,
        `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_features JSONB DEFAULT '{}'::jsonb`,
        `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ DEFAULT now()`,
        `ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_ends_at TIMESTAMPTZ`,
      ];

      for (const command of alterCommands) {
        try {
          const { error } = await supabase.rpc('execute_sql', { sql: command });
          if (error) {
            console.error(`Error executing: ${command}`, error);
          } else {
            console.log(`Successfully executed: ${command.substring(0, 50)}...`);
          }
        } catch (err) {
          console.error(`Failed to execute: ${command}`, err);
        }
      }
    } else {
      console.log('Successfully added missing columns to user_profiles table');
    }

    // Verify the columns were added
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('subscription_tier, max_organizations, current_organization_id, subscription_features')
      .limit(1);

    if (verifyError) {
      console.error('Columns still missing after fix attempt:', verifyError);
    } else {
      console.log('Verification successful - columns are now available');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the fix
fixUserProfilesColumns(); 