// Script to delete all mock jobs from Supabase
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

async function deleteAllJobs() {
  try {
    console.log('Starting deletion of all jobs from database...');
    
    // Fetch all jobs to confirm how many will be deleted
    const { data: jobs, error: fetchError } = await supabase
      .from('jobs')
      .select('id, title, customer');
    
    if (fetchError) {
      throw new Error(`Error fetching jobs: ${fetchError.message}`);
    }
    
    console.log(`Found ${jobs.length} jobs in the database`);
    
    if (jobs.length === 0) {
      console.log('No jobs to delete.');
      return;
    }
    
    // Log the jobs that will be deleted
    console.log('Jobs to be deleted:');
    jobs.forEach(job => {
      console.log(`- ID: ${job.id}, Title: ${job.title || 'No title'}, Customer: ${job.customer || 'No customer'}`);
    });
    
    // Confirm deletion
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    await new Promise(resolve => {
      readline.question('Are you sure you want to delete ALL jobs? This cannot be undone. (yes/no): ', answer => {
        if (answer.toLowerCase() !== 'yes') {
          console.log('Operation cancelled.');
          process.exit(0);
        }
        readline.close();
        resolve();
      });
    });
    
    // Delete all jobs
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .neq('id', '');
    
    if (deleteError) {
      throw new Error(`Error deleting jobs: ${deleteError.message}`);
    }
    
    console.log(`Successfully deleted ${jobs.length} jobs from the database`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the function
deleteAllJobs(); 