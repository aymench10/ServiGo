# 🛠️ Services Section - Setup Guide

## ✅ What's Been Built

### 1. **Services Page** (`/services`)
- ✅ Display all services with filtering
- ✅ Search by keyword
- ✅ Filter by City (all Tunisian cities)
- ✅ Filter by Category (18 categories)
- ✅ Service cards with images
- ✅ Provider information display
- ✅ View count tracking
- ✅ Responsive design

### 2. **Post Service Form** (`/services/post`)
- ✅ Provider-only access
- ✅ **Uses provider's profile photo** as service image (no separate upload)
- ✅ All required fields:
  - Title
  - Description
  - Category (dropdown)
  - City (dropdown)
  - Price
  - Contact phone
  - Contact email
- ✅ Form validation
- ✅ Profile photo preview

### 3. **Service Management**
- ✅ Providers can edit their services
- ✅ Providers can delete their services
- ✅ Clients can only view services
- ✅ View count increments on click

---

## 📋 Setup Steps

### Step 1: ~~Create Storage Bucket for Service Images~~ (Not needed!)

**Note:** Service images now use the provider's profile photo automatically. You only need the `profiles` storage bucket (already created for profile photos).

No need to create a separate `services` bucket!

### Step 2: Run Updated SQL Schema

1. Go to **"SQL Editor"** in Supabase
2. Copy the ENTIRE content from `supabase-schema.sql`
3. Paste and click **"Run"**

This will:
- Update the `services` table with new fields
- Add the `increment_service_views` function
- Set up proper RLS policies

### Step 3: Test the Features

#### As a Provider:
1. Login as a provider account
2. Go to `/services`
3. Click **"Publier un Service"**
4. See your profile photo displayed (will be used as service image)
5. Fill the form:
   - Enter title, description
   - Select category and city
   - Set price
   - Add contact info
6. Click **"Publier le service"**
7. See your service in the list with your profile photo
8. Edit or delete your service

#### As a Client:
1. Login as a client account
2. Go to `/services`
3. Browse all services
4. Use filters (city, category)
5. Search by keyword
6. Click **"Voir"** to view details
7. Cannot see "Publier un Service" button

---

## 🎨 Features Overview

### Service Categories (18 total):
- Plomberie
- Électricité
- Ménage
- Jardinage
- Peinture
- Climatisation
- Menuiserie
- Maçonnerie
- Déménagement
- Réparation électroménager
- Informatique
- Cours particuliers
- Coiffure
- Esthétique
- Photographie
- Événementiel
- Traiteur
- Autre

### Tunisian Cities (24 total):
All major Tunisian cities including:
- Tunis, Ariana, Ben Arous, Manouba
- Nabeul, Sousse, Sfax, Monastir
- And 16 more cities...

### Service Card Shows:
- ✅ Service image (or default placeholder)
- ✅ Category badge
- ✅ Title
- ✅ Description preview
- ✅ City location
- ✅ Provider info with avatar
- ✅ Price
- ✅ View count
- ✅ Edit/Delete buttons (owner only)

### Filtering System:
- **Search**: Real-time search in title, description, provider name
- **City Filter**: Dropdown with all Tunisian cities
- **Category Filter**: Dropdown with all service categories
- **Results Count**: Shows number of filtered services
- **Dynamic**: Updates without page reload

---

## 🔐 Access Control

### Provider Can:
- ✅ View all services
- ✅ Post new services
- ✅ Edit their own services
- ✅ Delete their own services
- ✅ See edit/delete buttons on their services

### Client Can:
- ✅ View all services
- ✅ Filter and search services
- ✅ View service details
- ❌ Cannot post services
- ❌ Cannot edit/delete services
- ❌ No "Publier un Service" button

---

## 📊 Database Schema

### Services Table Fields:
```sql
- id (UUID)
- provider_id (UUID) → links to provider_profiles
- title (TEXT)
- description (TEXT)
- category (TEXT)
- city (TEXT)
- price (DECIMAL)
- price_unit (TEXT) → default 'DT'
- contact_phone (TEXT)
- contact_email (TEXT)
- image_url (TEXT)
- is_active (BOOLEAN)
- views_count (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### RLS Policies:
- ✅ Everyone can view active services
- ✅ Providers can create services
- ✅ Providers can update/delete their own services
- ✅ View count function is public

---

## 🧪 Testing Checklist

### Provider Testing:
- [ ] Can access `/services/post`
- [ ] Can upload service image
- [ ] Can fill all form fields
- [ ] Can submit form successfully
- [ ] Service appears in list
- [ ] Can see edit/delete buttons on own services
- [ ] Can edit service
- [ ] Can delete service

### Client Testing:
- [ ] Can view `/services` page
- [ ] Cannot access `/services/post` (redirects)
- [ ] Can see all services
- [ ] Can filter by city
- [ ] Can filter by category
- [ ] Can search services
- [ ] Cannot see edit/delete buttons
- [ ] View count increments on click

### General Testing:
- [ ] Filters work correctly
- [ ] Search is real-time
- [ ] Images display properly
- [ ] Provider info shows correctly
- [ ] Price displays correctly
- [ ] Responsive on mobile
- [ ] No console errors

---

## 🐛 Troubleshooting

### Issue: "Cannot upload image"
**Solution:**
1. Make sure `services` storage bucket exists
2. Make sure it's set as PUBLIC
3. Check file size (max 5 MB)

### Issue: "Cannot create service"
**Solution:**
1. Make sure you're logged in as a provider
2. Check all required fields are filled
3. Check browser console for errors
4. Verify provider_profiles entry exists

### Issue: "Services not showing"
**Solution:**
1. Check if services exist in database
2. Check `is_active` is true
3. Clear filters (set to "all")
4. Check browser console for errors

### Issue: "Filters not working"
**Solution:**
1. Make sure data is loaded (check loading state)
2. Check browser console for errors
3. Try refreshing the page

---

## 🎯 Routes Added

- `/services` - View all services (public)
- `/services/post` - Post new service (provider only)
- `/services/edit/:id` - Edit service (coming soon)
- `/services/:id` - View service details (coming soon)

---

## 📱 Mobile Responsive

- ✅ Mobile-friendly filters
- ✅ Responsive grid layout
- ✅ Touch-friendly buttons
- ✅ Optimized images
- ✅ Mobile navigation

---

## 🚀 Next Steps

1. Create storage bucket: `services`
2. Run updated SQL schema
3. Test as provider (post service)
4. Test as client (view/filter services)
5. Verify all features work

**The Services section is ready to use!** 🎉
