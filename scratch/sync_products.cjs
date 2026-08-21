const fs = require('fs');
const path = require('path');

const SOURCE_ROOT = 'D:\\mont-store\\PRODUCTOS';
const DEST_ROOT = path.resolve(__dirname, '..', 'public', 'productos');
const MANIFEST_PATH = path.resolve(__dirname, '..', 'src', 'data', 'productImageManifest.json');

// Garment folder mapping
const GARMENT_MAP = {
  'CAMISAS': 'camisa',
  'CAMISEROS': 'camisero',
  'CLASICOS': 'clasico',
  'MANGA LARGA': 'manga-larga',
  'NOTCH': 'notch',
  'POLERAS': 'polera'
};

// Fabric folder mapping
const FABRIC_MAP = {
  'JERSEY': 'jersey',
  'CAMISEROS JERSEY': 'jersey',
  'PIQUE': 'pique',
  'CAMISEROS PIQUE': 'pique',
  'WAFFER': 'waffer',
  'CAMISEROS WAFFER': 'waffer',
  'WAFFLE': 'waffle',
  'CAMISEROS WAFFLE': 'waffle'
};

// Color normalization map
function normalizeColor(filename) {
  const base = path.parse(filename).name.trim().toLowerCase();
  
  if (base.startsWith('azu') || base === 'azul') return 'Azul';
  if (base.startsWith('beig') || base === 'beige') return 'Beige';
  if (base === 'blanco') return 'Blanco';
  if (base.includes('botella')) return 'Botella';
  if (base === 'camote') return 'Camote';
  if (base === 'cemento') return 'Cemento';
  if (base.includes('denim') || base.includes('dewnim')) return 'Denim';
  if (base === 'gris') return 'Gris';
  if (base === 'lila') return 'Lila';
  if (base.includes('m. osc') || base.includes('melange') || base.includes('oscuro')) return 'Melange Oscuro';
  if (base.includes('marron') || base.includes('marrón')) return 'Marrón';
  if (base === 'morado') return 'Morado';
  if (base === 'negro') return 'Negro';
  if (base.includes('p. rosa') || base.includes('palo rosa') || base.includes('rosa')) return 'Palo Rosa';
  if (base.includes('pacay')) return 'Pacay';
  if (base === 'perla') return 'Perla';
  if (base === 'plomo') return 'Plomo';
  if (base === 'topo') return 'Topo';
  if (base === 'vino') return 'Vino';

  return path.parse(filename).name.trim();
}

function colorToSlug(color) {
  return color
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

const manifest = {};

// Process all garments
for (const [sourceGarment, targetGarment] of Object.entries(GARMENT_MAP)) {
  manifest[targetGarment] = {
    jersey: {},
    pique: {},
    waffer: {},
    waffle: {}
  };

  const garmentSourceDir = path.join(SOURCE_ROOT, sourceGarment);
  if (!fs.existsSync(garmentSourceDir)) continue;

  const fabricFolders = fs.readdirSync(garmentSourceDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const fabricFolder of fabricFolders) {
    const targetFabric = FABRIC_MAP[fabricFolder.toUpperCase()];
    if (!targetFabric) continue;

    const fabricSourceDir = path.join(garmentSourceDir, fabricFolder);
    const targetDir = path.join(DEST_ROOT, targetGarment, targetFabric);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = fs.readdirSync(fabricSourceDir, { withFileTypes: true })
      .filter(f => f.isFile() && (f.name.endsWith('.png') || f.name.endsWith('.webp')));

    for (const file of files) {
      const color = normalizeColor(file.name);
      const slug = colorToSlug(color);
      const targetFileName = `${slug}.png`;
      const sourceFilePath = path.join(fabricSourceDir, file.name);
      const targetFilePath = path.join(targetDir, targetFileName);

      fs.copyFileSync(sourceFilePath, targetFilePath);

      const publicUrl = `/productos/${targetGarment}/${targetFabric}/${targetFileName}`;
      manifest[targetGarment][targetFabric][color] = publicUrl;
      // Also register alternate casing
      if (color === 'Marrón') {
        manifest[targetGarment][targetFabric]['Marron'] = publicUrl;
      }
    }
  }
}

// Write updated manifest
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

console.log('Successfully synced all product images and generated manifest:');
for (const garment of Object.keys(manifest)) {
  console.log(`- ${garment}:`);
  for (const fabric of Object.keys(manifest[garment])) {
    const colorsCount = Object.keys(manifest[garment][fabric]).length;
    console.log(`    ${fabric}: ${colorsCount} colors`);
  }
}
