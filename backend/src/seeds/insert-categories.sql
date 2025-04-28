INSERT INTO categories (id, name, description, code, "unitType", "parentId", "isActive", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Erziehungsberatung (§ 28 SGB VIII)', 'Erziehungsberatung und andere Beratungsdienste und -einrichtungen', '28', 'hours', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Soziale Gruppenarbeit (§ 29 SGB VIII)', 'Soziale Gruppenarbeit für ältere Kinder und Jugendliche', '29', 'hours', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Erziehungsbeistand (§ 30 SGB VIII)', 'Erziehungsbeistand, Betreuungshelfer', '30', 'hours', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Sozialpädagogische Familienhilfe (§ 31 SGB VIII)', 'Sozialpädagogische Familienhilfe', '31', 'hours', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Erziehung in Tagesgruppe (§ 32 SGB VIII)', 'Erziehung in einer Tagesgruppe', '32', 'places', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Vollzeitpflege (§ 33 SGB VIII)', 'Vollzeitpflege in einer anderen Familie', '33', 'places', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Heimerziehung (§ 34 SGB VIII)', 'Heimerziehung, sonstige betreute Wohnform', '34', 'places', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Intensive sozialpädagogische Einzelbetreuung (§ 35 SGB VIII)', 'Intensive sozialpädagogische Einzelbetreuung', '35', 'hours', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Eingliederungshilfe (§ 35a SGB VIII) - Ambulant', 'Ambulante Hilfen für seelisch behinderte Kinder und Jugendliche', '35a-ambulant', 'hours', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Eingliederungshilfe (§ 35a SGB VIII) - Teilstationär', 'Teilstationäre Hilfen für seelisch behinderte Kinder und Jugendliche', '35a-teilstationaer', 'places', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Eingliederungshilfe (§ 35a SGB VIII) - Stationär', 'Stationäre Hilfen für seelisch behinderte Kinder und Jugendliche', '35a-stationaer', 'places', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Hilfe für junge Volljährige (§ 41 SGB VIII) - Ambulant', 'Ambulante Hilfen für junge Volljährige', '41-ambulant', 'hours', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Hilfe für junge Volljährige (§ 41 SGB VIII) - Betreutes Wohnen', 'Betreutes Wohnen für junge Volljährige', '41-wohnen', 'places', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Hilfe für junge Volljährige (§ 41 SGB VIII) - Nachbetreuung', 'Nachbetreuung nach stationären Hilfen', '41-nachbetreuung', 'hours', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Inobhutnahme (§ 42 SGB VIII) - Kurzfristig', 'Kurzfristige Inobhutnahme in Krisensituationen', '42-kurzfristig', 'places', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Inobhutnahme (§ 42 SGB VIII) - Bereitschaftspflege', 'Bereitschaftspflege in Familien', '42-bereitschaft', 'places', NULL, true, NOW(), NOW()),
  (gen_random_uuid(), 'Inobhutnahme (§ 42 SGB VIII) - Clearing', 'Clearingstellen zur Abklärung des Hilfebedarfs', '42-clearing', 'places', NULL, true, NOW(), NOW());
