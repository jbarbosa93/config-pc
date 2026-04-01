-- ============================================
-- ConfigPC.ch — Seed 50+ composants populaires
-- Prix réalistes marché Suisse/France Q1 2025
-- ============================================

-- ══════════════════════════════════════
-- CPUs
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, chipset, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES
('CPU', 'AMD Ryzen 5 7600', 'AMD', 220, 189, 'AM5', 'B650/X670', 65, 95, 2022,
 '{"Cores/Threads": "6/12", "Fréquence boost": "5.1 GHz", "TDP": "65W", "Socket": "AM5", "Cache L3": "32 MB", "Gravure": "5nm Zen 4"}',
 'Le Ryzen 5 7600 offre un excellent rapport qualité/prix pour le gaming 1080p et la bureautique. Architecture Zen 4, support DDR5 et PCIe 5.0.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600.html'),

('CPU', 'AMD Ryzen 5 7600X', 'AMD', 249, 215, 'AM5', 'B650/X670', 105, 90, 2022,
 '{"Cores/Threads": "6/12", "Fréquence boost": "5.3 GHz", "TDP": "105W", "Socket": "AM5", "Cache L3": "32 MB", "Gravure": "5nm Zen 4"}',
 'Version X du 7600 avec des fréquences plus élevées. Idéal pour le gaming sans compromis en 1080p/1440p.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600x.html'),

('CPU', 'AMD Ryzen 7 7700X', 'AMD', 339, 295, 'AM5', 'B650/X670', 105, 85, 2022,
 '{"Cores/Threads": "8/16", "Fréquence boost": "5.4 GHz", "TDP": "105W", "Socket": "AM5", "Cache L3": "32 MB", "Gravure": "5nm Zen 4"}',
 'Processeur 8 cœurs polyvalent, excellent pour le gaming 1440p et le streaming simultané.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7700x.html'),

('CPU', 'AMD Ryzen 7 7800X3D', 'AMD', 429, 379, 'AM5', 'B650/X670', 120, 98, 2023,
 '{"Cores/Threads": "8/16", "Fréquence boost": "5.0 GHz", "TDP": "120W", "Socket": "AM5", "Cache L3": "96 MB (3D V-Cache)", "Gravure": "5nm Zen 4"}',
 'Le meilleur CPU gaming grâce au 3D V-Cache de 96 MB. Performances inégalées dans les jeux AAA.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html'),

('CPU', 'AMD Ryzen 9 7900X', 'AMD', 469, 399, 'AM5', 'X670/X670E', 170, 75, 2022,
 '{"Cores/Threads": "12/24", "Fréquence boost": "5.6 GHz", "TDP": "170W", "Socket": "AM5", "Cache L3": "64 MB", "Gravure": "5nm Zen 4"}',
 'Processeur 12 cœurs haut de gamme pour la création de contenu, montage vidéo et multitâche intensif.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7900x.html'),

('CPU', 'Intel Core i5-14600K', 'Intel', 299, 259, 'LGA1700', 'Z790/B760', 125, 88, 2023,
 '{"Cores/Threads": "14 (6P+8E)/20", "Fréquence boost": "5.3 GHz", "TDP": "125W", "Socket": "LGA1700", "Cache L3": "24 MB", "Gravure": "Intel 7"}',
 'Processeur Intel milieu de gamme avec excellentes performances gaming et productivité. Débloqué pour overclocking.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i5.html'),

('CPU', 'Intel Core i7-14700K', 'Intel', 419, 369, 'LGA1700', 'Z790', 125, 82, 2023,
 '{"Cores/Threads": "20 (8P+12E)/28", "Fréquence boost": "5.6 GHz", "TDP": "125W", "Socket": "LGA1700", "Cache L3": "33 MB", "Gravure": "Intel 7"}',
 'Processeur haut de gamme Intel avec 20 cœurs. Excellent pour le gaming 4K et la création de contenu.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i7.html'),

