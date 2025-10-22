import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Lire la configuration depuis supabase.js
let supabaseUrl, supabaseKey

try {
  const supabaseConfigPath = path.join(__dirname, '../src/lib/supabase.js')
  const supabaseConfig = fs.readFileSync(supabaseConfigPath, 'utf8')
  
  // Extraire l'URL
  const urlMatch = supabaseConfig.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/)
  if (urlMatch) supabaseUrl = urlMatch[1]
  
  // Extraire la clé
  const keyMatch = supabaseConfig.match(/supabaseAnonKey\s*=\s*['"]([^'"]+)['"]/)
  if (keyMatch) supabaseKey = keyMatch[1]
  
  console.log('✅ Loaded Supabase config from supabase.js')
} catch (error) {
  console.error('❌ Error reading supabase.js:', error.message)
}

// Fallback sur les variables d'environnement
if (!supabaseUrl) supabaseUrl = process.env.VITE_SUPABASE_URL
if (!supabaseKey) supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Could not find Supabase credentials')
  console.error('   Please check src/lib/supabase.js or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
    if (error) throw error
    return data
  } catch (error) {
    // Si la fonction RPC n'existe pas, on utilise une approche différente
    console.log('⚠️  RPC not available, using direct queries...')
    return null
  }
}

async function fixBookings() {
  console.log('🔧 Starting bookings fix...\n')

  try {
    // Étape 1 : Supprimer les contraintes
    console.log('📝 Step 1: Removing foreign key constraints...')
    
    const dropConstraints = `
      ALTER TABLE bookings_onsite DROP CONSTRAINT IF EXISTS fk_provider;
      ALTER TABLE bookings_onsite DROP CONSTRAINT IF EXISTS bookings_onsite_provider_id_fkey;
      ALTER TABLE bookings_online DROP CONSTRAINT IF EXISTS fk_provider;
      ALTER TABLE bookings_online DROP CONSTRAINT IF EXISTS bookings_online_provider_id_fkey;
    `
    
    // Note: Les ALTER TABLE ne fonctionnent pas via le client JS standard
    // On doit utiliser une approche différente
    
    console.log('⚠️  Note: Foreign key constraints must be removed manually via SQL Editor')
    console.log('   Run this in Supabase SQL Editor:')
    console.log('   ' + dropConstraints.replace(/\n/g, '\n   '))
    console.log('')

    // Étape 2 : Corriger les provider_id pour bookings_onsite
    console.log('📝 Step 2: Fixing provider_id in bookings_onsite...')
    
    // Récupérer tous les bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings_onsite')
      .select('id, service_id')
    
    if (bookingsError) throw bookingsError
    
    console.log(`   Found ${bookings.length} bookings to fix`)
    
    // Pour chaque booking, récupérer le service et mettre à jour le provider_id
    let fixed = 0
    for (const booking of bookings) {
      const { data: service, error: serviceError } = await supabase
        .from('services_onsite')
        .select('provider_id')
        .eq('id', booking.service_id)
        .single()
      
      if (serviceError) {
        console.log(`   ⚠️  Could not find service ${booking.service_id}`)
        continue
      }
      
      // Mettre à jour le booking
      const { error: updateError } = await supabase
        .from('bookings_onsite')
        .update({ provider_id: service.provider_id })
        .eq('id', booking.id)
      
      if (updateError) {
        console.log(`   ❌ Error updating booking ${booking.id}:`, updateError.message)
      } else {
        fixed++
      }
    }
    
    console.log(`   ✅ Fixed ${fixed} bookings\n`)

    // Étape 3 : Vérification
    console.log('📝 Step 3: Verification...')
    
    const { data: stats, error: statsError } = await supabase
      .from('bookings_onsite')
      .select('provider_id')
    
    if (statsError) throw statsError
    
    const uniqueProviders = new Set(stats.map(b => b.provider_id)).size
    
    console.log(`   Total bookings: ${stats.length}`)
    console.log(`   Unique providers: ${uniqueProviders}`)
    
    // Compter par provider
    const providerCounts = {}
    stats.forEach(b => {
      providerCounts[b.provider_id] = (providerCounts[b.provider_id] || 0) + 1
    })
    
    console.log('\n📊 Bookings per provider:')
    for (const [providerId, count] of Object.entries(providerCounts)) {
      console.log(`   Provider ${providerId}: ${count} booking(s)`)
    }
    
    console.log('\n✅ Fix completed successfully!')
    console.log('\n🎯 Next steps:')
    console.log('   1. Refresh your dashboard (F5)')
    console.log('   2. Check the console for booking logs')
    console.log('   3. Verify that bookings appear correctly')
    
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

// Exécuter le script
fixBookings()
