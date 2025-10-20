import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Wrench, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

const FixProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState(null)

  useEffect(() => {
    if (user) {
      checkProfile()
    }
  }, [user])

  const checkProfile = async () => {
    try {
      setStatus('checking')
      setMessage('Vérification du profil...')

      // Check if provider profile exists
      const { data: providerProfile, error } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Error checking profile:', error)
        setStatus('error')
        setMessage('Erreur lors de la vérification: ' + error.message)
        return
      }

      if (providerProfile) {
        setStatus('success')
        setMessage('✅ Votre profil prestataire existe!')
        setDetails(providerProfile)
      } else {
        setStatus('missing')
        setMessage('⚠️ Profil prestataire manquant')
        setDetails(null)
      }
    } catch (error) {
      console.error('Error:', error)
      setStatus('error')
      setMessage('Erreur: ' + error.message)
    }
  }

  const createProviderProfile = async () => {
    try {
      setStatus('fixing')
      setMessage('Création du profil prestataire...')

      console.log('Creating profile for user:', user.id, user.email)

      // Try to insert directly
      const { data, error } = await supabase
        .from('provider_profiles')
        .insert({
          user_id: user.id,
          business_name: user.full_name || 'Mon Entreprise',
          service_category: 'Autre',
          location: 'Tunis',
          description: 'Services professionnels'
        })
        .select()

      console.log('Insert result:', { data, error })

      if (error) {
        console.error('Insert error details:', error)
        throw error
      }

      setStatus('success')
      setMessage('✅ Profil prestataire créé avec succès!')
      setDetails(data[0])
      
      // Reload profile after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Error creating profile:', error)
      setStatus('error')
      setMessage('Erreur: ' + error.message + '\n\nVeuillez exécuter le script SQL FINAL_FIX.sql dans Supabase.')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vous devez être connecté</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Se connecter
          </button>
        </div>
      </div>
    )
  }

  if (user.role !== 'provider') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Cette page est réservée aux prestataires</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Icon */}
        <div className="text-center mb-6">
          {status === 'checking' && (
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          )}
          {status === 'success' && (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          )}
          {status === 'missing' && (
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
          )}
          {status === 'error' && (
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          )}
          {status === 'fixing' && (
            <Wrench className="w-16 h-16 text-blue-500 mx-auto animate-pulse" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Vérification du Profil
        </h1>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">
          {message}
        </p>

        {/* User Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">
            <strong>Nom:</strong> {user.full_name}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Rôle:</strong> {user.role}
          </p>
        </div>

        {/* Details */}
        {details && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-green-900 mb-2">
              Informations du profil prestataire:
            </p>
            <p className="text-sm text-green-700 mb-1">
              <strong>Entreprise:</strong> {details.business_name}
            </p>
            <p className="text-sm text-green-700 mb-1">
              <strong>Catégorie:</strong> {details.service_category}
            </p>
            <p className="text-sm text-green-700">
              <strong>Localisation:</strong> {details.location}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {status === 'missing' && (
            <button
              onClick={createProviderProfile}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Créer le profil prestataire
            </button>
          )}

          {status === 'success' && (
            <button
              onClick={() => navigate('/services/post')}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Publier un service
            </button>
          )}

          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Retour à l'accueil
          </button>

          <button
            onClick={checkProfile}
            className="w-full px-6 py-3 border-2 border-blue-300 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Vérifier à nouveau
          </button>
        </div>
      </div>
    </div>
  )
}

export default FixProfile
