# Authentication API Reference

Complete reference for all authentication functions, hooks, and utilities in ServiGo.

## Table of Contents

- [Hooks](#hooks)
  - [useAuth](#useauth)
  - [useCurrentUser](#usecurrentuser)
- [Auth Helpers](#auth-helpers)
- [Supabase Clients](#supabase-clients)
- [Auth Context](#auth-context)

---

## Hooks

### useAuth

Main authentication hook providing complete auth functionality.

**Import:**
```javascript
import { useAuth } from '../hooks/useAuth'
```

**Returns:**
```typescript
{
  user: Object | null,              // Current user profile
  session: Object | null,           // Current session
  loading: boolean,                 // Loading state
  error: string | null,             // Error message
  signUp: Function,                 // Sign up function
  signIn: Function,                 // Sign in function
  signOut: Function,                // Sign out function
  resetPassword: Function,          // Reset password function
  updatePassword: Function,         // Update password function
  updateProfile: Function,          // Update profile function
  getAccessToken: Function,         // Get access token
  isAuthenticated: boolean,         // Is user authenticated
  isProvider: boolean,              // Is user a provider
  isClient: boolean                 // Is user a client
}
```

**Methods:**

#### signUp(email, password, metadata)

Sign up a new user.

```javascript
const { signUp } = useAuth()

const result = await signUp(
  'user@example.com',
  'secure-password',
  {
    full_name: 'John Doe',
    role: 'client'
  }
)

if (result.success) {
  console.log('User created:', result.user)
} else {
  console.error('Error:', result.error)
}
```

**Parameters:**
- `email` (string): User email
- `password` (string): User password
- `metadata` (object): Additional user metadata

**Returns:** `Promise<{success: boolean, user?: object, session?: object, error?: string}>`

---

#### signIn(email, password)

Sign in an existing user.

```javascript
const { signIn } = useAuth()

const result = await signIn('user@example.com', 'password')

if (result.success) {
  console.log('Logged in:', result.user)
}
```

**Parameters:**
- `email` (string): User email
- `password` (string): User password

**Returns:** `Promise<{success: boolean, user?: object, session?: object, error?: string}>`

---

#### signOut()

Sign out the current user.

```javascript
const { signOut } = useAuth()

const result = await signOut()

if (result.success) {
  console.log('Logged out successfully')
}
```

**Returns:** `Promise<{success: boolean, error?: string}>`

---

#### resetPassword(email)

Send password reset email.

```javascript
const { resetPassword } = useAuth()

const result = await resetPassword('user@example.com')

if (result.success) {
  console.log('Reset email sent')
}
```

**Parameters:**
- `email` (string): User email

**Returns:** `Promise<{success: boolean, error?: string}>`

---

#### updatePassword(newPassword)

Update user password.

```javascript
const { updatePassword } = useAuth()

const result = await updatePassword('new-secure-password')

if (result.success) {
  console.log('Password updated')
}
```

**Parameters:**
- `newPassword` (string): New password

**Returns:** `Promise<{success: boolean, error?: string}>`

---

#### updateProfile(updates)

Update user profile.

```javascript
const { updateProfile } = useAuth()

const result = await updateProfile({
  full_name: 'Jane Doe',
  phone: '+1234567890'
})

if (result.success) {
  console.log('Profile updated')
}
```

**Parameters:**
- `updates` (object): Profile fields to update

**Returns:** `Promise<{success: boolean, error?: string}>`

---

#### getAccessToken()

Get current access token.

```javascript
const { getAccessToken } = useAuth()

const token = await getAccessToken()

// Use token for API calls
fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

**Returns:** `Promise<string | null>`

---

### useCurrentUser

Secure hook for identifying the current authenticated user with validation.

**Import:**
```javascript
import { useCurrentUser } from '../hooks/useCurrentUser'
```

**Returns:**
```typescript
{
  user: Object | null,              // Current user
  loading: boolean,                 // Loading state
  error: string | null,             // Error message
  refresh: Function,                // Refresh user data
  hasRole: Function,                // Check if user has role
  hasAnyRole: Function,             // Check if user has any of roles
  getToken: Function,               // Get access token
  isAuthenticated: boolean,         // Is authenticated
  userId: string | null,            // User ID
  userEmail: string | null,         // User email
  userRole: string | null           // User role
}
```

**Methods:**

#### refresh()

Manually refresh user data.

```javascript
const { refresh } = useCurrentUser()

const updatedUser = await refresh()
```

**Returns:** `Promise<Object | null>`

---

#### hasRole(role)

Check if user has a specific role.

```javascript
const { hasRole } = useCurrentUser()

if (hasRole('provider')) {
  // User is a provider
}
```

**Parameters:**
- `role` (string): Role to check

**Returns:** `boolean`

---

#### hasAnyRole(roles)

Check if user has any of the specified roles.

```javascript
const { hasAnyRole } = useCurrentUser()

if (hasAnyRole(['provider', 'admin'])) {
  // User is either provider or admin
}
```

**Parameters:**
- `roles` (string[]): Array of roles to check

**Returns:** `boolean`

---

#### getToken()

Get current access token.

```javascript
const { getToken } = useCurrentUser()

const token = await getToken()
```

**Returns:** `Promise<string | null>`

---

## Auth Helpers

Utility functions for authentication operations.

**Import:**
```javascript
import {
  validateAuth,
  getCurrentAuthUser,
  getUserProfile,
  getProviderProfile,
  getCompleteUserData,
  hasRole,
  isProvider,
  isClient,
  requireAuth,
  requireRole,
  getAccessToken,
  refreshSession,
  signOut,
  parseJWT,
  isTokenExpired
} from '../utils/auth-helpers'
```

### validateAuth()

Validate if user is authenticated.

```javascript
const isAuth = await validateAuth()

if (isAuth) {
  // User is authenticated
}
```

**Returns:** `Promise<boolean>`

---

### getCurrentAuthUser()

Get current authenticated user.

```javascript
const user = await getCurrentAuthUser()

if (user) {
  console.log('User ID:', user.id)
}
```

**Returns:** `Promise<Object | null>`

---

### getUserProfile(userId)

Get user profile from database.

```javascript
const profile = await getUserProfile('user-id-here')

if (profile) {
  console.log('Profile:', profile)
}
```

**Parameters:**
- `userId` (string): User ID

**Returns:** `Promise<Object | null>`

---

### getProviderProfile(userId)

Get provider profile.

```javascript
const providerProfile = await getProviderProfile('user-id-here')

if (providerProfile) {
  console.log('Business:', providerProfile.business_name)
}
```

**Parameters:**
- `userId` (string): User ID

**Returns:** `Promise<Object | null>`

---

### getCompleteUserData()

Get complete user data (auth + profile + provider if applicable).

```javascript
const userData = await getCompleteUserData()

if (userData) {
  console.log('Complete user:', userData)
  if (userData.providerProfile) {
    console.log('Provider data:', userData.providerProfile)
  }
}
```

**Returns:** `Promise<Object | null>`

---

### hasRole(requiredRole)

Check if user has specific role.

```javascript
const isProvider = await hasRole('provider')

if (isProvider) {
  // Show provider features
}
```

**Parameters:**
- `requiredRole` (string): Required role

**Returns:** `Promise<boolean>`

---

### isProvider()

Check if user is a provider.

```javascript
if (await isProvider()) {
  // User is a provider
}
```

**Returns:** `Promise<boolean>`

---

### isClient()

Check if user is a client.

```javascript
if (await isClient()) {
  // User is a client
}
```

**Returns:** `Promise<boolean>`

---

### requireAuth()

Require authentication (throws error if not authenticated).

```javascript
try {
  await requireAuth()
  // User is authenticated, proceed
} catch (error) {
  // Redirect to login
  navigate('/login')
}
```

**Throws:** `Error` if not authenticated

---

### requireRole(requiredRole)

Require specific role (throws error if user doesn't have role).

```javascript
try {
  await requireRole('provider')
  // User has provider role, proceed
} catch (error) {
  // Show error or redirect
  console.error('Access denied')
}
```

**Parameters:**
- `requiredRole` (string): Required role

**Throws:** `Error` if user doesn't have required role

---

### getAccessToken()

Get access token for API calls.

```javascript
const token = await getAccessToken()

if (token) {
  // Use token in API request
}
```

**Returns:** `Promise<string | null>`

---

### refreshSession()

Refresh current session.

```javascript
const newSession = await refreshSession()

if (newSession) {
  console.log('Session refreshed')
}
```

**Returns:** `Promise<Object | null>`

---

### signOut()

Sign out and clear all auth data.

```javascript
const success = await signOut()

if (success) {
  console.log('Signed out successfully')
}
```

**Returns:** `Promise<boolean>`

---

### parseJWT(token)

Parse JWT token (client-side only, for display purposes).

⚠️ **Warning:** Never trust client-side JWT parsing for security decisions.

```javascript
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
const payload = parseJWT(token)

if (payload) {
  console.log('User ID:', payload.sub)
  console.log('Expires:', new Date(payload.exp * 1000))
}
```

**Parameters:**
- `token` (string): JWT token

**Returns:** `Object | null`

---

### isTokenExpired(token)

Check if token is expired.

```javascript
const token = await getAccessToken()

if (isTokenExpired(token)) {
  // Token is expired, refresh it
  await refreshSession()
}
```

**Parameters:**
- `token` (string): JWT token

**Returns:** `boolean`

---

## Supabase Clients

### Client (supabase-client.js)

Standard client for browser/client-side code.

**Import:**
```javascript
import { supabaseClient, getCurrentUser, getCurrentSession, isAuthenticated } from '../lib/supabase-client'
```

**Features:**
- Uses anon key (safe to expose)
- Respects Row Level Security
- PKCE flow enabled
- Auto token refresh
- Session persistence

**Example:**
```javascript
// Get current user
const user = await getCurrentUser()

// Get current session
const session = await getCurrentSession()

// Check if authenticated
const isAuth = await isAuthenticated()

// Direct client usage
const { data, error } = await supabaseClient
  .from('profiles')
  .select('*')
  .eq('id', userId)
```

---

### Server (supabase-server.js)

Server-side client that still respects RLS.

**Import:**
```javascript
import { createServerClient, getUserFromToken, verifyToken } from '../lib/supabase-server'
```

**Example:**
```javascript
// Create server client with token
const client = createServerClient(accessToken)

// Get user from token
const user = await getUserFromToken(accessToken)

// Verify token
const validUser = await verifyToken(token)
```

---

### Admin (supabase-admin.js)

⚠️ **Server-side only!** Bypasses RLS.

**Import:**
```javascript
import {
  createAdminClient,
  adminCreateUser,
  adminDeleteUser,
  adminUpdateUserMetadata,
  adminListUsers
} from '../lib/supabase-admin'
```

**Example:**
```javascript
// Create user as admin
const result = await adminCreateUser({
  email: 'user@example.com',
  password: 'password',
  metadata: { role: 'provider' }
})

// Delete user
await adminDeleteUser(userId)

// Update metadata
await adminUpdateUserMetadata(userId, { verified: true })

// List users
const { users } = await adminListUsers(1, 50)
```

---

## Auth Context

Legacy context provider (updated with enhanced security).

**Import:**
```javascript
import { useAuth, AuthProvider } from '../context/AuthContext'
```

**Usage:**
```javascript
// Wrap app with provider
<AuthProvider>
  <App />
</AuthProvider>

// Use in components
const { user, login, logout, signup, isProvider, isClient } = useAuth()
```

**API:**
- Same as `useAuth` hook
- Maintained for backward compatibility
- Now uses secure `supabaseClient` internally

---

## Type Definitions

### User Object

```typescript
{
  id: string,
  email: string,
  full_name: string,
  phone: string,
  role: 'client' | 'provider',
  avatar_url: string | null,
  created_at: string,
  updated_at: string,
  providerProfile?: {
    id: string,
    user_id: string,
    business_name: string,
    service_category: string,
    location: string,
    description: string,
    created_at: string,
    updated_at: string
  }
}
```

### Session Object

```typescript
{
  access_token: string,
  refresh_token: string,
  expires_in: number,
  expires_at: number,
  token_type: 'bearer',
  user: {
    id: string,
    email: string,
    // ... other auth user fields
  }
}
```

---

**Last Updated:** October 2025
