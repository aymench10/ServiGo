-- ============================================
-- CRÉER VOTRE PROFIL PROVIDER
-- Exécutez juste ce code dans Supabase
-- ============================================

-- Vérifier si la table existe
SELECT tablename FROM pg_tables WHERE tablename = 'providers';

-- Supprimer l'ancien profil s'il existe
DELETE FROM public.providers WHERE user_id IN (
    SELECT id FROM public.profiles WHERE role = 'provider'
);

-- Créer votre profil
INSERT INTO public.providers (user_id, full_name, email, phone, city, category, experience_years, bio, is_active)
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.phone,
    'Tunis',
    'Autre',
    0,
    'Services professionnels de qualité',
    true
FROM public.profiles p
WHERE p.role = 'provider'
ORDER BY p.created_at DESC
LIMIT 1;

-- Vérifier que c'est créé
SELECT 
    'PROFIL CRÉÉ ✅' as status,
    pr.*
FROM public.providers pr
JOIN public.profiles p ON p.id = pr.user_id
WHERE p.role = 'provider';
