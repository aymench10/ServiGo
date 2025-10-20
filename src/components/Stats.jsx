import React from 'react'
import { Star } from 'lucide-react'

const Stats = () => {
  const stats = [
    {
      value: '8,000+',
      label: 'Clients Satisfaits',
      icon: '👥'
    },
    {
      value: '4,512',
      label: 'Note Moyenne',
      icon: '⭐',
      showStars: true
    },
    {
      value: '500+',
      label: 'Professionnels Actifs',
      icon: '✓'
    }
  ]

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center space-x-3">
                {stat.showStars ? (
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                ) : (
                  <span className="text-3xl">{stat.icon}</span>
                )}
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
              {index < stats.length - 1 && (
                <div className="hidden lg:block w-px h-12 bg-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
