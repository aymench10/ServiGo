import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Zap, 
  Shield, 
  CheckCircle, 
  Sparkles, 
  Users, 
  Headphones, 
  BarChart, 
  Clock, 
  BookOpen,
  ArrowLeft,
  Star,
  TrendingUp,
  Award,
  Rocket,
  X,
  Check
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PricingPage = () => {
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' or 'yearly'
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = [
    {
      id: 'basic',
      name: 'Basique',
      subtitle: 'Pour débuter',
      monthlyPrice: '0',
      yearlyPrice: '0',
      icon: Sparkles,
      iconColor: 'text-gray-600',
      iconBg: 'bg-gray-100',
      popular: false,
      features: [
        { text: '5 demandes par mois', included: true },
        { text: 'Accès aux prestataires vérifiés', included: true },
        { text: 'Support par email', included: true },
        { text: 'Historique des demandes', included: true },
        { text: 'Priorité dans les résultats', included: false },
        { text: 'Support prioritaire', included: false },
        { text: 'Statistiques détaillées', included: false }
      ],
      buttonText: 'Commencer Gratuitement',
      buttonStyle: 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-md'
    },
    {
      id: 'pro',
      name: 'Pro',
      subtitle: 'Pour les besoins réguliers',
      monthlyPrice: '29',
      yearlyPrice: '290',
      icon: Zap,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      popular: true,
      features: [
        { text: 'Demandes illimitées', included: true },
        { text: 'Priorité dans les résultats', included: true },
        { text: 'Support prioritaire 24/7', included: true },
        { text: 'Statistiques détaillées', included: true },
        { text: 'Badge professionnel', included: true },
        { text: 'Réductions exclusives', included: true },
        { text: 'Accès anticipé aux nouveautés', included: true }
      ],
      buttonText: 'Commencer Maintenant',
      buttonStyle: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white hover:shadow-xl hover:scale-[1.02]'
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      subtitle: 'Pour les grandes équipes',
      monthlyPrice: '99',
      yearlyPrice: '990',
      icon: Shield,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      popular: false,
      features: [
        { text: 'Tout du plan Pro', included: true },
        { text: 'Gestion d\'équipe avancée', included: true },
        { text: 'API dédiée', included: true },
        { text: 'Support dédié 24/7', included: true },
        { text: 'Formation personnalisée', included: true },
        { text: 'Facturation centralisée', included: true },
        { text: 'Gestionnaire de compte dédié', included: true }
      ],
      buttonText: 'Contactez-nous',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-xl hover:scale-[1.02]'
    }
  ]

  const features = [
    {
      icon: Star,
      title: 'Qualité Garantie',
      description: 'Tous nos prestataires sont vérifiés et notés par la communauté'
    },
    {
      icon: Clock,
      title: 'Disponibilité 24/7',
      description: 'Trouvez un prestataire à tout moment, même en urgence'
    },
    {
      icon: Award,
      title: 'Satisfaction Client',
      description: 'Plus de 95% de satisfaction client sur nos services'
    },
    {
      icon: TrendingUp,
      title: 'Croissance Assurée',
      description: 'Développez votre activité avec nos outils professionnels'
    }
  ]

  const faqs = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez changer de plan à tout moment. Les changements prennent effet immédiatement.'
    },
    {
      question: 'Y a-t-il un engagement minimum ?',
      answer: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler à tout moment.'
    },
    {
      question: 'Quels modes de paiement acceptez-vous ?',
      answer: 'Nous acceptons les cartes bancaires, PayPal, et les virements bancaires pour les entreprises.'
    },
    {
      question: 'Puis-je obtenir un remboursement ?',
      answer: 'Oui, nous offrons une garantie satisfait ou remboursé de 30 jours sur tous nos plans payants.'
    },
    {
      question: 'Le plan Basique est-il vraiment gratuit ?',
      answer: 'Oui, le plan Basique est 100% gratuit, sans carte bancaire requise pour commencer.'
    },
    {
      question: 'Qu\'est-ce qui est inclus dans le support prioritaire ?',
      answer: 'Le support prioritaire inclut une réponse en moins de 2 heures, un chat en direct, et un support téléphonique.'
    }
  ]

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
  }

  const getSavings = (plan) => {
    if (billingCycle === 'yearly' && plan.monthlyPrice !== '0') {
      const monthlyCost = parseFloat(plan.monthlyPrice) * 12
      const yearlyCost = parseFloat(plan.yearlyPrice)
      const savings = monthlyCost - yearlyCost
      return Math.round(savings)
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-96 h-96 bg-blue-300 opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>

          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Offres Spéciales Disponibles</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Tarifs Simples & Transparents
            </h1>
            <p className="text-xl text-white/90">
              Choisissez le plan parfait pour faire grandir votre activité avec des outils professionnels
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-2 inline-flex border border-gray-200">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                plan.popular ? 'border-4 border-purple-500 scale-105' : 'border border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg flex items-center space-x-1">
                    <Rocket className="w-4 h-4" />
                    <span>POPULAIRE</span>
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 ${plan.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                <plan.icon className={`w-8 h-8 ${plan.iconColor}`} />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.subtitle}</p>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {getPrice(plan)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    DT/{billingCycle === 'monthly' ? 'mois' : 'an'}
                  </span>
                </div>
                {billingCycle === 'yearly' && getSavings(plan) > 0 && (
                  <p className="text-sm text-green-600 font-semibold mt-2">
                    Économisez {getSavings(plan)} DT par an
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {feature.included ? (
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                          <X className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button 
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir ServiGo ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Comparaison détaillée
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Fonctionnalités</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Basique</th>
                    <th className="text-center py-4 px-4 font-semibold text-purple-600">Pro</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Entreprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Demandes par mois', basic: '5', pro: 'Illimité', enterprise: 'Illimité' },
                    { feature: 'Support', basic: 'Email', pro: '24/7 Prioritaire', enterprise: 'Dédié 24/7' },
                    { feature: 'Statistiques', basic: '❌', pro: '✅', enterprise: '✅ Avancées' },
                    { feature: 'API', basic: '❌', pro: '❌', enterprise: '✅' },
                    { feature: 'Formation', basic: '❌', pro: '❌', enterprise: '✅ Personnalisée' }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                      <td className="py-4 px-4 text-center text-gray-600">{row.basic}</td>
                      <td className="py-4 px-4 text-center text-purple-600 font-semibold">{row.pro}</td>
                      <td className="py-4 px-4 text-center text-gray-600">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions Fréquentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <h3 className="font-bold text-gray-900 mb-3 flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-gray-600 text-sm ml-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de professionnels qui font confiance à ServiGo pour développer leur activité
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Parler à un Expert</span>
            </button>
            <button className="w-full sm:w-auto bg-black/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-black/30 transition-all duration-300 flex items-center justify-center space-x-2 border-2 border-white/30">
              <Clock className="w-5 h-5" />
              <span>Essai Gratuit 14 Jours</span>
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default PricingPage
