import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
<<<<<<< HEAD
import { ChevronDown, LogIn, User, LogOut, Menu, X, Briefcase } from 'lucide-react'
=======
import { ChevronDown, LogIn, User, LogOut, Menu, X, Settings, LayoutDashboard } from 'lucide-react'
>>>>>>> a8a649f717e69da1209870eae8e5806e63b7d43f
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-blue-600">Servi</span>
              <span className="text-gray-900">GOTN</span>
            </span>
            {user && (
              <span className="hidden md:inline-block text-sm text-gray-500 ml-3 px-3 py-1 bg-gray-100 rounded-full">
                | Espace {user.role === 'provider' ? 'Prestataire' : 'Client'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors pb-1 ${
                isActive('/')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/services"
              className={`text-sm font-medium transition-colors pb-1 ${
                isActive('/services')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Services
            </Link>
            <Link
              to="/tarifs"
              className={`text-sm font-medium transition-colors pb-1 ${
                isActive('/tarifs')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Tarifs
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors pb-1 ${
                isActive('/contact')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Side - User Info & Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
<<<<<<< HEAD
                {/* Notifications */}
                <NotificationBell />

                {/* Profile Photo */}
=======
                {/* Dashboard Button */}
>>>>>>> a8a649f717e69da1209870eae8e5806e63b7d43f
                <Link
                  to={user.role === 'client' ? '/client/dashboard' : '/provider/dashboard'}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Mon Espace</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 hover:opacity-80 transition"
                  >
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.full_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center relative">
                        <User className="w-6 h-6 text-white" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.full_name || user.email}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/edit-profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profil</span>
                        </Link>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false)
                            handleLogout()
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive('/')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Accueil
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive('/services')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Services
              </Link>
              <Link
                to="/tarifs"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive('/tarifs')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Tarifs
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive('/contact')
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Contact
              </Link>
              
              {user && (
                <div className="pt-3 border-t border-gray-200 mt-2">
                  <p className="px-4 py-2 text-xs text-gray-500">{user.email}</p>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
