# 🚀 Configuration Rapide - Exécution SQL via CLI

## Étape 1: Obtenir votre Access Token

### Méthode A: Via le Dashboard (Recommandé)

1. **Allez sur:** https://supabase.com/dashboard/account/tokens
2. **Cliquez sur** "Generate New Token"
3. **Donnez un nom** (ex: "CLI Token")
4. **Copiez le token** généré

### Méthode B: Via CLI (Si la connexion fonctionne)

```bash
npx supabase login
# Suivez les instructions dans le terminal
```

## Étape 2: Ajouter le Token dans .env

Ouvrez votre fichier `.env` et ajoutez :

```env
SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note:** Gardez votre `.env` existant, ajoutez juste cette ligne!

## Étape 3: Tester l'exécution SQL

```bash
# Méthode 1: Node.js
npm run sql CHECK_USER_PROFILE.sql

# Méthode 2: PowerShell
npm run sql:ps CHECK_USER_PROFILE.sql

# Méthode 3: Direct
node run-sql.js CHECK_USER_PROFILE.sql
```

## ✅ Vérification

Si tout fonctionne, vous verrez :

```
📄 Executing SQL file: CHECK_USER_PROFILE.sql
🎯 Project: votre-projet
============================================

✅ SQL executed successfully!

📊 Query 1 Results:
------------------------------------------------------------
[Tableau avec vos résultats]
```

## ❌ Dépannage

### Erreur: "Access token not provided"
→ Ajoutez `SUPABASE_ACCESS_TOKEN` dans `.env`

### Erreur: "Project not found"
→ Vérifiez que `VITE_SUPABASE_URL` est correct dans `.env`

### Erreur: "Unauthorized"
→ Votre token a expiré, générez-en un nouveau

## 📝 Exemple de .env complet

```env
VITE_SUPABASE_URL=https://xxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

**Prêt à exécuter vos requêtes SQL directement depuis le terminal! 🎉**
