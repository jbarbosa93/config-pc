import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gxremrjbwtnmiiiujjem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cmVtcmpid3RubWlpaXVqamVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NzkzMCwiZXhwIjoyMDkwNjIzOTMwfQ.ynksSlAEHy-xKdiI6o11s_Qe02ojLmQexQiYuLcm6EQ'
);

// Broader pattern matching for remaining products
const PATTERNS = [
  // Alimentation
  [/Thor/i, 'https://dlcdnwebimgs.asus.com/gain/rog-thor-1200p2-702x390.png'],
  [/SF750|Corsair SF/i, 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CP-9020186-EU_01.png'],
  [/DeepCool.*PX/i, 'https://www.deepcool.com/media/px1000g-702x390.png'],
  // Boîtier
  [/Prime AP201|Asus Prime AP/i, 'https://dlcdnwebimgs.asus.com/gain/prime-ap201-702x390.png'],
  [/Dark Base 900/i, 'https://www.bequiet.com/admin/ImageServer.php?ID=dark-base-900-702x390.png'],
  [/Silent Base 802/i, 'https://www.bequiet.com/admin/ImageServer.php?ID=silent-base-802-702x390.png'],
  [/MasterBox TD500/i, 'https://www.coolermaster.com/media/td500-mesh-702x390.png'],
  [/7000D/i, 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CC-9011218-WW_01.png'],
  [/DeepCool CH510/i, 'https://www.deepcool.com/media/ch510-702x390.png'],
  [/InWin 303/i, 'https://www.in-win.com/uploads/303c-702x390.png'],
  [/LANCOOL 216/i, 'https://lian-li.com/wp-content/uploads/lancool-216-702x390.png'],
  [/Lancool II|LANCOOL II/i, 'https://lian-li.com/wp-content/uploads/lancool-ii-mesh-702x390.png'],
  [/PC-O11 Dynamic EVO/i, 'https://lian-li.com/wp-content/uploads/o11-dynamic-evo-702x390.png'],
  [/PC-O11 Dynamic White|PC-O11 Dynamic$/i, 'https://lian-li.com/wp-content/uploads/o11-dynamic-702x390.png'],
  [/Silverstone FARA/i, 'https://www.silverstonetek.com/upload/fara-r1-702x390.png'],
  [/Thermaltake Tower 500/i, 'https://www.thermaltake.com/media/tower-500-702x390.png'],
  // Carte mère
  [/ASUS PRIME A620/i, 'https://dlcdnwebimgs.asus.com/gain/prime-a620m-702x390.png'],
  [/ASUS PRIME B550/i, 'https://dlcdnwebimgs.asus.com/gain/prime-b550-702x390.png'],
  [/ASUS PRIME Z790/i, 'https://dlcdnwebimgs.asus.com/gain/prime-z790-702x390.png'],
  [/ASUS TUF/i, 'https://dlcdnwebimgs.asus.com/gain/tuf-gaming-702x390.png'],
  [/ASUS ROG/i, 'https://dlcdnwebimgs.asus.com/gain/rog-strix-702x390.png'],
  [/ASUS ProArt/i, 'https://dlcdnwebimgs.asus.com/gain/proart-702x390.png'],
  [/MSI MAG/i, 'https://asset.msi.com/resize/image/global/product/product_msi-mag-702x390.png'],
  [/MSI MPG/i, 'https://asset.msi.com/resize/image/global/product/product_msi-mpg-702x390.png'],
  [/MSI MEG/i, 'https://asset.msi.com/resize/image/global/product/product_msi-meg-702x390.png'],
  [/MSI PRO/i, 'https://asset.msi.com/resize/image/global/product/product_msi-pro-702x390.png'],
  [/Gigabyte/i, 'https://www.gigabyte.com/FileUpload/Global/GMOImage/gigabyte-motherboard-702x390.png'],
  [/ASRock/i, 'https://www.asrock.com/mb/photo/asrock-motherboard-702x390.png'],
  // CPU
  [/Ryzen 9/i, 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-9-702x390.jpg'],
  [/Ryzen 7/i, 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-7-702x390.jpg'],
  [/Ryzen 5/i, 'https://www.amd.com/content/dam/amd/en/images/products/processors/ryzen/2505503-amd-ryzen-5-702x390.jpg'],
  [/Core Ultra/i, 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2024-10/core-ultra-200s-702x390.png'],
  [/Core i[957]/i, 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/core-702x390.png'],
  // GPU
  [/RTX 50/i, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-5090/geforce-rtx-5090-702x390.jpg'],
  [/RTX 40/i, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ada/rtx-4070/geforce-ada-4070-702x390.jpg'],
  [/RTX 30/i, 'https://images.nvidia.com/aem-dam/Solutions/geforce/ampere/rtx-3060/geforce-rtx-3060-702x390.jpg'],
  [/Radeon RX 7/i, 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-7800xt-702x390.jpg'],
  [/Radeon RX 6/i, 'https://www.amd.com/content/dam/amd/en/images/products/graphics/radeon/rx-6700xt-702x390.jpg'],
  [/Intel Arc/i, 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2024-12/arc-b580-702x390.png'],
  // RAM
  [/Corsair.*DDR5/i, 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CMK32GX5M2B5600C36_01.png'],
  [/Corsair.*DDR4/i, 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CMK32GX4M2E3200C16_01.png'],
  [/G\.?Skill.*DDR5/i, 'https://www.gskill.com/img/pr/TridentZ5_RGB/TridentZ5_RGB-01.png'],
  [/G\.?Skill.*DDR4/i, 'https://www.gskill.com/img/pr/RipjawsV/RipjawsV-01.png'],
  [/Kingston.*DDR5/i, 'https://media.kingston.com/kingston/product/DDR5_FURY_Beast_Black_2pc-lg.jpg'],
  [/Kingston.*DDR4/i, 'https://media.kingston.com/kingston/product/DDR4_FURY_Beast_Black_2pc-lg.jpg'],
  [/TeamGroup|T-Force/i, 'https://www.teamgroupinc.com/uploads/product_sort/product_sort-D3-20221122152403.png'],
  // Stockage
  [/Samsung 9[89]0/i, 'https://image-us.samsung.com/SamsungUS/home/computing/memory-storage/990-pro/MZ-V9P1T0B-AM/MZ-V9P1T0B-AM_001_Front_Black-702x390.jpg'],
  [/Samsung 870/i, 'https://image-us.samsung.com/SamsungUS/home/computing/memory-storage/870-evo/MZ-77E1T0B-AM/MZ-77E1T0B-AM_001_Front_Black-702x390.jpg'],
  [/WD Black/i, 'https://www.westerndigital.com/content/dam/store/en-us/assets/products/internal-storage/wd-black-sn850x-nvme-ssd/gallery/wd-black-sn850x-702x390.png'],
  [/Crucial T[57]00/i, 'https://content.crucial.com/content/dam/crucial/ssd-products/t500/images/web/Crucial-T500-702x390.png'],
  [/Crucial MX/i, 'https://content.crucial.com/content/dam/crucial/ssd-products/mx500/images/web/Crucial-MX500-702x390.png'],
  [/Kingston NV/i, 'https://media.kingston.com/kingston/product/SNV2S_1000G-lg.jpg'],
  [/Seagate/i, 'https://www.seagate.com/content/dam/seagate/assets/products/internal-hard-drives/firecuda-530-ssd/images/firecuda-530-702x390.png'],
  [/Corsair MP/i, 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CSSD-F1000GBMP700_01.png'],
  // Refroidissement
  [/Noctua/i, 'https://noctua.at/media/catalog/product/n/h/nh_d15_chromax_black_1.jpg'],
  [/be quiet!.*Rock/i, 'https://www.bequiet.com/admin/ImageServer.php?ID=dark-rock-pro-5-702x390.png'],
  [/DeepCool.*AK|DeepCool.*Assassin/i, 'https://www.deepcool.com/media/ak620-702x390.png'],
  [/Arctic.*Freezer.*36/i, 'https://www.arctic.de/media/arctic-freezer-36-702x390.png'],
  [/Arctic.*Liquid/i, 'https://www.arctic.de/media/liquid-freezer-iii-360-702x390.png'],
  [/Kraken/i, 'https://nzxt.com/assets/cms/2024/Kraken-Elite-360-702x390.png'],
  [/Corsair.*H[12]\d\di/i, 'https://www.corsair.com/corsairmedia/sys_master/productcontent/CW-9060074-WW_01.png'],
  [/DeepCool.*L[TS]/i, 'https://www.deepcool.com/media/lt720-702x390.png'],
  [/Galahad/i, 'https://lian-li.com/wp-content/uploads/galahad-ii-trinity-360-702x390.png'],
  [/Ryujin/i, 'https://dlcdnwebimgs.asus.com/gain/rog-ryujin-iii-360-702x390.png'],
  [/Silent Loop/i, 'https://www.bequiet.com/admin/ImageServer.php?ID=silent-loop-2-360-702x390.png'],
  // Moniteur
  [/Razer|Corsair|SteelSeries|Logitech|HyperX|BenQ|ASUS|Samsung|LG|Dell|AOC|MSI|Alienware/i, null], // skip for now
];

async function run() {
  // Get all components without images
  const { data: components, error } = await supabase
    .from('components')
    .select('id, name, type, component_images(id)');

  if (error) { console.error('Error:', error.message); return; }

  const missing = components.filter(c => !c.component_images || c.component_images.length === 0);
  console.log(`Components missing images: ${missing.length}`);

  const toInsert = [];
  const stillMissing = [];

  for (const comp of missing) {
    let url = null;
    for (const [pattern, imgUrl] of PATTERNS) {
      if (imgUrl && pattern.test(comp.name)) {
        url = imgUrl;
        break;
      }
    }
    if (url) {
      toInsert.push({
        component_id: comp.id,
        url,
        is_primary: true,
        alt_text: comp.name,
        order_index: 0,
      });
    } else {
      stillMissing.push(`${comp.name} (${comp.type})`);
    }
  }

  console.log(`Will add images: ${toInsert.length}`);
  console.log(`Still missing: ${stillMissing.length}`);
  if (stillMissing.length > 0) console.log('Missing:', stillMissing.join(', '));

  if (toInsert.length === 0) return;

  const { error: insertErr } = await supabase
    .from('component_images')
    .insert(toInsert);

  if (insertErr) {
    console.error('Insert error:', insertErr.message);
  } else {
    console.log(`Done! ${toInsert.length} images added.`);
  }
}

run();
