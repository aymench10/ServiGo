#!/usr/bin/env node

import fs from 'fs';
import { config } from 'dotenv';

config();

// Get SQL file from command line argument
const sqlFile = process.argv[2];

if (!sqlFile) {
  console.error('Usage: node run-sql.js <sql-file>');
  console.error('Example: node run-sql.js CHECK_USER_PROFILE.sql');
  process.exit(1);
}

// Check if file exists
if (!fs.existsSync(sqlFile)) {
  console.error(`Error: File "${sqlFile}" not found`);
  process.exit(1);
}

// Read SQL file
const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Get configuration from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const projectRef = supabaseUrl ? new URL(supabaseUrl).hostname.split('.')[0] : null;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!projectRef || !accessToken) {
  console.error('\n❌ Error: Missing required environment variables');
  console.error('\nRequired in .env file:');
  console.error('  - VITE_SUPABASE_URL (found: ' + (supabaseUrl ? '✓' : '✗') + ')');
  console.error('  - SUPABASE_ACCESS_TOKEN (found: ' + (accessToken ? '✓' : '✗') + ')');
  console.error('\nTo get your access token:');
  console.error('  1. Run: npx supabase login');
  console.error('  2. Get token from: https://supabase.com/dashboard/account/tokens');
  console.error('  3. Add to .env: SUPABASE_ACCESS_TOKEN=your_token_here\n');
  process.exit(1);
}

async function executeSql() {
  console.log(`\n📄 Executing SQL file: ${sqlFile}`);
  console.log(`🎯 Project: ${projectRef}\n`);
  console.log('=' .repeat(60));
  
  // Use Supabase Management API to execute SQL
  const apiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ query: sqlContent })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }
    
    console.error('\n❌ Error executing SQL:');
    console.error(JSON.stringify(errorData, null, 2));
    console.log('\n' + '='.repeat(60));
    process.exit(1);
  }

  const result = await response.json();
  
  console.log('\n✅ SQL executed successfully!\n');
  
  // Display results
  if (Array.isArray(result)) {
    result.forEach((queryResult, index) => {
      console.log(`\n📊 Query ${index + 1} Results:`);
      console.log('-'.repeat(60));
      
      if (queryResult.rows && queryResult.rows.length > 0) {
        console.table(queryResult.rows);
        console.log(`\n   Rows returned: ${queryResult.rows.length}`);
      } else if (queryResult.rows) {
        console.log('   No rows returned');
      }
      
      if (queryResult.error) {
        console.error('   Error:', queryResult.error);
      }
    });
  } else {
    console.log('Result:');
    console.log(JSON.stringify(result, null, 2));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ Execution completed\n');
}

executeSql().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
