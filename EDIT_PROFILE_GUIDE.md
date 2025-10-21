# Edit Profile Page - Guide

## Overview
A comprehensive profile editing page for both **Clients** and **Providers** in the ServiGo application.

## Features

### 🎯 Two-Tab Interface
1. **Informations personnelles** - Personal information tab
2. **Sécurité** - Security/Password tab

### 👤 Personal Information Tab

#### For All Users (Client & Provider):
- **Profile Photo Upload**
  - Visual preview with camera icon overlay
  - Max file size: 5 MB
  - Supported formats: JPG, PNG, GIF
  - Stored in Supabase Storage (`profiles/avatars/`)

- **Full Name** (editable)
- **Email** (read-only, cannot be changed)
- **Phone Number** (editable)

#### Additional Fields for Providers:
- **City** (dropdown with Tunisian cities)
- **Category** (service category dropdown)
- **Experience Years** (number input)
- **Bio/Presentation** (textarea for professional description)

### 🔒 Security Tab
- **Current Password** (optional field)
- **New Password** (minimum 6 characters)
- **Confirm New Password** (must match new password)

## Routes

### Access URL
```
/edit-profile
```

### Protection
- ✅ Protected route (requires authentication)
- ✅ Accessible by both clients and providers
- ✅ Automatically redirects to login if not authenticated

## Technical Details

### Database Integration

#### Tables Used:
1. **profiles** - Base user information
   - `id`, `full_name`, `email`, `phone`, `avatar_url`

2. **providers** (for provider users only)
   - `user_id`, `full_name`, `email`, `phone`, `city`, `category`
   - `experience_years`, `bio`, `profile_image`, `is_active`

### Image Upload Flow:
1. User selects image → Preview shown
2. On form submit → Image uploaded to Supabase Storage
3. Public URL generated and saved to database
4. Old images remain (no automatic cleanup)

### State Management:
- Uses React hooks (`useState`, `useEffect`)
- Integrates with `AuthContext` for user data
- Real-time form validation

## User Experience

### Success Flow:
1. User clicks "Edit Profile" from dashboard
2. Form loads with current user data
3. User makes changes
4. Clicks "Enregistrer les modifications"
5. Success message displayed
6. Auto-redirects to dashboard after 1.5 seconds

### Error Handling:
- ❌ Image too large (>5 MB)
- ❌ Password mismatch
- ❌ Password too short (<6 characters)
- ❌ Database errors
- All errors displayed in red alert box

### Loading States:
- Spinner animation during save
- Disabled buttons during processing
- Clear visual feedback

## Navigation

### Entry Points:
Users can access this page from:
- Provider Dashboard → Settings/Profile button
- Client Dashboard → Settings/Profile button
- Header menu (if implemented)

### Exit Points:
- "Retour" (Back) button → Previous page
- "Annuler" (Cancel) button → Previous page
- Auto-redirect after successful save → Dashboard

## Styling

### Design System:
- **Colors**: Blue-purple gradient for primary actions
- **Layout**: Centered, max-width 4xl container
- **Responsive**: Mobile-friendly with grid layouts
- **Icons**: Lucide React icons throughout
- **Shadows**: Subtle shadow-sm for cards

### Visual Hierarchy:
1. Page title and description
2. Tab navigation
3. Form sections with clear labels
4. Primary action buttons (gradient)
5. Secondary actions (outlined)

## Future Enhancements

### Potential Additions:
- [ ] Email verification before change
- [ ] Two-factor authentication
- [ ] Account deletion option
- [ ] Privacy settings
- [ ] Notification preferences
- [ ] Language selection
- [ ] Profile visibility toggle (for providers)
- [ ] Social media links
- [ ] Portfolio/gallery upload (for providers)

## Usage Example

### For Clients:
```javascript
// Navigate to edit profile
navigate('/edit-profile')

// User can update:
// - Name, phone, profile photo
// - Change password
```

### For Providers:
```javascript
// Navigate to edit profile
navigate('/edit-profile')

// User can update:
// - Name, phone, profile photo
// - City, category, experience
// - Professional bio
// - Change password
```

## Testing Checklist

- [ ] Profile loads with existing data
- [ ] Image upload works (under 5 MB)
- [ ] Image upload rejects large files
- [ ] Form validation works
- [ ] Profile updates save correctly
- [ ] Password change works
- [ ] Password mismatch shows error
- [ ] Success message displays
- [ ] Auto-redirect works
- [ ] Back button works
- [ ] Cancel button works
- [ ] Provider-specific fields show only for providers
- [ ] Client fields work correctly
- [ ] Mobile responsive layout
- [ ] Loading states display properly

## Security Considerations

### Implemented:
- ✅ Protected route (authentication required)
- ✅ Email cannot be changed (prevents account hijacking)
- ✅ Password minimum length enforced
- ✅ File size validation
- ✅ User can only edit their own profile

### Recommended:
- [ ] Rate limiting on password changes
- [ ] Email verification for sensitive changes
- [ ] Audit log for profile changes
- [ ] CSRF protection
- [ ] Input sanitization for bio/text fields

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Supabase connection
3. Check user authentication status
4. Verify database table structure matches schema
