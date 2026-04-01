-- ============================================
-- ConfigPC.ch — Seed ~160 composants supplémentaires
-- Total cible : ~200 composants en base
-- Prix réalistes marché Suisse/France Q1 2025
-- ============================================

-- ══════════════════════════════════════
-- CPUs (22 nouveaux)
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, chipset, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES

('CPU', 'AMD Ryzen 5 9600X', 'AMD', 289, 249, 'AM5', 'B650/X670', 65, 88, 2024,
 '{"Cores/Threads": "6/12", "Fréquence boost": "5.4 GHz", "TDP": "65W", "Socket": "AM5", "Cache L3": "32 MB", "Gravure": "4nm Zen 5"}',
 'Processeur Zen 5 6 cœurs avec IPC amélioré par rapport au Zen 4. Faible consommation et excellentes performances gaming 1080p.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/9000-series/amd-ryzen-5-9600x.html'),

('CPU', 'AMD Ryzen 7 9700X', 'AMD', 389, 339, 'AM5', 'B650/X670', 65, 85, 2024,
 '{"Cores/Threads": "8/16", "Fréquence boost": "5.5 GHz", "TDP": "65W", "Socket": "AM5", "Cache L3": "32 MB", "Gravure": "4nm Zen 5"}',
 'Ryzen 7 de nouvelle génération Zen 5, 65W seulement pour des performances haut de gamme. Idéal pour le gaming 1440p et le streaming.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html'),

('CPU', 'AMD Ryzen 9 9900X', 'AMD', 519, 449, 'AM5', 'X670/X670E', 120, 78, 2024,
 '{"Cores/Threads": "12/24", "Fréquence boost": "5.6 GHz", "TDP": "120W", "Socket": "AM5", "Cache L3": "64 MB", "Gravure": "4nm Zen 5"}',
 'Processeur 12 cœurs Zen 5 pour la création de contenu et la productivité. Excellent dans les charges multithreadées.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9900x.html'),

('CPU', 'AMD Ryzen 9 9950X', 'AMD', 699, 609, 'AM5', 'X670E', 170, 72, 2024,
 '{"Cores/Threads": "16/32", "Fréquence boost": "5.7 GHz", "TDP": "170W", "Socket": "AM5", "Cache L3": "64 MB", "Gravure": "4nm Zen 5"}',
 'Flagship AMD Zen 5 avec 16 cœurs. Le choix ultime pour la création de contenu, le rendu 3D et la workstation.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html'),

('CPU', 'AMD Ryzen 7 7700', 'AMD', 289, 249, 'AM5', 'B650/X670', 65, 80, 2022,
 '{"Cores/Threads": "8/16", "Fréquence boost": "5.3 GHz", "TDP": "65W", "Socket": "AM5", "Cache L3": "32 MB", "Gravure": "5nm Zen 4"}',
 'Version non-X du Ryzen 7 7700 avec TDP réduit à 65W. Excellent rapport performance/watt pour un système silencieux.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7700.html'),

('CPU', 'AMD Ryzen 9 7950X3D', 'AMD', 699, 609, 'AM5', 'X670E', 120, 82, 2023,
 '{"Cores/Threads": "16/32", "Fréquence boost": "5.7 GHz", "TDP": "120W", "Socket": "AM5", "Cache L3": "128 MB (3D V-Cache)", "Gravure": "5nm Zen 4"}',
 'Le processeur workstation ultime avec double CCD et 3D V-Cache. Performances gaming et création de contenu au sommet.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x3d.html'),

('CPU', 'AMD Ryzen 5 5600X', 'AMD', 169, 139, 'AM4', 'B550/X570', 65, 82, 2020,
 '{"Cores/Threads": "6/12", "Fréquence boost": "4.6 GHz", "TDP": "65W", "Socket": "AM4", "Cache L3": "32 MB", "Gravure": "7nm Zen 3"}',
 'Processeur Zen 3 6 cœurs très apprécié sur la plateforme AM4. Excellent pour le gaming 1080p/1440p.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html'),

('CPU', 'AMD Ryzen 7 5800X3D', 'AMD', 299, 259, 'AM4', 'B550/X570', 105, 90, 2022,
 '{"Cores/Threads": "8/16", "Fréquence boost": "4.5 GHz", "TDP": "105W", "Socket": "AM4", "Cache L3": "96 MB (3D V-Cache)", "Gravure": "7nm Zen 3"}',
 'Le meilleur CPU gaming sur plateforme AM4 grâce au 3D V-Cache. Surpasse des processeurs bien plus récents dans les jeux.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/5000-series/amd-ryzen-7-5800x3d.html'),

('CPU', 'AMD Ryzen 9 5900X', 'AMD', 319, 279, 'AM4', 'X570/B550', 105, 78, 2020,
 '{"Cores/Threads": "12/24", "Fréquence boost": "4.8 GHz", "TDP": "105W", "Socket": "AM4", "Cache L3": "64 MB", "Gravure": "7nm Zen 3"}',
 'Processeur 12 cœurs Zen 3 haut de gamme. Très populaire pour la création de contenu et le gaming sur AM4.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/5000-series/amd-ryzen-9-5900x.html'),

('CPU', 'Intel Core i5-13600K', 'Intel', 269, 229, 'LGA1700', 'Z790/B760', 125, 85, 2022,
 '{"Cores/Threads": "14 (6P+8E)/20", "Fréquence boost": "5.1 GHz", "TDP": "125W", "Socket": "LGA1700", "Cache L3": "24 MB", "Gravure": "Intel 7"}',
 'Processeur Intel 13e génération avec architecture hybride P+E cores. Excellent rapport qualité/prix pour le gaming et la productivité.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i5.html'),

('CPU', 'Intel Core i7-13700K', 'Intel', 389, 339, 'LGA1700', 'Z790', 125, 80, 2022,
 '{"Cores/Threads": "16 (8P+8E)/24", "Fréquence boost": "5.4 GHz", "TDP": "125W", "Socket": "LGA1700", "Cache L3": "30 MB", "Gravure": "Intel 7"}',
 'Processeur 16 cœurs 13e génération. Très polyvalent pour le gaming haut de gamme et la création de contenu.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i7.html'),

('CPU', 'Intel Core i9-13900K', 'Intel', 499, 439, 'LGA1700', 'Z790', 125, 75, 2022,
 '{"Cores/Threads": "24 (8P+16E)/32", "Fréquence boost": "5.8 GHz", "TDP": "125W", "Socket": "LGA1700", "Cache L3": "36 MB", "Gravure": "Intel 7"}',
 'Flagship Intel 13e génération avec 24 cœurs. Performances multithreadées exceptionnelles pour la workstation et le gaming.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i9.html'),

('CPU', 'Intel Core i5-12600K', 'Intel', 219, 185, 'LGA1700', 'Z690/B660', 125, 72, 2021,
 '{"Cores/Threads": "10 (6P+4E)/16", "Fréquence boost": "4.9 GHz", "TDP": "125W", "Socket": "LGA1700", "Cache L3": "20 MB", "Gravure": "Intel 7"}',
 'Introduction de l architecture hybride Intel. Encore compétitif pour le gaming et offre un bon rapport qualité/prix.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i5.html'),

('CPU', 'Intel Core i3-14100F', 'Intel', 109, 89, 'LGA1700', 'B760/H770', 58, 78, 2024,
 '{"Cores/Threads": "4/8", "Fréquence boost": "4.7 GHz", "TDP": "58W", "Socket": "LGA1700", "Cache L3": "12 MB", "Gravure": "Intel 7", "iGPU": "Non"}',
 'Processeur budget sans iGPU idéal pour une configuration gaming entrée de gamme avec GPU dédié. Faible consommation.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i3.html'),

('CPU', 'Intel Core i9-14900K', 'Intel', 549, 479, 'LGA1700', 'Z790', 125, 72, 2023,
 '{"Cores/Threads": "24 (8P+16E)/32", "Fréquence boost": "6.0 GHz", "TDP": "125W", "Socket": "LGA1700", "Cache L3": "36 MB", "Gravure": "Intel 7"}',
 'Le processeur Intel le plus puissant de la génération Raptor Lake Refresh. Fréquence boost record à 6.0 GHz.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i9.html'),

('CPU', 'Intel Core i5-14400F', 'Intel', 179, 149, 'LGA1700', 'B760/H770', 65, 82, 2024,
 '{"Cores/Threads": "10 (6P+4E)/16", "Fréquence boost": "4.7 GHz", "TDP": "65W", "Socket": "LGA1700", "Cache L3": "20 MB", "Gravure": "Intel 7", "iGPU": "Non"}',
 'Excellent processeur budget pour PC gaming. Sans iGPU mais idéal avec une carte graphique dédiée.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i5.html'),

('CPU', 'AMD Ryzen 5 7500F', 'AMD', 179, 149, 'AM5', 'B650', 65, 75, 2023,
 '{"Cores/Threads": "6/12", "Fréquence boost": "5.0 GHz", "TDP": "65W", "Socket": "AM5", "Cache L3": "32 MB", "Gravure": "5nm Zen 4", "iGPU": "Non"}',
 'Version sans iGPU du Ryzen 5 7600 à prix réduit. Le meilleur rapport qualité/prix sur AM5 pour les configs avec GPU dédié.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7500f.html'),

