const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Setting up database...');

try {
  // Check if supabase CLI is installed
  try {
    execSync('supabase --version', { stdio: 'inherit' });
  } catch (error) {
    console.error('Supabase CLI is not installed. Please install it first:');
    console.log('npm install -g supabase');
    process.exit(1);
  }

  // Run migrations
  console.log('Running migrations...');
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  // Check if migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }
  
  // Get all SQL files in migrations directory
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
    
  if (migrationFiles.length === 0) {
    console.error('No migration files found');
    process.exit(1);
  }
  
  console.log(`Found ${migrationFiles.length} migration files`);
  
  // Execute migrations using supabase CLI
  try {
    execSync('supabase db reset', { stdio: 'inherit' });
    console.log('Migrations applied successfully');
  } catch (error) {
    console.error('Failed to apply migrations:');
    console.error(error.message);
    
    // Alternative method: Show instructions for manual execution
    console.log('\nAlternative: You can run the SQL manually in the Supabase dashboard:');
    console.log('1. Go to https://app.supabase.io/');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the contents of each migration file:');
    
    migrationFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
  }
  
  console.log('Database setup complete!');
} catch (error) {
  console.error('Error setting up database:', error);
  process.exit(1);
} 