import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Stats from '../components/Stats'
import Pricing from '../components/Pricing'
import Contact from '../components/Contact'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <Hero />
      <Features />
      <Stats />
      <Pricing />
      <Contact />
    </div>
  )
}

export default Home
