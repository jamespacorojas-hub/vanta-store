import { POSSale, POSSaleItem } from '../types/pos';
import { PRODUCTS } from '../data';
import { getStoredSales } from './posStorage';

const LAST_GEN_KEY = 'vanta_pos_last_batch_time';
const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // 3 horas en milisegundos

// Nombres abreviados tal como se observan en la captura del usuario
const SHORT_CUSTOMER_NAMES = [
  'MARY M.',
  'GLORIA M.',
  'ADRIANA P.',
  'GIOVANNA V.',
  'CLAUDIA C.',
  'PRIETO P.',
  'PILAR',
  'MIRIAM P.',
  'CARLOS T.',
  'RODRIGO S.',
  'VALERIA R.',
  'DIEGO M.',
  'FIORELLA C.',
  'MATEO Q.',
  'CAMILA F.',
  'LUCIE P.',
  'SEBASTIAN G.',
  'XIMENA D.',
];

const SELLERS = ['VANTA', 'Bryan Requena', 'Atelier Central', 'Venta Web'];
const SHIPPING_TYPES = ['Provincia - Agencia', 'Lima - Courier', 'Recojo en Tienda'];
const AGENCIES = ['Shalom', 'Olva Courier', 'Marvisur', 'Civa'];

// Métodos de cobro observados en la captura
const COLLECTION_METHODS = [
  'Efectivo',
  'Efectivo\nQR BBVA VANTA',
  'Efectivo',
  'Yape',
  'Plin',
  'BCP Soles',
  'Efectivo',
];

// Montos y combinaciones exactas de la captura:
// Separación + Cuenta Cliente = Monto Total
// En la captura: S/ 14 + S/ 99 = S/ 113 (Cobrado: S/ 99.00)
// S/ 14 + S/ 116.60 = S/ 130.60 (Cobrado: S/ 116.60)
const EXACT_PRESETS = [
  { sep: 14.0, cc: 99.0, tot: 113.0, cobrado: 99.0, method: 'Efectivo', status: 'Cobro recibido', images: 3 },
  { sep: 14.0, cc: 116.6, tot: 130.6, cobrado: 116.6, method: 'Efectivo', status: 'Cobro recibido', images: 3 },
  { sep: 14.0, cc: 99.0, tot: 113.0, cobrado: 99.0, method: 'Efectivo', status: 'Cobro recibido', images: 2 },
  { sep: 14.0, cc: 99.0, tot: 113.0, cobrado: 99.0, method: 'Efectivo', status: 'Cobro recibido', images: 3 },
  { sep: 14.0, cc: 99.0, tot: 113.0, cobrado: 99.0, method: 'Efectivo', status: 'Cobro recibido', images: 3 },
  { sep: 14.0, cc: 99.0, tot: 113.0, cobrado: 99.0, method: 'Efectivo\nQR BBVA VANTA', status: 'Cobro recibido', images: 3 },
  { sep: 14.0, cc: 99.0, tot: 113.0, cobrado: 99.0, method: 'Efectivo', status: 'Cobro recibido', images: 3 },
  { sep: 14.0, cc: 99.0, tot: 113.0, cobrado: 99.0, method: 'Efectivo', status: 'Cobro recibido', images: 3 },
  { sep: 52.0, cc: 95.0, tot: 147.0, cobrado: null, method: 'Sin cobrar', status: 'Separo verificado', images: 1 },
  { sep: 32.0, cc: 214.0, tot: 246.0, cobrado: null, method: 'Sin cobrar', status: 'Separo verificado', images: 1 },
  { sep: 16.0, cc: 46.0, tot: 62.0, cobrado: null, method: 'Sin cobrar', status: 'Separo verificado', images: 1 },
  { sep: 102.0, cc: 253.0, tot: 355.0, cobrado: null, method: 'Sin cobrar', status: 'Separo verificado', images: 2 },
  { sep: 16.0, cc: 104.0, tot: 120.0, cobrado: null, method: 'Sin cobrar', status: 'Separo verificado', images: 1 },
];

let counterSeed = 54205;
export function generateVantaCode(): string {
  counterSeed += Math.floor(Math.random() * 8) + 1;
  const numStr = String(counterSeed).padStart(6, '0');
  return `VANTA/${numStr}`;
}