('CPU', 'AMD Ryzen 5 5600', 'AMD', 139, 109, 'AM4', 'B550/X570', 65, 70, 2022,
 '{"Cores/Threads": "6/12", "Fréquence boost": "4.4 GHz", "TDP": "65W", "Socket": "AM4", "Cache L3": "32 MB", "Gravure": "7nm Zen 3"}',
 'Excellent choix budget sur plateforme AM4 mature. Parfait pour un PC gaming entrée de gamme.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600.html')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- GPUs
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES
('GPU', 'NVIDIA GeForce RTX 4060', 'NVIDIA', 329, 289, NULL, 115, 92, 2023,
 '{"VRAM": "8 GB GDDR6", "Architecture": "Ada Lovelace", "TDP": "115W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 1.4a", "Bus": "128-bit"}',
 'Carte graphique milieu de gamme idéale pour le gaming 1080p avec ray tracing et DLSS 3.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/40-series/rtx-4060/'),

('GPU', 'NVIDIA GeForce RTX 4060 Ti', 'NVIDIA', 439, 389, NULL, 160, 88, 2023,
 '{"VRAM": "8 GB GDDR6", "Architecture": "Ada Lovelace", "TDP": "160W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 1.4a", "Bus": "128-bit"}',
 'Performances solides en 1080p et 1440p avec DLSS 3. Un cran au-dessus de la RTX 4060.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/40-series/rtx-4060-ti/'),

('GPU', 'NVIDIA GeForce RTX 4070', 'NVIDIA', 579, 519, NULL, 200, 85, 2023,
 '{"VRAM": "12 GB GDDR6X", "Architecture": "Ada Lovelace", "TDP": "200W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 1.4a", "Bus": "192-bit"}',
 'Excellente carte pour le gaming 1440p avec ray tracing. DLSS 3 et frame generation.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/40-series/rtx-4070/'),

('GPU', 'NVIDIA GeForce RTX 4070 Super', 'NVIDIA', 629, 569, NULL, 220, 90, 2024,
 '{"VRAM": "12 GB GDDR6X", "Architecture": "Ada Lovelace", "TDP": "220W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 1.4a", "Bus": "192-bit"}',
 'Version Super avec plus de cœurs CUDA. Le meilleur choix pour le 1440p sans compromis.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/40-series/rtx-4070-super/'),

('GPU', 'NVIDIA GeForce RTX 4070 Ti Super', 'NVIDIA', 829, 749, NULL, 285, 80, 2024,
 '{"VRAM": "16 GB GDDR6X", "Architecture": "Ada Lovelace", "TDP": "285W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 1.4a", "Bus": "256-bit"}',
 'Carte haut de gamme pour le gaming 4K. 16 GB de VRAM pour les jeux les plus exigeants.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/40-series/rtx-4070-ti-super/'),

('GPU', 'NVIDIA GeForce RTX 4080 Super', 'NVIDIA', 1049, 959, NULL, 320, 70, 2024,
 '{"VRAM": "16 GB GDDR6X", "Architecture": "Ada Lovelace", "TDP": "320W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 1.4a", "Bus": "256-bit"}',
 'Performances exceptionnelles en 4K avec ray tracing. Pour les joueurs qui veulent le meilleur.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/40-series/rtx-4080-super/'),

('GPU', 'AMD Radeon RX 7600', 'AMD', 279, 249, NULL, 165, 82, 2023,
 '{"VRAM": "8 GB GDDR6", "Architecture": "RDNA 3", "TDP": "165W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 2.1", "Bus": "128-bit"}',
 'Alternative AMD abordable pour le gaming 1080p. Excellent rapport qualité/prix.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-7600.html'),

('GPU', 'AMD Radeon RX 7800 XT', 'AMD', 519, 459, NULL, 263, 78, 2023,
 '{"VRAM": "16 GB GDDR6", "Architecture": "RDNA 3", "TDP": "263W", "Sorties vidéo": "1x HDMI 2.1, 2x DP 2.1", "Bus": "256-bit"}',
 'Carte AMD haut de gamme avec 16 GB. Excellente pour le 1440p et le contenu créatif.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-7800-xt.html')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- RAM
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES
('RAM', 'Corsair Vengeance DDR5-5600 32 GB (2x16)', 'Corsair', 109, 89, 'DDR5', NULL, 92, 2023,
 '{"Type": "DDR5", "Fréquence": "5600 MHz", "Latence CL": "CL36", "Capacité": "32 GB (2x16 GB)", "Tension": "1.25V"}',
 'Kit DDR5 fiable et performant. 32 GB suffisent pour le gaming et la productivité.',
 'https://www.corsair.com/fr/fr/'),

