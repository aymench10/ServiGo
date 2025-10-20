import React from 'react'
import { Sparkles } from 'lucide-react'

const Hero = () => {
  return (
    <section id="accueil" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="max-w-5xl mx-auto text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">
            #1 Plateforme de Services en Tunisie
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Trouvez les meilleurs
          <br />
          prestataires de services
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-purple-400">
            en Tunisie
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Découvrez et réservez des services de qualité auprès de professionnels
          certifiés dans votre région
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
            Réserver maintenant →
          </button>
          <button className="w-full sm:w-auto bg-white text-gray-700 px-8 py-3 rounded-full font-semibold border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200">
            Voir tous les services
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