('CPU', 'AMD Ryzen 9 7900', 'AMD', 369, 319, 'AM5', 'B650/X670', 65, 70, 2023,
 '{"Cores/Threads": "12/24", "Fréquence boost": "5.4 GHz", "TDP": "65W", "Socket": "AM5", "Cache L3": "64 MB", "Gravure": "5nm Zen 4"}',
 'Version non-X économique du Ryzen 9 7900X avec TDP 65W. Performances multithreadées excellentes avec faible consommation.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7900.html'),

('CPU', 'Intel Core Ultra 9 285K', 'Intel', 619, 549, 'LGA1851', 'Z890', 125, 68, 2024,
 '{"Cores/Threads": "24 (8P+16E)/24", "Fréquence boost": "5.7 GHz", "TDP": "125W", "Socket": "LGA1851", "Cache L3": "36 MB", "Gravure": "Intel 3", "Architecture": "Arrow Lake"}',
 'Flagship Intel Arrow Lake sur la nouvelle plateforme LGA1851. Architecture hybride repensée avec performances multithreadées améliorées.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core-ultra.html'),

('CPU', 'Intel Core Ultra 5 245K', 'Intel', 349, 299, 'LGA1851', 'Z890', 125, 65, 2024,
 '{"Cores/Threads": "14 (6P+8E)/14", "Fréquence boost": "5.2 GHz", "TDP": "125W", "Socket": "LGA1851", "Cache L3": "24 MB", "Gravure": "Intel 3", "Architecture": "Arrow Lake"}',
 'Processeur milieu de gamme Arrow Lake sur LGA1851. Bonne alternative pour ceux qui veulent la nouvelle plateforme Intel.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core-ultra.html'),

('CPU', 'AMD Ryzen 5 5500', 'AMD', 99, 79, 'AM4', 'B550/X570', 65, 70, 2022,
 '{"Cores/Threads": "6/12", "Fréquence boost": "4.2 GHz", "TDP": "65W", "Socket": "AM4", "Cache L3": "16 MB", "Gravure": "7nm Zen 3"}',
 'Processeur Zen 3 budget pour les configs AM4 entrée de gamme. Cache L3 réduit mais performances gaming correctes.',
 'https://www.amd.com/fr/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5500.html'),

('CPU', 'Intel Core i9-14900KF', 'Intel', 529, 459, 'LGA1700', 'Z790', 125, 68, 2024,
 '{"Cores/Threads": "24 (8P+16E)/32", "Fréquence boost": "6.0 GHz", "TDP": "125W", "Socket": "LGA1700", "Cache L3": "36 MB", "Gravure": "Intel 7", "iGPU": "Non"}',
 'Version sans iGPU du Core i9-14900K légèrement moins chère. Même performances exceptionnelles pour les configurations avec GPU dédié.',
 'https://www.intel.fr/content/www/fr/fr/products/details/processors/core/i9.html')

ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- GPUs (22 nouveaux)
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES

('GPU', 'NVIDIA GeForce RTX 4090', 'NVIDIA', 1849, 1699, NULL, 450, 75, 2022,
 '{"VRAM": "24 GB GDDR6X", "Architecture": "Ada Lovelace", "TDP": "450W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 1.4a", "Bus": "384-bit", "CUDA Cores": "16384"}',
 'La carte graphique la plus puissante du marché grand public. Gaming 4K sans compromis et performances professionnelles.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/40-series/rtx-4090/'),

('GPU', 'NVIDIA GeForce RTX 4080 16GB', 'NVIDIA', 1149, 1049, NULL, 320, 68, 2022,
 '{"VRAM": "16 GB GDDR6X", "Architecture": "Ada Lovelace", "TDP": "320W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 1.4a", "Bus": "256-bit", "CUDA Cores": "9728"}',
 'Carte haut de gamme Ada Lovelace avant la version Super. Excellentes performances 4K avec DLSS 3.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/40-series/rtx-4080/'),

('GPU', 'NVIDIA GeForce RTX 4070 Ti', 'NVIDIA', 779, 699, NULL, 285, 72, 2023,
 '{"VRAM": "12 GB GDDR6X", "Architecture": "Ada Lovelace", "TDP": "285W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 1.4a", "Bus": "192-bit", "CUDA Cores": "7680"}',
 'Carte haut de gamme avant la version Super. Très bonne pour le gaming 4K et le 1440p haute fréquence.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/40-series/rtx-4070-ti/'),

('GPU', 'NVIDIA GeForce RTX 3080 10GB', 'NVIDIA', 549, 489, NULL, 320, 60, 2020,
 '{"VRAM": "10 GB GDDR6X", "Architecture": "Ampere", "TDP": "320W", "Sorties vidéo": "3x DP 1.4a, 1x HDMI 2.1", "Bus": "320-bit", "CUDA Cores": "8704"}',
 'Encore compétitive pour le gaming 4K, la RTX 3080 reste une excellente option d occasion ou neuve déstockée.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/30-series/rtx-3080-3080ti/'),

('GPU', 'AMD Radeon RX 7900 XTX', 'AMD', 999, 899, NULL, 355, 72, 2022,
 '{"VRAM": "24 GB GDDR6", "Architecture": "RDNA 3", "TDP": "355W", "Sorties vidéo": "1x HDMI 2.1, 2x DP 2.1, 1x USB-C", "Bus": "384-bit"}',
 'Flagship AMD RDNA 3 avec 24 GB de VRAM. Excellente pour le gaming 4K et le contenu créatif.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-7900-xtx.html'),

('GPU', 'AMD Radeon RX 7900 XT', 'AMD', 799, 719, NULL, 315, 65, 2022,
 '{"VRAM": "20 GB GDDR6", "Architecture": "RDNA 3", "TDP": "315W", "Sorties vidéo": "1x HDMI 2.1, 2x DP 2.1, 1x USB-C", "Bus": "320-bit"}',
 'Carte AMD haut de gamme avec 20 GB de VRAM. Excellentes performances 4K à prix légèrement inférieur à la XTX.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-7900-xt.html'),

('GPU', 'AMD Radeon RX 7700 XT', 'AMD', 429, 379, NULL, 245, 75, 2023,
 '{"VRAM": "12 GB GDDR6", "Architecture": "RDNA 3", "TDP": "245W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 2.1", "Bus": "192-bit"}',
 'Carte milieu de gamme AMD avec 12 GB de VRAM. Excellente pour le 1440p avec un budget raisonnable.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-7700-xt.html'),

('GPU', 'AMD Radeon RX 7600 XT', 'AMD', 329, 289, NULL, 190, 78, 2024,
 '{"VRAM": "16 GB GDDR6", "Architecture": "RDNA 3", "TDP": "190W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 2.1", "Bus": "128-bit"}',
 'Version XT de la RX 7600 avec 16 GB de VRAM — avantage notable pour les jeux modernes et la création.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-7600-xt.html'),

('GPU', 'AMD Radeon RX 6700 XT', 'AMD', 349, 299, NULL, 230, 68, 2021,
 '{"VRAM": "12 GB GDDR6", "Architecture": "RDNA 2", "TDP": "230W", "Sorties vidéo": "3x DP 1.4, 1x HDMI 2.1", "Bus": "192-bit"}',
 'Carte RDNA 2 avec 12 GB idéale pour le 1440p. Encore très compétitive grâce à son bon tarif.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-6700-xt.html'),

('GPU', 'NVIDIA GeForce RTX 5070', 'NVIDIA', 699, 629, NULL, 250, 80, 2025,
 '{"VRAM": "12 GB GDDR7", "Architecture": "Blackwell", "TDP": "250W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 2.1", "Bus": "192-bit", "CUDA Cores": "6144"}',
 'Première génération Blackwell milieu de gamme. DLSS 4 Multi Frame Generation pour des performances gaming exceptionnelles.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5070/'),

('GPU', 'NVIDIA GeForce RTX 5080', 'NVIDIA', 1149, 1049, NULL, 360, 72, 2025,
 '{"VRAM": "16 GB GDDR7", "Architecture": "Blackwell", "TDP": "360W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 2.1", "Bus": "256-bit", "CUDA Cores": "10752"}',
 'Carte haut de gamme Blackwell. Performances proches de la RTX 4090 pour un prix moindre grâce au DLSS 4.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/50-series/rtx-5080/'),

('GPU', 'AMD Radeon RX 9070 XT', 'AMD', 649, 579, NULL, 304, 78, 2025,
 '{"VRAM": "16 GB GDDR6", "Architecture": "RDNA 4", "TDP": "304W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 2.1", "Bus": "256-bit"}',
 'Flagship RDNA 4 avec ray tracing amélioré. Concurrent direct de la RTX 5070 avec FSR 4 et ray tracing amélioré.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-9070-xt.html'),

('GPU', 'AMD Radeon RX 9070', 'AMD', 549, 489, NULL, 220, 76, 2025,
 '{"VRAM": "16 GB GDDR6", "Architecture": "RDNA 4", "TDP": "220W", "Sorties vidéo": "1x HDMI 2.1, 3x DP 2.1", "Bus": "256-bit"}',
 'Carte RDNA 4 milieu-haut de gamme. Excellentes performances 1440p/4K avec nouvelle architecture ray tracing.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-9070.html'),

('GPU', 'NVIDIA GeForce RTX 3070 Ti', 'NVIDIA', 449, 389, NULL, 290, 62, 2021,
 '{"VRAM": "8 GB GDDR6X", "Architecture": "Ampere", "TDP": "290W", "Sorties vidéo": "3x DP 1.4a, 1x HDMI 2.1", "Bus": "256-bit", "CUDA Cores": "6144"}',
 'Version Ti de la RTX 3070 avec GDDR6X. Bonne carte en 1440p encore disponible à des prix attractifs.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/30-series/rtx-3070-ti/'),

