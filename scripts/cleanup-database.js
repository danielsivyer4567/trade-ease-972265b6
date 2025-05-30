// Comprehensive script to clean up all mock data from the database
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { createInterface } from 'readline';

// Load environment variables
config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or Key not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Known tables that might contain data
const tablesToClean = [
  'jobs',
  'customers',
  'invoices',
  'job_steps',
  'locations',
  'user_preferences',
  'notifications'
];

// Helper to prompt for confirmation
async function confirm(question) {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    readline.question(`${question} (yes/no): `, answer => {
      const confirmed = answer.toLowerCase() === 'yes';
      readline.close();
      resolve(confirmed);
    });
  });
}

async function cleanupDatabase() {
  try {
    console.log('🧹 Database Cleanup Utility 🧹');
    console.log('-------------------------------\n');
    
    console.log('This utility will help you clean up mock data from the database.');
    console.log('First, let\'s check what data exists:\n');
    
    // Check what tables exist and how many records they have
    const existingTables = [];
    
    for (const table of tablesToClean) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          if (error.message.includes('does not exist')) {
            console.log(`Table '${table}' doesn't exist.`);
          } else {
            console.log(`Error checking table '${table}': ${error.message}`);
          }
          continue;
        }
        
        existingTables.push({ name: table, count });
        console.log(`Table '${table}': ${count} records`);
      } catch (err) {
        console.log(`Table '${table}' might not exist or cannot be accessed`);
      }
    }
    
    if (existingTables.length === 0) {
      console.log('\nNo tables with data found. Nothing to clean up.');
      return;
    }
    
    console.log('\nWhat would you like to do?');
    console.log('1. Delete all data from all tables');
    console.log('2. Choose specific tables to clean');
    console.log('3. Exit without changes');
    
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const choice = await new Promise(resolve => {
      readline.question('\nEnter your choice (1-3): ', answer => {
        readline.close();
        resolve(answer.trim());
      });
    });
    
    switch (choice) {
      case '1':
        if (await confirm('Are you sure you want to delete ALL data from ALL tables? This cannot be undone.')) {
          console.log('\nDeleting all data...');
          
          for (const table of existingTables) {
            if (table.count > 0) {
              const { error } = await supabase
                .from(table.name)
                .delete()
                .neq('id', '');
              
              if (error) {
                console.log(`Error deleting data from '${table.name}': ${error.message}`);
              } else {
                console.log(`✅ Deleted all data from '${table.name}'`);
              }
            }
          }
          
          console.log('\nAll data has been deleted.');
        } else {
          console.log('\nOperation cancelled.');
        }
        break;
      
      case '2':
        const tablesToDelete = [];
        
        for (const table of existingTables) {
          if (table.count > 0) {
            const shouldDelete = await confirm(`Delete all data from table '${table.name}' (${table.count} records)?`);
            if (shouldDelete) {
              tablesToDelete.push(table.name);
            }
          }
        }
        
        if (tablesToDelete.length > 0) {
          console.log(`\nDeleting data from ${tablesToDelete.length} tables...`);
          
          for (const tableName of tablesToDelete) {
            const { error } = await supabase
              .from(tableName)
              .delete()
              .neq('id', '');
            
            if (error) {
              console.log(`Error deleting data from '${tableName}': ${error.message}`);
            } else {
              console.log(`✅ Deleted all data from '${tableName}'`);
            }
          }
          
          console.log('\nSelected data has been deleted.');
        } else {
          console.log('\nNo tables selected for deletion.');
        }
        break;
      
      default:
        console.log('\nExiting without changes.');
        break;
    }
    
    console.log('\nDatabase cleanup complete.');
  } catch (error) {
    console.error('\nError:', error.message);
    process.exit(1);
  }
}

// Run the function
cleanupDatabase(); 