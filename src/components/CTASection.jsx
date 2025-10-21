import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Briefcase, Shield, CreditCard } from 'lucide-react'

const CTASection = () => {
  const navigate = useNavigate()

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300 opacity-10 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
          <span className="text-sm text-white font-medium">
            Déjà commencé ?
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Rejoignez des milliers de clients satisfaits à travers la Tunisie qui font confiance à ServiGOTN pour leurs besoins de services à domicile
        </h2>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-3xl mx-auto">
          Rejoignez des milliers d'utilisateurs satisfaits et trouvez le professionnel parfait pour tous vos besoins
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => navigate('/signup')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Réserver maintenant
          </button>
          <button
            onClick={() => navigate('/signup?role=provider')}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
          >
            Rejoindre en tant que professionnel
          </button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2.5 border border-white/30">
            <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-white font-medium">
              Propriété et exploitation tunisiennes
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2.5 border border-white/30">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-white font-medium">
              Paiement: Espèces | Flouci | د.ت
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
