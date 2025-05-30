# Database Cleanup Scripts

This directory contains scripts to manage and clean up data in the Trade Ease database.

## Available Scripts

### 1. Delete Mock Jobs

```
node scripts/delete-mock-jobs.js
```

This script deletes all jobs from the database. It will:
- Fetch all jobs from the database
- Show the list of jobs to be deleted
- Ask for confirmation before deleting
- Delete all jobs if confirmed

### 2. Check Mock Data

```
node scripts/check-mock-data.js
```

This script checks for mock data in various tables:
- jobs
- customers
- quotes
- invoices
- site_audits
- teams

It displays the number of records in each table and shows details for the first 3 records.

### 3. Database Cleanup Utility

```
node scripts/cleanup-database.js
```

This is a comprehensive utility that allows you to:
- View all existing data across multiple tables
- Delete all data from all tables
- Choose specific tables to clean
- Safely exit without making changes

## Usage

When running these scripts, make sure:
1. You have the required environment variables set (Supabase URL and key)
2. You understand that data deletion is permanent and cannot be undone
3. You have proper backup of any important data

## Warning

⚠️ These scripts are designed to delete data. They should only be used in development or when you intentionally want to clear data from the database. Always back up important data before running these scripts. 