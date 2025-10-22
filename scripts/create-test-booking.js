import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ghgsxxtempycioizizor.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ3N4eHRlbXB5Y2lvaXppem9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTU0MDIsImV4cCI6MjA3NjM5MTQwMn0.mgHeDt5r3NPP3oTqrKVLbC-_p-pkor606mHjFTLLqxY'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function createTestBooking() {
  console.log('🔧 Creating test booking...\n')

  try {
    // 1. Get the service
    const { data: service, error: serviceError } = await supabase
      .from('services_onsite')
      .select('*')
      .limit(1)
      .single()
    
    if (serviceError) throw serviceError
    
    console.log('✅ Found service:', service.title)
    console.log('   Service ID:', service.id)
    console.log('   Provider ID:', service.provider_id)

    // 2. Get a client (first user that's not the provider)
    const { data: providers, error: providersError } = await supabase
      .from('providers')
      .select('user_id')
    
    if (providersError) throw providersError
    
    const providerUserIds = providers.map(p => p.user_id)
    console.log('\n✅ Found', providers.length, 'providers')

    // For testing, we'll use the first provider's user_id as both provider and client
    // In real scenario, client would be a different user
    const clientId = providerUserIds[0]
    const providerId = service.provider_id

    console.log('\n📝 Creating booking with:')
    console.log('   Client ID:', clientId)
    console.log('   Provider ID:', providerId)
    console.log('   Service ID:', service.id)

    // 3. Create the booking
    const { data: booking, error: bookingError} = await supabase
      .from('bookings_onsite')
      .insert([
        {
          client_id: clientId,
          provider_id: providerId,
          service_id: service.id,
          service_type: service.category || 'General',
          location: 'Tunis, Tunisia',
          governorate: 'Tunis',
          urgency: false, // false = normal, true = urgent
          scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          client_notes: 'Test booking created by script',
          status: 'pending'
        }
      ])
      .select()
    
    if (bookingError) {
      console.error('\n❌ Error creating booking:', bookingError)
      throw bookingError
    }

    console.log('\n✅ Booking created successfully!')
    console.log('   Booking ID:', booking[0].id)
    console.log('   Status:', booking[0].status)
    console.log('   Created at:', booking[0].created_at)

    // 4. Verify
    const { data: allBookings, error: verifyError } = await supabase
      .from('bookings_onsite')
      .select('*')
    
    if (verifyError) throw verifyError

    console.log('\n📊 Total bookings in database:', allBookings.length)
    
    console.log('\n🎯 Next steps:')
    console.log('   1. Refresh your dashboard (F5)')
    console.log('   2. The booking should appear!')
    console.log('   3. Try creating more bookings via the UI')

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    console.error(error)
    process.exit(1)
  }
}

createTestBooking()
