-- Heimerziehung (§ 34 SGB VIII)
INSERT INTO availabilities (id, "facilityId", "categoryId", "availablePlaces", "totalPlaces", "genderSuitability", "minAge", "maxAge", notes, "lastUpdated", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  'bdb404fc-f496-4294-9b8b-24d6ecf87681',
  id,
  5,
  24,
  'all',
  6,
  18,
  'Freie Plätze ab sofort verfügbar',
  NOW(),
  NOW(),
  NOW()
FROM categories WHERE code = '34';

-- Erziehung in Tagesgruppe (§ 32 SGB VIII)
INSERT INTO availabilities (id, "facilityId", "categoryId", "availablePlaces", "totalPlaces", "genderSuitability", "minAge", "maxAge", notes, "lastUpdated", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '1e4acae2-13f8-4dc1-9309-8cf09efdbbb2',
  id,
  3,
  15,
  'all',
  6,
  14,
  'Freie Plätze ab sofort verfügbar',
  NOW(),
  NOW(),
  NOW()
FROM categories WHERE code = '32';

-- Sozialpädagogische Familienhilfe (§ 31 SGB VIII)
INSERT INTO availabilities (id, "facilityId", "categoryId", "availablePlaces", "totalPlaces", "genderSuitability", "minAge", "maxAge", notes, "lastUpdated", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '5d29b112-4448-4a40-8b4d-c3ea0f5ab607',
  id,
  10,
  30,
  'all',
  0,
  18,
  'Freie Kapazitäten für neue Familien',
  NOW(),
  NOW(),
  NOW()
FROM categories WHERE code = '31';

-- Erziehungsbeistand (§ 30 SGB VIII)
INSERT INTO availabilities (id, "facilityId", "categoryId", "availablePlaces", "totalPlaces", "genderSuitability", "minAge", "maxAge", notes, "lastUpdated", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '5d29b112-4448-4a40-8b4d-c3ea0f5ab607',
  id,
  8,
  20,
  'all',
  6,
  18,
  'Freie Kapazitäten für neue Klienten',
  NOW(),
  NOW(),
  NOW()
FROM categories WHERE code = '30';

-- Eingliederungshilfe (§ 35a SGB VIII) - Stationär
INSERT INTO availabilities (id, "facilityId", "categoryId", "availablePlaces", "totalPlaces", "genderSuitability", "minAge", "maxAge", notes, "lastUpdated", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '9c5ddf41-e659-486f-ab5a-5ae97b078597',
  id,
  2,
  8,
  'all',
  6,
  18,
  'Spezialisierte Plätze für Kinder mit seelischen Behinderungen',
  NOW(),
  NOW(),
  NOW()
FROM categories WHERE code = '35a-stationaer';

-- Inobhutnahme (§ 42 SGB VIII) - Clearing
INSERT INTO availabilities (id, "facilityId", "categoryId", "availablePlaces", "totalPlaces", "genderSuitability", "minAge", "maxAge", notes, "lastUpdated", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '09bde458-bb7c-4dba-ba2d-838d443d2847',
  id,
  3,
  8,
  'all',
  0,
  18,
  'Notfallplätze verfügbar',
  NOW(),
  NOW(),
  NOW()
FROM categories WHERE code = '42-clearing';

-- Hilfe für junge Volljährige (§ 41 SGB VIII) - Betreutes Wohnen
INSERT INTO availabilities (id, "facilityId", "categoryId", "availablePlaces", "totalPlaces", "genderSuitability", "minAge", "maxAge", notes, "lastUpdated", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '8c8a0cf6-79c8-4529-8e53-092f0452deda',
  id,
  4,
  12,
  'all',
  16,
  21,
  'Plätze für junge Erwachsene',
  NOW(),
  NOW(),
  NOW()
FROM categories WHERE code = '41-wohnen';

-- Vollzeitpflege (§ 33 SGB VIII)
INSERT INTO availabilities (id, "facilityId", "categoryId", "availablePlaces", "totalPlaces", "genderSuitability", "minAge", "maxAge", notes, "lastUpdated", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid(),
  '62aa173c-0872-4eb8-9e26-9cae4692b654',
  id,
  2,
  10,
  'all',
  0,
  12,
  'Pflegefamilien für jüngere Kinder',
  NOW(),
  NOW(),
  NOW()
FROM categories WHERE code = '33';
