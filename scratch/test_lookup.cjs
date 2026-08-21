const manifest = require('../src/data/productImageManifest.json');

function normalizeFabric(fabric) {
  if (!fabric) return 'jersey';
  const clean = fabric.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (clean === 'pique') return 'pique';
  if (clean === 'waffle') return 'waffle';
  if (clean === 'waffer') return 'waffer';
  return 'jersey';
}

function getPhoto(garment, fabric, color) {
  const targetFab = normalizeFabric(fabric);
  return manifest[garment]?.[targetFab]?.[color];
}

console.log('=== TEST PRODUCT IMAGE RESOLUTION ===');
console.log('Clasico Jersey Negro:', getPhoto('clasico', 'Jersey', 'Negro'));
console.log('Clasico Pique Negro (con tilde):', getPhoto('clasico', 'Piqué', 'Negro'));
console.log('Clasico Waffle Negro:', getPhoto('clasico', 'Waffle', 'Negro'));
console.log('Clasico Waffer Negro:', getPhoto('clasico', 'Waffer', 'Negro'));

console.log('Camisa Jersey Vino:', getPhoto('camisa', 'Jersey', 'Vino'));
console.log('Camisa Pique Vino (con tilde):', getPhoto('camisa', 'Piqué', 'Vino'));
console.log('Camisa Waffle Vino:', getPhoto('camisa', 'Waffle', 'Vino'));
console.log('Camisa Waffer Vino:', getPhoto('camisa', 'Waffer', 'Vino'));

console.log('\nAre Jersey and Pique paths different?');
console.log('Clasico Negro distinct:', getPhoto('clasico', 'Jersey', 'Negro') !== getPhoto('clasico', 'Piqué', 'Negro'));
console.log('Camisa Vino distinct:', getPhoto('camisa', 'Jersey', 'Vino') !== getPhoto('camisa', 'Piqué', 'Vino'));
