import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  LogOut, 
  Search, 
  Calendar, 
  DollarSign, 
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
  Mail,
  Briefcase
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">
                <span className="text-blue-500">ServiGO</span>
                <span className="text-gray-800">TN</span>
              </span>
              <span className="text-sm text-gray-500">| Espace Client</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{user?.email}</div>
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
            Bienvenue! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Trouvez les meilleurs prestataires de services en Tunisie
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Découvrez nos services
                </h3>
                <p className="text-gray-600">
                  Utilisez la page <a href="/services" className="text-blue-600 hover:underline">Services</a> pour parcourir tous les services disponibles.
                </p>
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
                <p className="text-gray-600 text-center py-12">
                  Fonctionnalité à venir...
                </p>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Paramètres du compte
                </h3>
                <p className="text-gray-600 text-center py-12">
                  Fonctionnalité à venir...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
