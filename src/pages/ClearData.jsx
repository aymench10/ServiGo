import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'

const ClearData = () => {
  const navigate = useNavigate()

  const clearAllData = () => {
    // Clear localStorage
    localStorage.clear()
    
    // Clear sessionStorage
    sessionStorage.clear()
    
    alert('✅ All data cleared! You can now create a new account.')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Clear Old Data
        </h1>
        
        <p className="text-gray-600 mb-6">
          If you created an account before the latest updates, you need to clear the old data and create a new account.
        </p>
        
        <button
          onClick={clearAllData}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition mb-4"
        >
          Clear All Data
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}

export default ClearData
