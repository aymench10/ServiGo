import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { SERVICE_CATEGORIES, TUNISIAN_CITIES } from '../constants/serviceData'
import { 
  Image as ImageIcon, 
  ArrowLeft,
  Save
} from 'lucide-react'
import Header from '../components/Header'

const PostService = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    price: '',
    contact_phone: user?.phone || '',
    contact_email: user?.email || ''
  })

  // Redirect if not a provider
  React.useEffect(() => {
    if (user && user.role !== 'provider') {
      navigate('/services')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('User data:', user)
    console.log('User ID:', user.id)

    try {
      // Get provider profile ID
      const { data: providerProfile, error: profileError } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      
      console.log('Provider profile:', providerProfile)
      console.log('Profile error:', profileError)

      if (profileError) {
        console.error('Profile error:', profileError)
        throw new Error('Erreur lors de la récupération du profil: ' + profileError.message)
      }

      if (!providerProfile) {
        setError('Profil prestataire introuvable.')
        setLoading(false)
        // Redirect to fix profile page after showing error
        setTimeout(() => {
          navigate('/fix-profile')
        }, 2000)
        return
      }

      // Use the provider's profile photo as service image
      const imageUrl = user.avatar_url || null

      // Create service
      const { data: newService, error: serviceError } = await supabase
        .from('services')
        .insert({
          provider_id: providerProfile.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          city: formData.city,
          price: parseFloat(formData.price),
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email,
          image_url: imageUrl,
          is_active: true
        })
        .select()

      if (serviceError) {
        console.error('Service error:', serviceError)
        throw new Error('Erreur lors de la création du service: ' + serviceError.message)
      }

      // Success - redirect to services page
      navigate('/services')
    } catch (error) {
      console.error('Error creating service:', error)
      setError(error.message || 'Erreur lors de la création du service')
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.role !== 'provider') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/services"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux services</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Publier un Service</h1>
          <p className="text-gray-600 mt-2">
            Remplissez les informations ci-dessous pour publier votre service
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Image Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    📸 Image du service
                  </p>
                  <p className="text-sm text-blue-700">
                    Votre photo de profil sera utilisée comme image du service. Pour la modifier, allez dans les paramètres de votre profil.
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du service *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Réparation de plomberie à domicile"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez votre service en détail..."
              />
            </div>

            {/* Category and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {SERVICE_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une ville</option>
                  {TUNISIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (DT) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 50.00"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone de contact
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="+216 12 345 678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de contact
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Publication...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Publier le service</span>
                  </>
                )}
              </button>

              <Link
                to="/services"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostService
