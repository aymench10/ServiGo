import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProviderDashboard from './pages/ProviderDashboard'
import ClientDashboard from './pages/ClientDashboard'
import ClearData from './pages/ClearData'
import Services from './pages/Services'
import OnsiteServices from './pages/OnsiteServices'
import ProviderProfile from './pages/ProviderProfile'
import CreateProviderProfile from './pages/CreateProviderProfile'
import SelectServiceType from './pages/SelectServiceType'
import PostOnsiteService from './pages/PostOnsiteService'
import PostOnlineService from './pages/PostOnlineService'
import EditProfile from './pages/EditProfile'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/clear-data" element={<ClearData />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/onsite" element={<OnsiteServices />} />
          <Route path="/provider/:providerId" element={<ProviderProfile />} />
          
          {/* Protected Routes - Provider Profile */}
          <Route
            path="/provider/create-profile"
            element={
              <ProtectedRoute requiredRole="provider">
                <CreateProviderProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Services */}
          <Route
            path="/services/select-type"
            element={
              <ProtectedRoute requiredRole="provider">
                <SelectServiceType />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services/post/onsite"
            element={
              <ProtectedRoute requiredRole="provider">
                <PostOnsiteService />
              </ProtectedRoute>
            }
          />

          <Route
            path="/services/post/online"
            element={
              <ProtectedRoute requiredRole="provider">
                <PostOnlineService />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Provider */}
          <Route
            path="/provider/dashboard"
            element={
              <ProtectedRoute requiredRole="provider">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Client */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Edit Profile (Both roles) */}
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
