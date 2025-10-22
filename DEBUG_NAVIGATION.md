# 🔍 Debug Navigation Issues

## Problèmes Rapportés

1. ❌ **Impossible de voir les détails d'un service** - Bouton "View Details" ne fonctionne pas
2. ❌ **Impossible d'aller à l'espace provider** - Navigation vers dashboard ne fonctionne pas

---

## 🛠️ Corrections Appliquées

### 1. Ajout de Console.log pour Debug

#### Dans Header.jsx (ligne 94)
```javascript
onClick={() => console.log('Navigating to:', user?.role === 'client' ? '/client/dashboard' : '/provider/dashboard', 'User role:', user?.role)}
```

#### Dans Services.jsx (lignes 365-370)
```javascript
const handleView = () => {
  console.log('View Details clicked:', service.id, service.service_type)
  onView(service.id)
  const path = `/service/${service.service_type}/${service.id}`
  console.log('Navigating to:', path)
  navigate(path)
}
```

---

## 🧪 Tests à Effectuer

### Test 1 : Navigation vers Dashboard Provider

1. **Ouvrir la console du navigateur** (F12)
2. **Se connecter en tant que provider**
3. **Cliquer sur l'avatar/profil** dans le header
4. **Vérifier dans la console** :
   ```
   Navigating to: /provider/dashboard
   User role: provider
   ```
5. **Vérifier** : La page change-t-elle vers le dashboard ?

**Si ça ne fonctionne pas** :
- Vérifiez que `user.role` est bien "provider"
- Vérifiez qu'il n'y a pas d'erreur dans la console
- Vérifiez que la route `/provider/dashboard` existe

### Test 2 : Bouton "View Details"

1. **Aller sur `/services`**
2. **Ouvrir la console** (F12)
3. **Cliquer sur "View Details"** d'un service
4. **Vérifier dans la console** :
   ```
   View Details clicked: <service-id> <service-type>
   Navigating to: /service/<type>/<id>
   ```
5. **Vérifier** : La page change-t-elle vers les détails ?

**Si ça ne fonctionne pas** :
- Vérifiez que `service.id` et `service.service_type` existent
- Vérifiez qu'il n'y a pas d'erreur dans la console
- Vérifiez que la route `/service/:serviceType/:serviceId` existe

---

## 🔍 Vérifications Supplémentaires

### Vérifier le rôle de l'utilisateur

Dans la console du navigateur, tapez :
```javascript
// Vérifier l'utilisateur actuel
console.log(JSON.parse(localStorage.getItem('user')))
```

Vous devriez voir :
```json
{
  "id": "...",
  "email": "...",
  "role": "provider" // ou "client"
}
```

### Vérifier les routes

Les routes suivantes doivent exister dans `App.jsx` :
- ✅ `/provider/dashboard` → ProviderDashboard
- ✅ `/client/dashboard` → ClientDashboard
- ✅ `/service/:serviceType/:serviceId` → ServiceDetails

---

## 🐛 Problèmes Possibles

### Problème 1 : user.role est undefined

**Symptôme** : Console affiche `User role: undefined`

**Solution** :
1. Vérifier AuthContext
2. Vérifier que le rôle est bien stocké lors de la connexion
3. Vérifier la structure de l'objet user

### Problème 2 : Navigation ne se déclenche pas

**Symptôme** : Console.log s'affiche mais la page ne change pas

**Solution** :
1. Vérifier qu'il n'y a pas d'erreur dans la console
2. Vérifier que react-router-dom est bien configuré
3. Vérifier que les routes existent dans App.jsx

### Problème 3 : service.service_type est undefined

**Symptôme** : Path devient `/service/undefined/...`

**Solution** :
1. Vérifier la structure des données dans Supabase
2. Vérifier que le champ `service_type` existe dans la table
3. Vérifier la requête SQL qui récupère les services

---

## 📊 Commandes de Debug

### Dans la console du navigateur :

```javascript
// 1. Vérifier l'utilisateur
console.log('User:', JSON.parse(localStorage.getItem('user')))

// 2. Vérifier un service
// (Cliquez d'abord sur un service pour voir ses données)

// 3. Vérifier les routes
console.log('Current path:', window.location.pathname)

// 4. Forcer une navigation
window.location.href = '/provider/dashboard'
```

---

## ✅ Checklist de Résolution

- [ ] Console.log s'affiche quand je clique sur "View Details"
- [ ] Console.log s'affiche quand je clique sur le profil
- [ ] `user.role` affiche "provider" ou "client"
- [ ] `service.service_type` affiche "onsite" ou "online"
- [ ] Pas d'erreur dans la console
- [ ] Les routes existent dans App.jsx
- [ ] La navigation fonctionne

---

## 🚀 Prochaines Étapes

1. **Lancez le serveur** : `npm run dev`
2. **Ouvrez la console** : F12
3. **Testez les deux problèmes**
4. **Copiez les messages de la console** ici
5. **Je pourrai vous aider à résoudre** en fonction des logs

---

**Status** : 🔍 En cours de debug
**Date** : October 22, 2025
