import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Shield, Star, Headphones } from 'lucide-react'

const Footer = () => {
  const popularServices = [
    { name: 'Plomberie', path: '/services?category=Plomberie' },
    { name: 'Électricité', path: '/services?category=Électricité' },
    { name: 'Menuiserie', path: '/services?category=Menuiserie' },
    { name: 'Ménage', path: '/services?category=Ménage' },
    { name: 'Voir tous les services', path: '/services' }
  ]

  const companyLinks = [
    { name: 'À propos', path: '/about' },
    { name: 'Comment ça marche', path: '/how-it-works' },
    { name: 'Carrières', path: '/careers' },
    { name: 'Support', path: '/contact' },
    { name: 'Contactez-nous', path: '/contact' }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h3 className="text-2xl font-bold">ServiGOTN</h3>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted marketplace for home services in Tunisia. Connect with verified professionals and book quality services with confidence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Verified Pros</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>4.9 Rating</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center space-x-2">
                <Headphones className="w-4 h-4" />
                <span>Same Day Service</span>
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Tunisia, All Governorates</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-blue-400" />
                <a href="tel:+21696000000" className="hover:text-white transition-colors">
                  +216 96 XXX XXX
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-blue-400" />
                <a href="mailto:contact@servigotn.com" className="hover:text-white transition-colors">
                  contact@serviGOTN.com
                </a>
              </div>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">Popular Services</h4>
            <ul className="space-y-2">
              {popularServices.map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.path}
                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <span className="text-blue-400">›</span>
                    <span>{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <span className="text-blue-400">›</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2025 ServiGOTN. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
