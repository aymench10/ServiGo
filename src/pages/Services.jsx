import React, { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { ONSITE_CATEGORIES, ONLINE_CATEGORIES, TUNISIAN_CITIES } from '../constants/serviceData'
import { 
  Search, 
  Filter, 
  MapPin, 
  Tag, 
  Plus, 
  Eye,
  Phone,
  Mail,
  Edit,
  Trash2,
  X,
  Globe,
  User
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Services = () => {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all') // 'all', 'onsite', 'online'
  const [showFilters, setShowFilters] = useState(false)

  // Load services
  useEffect(() => {
    loadServices()
  }, [])

  // Handle URL parameters for city filter
  useEffect(() => {
    const cityParam = searchParams.get('city')
    if (cityParam && TUNISIAN_CITIES.includes(cityParam)) {
      setSelectedCity(cityParam)
      setShowFilters(true) // Show filters when coming from city selection
    }
  }, [searchParams])

  // Apply filters
  useEffect(() => {
    filterServices()
  }, [services, searchQuery, selectedCity, selectedCategory, serviceTypeFilter])

  const loadServices = async () => {
    try {
      setLoading(true)
      
      // Load from both services_onsite and services_online tables
      const [onsiteResult, onlineResult] = await Promise.all([
        supabase
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
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
        supabase
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
          .eq('is_active', true)
          .order('created_at', { ascending: false })
      ])

      if (onsiteResult.error) throw onsiteResult.error
      if (onlineResult.error) throw onlineResult.error
      
      // Combine both types and add a service_type field
      const onsiteServices = (onsiteResult.data || []).map(s => ({ ...s, service_type: 'onsite' }))
      const onlineServices = (onlineResult.data || []).map(s => ({ ...s, service_type: 'online' }))
      const allServices = [...onsiteServices, ...onlineServices]
      
      // Sort by created_at
      allServices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      
      console.log('✅ Loaded services:', allServices.length, '(onsite:', onsiteServices.length, 'online:', onlineServices.length, ')')
      setServices(allServices)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = [...services]

    // Service type filter
    if (serviceTypeFilter !== 'all') {
      filtered = filtered.filter(service => service.service_type === serviceTypeFilter)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.providers?.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // City filter (only for onsite services)
    if (selectedCity !== 'all' && serviceTypeFilter !== 'online') {
      filtered = filtered.filter(service => service.city === selectedCity)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory)
    }

    setFilteredServices(filtered)
  }

  const handleDeleteService = async (serviceId, serviceType) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return
    }

    try {
      const tableName = serviceType === 'online' ? 'services_online' : 'services_onsite'
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', serviceId)

      if (error) throw error
      
      // Reload services
      loadServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Erreur lors de la suppression du service')
    }
  }

  const incrementViews = async (serviceId) => {
    try {
      const { error } = await supabase.rpc('increment_service_views', {
        service_id: serviceId
      })
      if (error) console.error('Error incrementing views:', error)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Find Your Perfect <span className="text-blue-600">Service</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Connect with verified professionals across Tunisia for all your service needs
          </p>
        </div>

        {/* Service Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setServiceTypeFilter('onsite')}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                serviceTypeFilter === 'onsite'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Onsite
            </button>
            <button
              onClick={() => setServiceTypeFilter('online')}
              className={`px-6 py-2.5 rounded-md font-medium transition-all ${
                serviceTypeFilter === 'online'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Online
            </button>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </h3>
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedCity('all')
                    setServiceTypeFilter('all')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset Filters
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">Refine your search</p>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  • Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">Select category</option>
                  {serviceTypeFilter !== 'online' && (
                    <optgroup label="Onsite Services">
                      {ONSITE_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </optgroup>
                  )}
                  {serviceTypeFilter !== 'onsite' && (
                    <optgroup label="Online Services">
                      {ONLINE_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Location Filter (only for onsite) */}
              {serviceTypeFilter !== 'online' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    • Location
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">Select location</option>
                    {TUNISIAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Results Count */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-semibold mr-2">{filteredServices.length}</span>
                  services found
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading services...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    currentUser={user}
                    onDelete={handleDeleteService}
                    onView={incrementViews}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button for Providers */}
        {user && user.role === 'provider' && (
          <Link
            to="/services/select-type"
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center z-50"
            title="Post a Service"
          >
            <Plus className="w-6 h-6" />
          </Link>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

// Service Card Component
const ServiceCard = ({ service, currentUser, onDelete, onView }) => {
  const navigate = useNavigate()
  const provider = service.providers
  const isOwner = currentUser?.role === 'provider' && 
                  currentUser?.id === provider?.user_id
  const [imageError, setImageError] = useState(false)

  const handleView = () => {
    onView(service.id)
    // Navigate to service details page
    navigate(`/service/${service.service_type}/${service.id}`)
  }

  // Format phone number for WhatsApp
  const getWhatsAppLink = () => {
    if (!service.contact) return null
    const phone = service.contact.replace(/\s/g, '').replace(/\+/g, '')
    const message = encodeURIComponent(`Bonjour, je suis intéressé par votre service: ${service.title}`)
    return `https://wa.me/${phone}?text=${message}`
  }

  const handleImageError = () => {
    console.error('Failed to load image:', service.image)
    setImageError(true)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Service Image with Badges */}
      <div className="relative h-56 overflow-hidden">
        {service.image && !imageError ? (
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
              {service.service_type === 'online' ? (
                <Globe className="w-10 h-10 text-blue-600" />
              ) : (
                <MapPin className="w-10 h-10 text-blue-600" />
              )}
            </div>
          </div>
        )}
        
        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-600 text-white shadow-md">
            ⭐ PREMIUM
          </span>
          {service.service_type === 'online' && (
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-orange-500 text-white shadow-md">
              🔥 FEATURED
            </span>
          )}
        </div>

        {/* Bottom Left Badge - On-site */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            On-site
          </span>
        </div>

        {/* Owner Actions Overlay */}
        {isOwner && (
          <div className="absolute top-3 right-3 flex gap-2">
            <Link
              to={`/services/${service.service_type}/edit/${service.id}`}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md text-blue-600 hover:bg-white transition"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDelete(service.id, service.service_type)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md text-red-600 hover:bg-white transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Provider Name */}
        <h3 className="text-base font-bold text-gray-900 mb-2">
          {service.providers?.full_name || service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Price */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Starting from</p>
          <p className="text-lg font-bold text-blue-600">
            {service.price} <span className="text-sm font-normal">TND/hr</span>
          </p>
        </div>

        {/* Availability Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
            Same-day available
          </span>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleView}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
        >
          View Details
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  )
}

export default Services
