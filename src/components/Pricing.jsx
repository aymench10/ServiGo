import React from 'react'
import { Zap, Shield, CheckCircle, Sparkles, Users, Headphones, BarChart, Clock, BookOpen } from 'lucide-react'

const Pricing = () => {
  const plans = [
    {
      name: 'Pro',
      subtitle: 'Pour les besoins réguliers',
      price: '29',
      currency: 'DT/mois',
      icon: Zap,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      popular: true,
      features: [
        { text: 'Demandes illimitées', icon: CheckCircle },
        { text: 'Priorité dans les résultats', icon: CheckCircle },
        { text: 'Support prioritaire', icon: CheckCircle },
        { text: 'Statistiques détaillées', icon: CheckCircle }
      ],
      buttonText: 'Commencer Maintenant',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
    },
    {
      name: 'Entreprise',
      subtitle: 'Pour les grandes équipes',
      price: '99',
      currency: 'DT/mois',
      icon: Shield,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      popular: false,
      features: [
        { text: 'Tout du plan Pro', icon: CheckCircle },
        { text: 'Gestion d\'équipe', icon: Users },
        { text: 'API dédiée', icon: BarChart },
        { text: 'Support 24/7', icon: Headphones },
        { text: 'Formation personnalisée', icon: BookOpen }
      ],
      buttonText: 'Choisir ce Plan',
      buttonStyle: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
    }
  ]

  return (
    <section id="tarifs" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-700 font-medium">
              Offres Spéciales Disponibles
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Tarifs Simples
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              & Transparents
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez le plan parfait pour faire grandir votre activité avec des outils professionnels
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                plan.popular ? 'border-4 border-blue-500' : 'border border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg">
                    POPULAIRE
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 ${plan.iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                <plan.icon className={`w-8 h-8 ${plan.iconColor}`} />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.subtitle}</p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.currency}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-gray-700">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${plan.buttonStyle}`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8 sm:p-12 border border-blue-100">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Besoin d'aide pour choisir ?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Notre équipe d'experts est là pour vous accompagner et vous aider à trouver la solution parfaite pour vos besoins
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border-2 border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Parler à un Expert</span>
              </button>
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Essai Gratuit 14 Jours</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
