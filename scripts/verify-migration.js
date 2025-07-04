#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`)
};

// Configuration
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_ANON_KEY,
  projectRef: 'wxwbxupdisbofesaygqj'
};

// Tables to verify
const tablesToVerify = [
  {
    name: 'ncc_codes',
    description: 'NCC Codes table',
    requiredColumns: ['id', 'code', 'title', 'description', 'category', 'keywords', 'is_active']
  },
  {
    name: 'subscription_features',
    description: 'Subscription Features table',
    requiredColumns: ['subscription_tier', 'feature_key', 'enabled', 'description']
  },
  {
    name: 'user_subscriptions',
    description: 'User Subscriptions table',
    requiredColumns: ['user_id', 'subscription_tier', 'is_active']
  },
  {
    name: 'feature_requests',
    description: 'Feature Requests table',
    requiredColumns: ['id', 'user_id', 'title', 'description', 'status']
  }
];

// Functions to verify
const functionsToVerify = [
  {
    name: 'search_ncc_codes',
    description: 'NCC search function'
  },
  {
    name: 'update_ncc_codes_updated_at',
    description: 'NCC codes update trigger function'
  }
];

// Initialize Supabase client
function createSupabaseClient() {
  if (!config.supabaseUrl || !config.supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(config.supabaseUrl, config.supabaseKey);
}

// Check if table exists
async function checkTable(supabase, tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      return { exists: false, error: error.message };
    }
    
    return { exists: true, data };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

// Check table columns
async function checkTableColumns(supabase, tableName, requiredColumns) {
  try {
    // Get a sample row to check columns
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      return { valid: false, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { valid: true, message: 'Table exists but is empty' };
    }
    
    const sampleRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in sampleRow));
    
    if (missingColumns.length > 0) {
      return { 
        valid: false, 
        error: `Missing columns: ${missingColumns.join(', ')}` 
      };
    }
    
    return { valid: true, columns: Object.keys(sampleRow) };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Check if function exists
async function checkFunction(supabase, functionName) {
  try {
    // Try to call the function with a simple query
    const { data, error } = await supabase
      .rpc(functionName, { search_query: 'test' });
    
    if (error) {
      return { exists: false, error: error.message };
    }
    
    return { exists: true, data };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

// Check NCC codes data
async function checkNCCData(supabase) {
  try {
    const { data, error } = await supabase
      .from('ncc_codes')
      .select('*')
      .limit(5);
    
    if (error) {
      return { valid: false, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { valid: false, error: 'No NCC codes found in table' };
    }
    
    return { 
      valid: true, 
      count: data.length,
      sample: data.slice(0, 3).map(code => ({
        code: code.code,
        title: code.title,
        category: code.category
      }))
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Check subscription features
async function checkSubscriptionFeatures(supabase) {
  try {
    const { data, error } = await supabase
      .from('subscription_features')
      .select('*')
      .eq('feature_key', 'ncc_voice_search');
    
    if (error) {
      return { valid: false, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { valid: false, error: 'NCC voice search feature not found' };
    }
    
    return { 
      valid: true, 
      features: data.map(f => ({
        tier: f.subscription_tier,
        enabled: f.enabled,
        description: f.description
      }))
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// Main verification function
async function verifyMigration() {
  log.header('🔍 TradeEase Migration Verification');
  
  try {
    const supabase = createSupabaseClient();
    log.info('Connected to Supabase');
    
    let allChecksPassed = true;
    
    // Verify tables
    log.header('📋 Verifying Tables');
    for (const table of tablesToVerify) {
      log.info(`Checking ${table.name}...`);
      
      const tableCheck = await checkTable(supabase, table.name);
      if (!tableCheck.exists) {
        log.error(`${table.name}: ${tableCheck.error}`);
        allChecksPassed = false;
        continue;
      }
      
      const columnCheck = await checkTableColumns(supabase, table.name, table.requiredColumns);
      if (!columnCheck.valid) {
        log.error(`${table.name}: ${columnCheck.error}`);
        allChecksPassed = false;
        continue;
      }
      
      log.success(`${table.name}: ✓ Table exists with required columns`);
    }
    
    // Verify functions
    log.header('⚙️ Verifying Functions');
    for (const func of functionsToVerify) {
      log.info(`Checking ${func.name}...`);
      
      const funcCheck = await checkFunction(supabase, func.name);
      if (!funcCheck.exists) {
        log.error(`${func.name}: ${funcCheck.error}`);
        allChecksPassed = false;
        continue;
      }
      
      log.success(`${func.name}: ✓ Function exists and is callable`);
    }
    
    // Verify NCC data
    log.header('📊 Verifying NCC Data');
    const nccCheck = await checkNCCData(supabase);
    if (!nccCheck.valid) {
      log.error(`NCC Data: ${nccCheck.error}`);
      allChecksPassed = false;
    } else {
      log.success(`NCC Data: ✓ Found ${nccCheck.count} codes`);
      log.info('Sample codes:');
      nccCheck.sample.forEach(code => {
        log.info(`  - ${code.code}: ${code.title} (${code.category})`);
      });
    }
    
    // Verify subscription features
    log.header('🔐 Verifying Subscription Features');
    const featureCheck = await checkSubscriptionFeatures(supabase);
    if (!featureCheck.valid) {
      log.error(`Subscription Features: ${featureCheck.error}`);
      allChecksPassed = false;
    } else {
      log.success('Subscription Features: ✓ NCC voice search feature configured');
      log.info('Feature configuration:');
      featureCheck.features.forEach(f => {
        log.info(`  - ${f.tier}: ${f.enabled ? 'Enabled' : 'Disabled'} - ${f.description}`);
      });
    }
    
    // Final result
    log.header('📋 Verification Summary');
    if (allChecksPassed) {
      log.success('🎉 All checks passed! Migration was successful.');
      log.info('The NCC voice search feature is ready to use.');
    } else {
      log.error('❌ Some checks failed. Please review the errors above.');
      log.info('You may need to run the migration again or check the database manually.');
    }
    
  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    process.exit(1);
  }
}

// Run verification
if (require.main === module) {
  verifyMigration();
}

module.exports = { verifyMigration }; 