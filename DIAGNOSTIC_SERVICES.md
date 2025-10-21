# 🔍 Diagnostic: Pourquoi les services ne s'affichent pas?

## Étapes de diagnostic

### 1. Vérifier les tables dans Supabase

Exécutez `CHECK_TABLES.sql` dans votre SQL Editor Supabase pour voir:
- Quelles tables existent
- Combien de services sont dans chaque table
- Où sont vos données

### 2. Ouvrir la Console du Navigateur

1. Ouvrez votre application dans le navigateur
2. Appuyez sur `F12` pour ouvrir les DevTools
3. Allez dans l'onglet **Console**
4. Naviguez vers `/services/onsite`
5. Regardez les messages:
   - 🔍 "Loading services from services_onsite table..."
   - ✅ "Services loaded: X services"
   - 📊 Les données chargées

### 3. Problèmes possibles et solutions

#### Problème A: Table `services_onsite` n'existe pas
**Symptôme:** Erreur "relation services_onsite does not exist"

**Solution:** Exécutez ce SQL:
```sql
-- Créer la table services_onsite
CREATE TABLE public.services_onsite (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  contact TEXT NOT NULL,
  image TEXT,
  views_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Problème B: Table `providers` n'existe pas
**Symptôme:** Erreur avec la relation "providers"

**Solution:** Exécutez `RUN_THIS_NOW.sql` pour créer la table providers

#### Problème C: Aucun service dans `services_onsite`
**Symptôme:** "0 service trouvé" mais pas d'erreur

**Solutions:**
1. Créez un service via `/services/post/onsite`
2. OU migrez vos services existants (voir ci-dessous)

#### Problème D: Services dans l'ancienne table `services`
**Symptôme:** Vous avez des services mais ils ne s'affichent pas

**Solution:** Migrez les données:
```sql
-- Migrer les services de 'services' vers 'services_onsite'
INSERT INTO public.services_onsite (
  provider_id,
  title,
  description,
  category,
  city,
  price,
  contact,
  image,
  views_count,
  is_active,
  created_at
)
SELECT 
  s.provider_id,
  s.title,
  s.description,
  s.category,
  s.city,
  s.price,
  COALESCE(s.contact_phone, s.contact_email, 'N/A'),
  s.image_url,
  s.views_count,
  s.is_active,
  s.created_at
FROM public.services s
WHERE s.is_active = true;
```

#### Problème E: RLS bloque l'accès
**Symptôme:** Erreur de permission ou aucune donnée

**Solution:** Exécutez `FIX_RLS_CORRECT.sql`

### 4. Test rapide

Exécutez dans Supabase SQL Editor:
```sql
-- Test 1: Vérifier la table existe
SELECT COUNT(*) as total FROM public.services_onsite;

-- Test 2: Vérifier les providers
SELECT COUNT(*) as total FROM public.providers;

-- Test 3: Voir les services avec providers
SELECT 
  s.id,
  s.title,
  s.city,
  s.price,
  p.full_name as provider_name
FROM public.services_onsite s
LEFT JOIN public.providers p ON p.id = s.provider_id
WHERE s.is_active = true
LIMIT 5;
```

### 5. Créer un service de test

Si vous n'avez aucun service, créez-en un manuellement:

```sql
-- D'abord, vérifiez votre provider_id
SELECT id, full_name FROM public.providers WHERE user_id = auth.uid();

-- Ensuite, créez un service de test (remplacez YOUR_PROVIDER_ID)
INSERT INTO public.services_onsite (
  provider_id,
  title,
  description,
  category,
  city,
  price,
  contact,
  is_active
) VALUES (
  'YOUR_PROVIDER_ID',
  'Service de test',
  'Ceci est un service de test pour vérifier l''affichage',
  'Plomberie',
  'Tunis',
  50.00,
  '+216 12 345 678',
  true
);
```

## Vérification finale

Après avoir appliqué les solutions:

1. ✅ Rafraîchissez la page `/services/onsite`
2. ✅ Vérifiez la console (F12) pour les messages
3. ✅ Les services devraient s'afficher avec les cartes de provider

## Besoin d'aide?

Si le problème persiste:
1. Copiez les messages d'erreur de la console
2. Exécutez `CHECK_TABLES.sql` et partagez les résultats
3. Vérifiez que vous êtes connecté en tant que provider
