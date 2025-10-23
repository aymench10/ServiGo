/**
 * Test Supabase Connection
 * Run this with: node test-supabase.js
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...\n')
console.log('📍 Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('🔑 Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
console.log('')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test 1: Check connection
console.log('Test 1: Checking connection...')
try {
  const { data, error } = await supabase.from('profiles').select('count').limit(1)
  if (error) {
    console.error('❌ Connection failed:', error.message)
  } else {
    console.log('✅ Connection successful!')
  }
} catch (err) {
  console.error('❌ Connection error:', err.message)
}

// Test 2: List all tables
console.log('\nTest 2: Checking tables...')
try {
  const { data: profiles } = await supabase.from('profiles').select('count')
  const { data: providers } = await supabase.from('provider_profiles').select('count')
  const { data: services } = await supabase.from('services').select('count')
  
  console.log('✅ Tables accessible:')
  console.log('   - profiles:', profiles ? '✅' : '❌')
  console.log('   - provider_profiles:', providers ? '✅' : '❌')
  console.log('   - services:', services ? '✅' : '❌')
} catch (err) {
  console.error('❌ Error checking tables:', err.message)
}

// Test 3: Check RLS policies
console.log('\nTest 3: Testing profile query (simulating login)...')
try {
  const testUserId = '00000000-0000-0000-0000-000000000000' // Dummy UUID
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', testUserId)
    .maybeSingle()
  
  if (error) {
    console.log('⚠️  Query returned error (expected for non-existent user):', error.message)
  } else {
    console.log('✅ Query executed successfully (no profile found, which is expected)')
  }
} catch (err) {
  console.error('❌ Query failed:', err.message)
}

console.log('\n✅ All tests completed!')
