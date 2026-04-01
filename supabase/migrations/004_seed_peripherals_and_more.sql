-- Migration 004: Add peripheral types + Seed peripherals and additional components
-- Real specs, real Swiss prices (CHF) from Galaxus/Digitec as of early 2025

-- First, update the CHECK constraint to allow peripheral types
ALTER TABLE components DROP CONSTRAINT IF EXISTS components_type_check;
ALTER TABLE components ADD CONSTRAINT components_type_check CHECK (type IN ('CPU', 'GPU', 'RAM', 'Stockage', 'Carte mère', 'Alimentation', 'Boîtier', 'Refroidissement', 'Moniteur', 'Clavier', 'Souris', 'Casque', 'Chaise gaming', 'Tapis de souris'));

-- ============================================================
-- CPUs
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('CPU', 'AMD Ryzen 5 7600X', 'AMD', 'Processeur gaming 6 coeurs Zen 4, excellent rapport qualite-prix', '{"cores": 6, "threads": 12, "base_clock_ghz": 4.7, "boost_clock_ghz": 5.3, "cache_mb": 38, "architecture": "Zen 4", "process_nm": 5, "pcie_version": "5.0", "memory_support": "DDR5-5200", "integrated_gpu": "Radeon 610M"}', 229, 0, 'AM5', NULL, NULL, 105, 2022, 'https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-5-7600x.html', 92, true, true),

('CPU', 'AMD Ryzen 7 7800X3D', 'AMD', 'Meilleur processeur gaming grace au 3D V-Cache', '{"cores": 8, "threads": 16, "base_clock_ghz": 4.2, "boost_clock_ghz": 5.0, "cache_mb": 104, "architecture": "Zen 4 3D V-Cache", "process_nm": 5, "pcie_version": "5.0", "memory_support": "DDR5-5200", "integrated_gpu": "Radeon 610M"}', 399, 0, 'AM5', NULL, NULL, 120, 2023, 'https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html', 98, true, true),

('CPU', 'AMD Ryzen 9 7950X', 'AMD', 'Processeur haut de gamme 16 coeurs pour creation et gaming', '{"cores": 16, "threads": 32, "base_clock_ghz": 4.5, "boost_clock_ghz": 5.7, "cache_mb": 80, "architecture": "Zen 4", "process_nm": 5, "pcie_version": "5.0", "memory_support": "DDR5-5200", "integrated_gpu": "Radeon 610M"}', 499, 0, 'AM5', NULL, NULL, 170, 2022, 'https://www.amd.com/en/products/processors/desktops/ryzen/7000-series/amd-ryzen-9-7950x.html', 85, true, true),

('CPU', 'AMD Ryzen 5 5600X', 'AMD', 'Processeur 6 coeurs Zen 3, excellent choix budget sur AM4', '{"cores": 6, "threads": 12, "base_clock_ghz": 3.7, "boost_clock_ghz": 4.6, "cache_mb": 35, "architecture": "Zen 3", "process_nm": 7, "pcie_version": "4.0", "memory_support": "DDR4-3200", "integrated_gpu": null}', 119, 0, 'AM4', NULL, NULL, 65, 2020, 'https://www.amd.com/en/products/processors/desktops/ryzen/5000-series/amd-ryzen-5-5600x.html', 80, true, true),

('CPU', 'AMD Ryzen 7 9700X', 'AMD', 'Processeur 8 coeurs Zen 5, nouvelle generation efficace', '{"cores": 8, "threads": 16, "base_clock_ghz": 3.8, "boost_clock_ghz": 5.5, "cache_mb": 40, "architecture": "Zen 5", "process_nm": 4, "pcie_version": "5.0", "memory_support": "DDR5-5600", "integrated_gpu": "Radeon 610M"}', 349, 0, 'AM5', NULL, NULL, 65, 2024, 'https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-7-9700x.html', 88, true, true),

('CPU', 'AMD Ryzen 9 9900X', 'AMD', 'Processeur 12 coeurs Zen 5, performances exceptionnelles', '{"cores": 12, "threads": 24, "base_clock_ghz": 4.4, "boost_clock_ghz": 5.6, "cache_mb": 76, "architecture": "Zen 5", "process_nm": 4, "pcie_version": "5.0", "memory_support": "DDR5-5600", "integrated_gpu": "Radeon 610M"}', 469, 0, 'AM5', NULL, NULL, 120, 2024, 'https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9900x.html', 82, true, true),

('CPU', 'Intel Core i5-14600K', 'Intel', 'Processeur gaming milieu de gamme, 14 coeurs hybrides', '{"cores": 14, "threads": 20, "p_cores": 6, "e_cores": 8, "base_clock_ghz": 3.5, "boost_clock_ghz": 5.3, "cache_mb": 24, "architecture": "Raptor Lake Refresh", "process_nm": 10, "pcie_version": "5.0", "memory_support": "DDR5-5600/DDR4-3200", "integrated_gpu": "Intel UHD 770"}', 279, 0, 'LGA1700', NULL, NULL, 125, 2023, 'https://www.intel.com/content/www/us/en/products/sku/236773/intel-core-i514600k-processor-24m-cache-up-to-5-30-ghz/specifications.html', 90, true, true),

('CPU', 'Intel Core i7-14700K', 'Intel', 'Processeur performant 20 coeurs, ideal gaming et creation', '{"cores": 20, "threads": 28, "p_cores": 8, "e_cores": 12, "base_clock_ghz": 3.4, "boost_clock_ghz": 5.6, "cache_mb": 33, "architecture": "Raptor Lake Refresh", "process_nm": 10, "pcie_version": "5.0", "memory_support": "DDR5-5600/DDR4-3200", "integrated_gpu": "Intel UHD 770"}', 389, 0, 'LGA1700', NULL, NULL, 125, 2023, 'https://www.intel.com/content/www/us/en/products/sku/236783/intel-core-i714700k-processor-33m-cache-up-to-5-60-ghz/specifications.html', 91, true, true),

('CPU', 'Intel Core i9-14900K', 'Intel', 'Processeur flagship Intel, 24 coeurs pour performances ultimes', '{"cores": 24, "threads": 32, "p_cores": 8, "e_cores": 16, "base_clock_ghz": 3.2, "boost_clock_ghz": 6.0, "cache_mb": 36, "architecture": "Raptor Lake Refresh", "process_nm": 10, "pcie_version": "5.0", "memory_support": "DDR5-5600/DDR4-3200", "integrated_gpu": "Intel UHD 770"}', 549, 0, 'LGA1700', NULL, NULL, 125, 2023, 'https://www.intel.com/content/www/us/en/products/sku/236773/intel-core-i914900k-processor-36m-cache-up-to-6-00-ghz/specifications.html', 84, true, true),

('CPU', 'Intel Core i5-13600K', 'Intel', 'Processeur 14 coeurs generation precedente, bon rapport qualite-prix', '{"cores": 14, "threads": 20, "p_cores": 6, "e_cores": 8, "base_clock_ghz": 3.5, "boost_clock_ghz": 5.1, "cache_mb": 24, "architecture": "Raptor Lake", "process_nm": 10, "pcie_version": "5.0", "memory_support": "DDR5-5600/DDR4-3200", "integrated_gpu": "Intel UHD 770"}', 239, 0, 'LGA1700', NULL, NULL, 125, 2022, 'https://www.intel.com/content/www/us/en/products/sku/230493/intel-core-i513600k-processor-24m-cache-up-to-5-10-ghz/specifications.html', 82, true, true),

