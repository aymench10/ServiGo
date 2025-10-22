import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Globe,
  Phone,
  Mail
} from 'lucide-react'

const BookingsManagement = ({ userRole }) => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, confirmed, declined
  const [bookingType, setBookingType] = useState('all') // all, onsite, online

  useEffect(() => {
    if (user) {
      loadBookings()
      subscribeToBookings()
    }
  }, [user, userRole])

  const loadBookings = async () => {
    try {
      setLoading(true)
      
      // Load onsite bookings
      const onsiteQuery = supabase
        .from('bookings_onsite')
        .select(`
          *,
          client:client_id (
            id,
            email,
            raw_user_meta_data
          ),
          provider:providers!bookings_onsite_provider_id_fkey (
            user_id,
            full_name,
            email,
            phone
          ),
          service:services_onsite (
            id,
            title,
            category,
            image
          )
        `)
        .order('created_at', { ascending: false })

      // Load online bookings
      const onlineQuery = supabase
        .from('bookings_online')
        .select(`
          *,
          client:client_id (
            id,
            email,
            raw_user_meta_data
          ),
          provider:providers!bookings_online_provider_id_fkey (
            user_id,
            full_name,
            email,
            phone
          ),
          service:services_online (
            id,
            title,
            category,
            image
          )
        `)
        .order('created_at', { ascending: false })

      // Filter based on user role
      if (userRole === 'provider') {
        onsiteQuery.eq('provider_id', user.id)
        onlineQuery.eq('provider_id', user.id)
      } else {
        onsiteQuery.eq('client_id', user.id)
        onlineQuery.eq('client_id', user.id)
      }

      const [onsiteResult, onlineResult] = await Promise.all([
        onsiteQuery,
        onlineQuery
      ])

      if (onsiteResult.error) throw onsiteResult.error
      if (onlineResult.error) throw onlineResult.error

      // Combine and tag bookings
      const onsiteBookings = (onsiteResult.data || []).map(b => ({ ...b, booking_type: 'onsite' }))
      const onlineBookings = (onlineResult.data || []).map(b => ({ ...b, booking_type: 'online' }))
      
      const allBookings = [...onsiteBookings, ...onlineBookings]
      allBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      setBookings(allBookings)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToBookings = () => {
    const onsiteChannel = supabase
      .channel('onsite_bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings_onsite',
          filter: userRole === 'provider' ? `provider_id=eq.${user.id}` : `client_id=eq.${user.id}`
        },
        () => {
          loadBookings()
        }
      )
      .subscribe()

    const onlineChannel = supabase
      .channel('online_bookings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings_online',
          filter: userRole === 'provider' ? `provider_id=eq.${user.id}` : `client_id=eq.${user.id}`
        },
        () => {
          loadBookings()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(onsiteChannel)
      supabase.removeChannel(onlineChannel)
    }
  }

  const handleUpdateStatus = async (bookingId, bookingType, newStatus, notes = '') => {
    try {
      const tableName = bookingType === 'online' ? 'bookings_online' : 'bookings_onsite'
      
      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      if (notes && userRole === 'provider') {
        updateData.provider_notes = notes
      }

      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', bookingId)

      if (error) throw error

      console.log(`✅ Booking ${newStatus}:`, bookingId)
      loadBookings()
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking status')
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter !== 'all' && booking.status !== filter) return false
    if (bookingType !== 'all' && booking.booking_type !== bookingType) return false
    return true
  })

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="w-3 h-3" />, text: 'Pending' },
      confirmed: { color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle className="w-3 h-3" />, text: 'Confirmed' },
      declined: { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-3 h-3" />, text: 'Declined' },
      completed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <CheckCircle className="w-3 h-3" />, text: 'Completed' },
      cancelled: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <XCircle className="w-3 h-3" />, text: 'Cancelled' },
      in_progress: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Clock className="w-3 h-3" />, text: 'In Progress' }
    }
    const badge = badges[status] || badges.pending
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        {badge.icon}
        <span className="ml-1">{badge.text}</span>
      </span>
    )
  }

  const getClientName = (booking) => {
    return booking.client?.raw_user_meta_data?.full_name || booking.client?.email || 'Client'
  }

  const getProviderName = (booking) => {
    return booking.provider?.full_name || 'Provider'
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="declined">Declined</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
            <select
              value={bookingType}
              onChange={(e) => setBookingType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="onsite">Onsite Services</option>
              <option value="online">Online Projects</option>
            </select>
          </div>

          {/* Stats */}
          <div className="flex-1 flex items-end">
            <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-900">{filteredBookings.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {filter !== 'all' ? 'Try adjusting your filters' : 'You don\'t have any bookings yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={`${booking.booking_type}-${booking.id}`}
              booking={booking}
              userRole={userRole}
              onUpdateStatus={handleUpdateStatus}
              getStatusBadge={getStatusBadge}
              getClientName={getClientName}
              getProviderName={getProviderName}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Booking Card Component
const BookingCard = ({ booking, userRole, onUpdateStatus, getStatusBadge, getClientName, getProviderName }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [notes, setNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const handleAction = async (action) => {
    setActionLoading(true)
    await onUpdateStatus(booking.id, booking.booking_type, action, notes)
    setActionLoading(false)
    setNotes('')
  }

  const isOnsite = booking.booking_type === 'onsite'
  const isPending = booking.status === 'pending'
  const canProviderAct = userRole === 'provider' && isPending

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                {isOnsite ? booking.service?.title : booking.project_title}
              </h3>
              {getStatusBadge(booking.status)}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                {isOnsite ? <MapPin className="w-4 h-4 mr-1" /> : <Globe className="w-4 h-4 mr-1" />}
                {isOnsite ? 'Onsite Service' : 'Online Project'}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(booking.created_at).toLocaleDateString()}
              </span>
              {booking.urgency && (
                <span className="flex items-center text-orange-600 font-semibold">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  URGENT
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">
                {userRole === 'provider' ? 'Client' : 'Provider'}
              </p>
              <p className="font-semibold text-gray-900">
                {userRole === 'provider' ? getClientName(booking) : getProviderName(booking)}
              </p>
            </div>
          </div>

          {isOnsite && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-semibold text-gray-900">{booking.governorate}</p>
              </div>
            </div>
          )}

          {!isOnsite && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Budget</p>
                <p className="font-semibold text-gray-900">{booking.budget_range}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Info */}
      {showDetails && (
        <div className="p-6 bg-gray-50 space-y-4">
          {isOnsite ? (
            <>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Service Category</p>
                <p className="text-gray-900">{booking.service_type}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Full Address</p>
                <p className="text-gray-900">{booking.location}</p>
              </div>
              {booking.scheduled_date && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Scheduled Date</p>
                  <p className="text-gray-900">{new Date(booking.scheduled_date).toLocaleString()}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Project Description</p>
                <p className="text-gray-900">{booking.project_description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Timeline</p>
                  <p className="text-gray-900">{booking.timeline}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Budget Range</p>
                  <p className="text-gray-900">{booking.budget_range}</p>
                </div>
              </div>
            </>
          )}

          {booking.client_notes && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Client Notes</p>
              <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200">{booking.client_notes}</p>
            </div>
          )}

          {booking.provider_notes && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Provider Notes</p>
              <p className="text-gray-900 bg-white p-3 rounded-lg border border-gray-200">{booking.provider_notes}</p>
            </div>
          )}

          {/* Contact Info */}
          {userRole === 'provider' && booking.client && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Client Contact</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  {booking.client.email}
                </p>
              </div>
            </div>
          )}

          {userRole === 'client' && booking.provider && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Provider Contact</p>
              <div className="space-y-2">
                {booking.provider.email && (
                  <p className="text-sm text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {booking.provider.email}
                  </p>
                )}
                {booking.provider.phone && (
                  <p className="text-sm text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {booking.provider.phone}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Provider Actions */}
      {canProviderAct && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or comments..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleAction('confirmed')}
                disabled={actionLoading}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Booking
              </button>
              <button
                onClick={() => handleAction('declined')}
                disabled={actionLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 flex items-center justify-center"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Decline Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingsManagement
