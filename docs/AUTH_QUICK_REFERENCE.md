# 🚀 Auth Quick Reference

Quick copy-paste snippets for common authentication tasks.

## 🔑 Setup

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Add your Supabase credentials to .env
# Get from: https://app.supabase.com/project/_/settings/api

# 3. Restart dev server
npm run dev
```

## 📦 Imports

```javascript
// Main auth hook (recommended)
import { useAuth } from './hooks/useAuth'

// User identification hook
import { useCurrentUser } from './hooks/useCurrentUser'

// Auth helpers
import { 
  validateAuth, 
  requireAuth, 
  getAccessToken 
} from './utils/auth-helpers'

// Direct client access
import { supabaseClient } from './lib/supabase-client'

// Legacy context (backward compatible)
import { useAuth } from './context/AuthContext'
```

## 🎣 Using Hooks

### Basic Auth Hook

```javascript
function MyComponent() {
  const { 
    user,           // Current user object
    loading,        // Loading state
    signIn,         // Sign in function
    signOut,        // Sign out function
    isAuthenticated // Boolean
  } = useAuth()

  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.full_name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

### Current User Hook

```javascript
function ProfileComponent() {
  const { 
    user,           // Current user
    hasRole,        // Check role function
    refresh,        // Refresh user data
    isAuthenticated // Boolean
  } = useCurrentUser()

  const isProvider = hasRole('provider')

  return (
    <div>
      {isProvider && <ProviderDashboard />}
    </div>
  )
}
```

## 🔐 Authentication

### Sign Up

```javascript
const { signUp } = useAuth()

// Basic signup
const result = await signUp(
  'user@example.com',
  'secure-password',
  {
    full_name: 'John Doe',
    role: 'client'
  }
)

if (result.success) {
  console.log('User created!')
} else {
  console.error(result.error)
}
```

### Sign In

```javascript
const { signIn } = useAuth()

const result = await signIn('user@example.com', 'password')

if (result.success) {
  // Redirect to dashboard
  navigate('/dashboard')
}
```

### Sign Out

```javascript
const { signOut } = useAuth()

await signOut()
navigate('/login')
```

### Reset Password

```javascript
const { resetPassword } = useAuth()

const result = await resetPassword('user@example.com')

if (result.success) {
  alert('Check your email for reset link')
}
```

### Update Password

```javascript
const { updatePassword } = useAuth()

const result = await updatePassword('new-secure-password')

if (result.success) {
  alert('Password updated!')
}
```

## 👤 User Operations

### Get Current User

```javascript
const { user } = useCurrentUser()

console.log(user.id)
console.log(user.email)
console.log(user.full_name)
console.log(user.role)
```

### Update Profile

```javascript
const { updateProfile } = useAuth()

await updateProfile({
  full_name: 'Jane Doe',
  phone: '+1234567890'
})
```

### Refresh User Data

```javascript
const { refresh } = useCurrentUser()

const updatedUser = await refresh()
```

## 🔒 Access Control

### Check Authentication

```javascript
const { isAuthenticated } = useAuth()

if (!isAuthenticated) {
  navigate('/login')
}
```

### Check Role

```javascript
const { hasRole } = useCurrentUser()

if (hasRole('provider')) {
  // Show provider features
}

if (hasRole('client')) {
  // Show client features
}
```

### Check Multiple Roles

```javascript
const { hasAnyRole } = useCurrentUser()

if (hasAnyRole(['provider', 'admin'])) {
  // Show admin features
}
```

### Require Authentication

```javascript
import { requireAuth } from './utils/auth-helpers'

async function ProtectedComponent() {
  try {
    await requireAuth()
    // User is authenticated
  } catch (error) {
    navigate('/login')
  }
}
```

### Require Specific Role

```javascript
import { requireRole } from './utils/auth-helpers'

async function ProviderOnlyComponent() {
  try {
    await requireRole('provider')
    // User is a provider
  } catch (error) {
    alert('Access denied')
  }
}
```

## 🎫 Tokens

### Get Access Token

```javascript
const { getAccessToken } = useAuth()

const token = await getAccessToken()

// Use in API calls
fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Check Token Expiration

```javascript
import { isTokenExpired, getAccessToken } from './utils/auth-helpers'

const token = await getAccessToken()

if (isTokenExpired(token)) {
  // Token expired, refresh it
  await refreshSession()
}
```

## 🗄️ Direct Database Access

### Query with Auth

```javascript
import { supabaseClient } from './lib/supabase-client'

// Get user's own data (RLS enforced)
const { data, error } = await supabaseClient
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()
```

### Insert Data

```javascript
const { data, error } = await supabaseClient
  .from('bookings')
  .insert({
    user_id: user.id,
    service_id: serviceId,
    date: bookingDate
  })
```

### Update Data

```javascript
const { error } = await supabaseClient
  .from('profiles')
  .update({ full_name: 'New Name' })
  .eq('id', user.id)
```

### Delete Data

```javascript
const { error } = await supabaseClient
  .from('bookings')
  .delete()
  .eq('id', bookingId)
  .eq('user_id', user.id) // RLS ensures user owns this
```

## 🛡️ Protected Routes

### React Router v6

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return isAuthenticated ? children : <Navigate to="/login" />
}

// Usage
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### Role-Based Route

```javascript
function ProviderRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to="/login" />
  
  if (user.role !== 'provider') {
    return <Navigate to="/unauthorized" />
  }

  return children
}
```

## 📝 Forms

### Login Form

```javascript
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      alert(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### Signup Form

```javascript
function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'client'
  })
  const { signUp, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const result = await signUp(
      formData.email,
      formData.password,
      {
        full_name: formData.full_name,
        role: formData.role
      }
    )
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      alert(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
        required
      />
      <input 
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      <input 
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
      />
      <select 
        value={formData.role}
        onChange={(e) => setFormData({...formData, role: e.target.value})}
      >
        <option value="client">Client</option>
        <option value="provider">Provider</option>
      </select>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  )
}
```

## 🎨 UI Components

### User Avatar

```javascript
function UserAvatar() {
  const { user } = useCurrentUser()

  return (
    <div className="flex items-center gap-2">
      {user?.avatar_url ? (
        <img 
          src={user.avatar_url} 
          alt={user.full_name}
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          {user?.full_name?.charAt(0).toUpperCase()}
        </div>
      )}
      <span>{user?.full_name}</span>
    </div>
  )
}
```

### Auth Status Badge

```javascript
function AuthBadge() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div>
      {isAuthenticated ? (
        <span className="badge badge-success">
          Logged in as {user.role}
        </span>
      ) : (
        <span className="badge badge-warning">
          Not logged in
        </span>
      )}
    </div>
  )
}
```

## 🔄 State Management

### Loading States

```javascript
function MyComponent() {
  const { user, loading, error } = useAuth()

  if (loading) {
    return <div>Loading user data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return <div>Welcome, {user.full_name}!</div>
}
```

### Conditional Rendering

```javascript
function Dashboard() {
  const { user, isProvider, isClient } = useAuth()

  return (
    <div>
      <h1>Dashboard</h1>
      
      {isProvider && <ProviderDashboard />}
      {isClient && <ClientDashboard />}
      
      {user?.role === 'admin' && <AdminPanel />}
    </div>
  )
}
```

## 🐛 Error Handling

### Try-Catch Pattern

```javascript
const { signIn } = useAuth()

try {
  const result = await signIn(email, password)
  
  if (!result.success) {
    throw new Error(result.error)
  }
  
  navigate('/dashboard')
} catch (error) {
  console.error('Login failed:', error)
  setError(error.message)
}
```

### Result Pattern

```javascript
const result = await signUp(email, password, metadata)

if (result.success) {
  // Success handling
  console.log('User created:', result.user)
} else {
  // Error handling
  console.error('Signup failed:', result.error)
  setError(result.error)
}
```

## 📱 Common Patterns

### Auto-redirect on Auth

```javascript
function LoginPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return <LoginForm />
}
```

### Persist Redirect Path

```javascript
// Before login
const location = useLocation()
const from = location.state?.from?.pathname || '/dashboard'

// After successful login
navigate(from, { replace: true })
```

### Role-based Navigation

```javascript
function HomePage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'provider') {
        navigate('/provider-dashboard')
      } else {
        navigate('/client-dashboard')
      }
    }
  }, [isAuthenticated, user, navigate])

  return <LandingPage />
}
```

## 🎯 Best Practices

### ✅ DO

```javascript
// Use hooks for auth state
const { user } = useAuth()

// Validate on server-side too
await requireAuth()

// Handle loading states
if (loading) return <Spinner />

// Check roles properly
if (hasRole('provider')) { /* ... */ }

// Use access tokens for API calls
const token = await getAccessToken()
```

### ❌ DON'T

```javascript
// Don't trust client-side checks only
// Always validate on server

// Don't expose service role key
// Keep it server-side only

// Don't ignore loading states
// Always handle them

// Don't hardcode roles
// Use helper functions

// Don't store sensitive data in localStorage
// Use Supabase's secure storage
```

---

**Quick Links:**
- [Full Setup Guide](SUPABASE_AUTH_SETUP.md)
- [API Reference](AUTH_API_REFERENCE.md)
- [Main README](../SUPABASE_AUTH_README.md)
