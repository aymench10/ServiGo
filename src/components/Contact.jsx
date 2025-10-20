import React from 'react'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['+216 71 234 567', '+216 98 765 432'],
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@servigo.tn', 'support@servigo.tn'],
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['123 Avenue Habib Bourguiba', '1001 Tunis, Tunisie'],
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: ['Lun - Ven: 8h00 - 18h00', 'Sam: 9h00 - 15h00'],
      color: 'bg-orange-50 border-orange-200 text-orange-700'
    }
  ]

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou demande d'information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Informations de Contact
            </h3>

            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className={`${info.color} border-2 rounded-xl p-6`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border`}>
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{info.title}</h4>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-sm">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Envoyez-nous un message
            </h3>

            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+216 XX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service demandé
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                  <option>Sélectionnez un service</option>
                  <option>Plomberie</option>
                  <option>Électricité</option>
                  <option>Ménage</option>
                  <option>Jardinage</option>
                  <option>Peinture</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Envoyer le message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
