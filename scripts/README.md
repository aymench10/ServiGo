# 🔧 Scripts de Maintenance

## Fix Bookings - Corriger les provider_id

### 📋 Méthode 1 : Script Simple (Recommandé)

1. **Ouvrez** `scripts/fix-bookings-simple.js`

2. **Remplacez** les credentials Supabase (lignes 4-5) :
   ```javascript
   const SUPABASE_URL = 'https://votre-projet.supabase.co'
   const SUPABASE_ANON_KEY = 'votre-anon-key'
   ```

3. **Trouvez vos credentials** :
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet
   - Settings → API
   - Copiez "Project URL" et "anon public"

4. **Exécutez** :
   ```bash
   node scripts/fix-bookings-simple.js
   ```

---

### 📋 Méthode 2 : Avec fichier .env

1. **Créez** un fichier `.env` à la racine du projet :
   ```bash
   cp .env.example .env
   ```

2. **Éditez** `.env` avec vos vraies credentials :
   ```
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre-anon-key
   ```

3. **Exécutez** :
   ```bash
   npm run fix-bookings
   ```

---

### 📋 Méthode 3 : SQL Direct (Plus Rapide)

Si vous préférez exécuter le SQL directement dans Supabase :

1. **Ouvrez** Supabase SQL Editor
2. **Exécutez** `QUICK_FIX.sql`

---

## ✅ Vérification

Après avoir exécuté le script, vous devriez voir :

```
✅ Fix completed!
   Total bookings: 3
   Unique providers: 1
```

Puis rafraîchissez votre dashboard et les réservations devraient apparaître !

---

## 🐛 Problèmes Courants

### "Could not find Supabase credentials"
→ Vérifiez que vous avez bien remplacé les credentials dans le fichier

### "Foreign key constraint violation"
→ Exécutez d'abord `QUICK_FIX.sql` pour supprimer les contraintes

### "Service not found"
→ Certaines réservations pointent vers des services supprimés