('RAM', 'Corsair Vengeance DDR5-6000 32 GB (2x16)', 'Corsair', 139, 115, 'DDR5', NULL, 85, 2023,
 '{"Type": "DDR5", "Fréquence": "6000 MHz", "Latence CL": "CL30", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V"}',
 'Kit DDR5 haute fréquence optimisé pour les Ryzen 7000 (sweet spot EXPO).',
 'https://www.corsair.com/fr/fr/'),

('RAM', 'G.Skill Trident Z5 DDR5-6000 32 GB (2x16)', 'G.Skill', 149, 125, 'DDR5', NULL, 88, 2023,
 '{"Type": "DDR5", "Fréquence": "6000 MHz", "Latence CL": "CL30", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V"}',
 'Kit premium G.Skill avec profils EXPO/XMP. Dissipateur thermique élégant.',
 'https://www.gskill.com/'),

('RAM', 'Kingston Fury Beast DDR5-5600 32 GB (2x16)', 'Kingston', 99, 82, 'DDR5', NULL, 80, 2023,
 '{"Type": "DDR5", "Fréquence": "5600 MHz", "Latence CL": "CL36", "Capacité": "32 GB (2x16 GB)", "Tension": "1.25V"}',
 'Kit DDR5 entrée de gamme au meilleur prix. Fiable et compatible avec toutes les plateformes DDR5.',
 'https://www.kingston.com/fr/'),

('RAM', 'Corsair Vengeance LPX DDR4-3200 16 GB (2x8)', 'Corsair', 49, 39, 'DDR4', NULL, 75, 2021,
 '{"Type": "DDR4", "Fréquence": "3200 MHz", "Latence CL": "CL16", "Capacité": "16 GB (2x8 GB)", "Tension": "1.35V"}',
 'Kit DDR4 classique et éprouvé pour les plateformes AM4 et LGA1700 budget.',
 'https://www.corsair.com/fr/fr/')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Stockage (SSD)
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES
('Stockage', 'Samsung 990 Pro 1 To', 'Samsung', 119, 99, NULL, 95, 2022,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7450 Mo/s", "Écriture séq.": "6900 Mo/s", "Format": "M.2 2280"}',
 'SSD NVMe ultra-rapide de Samsung. Performances de pointe pour le gaming et la création.',
 'https://www.samsung.com/fr/memory-storage/nvme-ssd/990-pro-pcie-4-0-nvme-m-2-ssd-1tb-mz-v9p1t0bw/'),

('Stockage', 'Samsung 990 Pro 2 To', 'Samsung', 189, 159, NULL, 85, 2022,
 '{"Capacité": "2 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7450 Mo/s", "Écriture séq.": "6900 Mo/s", "Format": "M.2 2280"}',
 'Version 2 To du 990 Pro pour ceux qui ont besoin de beaucoup de stockage rapide.',
 'https://www.samsung.com/fr/memory-storage/nvme-ssd/'),

('Stockage', 'WD Black SN770 1 To', 'Western Digital', 79, 65, NULL, 88, 2022,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "5150 Mo/s", "Écriture séq.": "4900 Mo/s", "Format": "M.2 2280"}',
 'Excellent rapport qualité/prix en PCIe 4.0. Performances solides pour le gaming.',
 'https://www.westerndigital.com/fr-fr/products/internal-drives/wd-black-sn770-nvme-ssd'),

('Stockage', 'Kingston NV2 1 To', 'Kingston', 59, 49, NULL, 80, 2023,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "3500 Mo/s", "Écriture séq.": "2100 Mo/s", "Format": "M.2 2280"}',
 'SSD NVMe budget. Suffisant pour le gaming et bien plus rapide qu un SATA.',
 'https://www.kingston.com/fr/'),

