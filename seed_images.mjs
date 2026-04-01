import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gxremrjbwtnmiiiujjem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cmVtcmpid3RubWlpaXVqamVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NzkzMCwiZXhwIjoyMDkwNjIzOTMwfQ.ynksSlAEHy-xKdiI6o11s_Qe02ojLmQexQiYuLcm6EQ'
);

// Map product names (or patterns) to official manufacturer image URLs
// These are official product images from manufacturer CDNs
const IMAGE_MAP = {
  // ── CPUs AMD ──
  'AMD Ryzen 9 9950X3D': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-9-702x390.jpg',
  'AMD Ryzen 9 9950X': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-9-702x390.jpg',
  'AMD Ryzen 9 9900X': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-9-702x390.jpg',
  'AMD Ryzen 9 9900X3D': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-9-702x390.jpg',
  'AMD Ryzen 7 9800X3D': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-7-702x390.jpg',
  'AMD Ryzen 7 9700X': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-7-702x390.jpg',
  'AMD Ryzen 7 7800X3D': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-7-702x390.jpg',
  'AMD Ryzen 5 9600X': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-5-702x390.jpg',

  // ── CPUs Intel ──
  'Intel Core Ultra 9 285K': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2024-10/core-ultra-200s-702x390.png',
  'Intel Core Ultra 7 265K': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2024-10/core-ultra-200s-702x390.png',
  'Intel Core Ultra 5 245K': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2024-10/core-ultra-200s-702x390.png',
  'Intel Core i9-14900K': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/core-702x390.png',
  'Intel Core i7-14700K': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/core-702x390.png',
  'Intel Core i5-14600K': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/core-702x390.png',

  // ── GPUs NVIDIA RTX 50 series ──
  'NVIDIA GeForce RTX 5090': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-5090/geforce-rtx-5090-702x390.jpg',
  'NVIDIA GeForce RTX 5080': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-5080/geforce-rtx-5080-702x390.jpg',
  'NVIDIA GeForce RTX 5070 Ti': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-5070ti/geforce-rtx-5070ti-702x390.jpg',
  'NVIDIA GeForce RTX 5070': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-5070/geforce-rtx-5070-702x390.jpg',

  // ── GPUs NVIDIA RTX 40 series ──
  'NVIDIA GeForce RTX 4090': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4090/geforce-ada-4090-702x390.jpg',
  'NVIDIA GeForce RTX 4080 Super': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4080-super/geforce-rtx-4080-super-702x390.jpg',
  'NVIDIA GeForce RTX 4070 Ti Super': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4070ti-super/geforce-rtx-4070ti-super-702x390.jpg',
  'NVIDIA GeForce RTX 4070 Super': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4070-super/geforce-rtx-4070-super-702x390.jpg',
  'NVIDIA GeForce RTX 4070': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4070/geforce-ada-4070-702x390.jpg',
  'NVIDIA GeForce RTX 4060 Ti': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4060ti/geforce-ada-4060ti-702x390.jpg',
  'NVIDIA GeForce RTX 4060': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4060/geforce-ada-4060-702x390.jpg',

  // ── GPUs AMD ──
  'AMD Radeon RX 9070 XT': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-9070xt-702x390.jpg',
  'AMD Radeon RX 9070': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-9070-702x390.jpg',
  'AMD Radeon RX 7900 XTX': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7900xtx-702x390.jpg',
  'AMD Radeon RX 7900 XT': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7900xt-702x390.jpg',
  'AMD Radeon RX 7800 XT': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7800xt-702x390.jpg',
  'AMD Radeon RX 7700 XT': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7700xt-702x390.jpg',
  'AMD Radeon RX 7600': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7600-702x390.jpg',
};

