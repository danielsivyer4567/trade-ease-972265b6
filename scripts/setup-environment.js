import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔧 Trade Ease Environment Setup Utility 🔧\n');
console.log('This utility will help you set up your environment for Trade Ease.\n');

// Function to check if Supabase CLI is installed
function checkSupabaseInstalled() {
  try {
    execSync('npx supabase --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to initialize Supabase
function initSupabase() {
  console.log('\n📦 Initializing Supabase...');
  try {
    // Check if supabase directory already exists
    if (fs.existsSync(path.join(process.cwd(), 'supabase'))) {
      console.log('Supabase directory already exists. Skipping initialization.');
      return true;
    }

    execSync('npx supabase init', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Error initializing Supabase:', error.message);
    return false;
  }
}

// Function to start Supabase
function startSupabase() {
  console.log('\n🚀 Starting Supabase...');
  try {
    execSync('npx supabase start', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Error starting Supabase:', error.message);
    return false;
  }
}

// Function to apply migrations
function applyMigrations() {
  console.log('\n📋 Applying database migrations...');
  try {
    execSync('node scripts/apply-migrations.js', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Error applying migrations:', error.message);
    return false;
  }
}

// Function to check for .env file and create if not exists
function checkEnvFile() {
  console.log('\n🔍 Checking for .env file...');
  
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('.env file exists. Checking for required variables...');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_SUPABASE_SERVICE_ROLE_KEY'
    ];
    
    let missingVars = [];
    
    for (const variable of requiredVars) {
      if (!envContent.includes(`${variable}=`)) {
        missingVars.push(variable);
      }
    }
    
    if (missingVars.length > 0) {
      console.log(`Missing environment variables: ${missingVars.join(', ')}`);
      return updateEnvFile(envPath, missingVars);
    }
    
    console.log('All required environment variables are present.');
    return true;
  } else {
    console.log('.env file does not exist. Creating...');
    return createEnvFile(envPath);
  }
}

// Function to create .env file
function createEnvFile(envPath) {
  try {
    // Get Supabase credentials
    const { url, serviceKey, anonKey } = getSupabaseCredentials();
    
    const envContent = `VITE_SUPABASE_URL=${url}
VITE_SUPABASE_ANON_KEY=${anonKey}
VITE_SUPABASE_SERVICE_ROLE_KEY=${serviceKey}

# Additional configuration
NODE_ENV=development
VITE_API_URL=http://localhost:8080/api
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('.env file created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating .env file:', error.message);
    return false;
  }
}

// Function to update .env file with missing variables
function updateEnvFile(envPath, missingVars) {
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Get Supabase credentials
    const { url, serviceKey, anonKey } = getSupabaseCredentials();
    
    for (const variable of missingVars) {
      switch (variable) {
        case 'VITE_SUPABASE_URL':
          envContent += `\nVITE_SUPABASE_URL=${url}`;
          break;
        case 'VITE_SUPABASE_ANON_KEY':
          envContent += `\nVITE_SUPABASE_ANON_KEY=${anonKey}`;
          break;
        case 'VITE_SUPABASE_SERVICE_ROLE_KEY':
          envContent += `\nVITE_SUPABASE_SERVICE_ROLE_KEY=${serviceKey}`;
          break;
      }
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('.env file updated successfully.');
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error.message);
    return false;
  }
}

// Function to get Supabase credentials from the local instance
function getSupabaseCredentials() {
  try {
    const output = execSync('npx supabase status', { encoding: 'utf-8' });
    
    // Parse the output to extract URL and keys
    const urlMatch = output.match(/API URL: (http:\/\/[^\s]+)/);
    const anonKeyMatch = output.match(/anon key: ([^\s]+)/);
    const serviceKeyMatch = output.match(/service_role key: ([^\s]+)/);
    
    if (!urlMatch || !anonKeyMatch || !serviceKeyMatch) {
      throw new Error('Could not extract Supabase credentials from output');
    }
    
    return {
      url: urlMatch[1],
      anonKey: anonKeyMatch[1],
      serviceKey: serviceKeyMatch[1]
    };
  } catch (error) {
    console.error('Error getting Supabase credentials:', error.message);
    
    // Return default localhost values
    return {
      url: 'http://localhost:54321',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
      serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
    };
  }
}

// Function to start the development server
function startDevServer() {
  console.log('\n🚀 Starting development server...');
  try {
    execSync('npm run dev', { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error('Error starting development server:', error.message);
    return false;
  }
}

// Main setup function
async function setupEnvironment() {
  // Check if Supabase CLI is installed
  if (!checkSupabaseInstalled()) {
    console.log('Supabase CLI is not installed. Installing...');
    try {
      execSync('npm install @supabase/supabase-js', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error installing Supabase dependencies:', error.message);
      process.exit(1);
    }
  }

  // Ask user if they want to initialize Supabase
  rl.question('Do you want to initialize Supabase? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      if (!initSupabase()) {
        console.error('Failed to initialize Supabase. Exiting.');
        rl.close();
        process.exit(1);
      }
      
      rl.question('Do you want to start Supabase? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          if (!startSupabase()) {
            console.error('Failed to start Supabase. Exiting.');
            rl.close();
            process.exit(1);
          }
          
          // Check for .env file
          if (!checkEnvFile()) {
            console.error('Failed to set up environment variables. Exiting.');
            rl.close();
            process.exit(1);
          }
          
          rl.question('Do you want to apply database migrations? (y/n): ', (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
              if (!applyMigrations()) {
                console.error('Failed to apply migrations. Exiting.');
                rl.close();
                process.exit(1);
              }
              
              rl.question('Do you want to start the development server? (y/n): ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                  startDevServer();
                } else {
                  console.log('\n✅ Environment setup complete! Run `npm run dev` to start the development server.');
                }
                rl.close();
              });
            } else {
              console.log('\n✅ Environment setup complete! Run `npm run db:setup` to apply migrations and `npm run dev` to start the development server.');
              rl.close();
            }
          });
        } else {
          console.log('\n✅ Environment setup complete! Run `npx supabase start` to start Supabase, `npm run db:setup` to apply migrations, and `npm run dev` to start the development server.');
          rl.close();
        }
      });
    } else {
      console.log('\n✅ Setup skipped. You can run this script again later if needed.');
      rl.close();
    }
  });
}

// Run the setup
setupEnvironment(); 