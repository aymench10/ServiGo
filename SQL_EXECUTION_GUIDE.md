# SQL Execution Guide

This guide explains how to run SQL queries directly in Supabase using the CLI, without manually copying to the SQL editor.

## Setup (One-time)

### 1. Login to Supabase CLI

```bash
npm run supabase:login
```

This will:
- Open your browser for authentication
- Save your access token locally

### 2. Get Your Access Token (Alternative Method)

If the login command doesn't work, you can manually get your token:

1. Go to: https://supabase.com/dashboard/account/tokens
2. Generate a new access token
3. Add it to your `.env` file:

```env
SUPABASE_ACCESS_TOKEN=your_token_here
```

## Usage

### Run Any SQL File

```bash
npm run sql <filename.sql>
```

### Examples

```bash
# Run the user profile check
npm run sql CHECK_USER_PROFILE.sql

# Run any other SQL file
npm run sql FIX_RLS_ALL_TABLES.sql
npm run sql SETUP_STORAGE.sql
```

### Direct Node Command

You can also run directly:

```bash
node run-sql.js CHECK_USER_PROFILE.sql
```

## How It Works

The `run-sql.js` script:
1. Reads your SQL file
2. Uses the Supabase Management API to execute it
3. Displays results in a formatted table
4. Shows any errors with helpful messages

## Features

✅ Execute multiple SQL statements in one file  
✅ See query results in formatted tables  
✅ Automatic error handling and reporting  
✅ Works with all SQL files in your project  
✅ No need to copy/paste into the dashboard  

## Troubleshooting

### "Access token not provided"

Run `npm run supabase:login` or add `SUPABASE_ACCESS_TOKEN` to your `.env` file.

### "Project not found"

Make sure `VITE_SUPABASE_URL` is correctly set in your `.env` file.

### "Permission denied"

Your access token needs admin permissions. Generate a new one from the Supabase dashboard.

## Environment Variables Required

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ACCESS_TOKEN=your_access_token_here
```
