import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_PROJECT_ID || !SUPABASE_ACCESS_TOKEN) {
  console.error('Missing required environment variables');
  process.exit(1);
}

async function configureAuthSettings() {
  try {
    // Create Management API client
    const managementApiUrl = 'https://api.supabase.com/v1';
    const headers = {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    };

    // Update Auth Settings
    const authConfigResponse = await fetch(
      `${managementApiUrl}/projects/${SUPABASE_PROJECT_ID}/config/auth`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          // Set OTP expiry to 30 minutes (1800 seconds)
          otp_lifetime_seconds: 1800,
          // Enable HaveIBeenPwned password check
          hibp_enabled: true,
          // Additional recommended security settings
          security: {
            captcha_enabled: true,
            disable_signup: false,
            email_confirmation_required: true
          }
        })
      }
    );

    if (!authConfigResponse.ok) {
      throw new Error(`Failed to update auth settings: ${authConfigResponse.statusText}`);
    }

    const result = await authConfigResponse.json();
    console.log('Successfully updated auth settings:', result);

    // Verify the settings were applied
    const verifyResponse = await fetch(
      `${managementApiUrl}/projects/${SUPABASE_PROJECT_ID}/config/auth`,
      {
        headers
      }
    );

    if (!verifyResponse.ok) {
      throw new Error(`Failed to verify settings: ${verifyResponse.statusText}`);
    }

    const verifyResult = await verifyResponse.json();
    console.log('Current auth settings:', {
      otp_lifetime_seconds: verifyResult.otp_lifetime_seconds,
      hibp_enabled: verifyResult.hibp_enabled,
      security: verifyResult.security
    });

  } catch (error) {
    console.error('Error configuring auth settings:', error);
    process.exit(1);
  }
}

// Run the configuration
configureAuthSettings(); 