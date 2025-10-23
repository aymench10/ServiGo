# Supabase Authentication Setup Guide

## Overview

This project uses **Supabase** for authentication with the latest version (`@supabase/supabase-js ^2.75.1`). The implementation includes secure client, server, and admin configurations with proper separation of concerns.

## 🔐 Security Architecture

### Three-Tier Client System

1. **Client (`supabase-client.js`)** - Browser/Frontend
   - Uses anon key (safe to expose)
   - Respects Row Level Security (RLS)
   - Handles user authentication
   - PKCE flow for enhanced security

2. **Server (`supabase-server.js`)** - Server-side operations
   - Uses anon key with server context
   - Still respects RLS
   - Token validation
   - Prepared for backend integration

3. **Admin (`supabase-admin.js`)** - Administrative operations
   - Uses service role key (NEVER expose to client)
   - Bypasses RLS
   - Full database access
   - Server-side only

## 📁 File Structure

```
src/
├── lib/
│   ├── supabase.js              # Legacy client (backward compatibility)
│   ├── supabase-client.js       # New secure client
│   ├── supabase-server.js       # Server-side client
│   └── supabase-admin.js        # Admin client (server-only)
├── hooks/
│   ├── useAuth.js               # Main auth hook
│   └── useCurrentUser.js        # Secure user identification hook
├── utils/
│   └── auth-helpers.js          # Auth utility functions
└── context/
    └── AuthContext.jsx          # Auth context provider (updated)
```

## 🚀 Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
# Public URL (safe to expose)
VITE_SUPABASE_URL=https://your-project.supabase.co

