import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { 
  MapPin, 
  Tag, 
  Star,
  Phone,
  Mail,
  MessageCircle,
  ArrowLeft,
  Briefcase,
  Calendar,
  Eye
} from 'lucide-react'
import Header from '../components/Header'

const ProviderProfile = () => {
  const { providerId } = useParams()
  const [provider, setProvider] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProviderData()
  }, [providerId])

  const loadProviderData = async () => {
    try {
      setLoading(true)

      // Load provider profile
      const { data: providerData, error: providerError } = await supabase
        .from('providers')
        .select('*')
        .eq('id', providerId)
        .single()

      if (providerError) throw providerError
      setProvider(providerData)

      // Load provider's services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services_onsite')
        .select('*')
        .eq('provider_id', providerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (servicesError) throw servicesError
      setServices(servicesData || [])

    } catch (error) {
      console.error('Error loading provider data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWhatsAppLink = () => {
    if (!provider?.phone) return null
    const phone = provider.phone.replace(/\s/g, '').replace(/\+/g, '')
    const message = encodeURIComponent(`Bonjour ${provider.full_name}, je suis intéressé par vos services.`)
    return `https://wa.me/${phone}?text=${message}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-12">
          <p className="text-gray-600">Prestataire introuvable</p>
          <Link to="/services/onsite" className="text-blue-600 hover:underline mt-4 inline-block">
            Retour aux services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/services/onsite"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux services</span>
        </Link>

        {/* Provider Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          
          <div className="px-8 pb-8">
            {/* Profile Photo */}
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16">
              {provider.profile_image ? (
                <img
                  src={provider.profile_image}
                  alt={provider.full_name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white text-4xl font-bold">
                    {provider.full_name?.charAt(0) || 'P'}
                  </span>
                </div>
              )}

              <div className="mt-4 md:mt-0 flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {provider.full_name}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    <span>{provider.category}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{provider.city}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span>{provider.experience_years} ans d'expérience</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Membre depuis {new Date(provider.created_at).getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {provider.bio && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">À propos</h3>
                <p className="text-gray-600">{provider.bio}</p>
              </div>
            )}

            {/* Contact Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {provider.phone && (
                <>
                  <a
                    href={`tel:${provider.phone}`}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Appeler</span>
                  </a>
                  
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                </>
              )}
              
              {provider.email && (
                <a
                  href={`mailto:${provider.email}`}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Provider's Services */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Services proposés ({services.length})
          </h2>

          {services.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-600">Aucun service disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Service Card Component
const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Service Image */}
      {service.image ? (
        <img
          src={service.image}
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
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
          {service.category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{service.city}</span>
        </div>

        {/* Price and Views */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-2xl font-bold text-blue-600">
            {service.price} DT
          </p>
          <div className="text-xs text-gray-500 flex items-center">
            <Eye className="w-3 h-3 mr-1" />
            <span>{service.views_count || 0} vues</span>
          </div>
        </div>

        {/* Contact Button */}
        {service.contact && (
          <a
            href={`tel:${service.contact}`}
            className="mt-4 w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Phone className="w-4 h-4" />
            <span>Contacter</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default ProviderProfile
