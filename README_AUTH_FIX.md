# 🔐 Guide de Correction d'Authentification

## 🚀 Exécution Rapide

Pour corriger **tous les problèmes d'authentification** en une seule commande :

```bash
npm run fix:auth
```

Cette commande exécute automatiquement :
1. ✅ Création/vérification des tables
2. ✅ Configuration du trigger automatique
3. ✅ Mise en place des politiques RLS
4. ✅ Synchronisation des profils existants
5. ✅ Vérification finale

---

## 📋 Commandes Disponibles

### **Corrections d'Authentification**

```bash
# Tout corriger en une fois
npm run fix:auth

# Ou étape par étape :
npm run sql FIX_AUTH_STEP1_TABLES.sql
npm run sql FIX_AUTH_STEP2_TRIGGER.sql
npm run sql FIX_AUTH_STEP3_RLS.sql
npm run sql FIX_AUTH_STEP4_SYNC_PROFILES.sql
```

### **Vérifications**

```bash
# Vérifier la configuration Supabase
npm run verify:supabase

# Vérifier la configuration auth
npm run sql VERIFY_AUTH_SETUP.sql

# Vérifier les utilisateurs
npm run sql CHECK_AUTH_USERS.sql
```

### **Exécution SQL**

```bash
# Exécuter n'importe quel fichier SQL
npm run sql <fichier.sql>

# Exemples :
npm run sql CHECK_USER_PROFILE.sql
npm run sql FIX_RLS_ALL_TABLES.sql
```

---

## 🎯 Problèmes Résolus

### ✅ **Tables Manquantes**
- Création automatique de toutes les tables nécessaires
- Structure complète pour profiles, providers, services, bookings, reviews

### ✅ **Profils Non Créés**
- Trigger automatique pour créer un profil à chaque inscription
- Synchronisation des profils pour les utilisateurs existants

### ✅ **Permissions RLS**
- Politiques granulaires par table et par action
- Sécurité renforcée avec Row Level Security
- Isolation des données par utilisateur

### ✅ **Relations Manquantes**
- Foreign keys correctement configurées
- Index pour optimiser les performances
- Cascade delete pour maintenir l'intégrité

---

## 📊 Structure de la Base de Données

```
auth.users (Supabase Auth)
    ↓
profiles (Profils utilisateurs)
    ↓
providers (Profils prestataires)
    ↓
├── services_onsite (Services sur place)
├── services_online (Services en ligne)
├── bookings (Réservations)
└── reviews (Avis)
```

---

## 🔒 Politiques de Sécurité (RLS)

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| **profiles** | Tous | Propriétaire | Propriétaire | - |
| **providers** | Tous | Authentifié | Propriétaire | - |
| **services_*** | Tous | Provider | Provider | Provider |
| **bookings** | Participants | Client | Participants | - |
| **reviews** | Tous | Authentifié | Auteur | Auteur |

---

## 🧪 Tests

### **1. Tester l'inscription**
```javascript
// Dans votre application
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'Test User',
      role: 'client',
      phone: '0123456789'
    }
  }
});
// Vérifier que le profil est créé automatiquement
```

### **2. Tester les permissions**
```javascript
// Essayer de modifier le profil d'un autre utilisateur
// Devrait échouer avec une erreur RLS
const { error } = await supabase
  .from('profiles')
  .update({ full_name: 'Hacker' })
  .eq('id', 'autre-user-id');
```

### **3. Tester les services**
```javascript
// En tant que provider, créer un service
const { data, error } = await supabase
  .from('services_onsite')
  .insert({
    provider_id: 'mon-provider-id',
    title: 'Mon Service',
    description: 'Description',
    category: 'plomberie',
    city: 'Paris',
    price: 50,
    contact: '0123456789'
  });
```

---

## 📚 Documentation

- **[AUTH_FIX_SUMMARY.md](./AUTH_FIX_SUMMARY.md)** - Résumé détaillé des corrections
- **[QUICK_SETUP.md](./QUICK_SETUP.md)** - Configuration rapide du CLI
- **[SQL_EXECUTION_GUIDE.md](./SQL_EXECUTION_GUIDE.md)** - Guide d'exécution SQL

---

## ⚠️ Important

- **Sauvegardez vos données** avant d'exécuter les corrections
- Les scripts utilisent `CREATE TABLE IF NOT EXISTS` pour éviter de supprimer les données
- Les politiques RLS sont recréées (anciennes supprimées)
- Le trigger est remplacé s'il existe déjà

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. Vérifiez la connexion : `npm run verify:supabase`
2. Consultez les logs d'erreur
3. Vérifiez que `SUPABASE_ACCESS_TOKEN` est configuré dans `.env`
4. Relancez les corrections : `npm run fix:auth`

---

## ✅ Checklist Post-Correction

- [ ] Toutes les tables sont créées
- [ ] RLS est activé sur toutes les tables
- [ ] Le trigger de création de profil fonctionne
- [ ] Les profils existants sont synchronisés
- [ ] Les tests d'inscription fonctionnent
- [ ] Les permissions RLS sont correctes
- [ ] L'application se connecte correctement

---

**🎉 Votre authentification Supabase est maintenant complètement configurée et sécurisée!**