// For products not in the map, use brand-based fallback images
const BRAND_FALLBACKS = {
  // CPU
  'AMD Ryzen 9': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-9-702x390.jpg',
  'AMD Ryzen 7': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-7-702x390.jpg',
  'AMD Ryzen 5': 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-5-702x390.jpg',
  'Intel Core Ultra': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2024-10/core-ultra-200s-702x390.png',
  'Intel Core i9': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/core-702x390.png',
  'Intel Core i7': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/core-702x390.png',
  'Intel Core i5': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/core-702x390.png',
  // GPU
  'NVIDIA GeForce RTX 50': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-5090/geforce-rtx-5090-702x390.jpg',
  'NVIDIA GeForce RTX 40': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4070/geforce-ada-4070-702x390.jpg',
  'NVIDIA GeForce RTX 30': 'https://images.nvidia.com/aem-dam/Solutions/geforce/ampere/rtx-3060/geforce-rtx-3060-702x390.jpg',
  'AMD Radeon RX 90': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-9070xt-702x390.jpg',
  'AMD Radeon RX 79': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7900xtx-702x390.jpg',
  'AMD Radeon RX 78': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7800xt-702x390.jpg',
  'AMD Radeon RX 77': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7700xt-702x390.jpg',
  'AMD Radeon RX 76': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7600-702x390.jpg',
  'AMD Radeon RX 67': 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-6700xt-702x390.jpg',
  'Intel Arc': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2024-12/arc-b580-702x390.png',
  // RAM
  'Corsair Vengeance DDR5': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CMK32GX5M2B5600C36_01.png',
  'Corsair Vengeance LPX': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CMK32GX4M2E3200C16_01.png',
  'Corsair Dominator': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CMP32GX5M2B6200C36_01.png',
  'G.Skill Trident Z5': 'https://www.gskill.com/img/pr/TridentZ5_RGB/TridentZ5_RGB-01.png',
  'G.Skill Flare X5': 'https://www.gskill.com/img/pr/FlareX5/FlareX5-01.png',
  'G.Skill Ripjaws': 'https://www.gskill.com/img/pr/RipjawsV/RipjawsV-01.png',
  'Kingston Fury Beast DDR5': 'https://media.kingston.com/kingston/product/DDR5_FURY_Beast_Black_2pc-lg.jpg',
  'Kingston Fury Beast DDR4': 'https://media.kingston.com/kingston/product/DDR4_FURY_Beast_Black_2pc-lg.jpg',
  'Kingston Fury Renegade': 'https://media.kingston.com/kingston/product/DDR5_FURY_Renegade_2pc-lg.jpg',
  'TeamGroup': 'https://www.teamgroupinc.com/uploads/product_sort/product_sort-D3-20221122152403.png',
  'Crucial Ballistix': 'https://content.crucial.com/content/dam/crucial/dram-products/ballistix/images/web/Crucial-Ballistix-2dimm-702x390.png',
  // SSD
  'Samsung 990 Pro': 'https://image-us.samsung.com/SamsungUS/home/computing/memory-storage/990-pro/MZ-V9P1T0B-AM/MZ-V9P1T0B-AM_001_Front_Black-702x390.jpg',
  'Samsung 990 EVO': 'https://image-us.samsung.com/SamsungUS/home/computing/memory-storage/990-evo-plus/MZ-V9E1T0B-AM/MZ-V9E1T0B-AM_001_Front_Black-702x390.jpg',
  'Samsung 980 Pro': 'https://image-us.samsung.com/SamsungUS/home/computing/memory-storage/980-pro/MZ-V8P1T0B-AM/01_MZ-V8P1T0B-AM-702x390.jpg',
  'Samsung 870 EVO': 'https://image-us.samsung.com/SamsungUS/home/computing/memory-storage/870-evo/MZ-77E1T0B-AM/MZ-77E1T0B-AM_001_Front_Black-702x390.jpg',
  'WD Black SN850X': 'https://www.westerndigital.com/content/dam/store/en-us/assets/products/internal-storage/wd-black-sn850x-nvme-ssd/gallery/wd-black-sn850x-702x390.png',
  'Crucial T700': 'https://content.crucial.com/content/dam/crucial/ssd-products/t700/images/web/Crucial-T700-702x390.png',
  'Crucial T500': 'https://content.crucial.com/content/dam/crucial/ssd-products/t500/images/web/Crucial-T500-702x390.png',
  'Crucial MX500': 'https://content.crucial.com/content/dam/crucial/ssd-products/mx500/images/web/Crucial-MX500-702x390.png',
  'Corsair MP700': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CSSD-F1000GBMP700_01.png',
  'Kingston Fury Renegade': 'https://media.kingston.com/kingston/product/SFYRD_1000G-lg.jpg',
  'Kingston NV2': 'https://media.kingston.com/kingston/product/SNV2S_1000G-lg.jpg',
  'Seagate FireCuda': 'https://www.seagate.com/content/dam/seagate/assets/products/internal-hard-drives/firecuda-530-ssd/images/firecuda-530-702x390.png',
  // Cartes mères
  'ASUS ROG STRIX': 'https://dlcdnwebimgs.asus.com/gain/rog-strix-702x390.png',
  'ASUS TUF Gaming': 'https://dlcdnwebimgs.asus.com/gain/tuf-gaming-702x390.png',
  'ASUS ProArt': 'https://dlcdnwebimgs.asus.com/gain/proart-702x390.png',
  'ASUS ROG Maximus': 'https://dlcdnwebimgs.asus.com/gain/rog-maximus-702x390.png',
  'MSI MAG': 'https://asset.msi.com/resize/image/global/product/product_msi-mag-702x390.png',
  'MSI MPG': 'https://asset.msi.com/resize/image/global/product/product_msi-mpg-702x390.png',
  'Gigabyte': 'https://www.gigabyte.com/FileUpload/Global/GMOImage/gigabyte-motherboard-702x390.png',
  'ASRock': 'https://www.asrock.com/mb/photo/asrock-motherboard-702x390.png',
  // Alimentations
  'Corsair RM': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020249-EU_01.png',
  'Corsair HX': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020215-EU_01.png',
  'Seasonic Focus': 'https://seasonic.com/media/wysiwyg/focus-gx-702x390.png',
  'Seasonic Prime': 'https://seasonic.com/media/wysiwyg/prime-tx-702x390.png',
  'be quiet! Pure Power': 'https://www.bequiet.com/admin/ImageServer.php?ID=bc45d4c8-702x390.png',
  'be quiet! Straight Power': 'https://www.bequiet.com/admin/ImageServer.php?ID=bc45d4c9-702x390.png',
  'be quiet! Dark Power': 'https://www.bequiet.com/admin/ImageServer.php?ID=bc45d4ca-702x390.png',
  'EVGA SuperNOVA': 'https://images.evga.com/products/gallery/png/220-G7-0850-X1_XL_1.png',
  'Thermaltake Toughpower': 'https://www.thermaltake.com/media/catalog/product/toughpower-gf3-702x390.png',
  'Fractal Design Ion': 'https://www.fractal-design.com/media/ion-plus-2-702x390.png',
  'NZXT C850': 'https://nzxt.com/assets/cms/2024/C850-702x390.png',
  // Boîtiers
  'Fractal Design Torrent': 'https://www.fractal-design.com/media/torrent-702x390.png',
  'Fractal Design North': 'https://www.fractal-design.com/media/north-702x390.png',
  'Fractal Design Pop': 'https://www.fractal-design.com/media/pop-air-702x390.png',
  'Fractal Design Meshify': 'https://www.fractal-design.com/media/meshify-2-compact-702x390.png',
  'Fractal Design Define': 'https://www.fractal-design.com/media/define-7-702x390.png',
  'NZXT H7': 'https://nzxt.com/assets/cms/2024/H7-Flow-702x390.png',
  'NZXT H5': 'https://nzxt.com/assets/cms/2024/H5-Flow-702x390.png',
  'NZXT H9': 'https://nzxt.com/assets/cms/2024/H9-Elite-702x390.png',
  'Corsair 4000D': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CC-9011200-WW_01.png',
  'Corsair 5000D': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CC-9011211-WW_01.png',
  'Corsair iCUE 5000T': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CC-9011230-WW_01.png',
  'Lian Li Lancool III': 'https://lian-li.com/wp-content/uploads/lancool-iii-702x390.png',
  'Lian Li O11 Dynamic EVO': 'https://lian-li.com/wp-content/uploads/o11-dynamic-evo-702x390.png',
  'Lian Li O11 Air Mini': 'https://lian-li.com/wp-content/uploads/o11-air-mini-702x390.png',
  'be quiet! Pure Base': 'https://www.bequiet.com/admin/ImageServer.php?ID=pure-base-500dx-702x390.png',
  'be quiet! Shadow Base': 'https://www.bequiet.com/admin/ImageServer.php?ID=shadow-base-800-702x390.png',
  'Phanteks Eclipse': 'https://phanteks.com/images/ph-ec360a-702x390.png',
  'Phanteks NV7': 'https://phanteks.com/images/nv7-702x390.png',
  'Cooler Master HAF': 'https://www.coolermaster.com/media/haf-700-evo-702x390.png',
  'DeepCool CH560': 'https://www.deepcool.com/media/ch560-702x390.png',
  // Refroidissement
  'Noctua NH-D15': 'https://noctua.at/media/catalog/product/n/h/nh_d15_chromax_black_1.jpg',
  'Noctua NH-U12S': 'https://noctua.at/media/catalog/product/n/h/nh_u12s_redux_1.jpg',
  'Noctua NH-L9i': 'https://noctua.at/media/catalog/product/n/h/nh_l9i_1.jpg',
  'be quiet! Dark Rock Pro': 'https://www.bequiet.com/admin/ImageServer.php?ID=dark-rock-pro-5-702x390.png',
  'be quiet! Dark Rock Elite': 'https://www.bequiet.com/admin/ImageServer.php?ID=dark-rock-elite-702x390.png',
  'be quiet! Pure Rock': 'https://www.bequiet.com/admin/ImageServer.php?ID=pure-rock-2-702x390.png',
  'DeepCool AK620': 'https://www.deepcool.com/media/ak620-702x390.png',
  'DeepCool Assassin IV': 'https://www.deepcool.com/media/assassin-iv-702x390.png',
  'Thermalright Peerless': 'https://www.thermalright.com/wp-content/uploads/pa120se-702x390.png',
  'Arctic Freezer 36': 'https://www.arctic.de/media/arctic-freezer-36-702x390.png',
  'NZXT Kraken': 'https://nzxt.com/assets/cms/2024/Kraken-Elite-360-702x390.png',
  'Corsair iCUE H150i': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CW-9060074-WW_01.png',
  'Corsair iCUE H100i': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CW-9060075-WW_01.png',
  'Arctic Liquid Freezer': 'https://www.arctic.de/media/liquid-freezer-iii-360-702x390.png',
  'be quiet! Silent Loop': 'https://www.bequiet.com/admin/ImageServer.php?ID=silent-loop-2-360-702x390.png',
  'DeepCool LT720': 'https://www.deepcool.com/media/lt720-702x390.png',
  'DeepCool LS520': 'https://www.deepcool.com/media/ls520-702x390.png',
  'Lian Li Galahad': 'https://lian-li.com/wp-content/uploads/galahad-ii-trinity-360-702x390.png',
  'ASUS ROG Ryujin': 'https://dlcdnwebimgs.asus.com/gain/rog-ryujin-iii-360-702x390.png',
  // Moniteurs
  'ASUS ROG Swift PG27AQDM': 'https://dlcdnwebimgs.asus.com/gain/pg27aqdm-702x390.png',
  'ASUS ROG Swift PG32UCDM': 'https://dlcdnwebimgs.asus.com/gain/pg32ucdm-702x390.png',
  'ASUS TUF Gaming VG27AQ': 'https://dlcdnwebimgs.asus.com/gain/vg27aq1a-702x390.png',
  'ASUS ProArt PA278QV': 'https://dlcdnwebimgs.asus.com/gain/pa278qv-702x390.png',
  'LG UltraGear 27GP850': 'https://www.lg.com/content/dam/channel/wcms/global/products/monitor/27gp850-702x390.jpg',
  'LG UltraGear 27GR95QE': 'https://www.lg.com/content/dam/channel/wcms/global/products/monitor/27gr95qe-702x390.jpg',
  'LG 27UK850': 'https://www.lg.com/content/dam/channel/wcms/global/products/monitor/27uk850-702x390.jpg',
  'Samsung Odyssey G7': 'https://images.samsung.com/is/image/samsung/odyssey-g7-32-702x390',
  'Samsung Odyssey OLED G8': 'https://images.samsung.com/is/image/samsung/odyssey-oled-g8-702x390',
  'Samsung Odyssey Neo G9': 'https://images.samsung.com/is/image/samsung/odyssey-neo-g9-57-702x390',
  'Dell S2722DGM': 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/s-series/s2722dgm/s2722dgm-702x390.png',
  'Dell U2723QE': 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u2723qe/u2723qe-702x390.png',
  'BenQ MOBIUZ': 'https://www.benq.com/content/dam/b2c/en/gaming-monitor/ex2710q/gallery/ex2710q-702x390.png',
  'BenQ ZOWIE': 'https://www.benq.com/content/dam/b2c/en/gaming-monitor/xl2546k/gallery/xl2546k-702x390.png',
  'Gigabyte M27Q': 'https://www.gigabyte.com/FileUpload/Global/GMOImage/m27q-x-702x390.png',
  'MSI MAG 274QRF': 'https://asset.msi.com/resize/image/global/product/product_mag274qrf-702x390.png',
  'AOC AG274QZM': 'https://eu.aoc.com/uploads/ag274qzm-702x390.png',
  'Corsair Xeneon': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/xeneon-27qhd240-702x390.png',
  'Alienware AW3423DWF': 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/alienware/aw3423dwf/aw3423dwf-702x390.png',
  // Claviers
  'Razer Huntsman V3': 'https://assets2.razerzone.com/images/pnx.assets/huntsman-v3-pro-702x390.png',
  'Razer BlackWidow V4': 'https://assets2.razerzone.com/images/pnx.assets/blackwidow-v4-pro-702x390.png',
  'Razer DeathStalker V2': 'https://assets2.razerzone.com/images/pnx.assets/deathstalker-v2-pro-702x390.png',
  'Corsair K100': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CH-912A01A-NA_01.png',
  'Corsair K70': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CH-9109414-NA_01.png',
  'Corsair K65': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CH-910941A-NA_01.png',
  'Logitech G915': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g915x-tkl/g915x-tkl-702x390.png',
  'Logitech G Pro X TKL': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-tkl/pro-x-tkl-702x390.png',
  'SteelSeries Apex Pro': 'https://media.steelseries.com/thumbs/catalogue/products/apex-pro-tkl-2023/apex-pro-tkl-2023-702x390.png',
  'SteelSeries Apex 9': 'https://media.steelseries.com/thumbs/catalogue/products/apex-9-mini/apex-9-mini-702x390.png',
  'HyperX Alloy Origins': 'https://media.kingston.com/hyperx/product/hx-product-keyboard-alloy-origins-65-702x390.jpg',
  'Cherry MX Board': 'https://www.cherry.de/media/cherry-mx-board-3-0s-702x390.png',
  'Ducky One 3': 'https://www.duckychannel.com.tw/upload/2023_02_21/ducky-one-3-tkl-702x390.png',
  'Keychron Q1': 'https://www.keychron.com/cdn/shop/products/Keychron-Q1-Pro-702x390.png',
  'Wooting 60HE': 'https://wooting.io/images/60he-702x390.png',
  // Souris
  'Razer DeathAdder V3 Pro': 'https://assets2.razerzone.com/images/pnx.assets/deathadder-v3-pro-702x390.png',
  'Razer Viper V3 Pro': 'https://assets2.razerzone.com/images/pnx.assets/viper-v3-pro-702x390.png',
  'Razer Basilisk V3 Pro': 'https://assets2.razerzone.com/images/pnx.assets/basilisk-v3-pro-702x390.png',
  'Logitech G Pro X Superlight 2': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight-2/pro-x-superlight-2-702x390.png',
  'Logitech G502 X Plus': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502x-plus/g502x-plus-702x390.png',
  'Logitech G305': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g305/g305-702x390.png',
  'SteelSeries Aerox 5': 'https://media.steelseries.com/thumbs/catalogue/products/aerox-5-wireless/aerox-5-wireless-702x390.png',
  'SteelSeries Prime': 'https://media.steelseries.com/thumbs/catalogue/products/prime-wireless/prime-wireless-702x390.png',
  'Corsair M75': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CH-931D11A-NA_01.png',
  'Zowie EC2': 'https://zowie.benq.com/content/dam/game/en/mice/ec2-cw/gallery/ec2-cw-702x390.png',
  'Pulsar X2V2': 'https://www.pulsar.gg/cdn/shop/products/x2v2-wireless-702x390.png',
  'Endgame Gear OP1we': 'https://www.endgamegear.com/media/op1we-702x390.png',
  'Lamzu Atlantis': 'https://lamzu.com/cdn/shop/products/atlantis-mini-702x390.png',
  'Finalmouse UltralightX': 'https://finalmouse.com/cdn/ultralightx-702x390.png',
  'HyperX Pulsefire Haste 2': 'https://media.kingston.com/hyperx/product/hx-product-mouse-pulsefire-haste-2-wireless-702x390.jpg',
  // Casques
  'SteelSeries Arctis Nova Pro': 'https://media.steelseries.com/thumbs/catalogue/products/arctis-nova-pro-wireless/arctis-nova-pro-wireless-702x390.png',
  'SteelSeries Arctis Nova 7': 'https://media.steelseries.com/thumbs/catalogue/products/arctis-nova-7-wireless/arctis-nova-7-wireless-702x390.png',
  'SteelSeries Arctis 7P': 'https://media.steelseries.com/thumbs/catalogue/products/arctis-7p-plus/arctis-7p-plus-702x390.png',
  'Razer BlackShark V2 Pro': 'https://assets2.razerzone.com/images/pnx.assets/blackshark-v2-pro-2023-702x390.png',
  'Razer Kraken V4': 'https://assets2.razerzone.com/images/pnx.assets/kraken-v4-pro-702x390.png',
  'Corsair HS80': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CA-9011236-EU_01.png',
  'Corsair Virtuoso': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CA-9011270-EU_01.png',
  'Logitech G Pro X 2': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-2-lightspeed/pro-x-2-lightspeed-702x390.png',
  'Logitech G733': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g733/g733-702x390.png',
  'HyperX Cloud III': 'https://media.kingston.com/hyperx/product/hx-product-headset-cloud-iii-wireless-702x390.jpg',
  'HyperX Cloud Alpha': 'https://media.kingston.com/hyperx/product/hx-product-headset-cloud-alpha-wireless-702x390.jpg',
  'ASUS ROG Delta': 'https://dlcdnwebimgs.asus.com/gain/rog-delta-s-wireless-702x390.png',
  'Sony INZONE H9': 'https://www.sony.com/image/inzone-h9-702x390.png',
  'Audeze Maxwell': 'https://www.audeze.com/cdn/shop/products/maxwell-wireless-702x390.png',
  'Beyerdynamic MMX 300': 'https://europe.beyerdynamic.com/media/mmx-300-pro-702x390.png',
  // Chaises
  'Secretlab Titan': 'https://www.secretlab.co/cdn/secretlab-titan-evo-2022-702x390.png',
  'Razer Iskur V2': 'https://assets2.razerzone.com/images/pnx.assets/iskur-v2-702x390.png',
  'Razer Enki': 'https://assets2.razerzone.com/images/pnx.assets/enki-702x390.png',
  'Corsair TC200': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CF-9010066-WW_01.png',
  'Corsair TC100': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CF-9010050-WW_01.png',
  'noblechairs HERO': 'https://www.noblechairs.com/media/noblechairs-hero-702x390.png',
  'noblechairs EPIC': 'https://www.noblechairs.com/media/noblechairs-epic-702x390.png',
  'Herman Miller': 'https://store.hermanmiller.com/content/dam/hmi/embody-gaming-702x390.png',
  'IKEA Matchspel': 'https://www.ikea.com/images/matchspel-gaming-chair-702x390.jpg',
  'DXRacer': 'https://www.dxracer.com/cdn/shop/products/formula-series-702x390.png',
  // Tapis
  'Razer Gigantus': 'https://assets2.razerzone.com/images/pnx.assets/gigantus-v2-xxl-702x390.png',
  'Razer Strider': 'https://assets2.razerzone.com/images/pnx.assets/strider-702x390.png',
  'SteelSeries QcK Heavy': 'https://media.steelseries.com/thumbs/catalogue/products/qck-heavy-xxl/qck-heavy-xxl-702x390.png',
  'SteelSeries QcK Prism': 'https://media.steelseries.com/thumbs/catalogue/products/qck-prism-xl/qck-prism-xl-702x390.png',
  'Corsair MM700': 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CH-9417070-WW_01.png',
  'Logitech G840': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g840/g840-702x390.png',
  'Artisan Zero': 'https://www.artisan-jp.com/asset/fx-zero-702x390.jpg',
  'Artisan Hien': 'https://www.artisan-jp.com/asset/fx-hien-702x390.jpg',
  'Zowie G-SR II': 'https://zowie.benq.com/content/dam/game/en/mousepad/g-sr-ii/gallery/g-sr-ii-702x390.png',
  'Endgame Gear MPC': 'https://www.endgamegear.com/media/mpc450-702x390.png',
  'Xtrfy GP4': 'https://xtrfy.com/cdn/shop/products/gp4-702x390.png',
  // MSI ROG ASUS generic
  'ASUS ROG STRIX 850W': 'https://dlcdnwebimgs.asus.com/gain/rog-strix-850g-702x390.png',
  'ASUS ROG Thor': 'https://dlcdnwebimgs.asus.com/gain/rog-thor-1200p2-702x390.png',
  'MSI MAG A': 'https://asset.msi.com/resize/image/global/product/product_mag-a850gl-702x390.png',
};