('CPU', 'Intel Core i7-13700K', 'Intel', 'Processeur 16 coeurs generation precedente, performant et abordable', '{"cores": 16, "threads": 24, "p_cores": 8, "e_cores": 8, "base_clock_ghz": 3.4, "boost_clock_ghz": 5.4, "cache_mb": 30, "architecture": "Raptor Lake", "process_nm": 10, "pcie_version": "5.0", "memory_support": "DDR5-5600/DDR4-3200", "integrated_gpu": "Intel UHD 770"}', 339, 0, 'LGA1700', NULL, NULL, 125, 2022, 'https://www.intel.com/content/www/us/en/products/sku/230500/intel-core-i713700k-processor-30m-cache-up-to-5-40-ghz/specifications.html', 83, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- GPUs
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('GPU', 'NVIDIA GeForce RTX 4060', 'NVIDIA', 'Carte graphique 1080p performante et efficace', '{"gpu_chip": "AD107", "vram_gb": 8, "vram_type": "GDDR6", "bus_width_bit": 128, "base_clock_mhz": 1830, "boost_clock_mhz": 2460, "cuda_cores": 3072, "ray_tracing": true, "dlss_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 550, "outputs": "1x HDMI 2.1, 3x DisplayPort 1.4a"}', 299, 0, NULL, NULL, NULL, 115, 2023, 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4060/', 90, true, true),

('GPU', 'NVIDIA GeForce RTX 4060 Ti', 'NVIDIA', 'Carte graphique 1080p/1440p performante', '{"gpu_chip": "AD106", "vram_gb": 8, "vram_type": "GDDR6", "bus_width_bit": 128, "base_clock_mhz": 2310, "boost_clock_mhz": 2535, "cuda_cores": 4352, "ray_tracing": true, "dlss_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 550, "outputs": "1x HDMI 2.1, 3x DisplayPort 1.4a"}', 399, 0, NULL, NULL, NULL, 160, 2023, 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4060-4060ti/', 88, true, true),

('GPU', 'NVIDIA GeForce RTX 4070', 'NVIDIA', 'Carte graphique 1440p ideale avec DLSS 3', '{"gpu_chip": "AD104", "vram_gb": 12, "vram_type": "GDDR6X", "bus_width_bit": 192, "base_clock_mhz": 1920, "boost_clock_mhz": 2475, "cuda_cores": 5888, "ray_tracing": true, "dlss_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 650, "outputs": "1x HDMI 2.1, 3x DisplayPort 1.4a"}', 549, 0, NULL, NULL, NULL, 200, 2023, 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070/', 93, true, true),

('GPU', 'NVIDIA GeForce RTX 4070 Ti Super', 'NVIDIA', 'Carte graphique 1440p haut de gamme avec plus de VRAM', '{"gpu_chip": "AD103", "vram_gb": 16, "vram_type": "GDDR6X", "bus_width_bit": 256, "base_clock_mhz": 2340, "boost_clock_mhz": 2610, "cuda_cores": 8448, "ray_tracing": true, "dlss_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 700, "outputs": "1x HDMI 2.1, 3x DisplayPort 1.4a"}', 799, 0, NULL, NULL, NULL, 285, 2024, 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4070-ti-super/', 89, true, true),

('GPU', 'NVIDIA GeForce RTX 4080 Super', 'NVIDIA', 'Carte graphique 4K performante', '{"gpu_chip": "AD103", "vram_gb": 16, "vram_type": "GDDR6X", "bus_width_bit": 256, "base_clock_mhz": 2290, "boost_clock_mhz": 2550, "cuda_cores": 10240, "ray_tracing": true, "dlss_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 750, "outputs": "1x HDMI 2.1, 3x DisplayPort 1.4a"}', 999, 0, NULL, NULL, NULL, 320, 2024, 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4080-super/', 86, true, true),

('GPU', 'NVIDIA GeForce RTX 4090', 'NVIDIA', 'Carte graphique la plus puissante, 4K ultra et creation', '{"gpu_chip": "AD102", "vram_gb": 24, "vram_type": "GDDR6X", "bus_width_bit": 384, "base_clock_mhz": 2235, "boost_clock_mhz": 2520, "cuda_cores": 16384, "ray_tracing": true, "dlss_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 850, "outputs": "1x HDMI 2.1, 3x DisplayPort 1.4a"}', 1799, 0, NULL, NULL, NULL, 450, 2022, 'https://www.nvidia.com/en-us/geforce/graphics-cards/40-series/rtx-4090/', 95, true, true),

('GPU', 'AMD Radeon RX 7600', 'AMD', 'Carte graphique 1080p abordable avec RDNA 3', '{"gpu_chip": "Navi 33", "vram_gb": 8, "vram_type": "GDDR6", "bus_width_bit": 128, "base_clock_mhz": 1720, "boost_clock_mhz": 2655, "stream_processors": 2048, "ray_tracing": true, "fsr_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 550, "outputs": "1x HDMI 2.1, 3x DisplayPort 2.1"}', 259, 0, NULL, NULL, NULL, 165, 2023, 'https://www.amd.com/en/products/graphics/amd-radeon-rx-7600', 82, true, true),

('GPU', 'AMD Radeon RX 7700 XT', 'AMD', 'Carte graphique 1440p avec 12 Go VRAM', '{"gpu_chip": "Navi 32", "vram_gb": 12, "vram_type": "GDDR6", "bus_width_bit": 192, "base_clock_mhz": 1700, "boost_clock_mhz": 2544, "stream_processors": 3456, "ray_tracing": true, "fsr_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 650, "outputs": "1x HDMI 2.1, 2x DisplayPort 2.1"}', 419, 0, NULL, NULL, NULL, 245, 2023, 'https://www.amd.com/en/products/graphics/amd-radeon-rx-7700-xt', 80, true, true),

('GPU', 'AMD Radeon RX 7800 XT', 'AMD', 'Carte graphique 1440p haut de gamme AMD', '{"gpu_chip": "Navi 32", "vram_gb": 16, "vram_type": "GDDR6", "bus_width_bit": 256, "base_clock_mhz": 1295, "boost_clock_mhz": 2430, "stream_processors": 3840, "ray_tracing": true, "fsr_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 650, "outputs": "1x HDMI 2.1, 2x DisplayPort 2.1"}', 479, 0, NULL, NULL, NULL, 263, 2023, 'https://www.amd.com/en/products/graphics/amd-radeon-rx-7800-xt', 87, true, true),

('GPU', 'AMD Radeon RX 7900 XTX', 'AMD', 'Carte graphique flagship AMD, 4K gaming', '{"gpu_chip": "Navi 31", "vram_gb": 24, "vram_type": "GDDR6", "bus_width_bit": 384, "base_clock_mhz": 1855, "boost_clock_mhz": 2499, "stream_processors": 6144, "ray_tracing": true, "fsr_version": "3.0", "pcie_version": "4.0", "recommended_psu_w": 800, "outputs": "1x HDMI 2.1, 2x DisplayPort 2.1, 1x USB-C"}', 899, 0, NULL, NULL, NULL, 355, 2022, 'https://www.amd.com/en/products/graphics/amd-radeon-rx-7900-xtx', 84, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- RAM
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('RAM', 'Corsair Vengeance DDR5-5600 32GB (2x16GB)', 'Corsair', 'Kit memoire DDR5 performant et fiable pour gaming', '{"capacity_gb": 32, "modules": "2x16GB", "type": "DDR5", "speed_mhz": 5600, "latency": "CL36", "voltage": 1.25, "rgb": false, "heatspreader": true, "xmp": true, "height_mm": 34}', 89, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.corsair.com/vengeance-ddr5', 92, true, true),

('RAM', 'G.Skill Trident Z5 DDR5-6000 32GB (2x16GB)', 'G.Skill', 'Kit memoire DDR5 haut de gamme avec RGB', '{"capacity_gb": 32, "modules": "2x16GB", "type": "DDR5", "speed_mhz": 6000, "latency": "CL30", "voltage": 1.35, "rgb": true, "heatspreader": true, "xmp": true, "height_mm": 42}', 119, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.gskill.com/product/165/390/1663318632/F5-6000J3040G16GX2-TZ5RK', 88, true, true),

('RAM', 'Kingston Fury Beast DDR5-5200 32GB (2x16GB)', 'Kingston', 'Kit memoire DDR5 fiable et abordable', '{"capacity_gb": 32, "modules": "2x16GB", "type": "DDR5", "speed_mhz": 5200, "latency": "CL40", "voltage": 1.25, "rgb": false, "heatspreader": true, "xmp": true, "height_mm": 34}', 79, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.kingston.com/en/memory/gaming/kingston-fury-beast-ddr5-memory', 85, true, true),

('RAM', 'Corsair Vengeance DDR5-5600 16GB (2x8GB)', 'Corsair', 'Kit memoire DDR5 compact pour builds budget', '{"capacity_gb": 16, "modules": "2x8GB", "type": "DDR5", "speed_mhz": 5600, "latency": "CL36", "voltage": 1.25, "rgb": false, "heatspreader": true, "xmp": true, "height_mm": 34}', 52, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.corsair.com/vengeance-ddr5', 80, true, true),

('RAM', 'G.Skill Flare X5 DDR5-6000 32GB (2x16GB)', 'G.Skill', 'Kit memoire DDR5 optimise AMD EXPO', '{"capacity_gb": 32, "modules": "2x16GB", "type": "DDR5", "speed_mhz": 6000, "latency": "CL30", "voltage": 1.35, "rgb": false, "heatspreader": true, "expo": true, "height_mm": 33}', 109, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.gskill.com/product/165/401/1667284051/F5-6000J3038F16GX2-FX5', 86, true, true),

('RAM', 'Kingston Fury Beast DDR4-3200 32GB (2x16GB)', 'Kingston', 'Kit memoire DDR4 pour plateformes AM4 et anciens builds', '{"capacity_gb": 32, "modules": "2x16GB", "type": "DDR4", "speed_mhz": 3200, "latency": "CL16", "voltage": 1.35, "rgb": false, "heatspreader": true, "xmp": true, "height_mm": 34}', 59, 0, NULL, NULL, NULL, NULL, 2021, 'https://www.kingston.com/en/memory/gaming/kingston-fury-beast-ddr4-memory', 78, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Stockage (Storage)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Stockage', 'Samsung 990 Pro 1TB', 'Samsung', 'SSD NVMe PCIe 4.0 ultra-rapide pour gaming et creation', '{"capacity_gb": 1000, "interface": "NVMe PCIe 4.0 x4", "form_factor": "M.2 2280", "sequential_read_mbps": 7450, "sequential_write_mbps": 6900, "random_read_iops": 1200000, "random_write_iops": 1550000, "endurance_tbw": 600, "dram_cache": true, "nand_type": "V-NAND TLC"}', 109, 0, NULL, NULL, 'M.2 2280', NULL, 2022, 'https://www.samsung.com/semiconductor/minisite/ssd/product/portable/990-pro/', 95, true, true),

('Stockage', 'Samsung 990 Pro 2TB', 'Samsung', 'SSD NVMe PCIe 4.0 grande capacite pour stockage et jeux', '{"capacity_gb": 2000, "interface": "NVMe PCIe 4.0 x4", "form_factor": "M.2 2280", "sequential_read_mbps": 7450, "sequential_write_mbps": 6900, "random_read_iops": 1200000, "random_write_iops": 1550000, "endurance_tbw": 1200, "dram_cache": true, "nand_type": "V-NAND TLC"}', 179, 0, NULL, NULL, 'M.2 2280', NULL, 2022, 'https://www.samsung.com/semiconductor/minisite/ssd/product/portable/990-pro/', 90, true, true),

('Stockage', 'WD Black SN850X 1TB', 'Western Digital', 'SSD NVMe PCIe 4.0 haut de gamme pour gaming', '{"capacity_gb": 1000, "interface": "NVMe PCIe 4.0 x4", "form_factor": "M.2 2280", "sequential_read_mbps": 7300, "sequential_write_mbps": 6300, "random_read_iops": 1200000, "random_write_iops": 1100000, "endurance_tbw": 600, "dram_cache": true, "nand_type": "BiCS5 TLC"}', 89, 0, NULL, NULL, 'M.2 2280', NULL, 2022, 'https://www.westerndigital.com/products/internal-drives/wd-black-sn850x-nvme-ssd', 91, true, true),

('Stockage', 'WD Black SN850X 2TB', 'Western Digital', 'SSD NVMe PCIe 4.0 grande capacite gaming', '{"capacity_gb": 2000, "interface": "NVMe PCIe 4.0 x4", "form_factor": "M.2 2280", "sequential_read_mbps": 7300, "sequential_write_mbps": 6600, "random_read_iops": 1200000, "random_write_iops": 1100000, "endurance_tbw": 1200, "dram_cache": true, "nand_type": "BiCS5 TLC"}', 149, 0, NULL, NULL, 'M.2 2280', NULL, 2022, 'https://www.westerndigital.com/products/internal-drives/wd-black-sn850x-nvme-ssd', 87, true, true),

('Stockage', 'Crucial T500 1TB', 'Crucial', 'SSD NVMe PCIe 5.0 nouvelle generation ultra-rapide', '{"capacity_gb": 1000, "interface": "NVMe PCIe 5.0 x4", "form_factor": "M.2 2280", "sequential_read_mbps": 7300, "sequential_write_mbps": 6800, "random_read_iops": 1200000, "random_write_iops": 1500000, "endurance_tbw": 600, "dram_cache": true, "nand_type": "Micron 232-layer TLC"}', 99, 0, NULL, NULL, 'M.2 2280', NULL, 2023, 'https://www.crucial.com/ssd/t500/CT1000T500SSD8', 86, true, true),

('Stockage', 'Kingston NV2 1TB', 'Kingston', 'SSD NVMe PCIe 4.0 budget, bon rapport qualite-prix', '{"capacity_gb": 1000, "interface": "NVMe PCIe 4.0 x4", "form_factor": "M.2 2280", "sequential_read_mbps": 3500, "sequential_write_mbps": 2100, "endurance_tbw": 320, "dram_cache": false, "nand_type": "QLC"}', 59, 0, NULL, NULL, 'M.2 2280', NULL, 2022, 'https://www.kingston.com/en/ssd/nv2-nvme-pcie-ssd', 80, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Cartes meres (Motherboards)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Carte mère', 'MSI MAG B650 Tomahawk WiFi', 'MSI', 'Carte mere AM5 milieu de gamme avec WiFi 6E', '{"chipset": "B650", "socket": "AM5", "form_factor": "ATX", "memory_slots": 4, "max_memory_gb": 128, "memory_type": "DDR5", "pcie_x16_slots": 1, "m2_slots": 2, "usb_ports": {"usb_32_gen2": 3, "usb_32_gen1": 4, "usb_20": 2}, "wifi": "WiFi 6E", "bluetooth": "5.2", "audio": "Realtek ALC4080", "lan": "2.5 Gbps"}', 229, 0, 'AM5', 'B650', 'ATX', NULL, 2022, 'https://www.msi.com/Motherboard/MAG-B650-TOMAHAWK-WIFI', 90, true, true),

('Carte mère', 'ASUS ROG STRIX B650-A Gaming WiFi', 'ASUS', 'Carte mere AM5 gaming avec design blanc et WiFi 6E', '{"chipset": "B650", "socket": "AM5", "form_factor": "ATX", "memory_slots": 4, "max_memory_gb": 128, "memory_type": "DDR5", "pcie_x16_slots": 2, "m2_slots": 2, "usb_ports": {"usb_32_gen2": 2, "usb_32_gen1": 4, "usb_20": 2}, "wifi": "WiFi 6E", "bluetooth": "5.2", "audio": "ROG SupremeFX ALC4080", "lan": "2.5 Gbps"}', 259, 0, 'AM5', 'B650', 'ATX', NULL, 2022, 'https://rog.asus.com/motherboards/rog-strix/rog-strix-b650-a-gaming-wifi/', 87, true, true),

('Carte mère', 'Gigabyte B650 AORUS Elite AX', 'Gigabyte', 'Carte mere AM5 fiable avec WiFi 6E et bonne VRM', '{"chipset": "B650", "socket": "AM5", "form_factor": "ATX", "memory_slots": 4, "max_memory_gb": 128, "memory_type": "DDR5", "pcie_x16_slots": 1, "m2_slots": 2, "usb_ports": {"usb_32_gen2": 3, "usb_32_gen1": 4, "usb_20": 4}, "wifi": "WiFi 6E", "bluetooth": "5.2", "audio": "Realtek ALC897", "lan": "2.5 Gbps"}', 199, 0, 'AM5', 'B650', 'ATX', NULL, 2022, 'https://www.gigabyte.com/Motherboard/B650-AORUS-ELITE-AX', 85, true, true),

('Carte mère', 'MSI MAG Z790 Tomahawk WiFi', 'MSI', 'Carte mere LGA1700 haut de gamme avec WiFi 6E', '{"chipset": "Z790", "socket": "LGA1700", "form_factor": "ATX", "memory_slots": 4, "max_memory_gb": 128, "memory_type": "DDR5", "pcie_x16_slots": 2, "m2_slots": 4, "usb_ports": {"usb_32_gen2x2": 1, "usb_32_gen2": 3, "usb_32_gen1": 4, "usb_20": 2}, "wifi": "WiFi 6E", "bluetooth": "5.3", "audio": "Realtek ALC4080", "lan": "2.5 Gbps"}', 299, 0, 'LGA1700', 'Z790', 'ATX', NULL, 2022, 'https://www.msi.com/Motherboard/MAG-Z790-TOMAHAWK-WIFI', 88, true, true),

('Carte mère', 'ASUS ROG STRIX Z790-A Gaming WiFi', 'ASUS', 'Carte mere LGA1700 gaming premium avec WiFi 6E', '{"chipset": "Z790", "socket": "LGA1700", "form_factor": "ATX", "memory_slots": 4, "max_memory_gb": 128, "memory_type": "DDR5", "pcie_x16_slots": 2, "m2_slots": 4, "usb_ports": {"usb_32_gen2x2": 1, "usb_32_gen2": 4, "usb_32_gen1": 4, "usb_20": 2}, "wifi": "WiFi 6E", "bluetooth": "5.3", "audio": "ROG SupremeFX ALC4080", "lan": "2.5 Gbps"}', 339, 0, 'LGA1700', 'Z790', 'ATX', NULL, 2022, 'https://rog.asus.com/motherboards/rog-strix/rog-strix-z790-a-gaming-wifi/', 86, true, true),

('Carte mère', 'ASRock B760M Pro RS', 'ASRock', 'Carte mere LGA1700 Micro-ATX budget', '{"chipset": "B760", "socket": "LGA1700", "form_factor": "Micro-ATX", "memory_slots": 2, "max_memory_gb": 64, "memory_type": "DDR5", "pcie_x16_slots": 1, "m2_slots": 2, "usb_ports": {"usb_32_gen1": 4, "usb_20": 2}, "wifi": null, "bluetooth": null, "audio": "Realtek ALC897", "lan": "1 Gbps"}', 109, 0, 'LGA1700', 'B760', 'Micro-ATX', NULL, 2023, 'https://www.asrock.com/mb/Intel/B760M%20Pro%20RS/', 75, true, true),

('Carte mère', 'ASUS TUF GAMING B760-PLUS WiFi', 'ASUS', 'Carte mere LGA1700 robuste avec WiFi 6', '{"chipset": "B760", "socket": "LGA1700", "form_factor": "ATX", "memory_slots": 4, "max_memory_gb": 128, "memory_type": "DDR5", "pcie_x16_slots": 1, "m2_slots": 2, "usb_ports": {"usb_32_gen2": 1, "usb_32_gen1": 4, "usb_20": 2}, "wifi": "WiFi 6", "bluetooth": "5.2", "audio": "Realtek ALC897", "lan": "2.5 Gbps"}', 189, 0, 'LGA1700', 'B760', 'ATX', NULL, 2023, 'https://www.asus.com/motherboards-components/motherboards/tuf-gaming/tuf-gaming-b760-plus-wifi/', 82, true, true),

('Carte mère', 'MSI PRO B760M-A WiFi', 'MSI', 'Carte mere LGA1700 Micro-ATX compacte avec WiFi', '{"chipset": "B760", "socket": "LGA1700", "form_factor": "Micro-ATX", "memory_slots": 4, "max_memory_gb": 128, "memory_type": "DDR5", "pcie_x16_slots": 1, "m2_slots": 2, "usb_ports": {"usb_32_gen2": 1, "usb_32_gen1": 4, "usb_20": 2}, "wifi": "WiFi 6E", "bluetooth": "5.2", "audio": "Realtek ALC897", "lan": "2.5 Gbps"}', 149, 0, 'LGA1700', 'B760', 'Micro-ATX', NULL, 2023, 'https://www.msi.com/Motherboard/PRO-B760M-A-WIFI', 80, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Alimentations (Power Supplies)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Alimentation', 'Corsair RM850x', 'Corsair', 'Alimentation 850W modulaire 80+ Gold, silencieuse', '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Fully Modular", "fan_size_mm": 135, "atx_version": "ATX 3.0", "pcie_gen5_connector": true, "protections": "OVP, UVP, OCP, OPP, SCP", "cables_length": "650mm", "warranty_years": 10}', 139, 0, NULL, NULL, 'ATX', NULL, 2023, 'https://www.corsair.com/rm850x', 93, true, true),

('Alimentation', 'Corsair RM750x', 'Corsair', 'Alimentation 750W modulaire 80+ Gold, compacte', '{"wattage": 750, "efficiency": "80+ Gold", "modular": "Fully Modular", "fan_size_mm": 135, "atx_version": "ATX 3.0", "pcie_gen5_connector": true, "protections": "OVP, UVP, OCP, OPP, SCP", "cables_length": "650mm", "warranty_years": 10}', 119, 0, NULL, NULL, 'ATX', NULL, 2023, 'https://www.corsair.com/rm750x', 90, true, true),

('Alimentation', 'be quiet! Pure Power 12 M 850W', 'be quiet!', 'Alimentation 850W modulaire 80+ Gold, tres silencieuse', '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Fully Modular", "fan_size_mm": 120, "atx_version": "ATX 3.0", "pcie_gen5_connector": true, "protections": "OVP, UVP, OCP, OPP, SCP, OTP", "warranty_years": 10}', 129, 0, NULL, NULL, 'ATX', NULL, 2023, 'https://www.bequiet.com/en/powersupply/pure-power-12-m', 87, true, true),

('Alimentation', 'Seasonic Focus GX-850', 'Seasonic', 'Alimentation 850W modulaire 80+ Gold, qualite premium', '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Fully Modular", "fan_size_mm": 120, "atx_version": "ATX 2.4", "pcie_gen5_connector": false, "protections": "OVP, UVP, OCP, OPP, SCP, OTP", "warranty_years": 10}', 135, 0, NULL, NULL, 'ATX', NULL, 2020, 'https://seasonic.com/focus-gx', 85, true, true),

('Alimentation', 'be quiet! Straight Power 12 1000W', 'be quiet!', 'Alimentation 1000W haut de gamme 80+ Platinum', '{"wattage": 1000, "efficiency": "80+ Platinum", "modular": "Fully Modular", "fan_size_mm": 135, "atx_version": "ATX 3.0", "pcie_gen5_connector": true, "protections": "OVP, UVP, OCP, OPP, SCP, OTP", "warranty_years": 10}', 199, 0, NULL, NULL, 'ATX', NULL, 2023, 'https://www.bequiet.com/en/powersupply/straight-power-12', 84, true, true),

('Alimentation', 'Corsair RM1000x', 'Corsair', 'Alimentation 1000W modulaire 80+ Gold pour builds puissants', '{"wattage": 1000, "efficiency": "80+ Gold", "modular": "Fully Modular", "fan_size_mm": 135, "atx_version": "ATX 3.0", "pcie_gen5_connector": true, "protections": "OVP, UVP, OCP, OPP, SCP", "cables_length": "650mm", "warranty_years": 10}', 179, 0, NULL, NULL, 'ATX', NULL, 2023, 'https://www.corsair.com/rm1000x', 86, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Boitiers (Cases)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Boîtier', 'Fractal Design North', 'Fractal Design', 'Boitier elegant avec facade en bois et mesh, excellent airflow', '{"type": "Mid Tower", "form_factor_support": ["ATX", "Micro-ATX", "Mini-ITX"], "max_gpu_length_mm": 355, "max_cpu_cooler_height_mm": 170, "drive_bays_35": 2, "drive_bays_25": 4, "fan_slots": {"front": 2, "top": 3, "rear": 1}, "included_fans": 2, "radiator_support_mm": [280, 360], "usb_front": {"usb_c": 1, "usb_a": 2}, "weight_kg": 8.5, "dimensions_mm": "469 x 215 x 469"}', 129, 0, NULL, NULL, 'ATX Mid Tower', NULL, 2022, 'https://www.fractal-design.com/products/cases/north/', 93, true, true),

('Boîtier', 'NZXT H7 Flow', 'NZXT', 'Boitier moderne avec airflow optimise et cable management', '{"type": "Mid Tower", "form_factor_support": ["ATX", "Micro-ATX", "Mini-ITX"], "max_gpu_length_mm": 400, "max_cpu_cooler_height_mm": 185, "drive_bays_35": 2, "drive_bays_25": 2, "fan_slots": {"front": 3, "top": 3, "rear": 1}, "included_fans": 2, "radiator_support_mm": [280, 360], "usb_front": {"usb_c": 1, "usb_a": 1}, "weight_kg": 9.2, "dimensions_mm": "480 x 230 x 505"}', 129, 0, NULL, NULL, 'ATX Mid Tower', NULL, 2022, 'https://nzxt.com/product/h7-flow', 88, true, true),

('Boîtier', 'Corsair 4000D Airflow', 'Corsair', 'Boitier populaire avec excellent airflow et prix attractif', '{"type": "Mid Tower", "form_factor_support": ["ATX", "Micro-ATX", "Mini-ITX"], "max_gpu_length_mm": 360, "max_cpu_cooler_height_mm": 170, "drive_bays_35": 2, "drive_bays_25": 2, "fan_slots": {"front": 3, "top": 2, "rear": 1}, "included_fans": 2, "radiator_support_mm": [280, 360], "usb_front": {"usb_c": 1, "usb_a": 1}, "weight_kg": 7.8, "dimensions_mm": "453 x 230 x 466"}', 99, 0, NULL, NULL, 'ATX Mid Tower', NULL, 2020, 'https://www.corsair.com/4000d-airflow', 92, true, true),

('Boîtier', 'Lian Li Lancool II Mesh', 'Lian Li', 'Boitier spacieux avec facade mesh et bon cable management', '{"type": "Mid Tower", "form_factor_support": ["ATX", "Micro-ATX", "Mini-ITX"], "max_gpu_length_mm": 384, "max_cpu_cooler_height_mm": 176, "drive_bays_35": 2, "drive_bays_25": 3, "fan_slots": {"front": 3, "top": 2, "rear": 1}, "included_fans": 3, "radiator_support_mm": [280, 360], "usb_front": {"usb_c": 1, "usb_a": 2}, "weight_kg": 8.6, "dimensions_mm": "478 x 229 x 494"}', 109, 0, NULL, NULL, 'ATX Mid Tower', NULL, 2020, 'https://lian-li.com/product/lancool-ii-mesh/', 89, true, true),

('Boîtier', 'be quiet! Pure Base 500DX', 'be quiet!', 'Boitier silencieux avec bon airflow et RGB discret', '{"type": "Mid Tower", "form_factor_support": ["ATX", "Micro-ATX", "Mini-ITX"], "max_gpu_length_mm": 369, "max_cpu_cooler_height_mm": 190, "drive_bays_35": 2, "drive_bays_25": 5, "fan_slots": {"front": 3, "top": 2, "rear": 1}, "included_fans": 3, "radiator_support_mm": [240, 360], "usb_front": {"usb_c": 1, "usb_a": 2}, "weight_kg": 8.0, "dimensions_mm": "463 x 232 x 450"}', 99, 0, NULL, NULL, 'ATX Mid Tower', NULL, 2020, 'https://www.bequiet.com/en/case/pure-base-500dx', 87, true, true),

('Boîtier', 'Fractal Design Pop Air', 'Fractal Design', 'Boitier abordable avec bonne ventilation et design moderne', '{"type": "Mid Tower", "form_factor_support": ["ATX", "Micro-ATX", "Mini-ITX"], "max_gpu_length_mm": 405, "max_cpu_cooler_height_mm": 170, "drive_bays_35": 2, "drive_bays_25": 4, "fan_slots": {"front": 3, "top": 2, "rear": 1}, "included_fans": 3, "radiator_support_mm": [280, 360], "usb_front": {"usb_c": 1, "usb_a": 2}, "weight_kg": 7.1, "dimensions_mm": "454 x 215 x 474"}', 79, 0, NULL, NULL, 'ATX Mid Tower', NULL, 2022, 'https://www.fractal-design.com/products/cases/pop/pop-air/', 84, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Refroidissement (Cooling)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Refroidissement', 'Noctua NH-D15', 'Noctua', 'Ventirad bicouloir haut de gamme, performances de reference', '{"type": "Air Cooler", "height_mm": 165, "fan_count": 2, "fan_size_mm": 150, "fan_rpm_max": 1500, "noise_dba_max": 24.6, "tdp_rating_w": 250, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"], "weight_g": 1320, "heatpipes": 6}', 99, 0, NULL, NULL, NULL, NULL, 2014, 'https://noctua.at/en/nh-d15', 96, true, true),

('Refroidissement', 'be quiet! Dark Rock Pro 5', 'be quiet!', 'Ventirad bicouloir silencieux, design noir elegant', '{"type": "Air Cooler", "height_mm": 168, "fan_count": 2, "fan_size_mm": [135, 120], "fan_rpm_max": 1500, "noise_dba_max": 24.3, "tdp_rating_w": 270, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"], "weight_g": 1280, "heatpipes": 7}', 89, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.bequiet.com/en/cpucooler/dark-rock-pro-5', 90, true, true),

('Refroidissement', 'Corsair iCUE H150i Elite', 'Corsair', 'AIO 360mm avec eclairage RGB et logiciel iCUE', '{"type": "AIO Liquid Cooler", "radiator_size_mm": 360, "fan_count": 3, "fan_size_mm": 120, "fan_rpm_max": 2400, "noise_dba_max": 36, "pump_type": "Split-Flow", "tdp_rating_w": 350, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"], "rgb": true, "tube_length_mm": 380}', 169, 0, NULL, NULL, NULL, NULL, 2021, 'https://www.corsair.com/icue-h150i-elite', 88, true, true),

('Refroidissement', 'ARCTIC Liquid Freezer II 360', 'ARCTIC', 'AIO 360mm excellent rapport qualite-prix, VRM fan integre', '{"type": "AIO Liquid Cooler", "radiator_size_mm": 360, "fan_count": 3, "fan_size_mm": 120, "fan_rpm_max": 1800, "noise_dba_max": 22.5, "pump_type": "In-house", "tdp_rating_w": 350, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"], "rgb": false, "tube_length_mm": 450, "vrm_fan": true}', 99, 0, NULL, NULL, NULL, NULL, 2020, 'https://www.arctic.de/en/Liquid-Freezer-II-360', 94, true, true),

('Refroidissement', 'DeepCool AK620', 'DeepCool', 'Ventirad bicouloir performant et abordable', '{"type": "Air Cooler", "height_mm": 160, "fan_count": 2, "fan_size_mm": 120, "fan_rpm_max": 1850, "noise_dba_max": 28, "tdp_rating_w": 260, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"], "weight_g": 1040, "heatpipes": 6}', 55, 0, NULL, NULL, NULL, NULL, 2022, 'https://www.deepcool.com/products/Cooling/cpuaircoolers/AK620-High-Performance-CPU-Cooler/2021/13067.shtml', 89, true, true),

('Refroidissement', 'Noctua NH-U12S', 'Noctua', 'Ventirad compact et silencieux, compatible tous boitiers', '{"type": "Air Cooler", "height_mm": 158, "fan_count": 1, "fan_size_mm": 120, "fan_rpm_max": 1500, "noise_dba_max": 22.4, "tdp_rating_w": 180, "socket_support": ["AM5", "AM4", "LGA1700", "LGA1200"], "weight_g": 780, "heatpipes": 5}', 69, 0, NULL, NULL, NULL, NULL, 2013, 'https://noctua.at/en/nh-u12s', 85, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Moniteurs (Monitors)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Moniteur', 'ASUS ROG Swift PG27AQN', 'ASUS', 'Moniteur 27" 1440p 360Hz, le plus rapide en QHD', '{"panel_type": "IPS", "size_inches": 27, "resolution": "2560x1440", "refresh_rate_hz": 360, "response_time_ms": 1, "adaptive_sync": "G-Sync", "hdr": "HDR600", "brightness_nits": 600, "color_gamut": "95% DCI-P3", "ports": {"hdmi": 2, "displayport": 2, "usb_c": 0}, "vesa_mount": "100x100", "height_adjustable": true, "pivot": true, "speakers": false}', 899, 0, NULL, NULL, '27"', NULL, 2023, 'https://rog.asus.com/monitors/27-to-31-5-inches/rog-swift-pg27aqn/', 85, true, true),

('Moniteur', 'Samsung Odyssey G5 27" 1440p', 'Samsung', 'Moniteur 27" 1440p 165Hz courbe, bon rapport qualite-prix', '{"panel_type": "VA", "size_inches": 27, "resolution": "2560x1440", "refresh_rate_hz": 165, "response_time_ms": 1, "adaptive_sync": "FreeSync Premium", "hdr": "HDR10", "brightness_nits": 300, "color_gamut": "125% sRGB", "curvature": "1000R", "ports": {"hdmi": 1, "displayport": 1}, "vesa_mount": "75x75", "height_adjustable": true, "speakers": false}', 249, 0, NULL, NULL, '27"', NULL, 2022, 'https://www.samsung.com/ch/monitors/gaming/odyssey-g5/', 82, true, true),

('Moniteur', 'LG 27GP850-B', 'LG', 'Moniteur 27" 1440p 165Hz Nano IPS, couleurs excellentes', '{"panel_type": "Nano IPS", "size_inches": 27, "resolution": "2560x1440", "refresh_rate_hz": 165, "response_time_ms": 1, "adaptive_sync": "G-Sync Compatible / FreeSync Premium", "hdr": "HDR400", "brightness_nits": 400, "color_gamut": "98% DCI-P3", "ports": {"hdmi": 2, "displayport": 1, "usb_hub": true}, "vesa_mount": "100x100", "height_adjustable": true, "pivot": true, "speakers": false}', 349, 0, NULL, NULL, '27"', NULL, 2021, 'https://www.lg.com/ch_fr/moniteurs/gaming/27gp850-b/', 88, true, true),

('Moniteur', 'Dell S2722DGM', 'Dell', 'Moniteur 27" 1440p 165Hz VA courbe, polyvalent', '{"panel_type": "VA", "size_inches": 27, "resolution": "2560x1440", "refresh_rate_hz": 165, "response_time_ms": 2, "adaptive_sync": "FreeSync Premium", "hdr": "HDR400", "brightness_nits": 350, "color_gamut": "99% sRGB", "curvature": "1500R", "ports": {"hdmi": 2, "displayport": 1}, "vesa_mount": "100x100", "height_adjustable": true, "tilt": true, "speakers": false}', 269, 0, NULL, NULL, '27"', NULL, 2021, 'https://www.dell.com/en-us/shop/dell-27-curved-gaming-monitor-s2722dgm/', 84, true, true),

('Moniteur', 'ASUS VG27AQ1A', 'ASUS', 'Moniteur 27" 1440p 170Hz IPS, ideal gaming et polyvalence', '{"panel_type": "IPS", "size_inches": 27, "resolution": "2560x1440", "refresh_rate_hz": 170, "response_time_ms": 1, "adaptive_sync": "G-Sync Compatible / FreeSync", "hdr": "HDR10", "brightness_nits": 350, "color_gamut": "99% sRGB", "ports": {"hdmi": 2, "displayport": 1}, "vesa_mount": "100x100", "height_adjustable": true, "pivot": true, "speakers": true}', 289, 0, NULL, NULL, '27"', NULL, 2020, 'https://www.asus.com/displays-desktops/monitors/tuf-gaming/tuf-gaming-vg27aq1a/', 86, true, true),

('Moniteur', 'BenQ MOBIUZ EX2710Q', 'BenQ', 'Moniteur 27" 1440p 165Hz IPS, HDRi et haut-parleurs integres', '{"panel_type": "IPS", "size_inches": 27, "resolution": "2560x1440", "refresh_rate_hz": 165, "response_time_ms": 1, "adaptive_sync": "FreeSync Premium", "hdr": "HDRi", "brightness_nits": 400, "color_gamut": "98% DCI-P3", "ports": {"hdmi": 2, "displayport": 1, "usb_c": 0}, "vesa_mount": "100x100", "height_adjustable": true, "pivot": true, "speakers": true}', 379, 0, NULL, NULL, '27"', NULL, 2022, 'https://www.benq.com/en-us/gaming-monitor/ex2710q.html', 83, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Claviers (Keyboards)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Clavier', 'Razer BlackWidow V4', 'Razer', 'Clavier mecanique gaming full-size avec molette et RGB', '{"type": "Mechanical", "switch": "Razer Green", "layout": "Full-size", "connection": "Wired USB-C", "rgb": true, "macro_keys": 6, "media_controls": true, "wrist_rest": true, "keycaps": "Doubleshot ABS", "polling_rate_hz": 8000, "anti_ghosting": true}', 179, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.razer.com/gaming-keyboards/razer-blackwidow-v4/', 85, true, true),

('Clavier', 'Corsair K70 RGB Pro', 'Corsair', 'Clavier mecanique gaming premium avec chassis aluminium', '{"type": "Mechanical", "switch": "Cherry MX Red", "layout": "Full-size", "connection": "Wired USB", "rgb": true, "macro_keys": 0, "media_controls": true, "wrist_rest": true, "keycaps": "PBT Double-Shot", "polling_rate_hz": 8000, "anti_ghosting": true}', 159, 0, NULL, NULL, NULL, NULL, 2022, 'https://www.corsair.com/k70-rgb-pro', 88, true, true),

('Clavier', 'SteelSeries Apex Pro', 'SteelSeries', 'Clavier mecanique avec switches ajustables OmniPoint 2.0', '{"type": "Mechanical", "switch": "OmniPoint 2.0 Adjustable", "layout": "Full-size", "connection": "Wired USB-C", "rgb": true, "macro_keys": 0, "media_controls": true, "wrist_rest": true, "keycaps": "PBT Double-Shot", "polling_rate_hz": 1000, "actuation_range_mm": "0.2-3.8", "anti_ghosting": true}', 189, 0, NULL, NULL, NULL, NULL, 2023, 'https://steelseries.com/gaming-keyboards/apex-pro', 90, true, true),

('Clavier', 'Logitech G Pro X', 'Logitech', 'Clavier mecanique compact TKL pour esport', '{"type": "Mechanical", "switch": "GX Blue/Red/Brown (swappable)", "layout": "TKL (Tenkeyless)", "connection": "Wired USB", "rgb": true, "macro_keys": 0, "media_controls": false, "wrist_rest": false, "keycaps": "ABS", "polling_rate_hz": 1000, "anti_ghosting": true}', 119, 0, NULL, NULL, NULL, NULL, 2019, 'https://www.logitechg.com/en-ch/products/gaming-keyboards/pro-x-keyboard.html', 82, true, true),

('Clavier', 'ASUS ROG Strix Scope II', 'ASUS', 'Clavier mecanique gaming avec switches ROG NX', '{"type": "Mechanical", "switch": "ROG NX Red/Blue", "layout": "Full-size", "connection": "Wired USB-C", "rgb": true, "macro_keys": 0, "media_controls": true, "wrist_rest": true, "keycaps": "PBT Double-Shot", "polling_rate_hz": 1000, "anti_ghosting": true}', 139, 0, NULL, NULL, NULL, NULL, 2023, 'https://rog.asus.com/keyboards/keyboards/rog-strix-scope-ii/', 80, true, true),

('Clavier', 'HyperX Alloy Origins', 'HyperX', 'Clavier mecanique compact avec chassis aluminium', '{"type": "Mechanical", "switch": "HyperX Red", "layout": "Full-size", "connection": "Wired USB-C", "rgb": true, "macro_keys": 0, "media_controls": false, "wrist_rest": false, "keycaps": "ABS", "polling_rate_hz": 1000, "anti_ghosting": true}', 89, 0, NULL, NULL, NULL, NULL, 2019, 'https://www.hyperxgaming.com/en/keyboards/alloy-origins-mechanical-gaming-keyboard', 78, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Souris (Mice)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Souris', 'Razer DeathAdder V3', 'Razer', 'Souris gaming ergonomique ultra-legere, capteur Focus Pro 30K', '{"sensor": "Focus Pro 30K", "dpi_max": 30000, "weight_g": 59, "connection": "Wired USB", "buttons": 5, "shape": "Ergonomic Right-handed", "cable": "Speedflex", "polling_rate_hz": 8000, "switch_type": "Optical Gen-3", "feet": "100% PTFE"}', 79, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.razer.com/gaming-mice/razer-deathadder-v3/', 88, true, true),

('Souris', 'Logitech G Pro X Superlight 2', 'Logitech', 'Souris gaming sans fil ultra-legere, reference esport', '{"sensor": "HERO 2", "dpi_max": 32000, "weight_g": 60, "connection": "Wireless (LIGHTSPEED) + USB", "buttons": 5, "shape": "Ambidextrous", "battery_hours": 95, "polling_rate_hz": 2000, "switch_type": "LIGHTFORCE Hybrid", "feet": "100% PTFE"}', 149, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.logitechg.com/en-ch/products/gaming-mice/pro-x2-superlight-wireless-mouse.html', 95, true, true),

('Souris', 'SteelSeries Aerox 5', 'SteelSeries', 'Souris gaming legere avec coque perforee et 9 boutons', '{"sensor": "TrueMove Air", "dpi_max": 18000, "weight_g": 66, "connection": "Wired USB-C", "buttons": 9, "shape": "Ergonomic Right-handed", "cable": "Super Mesh", "polling_rate_hz": 1000, "switch_type": "Golden Micro IP54", "feet": "100% PTFE"}', 69, 0, NULL, NULL, NULL, NULL, 2022, 'https://steelseries.com/gaming-mice/aerox-5', 78, true, true),

('Souris', 'Razer Viper V3 Pro', 'Razer', 'Souris gaming sans fil haut de gamme, 54g ultra-legere', '{"sensor": "Focus Pro 30K Gen-2", "dpi_max": 35000, "weight_g": 54, "connection": "Wireless (HyperSpeed) + USB-C", "buttons": 5, "shape": "Ambidextrous", "battery_hours": 95, "polling_rate_hz": 8000, "switch_type": "Optical Gen-3", "feet": "100% PTFE"}', 169, 0, NULL, NULL, NULL, NULL, 2024, 'https://www.razer.com/gaming-mice/razer-viper-v3-pro/', 90, true, true),

('Souris', 'Corsair M75 Air', 'Corsair', 'Souris gaming sans fil legere avec capteur Marksman', '{"sensor": "Marksman", "dpi_max": 26000, "weight_g": 60, "connection": "Wireless (SLIPSTREAM) + Bluetooth + USB-C", "buttons": 6, "shape": "Ergonomic Right-handed", "battery_hours": 100, "polling_rate_hz": 2000, "switch_type": "Omron", "feet": "100% PTFE"}', 119, 0, NULL, NULL, NULL, NULL, 2024, 'https://www.corsair.com/m75-air', 84, true, true),

('Souris', 'Zowie EC2', 'Zowie', 'Souris gaming filaire ergonomique, reference CS esport', '{"sensor": "3360", "dpi_max": 3200, "weight_g": 90, "connection": "Wired USB", "buttons": 5, "shape": "Ergonomic Right-handed", "cable": "Rubber", "polling_rate_hz": 1000, "switch_type": "Huano", "feet": "Large PTFE", "dpi_steps": [400, 800, 1600, 3200]}', 69, 0, NULL, NULL, NULL, NULL, 2019, 'https://zowie.benq.com/en/product/mouse/ec/ec2.html', 80, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Casques (Headsets)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Casque', 'SteelSeries Arctis Nova 7', 'SteelSeries', 'Casque gaming sans fil multi-plateforme avec ANC', '{"type": "Over-ear", "driver_mm": 40, "frequency_response": "20-22000 Hz", "impedance_ohm": 36, "connection": "Wireless 2.4GHz + Bluetooth + USB-C", "microphone": "Retractable ClearCast Gen 2", "noise_cancelling": true, "battery_hours": 38, "weight_g": 325, "surround_sound": "360 Spatial Audio", "rgb": false}', 179, 0, NULL, NULL, NULL, NULL, 2022, 'https://steelseries.com/gaming-headsets/arctis-nova-7', 92, true, true),

('Casque', 'Corsair HS80 RGB Wireless', 'Corsair', 'Casque gaming sans fil confortable avec Dolby Atmos', '{"type": "Over-ear", "driver_mm": 50, "frequency_response": "20-40000 Hz", "impedance_ohm": 32, "connection": "Wireless (SLIPSTREAM) + USB", "microphone": "Flip-to-mute omnidirectional", "noise_cancelling": false, "battery_hours": 20, "weight_g": 368, "surround_sound": "Dolby Atmos", "rgb": true}', 129, 0, NULL, NULL, NULL, NULL, 2021, 'https://www.corsair.com/hs80-rgb-wireless', 85, true, true),

('Casque', 'HyperX Cloud III Wireless', 'HyperX', 'Casque gaming sans fil confortable avec micro detachable', '{"type": "Over-ear", "driver_mm": 53, "frequency_response": "10-21000 Hz", "impedance_ohm": 64, "connection": "Wireless 2.4GHz + USB-C", "microphone": "Detachable bidirectional", "noise_cancelling": false, "battery_hours": 120, "weight_g": 330, "surround_sound": "DTS Headphone:X", "rgb": false}', 149, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.hyperxgaming.com/en/headsets/cloud-iii-wireless', 88, true, true),

('Casque', 'Razer BlackShark V2 Pro', 'Razer', 'Casque gaming sans fil esport avec isolation passive', '{"type": "Over-ear Closed", "driver_mm": 50, "frequency_response": "12-28000 Hz", "impedance_ohm": 32, "connection": "Wireless (HyperSpeed) + Bluetooth + USB-C", "microphone": "Detachable HyperClear Super Wideband", "noise_cancelling": false, "battery_hours": 70, "weight_g": 320, "surround_sound": "THX Spatial Audio", "rgb": false}', 169, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.razer.com/gaming-headsets/razer-blackshark-v2-pro/', 89, true, true),

('Casque', 'ASUS ROG Delta S', 'ASUS', 'Casque gaming filaire avec DAC ESS Quad et MQA', '{"type": "Over-ear Closed", "driver_mm": 50, "frequency_response": "20-40000 Hz", "impedance_ohm": 32, "connection": "USB-C + 3.5mm", "microphone": "AI noise-cancelling bidirectional", "noise_cancelling": false, "battery_hours": null, "weight_g": 310, "surround_sound": "7.1 Virtual", "rgb": true, "dac": "ESS 9281 Quad DAC"}', 159, 0, NULL, NULL, NULL, NULL, 2021, 'https://rog.asus.com/headsets-audio/headsets/rog-delta-s/', 80, true, true),

('Casque', 'Logitech G PRO X 2 LIGHTSPEED', 'Logitech', 'Casque gaming sans fil pro avec drivers graphene 50mm', '{"type": "Over-ear Closed", "driver_mm": 50, "frequency_response": "20-20000 Hz", "impedance_ohm": 38, "connection": "Wireless (LIGHTSPEED) + Bluetooth + 3.5mm", "microphone": "Detachable 6mm", "noise_cancelling": false, "battery_hours": 50, "weight_g": 309, "surround_sound": "DTS Headphone:X 2.0", "rgb": false, "driver_type": "Pro-G Graphene"}', 199, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.logitechg.com/en-ch/products/gaming-audio/pro-x-2-lightspeed-wireless-headset.html', 87, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Chaises gaming (Gaming Chairs)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Chaise gaming', 'Secretlab Titan Evo 2024', 'Secretlab', 'Chaise gaming premium avec support lombaire magnetique', '{"type": "Gaming Chair", "material": "NEO Hybrid Leatherette", "max_weight_kg": 130, "max_height_cm": 195, "recline_degrees": 165, "armrests": "4D", "lumbar_support": "Magnetic", "headrest": "Magnetic Memory Foam", "base": "Aluminium", "casters": "Soft-roll", "warranty_years": 5}', 499, 0, NULL, NULL, NULL, NULL, 2024, 'https://secretlab.ch/collections/titan-evo', 92, true, true),

('Chaise gaming', 'noblechairs HERO', 'noblechairs', 'Chaise gaming haut de gamme avec assise large et confortable', '{"type": "Gaming Chair", "material": "PU Leather", "max_weight_kg": 150, "max_height_cm": 200, "recline_degrees": 135, "armrests": "4D", "lumbar_support": "Adjustable Built-in", "headrest": "Included Pillow", "base": "Aluminium", "casters": "Soft-roll", "warranty_years": 2}', 449, 0, NULL, NULL, NULL, NULL, 2022, 'https://www.noblechairs.com/hero-series/gaming-chair-pu-leather', 85, true, true),

('Chaise gaming', 'Corsair TC200', 'Corsair', 'Chaise gaming confortable avec coussins amovibles', '{"type": "Gaming Chair", "material": "Fabric / Leatherette", "max_weight_kg": 120, "max_height_cm": 190, "recline_degrees": 160, "armrests": "4D", "lumbar_support": "Pillow", "headrest": "Memory Foam Pillow", "base": "Steel", "casters": "Dual-wheel", "warranty_years": 2}', 299, 0, NULL, NULL, NULL, NULL, 2023, 'https://www.corsair.com/tc200', 80, true, true),

('Chaise gaming', 'IKEA Markus', 'IKEA', 'Chaise ergonomique budget, excellent confort pour le prix', '{"type": "Ergonomic Office Chair", "material": "Mesh / Fabric", "max_weight_kg": 110, "max_height_cm": 190, "recline_degrees": 120, "armrests": "Fixed", "lumbar_support": "Built-in", "headrest": "Integrated", "base": "Steel", "casters": "Standard", "warranty_years": 10}', 199, 0, NULL, NULL, NULL, NULL, 2012, 'https://www.ikea.com/ch/fr/p/markus-chaise-de-bureau-vissle-gris-fonce-70261150/', 88, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;

-- ============================================================
-- Tapis de souris (Mouse Pads)
-- ============================================================
INSERT INTO components (type, name, brand, description, specs, price_ch, price_fr, socket, chipset, form_factor, tdp, release_year, manufacturer_url, popularity_score, available_ch, active)
VALUES
('Tapis de souris', 'SteelSeries QcK Heavy XXL', 'SteelSeries', 'Tapis de souris XXL epais avec surface micro-tissee', '{"type": "Cloth", "size": "XXL", "dimensions_mm": "900 x 400 x 6", "thickness_mm": 6, "surface": "Micro-woven cloth", "base": "Non-slip rubber", "stitched_edges": true, "rgb": false, "washable": true}', 39, 0, NULL, NULL, NULL, NULL, 2019, 'https://steelseries.com/gaming-mousepads/qck-heavy-series', 88, true, true),

('Tapis de souris', 'Razer Gigantus V2 XXL', 'Razer', 'Tapis de souris XXL optimise pour tracking precis', '{"type": "Cloth", "size": "XXL", "dimensions_mm": "940 x 410 x 4", "thickness_mm": 4, "surface": "Textured micro-weave", "base": "Non-slip rubber", "stitched_edges": true, "rgb": false, "washable": true}', 29, 0, NULL, NULL, NULL, NULL, 2020, 'https://www.razer.com/gaming-mouse-mats/razer-gigantus-v2/', 85, true, true),

('Tapis de souris', 'Corsair MM700 RGB', 'Corsair', 'Tapis de souris XXL avec eclairage RGB perimetrique', '{"type": "Cloth", "size": "XXL", "dimensions_mm": "930 x 400 x 4", "thickness_mm": 4, "surface": "Micro-textured cloth", "base": "Non-slip rubber", "stitched_edges": true, "rgb": true, "usb_passthrough": true, "connection": "USB", "washable": false}', 59, 0, NULL, NULL, NULL, NULL, 2020, 'https://www.corsair.com/mm700-rgb', 80, true, true),

('Tapis de souris', 'Logitech G840 XL', 'Logitech', 'Tapis de souris XL avec surface en tissu performante', '{"type": "Cloth", "size": "XL", "dimensions_mm": "900 x 400 x 3", "thickness_mm": 3, "surface": "Performance-tuned cloth", "base": "Natural rubber", "stitched_edges": false, "rgb": false, "washable": true}', 39, 0, NULL, NULL, NULL, NULL, 2019, 'https://www.logitechg.com/en-ch/products/gaming-mouse-pads/g840-xl-gaming-mouse-pad.html', 82, true, true)

ON CONFLICT (name) DO UPDATE SET
  type = EXCLUDED.type, brand = EXCLUDED.brand, description = EXCLUDED.description,
  specs = EXCLUDED.specs, price_ch = EXCLUDED.price_ch, price_fr = EXCLUDED.price_fr,
  socket = EXCLUDED.socket, chipset = EXCLUDED.chipset, form_factor = EXCLUDED.form_factor,
  tdp = EXCLUDED.tdp, release_year = EXCLUDED.release_year, manufacturer_url = EXCLUDED.manufacturer_url,
  popularity_score = EXCLUDED.popularity_score, available_ch = EXCLUDED.available_ch, active = EXCLUDED.active;
