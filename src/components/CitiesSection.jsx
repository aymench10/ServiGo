import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { TUNISIAN_CITIES } from '../constants/serviceData'

const CitiesSection = () => {
  const navigate = useNavigate()

  const handleCityClick = (city) => {
    // Navigate to services page with city filter
    navigate(`/services?city=${encodeURIComponent(city)}`)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Explorez les Services par Ville
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vous ne voyez pas votre région ? Nous nous développons rapidement à travers la Tunisie.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {TUNISIAN_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              className="group bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Flag Icon */}
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              
              {/* City Name */}
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {city}
              </p>
            </button>
          ))}
        </div>

        {/* Footer Text */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Vous ne voyez pas votre région ? Nous nous développons rapidement à travers la Tunisie.
          </p>
        </div>
      </div>
    </section>
  )
}

export default CitiesSection
