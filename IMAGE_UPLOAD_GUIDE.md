# Image Upload System - Complete Guide

## Overview
The image upload system allows users to upload images when creating services. Images are stored in Supabase Storage and displayed in service cards.

## How It Works

### 1. **Upload Process** (PostOnlineService.jsx & PostOnsiteService.jsx)
```
User selects image → Preview shown → Form submitted → Image uploaded to Supabase Storage → Public URL saved to database
```

### 2. **Storage Location**
- **Primary bucket**: `service-images` (public)
- **Fallback bucket**: `profiles/service-images/` (if service-images doesn't exist)

### 3. **Database Storage**
- **Online services**: `services_online.image` column
- **Onsite services**: `services_onsite.image` column
- Stores the public URL of the uploaded image

### 4. **Display in Cards** (Services.jsx)
- If `service.image` exists and loads successfully → Show uploaded image
- If no image or image fails to load → Show default icon (Globe for online, MapPin for onsite)

## Setup Instructions

### Step 1: Run the Storage Setup SQL
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the content from `SETUP_STORAGE.sql`
3. Click "Run" to execute
4. This will:
   - Create `service-images` bucket (public)
   - Set up access policies
   - Make profiles bucket public

### Step 2: Verify Storage Buckets
1. Go to Supabase Dashboard → Storage
2. You should see:
   - ✅ `service-images` bucket (public)
   - ✅ `profiles` bucket (public)

### Step 3: Test Image Upload
1. Login as a provider
2. Click "Publier un Service"
3. Select service type (Onsite or Online)
4. Fill in the form
5. Click "Choisir une image" and select an image (max 5MB)
6. See the preview
7. Submit the form
8. Check browser console (F12) for upload logs:
   - 📤 Uploading image
   - ✅ Image uploaded successfully
   - 🔗 Public URL

### Step 4: Verify in Database
1. Go to Supabase Dashboard → Table Editor
2. Open `services_online` or `services_onsite` table
3. Find your service
4. Check the `image` column - should contain a URL like:
   ```
   https://[project].supabase.co/storage/v1/object/public/service-images/[filename]
   ```

## Features

### ✅ Image Upload
- Supports JPG, PNG, GIF formats
- Max file size: 5MB
- Automatic file naming: `{userId}-{timestamp}.{extension}`
- Progress indication during upload

### ✅ Image Preview
- Shows preview before uploading
- Preview updates when selecting different image

### ✅ Error Handling
- File size validation
- Upload error messages
- Fallback to default icon if image fails to load
- Console logging for debugging

### ✅ Display in Cards
- Uploaded images shown in service cards
- Proper aspect ratio (16:9)
- Smooth hover effects
- Fallback to default icon if no image

## Troubleshooting

### Problem: Image not uploading
**Solution:**
1. Check browser console for errors
2. Verify storage buckets exist in Supabase
3. Run `SETUP_STORAGE.sql` script
4. Check file size (must be < 5MB)

### Problem: Image not displaying in card
**Solution:**
1. Check if `image` column in database has a URL
2. Verify the URL is accessible (copy-paste in browser)
3. Check if storage bucket is public
4. Look for errors in browser console

### Problem: "Bucket not found" error
**Solution:**
1. Run `SETUP_STORAGE.sql` to create buckets
2. Or manually create `service-images` bucket in Supabase Dashboard
3. Make sure bucket is set to "Public"

### Problem: Image URL saved but not loading
**Solution:**
1. Check if bucket is public (Storage → Buckets → service-images → Settings)
2. Verify RLS policies allow public SELECT
3. Try accessing the URL directly in browser

## Code Flow

### Upload Function
```javascript
uploadImage() {
  1. Check if file exists
  2. Generate unique filename
  3. Try uploading to service-images bucket
  4. If bucket not found, fallback to profiles bucket
  5. Get public URL
  6. Return URL (or null if failed)
}
```

### Form Submit
```javascript
handleSubmit() {
  1. Validate form
  2. Upload image (if provided)
  3. Insert service with image URL
  4. Redirect to services page
}
```

### Card Display
```javascript
ServiceCard() {
  1. Check if service.image exists
  2. Try to load image
  3. If load fails, show default icon
  4. Handle image error gracefully
}
```

## Database Schema

### services_online table
```sql
image TEXT  -- Stores public URL of uploaded image
```

### services_onsite table
```sql
image TEXT  -- Stores public URL of uploaded image
```

## Storage Structure

```
service-images/
  ├── {userId}-{timestamp}.jpg
  ├── {userId}-{timestamp}.png
  └── ...

OR (fallback)

profiles/
  └── service-images/
      ├── {userId}-{timestamp}.jpg
      └── ...
```

## Best Practices

1. **Always validate file size** before upload (max 5MB)
2. **Show preview** to user before submitting
3. **Log errors** to console for debugging
4. **Handle failures gracefully** with fallback UI
5. **Use unique filenames** to avoid conflicts
6. **Set cache control** for better performance
7. **Make buckets public** for easy access

## Security Notes

- Images are stored in public buckets (anyone can view)
- Only authenticated users can upload
- File size limited to 5MB
- No sensitive data should be in images
- Consider adding virus scanning for production

## Next Steps

1. ✅ Run `SETUP_STORAGE.sql`
2. ✅ Test uploading an image
3. ✅ Verify image displays in card
4. ✅ Check console logs for any errors
5. ✅ Enjoy your working image upload system!