# Anon/Public Key (safe to expose)
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Service Role Key (NEVER expose in client code!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Get these values from:** [Supabase Dashboard](https://app.supabase.com) → Your Project → Settings → API

### 2. Install Dependencies

Dependencies are already in `package.json`:

```json
{
  "@supabase/supabase-js": "^2.75.1"
}
```

## 💻 Usage Examples

### Using the Auth Hook

```javascript
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { 
    user, 
    loading, 
    signIn, 
    signOut, 
    isAuthenticated,
    isProvider,
    isClient 
  } = useAuth()

  const handleLogin = async () => {
    const result = await signIn('email@example.com', 'password')
    if (result.success) {
      console.log('Logged in!')
    }
  }

  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.full_name}!</p>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  )
}
```

### Using Current User Hook

```javascript
import { useCurrentUser } from '../hooks/useCurrentUser'

function ProfileComponent() {
  const { 
    user, 
    loading, 
    refresh, 
    hasRole,
    getToken 
  } = useCurrentUser()

  const isProvider = hasRole('provider')

  return (
    <div>
      {user && (
        <>
          <h1>{user.full_name}</h1>
          <p>Role: {user.role}</p>
          {isProvider && <p>Provider Dashboard</p>}
        </>
      )}
    </div>
  )
}
```

### Using Auth Context (Legacy)

```javascript
import { useAuth } from '../context/AuthContext'

function LegacyComponent() {
  const { user, login, logout, isProvider } = useAuth()
  
  // Same API as before, now with enhanced security
}
```

### Direct Client Usage

```javascript
import { supabaseClient } from '../lib/supabase-client'

// Sign up
const { data, error } = await supabaseClient.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'client'
    }
  }
})

// Sign in
const { data, error } = await supabaseClient.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
})

// Get current user
const { data: { user } } = await supabaseClient.auth.getUser()

// Sign out
await supabaseClient.auth.signOut()
```

### Using Auth Helpers

```javascript
import {
  validateAuth,
  getCurrentAuthUser,
  getCompleteUserData,
  hasRole,
  requireAuth,
  getAccessToken
} from '../utils/auth-helpers'

// Check if authenticated
const isAuth = await validateAuth()

// Get complete user data
const userData = await getCompleteUserData()

// Check role
const isProvider = await hasRole('provider')

// Require authentication (throws error if not authenticated)
try {
  await requireAuth()
  // User is authenticated
} catch (error) {
  // Redirect to login
}

// Get access token for API calls
const token = await getAccessToken()
```

## 🔒 Security Best Practices

### ✅ DO:

1. **Use `supabaseClient`** for all client-side operations
2. **Store service role key** only in server environment variables
3. **Validate user authentication** before sensitive operations
4. **Use RLS policies** in Supabase for data access control
5. **Implement PKCE flow** (already configured)
6. **Refresh tokens automatically** (already configured)

### ❌ DON'T:

1. **Never expose service role key** in client-side code
2. **Never trust client-side JWT parsing** for security decisions
3. **Never bypass RLS** unless absolutely necessary (admin operations only)
4. **Never store sensitive data** in localStorage without encryption
5. **Never use admin client** in browser environment

## 🛡️ Authentication Flow

### Sign Up Flow

```
1. User submits registration form
2. supabaseClient.auth.signUp() creates auth user
3. Supabase sends confirmation email (if enabled)
4. Profile created in 'profiles' table
5. Provider profile created if role is 'provider'
6. User automatically logged in
7. Session stored in localStorage
```

### Sign In Flow

```
1. User submits login credentials
2. supabaseClient.auth.signInWithPassword() validates
3. JWT tokens generated (access + refresh)
4. Session stored in localStorage
5. User profile loaded from database
6. Auth state updated globally
```

### Session Management

```
- Access token: Valid for 1 hour (default)
- Refresh token: Valid for 30 days (default)
- Auto-refresh: Enabled (happens automatically)
- Storage: localStorage with key 'servigo-auth-token'
- PKCE flow: Enabled for enhanced security
```

## 🔧 Advanced Configuration

### Custom Auth Options

```javascript
import { createClient } from '@supabase/supabase-js'

const customClient = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'custom-auth-key',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Custom-Header': 'value'
    }
  }
})
```

### Server-Side Token Validation

```javascript
import { getUserFromToken } from '../lib/supabase-server'

// In your API route/middleware
const token = req.headers.authorization?.replace('Bearer ', '')
const user = await getUserFromToken(token)

if (!user) {
  return res.status(401).json({ error: 'Unauthorized' })
}

// User is authenticated, proceed
```

### Admin Operations (Server-Only)

```javascript
// ⚠️ ONLY use in secure server environment
import { 
  adminCreateUser, 
  adminDeleteUser,
  adminListUsers 
} from '../lib/supabase-admin'

// Create user as admin
const result = await adminCreateUser({
  email: 'user@example.com',
  password: 'secure-password',
  metadata: { role: 'provider' }
})

// List all users
const { users } = await adminListUsers(1, 50)
```

## 📊 Database Schema

### Required Tables

```sql
-- profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT CHECK (role IN ('client', 'provider')),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- provider_profiles table
CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  service_category TEXT,
  location TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Provider profiles policies
CREATE POLICY "Anyone can view provider profiles"
  ON provider_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Providers can update own profile"
  ON provider_profiles FOR UPDATE
  USING (auth.uid() = user_id);
```

## 🐛 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure `.env` file exists with correct values
   - Restart dev server after adding env variables

2. **"User authentication mismatch"**
   - Token might be expired
   - Call `supabaseClient.auth.refreshSession()`

3. **"Admin client cannot be used in browser"**
   - Admin operations must be server-side only
   - Move admin code to backend API routes

4. **Session not persisting**
   - Check localStorage is enabled
   - Verify `persistSession: true` in client config

## 🔄 Migration from Old Setup

If you're migrating from the old `supabase.js`:

```javascript
// Old
import { supabase } from '../lib/supabase'

// New
import { supabaseClient } from '../lib/supabase-client'

// Or use the new hooks
import { useAuth } from '../hooks/useAuth'
```

The old `supabase.js` is kept for backward compatibility but should be replaced gradually.

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PKCE Flow Explained](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
- [JWT Token Management](https://supabase.com/docs/guides/auth/sessions)

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review Supabase official docs
3. Check browser console for error messages
4. Verify environment variables are set correctly

---

**Last Updated:** October 2025
**Supabase Version:** 2.75.1
