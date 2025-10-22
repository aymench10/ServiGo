import React, { useState, useEffect } from 'react'
import { X, MapPin, Calendar, Clock, DollarSign, FileText, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { TUNISIAN_CITIES } from '../constants/serviceData'

const BookingModal = ({ isOpen, onClose, service, serviceType, user }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Onsite booking fields
  const [location, setLocation] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [urgency, setUrgency] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [clientNotes, setClientNotes] = useState('')

  // Online booking fields
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [budgetRange, setBudgetRange] = useState('100-500 TND')
  const [timeline, setTimeline] = useState('1-2 weeks')

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setError(null)
      setSuccess(false)
      setLocation('')
      setGovernorate('')
      setUrgency(false)
      setScheduledDate('')
      setClientNotes('')
      setProjectTitle('')
      setProjectDescription('')
      setBudgetRange('100-500 TND')
      setTimeline('1-2 weeks')
    }
  }, [isOpen])

  const handleSubmitOnsiteBooking = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!location || !governorate) {
        throw new Error('Please fill in all required fields')
      }

      // Create booking
      console.log('📝 Creating booking with provider_id:', service.user_id || service.provider_id, 'from service:', service)
      const { data, error: bookingError } = await supabase
        .from('bookings_onsite')
        .insert([
          {
            client_id: user.id,
            provider_id: service.user_id || service.provider_id,
            service_id: service.id,
            service_type: service.category,
            location: location,
            governorate: governorate,
            urgency: urgency,
            scheduled_date: scheduledDate || null,
            client_notes: clientNotes,
            status: 'pending'
          }
        ])
        .select()

      if (bookingError) throw bookingError

      console.log('✅ Onsite booking created:', data)
      setSuccess(true)
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Error creating onsite booking:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitOnlineBooking = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!projectTitle || !projectDescription) {
        throw new Error('Please fill in all required fields')
      }

      // Create booking
      const { data, error: bookingError } = await supabase
        .from('bookings_online')
        .insert([
          {
            client_id: user.id,
            provider_id: service.user_id,
            service_id: service.id,
            project_title: projectTitle,
            project_description: projectDescription,
            budget_range: budgetRange,
            timeline: timeline,
            client_notes: clientNotes,
            status: 'pending'
          }
        ])
        .select()

      if (bookingError) throw bookingError

      console.log('✅ Online booking created:', data)
      setSuccess(true)
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      console.error('Error creating online booking:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {serviceType === 'onsite' ? 'Book Onsite Service' : 'Request Online Project'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{service.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Booking Request Sent!</h3>
                <p className="text-sm text-green-700">The provider will be notified shortly.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          {serviceType === 'onsite' ? (
            <form onSubmit={handleSubmitOnsiteBooking} className="space-y-6">
              {/* Service Type Display */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900">Service Category</p>
                <p className="text-lg font-bold text-blue-700">{service.category}</p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Exact Location / Address *
                </label>
                <textarea
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your full address (street, building, floor, etc.)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>

              {/* Governorate */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Governorate / Wilaya *
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select governorate</option>
                  {TUNISIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Scheduled Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Preferred Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Urgency */}
              <div className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <input
                  type="checkbox"
                  id="urgency"
                  checked={urgency}
                  onChange={(e) => setUrgency(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="urgency" className="flex-1 cursor-pointer">
                  <span className="font-semibold text-orange-900 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Mark as Urgent
                  </span>
                  <p className="text-sm text-orange-700">Need this service as soon as possible</p>
                </label>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Any specific requirements or details..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Request...' : success ? '✅ Request Sent!' : 'Send Booking Request'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitOnlineBooking} className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g., E-commerce Website Development"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Project Description *
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project requirements, goals, and any specific features you need..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="5"
                  required
                />
              </div>

              {/* Budget Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Budget Range *
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="< 100 TND">Less than 100 TND</option>
                  <option value="100-500 TND">100 - 500 TND</option>
                  <option value="500-1000 TND">500 - 1000 TND</option>
                  <option value="> 1000 TND">More than 1000 TND</option>
                </select>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Expected Timeline *
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="3+ months">3+ months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Any additional information or requirements..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending Request...' : success ? '✅ Request Sent!' : 'Send Project Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
