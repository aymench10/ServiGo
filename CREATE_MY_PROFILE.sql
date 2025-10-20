-- RUN THIS IN SUPABASE TO CREATE YOUR PROVIDER PROFILE MANUALLY
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users table

-- First, let's see your user ID
SELECT id, email, raw_user_meta_data FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- After you see your ID, run this (replace the UUID):
-- INSERT INTO public.provider_profiles (user_id, business_name, service_category, location, description)
-- VALUES (
--   'YOUR_USER_ID_HERE',  -- Replace with your actual user ID
--   'Mon Entreprise',
--   'Autre',
--   'Tunis',
--   'Services professionnels'
-- );

-- Or use this to create profile for the LATEST user:
INSERT INTO public.provider_profiles (user_id, business_name, service_category, location, description)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', 'Mon Entreprise'),
  'Autre',
  'Tunis',
  'Services professionnels'
FROM auth.users 
WHERE email = 'aymenchebili0122@gmail.com'  -- Replace with YOUR email
AND NOT EXISTS (
  SELECT 1 FROM public.provider_profiles WHERE user_id = auth.users.id
);