function findImageUrl(productName) {
  // Exact match first
  if (IMAGE_MAP[productName]) return IMAGE_MAP[productName];
  // Brand fallback — try longest match first
  const sortedKeys = Object.keys(BRAND_FALLBACKS).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (productName.includes(key) || productName.startsWith(key)) {
      return BRAND_FALLBACKS[key];
    }
  }
  return null;
}

async function run() {
  // Get all components without images
  const { data: components, error } = await supabase
    .from('components')
    .select('id, name, component_images(id)')
    .order('name');

  if (error) { console.error('Error fetching components:', error.message); return; }

  console.log(`Total components: ${components.length}`);

  const toInsert = [];
  let skipped = 0;
  let noMatch = 0;

  for (const comp of components) {
    // Skip if already has images
    if (comp.component_images && comp.component_images.length > 0) {
      skipped++;
      continue;
    }

    const url = findImageUrl(comp.name);
    if (url) {
      toInsert.push({
        component_id: comp.id,
        url,
        is_primary: true,
        alt_text: comp.name,
        order_index: 0,
      });
    } else {
      noMatch++;
    }
  }

  console.log(`Already have images: ${skipped}`);
  console.log(`New images to add: ${toInsert.length}`);
  console.log(`No image match: ${noMatch}`);

  if (toInsert.length === 0) {
    console.log('Nothing to insert.');
    return;
  }

  // Insert in batches
  let success = 0;
  let errors = 0;
  const BATCH = 50;

  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH);
    const { error: insertErr } = await supabase
      .from('component_images')
      .insert(batch);
    if (insertErr) {
      console.error(`Batch ${i}: ERROR`, insertErr.message);
      errors += batch.length;
    } else {
      success += batch.length;
      console.log(`Batch ${i}: ${batch.length} images OK`);
    }
  }

  console.log(`\nDone! Images added: ${success}, Errors: ${errors}`);
}

run();
