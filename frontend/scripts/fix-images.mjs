/**
 * Replace all broken Unsplash URLs with reliable Pexels image URLs.
 * Each Unsplash photo ID is mapped to a relevant Pexels image.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, '..', 'src');

// ── Mapping: Unsplash photo-ID → Pexels direct image URL ──
// Each Pexels URL is a direct .jpeg link that always works.
// Format: https://images.pexels.com/photos/{PEXELS_ID}/pexels-photo-{PEXELS_ID}.jpeg?auto=compress&cs=tinysrgb&w={W}&h={H}&dpr=1

const PEXELS_MAP = {
  // ── VESTIDOS (Dresses - Women) ──
  'photo-1572804013309-59a88b7e92f1': '1536619',   // Floral dress
  'photo-1595777457583-95e059d581b8': '1755428',   // Elegant night dress
  'photo-1496747611176-843222e1e57c': '1021693',   // Casual summer dress
  'photo-1515372039744-b8f02a3ae446': '985635',    // Midi sustainable dress
  'photo-1612336307429-8a898d10e223': '1187957',   // Wrap elegant dress
  'photo-1509631179647-0177331693ae': '2220316',   // Boho chic dress

  // ── BLUSAS & TOPS (Women) ──
  'photo-1485968579580-b6d095142e6e': '1036623',   // Silk blouse
  'photo-1539109136881-3be0616acf4b': '2043590',   // Crop top casual
  'photo-1515886657613-9f3515b0c78f': '1462637',   // Off-shoulder blouse
  'photo-1564257631407-4deb1f99d992': '3622614',   // Organic linen top
  'photo-1551163943-3f6a855d1153': '2681751',      // Long sleeve blouse
  'photo-1503342217505-b0a15ec3261c': '1126993',   // Basic premium tee

  // ── FALDAS (Skirts) ──
  'photo-1583496661160-fb5886a0aaaa': '3622614',   // Pleated midi skirt → reuse fashion
  'photo-1577900232427-18219b9166a0': '1007018',   // Pencil skirt
  'photo-1592301933927-35b597393c0a': '2220316',   // Denim casual skirt
  'photo-1594633312681-425c7b97ccd1': '2220316',   // Maxi bohemia skirt → fashion
  'photo-1551854838-212c50b4c184': '1536619',      // Mini eco-leather skirt
  'photo-1582142306909-195724d33ffc': '2043590',   // Wrap printed skirt

  // ── CHAQUETAS (Jackets - Women) ──
  'photo-1591047139829-d91aecb6caea': '2887766',   // Smart casual jacket
  'photo-1544022613-e87ca75a784a': '1124468',      // Denim oversize jacket
  'photo-1551028719-00167b16eac5': '2897531',      // Executive blazer
  'photo-1548126032-079a0fb0099d': '1183266',      // Bomber eco jacket
  'photo-1521223890158-f9f7c3d5d504': '3622614',   // Vegan leather jacket
  'photo-1544923246-77307dd270b5': '2887766',      // Puffer light jacket

  // ── CAMISETAS PREMIUM (Men's T-shirts) ──
  'photo-1521572163474-6864f9cf17ab': '2897531',   // Pima cotton tee
  'photo-1581044777550-4cfa60707998': '1183266',   // Sport eco tee
  'photo-1562157873-818bc0726f68': '2897531',      // Premium tee (collection)
  'photo-1618354691373-d851c5c3a990': '3622614',   // Henley slim tee
  'photo-1586790170083-2f9ceadc732d': '1124468',   // Polo premium tee
  'photo-1583743814966-8936f5b7be1a': '2887766',   // V-neck organic tee
  'photo-1576566588028-4147f3842f27': '2897531',   // Oversize urban tee
  'photo-1529374255404-311a2a4f1fd9': '1183266',   // Long sleeve tech tee

  // ── CAMISAS (Men's Shirts) ──
  'photo-1596755094514-f87e34085b2c': '2897531',   // Oxford classic shirt
  'photo-1602810318383-e386cc2a3ccf': '1124468',   // Linen summer shirt
  'photo-1552374196-1ab2a1c593e8': '2887766',      // Man fashion
  'photo-1620012253295-c15cc3e65df4': '2897531',   // Slim fit executive shirt
  'photo-1589310243389-96a5483213a8': '1183266',   // Flannel casual shirt
  'photo-1588359348347-9bc6cbbb689e': '1124468',   // Denim western shirt
  'photo-1598033129183-c4f50c736c10': '2887766',   // Resort printed shirt

  // ── PANTALONES & JEANS (Men's Pants) ──
  'photo-1542272604-787c3835535d': '1598507',      // Slim fit jeans
  'photo-1624378439575-d8705ad7ae80': '1598507',   // Jeans
  'photo-1473966968600-fa801b869a1a': '2897531',   // Chino classic pants
  'photo-1541099649105-f69ad21f3246': '1598507',   // Straight vintage jeans
  'photo-1552902865-b72c031ac5ea': '2887766',      // Jogger urban pants
  'photo-1517438476312-10d79c077509': '1183266',   // Cargo outdoor pants
  'photo-1604176354204-9268737828e4': '1598507',   // Eco-denim jeans

  // ── CHAQUETAS & BLAZERS (Men) ──
  'photo-1507679799987-c73779587ccf': '2897531',   // Slim fit Italian blazer
  'photo-1520975954732-35dd22299614': '1124468',   // Genuine leather jacket
  'photo-1593030761757-71fae45fa0e7': '2887766',   // Casual deconstructed blazer
  'photo-1617127365659-c47fa864d8bc': '1183266',   // Suede elegant jacket
  'photo-1507003211169-0a1dd7228f2d': '2897531',   // Man suit (collection)

  // ── NIÑOS (Kids) ──
  'photo-1503944583220-79d8926ad5e2': '1620760',   // Girl dress
  'photo-1518831959646-742c3a14ebf7': '1620760',   // Girl fashion
  'photo-1519238263530-99bdd11df2ea': '1620760',   // Boy fashion
  'photo-1503454537195-1dcabb73ffb9': '1620760',   // Boy casual
  'photo-1543854589-fdd4d3a0d181': '1620760',      // Girl sport set
  'photo-1524504388940-b1c1722653e1': '1620760',   // Girl tutu skirt
  'photo-1471286174890-9c112ffca5b4': '1620760',   // Kids leggings
  'photo-1503919545889-aef636e10ad4': '1620760',   // Boy sport set
  'photo-1519457431-44ccd64a579b': '1620760',      // Boy bermuda
  'photo-1504593811423-6dd665756598': '1620760',   // Boy waterproof jacket

  // ── BEBÉ (Baby) ──
  'photo-1522771930-78848d9293e8': '3661263',      // Baby body
  'photo-1515488042361-ee00e0ddd4e4': '3661263',   // Baby set
  'photo-1519689680058-324335c77eba': '3661263',   // Baby pajama
  'photo-1519689373023-dd07c7988603': '3661263',   // Baby ceremony dress
  'photo-1544413660-299165566b1d': '3661263',      // Baby bib set

  // ── ZAPATOS (Shoes) ──
  'photo-1542291026-7eec264c27ff': '2529148',      // Red sneakers
  'photo-1560769629-975ec94e6a86': '1598505',      // Colorful sneakers
  'photo-1543163521-1bf539c55dd2': '336372',       // Stilettos
  'photo-1514989940723-e8e51635b782': '2529148',   // Kids sport shoes
  'photo-1549298916-b41d501d3772': '1598505',      // Sneakers premium
  'photo-1525966222134-fcfa99b8ae77': '2529148',   // Canvas eco shoes
  'photo-1491553895911-0055eca6402d': '1598505',   // Plush slippers
  'photo-1614252235316-8c857d38b5f4': '336372',    // Italian loafers
  'photo-1603487742131-4160ec999306': '1598505',    // Platform sandals
  'photo-1608256246200-53e635b5b65f': '2529148',    // Chelsea eco boots

  // ── BEAUTY - Fragancias ──
  'photo-1541643600914-78b084683601': '965989',     // Perfume bottle
  'photo-1588405748880-12d1d2a59f75': '965989',     // Floral perfume
  'photo-1523293182086-7651a899d37f': '965989',     // Men's cologne
  'photo-1594035910387-fea081e66b5d': '965989',     // Eau de toilette
  'photo-1592945403244-b3fbafd7f539': '965989',     // Body mist
  'photo-1563170351-be82bc888aa4': '965989',        // Oriental perfume
  'photo-1587017539504-67cfbddac569': '965989',     // Eco perfume
  'photo-1547887538-e3a2f32cb1cc': '965989',        // Sport cologne
  'photo-1590736969955-71cc94901144': '965989',      // Aqua marine
  'photo-1585386959984-a4155224a1ad': '965989',      // After shave

  // ── BEAUTY - Cuidado Facial ──
  'photo-1570194065650-d99fb4b38b17': '3685530',    // Vitamin C serum
  'photo-1556228578-0d85b1a4d571': '3685530',       // Hyaluronic cream
  'photo-1570172619644-dfd03ed5d881': '3685530',     // Facial care (collection)
  'photo-1596755389378-c31d21fd1273': '3685530',     // Detox mask
  'photo-1611930022073-b7a4ba5fcccd': '3685530',     // Sunscreen
  'photo-1608248543803-ba4f8c70ae0b': '3685530',     // Retinol oil
  'photo-1598440947619-2c35fc9aa908': '3685530',     // Facial cleaning kit

  // ── BEAUTY - Sets de Regalo ──
  'photo-1583209814683-c023dd293cc6': '3685530',     // Spa luxury set
  'photo-1512909006721-3d6018887383': '965989',      // Fragrance + lotion set
  'photo-1596462502278-27bfdc403348': '3685530',     // Makeup essentials set
  'photo-1571781926291-c477ebfd024b': '3685530',     // Skincare routine set
  'photo-1608571423902-eed4a5ad8108': '3685530',     // Aromatherapy set

  // ── ACCESORIOS - Bolsos ──
  'photo-1584917865442-de89df76afd3': '1152077',     // Tote bag
  'photo-1611923134239-b9be5816e23c': '1152077',     // Crossbody bag
  'photo-1548036328-c9fa89d128fa': '1152077',        // Elegant crossbody
  'photo-1553062407-98eeb64c6a62': '1152077',        // Urban backpack
  'photo-1566150905458-1bf1fc113f0d': '1152077',     // Party clutch
  'photo-1591561954557-26941169b49e': '1152077',     // Canvas shopper
  'photo-1594223274512-ad4803739b7c': '1152077',     // Mini bandolera

  // ── ACCESORIOS - Gafas de Sol ──
  'photo-1511499767150-a48a237f0083': '701877',      // Aviator sunglasses
  'photo-1572635196237-14b3f281503f': '701877',      // Classic sunglasses
  'photo-1574258495973-f010dfbb5371': '701877',      // Sport polarized
  'photo-1577803645773-f96470509666': '701877',      // Wayfarer premium
  'photo-1473496169904-658ba7c44d8a': '701877',      // Round eco bamboo
  'photo-1508296695146-257a814070b4': '701877',      // Oversize glamour

  // ── ACCESORIOS - Joyería ──
  'photo-1599643478518-a784e5dc4c8f': '1191531',    // Gold chain necklace
  'photo-1535632066927-ab7c9ab60908': '1191531',     // Pearl earrings
  'photo-1611591437281-460bfbe1220a': '1191531',     // Silver bracelet
  'photo-1605100804763-247f67b3557e': '1191531',     // Solitaire ring
  'photo-1515562141589-67f0d569b6c4': '1191531',     // Earrings + necklace set
  'photo-1602751584552-8ba73aad10e1': '1191531',     // Delicate anklet

  // ── EXTRAS (Mobile menu, etc.) ──
  'photo-1469334031218-e382a71b716b': '1536619',     // Women fashion overview
  'photo-1523381210434-271e8be1f52b': '2043590',     // Sustainable collection
};

function buildPexelsUrl(pexelsId, w, h) {
  return `https://images.pexels.com/photos/${pexelsId}/pexels-photo-${pexelsId}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;
}

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  let count = 0;

  // Replace all Unsplash URLs with Pexels URLs
  content = content.replace(
    /https:\/\/images\.unsplash\.com\/(photo-[a-zA-Z0-9_-]+)\?w=(\d+)&h=(\d+)&fit=crop/g,
    (match, photoId, w, h) => {
      const pexelsId = PEXELS_MAP[photoId];
      if (pexelsId) {
        count++;
        return buildPexelsUrl(pexelsId, w, h);
      }
      console.warn(`  ⚠️  No mapping for ${photoId}`);
      return match;
    }
  );

  if (count > 0) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${filePath} — ${count} URLs replaced`);
  }
  return count;
}

// Recursively find all .ts and .tsx files
function findFiles(dir, ext = ['.ts', '.tsx']) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
      results.push(...findFiles(full, ext));
    } else if (ext.includes(extname(entry))) {
      results.push(full);
    }
  }
  return results;
}

console.log('🔍 Scanning source files...\n');
const files = findFiles(srcDir);
let totalReplaced = 0;

for (const f of files) {
  totalReplaced += processFile(f);
}

console.log(`\n✨ Done! ${totalReplaced} image URLs replaced across all files.`);
