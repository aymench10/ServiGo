import React from 'react'
import { useNavigate } from 'react-router-dom'
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
              {/* Tunisian Flag */}
              <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 relative">
                {/* Red background */}
                <div className="absolute inset-0 bg-red-600"></div>
                {/* White circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  {/* Red crescent and star */}
                  <div className="relative w-full h-full">
                    {/* Red circle for crescent */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-red-600 rounded-full"></div>
                    {/* White circle to create crescent */}
                    <div className="absolute top-1/2 left-[45%] transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full"></div>
                    {/* Star */}
                    <div className="absolute top-1/2 left-[60%] transform -translate-x-1/2 -translate-y-1/2 text-red-600 text-xs">★</div>
                  </div>
                </div>
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