('Stockage', 'Crucial P3 Plus 1 To', 'Crucial', 69, 55, NULL, 78, 2023,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "5000 Mo/s", "Écriture séq.": "4200 Mo/s", "Format": "M.2 2280"}',
 'SSD Crucial abordable avec de bonnes performances séquentielles.',
 'https://www.crucial.fr/')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Cartes mères
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, chipset, form_factor, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES
('Carte mère', 'MSI MAG B650 TOMAHAWK WIFI', 'MSI', 229, 199, 'AM5', 'B650', 'ATX', NULL, 90, 2022,
 '{"Socket": "AM5", "Chipset": "B650", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "2", "WiFi": "WiFi 6E"}',
 'Carte mère AM5 complète avec WiFi 6E, USB-C et bonne alimentation CPU. Le choix sûr pour Ryzen 7000.',
 'https://fr.msi.com/'),

('Carte mère', 'Gigabyte B650 AORUS ELITE AX', 'Gigabyte', 219, 189, 'AM5', 'B650', 'ATX', NULL, 85, 2022,
 '{"Socket": "AM5", "Chipset": "B650", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "2", "WiFi": "WiFi 6E"}',
 'Alternative Gigabyte solide pour AM5 avec WiFi et bon rapport qualité/prix.',
 'https://www.gigabyte.com/fr/'),

('Carte mère', 'ASUS TUF GAMING B650-PLUS WIFI', 'ASUS', 219, 189, 'AM5', 'B650', 'ATX', NULL, 82, 2022,
 '{"Socket": "AM5", "Chipset": "B650", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "2", "WiFi": "WiFi 6"}',
 'Carte mère robuste ASUS TUF avec bonne durabilité et WiFi intégré.',
 'https://www.asus.com/fr/'),

('Carte mère', 'MSI PRO B760-P WIFI DDR5', 'MSI', 169, 145, 'LGA1700', 'B760', 'ATX', NULL, 80, 2023,
 '{"Socket": "LGA1700", "Chipset": "B760", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "2", "WiFi": "WiFi 6E"}',
 'Carte mère Intel B760 abordable avec DDR5 et WiFi. Idéale pour les Core i5/i7.',
 'https://fr.msi.com/'),

('Carte mère', 'MSI MAG B550 TOMAHAWK', 'MSI', 139, 119, 'AM4', 'B550', 'ATX', NULL, 72, 2020,
 '{"Socket": "AM4", "Chipset": "B550", "Format": "ATX", "RAM max": "128 GB DDR4", "Slots M.2": "2", "WiFi": "Non"}',
 'Carte mère AM4 éprouvée pour Ryzen 5000. Excellent choix budget.',
 'https://fr.msi.com/')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Alimentations
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES
('Alimentation', 'Corsair RM750e', 'Corsair', 99, 85, 750, 90, 2023,
 '{"Puissance": "750W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX", "Ventilateur": "120mm"}',
 'Alimentation modulaire 750W 80+ Gold. Silencieuse et fiable, suffisante pour la majorité des configs.',
 'https://www.corsair.com/fr/fr/'),

('Alimentation', 'Corsair RM850x', 'Corsair', 139, 119, 850, 85, 2023,
 '{"Puissance": "850W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX", "Ventilateur": "135mm"}',
 'Alimentation haut de gamme 850W pour configs avec GPU énergivore. Mode fanless à faible charge.',
 'https://www.corsair.com/fr/fr/'),

('Alimentation', 'be quiet! Pure Power 12 M 750W', 'be quiet!', 109, 95, 750, 82, 2023,
 '{"Puissance": "750W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX 3.0", "Connecteur": "12VHPWR"}',
 'Alimentation ATX 3.0 avec connecteur 12VHPWR natif. Prête pour les RTX 4000.',
 'https://www.bequiet.com/fr/'),

('Alimentation', 'Seasonic Focus GX-650', 'Seasonic', 89, 75, 650, 78, 2022,
 '{"Puissance": "650W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX", "Ventilateur": "120mm"}',
 'Alimentation compacte et fiable pour les configs gaming entrée/milieu de gamme.',
 'https://seasonic.com/')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Boîtiers
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, form_factor, popularity_score, release_year, specs, description, manufacturer_url) VALUES
('Boîtier', 'Fractal Design North', 'Fractal Design', 139, 119, 'ATX', 92, 2023,
 '{"Format": "ATX Mid-Tower", "Emplacements ventilateurs": "6", "Fenêtre latérale": "Verre trempé", "GPU max": "355 mm", "Ventirad max": "170 mm"}',
 'Boîtier au design bois/mesh unique. Excellent airflow et finition premium.',
 'https://www.fractal-design.com/fr/'),

