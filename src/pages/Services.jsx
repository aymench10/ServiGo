import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { SERVICE_CATEGORIES, TUNISIAN_CITIES } from '../constants/serviceData'
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
  X
} from 'lucide-react'
import Header from '../components/Header'

const Services = () => {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Load services
  useEffect(() => {
    loadServices()
  }, [])

  // Apply filters
  useEffect(() => {
    filterServices()
  }, [services, searchQuery, selectedCity, selectedCategory])

  const loadServices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider_profiles (
            business_name,
            user_id,
            profiles (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = [...services]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider_profiles?.business_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // City filter
    if (selectedCity !== 'all') {
      filtered = filtered.filter(service => service.city === selectedCity)
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory)
    }

    setFilteredServices(filtered)
  }

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('services')
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services Disponibles</h1>
            <p className="text-gray-600 mt-2">
              Découvrez tous les services proposés par nos prestataires
            </p>
          </div>

          {/* Post Service Button (Provider Only) */}
          {user && user.role === 'provider' && (
            <Link
              to="/services/select-type"
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              <Plus className="w-5 h-5" />
              <span>Publier un Service</span>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un service, prestataire..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* City Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[200px]"
              >
                <option value="all">Toutes les villes</option>
                {TUNISIAN_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white min-w-[200px]"
              >
                <option value="all">Toutes catégories</option>
                {SERVICE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun service trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  )
}

// Service Card Component
const ServiceCard = ({ service, currentUser, onDelete, onView }) => {
  const isOwner = currentUser?.role === 'provider' && 
                  currentUser?.user_id === service.provider_profiles?.user_id

  const handleView = () => {
    onView(service.id)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Service Image */}
      {service.image_url ? (
        <img
          src={service.image_url}
          alt={service.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <Tag className="w-16 h-16 text-gray-400" />
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {service.category}
          </span>
          {isOwner && (
            <div className="flex space-x-2">
              <Link
                to={`/services/edit/${service.id}`}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onDelete(service.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{service.city}</span>
        </div>

        {/* Provider Info */}
        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
          {service.provider_profiles?.profiles?.avatar_url ? (
            <img
              src={service.provider_profiles.profiles.avatar_url}
              alt={service.provider_profiles.business_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {service.provider_profiles?.business_name?.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {service.provider_profiles?.business_name}
            </p>
            <p className="text-xs text-gray-500">Prestataire vérifié</p>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {service.price} {service.price_unit}
            </p>
          </div>
          <Link
            to={`/services/${service.id}`}
            onClick={handleView}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Voir</span>
          </Link>
        </div>

        {/* Views Count */}
        <div className="mt-3 text-xs text-gray-500 flex items-center">
          <Eye className="w-3 h-3 mr-1" />
          <span>{service.views_count || 0} vues</span>
        </div>
      </div>
    </div>
  )
}

export default Services
