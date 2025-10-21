# 🔍 Guide de Débogage - Upload d'Images

## Problème: Les images ne s'affichent pas dans les cartes

### ✅ Étapes de Débogage

#### 1. **Vérifier le Storage Supabase**
1. Allez sur Supabase Dashboard → **Storage**
2. Vérifiez que vous avez ces buckets:
   - ✅ `service-images` (Public)
   - ✅ `profiles` (Public)
3. Si les buckets n'existent pas → Exécutez `SIMPLE_STORAGE_FIX.sql`

#### 2. **Tester l'Upload**
1. Ouvrez la console du navigateur (F12)
2. Créez un nouveau service avec une image
3. Regardez les logs dans la console:

**Logs attendus:**
```
📤 Uploading image: photo.jpg
✅ Image uploaded successfully: {path: "..."}
🔗 Public URL: https://[project].supabase.co/storage/v1/object/public/service-images/[filename]
📝 Creating online service with data: {...}
  image: "https://..."
  hasImage: true
✅ Image URL will be saved: https://...
✅ Service created successfully: [{...}]
```

**Si vous voyez:**
- ❌ `Upload error` → Problème avec le bucket ou les permissions
- ⚠️ `No image URL` → L'image n'a pas été uploadée
- ❌ `Service creation error` → Problème avec la base de données

#### 3. **Vérifier la Base de Données**
1. Allez sur Supabase Dashboard → **Table Editor**
2. Ouvrez la table `services_online` ou `services_onsite`
3. Trouvez votre service
4. Vérifiez la colonne `image`:
   - ✅ Doit contenir une URL complète
   - ❌ Si `null` → L'image n'a pas été sauvegardée

#### 4. **Tester l'URL de l'Image**
1. Copiez l'URL de la colonne `image`
2. Collez-la dans un nouvel onglet du navigateur
3. L'image devrait s'afficher
   - ✅ Si l'image s'affiche → Le problème est dans le code d'affichage
   - ❌ Si erreur 404 → L'image n'existe pas dans le storage
   - ❌ Si erreur 403 → Problème de permissions (bucket pas public)

#### 5. **Vérifier l'Affichage dans la Card**
1. Ouvrez la console (F12)
2. Allez sur la page Services
3. Regardez les logs:
   - `✅ Loaded services: X (onsite: Y, online: Z)`
4. Inspectez un service card (clic droit → Inspecter)
5. Vérifiez l'élément `<img>`:
   - Doit avoir un attribut `src` avec l'URL
   - Si erreur de chargement → Vérifiez l'URL

---

## 🛠️ Solutions aux Problèmes Courants

### Problème 1: Bucket n'existe pas
**Erreur:** `Bucket not found`

**Solution:**
```sql
-- Exécutez SIMPLE_STORAGE_FIX.sql dans Supabase SQL Editor
```

### Problème 2: Bucket pas public
**Erreur:** `403 Forbidden` ou image ne charge pas

**Solution:**
```sql
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('service-images', 'profiles');
```

### Problème 3: Pas de permissions d'upload
**Erreur:** `new row violates row-level security policy`

**Solution:**
```sql
-- Exécutez SIMPLE_STORAGE_FIX.sql
-- Ou créez la policy manuellement:
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'service-images');
```

### Problème 4: Image uploadée mais pas sauvegardée en DB
**Symptôme:** Logs montrent upload réussi mais `image` est `null` en DB

**Vérification:**
1. Vérifiez que `imageUrl` n'est pas `null` avant l'insert
2. Vérifiez les logs: `✅ Image URL will be saved: ...`
3. Vérifiez que la colonne `image` existe dans la table

**Solution:**
```sql
-- Vérifier que la colonne existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('services_online', 'services_onsite')
AND column_name = 'image';

-- Si la colonne n'existe pas, l'ajouter:
ALTER TABLE services_online ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE services_onsite ADD COLUMN IF NOT EXISTS image TEXT;
```

### Problème 5: Image en DB mais ne s'affiche pas
**Symptôme:** URL existe en DB mais card montre l'icône par défaut

**Vérification:**
1. Ouvrez la console navigateur
2. Regardez les erreurs de chargement d'image
3. Vérifiez que `service.image` contient bien l'URL

**Solution:**
- Si l'URL est incorrecte → Vérifiez la fonction `uploadImage()`
- Si erreur CORS → Vérifiez que le bucket est public
- Si erreur 404 → L'image n'existe pas dans le storage

---

## 📋 Checklist Complète

Avant de créer un service avec image:

- [ ] Buckets `service-images` et `profiles` existent
- [ ] Les deux buckets sont **PUBLIC**
- [ ] Les policies de lecture sont créées
- [ ] Les policies d'upload sont créées
- [ ] La colonne `image` existe dans les tables
- [ ] Le code d'upload est correct
- [ ] Le code d'affichage est correct

---

## 🧪 Test Rapide

### Test 1: Vérifier le Storage
```sql
-- Exécutez dans Supabase SQL Editor
SELECT 
    id,
    name,
    public,
    CASE WHEN public THEN '✅' ELSE '❌' END as status
FROM storage.buckets
WHERE id IN ('service-images', 'profiles');
```

**Résultat attendu:**
```
service-images | service-images | true | ✅
profiles       | profiles       | true | ✅
```

### Test 2: Vérifier les Colonnes
```sql
SELECT 
    table_name,
    column_name,
    data_type,
    '✅' as exists
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name IN ('services_online', 'services_onsite')
AND column_name = 'image';
```

**Résultat attendu:**
```
services_online  | image | text | ✅
services_onsite  | image | text | ✅
```

### Test 3: Vérifier les Services avec Images
```sql
-- Services online avec images
SELECT 
    id,
    title,
    CASE 
        WHEN image IS NOT NULL THEN '✅ Has image'
        ELSE '❌ No image'
    END as image_status,
    LEFT(image, 50) as image_url_preview
FROM services_online
ORDER BY created_at DESC
LIMIT 5;

-- Services onsite avec images
SELECT 
    id,
    title,
    CASE 
        WHEN image IS NOT NULL THEN '✅ Has image'
        ELSE '❌ No image'
    END as image_status,
    LEFT(image, 50) as image_url_preview
FROM services_onsite
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🚀 Action Immédiate

**Si rien ne fonctionne, faites ceci dans l'ordre:**

1. **Exécutez `SIMPLE_STORAGE_FIX.sql`** dans Supabase SQL Editor
2. **Rechargez la page** de l'application (Ctrl+Shift+R)
3. **Ouvrez la console** (F12)
4. **Créez un nouveau service** avec une image
5. **Lisez tous les logs** dans la console
6. **Vérifiez la table** dans Supabase pour voir si l'image est sauvegardée
7. **Testez l'URL** de l'image dans un nouvel onglet

Si après tout ça, ça ne marche toujours pas, envoyez-moi:
- Les logs de la console
- Une capture d'écran de la table dans Supabase
- Le message d'erreur exact
