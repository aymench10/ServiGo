import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, LogIn, User, Briefcase, Bell, MessageSquare } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

const Header = () => {
  const { user } = useAuth()
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [showMessages, setShowMessages] = React.useState(false)

  // Debug: Log user state
  React.useEffect(() => {
    console.log('Header - User state:', user)
  }, [user])

  const scrollToSection = (e, sectionId) => {
    e.preventDefault()
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-blue-500">ServiGO</span>
              <span className="text-gray-800">TN</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Accueil
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Services
            </Link>
            <Link to="/tarifs" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Tarifs
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              /* Logged in - Show profile, messages, notifications */
              <>
                {/* Dashboard Button */}
                {user.role === 'client' ? (
                  <Link
                    to="/client/dashboard"
                    className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition"
                  >
                    <User className="w-5 h-5" />
                    <span>Espace Client</span>
                  </Link>
                ) : (
                  <Link
                    to="/provider/dashboard"
                    className="hidden md:flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-semibold hover:bg-purple-100 transition"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Espace Prestataire</span>
                  </Link>
                )}

                {/* Notifications */}
                <NotificationBell />

                {/* Profile Photo */}
                <Link
                  to={user.role === 'client' ? '/client/dashboard' : '/provider/dashboard'}
                  className="flex items-center space-x-2 hover:opacity-80 transition"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-gray-900">{user.full_name}</div>
                    <div className="text-xs text-gray-500">{user.role === 'client' ? 'Client' : 'Prestataire'}</div>
                  </div>
                </Link>
              </>
            ) : (
              /* Not logged in - Show login/signup */
              <>
                {/* Language selector */}
                <button className="hidden md:flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition">
                  <span className="text-sm font-medium">FR</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="font-medium">Connexion</span>
                </Link>

                <Link
                  to="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
