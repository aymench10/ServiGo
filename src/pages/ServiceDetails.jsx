import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import {
  ArrowLeft,
  MapPin,
  Globe,
  Star,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Award,
  Briefcase,
  User,
  MessageSquare,
  Share2
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BookingModal from '../components/BookingModal'

const ServiceDetails = () => {
  const { serviceId, serviceType } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    loadServiceDetails()
  }, [serviceId, serviceType])

  const loadServiceDetails = async () => {
    try {
      setLoading(true)
      const tableName = serviceType === 'online' ? 'services_online' : 'services_onsite'
      
      const { data, error } = await supabase
        .from(tableName)
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
            profile_image,
            bio,
            experience_years
          )
        `)
        .eq('id', serviceId)
        .single()

      if (error) throw error
      
      setService({ ...data, service_type: serviceType })
    } catch (err) {
      console.error('Error loading service:', err)
      setError('Service non trouvé')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowBookingModal(true)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service non trouvé</h2>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retour aux services
            </button>
          </div>
        </div>
      </div>
    )
  }

  const provider = service.providers

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {service.image && !imageError ? (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-96 object-cover"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                    {service.service_type === 'online' ? (
                      <Globe className="w-16 h-16 text-blue-600" />
                    ) : (
                      <MapPin className="w-16 h-16 text-blue-600" />
                    )}
                  </div>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-blue-600 text-white shadow-lg">
                  <span className="text-yellow-300">⭐</span> PREMIUM
                </span>
                {service.service_type === 'online' && (
                  <span className="px-3 py-1.5 rounded-md text-xs font-bold bg-orange-500 text-white shadow-lg">
                    🔥 FEATURED
                  </span>
                )}
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      {service.service_type === 'online' ? (
                        <>
                          <Globe className="w-4 h-4 mr-1" />
                          Service en ligne
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-1" />
                          {service.city}
                        </>
                      )}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {service.category}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Price */}
              <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Prix</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {service.price} <span className="text-lg font-normal text-gray-600">TND/hr</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold bg-green-100 text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Disponible
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
              </div>

              {/* Service Details */}
              {service.service_type === 'onsite' && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Localisation</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{service.city}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Disponibilité</span>
                    </div>
                    <p className="text-gray-900 font-semibold">Même jour</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Provider Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              {/* Provider Profile */}
              <div className="text-center mb-6">
                {provider?.profile_image ? (
                  <img
                    src={provider.profile_image}
                    alt={provider.full_name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-blue-100">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{provider?.full_name}</h3>
                <p className="text-sm text-gray-600 mb-3">{provider?.category}</p>
                
                {/* Rating */}
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.9)</span>
                </div>
              </div>

              {/* Provider Stats */}
              <div className="space-y-3 mb-6">
                {provider?.experience_years && (
                  <div className="flex items-center space-x-3 text-sm">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">
                      <span className="font-semibold">{provider.experience_years} ans</span> d'expérience
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Prestataire vérifié</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">{provider?.city}</span>
                </div>
              </div>

              {/* Bio */}
              {provider?.bio && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">À propos</h4>
                  <p className="text-sm text-gray-700">{provider.bio}</p>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {provider?.phone && (
                  <a
                    href={`tel:${provider.phone}`}
                    className="flex items-center space-x-3 text-sm text-gray-700 hover:text-blue-600 transition"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{provider.phone}</span>
                  </a>
                )}
                {provider?.email && (
                  <a
                    href={`mailto:${provider.email}`}
                    className="flex items-center space-x-3 text-sm text-gray-700 hover:text-blue-600 transition"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{provider.email}</span>
                  </a>
                )}
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Réserver maintenant</span>
              </button>

              {/* Message Button */}
              <button className="w-full mt-3 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Envoyer un message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          service={{
            ...service,
            provider_id: provider?.user_id
          }}
          serviceType={service.service_type}
          user={user}
        />
      )}
      
      <Footer />
    </div>
  )
}

export default ServiceDetails
