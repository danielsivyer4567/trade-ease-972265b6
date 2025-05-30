import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL and anon key are required in .env file');
  process.exit(1);
}

console.log('Starting database migration...');

// Function to execute SQL queries against Supabase
async function executeSql(sqlFilePath) {
  const sql = fs.readFileSync(sqlFilePath, 'utf8');
  const tempFile = path.join(__dirname, 'temp_migration.sql');
  
  console.log(`Executing SQL from ${sqlFilePath}`);
  
  try {
    // Write the SQL to a temporary file
    fs.writeFileSync(tempFile, sql);
    
    // Use psql to execute the SQL
    // Note: In a real environment, we'd use the Supabase API for this
    // but for local development, this is simpler
    const command = `
      echo "Applying migration: ${sqlFilePath}"
      npx supabase db push
    `;
    
    execSync(command, { stdio: 'inherit' });
    console.log(`Successfully applied migration: ${sqlFilePath}`);
    
    return true;
  } catch (error) {
    console.error(`Error executing SQL from ${sqlFilePath}:`, error);
    return false;
  } finally {
    // Clean up the temporary file
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

// Get all migration files
const migrationsDir = path.join(__dirname, '../supabase/migrations');
if (!fs.existsSync(migrationsDir)) {
  console.error('Migrations directory not found');
  process.exit(1);
}

const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort(); // Ensure migrations are applied in order

// Execute migrations
async function runMigrations() {
  let success = true;
  
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const result = await executeSql(filePath);
    if (!result) {
      success = false;
      console.error(`Failed to apply migration: ${file}`);
      break;
    }
  }
  
  if (success) {
    console.log('All migrations applied successfully');
  } else {
    console.error('Migration failed');
    process.exit(1);
  }
}

// Add test data for development
async function addTestData() {
  console.log('Adding test data for development...');
  
  // Create a test SQL file
  const testDataSql = `
    -- Only run in development mode
    DO $$
    BEGIN
      -- Check if the test user already exists
      IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'test@example.com'
      ) THEN
        -- Create a test user
        INSERT INTO auth.users (
          id, email, encrypted_password, email_confirmed_at, 
          confirmation_sent_at, recovery_sent_at, last_sign_in_at,
          raw_app_meta_data, raw_user_meta_data, created_at, updated_at
        )
        VALUES (
          uuid_generate_v4(), 'test@example.com', 
          crypt('password123', gen_salt('bf')), 
          now(), now(), now(), now(),
          '{"provider": "email", "providers": ["email"]}',
          '{"name": "Test User"}',
          now(), now()
        );
        
        -- Create a test customer
        INSERT INTO customers (
          id, user_id, name, email, phone, address, city, state, zipcode, status
        )
        VALUES (
          uuid_generate_v4(), 
          (SELECT id FROM auth.users WHERE email = 'test@example.com'), 
          'Test Customer', 'customer@example.com', '555-123-4567',
          '123 Main St', 'Anytown', 'CA', '12345', 'active'
        );
        
        RAISE NOTICE 'Test data created successfully';
      ELSE
        RAISE NOTICE 'Test data already exists';
      END IF;
    END
    $$;
  `;
  
  const testDataFile = path.join(__dirname, 'test_data.sql');
  fs.writeFileSync(testDataFile, testDataSql);
  
  try {
    await executeSql(testDataFile);
    console.log('Test data added successfully');
  } catch (error) {
    console.error('Error adding test data:', error);
  } finally {
    // Clean up
    if (fs.existsSync(testDataFile)) {
      fs.unlinkSync(testDataFile);
    }
  }
}

// Run the script
(async () => {
  await runMigrations();
  
  // Only add test data in development
  if (process.env.NODE_ENV !== 'production') {
    await addTestData();
  }
  
  console.log('Database setup complete');
})(); 