('GPU', 'AMD Radeon RX 6800 XT', 'AMD', 449, 399, NULL, 300, 62, 2020,
 '{"VRAM": "16 GB GDDR6", "Architecture": "RDNA 2", "TDP": "300W", "Sorties vidéo": "3x DP 1.4, 1x HDMI 2.1", "Bus": "256-bit"}',
 'Carte RDNA 2 avec 16 GB de VRAM. Encore pertinente pour le gaming 4K grâce à sa mémoire généreuse.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-6800-xt.html'),

('GPU', 'NVIDIA GeForce RTX 3060 Ti', 'NVIDIA', 349, 299, NULL, 200, 65, 2020,
 '{"VRAM": "8 GB GDDR6", "Architecture": "Ampere", "TDP": "200W", "Sorties vidéo": "3x DP 1.4a, 1x HDMI 2.1", "Bus": "256-bit", "CUDA Cores": "4864"}',
 'Carte 1080p/1440p très populaire de la génération Ampere. Toujours compétitive à prix réduit.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/30-series/rtx-3060-ti/'),

('GPU', 'AMD Radeon RX 7900 GRE', 'AMD', 549, 489, NULL, 260, 70, 2023,
 '{"VRAM": "16 GB GDDR6", "Architecture": "RDNA 3", "TDP": "260W", "Sorties vidéo": "2x DP 2.1, 1x HDMI 2.1", "Bus": "256-bit"}',
 'Variante Golden Rabbit Edition de la RX 7900. Excellent rapport qualité/prix pour le 4K avec 16 GB VRAM.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-7900-gre.html'),

('GPU', 'NVIDIA GeForce RTX 3090 Ti', 'NVIDIA', 899, 799, NULL, 450, 55, 2022,
 '{"VRAM": "24 GB GDDR6X", "Architecture": "Ampere", "TDP": "450W", "Sorties vidéo": "3x DP 1.4a, 1x HDMI 2.1", "Bus": "384-bit", "CUDA Cores": "10752"}',
 'Flagship Ampere avec 24 GB de VRAM. Pour la création de contenu et les workloads IA locaux, encore très capable.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/30-series/rtx-3090-ti/'),

('GPU', 'Intel Arc A770 16GB', 'Intel', 299, 259, NULL, 225, 65, 2022,
 '{"VRAM": "16 GB GDDR6", "Architecture": "Xe-HPG Alchemist", "TDP": "225W", "Sorties vidéo": "3x DP 2.0, 1x HDMI 2.1", "Bus": "256-bit", "Xe Cores": "32"}',
 'Carte Intel Arc budget avec 16 GB de VRAM. Excellente pour l encodage AV1 et compétitive en 1080p/1440p.',
 'https://www.intel.fr/content/www/fr/fr/products/sku/229151/intel-arc-a770-graphics-16gb/specifications.html'),

('GPU', 'AMD Radeon RX 6950 XT', 'AMD', 649, 579, NULL, 335, 60, 2022,
 '{"VRAM": "16 GB GDDR6", "Architecture": "RDNA 2", "TDP": "335W", "Sorties vidéo": "3x DP 1.4, 1x HDMI 2.1", "Bus": "256-bit"}',
 'Flagship RDNA 2 refreshed. Encore très capable en 4K avec 16 GB VRAM et fréquences élevées.',
 'https://www.amd.com/fr/products/graphics/amd-radeon-rx-6950-xt.html'),

('GPU', 'NVIDIA GeForce RTX 3060 12GB', 'NVIDIA', 299, 259, NULL, 170, 70, 2021,
 '{"VRAM": "12 GB GDDR6", "Architecture": "Ampere", "TDP": "170W", "Sorties vidéo": "3x DP 1.4a, 1x HDMI 2.1", "Bus": "192-bit", "CUDA Cores": "3584"}',
 'Carte 1080p accessible avec 12 GB de VRAM. Son buffer VRAM généreux la rend durable pour le gaming moderne.',
 'https://www.nvidia.com/fr-fr/geforce/graphics-cards/30-series/rtx-3060/')

ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- RAM (15 nouveaux)
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, popularity_score, release_year, specs, description, manufacturer_url) VALUES

('RAM', 'G.Skill Trident Z5 RGB DDR5-6000 32 GB (2x16) CL30', 'G.Skill', 159, 135, 'DDR5', 86, 2023,
 '{"Type": "DDR5", "Fréquence": "6000 MHz", "Latence CL": "CL30", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V", "RGB": "Oui", "Profil": "EXPO/XMP 3.0"}',
 'Kit DDR5 RGB avec éclairage spectaculaire et performances excellentes. Le sweet spot pour les Ryzen 7000/9000.',
 'https://www.gskill.com/'),

('RAM', 'Corsair Dominator Platinum RGB DDR5-6000 32 GB (2x16)', 'Corsair', 179, 155, 'DDR5', 80, 2022,
 '{"Type": "DDR5", "Fréquence": "6000 MHz", "Latence CL": "CL36", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V", "RGB": "Oui", "Profil": "XMP 3.0/EXPO"}',
 'Kit premium Corsair avec dissipateur iconique et RGB CAPELLIX. Le choix esthétique ultime pour build vitrine.',
 'https://www.corsair.com/fr/fr/'),

('RAM', 'Kingston Fury Renegade DDR5-6000 32 GB (2x16) CL32', 'Kingston', 149, 125, 'DDR5', 82, 2022,
 '{"Type": "DDR5", "Fréquence": "6000 MHz", "Latence CL": "CL32", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V", "Profil": "XMP 3.0/EXPO"}',
 'Kit DDR5 haut de gamme Kingston avec profils EXPO et XMP 3.0. Excellente stabilité et support garantie à vie.',
 'https://www.kingston.com/fr/'),

('RAM', 'G.Skill Ripjaws S5 DDR5-5600 32 GB (2x16) CL28', 'G.Skill', 119, 99, 'DDR5', 78, 2022,
 '{"Type": "DDR5", "Fréquence": "5600 MHz", "Latence CL": "CL28", "Capacité": "32 GB (2x16 GB)", "Tension": "1.25V", "Profil": "XMP 3.0/EXPO", "Design": "Low-profile"}',
 'Kit DDR5 low-profile idéal pour les ventirad bas encombrement. Latences serrées à CL28.',
 'https://www.gskill.com/'),

('RAM', 'Teamgroup T-Force Delta RGB DDR5-6000 32 GB (2x16)', 'Teamgroup', 139, 115, 'DDR5', 74, 2022,
 '{"Type": "DDR5", "Fréquence": "6000 MHz", "Latence CL": "CL38", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V", "RGB": "Oui", "Profil": "XMP 3.0/EXPO"}',
 'Kit DDR5 RGB compétitif de Teamgroup. Bon rapport qualité/prix pour un kit avec éclairage à 6000 MHz.',
 'https://www.teamgroupinc.com/fr/'),

('RAM', 'G.Skill Trident Z5 DDR5-6400 32 GB (2x16)', 'G.Skill', 179, 149, 'DDR5', 70, 2022,
 '{"Type": "DDR5", "Fréquence": "6400 MHz", "Latence CL": "CL32", "Capacité": "32 GB (2x16 GB)", "Tension": "1.40V", "Profil": "XMP 3.0/EXPO"}',
 'Kit DDR5 à haute fréquence pour overclockeurs. Fréquences supérieures au sweet spot pour des benchmarks impressionnants.',
 'https://www.gskill.com/'),

('RAM', 'Corsair Vengeance DDR5-5200 32 GB (2x16)', 'Corsair', 109, 89, 'DDR5', 75, 2022,
 '{"Type": "DDR5", "Fréquence": "5200 MHz", "Latence CL": "CL38", "Capacité": "32 GB (2x16 GB)", "Tension": "1.25V", "Profil": "XMP 3.0"}',
 'Kit DDR5 entrée de gamme Corsair. Bon choix pour démarrer sur une plateforme DDR5 sans trop dépenser.',
 'https://www.corsair.com/fr/fr/'),

('RAM', 'G.Skill Ripjaws V DDR4-3600 32 GB (2x16)', 'G.Skill', 79, 65, 'DDR4', 80, 2020,
 '{"Type": "DDR4", "Fréquence": "3600 MHz", "Latence CL": "CL16", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V", "Profil": "XMP 2.0"}',
 'Kit DDR4 32 GB idéal pour les plateformes Ryzen AM4 et Intel LGA1700. 3600 MHz CL16 est le sweet spot DDR4.',
 'https://www.gskill.com/'),

('RAM', 'Corsair Vengeance LPX DDR4-3600 32 GB (2x16)', 'Corsair', 85, 69, 'DDR4', 76, 2020,
 '{"Type": "DDR4", "Fréquence": "3600 MHz", "Latence CL": "CL18", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V", "Design": "Low-profile"}',
 'Kit DDR4 low-profile 32 GB fiable et compatible. Idéal pour les systèmes avec ventirad encombrant.',
 'https://www.corsair.com/fr/fr/'),

('RAM', 'Kingston Fury Beast DDR4-3200 32 GB (2x16)', 'Kingston', 75, 59, 'DDR4', 72, 2021,
 '{"Type": "DDR4", "Fréquence": "3200 MHz", "Latence CL": "CL16", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V", "Profil": "XMP 2.0"}',
 'Kit DDR4 32 GB abordable. Bon choix pour les builds AM4 avec budget limité.',
 'https://www.kingston.com/fr/'),

