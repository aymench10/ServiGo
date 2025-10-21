import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import CitiesSection from '../components/CitiesSection'
import Stats from '../components/Stats'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <Hero />
      <Features />
      <CitiesSection />
      <Stats />
      <CTASection />
      <Footer />
    </div>
  )
}

export default Home
