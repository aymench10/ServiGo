import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  Search, 
  Calendar, 
  Star, 
  MapPin,
  Heart,
  Filter,
  ChevronRight,
  Briefcase,
  TrendingUp,
  Award,
  Users
} from 'lucide-react'
import Header from '../components/Header'

const ClientDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [providers, setProviders] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadProviders()
      loadFavorites()
    }
  }, [user])

  const loadProviders = async () => {
    try {
      const { data: onsiteData } = await supabase
        .from('services_onsite')
        .select(`
          *,
          providers (
            id,
            user_id,
            full_name,
            email,
            phone,
            city,
            category,
            profile_image
          )
        `)
        .limit(10)

      const { data: onlineData } = await supabase
        .from('services_online')
        .select(`
          *,
          providers (
            id,
            user_id,
            full_name,
            email,
            phone,
            city,
            category,
            profile_image
          )
        `)
        .limit(10)

      const allProviders = [
        ...(onsiteData || []).map(s => ({ ...s, service_type: 'onsite' })),
        ...(onlineData || []).map(s => ({ ...s, service_type: 'online' }))
      ]

      setProviders(allProviders)
    } catch (error) {
      console.error('Error loading providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = async () => {
    try {
      const { data } = await supabase
        .from('favorites')
        .select(`
          *,
          providers (
            id,
            user_id,
            full_name,
            city,
            category,
            profile_image
          )
        `)
        .eq('client_id', user.id)

      setFavorites(data || [])
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const toggleFavorite = async (providerId) => {
    try {
      const isFavorite = favorites.some(f => f.provider_id === providerId)

      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('client_id', user.id)
          .eq('provider_id', providerId)
      } else {
        await supabase
          .from('favorites')
          .insert({
            client_id: user.id,
            provider_id: providerId
          })
      }

      loadFavorites()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const isFavorite = (providerId) => {
    return favorites.some(f => f.provider_id === providerId)
  }

  const filteredProviders = providers.filter(provider => {
    const searchLower = searchQuery.toLowerCase()
    return (
      provider.title?.toLowerCase().includes(searchLower) ||
      provider.providers?.full_name?.toLowerCase().includes(searchLower) ||
      provider.category?.toLowerCase().includes(searchLower)
    )
  })


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bonjour! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Trouvez et réservez les meilleurs prestataires de services
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Services disponibles</p>
                <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Favoris</p>
                <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Note moyenne</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prestataires actifs</p>
                <p className="text-2xl font-bold text-gray-900">150+</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('browse')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'browse'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Parcourir les services
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'favorites'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Favoris
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Browse Tab */}
            {activeTab === 'browse' && (
              <div>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher un service ou prestataire..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2">
                      <Filter className="w-5 h-5" />
                      <span>Filtres</span>
                    </button>
                  </div>
                </div>

                {/* Providers Grid */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : filteredProviders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProviders.map((service) => (
                      <div key={service.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                        {/* Service Image */}
                        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                          {service.image ? (
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Briefcase className="w-16 h-16 text-blue-600" />
                            </div>
                          )}
                          <button
                            onClick={() => toggleFavorite(service.providers?.id)}
                            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${
                              isFavorite(service.providers?.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${isFavorite(service.providers?.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Service Info */}
                        <div className="p-6">
                          <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                            
                            {/* Provider Info */}
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {service.providers?.full_name?.charAt(0) || 'P'}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{service.providers?.full_name}</p>
                                <p className="text-xs text-gray-500">{service.category}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                <span className="font-semibold">4.8</span>
                              </div>
                              {service.city && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  <span>{service.city}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Price and CTA */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500">À partir de</p>
                              <p className="text-xl font-bold text-blue-600">{service.price} <span className="text-sm font-normal">DT</span></p>
                            </div>
                            <button
                              onClick={() => navigate(`/service/${service.service_type}/${service.id}`)}
                              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                            >
                              <span>Réserver</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Aucun service trouvé</p>
                  </div>
                )}
              </div>
            )}


            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Mes prestataires favoris
                </h3>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3">
                            {fav.providers?.profile_image ? (
                              <img
                                src={fav.providers.profile_image}
                                alt={fav.providers.full_name}
                                className="w-14 h-14 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                  {fav.providers?.full_name?.charAt(0) || 'P'}
                                </span>
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">{fav.providers?.full_name}</h4>
                              <p className="text-sm text-gray-600">{fav.providers?.category}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFavorite(fav.provider_id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Heart className="w-5 h-5 fill-current" />
                          </button>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{fav.providers?.city || 'Tunisie'}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
                            <span className="font-semibold">4.8</span>
                            <span className="text-gray-500 ml-1">(120+ avis)</span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/provider/${fav.provider_id}`)}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          Voir le profil
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun favori</h3>
                    <p className="text-gray-600 mb-6">Commencez à ajouter des prestataires à vos favoris</p>
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      Parcourir les services
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
