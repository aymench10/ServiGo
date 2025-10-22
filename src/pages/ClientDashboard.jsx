import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  LogOut, 
  Search, 
  Calendar, 
  Star, 
  MessageSquare,
  Settings,
  MapPin,
  Clock,
  Heart,
  Filter,
  ChevronRight,
  User,
  Phone,
  Mail
} from 'lucide-react'
import BookingsManagement from '../components/BookingsManagement'

const ClientDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')

  // Check for tab parameter in URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Mock data
  const myBookings = [
    {
      id: 1,
      providerName: 'Ali Plomberie Services',
      service: 'Réparation fuite d\'eau',
      date: '2025-10-25',
      time: '14:00',
      status: 'confirmed',
      price: '80 DT',
      rating: null
    },
    {
      id: 2,
      providerName: 'Électricité Pro',
      service: 'Installation tableau électrique',
      date: '2025-10-20',
      time: '10:00',
      status: 'completed',
      price: '150 DT',
      rating: 5
    },
    {
      id: 3,
      providerName: 'Ménage Express',
      service: 'Nettoyage complet appartement',
      date: '2025-10-28',
      time: '09:00',
      status: 'pending',
      price: '120 DT',
      rating: null
    }
  ]

  const availableProviders = [
    {
      id: 1,
      name: 'Ali Plomberie Services',
      category: 'Plomberie',
      rating: 4.8,
      reviews: 127,
      location: 'Tunis',
      price: 'À partir de 60 DT',
      image: '👨‍🔧',
      available: true
    },
    {
      id: 2,
      name: 'Électricité Pro',
      category: 'Électricité',
      rating: 4.9,
      reviews: 203,
      location: 'Ariana',
      price: 'À partir de 80 DT',
      image: '⚡',
      available: true
    },
    {
      id: 3,
      name: 'Ménage Express',
      category: 'Ménage',
      rating: 4.7,
      reviews: 89,
      location: 'La Marsa',
      price: 'À partir de 50 DT',
      image: '🧹',
      available: false
    },
    {
      id: 4,
      name: 'Jardin Plus',
      category: 'Jardinage',
      rating: 4.6,
      reviews: 56,
      location: 'Sousse',
      price: 'À partir de 70 DT',
      image: '🌱',
      available: true
    }
  ]

  const favorites = [
    {
      id: 1,
      name: 'Ali Plomberie Services',
      category: 'Plomberie',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Électricité Pro',
      category: 'Électricité',
      rating: 4.9
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'confirmed':
        return 'Confirmé'
      case 'completed':
        return 'Terminé'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-blue-500">ServiGO</span>
                <span className="text-gray-800">TN</span>
              </span>
              <span className="text-sm text-gray-500">| Espace Client</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Trouvez et réservez les meilleurs prestataires de services
          </p>
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
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'bookings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mes réservations
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
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Paramètres
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableProviders.map((provider) => (
                    <div key={provider.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl">
                            {provider.image}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{provider.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{provider.category}</p>
                            <div className="flex items-center space-x-3 text-sm">
                              <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="ml-1 font-semibold">{provider.rating}</span>
                                <span className="text-gray-500 ml-1">({provider.reviews})</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MapPin className="w-4 h-4" />
                                <span className="ml-1">{provider.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <p className="text-sm text-gray-600">Prix</p>
                          <p className="font-semibold text-blue-600">{provider.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {provider.available && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Disponible
                            </span>
                          )}
                          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center space-x-2">
                            <span>Réserver</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <BookingsManagement userRole="client" />
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Mes prestataires favoris
                </h3>
                {favorites.length > 0 ? (
                  <div className="space-y-4">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                              <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{fav.name}</h4>
                              <p className="text-sm text-gray-600">{fav.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="ml-1 font-semibold">{fav.rating}</span>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition">
                              Réserver
                            </button>
                            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                              <Heart className="w-5 h-5 fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Vous n'avez pas encore de favoris</p>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Paramètres du compte
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        defaultValue={user?.phone}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition">
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
