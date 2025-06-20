#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
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
  migrationsPath: './supabase/migrations',
  projectRef: 'wxwbxupdisbofesaygqj', // From supabase/config.toml
  environment: process.env.NODE_ENV || 'development'
};

// Get list of migration files
function getMigrationFiles() {
  try {
    const files = fs.readdirSync(config.migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    log.info(`Found ${files.length} migration files`);
    return files;
  } catch (error) {
    log.error(`Error reading migrations directory: ${error.message}`);
    return [];
  }
}

// Check if Supabase CLI is installed
function checkSupabaseCLI() {
  try {
    execSync('npx supabase --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Link Supabase project
function linkProject() {
  try {
    log.info('Linking Supabase project...');
    execSync(`npx supabase link --project-ref ${config.projectRef}`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log.success('Project linked successfully');
    return true;
  } catch (error) {
    log.error(`Failed to link project: ${error.message}`);
    return false;
  }
}

// Deploy migrations using Supabase CLI
function deployMigrationsCLI() {
  try {
    log.info('Deploying migrations using Supabase CLI...');
    execSync('npx supabase db push', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log.success('Migrations deployed successfully via CLI');
    return true;
  } catch (error) {
    log.error(`Failed to deploy migrations via CLI: ${error.message}`);
    return false;
  }
}

// Generate manual migration SQL
function generateManualMigrationSQL() {
  const migrationFiles = getMigrationFiles();
  let combinedSQL = '';
  
  log.info('Generating combined migration SQL...');
  
  migrationFiles.forEach(file => {
    const filePath = path.join(config.migrationsPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    log.info(`Processing: ${file}`);
    combinedSQL += `-- Migration: ${file}\n`;
    combinedSQL += content;
    combinedSQL += '\n\n';
  });
  
  const outputPath = './migration-combined.sql';
  fs.writeFileSync(outputPath, combinedSQL);
  
  log.success(`Combined migration SQL saved to: ${outputPath}`);
  return outputPath;
}

// Generate migration instructions
function generateInstructions() {
  const instructions = `
# Database Migration Instructions

## Option 1: Supabase Dashboard (Recommended for Production)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/${config.projectRef}
2. Navigate to SQL Editor
3. Copy the contents of \`migration-combined.sql\`
4. Paste and execute the SQL

## Option 2: Supabase CLI (Development)

Run the following command:
\`\`\`bash
npm run deploy:migrations
\`\`\`

## Option 3: Individual Migrations

If you prefer to run migrations individually, execute them in this order:

${getMigrationFiles().map(file => `- ${file}`).join('\n')}

## Verification

After migration, verify the following tables exist:
- ncc_codes
- subscription_features (with ncc_voice_search feature)
- user_subscriptions
- feature_requests

## Rollback (if needed)

To rollback, you can drop the tables:
\`\`\`sql
DROP TABLE IF EXISTS ncc_codes CASCADE;
\`\`\`
`;

  fs.writeFileSync('./MIGRATION_INSTRUCTIONS.md', instructions);
  log.success('Migration instructions saved to: MIGRATION_INSTRUCTIONS.md');
}

// Main deployment function
function deployMigrations() {
  log.header('🚀 TradeEase Database Migration Deployer');
  
  log.info(`Environment: ${config.environment}`);
  log.info(`Project Ref: ${config.projectRef}`);
  
  // Check if Supabase CLI is available
  if (!checkSupabaseCLI()) {
    log.warning('Supabase CLI not found. Generating manual migration files...');
    generateManualMigrationSQL();
    generateInstructions();
    return;
  }
  
  // Try CLI deployment first
  if (linkProject()) {
    if (deployMigrationsCLI()) {
      log.success('Migration completed successfully!');
      return;
    }
  }
  
  // Fallback to manual migration
  log.warning('CLI deployment failed. Generating manual migration files...');
  generateManualMigrationSQL();
  generateInstructions();
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'generate':
    generateManualMigrationSQL();
    generateInstructions();
    break;
  case 'link':
    linkProject();
    break;
  case 'deploy':
    deployMigrations();
    break;
  default:
    log.header('TradeEase Migration Script');
    log.info('Usage:');
    log.info('  node scripts/deploy-migrations.js deploy    - Deploy all migrations');
    log.info('  node scripts/deploy-migrations.js generate  - Generate manual migration files');
    log.info('  node scripts/deploy-migrations.js link      - Link Supabase project');
    break;
} 