# 🧪 How to Test the New Features

## ⚠️ IMPORTANT: Clear Old Data First!

If you created an account BEFORE the latest updates, you need to clear the old data.

### Method 1: Use the Clear Data Page
1. Go to: http://localhost:5173/clear-data
2. Click "Clear All Data"
3. Create a new account

### Method 2: Manual Clear (Browser Console)
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.clear()`
4. Press Enter
5. Refresh the page

---

## 📝 Steps to Test

### 1. Create Storage Bucket in Supabase
```
1. Go to: https://ghgsxxtempycioizizor.supabase.co
2. Click "Storage" in sidebar
3. Click "New bucket"
4. Name: "profiles"
5. ✅ Check "Public bucket"
6. Click "Create"
```

### 2. Run the SQL Schema
```
1. Go to "SQL Editor" in Supabase
2. Copy all content from supabase-schema.sql
3. Paste and click "Run"
```

### 3. Create a New Account
```
1. Go to: http://localhost:5173/signup
2. Select "Client" or "Prestataire"
3. Upload a profile photo (optional)
4. Fill the form
5. Click "Créer mon compte"
```

### 4. Check the Header
After login, you should see:
- ✅ Your profile photo (or default avatar)
- ✅ Your name and role
- ✅ Messages icon (💬) with blue dot
- ✅ Notifications icon (🔔) with red dot
- ✅ "Espace Client" or "Espace Prestataire" button
- ❌ NO "Connexion" or "S'inscrire" buttons

---

## 🐛 Troubleshooting

### Issue: "I don't see the changes after login"
**Solution:**
1. Go to http://localhost:5173/clear-data
2. Clear all data
3. Create a NEW account
4. The old accounts used localStorage, new ones use Supabase

### Issue: "Profile photo not showing"
**Solution:**
1. Make sure you created the "profiles" storage bucket in Supabase
2. Make sure it's set as PUBLIC
3. Try uploading a new photo

### Issue: "Can't login"
**Solution:**
1. Check browser console for errors (F12)
2. Make sure you ran the SQL schema
3. Make sure Supabase credentials are correct in .env

### Issue: "Still seeing login/signup buttons"
**Solution:**
1. Open browser console (F12)
2. Look for "Header - User state:" log
3. If it shows `null`, the user isn't logged in
4. Try logging in again with a NEW account

---

## ✅ What Should Work

### When NOT Logged In:
- See: Login & Signup buttons
- See: Language selector (FR)

### When Logged In:
- See: Profile photo
- See: User name & role
- See: Messages icon
- See: Notifications icon  
- See: Dashboard button
- NOT see: Login & Signup buttons

---

## 📸 Expected Result

**Header (Logged In):**
```
[ServiGOTN] [Accueil] [Services] [Tarifs] [Contact]    [Espace Client] [💬] [🔔] [👤 Photo]
```

**Header (Not Logged In):**
```
[ServiGOTN] [Accueil] [Services] [Tarifs] [Contact]    [FR ▼] [Connexion] [S'inscrire]
```