('RAM', 'G.Skill Trident Z Neo DDR4-3600 32 GB (2x16)', 'G.Skill', 89, 73, 'DDR4', 82, 2020,
 '{"Type": "DDR4", "Fréquence": "3600 MHz", "Latence CL": "CL16", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V", "Profil": "EXPO/XMP 2.0", "Optimisation": "AMD Ryzen"}',
 'Kit DDR4 optimisé pour AMD Ryzen avec profil EXPO. Design RGB sobre et performances excellentes sur AM4.',
 'https://www.gskill.com/'),

('RAM', 'Crucial Ballistix DDR4-3200 16 GB (2x8)', 'Crucial', 45, 35, 'DDR4', 65, 2020,
 '{"Type": "DDR4", "Fréquence": "3200 MHz", "Latence CL": "CL16", "Capacité": "16 GB (2x8 GB)", "Tension": "1.35V"}',
 'Kit DDR4 budget 16 GB pour entrée de gamme. Fiable et compatible avec toutes les plateformes DDR4.',
 'https://www.crucial.fr/'),

('RAM', 'Kingston Fury Beast DDR5-6000 32 GB (2x16)', 'Kingston', 139, 115, 'DDR5', 79, 2023,
 '{"Type": "DDR5", "Fréquence": "6000 MHz", "Latence CL": "CL36", "Capacité": "32 GB (2x16 GB)", "Tension": "1.35V", "Profil": "EXPO/XMP 3.0"}',
 'Kit DDR5 6000 MHz Kingston au rapport qualité/prix convaincant. Support EXPO et XMP 3.0 pour une configuration facile.',
 'https://www.kingston.com/fr/'),

('RAM', 'Corsair Vengeance DDR5-6400 64 GB (2x32)', 'Corsair', 249, 215, 'DDR5', 65, 2023,
 '{"Type": "DDR5", "Fréquence": "6400 MHz", "Latence CL": "CL32", "Capacité": "64 GB (2x32 GB)", "Tension": "1.40V", "Profil": "XMP 3.0"}',
 'Kit DDR5 64 GB haute fréquence pour workstation et création de contenu intensive. Capacité maximale en dual-channel.',
 'https://www.corsair.com/fr/fr/'),

('RAM', 'G.Skill Trident Z5 RGB DDR5-7200 32 GB (2x16)', 'G.Skill', 219, 189, 'DDR5', 55, 2023,
 '{"Type": "DDR5", "Fréquence": "7200 MHz", "Latence CL": "CL34", "Capacité": "32 GB (2x16 GB)", "Tension": "1.45V", "RGB": "Oui", "Profil": "XMP 3.0"}',
 'Kit DDR5 extrême overclocking pour benchmarkers. Fréquence record avec RGB spectaculaire.',
 'https://www.gskill.com/')

ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Stockage (15 nouveaux)
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, popularity_score, release_year, specs, description, manufacturer_url) VALUES

('Stockage', 'Samsung 980 Pro 1 To', 'Samsung', 89, 75, 85, 2020,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7000 Mo/s", "Écriture séq.": "5000 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'SSD PCIe 4.0 Samsung avec cache DRAM. Performances élevées pour le gaming et la création de contenu.',
 'https://www.samsung.com/fr/memory-storage/nvme-ssd/980-pro/'),

('Stockage', 'Samsung 980 Pro 2 To', 'Samsung', 149, 125, 78, 2020,
 '{"Capacité": "2 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7000 Mo/s", "Écriture séq.": "5100 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'Version 2 To du 980 Pro pour ceux qui ont besoin de capacité et de vitesse. Idéal comme SSD système.',
 'https://www.samsung.com/fr/memory-storage/nvme-ssd/980-pro/'),

('Stockage', 'WD Black SN850X 1 To', 'Western Digital', 109, 89, 88, 2022,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7300 Mo/s", "Écriture séq.": "6300 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'L un des SSD PCIe 4.0 les plus rapides du marché. Optimisé pour le gaming avec des temps de chargement réduits.',
 'https://www.westerndigital.com/fr-fr/products/internal-drives/wd-black-sn850x-nvme-ssd'),

('Stockage', 'WD Black SN850X 2 To', 'Western Digital', 179, 149, 80, 2022,
 '{"Capacité": "2 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7300 Mo/s", "Écriture séq.": "6600 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'Version 2 To du SN850X ultra-performant. Pour les joueurs qui veulent beaucoup de jeux installés rapidement.',
 'https://www.westerndigital.com/fr-fr/products/internal-drives/wd-black-sn850x-nvme-ssd'),

('Stockage', 'Crucial T700 1 To', 'Crucial', 139, 119, 72, 2023,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 5.0 x4", "Lecture séq.": "11700 Mo/s", "Écriture séq.": "9500 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'Un des premiers SSD PCIe 5.0 grand public. Vitesses record pour les workloads les plus exigeants.',
 'https://www.crucial.fr/ssd/t700/CT1000T700SSD3'),

('Stockage', 'Crucial T700 2 To', 'Crucial', 239, 199, 65, 2023,
 '{"Capacité": "2 To", "Interface": "NVMe PCIe 5.0 x4", "Lecture séq.": "12400 Mo/s", "Écriture séq.": "11800 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'Version 2 To du T700 PCIe 5.0. Débits record pour la création de contenu et les workloads professionnels.',
 'https://www.crucial.fr/ssd/t700/CT2000T700SSD3'),

('Stockage', 'Seagate FireCuda 530 1 To', 'Seagate', 99, 82, 80, 2021,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7300 Mo/s", "Écriture séq.": "6000 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'SSD performant de Seagate compatible PlayStation 5. Performances parmi les meilleures en PCIe 4.0.',
 'https://www.seagate.com/fr/fr/internal-hard-drives/ssd/firecuda/'),

('Stockage', 'Seagate FireCuda 530 2 To', 'Seagate', 169, 139, 72, 2021,
 '{"Capacité": "2 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7300 Mo/s", "Écriture séq.": "6900 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'Version 2 To du FireCuda 530, compatible PS5. Performances excellentes et grande capacité pour les joueurs.',
 'https://www.seagate.com/fr/fr/internal-hard-drives/ssd/firecuda/'),

('Stockage', 'Kingston KC3000 1 To', 'Kingston', 89, 73, 70, 2022,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7000 Mo/s", "Écriture séq.": "6000 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'SSD NVMe PCIe 4.0 haut de gamme de Kingston. Contrôleur Phison E18 éprouvé.',
 'https://www.kingston.com/fr/'),

('Stockage', 'Samsung 870 EVO 1 To', 'Samsung', 89, 75, 75, 2021,
 '{"Capacité": "1 To", "Interface": "SATA III", "Lecture séq.": "560 Mo/s", "Écriture séq.": "530 Mo/s", "Format": "2.5\"", "Cache": "DRAM"}',
 'Meilleur SSD SATA du marché. Idéal pour les systèmes sans slot M.2 ou comme stockage secondaire.',
 'https://www.samsung.com/fr/memory-storage/sata-ssd/870-evo/'),

('Stockage', 'WD Blue SN580 1 To', 'Western Digital', 69, 55, 78, 2023,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "4150 Mo/s", "Écriture séq.": "4150 Mo/s", "Format": "M.2 2280"}',
 'SSD NVMe budget sans cache DRAM mais avec HMB. Excellent rapport qualité/prix pour un SSD PCIe 4.0.',
 'https://www.westerndigital.com/fr-fr/products/internal-drives/wd-blue-sn580-nvme-ssd'),

('Stockage', 'Crucial MX500 1 To', 'Crucial', 79, 65, 70, 2018,
 '{"Capacité": "1 To", "Interface": "SATA III", "Lecture séq.": "560 Mo/s", "Écriture séq.": "510 Mo/s", "Format": "2.5\"", "Cache": "DRAM + SLC"}',
 'SSD SATA fiable et éprouvé de Crucial. Un classique du stockage secondaire avec garantie 5 ans.',
 'https://www.crucial.fr/ssd/mx500'),

('Stockage', 'SK Hynix Platinum P41 1 To', 'SK Hynix', 99, 82, 82, 2022,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7000 Mo/s", "Écriture séq.": "6500 Mo/s", "Format": "M.2 2280", "Cache": "DRAM"}',
 'L un des SSD PCIe 4.0 les plus efficaces énergétiquement. Chaleur maîtrisée et performances excellentes.',
 'https://product.skhynix.com/'),

('Stockage', 'Lexar NM790 1 To', 'Lexar', 69, 55, 72, 2023,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 4.0 x4", "Lecture séq.": "7400 Mo/s", "Écriture séq.": "6500 Mo/s", "Format": "M.2 2280"}',
 'SSD PCIe 4.0 très compétitif de Lexar. Performances proches des références à un prix très agressif.',
 'https://www.lexar.com/fr/'),

('Stockage', 'Silicon Power XD80 1 To', 'Silicon Power', 59, 47, 62, 2021,
 '{"Capacité": "1 To", "Interface": "NVMe PCIe 3.0 x4", "Lecture séq.": "3400 Mo/s", "Écriture séq.": "3000 Mo/s", "Format": "M.2 2280"}',
 'SSD NVMe PCIe 3.0 budget. Bonne option pour les plateformes qui ne supportent pas le PCIe 4.0.',
 'https://www.silicon-power.com/web/fr/')

ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Cartes mères (20 nouvelles)
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, chipset, form_factor, popularity_score, release_year, specs, description, manufacturer_url) VALUES

