// Script to check for mock data in various tables
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

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

// Tables that might contain mock data
const tablesToCheck = [
  'jobs',
  'customers',
  'quotes',
  'invoices',
  'site_audits',
  'teams'
];

async function checkMockData() {
  try {
    console.log('Checking for mock data in the database...\n');
    
    for (const table of tablesToCheck) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact' });
        
        if (error) {
          console.log(`Error checking table '${table}': ${error.message}`);
          continue;
        }
        
        console.log(`Table '${table}': ${count} records`);
        
        if (count > 0 && data) {
          console.log(`First 3 records in '${table}':`);
          data.slice(0, 3).forEach((record, index) => {
            console.log(`  ${index + 1}. ID: ${record.id}, ${Object.entries(record)
              .filter(([key]) => key !== 'id' && record[key] !== null)
              .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value).substring(0, 30) + '...' : value}`)
              .slice(0, 3)
              .join(', ')}`);
          });
          console.log();
        }
      } catch (err) {
        console.log(`Table '${table}' might not exist or cannot be accessed`);
      }
    }
    
    console.log('\nCheck complete.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the function
checkMockData(); 