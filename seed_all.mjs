import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gxremrjbwtnmiiiujjem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cmVtcmpid3RubWlpaXVqamVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NzkzMCwiZXhwIjoyMDkwNjIzOTMwfQ.ynksSlAEHy-xKdiI6o11s_Qe02ojLmQexQiYuLcm6EQ'
);

const products = [
  // ── GPUs ──
  {type:'GPU',name:'NVIDIA GeForce RTX 4060',brand:'NVIDIA',description:'Carte graphique 1080p performante et efficace',specs:{"VRAM":"8 GB GDDR6","Architecture":"Ada Lovelace","TDP":"115W","Interface":"PCIe 4.0"},price_ch:299,price_fr:0,tdp:115,release_year:2023,popularity_score:92,available_ch:true,active:true},
  {type:'GPU',name:'NVIDIA GeForce RTX 4060 Ti',brand:'NVIDIA',description:'Excellente carte 1080p/1440p',specs:{"VRAM":"8 GB GDDR6","Architecture":"Ada Lovelace","TDP":"160W","Boost Clock":"2535 MHz"},price_ch:419,price_fr:0,tdp:160,release_year:2023,popularity_score:94,available_ch:true,active:true},
  {type:'GPU',name:'NVIDIA GeForce RTX 4070',brand:'NVIDIA',description:'Carte 1440p haut de gamme efficace',specs:{"VRAM":"12 GB GDDR6X","Architecture":"Ada Lovelace","TDP":"200W","Boost Clock":"2475 MHz"},price_ch:549,price_fr:0,tdp:200,release_year:2023,popularity_score:93,available_ch:true,active:true},
  {type:'GPU',name:'NVIDIA GeForce RTX 4070 Ti Super',brand:'NVIDIA',description:'Carte 1440p/4K performante',specs:{"VRAM":"16 GB GDDR6X","Architecture":"Ada Lovelace","TDP":"285W","Boost Clock":"2610 MHz"},price_ch:799,price_fr:0,tdp:285,release_year:2024,popularity_score:90,available_ch:true,active:true},
  {type:'GPU',name:'NVIDIA GeForce RTX 4080 Super',brand:'NVIDIA',description:'Carte 4K haut de gamme',specs:{"VRAM":"16 GB GDDR6X","Architecture":"Ada Lovelace","TDP":"320W","Boost Clock":"2550 MHz"},price_ch:999,price_fr:0,tdp:320,release_year:2024,popularity_score:85,available_ch:true,active:true},
  {type:'GPU',name:'NVIDIA GeForce RTX 4090',brand:'NVIDIA',description:'La carte la plus puissante du marché',specs:{"VRAM":"24 GB GDDR6X","Architecture":"Ada Lovelace","TDP":"450W","Boost Clock":"2520 MHz"},price_ch:1799,price_fr:0,tdp:450,release_year:2022,popularity_score:82,available_ch:true,active:true},
  {type:'GPU',name:'AMD Radeon RX 7600',brand:'AMD',description:'Carte 1080p abordable RDNA 3',specs:{"VRAM":"8 GB GDDR6","Architecture":"RDNA 3","TDP":"165W","Stream Processors":"2048"},price_ch:259,price_fr:0,tdp:165,release_year:2023,popularity_score:82,available_ch:true,active:true},
  {type:'GPU',name:'AMD Radeon RX 7700 XT',brand:'AMD',description:'Carte 1440p milieu de gamme',specs:{"VRAM":"12 GB GDDR6","Architecture":"RDNA 3","TDP":"245W","Stream Processors":"3456"},price_ch:399,price_fr:0,tdp:245,release_year:2023,popularity_score:84,available_ch:true,active:true},
  {type:'GPU',name:'AMD Radeon RX 7800 XT',brand:'AMD',description:'Excellente carte 1440p rapport qualité/prix',specs:{"VRAM":"16 GB GDDR6","Architecture":"RDNA 3","TDP":"263W","Stream Processors":"3840"},price_ch:479,price_fr:0,tdp:263,release_year:2023,popularity_score:88,available_ch:true,active:true},
  {type:'GPU',name:'AMD Radeon RX 7900 XTX',brand:'AMD',description:'Flagship AMD pour le 4K',specs:{"VRAM":"24 GB GDDR6","Architecture":"RDNA 3","TDP":"355W","Stream Processors":"6144"},price_ch:899,price_fr:0,tdp:355,release_year:2023,popularity_score:80,available_ch:true,active:true},

  // ── RAM ──
  {type:'RAM',name:'Corsair Vengeance DDR5-5600 32 GB (2x16)',brand:'Corsair',description:'Kit DDR5 32 GB performant pour gaming',specs:{"Type":"DDR5","Fréquence":"5600 MHz","Latence CL":"36","Capacité":"32 GB (2x16 GB)"},price_ch:109,price_fr:0,release_year:2023,popularity_score:94,available_ch:true,active:true},
  {type:'RAM',name:'G.Skill Trident Z5 DDR5-6000 32 GB (2x16)',brand:'G.Skill',description:'RAM haute performance DDR5 avec RGB',specs:{"Type":"DDR5","Fréquence":"6000 MHz","Latence CL":"30","Capacité":"32 GB (2x16 GB)"},price_ch:149,price_fr:0,release_year:2023,popularity_score:90,available_ch:true,active:true},
  {type:'RAM',name:'Kingston Fury Beast DDR5-5200 32 GB (2x16)',brand:'Kingston',description:'Kit DDR5 fiable et abordable',specs:{"Type":"DDR5","Fréquence":"5200 MHz","Latence CL":"40","Capacité":"32 GB (2x16 GB)"},price_ch:89,price_fr:0,release_year:2023,popularity_score:86,available_ch:true,active:true},
  {type:'RAM',name:'Corsair Vengeance DDR5-5600 16 GB (2x8)',brand:'Corsair',description:'Kit DDR5 16 GB pour configs budget',specs:{"Type":"DDR5","Fréquence":"5600 MHz","Latence CL":"36","Capacité":"16 GB (2x8 GB)"},price_ch:59,price_fr:0,release_year:2023,popularity_score:82,available_ch:true,active:true},
  {type:'RAM',name:'G.Skill Flare X5 DDR5-6000 32 GB (2x16)',brand:'G.Skill',description:'RAM optimisée AMD EXPO',specs:{"Type":"DDR5","Fréquence":"6000 MHz","Latence CL":"36","Capacité":"32 GB (2x16 GB)","Profil":"AMD EXPO"},price_ch:129,price_fr:0,release_year:2023,popularity_score:87,available_ch:true,active:true},
  {type:'RAM',name:'Kingston Fury Beast DDR4-3200 32 GB (2x16)',brand:'Kingston',description:'Kit DDR4 pour plateformes AM4/LGA1200',specs:{"Type":"DDR4","Fréquence":"3200 MHz","Latence CL":"16","Capacité":"32 GB (2x16 GB)"},price_ch:69,price_fr:0,release_year:2021,popularity_score:78,available_ch:true,active:true},

  // ── Stockage ──
  {type:'Stockage',name:'Samsung 990 Pro 1 TB',brand:'Samsung',description:'SSD NVMe Gen4 ultra-rapide',specs:{"Capacité":"1 TB","Interface":"NVMe PCIe 4.0","Lecture séq.":"7450 MB/s","Écriture séq.":"6900 MB/s"},price_ch:109,price_fr:0,form_factor:'M.2 2280',release_year:2022,popularity_score:95,available_ch:true,active:true},
  {type:'Stockage',name:'Samsung 990 Pro 2 TB',brand:'Samsung',description:'SSD NVMe Gen4 2 TB haute performance',specs:{"Capacité":"2 TB","Interface":"NVMe PCIe 4.0","Lecture séq.":"7450 MB/s","Écriture séq.":"6900 MB/s"},price_ch:179,price_fr:0,form_factor:'M.2 2280',release_year:2022,popularity_score:90,available_ch:true,active:true},
  {type:'Stockage',name:'WD Black SN850X 1 TB',brand:'Western Digital',description:'SSD gaming NVMe Gen4 performant',specs:{"Capacité":"1 TB","Interface":"NVMe PCIe 4.0","Lecture séq.":"7300 MB/s","Écriture séq.":"6300 MB/s"},price_ch:89,price_fr:0,form_factor:'M.2 2280',release_year:2022,popularity_score:92,available_ch:true,active:true},
  {type:'Stockage',name:'WD Black SN850X 2 TB',brand:'Western Digital',description:'SSD gaming 2 TB',specs:{"Capacité":"2 TB","Interface":"NVMe PCIe 4.0","Lecture séq.":"7300 MB/s","Écriture séq.":"6600 MB/s"},price_ch:159,price_fr:0,form_factor:'M.2 2280',release_year:2022,popularity_score:88,available_ch:true,active:true},
  {type:'Stockage',name:'Crucial T500 1 TB',brand:'Crucial',description:'SSD NVMe Gen5 nouvelle génération',specs:{"Capacité":"1 TB","Interface":"NVMe PCIe 5.0","Lecture séq.":"7300 MB/s","Écriture séq.":"6800 MB/s"},price_ch:99,price_fr:0,form_factor:'M.2 2280',release_year:2023,popularity_score:86,available_ch:true,active:true},
  {type:'Stockage',name:'Kingston NV2 1 TB',brand:'Kingston',description:'SSD NVMe budget bon rapport Q/P',specs:{"Capacité":"1 TB","Interface":"NVMe PCIe 4.0","Lecture séq.":"3500 MB/s","Écriture séq.":"2100 MB/s"},price_ch:59,price_fr:0,form_factor:'M.2 2280',release_year:2022,popularity_score:80,available_ch:true,active:true},

  // ── Cartes mères ──
  {type:'Carte mère',name:'MSI MAG B650 Tomahawk WiFi',brand:'MSI',description:'Carte mère AM5 milieu de gamme avec WiFi',specs:{"Socket":"AM5","Chipset":"B650","Format":"ATX","RAM max":"128 GB DDR5"},price_ch:219,price_fr:0,socket:'AM5',chipset:'B650',form_factor:'ATX',release_year:2022,popularity_score:92,available_ch:true,active:true},
  {type:'Carte mère',name:'ASUS ROG STRIX B650-A Gaming WiFi',brand:'ASUS',description:'Carte AM5 gaming avec WiFi 6E',specs:{"Socket":"AM5","Chipset":"B650","Format":"ATX","RAM max":"128 GB DDR5"},price_ch:249,price_fr:0,socket:'AM5',chipset:'B650',form_factor:'ATX',release_year:2022,popularity_score:90,available_ch:true,active:true},
  {type:'Carte mère',name:'Gigabyte B650 AORUS Elite AX',brand:'Gigabyte',description:'Carte AM5 performante et abordable',specs:{"Socket":"AM5","Chipset":"B650","Format":"ATX","RAM max":"128 GB DDR5"},price_ch:199,price_fr:0,socket:'AM5',chipset:'B650',form_factor:'ATX',release_year:2022,popularity_score:88,available_ch:true,active:true},
  {type:'Carte mère',name:'MSI MAG Z790 Tomahawk WiFi',brand:'MSI',description:'Carte LGA1700 haut de gamme Intel',specs:{"Socket":"LGA1700","Chipset":"Z790","Format":"ATX","RAM max":"128 GB DDR5"},price_ch:289,price_fr:0,socket:'LGA1700',chipset:'Z790',form_factor:'ATX',release_year:2022,popularity_score:88,available_ch:true,active:true},
  {type:'Carte mère',name:'ASUS TUF GAMING B760-PLUS WiFi',brand:'ASUS',description:'Carte Intel budget avec WiFi',specs:{"Socket":"LGA1700","Chipset":"B760","Format":"ATX","RAM max":"128 GB DDR5"},price_ch:169,price_fr:0,socket:'LGA1700',chipset:'B760',form_factor:'ATX',release_year:2023,popularity_score:86,available_ch:true,active:true},
  {type:'Carte mère',name:'MSI PRO B760M-A WiFi',brand:'MSI',description:'Carte mATX Intel compacte et abordable',specs:{"Socket":"LGA1700","Chipset":"B760","Format":"Micro-ATX","RAM max":"128 GB DDR5"},price_ch:139,price_fr:0,socket:'LGA1700',chipset:'B760',form_factor:'Micro-ATX',release_year:2023,popularity_score:84,available_ch:true,active:true},

  // ── Alimentations ──
  {type:'Alimentation',name:'Corsair RM850x',brand:'Corsair',description:'Alimentation 850W modulaire 80+ Gold',specs:{"Puissance":"850W","Certification 80+":"Gold","Modulaire":"Oui","Ventilateur":"135mm Zero RPM"},price_ch:139,price_fr:0,release_year:2023,popularity_score:94,available_ch:true,active:true},
  {type:'Alimentation',name:'Corsair RM750x',brand:'Corsair',description:'Alimentation 750W modulaire 80+ Gold',specs:{"Puissance":"750W","Certification 80+":"Gold","Modulaire":"Oui"},price_ch:109,price_fr:0,release_year:2023,popularity_score:90,available_ch:true,active:true},
  {type:'Alimentation',name:'be quiet! Pure Power 12 M 850W',brand:'be quiet!',description:'850W silencieuse et modulaire',specs:{"Puissance":"850W","Certification 80+":"Gold","Modulaire":"Oui","Ventilateur":"120mm"},price_ch:129,price_fr:0,release_year:2023,popularity_score:88,available_ch:true,active:true},
  {type:'Alimentation',name:'Seasonic Focus GX-850',brand:'Seasonic',description:'850W fiable et modulaire',specs:{"Puissance":"850W","Certification 80+":"Gold","Modulaire":"Oui"},price_ch:139,price_fr:0,release_year:2022,popularity_score:86,available_ch:true,active:true},
  {type:'Alimentation',name:'be quiet! Straight Power 12 1000W',brand:'be quiet!',description:'1000W pour configs haut de gamme',specs:{"Puissance":"1000W","Certification 80+":"Platinum","Modulaire":"Oui"},price_ch:199,price_fr:0,release_year:2023,popularity_score:84,available_ch:true,active:true},
  {type:'Alimentation',name:'Corsair RM1000x',brand:'Corsair',description:'1000W pour RTX 4090 et configs extrêmes',specs:{"Puissance":"1000W","Certification 80+":"Gold","Modulaire":"Oui"},price_ch:179,price_fr:0,release_year:2023,popularity_score:82,available_ch:true,active:true},

  // ── Boîtiers ──
  {type:'Boîtier',name:'Fractal Design North',brand:'Fractal Design',description:'Boîtier élégant avec façade bois et mesh',specs:{"Format":"ATX","GPU max":"355 mm","Ventirad max":"170 mm","Fenêtre latérale":"Verre trempé"},price_ch:139,price_fr:0,form_factor:'ATX',release_year:2023,popularity_score:94,available_ch:true,active:true},
  {type:'Boîtier',name:'NZXT H7 Flow',brand:'NZXT',description:'Boîtier airflow gaming moderne',specs:{"Format":"ATX","GPU max":"400 mm","Ventirad max":"185 mm","Fenêtre latérale":"Verre trempé"},price_ch:129,price_fr:0,form_factor:'ATX',release_year:2023,popularity_score:90,available_ch:true,active:true},
  {type:'Boîtier',name:'Corsair 4000D Airflow',brand:'Corsair',description:'Boîtier airflow populaire et abordable',specs:{"Format":"ATX","GPU max":"360 mm","Ventirad max":"170 mm","Fenêtre latérale":"Verre trempé"},price_ch:99,price_fr:0,form_factor:'ATX',release_year:2021,popularity_score:92,available_ch:true,active:true},
  {type:'Boîtier',name:'Lian Li Lancool II Mesh',brand:'Lian Li',description:'Excellent airflow et modularité',specs:{"Format":"ATX","GPU max":"384 mm","Ventirad max":"176 mm","Fenêtre latérale":"Verre trempé"},price_ch:109,price_fr:0,form_factor:'ATX',release_year:2021,popularity_score:88,available_ch:true,active:true},
  {type:'Boîtier',name:'be quiet! Pure Base 500DX',brand:'be quiet!',description:'Boîtier silencieux avec bon airflow',specs:{"Format":"ATX","GPU max":"369 mm","Ventirad max":"190 mm","Fenêtre latérale":"Verre trempé"},price_ch:109,price_fr:0,form_factor:'ATX',release_year:2020,popularity_score:86,available_ch:true,active:true},
  {type:'Boîtier',name:'Fractal Design Pop Air',brand:'Fractal Design',description:'Boîtier compact et abordable',specs:{"Format":"ATX","GPU max":"405 mm","Ventirad max":"170 mm"},price_ch:79,price_fr:0,form_factor:'ATX',release_year:2022,popularity_score:84,available_ch:true,active:true},

  // ── Refroidissement ──
  {type:'Refroidissement',name:'Noctua NH-D15',brand:'Noctua',description:'Ventirad haut de gamme double tour',specs:{"Type":"Ventirad","TDP supporté":"250W","Niveau sonore":"24.6 dBA","Ventilateurs":"2x 140mm"},price_ch:99,price_fr:0,tdp:250,release_year:2014,popularity_score:96,available_ch:true,active:true},
  {type:'Refroidissement',name:'be quiet! Dark Rock Pro 5',brand:'be quiet!',description:'Ventirad silencieux haute performance',specs:{"Type":"Ventirad","TDP supporté":"270W","Niveau sonore":"24.3 dBA","Ventilateurs":"1x 120mm + 1x 135mm"},price_ch:89,price_fr:0,tdp:270,release_year:2023,popularity_score:92,available_ch:true,active:true},
  {type:'Refroidissement',name:'Corsair iCUE H150i Elite',brand:'Corsair',description:'AIO 360mm RGB performant',specs:{"Type":"AIO 360mm","TDP supporté":"350W","Niveau sonore":"30 dBA","Ventilateurs":"3x 120mm RGB"},price_ch:169,price_fr:0,tdp:350,release_year:2023,popularity_score:88,available_ch:true,active:true},
  {type:'Refroidissement',name:'ARCTIC Liquid Freezer II 360',brand:'ARCTIC',description:'AIO 360mm excellent rapport Q/P',specs:{"Type":"AIO 360mm","TDP supporté":"350W","Niveau sonore":"22.5 dBA","Ventilateurs":"3x 120mm"},price_ch:99,price_fr:0,tdp:350,release_year:2020,popularity_score:90,available_ch:true,active:true},
  {type:'Refroidissement',name:'DeepCool AK620',brand:'DeepCool',description:'Ventirad double tour abordable',specs:{"Type":"Ventirad","TDP supporté":"260W","Niveau sonore":"28 dBA","Ventilateurs":"2x 120mm"},price_ch:59,price_fr:0,tdp:260,release_year:2022,popularity_score:86,available_ch:true,active:true},
  {type:'Refroidissement',name:'Noctua NH-U12S',brand:'Noctua',description:'Ventirad compact et silencieux',specs:{"Type":"Ventirad","TDP supporté":"180W","Niveau sonore":"22.4 dBA","Ventilateurs":"1x 120mm"},price_ch:69,price_fr:0,tdp:180,release_year:2013,popularity_score:84,available_ch:true,active:true},

  // ── Moniteurs ──
  {type:'Moniteur',name:'ASUS ROG Swift PG27AQN',brand:'ASUS',description:'Moniteur gaming 27" 1440p 360Hz IPS',specs:{"Taille":"27 pouces","Résolution":"2560x1440","Taux rafraîchissement":"360 Hz","Dalle":"IPS","Temps réponse":"1ms"},price_ch:899,price_fr:0,form_factor:'27 pouces',release_year:2023,popularity_score:85,available_ch:true,active:true},
  {type:'Moniteur',name:'Samsung Odyssey G5 27" 1440p',brand:'Samsung',description:'Écran gaming 27" 1440p 165Hz VA',specs:{"Taille":"27 pouces","Résolution":"2560x1440","Taux rafraîchissement":"165 Hz","Dalle":"VA","Temps réponse":"1ms","Courbure":"1000R"},price_ch:249,price_fr:0,form_factor:'27 pouces',release_year:2023,popularity_score:90,available_ch:true,active:true},
  {type:'Moniteur',name:'LG 27GP850-B UltraGear',brand:'LG',description:'Moniteur gaming 27" 1440p 165Hz Nano IPS',specs:{"Taille":"27 pouces","Résolution":"2560x1440","Taux rafraîchissement":"165 Hz","Dalle":"Nano IPS","Temps réponse":"1ms"},price_ch:299,price_fr:0,form_factor:'27 pouces',release_year:2021,popularity_score:92,available_ch:true,active:true},
  {type:'Moniteur',name:'Dell S2722DGM',brand:'Dell',description:'Écran gaming 27" 1440p 165Hz incurvé',specs:{"Taille":"27 pouces","Résolution":"2560x1440","Taux rafraîchissement":"165 Hz","Dalle":"VA","Courbure":"1500R"},price_ch:229,price_fr:0,form_factor:'27 pouces',release_year:2022,popularity_score:88,available_ch:true,active:true},
  {type:'Moniteur',name:'ASUS VG27AQ1A',brand:'ASUS',description:'Moniteur gaming 27" 1440p 170Hz',specs:{"Taille":"27 pouces","Résolution":"2560x1440","Taux rafraîchissement":"170 Hz","Dalle":"IPS","Temps réponse":"1ms"},price_ch:269,price_fr:0,form_factor:'27 pouces',release_year:2021,popularity_score:86,available_ch:true,active:true},
  {type:'Moniteur',name:'BenQ MOBIUZ EX2710Q',brand:'BenQ',description:'Moniteur gaming 27" 1440p 165Hz HDRi',specs:{"Taille":"27 pouces","Résolution":"2560x1440","Taux rafraîchissement":"165 Hz","Dalle":"IPS","HDR":"HDRi"},price_ch:349,price_fr:0,form_factor:'27 pouces',release_year:2022,popularity_score:84,available_ch:true,active:true},

  // ── Claviers ──
  {type:'Clavier',name:'Razer BlackWidow V4',brand:'Razer',description:'Clavier mécanique gaming RGB',specs:{"Type":"Mécanique","Switches":"Razer Green","Rétroéclairage":"RGB Chroma","Layout":"CH/FR","Repose-poignet":"Oui"},price_ch:169,price_fr:0,release_year:2023,popularity_score:92,available_ch:true,active:true},
  {type:'Clavier',name:'Corsair K70 RGB Pro',brand:'Corsair',description:'Clavier mécanique gaming premium',specs:{"Type":"Mécanique","Switches":"Cherry MX Red","Rétroéclairage":"RGB","Layout":"CH","Cadre":"Aluminium"},price_ch:149,price_fr:0,release_year:2022,popularity_score:90,available_ch:true,active:true},
  {type:'Clavier',name:'SteelSeries Apex Pro',brand:'SteelSeries',description:'Clavier avec switches magnétiques ajustables',specs:{"Type":"Mécanique","Switches":"OmniPoint 2.0","Rétroéclairage":"RGB","Layout":"CH","Actuation":"Ajustable 0.2-3.8mm"},price_ch:199,price_fr:0,release_year:2023,popularity_score:88,available_ch:true,active:true},
  {type:'Clavier',name:'Logitech G Pro X',brand:'Logitech',description:'Clavier compact gaming sans fil',specs:{"Type":"Mécanique","Switches":"GX Blue/Brown/Red","Rétroéclairage":"RGB","Format":"TKL","Connexion":"Sans fil Lightspeed"},price_ch:129,price_fr:0,release_year:2022,popularity_score:86,available_ch:true,active:true},
  {type:'Clavier',name:'ASUS ROG Strix Scope II',brand:'ASUS',description:'Clavier gaming mécanique 96%',specs:{"Type":"Mécanique","Switches":"ROG NX Snow","Rétroéclairage":"RGB","Format":"96%"},price_ch:139,price_fr:0,release_year:2023,popularity_score:84,available_ch:true,active:true},
  {type:'Clavier',name:'HyperX Alloy Origins',brand:'HyperX',description:'Clavier mécanique compact et solide',specs:{"Type":"Mécanique","Switches":"HyperX Red","Rétroéclairage":"RGB","Cadre":"Aluminium"},price_ch:89,price_fr:0,release_year:2021,popularity_score:82,available_ch:true,active:true},

  // ── Souris ──
  {type:'Souris',name:'Razer DeathAdder V3',brand:'Razer',description:'Souris gaming ergonomique ultra-légère',specs:{"Capteur":"Focus Pro 30K","DPI max":"30000","Poids":"59g","Connexion":"Filaire","Boutons":"5"},price_ch:89,price_fr:0,release_year:2023,popularity_score:92,available_ch:true,active:true},
  {type:'Souris',name:'Logitech G Pro X Superlight 2',brand:'Logitech',description:'Souris gaming sans fil ultra-légère pro',specs:{"Capteur":"HERO 2","DPI max":"32000","Poids":"60g","Connexion":"Lightspeed sans fil","Autonomie":"95h"},price_ch:149,price_fr:0,release_year:2023,popularity_score:96,available_ch:true,active:true},
  {type:'Souris',name:'SteelSeries Aerox 5',brand:'SteelSeries',description:'Souris gaming légère multi-genre',specs:{"Capteur":"TrueMove Air","DPI max":"18000","Poids":"66g","Connexion":"Filaire","Boutons":"9"},price_ch:69,price_fr:0,release_year:2022,popularity_score:84,available_ch:true,active:true},
  {type:'Souris',name:'Razer Viper V3 Pro',brand:'Razer',description:'Souris esport sans fil premium',specs:{"Capteur":"Focus Pro 30K Gen2","DPI max":"35000","Poids":"54g","Connexion":"HyperSpeed sans fil","Autonomie":"95h"},price_ch:169,price_fr:0,release_year:2024,popularity_score:90,available_ch:true,active:true},
  {type:'Souris',name:'Corsair M75 Air',brand:'Corsair',description:'Souris sans fil légère et précise',specs:{"Capteur":"Marksman 26K","DPI max":"26000","Poids":"60g","Connexion":"SLIPSTREAM sans fil","Autonomie":"100h"},price_ch:99,price_fr:0,release_year:2024,popularity_score:86,available_ch:true,active:true},
  {type:'Souris',name:'Zowie EC2',brand:'Zowie',description:'Souris gaming esport ergonomique',specs:{"Capteur":"3360","DPI max":"3200","Poids":"90g","Connexion":"Filaire","Boutons":"5"},price_ch:69,price_fr:0,release_year:2019,popularity_score:80,available_ch:true,active:true},

  // ── Casques ──
  {type:'Casque',name:'SteelSeries Arctis Nova 7',brand:'SteelSeries',description:'Casque gaming sans fil multi-plateforme',specs:{"Type":"Circum-auriculaire","Connexion":"2.4 GHz + Bluetooth","Autonomie":"38h","Micro":"Rétractable ClearCast Gen 2","Poids":"236g"},price_ch:179,price_fr:0,release_year:2023,popularity_score:94,available_ch:true,active:true},
  {type:'Casque',name:'Corsair HS80 RGB Wireless',brand:'Corsair',description:'Casque gaming sans fil avec son spatial',specs:{"Type":"Circum-auriculaire","Connexion":"SLIPSTREAM 2.4 GHz","Autonomie":"20h","Micro":"Omnidirectionnel","Son spatial":"Dolby Atmos"},price_ch:139,price_fr:0,release_year:2022,popularity_score:88,available_ch:true,active:true},
  {type:'Casque',name:'HyperX Cloud III Wireless',brand:'HyperX',description:'Casque gaming sans fil confortable',specs:{"Type":"Circum-auriculaire","Connexion":"2.4 GHz","Autonomie":"120h","Micro":"Détachable","Poids":"330g"},price_ch:149,price_fr:0,release_year:2023,popularity_score:90,available_ch:true,active:true},
  {type:'Casque',name:'Razer BlackShark V2 Pro',brand:'Razer',description:'Casque gaming esport sans fil',specs:{"Type":"Circum-auriculaire","Connexion":"HyperSpeed 2.4 GHz + Bluetooth","Autonomie":"70h","Micro":"Détachable HyperClear Super","Son spatial":"THX"},price_ch:169,price_fr:0,release_year:2023,popularity_score:92,available_ch:true,active:true},
  {type:'Casque',name:'ASUS ROG Delta S',brand:'ASUS',description:'Casque gaming USB-C avec DAC intégré',specs:{"Type":"Circum-auriculaire","Connexion":"USB-C / 3.5mm","Micro":"AI Noise Cancelling","Son":"Hi-Res Audio","Poids":"300g"},price_ch:159,price_fr:0,release_year:2021,popularity_score:84,available_ch:true,active:true},
  {type:'Casque',name:'Logitech G PRO X 2',brand:'Logitech',description:'Casque gaming esport sans fil premium',specs:{"Type":"Circum-auriculaire","Connexion":"Lightspeed + Bluetooth","Autonomie":"50h","Micro":"Détachable Blue VO!CE","Poids":"309g"},price_ch:229,price_fr:0,release_year:2023,popularity_score:86,available_ch:true,active:true},

  // ── Chaises gaming ──
  {type:'Chaise gaming',name:'Secretlab Titan Evo 2024',brand:'Secretlab',description:'Chaise gaming premium ergonomique',specs:{"Matériau":"NEO Hybrid Leatherette","Support lombaire":"Intégré réglable 4 directions","Accoudoirs":"4D","Inclinaison":"165°","Poids max":"130 kg"},price_ch:499,price_fr:0,release_year:2024,popularity_score:96,available_ch:true,active:true},
  {type:'Chaise gaming',name:'noblechairs HERO',brand:'noblechairs',description:'Chaise gaming haut de gamme allemande',specs:{"Matériau":"PU Leather","Support lombaire":"Intégré ajustable","Accoudoirs":"4D","Inclinaison":"125°","Poids max":"150 kg"},price_ch:449,price_fr:0,release_year:2022,popularity_score:88,available_ch:true,active:true},
  {type:'Chaise gaming',name:'Corsair TC200',brand:'Corsair',description:'Chaise gaming confortable et abordable',specs:{"Matériau":"Tissu respirant","Support lombaire":"Coussin externe","Accoudoirs":"4D","Inclinaison":"160°","Poids max":"120 kg"},price_ch:299,price_fr:0,release_year:2023,popularity_score:84,available_ch:true,active:true},
  {type:'Chaise gaming',name:'IKEA Markus',brand:'IKEA',description:'Chaise ergonomique bureau/gaming budget',specs:{"Matériau":"Tissu mesh","Support lombaire":"Intégré","Accoudoirs":"Non réglables","Inclinaison":"Oui","Garantie":"10 ans"},price_ch:199,price_fr:0,release_year:2020,popularity_score:82,available_ch:true,active:true},

  // ── Tapis de souris ──
  {type:'Tapis de souris',name:'SteelSeries QcK Heavy XXL',brand:'SteelSeries',description:'Tapis gaming XXL 6mm épaisseur',specs:{"Taille":"900x400x6 mm","Surface":"Tissu micro-texturé","Base":"Caoutchouc antidérapant","Épaisseur":"6mm"},price_ch:39,price_fr:0,release_year:2020,popularity_score:92,available_ch:true,active:true},
  {type:'Tapis de souris',name:'Razer Gigantus V2 XXL',brand:'Razer',description:'Tapis gaming XXL optimisé pour capteurs',specs:{"Taille":"940x410x4 mm","Surface":"Tissu texturé","Base":"Caoutchouc antidérapant","Épaisseur":"4mm"},price_ch:29,price_fr:0,release_year:2021,popularity_score:90,available_ch:true,active:true},
  {type:'Tapis de souris',name:'Corsair MM700 RGB',brand:'Corsair',description:'Tapis gaming XL avec éclairage RGB',specs:{"Taille":"930x400x4 mm","Surface":"Tissu micro-texturé","Base":"Caoutchouc","RGB":"Oui","USB Passthrough":"Oui"},price_ch:59,price_fr:0,release_year:2021,popularity_score:86,available_ch:true,active:true},
  {type:'Tapis de souris',name:'Logitech G840 XL',brand:'Logitech',description:'Tapis gaming XL texture uniforme',specs:{"Taille":"900x400x3 mm","Surface":"Tissu","Base":"Caoutchouc naturel","Épaisseur":"3mm"},price_ch:49,price_fr:0,release_year:2020,popularity_score:84,available_ch:true,active:true},
];

async function run() {
  console.log(`Upserting ${products.length} products...`);

  // Batch by 20
  let ok = 0, err = 0;
  for (let i = 0; i < products.length; i += 20) {
    const batch = products.slice(i, i + 20);
    const { error } = await supabase.from('components').upsert(batch, { onConflict: 'name' });
    if (error) {
      console.error(`Batch ${i}: ${error.message}`);
      err += batch.length;
    } else {
      ok += batch.length;
      console.log(`Batch ${i}: ${batch.length} OK`);
    }
  }
  console.log(`\nDone! Success: ${ok}, Errors: ${err}, Total: ${products.length}`);
}

run();