('Carte mère', 'ASUS ROG STRIX B650E-F GAMING WIFI', 'ASUS', 329, 289, 'AM5', 'B650E', 'ATX', 85, 2022,
 '{"Socket": "AM5", "Chipset": "B650E", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "4", "WiFi": "WiFi 6E", "PCIe": "PCIe 5.0 x16"}',
 'Carte mère AM5 haut de gamme ROG avec 4 slots M.2, PCIe 5.0 et WiFi 6E. Pour les builds Ryzen 7000 exigeants.',
 'https://www.asus.com/fr/motherboards-components/motherboards/rog/rog-strix-b650e-f-gaming-wifi/'),

('Carte mère', 'ASUS ROG CROSSHAIR X670E HERO', 'ASUS', 579, 509, 'AM5', 'X670E', 'ATX', 78, 2022,
 '{"Socket": "AM5", "Chipset": "X670E", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "5", "WiFi": "WiFi 6E", "PCIe": "PCIe 5.0 x16 + x4 M.2"}',
 'Carte mère AM5 enthousiaste ROG Crosshair. Tout ce qu il faut pour exploiter le Ryzen 9 7950X3D au maximum.',
 'https://www.asus.com/fr/motherboards-components/motherboards/rog/rog-crosshair-x670e-hero/'),

('Carte mère', 'MSI MEG X670E ACE', 'MSI', 649, 569, 'AM5', 'X670E', 'ATX', 72, 2022,
 '{"Socket": "AM5", "Chipset": "X670E", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "5", "WiFi": "WiFi 6E", "Thunderbolt": "4"}',
 'Carte mère X670E haut de gamme MSI avec Thunderbolt 4. Pour les power users AM5 sans compromis.',
 'https://fr.msi.com/Motherboard/MEG-X670E-ACE'),

('Carte mère', 'Gigabyte X670E AORUS MASTER', 'Gigabyte', 579, 509, 'AM5', 'X670E', 'ATX', 75, 2022,
 '{"Socket": "AM5", "Chipset": "X670E", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "4", "WiFi": "WiFi 6E", "USB4": "Oui 40Gbps"}',
 'Carte mère X670E premium Gigabyte AORUS avec USB4 40Gbps. Connectivity et performances au plus haut niveau.',
 'https://www.gigabyte.com/fr/Motherboard/X670E-AORUS-MASTER'),

('Carte mère', 'ASUS TUF GAMING X670E-PLUS WIFI', 'ASUS', 329, 289, 'AM5', 'X670E', 'ATX', 80, 2022,
 '{"Socket": "AM5", "Chipset": "X670E", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "4", "WiFi": "WiFi 6E", "PCIe": "PCIe 5.0"}',
 'Carte mère TUF X670E avec PCIe 5.0 pour SSD ultra-rapides. L accès au X670E à prix plus abordable.',
 'https://www.asus.com/fr/motherboards-components/motherboards/tuf-gaming/tuf-gaming-x670e-plus-wifi/'),

('Carte mère', 'MSI MAG B650M MORTAR WIFI', 'MSI', 199, 169, 'AM5', 'B650', 'mATX', 82, 2022,
 '{"Socket": "AM5", "Chipset": "B650", "Format": "mATX", "RAM max": "128 GB DDR5", "Slots M.2": "2", "WiFi": "WiFi 6E"}',
 'Excellente carte mère mATX AM5 avec WiFi 6E. Parfaite pour les builds compacts Ryzen 7000.',
 'https://fr.msi.com/Motherboard/MAG-B650M-MORTAR-WIFI'),

('Carte mère', 'Gigabyte B650M AORUS ELITE AX', 'Gigabyte', 189, 159, 'AM5', 'B650', 'mATX', 78, 2022,
 '{"Socket": "AM5", "Chipset": "B650", "Format": "mATX", "RAM max": "128 GB DDR5", "Slots M.2": "2", "WiFi": "WiFi 6E"}',
 'Carte mère mATX AM5 Gigabyte avec WiFi 6E. Build compact sans sacrifier les fonctionnalités.',
 'https://www.gigabyte.com/fr/Motherboard/B650M-AORUS-ELITE-AX'),

('Carte mère', 'ASUS ROG STRIX Z790-E GAMING WIFI', 'ASUS', 499, 439, 'LGA1700', 'Z790', 'ATX', 80, 2022,
 '{"Socket": "LGA1700", "Chipset": "Z790", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "5", "WiFi": "WiFi 6E", "USB4": "Oui"}',
 'Carte mère Z790 haut de gamme ROG pour les Core i7/i9. USB4, 5 slots M.2 et WiFi 6E.',
 'https://www.asus.com/fr/motherboards-components/motherboards/rog/rog-strix-z790-e-gaming-wifi/'),

('Carte mère', 'MSI MEG Z790 ACE', 'MSI', 579, 509, 'LGA1700', 'Z790', 'ATX', 72, 2022,
 '{"Socket": "LGA1700", "Chipset": "Z790", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "5", "WiFi": "WiFi 6E", "Thunderbolt": "4"}',
 'Carte mère Z790 haut de gamme MSI MEG avec Thunderbolt 4. Pour les configurations Intel les plus exigeantes.',
 'https://fr.msi.com/Motherboard/MEG-Z790-ACE'),

('Carte mère', 'Gigabyte Z790 AORUS MASTER', 'Gigabyte', 519, 449, 'LGA1700', 'Z790', 'ATX', 75, 2022,
 '{"Socket": "LGA1700", "Chipset": "Z790", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "5", "WiFi": "WiFi 6E", "USB4": "40Gbps"}',
 'Carte mère Z790 premium Gigabyte AORUS. Connectivité USB4 et 5 slots M.2 pour une plateforme complète.',
 'https://www.gigabyte.com/fr/Motherboard/Z790-AORUS-MASTER'),

('Carte mère', 'ASUS TUF GAMING Z790-PLUS WIFI', 'ASUS', 319, 279, 'LGA1700', 'Z790', 'ATX', 82, 2022,
 '{"Socket": "LGA1700", "Chipset": "Z790", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "4", "WiFi": "WiFi 6E"}',
 'Carte mère Z790 TUF fiable avec WiFi 6E. Le bon équilibre entre fonctionnalités et prix pour Intel 12e/13e/14e gen.',
 'https://www.asus.com/fr/motherboards-components/motherboards/tuf-gaming/tuf-gaming-z790-plus-wifi/'),

('Carte mère', 'MSI MAG Z790 TOMAHAWK WIFI', 'MSI', 299, 259, 'LGA1700', 'Z790', 'ATX', 85, 2022,
 '{"Socket": "LGA1700", "Chipset": "Z790", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "4", "WiFi": "WiFi 6E"}',
 'La carte mère Z790 référence de MSI. Excellent rapport qualité/prix pour les builds Intel haut de gamme.',
 'https://fr.msi.com/Motherboard/MAG-Z790-TOMAHAWK-WIFI'),

('Carte mère', 'Gigabyte B760M AORUS ELITE AX', 'Gigabyte', 199, 169, 'LGA1700', 'B760', 'mATX', 78, 2023,
 '{"Socket": "LGA1700", "Chipset": "B760", "Format": "mATX", "RAM max": "128 GB DDR5", "Slots M.2": "3", "WiFi": "WiFi 6E"}',
 'Carte mère mATX Intel B760 avec WiFi 6E. Pour les builds compacts sur plateforme Intel 12e/13e/14e gen.',
 'https://www.gigabyte.com/fr/Motherboard/B760M-AORUS-ELITE-AX'),

('Carte mère', 'ASUS PRIME B760M-A WIFI', 'ASUS', 159, 135, 'LGA1700', 'B760', 'mATX', 75, 2023,
 '{"Socket": "LGA1700", "Chipset": "B760", "Format": "mATX", "RAM max": "128 GB DDR5", "Slots M.2": "2", "WiFi": "WiFi 6"}',
 'Carte mère mATX Intel budget avec WiFi. Idéale pour les configs Core i3/i5 compactes et économiques.',
 'https://www.asus.com/fr/motherboards-components/motherboards/prime/prime-b760m-a-wifi/'),

('Carte mère', 'MSI PRO Z790-A WIFI', 'MSI', 259, 219, 'LGA1700', 'Z790', 'ATX', 72, 2023,
 '{"Socket": "LGA1700", "Chipset": "Z790", "Format": "ATX", "RAM max": "128 GB DDR5", "Slots M.2": "4", "WiFi": "WiFi 6E"}',
 'Carte mère Z790 ATX avec overclocking pour les Core i7/i9. Fonctionnalités complètes à prix raisonnable.',
 'https://fr.msi.com/Motherboard/PRO-Z790-A-WIFI'),

('Carte mère', 'ASUS ROG MAXIMUS Z790 APEX', 'ASUS', 799, 699, 'LGA1700', 'Z790', 'ATX', 60, 2022,
 '{"Socket": "LGA1700", "Chipset": "Z790", "Format": "ATX", "RAM max": "64 GB DDR5", "Slots M.2": "3", "WiFi": "WiFi 6E", "OC": "Extreme OC ready"}',
 'Carte mère Z790 extrême pour overclocking RAM. 2 slots DDR5 seulement mais optimisée pour les fréquences records.',
 'https://www.asus.com/fr/motherboards-components/motherboards/rog/rog-maximus-z790-apex/'),