export function generateSingleOrder(indexOffset = 0): POSSale {
  const now = new Date();
  const timeOffsetMs = Math.floor(Math.random() * THREE_HOURS_MS);
  const orderDate = new Date(now.getTime() - timeOffsetMs);

  const clientName = SHORT_CUSTOMER_NAMES[Math.floor(Math.random() * SHORT_CUSTOMER_NAMES.length)];
  const seller = SELLERS[Math.floor(Math.random() * SELLERS.length)];
  const shippingType = SHIPPING_TYPES[Math.floor(Math.random() * SHIPPING_TYPES.length)];
  const agency = AGENCIES[Math.floor(Math.random() * AGENCIES.length)];

  const preset = EXACT_PRESETS[Math.floor(Math.random() * EXACT_PRESETS.length)];
  const advance = preset.sep;
  const pending = preset.cc;
  const total = preset.tot;
  const cobrado = preset.cobrado;
  const method = preset.method;
  const status = preset.status;
  const images = preset.images;

  const randomProd = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];

  const items: POSSaleItem[] = [
    {
      id: `item-${Date.now()}-${Math.random()}`,
      productId: randomProd.id,
      productName: randomProd.name,
      image: randomProd.images[0],
      category: randomProd.category,
      selectedColor: randomProd.colors[0] || 'Negro',
      selectedSize: 'M',
      selectedFabric: randomProd.fabrics[0] || 'Waffle',
      unitPrice: advance,
      originalPrice: randomProd.price,
      quantity: 1,
      subtotal: total,
    },
  ];

  const dayStr = String(orderDate.getDate()).padStart(2, '0');
  const monthStr = String(orderDate.getMonth() + 1).padStart(2, '0');
  const yearStr = orderDate.getFullYear();
  const verifiedDate = `${dayStr}/${monthStr}/${yearStr}`;

  const hoursStr = String(orderDate.getHours()).padStart(2, '0');
  const minsStr = String(orderDate.getMinutes()).padStart(2, '0');
  const formattedTime = `${hoursStr}:${minsStr}`;

  const vantaCode = generateVantaCode();

  return {
    id: `sale-vanta-${Date.now()}-${indexOffset}-${Math.floor(Math.random() * 10000)}`,
    receiptNumber: vantaCode,
    vantaCode: vantaCode,
    customerDisplayName: clientName,
    receiptType: 'NOTA_VENTA',
    destinationType: shippingType.includes('Lima') ? 'LIMA' : 'PROVINCIA',
    shippingType: shippingType,
    agencyName: agency,
    sellerName: seller,
    createdAt: orderDate.toISOString(),
    formattedDate: verifiedDate,
    formattedTime: formattedTime,
    verifiedDate: verifiedDate,
    customer: {
      name: clientName,
      documentType: 'DNI',
      documentNumber: `7${Math.floor(1000000 + Math.random() * 9000000)}`,
      phone: `9${Math.floor(10000000 + Math.random() * 90000000)}`,
      city: 'Lima',
    },
    items: items,
    subtotalAmount: total,
    shippingCost: 0,
    discountAmount: 0,
    taxMode: 'NO_TAX',
    taxAmount: 0,
    taxPercent: 0,
    totalAmount: total,
    advanceAmount: advance,
    pendingBalance: pending,
    collectedAmount: cobrado,
    collectionMethod: method,
    collectionStatus: status === 'Cobro recibido' ? 'COBRADA' : 'SEPARO_VERIFICADO',
    imagesCount: images,
    hasWarning: true,
    voucherImageUrl: '/pagos/codigo-qr.jpeg',
    payments: [
      {
        method: method.includes('BBVA') ? 'TRANSFERENCIA_BBVA' : 'EFECTIVO',
        amount: advance,
        referenceNumber: `OP-${Math.floor(100000 + Math.random() * 900000)}`,
      },
    ],
    status: 'COMPLETADA',
    observations: `Separo registrado para ${clientName}`,
  };
}

export function generateBatchOfFakeOrders(count = 50): POSSale[] {
  const currentSales = getStoredSales();
  const newOrders: POSSale[] = [];

  for (let i = 0; i < count; i++) {
    newOrders.push(generateSingleOrder(i));
  }

  const combined = [...newOrders, ...currentSales];
  localStorage.setItem('vanta_pos_sales', JSON.stringify(combined));
  localStorage.setItem(LAST_GEN_KEY, String(Date.now()));

  window.dispatchEvent(new CustomEvent('vanta-orders-updated', { detail: { count } }));
  return combined;
}

export function checkAndAutoGenerateFakeOrders(): { generated: boolean; count: number } {
  const lastTimeRaw = localStorage.getItem(LAST_GEN_KEY);
  const currentSales = getStoredSales();

  if (currentSales.length === 0 || !lastTimeRaw) {
    generateBatchOfFakeOrders(50);
    return { generated: true, count: 50 };
  }

  const lastTime = parseInt(lastTimeRaw, 10);
  const now = Date.now();
  const elapsed = now - lastTime;

  if (elapsed >= THREE_HOURS_MS) {
    generateBatchOfFakeOrders(50);
    return { generated: true, count: 50 };
  }

  return { generated: false, count: 0 };
}

export function getTimeUntilNextBatch(): { remainingMs: number; formatted: string } {
  const lastTimeRaw = localStorage.getItem(LAST_GEN_KEY);
  if (!lastTimeRaw) {
    return { remainingMs: 0, formatted: '00h 00m 00s' };
  }

  const lastTime = parseInt(lastTimeRaw, 10);
  const nextTime = lastTime + THREE_HOURS_MS;
  const remainingMs = Math.max(0, nextTime - Date.now());

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const formatted = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

  return { remainingMs, formatted };
}
