import React from 'react'
import { Clock, ShieldCheck, Star } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Clock,
      title: 'Réservation Rapide',
      description: 'Réservez un professionnel en quelques minutes et obtenez de l\'aide quand vous en avez le plus besoin',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      icon: ShieldCheck,
      title: 'Professionnels Vérifiés',
      description: 'Tous nos professionnels sont vérifiés et évalués par des clients comme vous',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-100'
    },
    {
      icon: Star,
      title: 'Tarification Transparente',
      description: 'Connaissez le coût à l\'avance sans frais cachés ni surprises',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-100'
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} ${feature.borderColor} border-2 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 border ${feature.borderColor}`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