('Carte mère', 'Gigabyte A620M GAMING X', 'Gigabyte', 109, 89, 'AM5', 'A620', 'mATX', 65, 2023,
 '{"Socket": "AM5", "Chipset": "A620", "Format": "mATX", "RAM max": "96 GB DDR5", "Slots M.2": "2", "WiFi": "Non"}',
 'Carte mère AM5 budget sans overclocking. Le moyen le moins cher d accéder à la plateforme AM5.',
 'https://www.gigabyte.com/fr/Motherboard/A620M-GAMING-X'),

('Carte mère', 'MSI MAG A620M MORTAR WIFI', 'MSI', 139, 115, 'AM5', 'A620', 'mATX', 68, 2023,
 '{"Socket": "AM5", "Chipset": "A620", "Format": "mATX", "RAM max": "96 GB DDR5", "Slots M.2": "2", "WiFi": "WiFi 6E"}',
 'Carte mère A620 mATX avec WiFi pour builds Ryzen budget. L option la plus abordable avec WiFi sur AM5.',
 'https://fr.msi.com/Motherboard/MAG-A620M-MORTAR-WIFI'),

('Carte mère', 'ASUS PRIME A620M-A', 'ASUS', 119, 99, 'AM5', 'A620', 'mATX', 62, 2023,
 '{"Socket": "AM5", "Chipset": "A620", "Format": "mATX", "RAM max": "96 GB DDR5", "Slots M.2": "2", "WiFi": "Non"}',
 'Carte mère AM5 entrée de gamme sans WiFi. La base idéale pour un PC Ryzen 5 7600 économique.',
 'https://www.asus.com/fr/motherboards-components/motherboards/prime/prime-a620m-a/'),

('Carte mère', 'ASRock B650M Pro RS WiFi', 'ASRock', 179, 149, 'AM5', 'B650', 'mATX', 72, 2022,
 '{"Socket": "AM5", "Chipset": "B650", "Format": "mATX", "RAM max": "128 GB DDR5", "Slots M.2": "2", "WiFi": "WiFi 6E"}',
 'Carte mère mATX AM5 ASRock avec WiFi 6E. Alternative solide à prix compétitif pour les builds compacts.',
 'https://www.asrock.com/mb/AMD/B650M%20Pro%20RS%20WiFi/')

ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Alimentations (16 nouvelles)
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES

('Alimentation', 'Corsair RM1000x', 'Corsair', 179, 155, 1000, 82, 2023,
 '{"Puissance": "1000W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX", "Connecteur": "12VHPWR", "ATX": "3.0"}',
 'Alimentation 1000W pour les configs avec RTX 4090 ou double GPU. Mode fanless silencieux à faible charge.',
 'https://www.corsair.com/fr/fr/'),

('Alimentation', 'Corsair HX1000', 'Corsair', 219, 189, 1000, 75, 2022,
 '{"Puissance": "1000W", "Certification 80+": "Platinum", "Modulaire": "Oui (full)", "Format": "ATX", "Condensateurs": "Japonais 105°C"}',
 'Alimentation Platinum 1000W avec condensateurs japonais premium. Longévité et efficacité maximales.',
 'https://www.corsair.com/fr/fr/'),

('Alimentation', 'be quiet! Dark Power 13 1000W', 'be quiet!', 279, 249, 1000, 70, 2022,
 '{"Puissance": "1000W", "Certification 80+": "Titanium", "Modulaire": "Oui (full)", "Format": "ATX 3.0", "Ventilateur": "135mm", "Connecteur": "12VHPWR"}',
 'L alimentation la plus silencieuse et efficace de be quiet! Certification Titanium et ATX 3.0 natif.',
 'https://www.bequiet.com/fr/'),

('Alimentation', 'be quiet! Straight Power 11 750W', 'be quiet!', 119, 99, 750, 78, 2021,
 '{"Puissance": "750W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX", "Ventilateur": "135mm Silent Wings"}',
 'Alimentation gold silencieuse de be quiet! avec ventilateur Silent Wings. Idéale pour les builds discrets.',
 'https://www.bequiet.com/fr/'),

('Alimentation', 'Seasonic Prime TX-850', 'Seasonic', 249, 219, 850, 72, 2021,
 '{"Puissance": "850W", "Certification 80+": "Titanium", "Modulaire": "Oui (full)", "Format": "ATX", "Garantie": "12 ans"}',
 'Alimentation Titanium haut de gamme Seasonic avec garantie 12 ans. L une des meilleures au monde.',
 'https://seasonic.com/'),

('Alimentation', 'Seasonic Focus GX-750', 'Seasonic', 109, 91, 750, 82, 2022,
 '{"Puissance": "750W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX", "Ventilateur": "120mm", "Garantie": "10 ans"}',
 'Alimentation 750W Gold fiable et silencieuse avec 10 ans de garantie. Un incontournable du milieu de gamme.',
 'https://seasonic.com/'),

('Alimentation', 'EVGA SuperNOVA 850 G6', 'EVGA', 139, 119, 850, 70, 2022,
 '{"Puissance": "850W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX", "Ventilateur": "135mm"}',
 'Alimentation EVGA 850W Gold fiable. Bonne option bien que la marque ait quitté le marché GPU.',
 'https://www.evga.com/'),

('Alimentation', 'Corsair SF750', 'Corsair', 159, 139, 750, 85, 2021,
 '{"Puissance": "750W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "SFX", "Dimensions": "125x63.5x100mm"}',
 'La référence des alimentations SFX 750W pour ITX et mATX. Puissance maximale dans un format minimal.',
 'https://www.corsair.com/fr/fr/'),

('Alimentation', 'be quiet! Pure Power 12 M 850W', 'be quiet!', 129, 109, 850, 78, 2023,
 '{"Puissance": "850W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX 3.0", "Connecteur": "12VHPWR"}',
 'Version 850W de la Pure Power 12 M avec ATX 3.0. Prête pour les dernières cartes graphiques NVIDIA.',
 'https://www.bequiet.com/fr/'),

('Alimentation', 'Corsair RM650e', 'Corsair', 89, 75, 650, 80, 2023,
 '{"Puissance": "650W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX 3.0", "Connecteur": "12VHPWR"}',
 'Alimentation 650W budget Corsair avec ATX 3.0 natif. Suffisante pour les configs RTX 4070 et inférieures.',
 'https://www.corsair.com/fr/fr/'),

('Alimentation', 'Seasonic Focus GX-850', 'Seasonic', 139, 119, 850, 80, 2022,
 '{"Puissance": "850W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX", "Garantie": "10 ans"}',
 'Alimentation 850W Gold Seasonic pour les configs avec GPU haut de gamme. 10 ans de garantie.',
 'https://seasonic.com/'),

('Alimentation', 'Fractal Design Ion+ 2 860W Platinum', 'Fractal Design', 169, 149, 860, 70, 2021,
 '{"Puissance": "860W", "Certification 80+": "Platinum", "Modulaire": "Oui (full)", "Format": "ATX", "Ventilateur": "140mm"}',
 'Alimentation Platinum de Fractal Design avec ventilateur 140mm silencieux. Efficacité élevée et design scandinave.',
 'https://www.fractal-design.com/fr/'),

('Alimentation', 'MSI MPG A1000G', 'MSI', 169, 149, 1000, 72, 2023,
 '{"Puissance": "1000W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX 3.0", "Connecteur": "12VHPWR", "Garantie": "10 ans"}',
 'Alimentation 1000W ATX 3.0 de MSI avec connecteur 12VHPWR natif. Pour les configs RTX 4080/4090.',
 'https://fr.msi.com/'),

('Alimentation', 'Asus ROG Thor 1000W Platinum II', 'ASUS', 259, 229, 1000, 68, 2022,
 '{"Puissance": "1000W", "Certification 80+": "Platinum", "Modulaire": "Oui (full)", "Format": "ATX", "OLED": "Affichage Watt consommation", "RGB": "Oui"}',
 'Alimentation ROG avec écran OLED affichant la consommation en temps réel. Le luxe pour les builds gaming RGB.',
 'https://www.asus.com/fr/'),

('Alimentation', 'Thermaltake Toughpower GF3 1000W', 'Thermaltake', 179, 155, 1000, 65, 2023,
 '{"Puissance": "1000W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX 3.0", "Connecteur": "12VHPWR", "Garantie": "10 ans"}',
 'Alimentation ATX 3.0 1000W de Thermaltake avec connecteur 12VHPWR. Bonne option pour les grandes configs.',
 'https://www.thermaltake.com/fr/'),

('Alimentation', 'DeepCool PX1000G', 'Deepcool', 159, 139, 1000, 68, 2023,
 '{"Puissance": "1000W", "Certification 80+": "Gold", "Modulaire": "Oui (full)", "Format": "ATX 3.0", "Connecteur": "12VHPWR", "Ventilateur": "120mm"}',
 'Alimentation 1000W Gold ATX 3.0 de DeepCool à prix compétitif. Bonne alternative aux marques premium.',
 'https://www.deepcool.com/fr/')

ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Boîtiers (21 nouveaux)
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, form_factor, popularity_score, release_year, specs, description, manufacturer_url) VALUES

('Boîtier', 'Fractal Design Torrent', 'Fractal Design', 169, 149, 'ATX', 88, 2021,
 '{"Format": "ATX Mid-Tower", "Ventilateurs inclus": "2x 180mm front + 1x 140mm rear", "Fenêtre": "Verre trempé", "GPU max": "461 mm", "Ventirad max": "186 mm"}',
 'Le boîtier le mieux ventilé du marché grâce aux deux ventilateurs 180mm en façade. Idéal pour les RTX 4090.',
 'https://www.fractal-design.com/fr/'),

