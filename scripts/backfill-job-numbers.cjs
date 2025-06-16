const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or Key not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate a job number
function generateJobNumber() {
  const prefix = "JOB";
  const fourDigitNumber = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${fourDigitNumber}`;
}

async function backfillJobNumbers() {
  try {
    console.log('Starting job number backfill...');
    
    // Fetch all jobs without job numbers
    const { data: jobs, error: fetchError } = await supabase
      .from('jobs')
      .select('id, job_number')
      .is('job_number', null);
    
    if (fetchError) {
      throw new Error(`Error fetching jobs: ${fetchError.message}`);
    }
    
    console.log(`Found ${jobs.length} jobs without job numbers`);
    
    if (jobs.length === 0) {
      console.log('No jobs need backfilling.');
      return;
    }
    
    // Generate and update job numbers
    for (const job of jobs) {
      const jobNumber = generateJobNumber();
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ job_number: jobNumber })
        .eq('id', job.id);
      
      if (updateError) {
        console.error(`Error updating job ${job.id}:`, updateError);
      } else {
        console.log(`Updated job ${job.id} with number ${jobNumber}`);
      }
    }
    
    console.log('Job number backfill completed successfully');
  } catch (error) {
    console.error('Error during backfill:', error);
    process.exit(1);
  }
}

// Run the backfill
backfillJobNumbers(); 