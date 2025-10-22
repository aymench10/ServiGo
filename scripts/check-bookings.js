import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ghgsxxtempycioizizor.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ3N4eHRlbXB5Y2lvaXppem9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTU0MDIsImV4cCI6MjA3NjM5MTQwMn0.mgHeDt5r3NPP3oTqrKVLbC-_p-pkor606mHjFTLLqxY'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function checkAll() {
  console.log('🔍 Checking all tables...\n')

  // 1. Vérifier bookings_onsite
  console.log('📋 Table: bookings_onsite')
  const { data: onsite, error: onsiteError } = await supabase
    .from('bookings_onsite')
    .select('*')
  
  if (onsiteError) {
    console.log('   ❌ Error:', onsiteError.message)
  } else {
    console.log(`   ✅ Found ${onsite.length} bookings`)
    if (onsite.length > 0) {
      console.log('   First booking:', onsite[0])
    }
  }

  // 2. Vérifier bookings_online
  console.log('\n📋 Table: bookings_online')
  const { data: online, error: onlineError } = await supabase
    .from('bookings_online')
    .select('*')
  
  if (onlineError) {
    console.log('   ❌ Error:', onlineError.message)
  } else {
    console.log(`   ✅ Found ${online.length} bookings`)
    if (online.length > 0) {
      console.log('   First booking:', online[0])
    }
  }

  // 3. Vérifier services_onsite
  console.log('\n📋 Table: services_onsite')
  const { data: services, error: servicesError } = await supabase
    .from('services_onsite')
    .select('id, title, provider_id')
  
  if (servicesError) {
    console.log('   ❌ Error:', servicesError.message)
  } else {
    console.log(`   ✅ Found ${services.length} services`)
    if (services.length > 0) {
      console.log('   First service:', services[0])
    }
  }

  // 4. Vérifier providers
  console.log('\n📋 Table: providers')
  const { data: providers, error: providersError } = await supabase
    .from('providers')
    .select('id, user_id, full_name, email')
  
  if (providersError) {
    console.log('   ❌ Error:', providersError.message)
  } else {
    console.log(`   ✅ Found ${providers.length} providers`)
    if (providers.length > 0) {
      console.log('   First provider:', providers[0])
    }
  }

  // 5. Vérifier auth.users
  console.log('\n📋 Auth Users')
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError) {
    console.log('   ❌ Not authenticated')
  } else if (user) {
    console.log('   ✅ Current user:', user.email, '| ID:', user.id)
  } else {
    console.log('   ⚠️  No user logged in')
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 SUMMARY')
  console.log('='.repeat(50))
  console.log(`Bookings Onsite: ${onsite?.length || 0}`)
  console.log(`Bookings Online: ${online?.length || 0}`)
  console.log(`Services: ${services?.length || 0}`)
  console.log(`Providers: ${providers?.length || 0}`)
  console.log('='.repeat(50))
}

checkAll()