('Boîtier', 'Fractal Design Define 7', 'Fractal Design', 159, 139, 'ATX', 80, 2020,
 '{"Format": "ATX Mid-Tower", "Insonorisation": "Oui", "Fenêtre": "Verre trempé optionnel", "GPU max": "440 mm", "Stockage": "jusqu à 18 disques"}',
 'Boîtier silencieux de référence avec insonorisation intégrée. Pour les builds discrets et silencieux.',
 'https://www.fractal-design.com/fr/'),

('Boîtier', 'Lian Li PC-O11 Dynamic EVO', 'Lian Li', 149, 129, 'ATX', 90, 2022,
 '{"Format": "ATX Mid-Tower", "Orientation": "Dual-chamber", "Fenêtre": "Verre trempé 3 côtés", "GPU max": "420 mm", "Ventirad max": "167 mm", "Fan slots": "10"}',
 'La version évoluée du légendaire O11 Dynamic. Double chambre pour une gestion thermique optimale.',
 'https://www.lian-li.com/fr/'),

('Boîtier', 'Lian Li PC-O11 Dynamic White', 'Lian Li', 139, 119, 'ATX', 82, 2019,
 '{"Format": "ATX Mid-Tower", "Couleur": "Blanc", "Fenêtre": "Verre trempé 3 côtés", "GPU max": "420 mm", "Ventirad max": "155 mm", "Fan slots": "9"}',
 'Le classique O11 Dynamic en finition blanche. Idéal pour les builds blancs avec watercooling custom.',
 'https://www.lian-li.com/fr/'),

('Boîtier', 'be quiet! Dark Base 900 Pro', 'be quiet!', 249, 219, 'E-ATX', 72, 2022,
 '{"Format": "E-ATX Full-Tower", "Insonorisation": "Oui", "Fenêtre": "Verre trempé", "GPU max": "500 mm", "Ventirad max": "185 mm", "Rotation": "Carte mère inversée"}',
 'Boîtier full-tower be quiet! avec insonorisation premium et carte mère réversible. Silence total garanti.',
 'https://www.bequiet.com/fr/'),

('Boîtier', 'be quiet! Silent Base 802', 'be quiet!', 159, 139, 'ATX', 75, 2021,
 '{"Format": "ATX Mid-Tower", "Insonorisation": "Oui", "Fenêtre": "Verre trempé", "GPU max": "369 mm", "Ventirad max": "185 mm", "Ventilateurs": "3x Pure Wings 3 140mm"}',
 'Boîtier silencieux avec 3 ventilateurs inclus et excellente insonorisation. Le choix des builds whisper-quiet.',
 'https://www.bequiet.com/fr/'),

('Boîtier', 'Corsair 5000D Airflow', 'Corsair', 149, 129, 'ATX', 85, 2021,
 '{"Format": "ATX Mid-Tower", "Façade": "Mesh perforé", "Fenêtre": "Verre trempé", "GPU max": "420 mm", "Ventirad max": "170 mm", "USB-C": "Oui"}',
 'Version améliorée du 4000D avec plus d espace intérieur. Excellent airflow mesh et gestion câbles impeccable.',
 'https://www.corsair.com/fr/fr/'),

('Boîtier', 'Corsair 7000D AIRFLOW', 'Corsair', 249, 219, 'E-ATX', 68, 2021,
 '{"Format": "E-ATX Full-Tower", "Façade": "Mesh perforé", "Fenêtre": "Verre trempé", "GPU max": "600 mm", "Ventirad max": "190 mm"}',
 'Boîtier full-tower Corsair pour les builds les plus ambitieux. Espace exceptionnel pour watercooling custom.',
 'https://www.corsair.com/fr/fr/'),

('Boîtier', 'NZXT H7 Flow', 'NZXT', 149, 129, 'ATX', 82, 2022,
 '{"Format": "ATX Mid-Tower", "Façade": "Mesh perforé", "Fenêtre": "Verre trempé", "GPU max": "400 mm", "Ventirad max": "185 mm"}',
 'NZXT H7 avec façade mesh pour un meilleur airflow que le H7 standard. Design minimaliste reconnaissable.',
 'https://nzxt.com/'),

('Boîtier', 'NZXT H9 Flow', 'NZXT', 199, 179, 'ATX', 78, 2023,
 '{"Format": "ATX Mid-Tower", "Design": "Dual-chamber panoramique", "Fenêtre": "Verre trempé 3 côtés", "GPU max": "435 mm", "Ventirad max": "165 mm"}',
 'Boîtier double chambre panoramique NZXT avec vue 270°. Exceptionnel pour les builds vitrines avec AIO.',
 'https://nzxt.com/'),

('Boîtier', 'Phanteks Eclipse P500A', 'Phanteks', 129, 109, 'ATX', 80, 2020,
 '{"Format": "ATX Mid-Tower", "Façade": "Mesh perforé double couche", "Fenêtre": "Verre trempé", "GPU max": "435 mm", "Ventilateurs inclus": "3x 140mm"}',
 'Boîtier mesh avec 3 ventilateurs 140mm inclus. L un des meilleurs rapports airflow/prix du marché.',
 'https://www.phanteks.com/'),

('Boîtier', 'Phanteks NV7', 'Phanteks', 249, 219, 'E-ATX', 65, 2022,
 '{"Format": "E-ATX Full-Tower", "Fenêtre": "Verre trempé 4 côtés panoramique", "GPU max": "500 mm", "Ventirad max": "170 mm", "GPU vertical": "Oui natif"}',
 'Boîtier panoramique 4 côtés verre trempé pour builds vitrines. Support GPU vertical inclus.',
 'https://www.phanteks.com/'),

('Boîtier', 'Cooler Master HAF 500', 'Cooler Master', 119, 99, 'ATX', 72, 2022,
 '{"Format": "ATX Mid-Tower", "Façade": "Mesh ARGB", "Fenêtre": "Verre trempé", "GPU max": "410 mm", "Ventilateurs inclus": "2x 200mm ARGB front"}',
 'High Air Flow avec deux ventilateurs 200mm ARGB en façade. Excellent airflow et illumination spectaculaire.',
 'https://www.coolermaster.com/fr/'),

('Boîtier', 'Cooler Master MasterBox TD500 Mesh', 'Cooler Master', 99, 85, 'ATX', 78, 2021,
 '{"Format": "ATX Mid-Tower", "Façade": "Mesh perforé", "Fenêtre": "Verre trempé", "GPU max": "410 mm", "Ventilateurs inclus": "3x 120mm ARGB"}',
 'Boîtier mesh compact avec 3 ventilateurs ARGB inclus. Excellent rapport qualité/prix avec RGB intégré.',
 'https://www.coolermaster.com/fr/'),

('Boîtier', 'Fractal Design Pop Air', 'Fractal Design', 99, 85, 'ATX', 76, 2022,
 '{"Format": "ATX Mid-Tower", "Façade": "Mesh", "Fenêtre": "Verre trempé", "GPU max": "341 mm", "Ventilateurs inclus": "2x 140mm front, 1x 120mm rear"}',
 'Boîtier Fractal entrée de gamme avec 3 ventilateurs inclus et façade mesh. Le meilleur départ pour un build.',
 'https://www.fractal-design.com/fr/'),

('Boîtier', 'Lian Li LANCOOL 216', 'Lian Li', 129, 109, 'ATX', 82, 2022,
 '{"Format": "ATX Mid-Tower", "Façade": "Mesh perforé", "Fenêtre": "Verre trempé", "GPU max": "400 mm", "Ventilateurs inclus": "2x 160mm ARGB front"}',
 'Boîtier Lian Li avec deux ventilateurs 160mm ARGB en façade. Airflow exceptionnel et design soigné.',
 'https://www.lian-li.com/fr/'),

('Boîtier', 'DeepCool CH510', 'Deepcool', 89, 72, 'ATX', 68, 2022,
 '{"Format": "ATX Mid-Tower", "Façade": "Mesh perforé", "Fenêtre": "Verre trempé", "GPU max": "400 mm", "Ventirad max": "175 mm"}',
 'Boîtier mesh budget de DeepCool avec bon airflow. Alternative économique aux boîtiers mesh premium.',
 'https://www.deepcool.com/fr/'),

('Boîtier', 'Silverstone FARA R1', 'Silverstone', 79, 65, 'ATX', 60, 2021,
 '{"Format": "ATX Mid-Tower", "Façade": "Mesh perforé", "Fenêtre": "Verre trempé", "GPU max": "350 mm", "Ventirad max": "160 mm"}',
 'Boîtier mesh budget très abordable de Silverstone. Pour les builders avec contraintes de budget strictes.',
 'https://www.silverstonetek.com/'),

('Boîtier', 'Thermaltake Tower 500', 'Thermaltake', 149, 129, 'ATX', 65, 2022,
 '{"Format": "ATX Mid-Tower", "Orientation": "Verticale 90°", "Fenêtre": "Verre trempé 360°", "GPU max": "400 mm", "Ventirad max": "180 mm"}',
 'Boîtier à orientation verticale unique avec vue 360° sur les composants. Design avant-gardiste.',
 'https://www.thermaltake.com/fr/'),

