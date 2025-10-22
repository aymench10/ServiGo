import { createClient } from '@supabase/supabase-js'

// ⚠️ REMPLACEZ CES VALEURS PAR VOS VRAIES CREDENTIALS SUPABASE
const SUPABASE_URL = 'https://ghgsxxtempycioizizor.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ3N4eHRlbXB5Y2lvaXppem9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTU0MDIsImV4cCI6MjA3NjM5MTQwMn0.mgHeDt5r3NPP3oTqrKVLbC-_p-pkor606mHjFTLLqxY'

// Vérification
if (SUPABASE_URL.includes('YOUR_PROJECT') || SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY')) {
  console.error('❌ Error: Please edit scripts/fix-bookings-simple.js and add your Supabase credentials')
  console.error('   Find them in: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function fixBookings() {
  console.log('🔧 Starting bookings fix...\n')

  try {
    // Récupérer tous les bookings
    console.log('📝 Step 1: Loading bookings...')
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings_onsite')
      .select('id, service_id, provider_id')
    
    if (bookingsError) throw bookingsError
    
    console.log(`   Found ${bookings.length} bookings\n`)

    // Corriger chaque booking
    console.log('📝 Step 2: Fixing provider_id...')
    let fixed = 0
    let errors = 0
    
    for (const booking of bookings) {
      // Récupérer le service
      const { data: service, error: serviceError } = await supabase
        .from('services_onsite')
        .select('provider_id')
        .eq('id', booking.service_id)
        .single()
      
      if (serviceError) {
        console.log(`   ⚠️  Service not found for booking ${booking.id}`)
        errors++
        continue
      }
      
      // Vérifier si le provider_id est déjà correct
      if (booking.provider_id === service.provider_id) {
        continue // Déjà correct
      }
      
      // Mettre à jour le booking
      const { error: updateError } = await supabase
        .from('bookings_onsite')
        .update({ provider_id: service.provider_id })
        .eq('id', booking.id)
      
      if (updateError) {
        console.log(`   ❌ Error updating booking ${booking.id}:`, updateError.message)
        errors++
      } else {
        fixed++
        console.log(`   ✅ Fixed booking ${booking.id}: provider_id = ${service.provider_id}`)
      }
    }
    
    console.log(`\n📊 Results:`)
    console.log(`   Fixed: ${fixed}`)
    console.log(`   Errors: ${errors}`)
    console.log(`   Already correct: ${bookings.length - fixed - errors}`)

    // Vérification finale
    console.log('\n📝 Step 3: Final verification...')
    const { data: stats } = await supabase
      .from('bookings_onsite')
      .select('provider_id')
    
    const uniqueProviders = new Set(stats.map(b => b.provider_id)).size
    console.log(`   Total bookings: ${stats.length}`)
    console.log(`   Unique providers: ${uniqueProviders}`)
    
    console.log('\n✅ Fix completed!')
    console.log('\n🎯 Next steps:')
    console.log('   1. Refresh your dashboard (F5)')
    console.log('   2. Bookings should now appear for each provider')
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
    process.exit(1)
  }
}

// Exécuter
fixBookings()
