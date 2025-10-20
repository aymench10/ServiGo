import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { MapPin, Globe, ArrowLeft } from 'lucide-react'
import Header from '../components/Header'

const SelectServiceType = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [checkingProfile, setCheckingProfile] = useState(true)

  // Check if provider profile exists
  useEffect(() => {
    checkProviderProfile()
  }, [user])

  const checkProviderProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('providers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!data && !error) {
        // No profile found, redirect to create profile
        navigate('/provider/create-profile')
        return
      }

      setCheckingProfile(false)
    } catch (err) {
      console.error('Error checking profile:', err)
      setCheckingProfile(false)
    }
  }

  if (!user || user.role !== 'provider') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Accès réservé aux prestataires</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  if (checkingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux services</span>
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quel type de service proposez-vous ?
          </h1>
          <p className="text-xl text-gray-600">
            Choisissez le type de service que vous souhaitez publier
          </p>
        </div>

        {/* Service Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Onsite Services */}
          <div
            onClick={() => navigate('/services/post/onsite')}
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Services Sur Place</h2>
              <p className="text-blue-100">
                Services physiques à domicile ou sur site
              </p>
            </div>
            
            <div className="p-8">
              <h3 className="font-semibold text-gray-900 mb-4">Exemples:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Plomberie, Électricité, Ménage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Jardinage, Peinture, Réparations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Coiffure à domicile, Événementiel</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Informations requises:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Ville</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Prix</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">Contact</span>
                </div>
              </div>

              <button className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition group-hover:shadow-lg">
                Publier un service sur place
              </button>
            </div>
          </div>

          {/* Online Services */}
          <div
            onClick={() => navigate('/services/post/online')}
            className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Services En Ligne</h2>
              <p className="text-purple-100">
                Services numériques et à distance
              </p>
            </div>
            
            <div className="p-8">
              <h3 className="font-semibold text-gray-900 mb-4">Exemples:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Développement Web, Design Graphique</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Rédaction, Traduction, Marketing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Consulting, Formation en ligne</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Informations requises:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">Délai</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">Prix</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">Portfolio</span>
                </div>
              </div>

              <button className="w-full mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition group-hover:shadow-lg">
                Publier un service en ligne
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Conseil</h3>
          <p className="text-gray-600 text-sm">
            Vous pouvez publier plusieurs services de types différents. Choisissez le type qui correspond le mieux au service que vous souhaitez proposer maintenant.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SelectServiceType
