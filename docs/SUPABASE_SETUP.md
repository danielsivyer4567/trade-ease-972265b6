# Supabase Setup Guide for Logo Upload

## Overview
To enable company logo uploads and persistent data storage, you need to configure Supabase properly. This guide will walk you through the setup process.

## Prerequisites
- A Supabase account (free tier available)
- Access to your project's environment variables

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account or sign in
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `trade-ease` or any name you prefer
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to **Settings** → **API**
2. Find your **Project URL** and **anon public key**
3. Copy these values for the next step

## Step 3: Configure Environment Variables

1. Open your `.env` file in the project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
# Replace these with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the following SQL:

```sql
-- Create company_info table
CREATE TABLE IF NOT EXISTS company_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  abn TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_company_info_user_id ON company_info(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access their own company info
CREATE POLICY "Users can view their own company info" ON company_info
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company info" ON company_info
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company info" ON company_info
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own company info" ON company_info
  FOR DELETE USING (auth.uid() = user_id);
```

3. Click "Run" to execute the query

## Step 5: Set Up Storage

1. In your Supabase dashboard, go to **Storage**
2. Create a new bucket:
   - **Name**: `company-assets`
   - **Public**: Yes (enable public access)
3. Click "Create bucket"

## Step 6: Configure Storage Policies

1. In Storage, click on your `company-assets` bucket
2. Go to **Policies** tab
3. Create these policies by clicking "New Policy":

### Policy 1: Public Access
```sql
-- Allow public read access
CREATE POLICY "Company assets are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-assets');
```

### Policy 2: User Upload
```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own company assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'company-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Policy 3: User Update
```sql
-- Allow users to update their own files
CREATE POLICY "Users can update their own company assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'company-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Policy 4: User Delete
```sql
-- Allow users to delete their own files
CREATE POLICY "Users can delete their own company assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'company-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Step 7: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to **Settings** → **Company Information**
3. You should no longer see the "Database Configuration Required" alert
4. Try uploading a company logo - it should work!

## Troubleshooting

### Common Issues

1. **"Database Configuration Required" alert still showing**
   - Check that your `.env` file has the correct values
   - Restart your development server
   - Make sure you're not using placeholder values

2. **Logo upload fails**
   - Verify the storage bucket exists and is public
   - Check that storage policies are correctly set up
   - Look at browser console for error messages

3. **Data not saving**
   - Ensure the `company_info` table was created successfully
   - Check that RLS policies are set up correctly
   - Verify user authentication is working

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Check your Supabase project logs
3. Verify all steps were completed correctly
4. Try creating a minimal test case

## Benefits of Proper Setup

Once Supabase is configured:
- ✅ Logo uploads work seamlessly
- ✅ Data persists across sessions
- ✅ Multiple users can have separate company data
- ✅ Automatic backups and scaling
- ✅ Real-time capabilities for future features

## Local Development vs Production

This setup works for both local development and production deployments. For production, make sure to:
- Use environment variables in your deployment platform
- Never commit actual credentials to version control
- Consider using Supabase's production tier for better performance 