('Boîtier', 'NZXT H5 Flow', 'NZXT', 109, 94, 'ATX', 88, 2023,
 '{"Format": "ATX Mid-Tower", "Emplacements ventilateurs": "6", "Fenêtre latérale": "Verre trempé", "GPU max": "365 mm", "Ventirad max": "165 mm"}',
 'Boîtier minimaliste avec façade mesh perforée pour un excellent flux d air.',
 'https://nzxt.com/'),

('Boîtier', 'Corsair 4000D Airflow', 'Corsair', 99, 85, 'ATX', 90, 2021,
 '{"Format": "ATX Mid-Tower", "Emplacements ventilateurs": "6", "Fenêtre latérale": "Verre trempé", "GPU max": "360 mm", "Ventirad max": "170 mm"}',
 'Best-seller absolu. Airflow excellent, cable management facile, prix imbattable.',
 'https://www.corsair.com/fr/fr/'),

('Boîtier', 'Lian Li LANCOOL II Mesh', 'Lian Li', 109, 95, 'ATX', 82, 2021,
 '{"Format": "ATX Mid-Tower", "Emplacements ventilateurs": "7", "Fenêtre latérale": "Verre trempé", "GPU max": "384 mm", "Ventirad max": "176 mm"}',
 'Boîtier spacieux avec excellente ventilation et finition Lian Li premium.',
 'https://www.lian-li.com/fr/')
ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Refroidissement
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES
('Refroidissement', 'Noctua NH-D15', 'Noctua', 99, 89, 'AM4/AM5/LGA1700', 250, 92, 2014,
 '{"Type": "Ventirad double tour", "TDP supporté": "250W", "Niveau sonore": "24.6 dBA", "Ventilateurs": "2x NF-A15 140mm", "Hauteur": "165 mm"}',
 'Le roi des ventirads. Performances proches du watercooling avec un silence exemplaire.',
 'https://noctua.at/fr/'),

('Refroidissement', 'be quiet! Dark Rock Pro 5', 'be quiet!', 89, 79, 'AM4/AM5/LGA1700', 270, 88, 2023,
 '{"Type": "Ventirad double tour", "TDP supporté": "270W", "Niveau sonore": "24.3 dBA", "Ventilateurs": "1x 135mm + 1x 120mm", "Hauteur": "168 mm"}',
 'Ventirad premium silencieux. Alternative au Noctua avec un look plus discret.',
 'https://www.bequiet.com/fr/'),

('Refroidissement', 'Arctic Freezer 36', 'Arctic', 35, 29, 'AM4/AM5/LGA1700', 200, 85, 2024,
 '{"Type": "Ventirad tour", "TDP supporté": "200W", "Niveau sonore": "22.5 dBA", "Ventilateurs": "1x P12 120mm", "Hauteur": "159 mm"}',
 'Ventirad budget avec performances surprenantes. Le meilleur rapport qualité/prix en refroidissement.',
 'https://www.arctic.de/fr/'),

('Refroidissement', 'Deepcool AK400', 'Deepcool', 29, 25, 'AM4/AM5/LGA1700', 180, 80, 2022,
 '{"Type": "Ventirad tour", "TDP supporté": "180W", "Niveau sonore": "25 dBA", "Ventilateurs": "1x 120mm", "Hauteur": "155 mm"}',
 'Ventirad ultra-abordable et efficace. Parfait pour les Ryzen 5 et Core i5.',
 'https://www.deepcool.com/fr/'),

('Refroidissement', 'Corsair iCUE H100i RGB', 'Corsair', 139, 119, 'AM4/AM5/LGA1700', 300, 78, 2023,
 '{"Type": "AIO 240mm", "TDP supporté": "300W+", "Niveau sonore": "30 dBA", "Ventilateurs": "2x 120mm RGB", "Radiateur": "240mm"}',
 'Watercooling AIO 240mm avec éclairage RGB. Pour les configs gaming qui veulent du style.',
 'https://www.corsair.com/fr/fr/')
ON CONFLICT (name) DO NOTHING;