('Boîtier', 'InWin 303 C', 'InWin', 119, 99, 'ATX', 58, 2021,
 '{"Format": "ATX Mid-Tower", "Façade": "Acier brossé", "Fenêtre": "Verre trempé", "GPU max": "380 mm", "Ventirad max": "160 mm", "USB-C": "Oui"}',
 'Boîtier InWin au design épuré façade acier brossé. Qualité de finition premium à prix modéré.',
 'https://www.inwin-style.com/fr/'),

('Boîtier', 'Asus Prime AP201', 'ASUS', 89, 75, 'mATX', 72, 2022,
 '{"Format": "mATX Mid-Tower", "Couleur": "Blanc", "Fenêtre": "Verre trempé", "GPU max": "338 mm", "Ventirad max": "148 mm", "USB-C": "Oui"}',
 'Boîtier mATX blanc compact ASUS avec USB-C en façade. Idéal pour les builds compacts blancs esthétiques.',
 'https://www.asus.com/fr/')

ON CONFLICT (name) DO NOTHING;

-- ══════════════════════════════════════
-- Refroidissement (15 nouveaux)
-- ══════════════════════════════════════
INSERT INTO components (type, name, brand, price_ch, price_fr, socket, tdp, popularity_score, release_year, specs, description, manufacturer_url) VALUES

('Refroidissement', 'Noctua NH-D15S', 'Noctua', 89, 79, 'AM4/AM5/LGA1700', 250, 85, 2015,
 '{"Type": "Ventirad double tour asymétrique", "TDP supporté": "250W", "Niveau sonore": "24.6 dBA", "Ventilateurs": "1x NF-A15 140mm", "Hauteur": "160 mm", "Compatibilité RAM": "Meilleure"}',
 'Version asymétrique du NH-D15 avec un seul ventilateur. Meilleure compatibilité RAM pour les kits hauts.',
 'https://noctua.at/fr/'),

('Refroidissement', 'Noctua NH-U12A', 'Noctua', 99, 89, 'AM4/AM5/LGA1700', 220, 82, 2019,
 '{"Type": "Ventirad tour 120mm", "TDP supporté": "220W", "Niveau sonore": "22.6 dBA", "Ventilateurs": "2x NF-A12x25 120mm", "Hauteur": "158 mm"}',
 'Le ventirad 120mm ultime de Noctua avec double ventilateur. Performances proches du NH-D15 en 120mm.',
 'https://noctua.at/fr/'),

('Refroidissement', 'be quiet! Dark Rock 4', 'be quiet!', 69, 59, 'AM4/AM5/LGA1700', 200, 78, 2018,
 '{"Type": "Ventirad tour single", "TDP supporté": "200W", "Niveau sonore": "21.4 dBA", "Ventilateurs": "1x Silent Wings 135mm", "Hauteur": "163 mm"}',
 'Ventirad single tower silencieux de be quiet!. Le choix parfait pour les builds discrets milieu de gamme.',
 'https://www.bequiet.com/fr/'),

('Refroidissement', 'be quiet! Dark Rock Slim', 'be quiet!', 55, 47, 'AM4/AM5/LGA1700', 180, 72, 2019,
 '{"Type": "Ventirad slim profil bas", "TDP supporté": "180W", "Niveau sonore": "23.8 dBA", "Ventilateurs": "1x Silent Wings 135mm", "Hauteur": "157 mm", "Largeur": "43 mm"}',
 'Ventirad slim be quiet! pour les boîtiers avec espace limité. Silencieux et efficace malgré son profil bas.',
 'https://www.bequiet.com/fr/'),

('Refroidissement', 'Corsair iCUE H150i RGB', 'Corsair', 179, 159, 'AM4/AM5/LGA1700', 400, 80, 2023,
 '{"Type": "AIO 360mm", "TDP supporté": "400W+", "Niveau sonore": "33 dBA max", "Ventilateurs": "3x 120mm RGB", "Radiateur": "360mm", "Pompe": "RGB ARGB"}',
 'Watercooling AIO 360mm premium avec contrôle intelligent via iCUE. Pour les processeurs très énergétiques.',
 'https://www.corsair.com/fr/fr/'),

('Refroidissement', 'Corsair iCUE H115i RGB', 'Corsair', 149, 129, 'AM4/AM5/LGA1700', 350, 75, 2023,
 '{"Type": "AIO 280mm", "TDP supporté": "350W", "Niveau sonore": "31 dBA max", "Ventilateurs": "2x 140mm RGB", "Radiateur": "280mm"}',
 'AIO 280mm Corsair avec ventilateurs 140mm silencieux. Bon compromis performance/bruit par rapport au 360mm.',
 'https://www.corsair.com/fr/fr/'),

('Refroidissement', 'NZXT Kraken X63', 'NZXT', 149, 129, 'AM4/AM5/LGA1700', 350, 78, 2021,
 '{"Type": "AIO 280mm", "TDP supporté": "350W", "Niveau sonore": "30 dBA", "Ventilateurs": "2x 140mm", "Radiateur": "280mm", "Tête de pompe": "OLED display"}',
 'AIO 280mm NZXT avec écran OLED sur la tête de pompe. Équilibre parfait entre performances et esthétique.',
 'https://nzxt.com/'),

('Refroidissement', 'NZXT Kraken Elite 360', 'NZXT', 229, 199, 'AM4/AM5/LGA1700', 400, 72, 2023,
 '{"Type": "AIO 360mm", "TDP supporté": "400W+", "Niveau sonore": "35 dBA max", "Ventilateurs": "3x 120mm", "Radiateur": "360mm", "Tête de pompe": "LCD couleur"}',
 'AIO 360mm premium NZXT avec écran LCD couleur sur la tête de pompe. Personnalisation et performances au maximum.',
 'https://nzxt.com/'),

('Refroidissement', 'DeepCool AK620', 'Deepcool', 59, 49, 'AM4/AM5/LGA1700', 260, 85, 2022,
 '{"Type": "Ventirad double tour", "TDP supporté": "260W", "Niveau sonore": "28 dBA", "Ventilateurs": "2x 120mm", "Hauteur": "160 mm"}',
 'Ventirad double tour très performant de DeepCool à prix imbattable. Concurrent direct du NH-D15 à moitié prix.',
 'https://www.deepcool.com/fr/'),

('Refroidissement', 'DeepCool LT720', 'Deepcool', 129, 109, 'AM4/AM5/LGA1700', 400, 75, 2023,
 '{"Type": "AIO 360mm", "TDP supporté": "400W+", "Niveau sonore": "31.4 dBA", "Ventilateurs": "3x 120mm ARGB", "Radiateur": "360mm", "Tête de pompe": "Anti-leak"}',
 'AIO 360mm DeepCool avec système anti-fuite et tête de pompe ARGB. Rapport qualité/prix excellent.',
 'https://www.deepcool.com/fr/'),

('Refroidissement', 'Thermalright Peerless Assassin 120', 'Thermalright', 39, 33, 'AM4/AM5/LGA1700', 260, 88, 2022,
 '{"Type": "Ventirad double tour", "TDP supporté": "260W", "Niveau sonore": "25.6 dBA", "Ventilateurs": "2x TL-C12 120mm", "Hauteur": "155 mm"}',
 'Le meilleur rapport qualité/prix du marché des ventirad. Performances doubles tours à prix mini tour.',
 'https://www.thermalright.com/'),

('Refroidissement', 'ID-Cooling SE-224-XT', 'ID-Cooling', 25, 20, 'AM4/AM5/LGA1700', 180, 72, 2022,
 '{"Type": "Ventirad tour", "TDP supporté": "180W", "Niveau sonore": "30 dBA", "Ventilateurs": "1x 120mm", "Hauteur": "155 mm"}',
 'Ventirad ultra-budget pour entrée de gamme. Suffisant pour les Core i3 et Ryzen 5 non overclockés.',
 'https://www.idcooling.com/'),

('Refroidissement', 'Cooler Master Hyper 212 EVO V2', 'Cooler Master', 35, 29, 'AM4/AM5/LGA1700', 180, 75, 2021,
 '{"Type": "Ventirad tour", "TDP supporté": "180W", "Niveau sonore": "26 dBA", "Ventilateurs": "1x 120mm PWM", "Hauteur": "158.8 mm"}',
 'La version V2 du légendaire Hyper 212. Un classique budget modernisé avec meilleure compatibilité AM5.',
 'https://www.coolermaster.com/fr/'),

('Refroidissement', 'EK-AIO 360 D-RGB', 'EK Water Blocks', 189, 165, 'AM4/AM5/LGA1700', 400, 70, 2022,
 '{"Type": "AIO 360mm", "TDP supporté": "400W+", "Niveau sonore": "32 dBA", "Ventilateurs": "3x 120mm D-RGB", "Radiateur": "360mm", "Marque": "EK Premium"}',
 'AIO premium de EK Water Blocks, référence en watercooling custom. Qualité de fabrication supérieure.',
 'https://www.ekwb.com/fr/'),

('Refroidissement', 'Scythe Fuma 3', 'Scythe', 65, 55, 'AM4/AM5/LGA1700', 240, 72, 2024,
 '{"Type": "Ventirad double tour asymétrique", "TDP supporté": "240W", "Niveau sonore": "23.8 dBA", "Ventilateurs": "2x Kaze Flex II 120mm", "Hauteur": "154 mm"}',
 'Ventirad double tour japonais de Scythe avec excellent rapport performances/silence. Compatible RAM haute tour.',
 'https://www.scythe-europe.com/')

ON CONFLICT (name) DO NOTHING;
