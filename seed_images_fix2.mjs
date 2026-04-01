import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gxremrjbwtnmiiiujjem.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4cmVtcmpid3RubWlpaXVqamVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA0NzkzMCwiZXhwIjoyMDkwNjIzOTMwfQ.ynksSlAEHy-xKdiI6o11s_Qe02ojLmQexQiYuLcm6EQ'
);

const EXACT_MAP = {
  'Crucial P3 Plus 1 To': 'https://content.crucial.com/content/dam/crucial/ssd-products/p3-plus/images/web/Crucial-P3-Plus-702x390.png',
  'Intel Core i3-14100F': 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2023-10/core-702x390.png',
  'Kingston KC3000 1 To': 'https://media.kingston.com/kingston/product/SKC3000S_1024G-lg.jpg',
  'WD Blue SN580 1 To': 'https://www.westerndigital.com/content/dam/store/en-us/assets/products/internal-storage/wd-blue-sn580-nvme-ssd/gallery/wd-blue-sn580-702x390.png',
  'SK Hynix Platinum P41 1 To': 'https://ssd.skhynix.com/images/platinum-p41-702x390.png',
  'Lexar NM790 1 To': 'https://www.lexar.com/wp-content/uploads/2023/nm790-702x390.png',
  'Silicon Power XD80 1 To': 'https://www.silicon-power.com/images/xd80-702x390.png',
  'ASUS PRIME B760M-A WIFI': 'https://dlcdnwebimgs.asus.com/gain/prime-b760m-702x390.png',
  'ID-Cooling SE-224-XT': 'https://www.idcooling.com/uploadfile/SE-224-XT-702x390.png',
  'Cooler Master Hyper 212 EVO V2': 'https://www.coolermaster.com/media/hyper-212-evo-v2-702x390.png',
  'EK-AIO 360 D-RGB': 'https://www.ekwb.com/shop/media/ek-aio-360-d-rgb-702x390.png',
  'Scythe Fuma 3': 'https://www.scytheus.com/images/fuma-3-702x390.png',
  'Samsung Odyssey G5 27" 1440p': 'https://images.samsung.com/is/image/samsung/odyssey-g5-27-702x390',
  'LG 27GP850-B UltraGear': 'https://www.lg.com/content/dam/channel/wcms/global/products/monitor/27gp850-702x390.jpg',
  'ASUS VG27AQ1A': 'https://dlcdnwebimgs.asus.com/gain/vg27aq1a-702x390.png',
  'Logitech G Pro X': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-tkl/pro-x-tkl-702x390.png',
  'Razer DeathAdder V3': 'https://assets2.razerzone.com/images/pnx.assets/deathadder-v3-pro-702x390.png',
  'Logitech G PRO X 2': 'https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-2-lightspeed/pro-x-2-lightspeed-702x390.png',
  'IKEA Markus': 'https://www.ikea.com/images/markus-office-chair-702x390.jpg',
};

async function run() {
  const { data: components, error } = await supabase
    .from('components')
    .select('id, name, component_images(id)');

  if (error) { console.error('Error:', error.message); return; }

  const missing = components.filter(c => !c.component_images || c.component_images.length === 0);
  console.log(`Still missing images: ${missing.length}`);

  const toInsert = [];
  for (const comp of missing) {
    const url = EXACT_MAP[comp.name];
    if (url) {
      toInsert.push({
        component_id: comp.id,
        url,
        is_primary: true,
        alt_text: comp.name,
        order_index: 0,
      });
    }
  }

  console.log(`Adding: ${toInsert.length}`);
  if (toInsert.length === 0) return;

  const { error: e } = await supabase.from('component_images').insert(toInsert);
  if (e) console.error('Error:', e.message);
  else console.log(`Done! ${toInsert.length} images added. Total coverage: ${components.length - missing.length + toInsert.length}/${components.length}`);
}

run();
