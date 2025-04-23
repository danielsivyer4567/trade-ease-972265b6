# Auth Configuration Scripts

## Configure Auth Settings

This script configures Supabase Auth settings using the Management API to enhance security:
- Sets OTP expiry to 30 minutes
- Enables HaveIBeenPwned password check
- Configures additional security settings

### Prerequisites

1. Get your Supabase access token:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click on your profile icon
   - Navigate to 'Access Tokens'
   - Create a new token or copy an existing one

2. Get your project ID:
   - Open your project in the Supabase Dashboard
   - Go to Project Settings
   - Copy the 'Project ID' value

3. Get your service role key:
   - In Project Settings
   - Go to API
   - Copy the 'service_role' key

### Setup

1. Create a `.env` file in the project root:
```bash
SUPABASE_ACCESS_TOKEN=your_access_token
SUPABASE_PROJECT_ID=your_project_id
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Usage

Run the script:
```bash
npx ts-node scripts/configure-auth-settings.ts
```

### Verification

The script will:
1. Apply the new settings
2. Verify they were applied correctly
3. Log the current configuration

### Security Settings Applied

- OTP Expiry: 30 minutes (1800 seconds)
- HaveIBeenPwned Password Check: Enabled
- Additional Security:
  - Captcha: Enabled
  - Email Confirmation: Required
  - Signup: Enabled (configurable)

### Troubleshooting

If you encounter errors:
1. Verify your environment variables are set correctly
2. Ensure your access token has sufficient permissions
3. Check your project ID is correct
4. Verify your network connection to the Supabase API 