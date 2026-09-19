import { POSSale, ReceiptType, POSShiftSummary } from '../types/pos';

const STORAGE_KEYS = {
  SALES: 'vanta_pos_sales',
  COUNTER: 'vanta_pos_counter',
  AUTH: 'vanta_pos_auth',
  SELLER: 'vanta_pos_active_seller',
  SHIFT: 'vanta_pos_active_shift',
};

// Generar número de orden o correlativo (aleatorio para Notas de Venta)
export function getNextReceiptNumber(type: ReceiptType = 'NOTA_VENTA'): string {
  if (type === 'NOTA_VENTA') {
    // Generar número de orden aleatorio de 6 dígitos (ej. 748291)
    const randomOrder = Math.floor(100000 + Math.random() * 900000);
    return String(randomOrder);
  }

  const currentCounters = JSON.parse(localStorage.getItem(STORAGE_KEYS.COUNTER) || '{"NV": 1, "BV": 1, "FT": 1}');
  
  let prefix = 'NV';
  if (type === 'BOLETA') prefix = 'BV';
  if (type === 'FACTURA') prefix = 'FT';

  const currentNum = currentCounters[prefix] || 1;
  const series = '0001';
  const correlative = String(currentNum).padStart(7, '0');
  
  return `${series}-${correlative}`;
}

export function incrementReceiptCounter(type: ReceiptType = 'NOTA_VENTA'): void {
  if (type === 'NOTA_VENTA') return; // Las notas de venta utilizan números aleatorios de orden
  const currentCounters = JSON.parse(localStorage.getItem(STORAGE_KEYS.COUNTER) || '{"NV": 1, "BV": 1, "FT": 1}');
  
  let prefix = 'NV';
  if (type === 'BOLETA') prefix = 'BV';
  if (type === 'FACTURA') prefix = 'FT';

  currentCounters[prefix] = (currentCounters[prefix] || 1) + 1;
  localStorage.setItem(STORAGE_KEYS.COUNTER, JSON.stringify(currentCounters));
}

// Obtener todas las ventas
export function getStoredSales(): POSSale[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading POS sales:', e);
    return [];
  }
}

// Guardar nueva venta
export function savePOSSale(sale: POSSale): POSSale[] {
  const sales = getStoredSales();
  const updated = [sale, ...sales];
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(updated));
  incrementReceiptCounter(sale.receiptType);
  return updated;
}

// Anular una venta
export function voidPOSSale(saleId: string, reason: string): POSSale[] {
  const sales = getStoredSales();
  const updated = sales.map((s) => {
    if (s.id === saleId) {
      return {
        ...s,
        status: 'ANULADA' as const,
        voidReason: reason,
        voidedAt: new Date().toISOString(),
      };
    }
    return s;
  });
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(updated));
  return updated;
}

// Gestión de Sesión
export function isPOSAuthenticated(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true' || localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
}

export function setPOSAuthenticated(remember: boolean = false, sellerName: string = 'Administrador'): void {
  if (remember) {
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  } else {
    sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  }
  localStorage.setItem(STORAGE_KEYS.SELLER, sellerName);
}

export function clearPOSAuthentication(): void {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

export function getActiveSeller(): string {
  return localStorage.getItem(STORAGE_KEYS.SELLER) || 'Caja Principal';
}

// Gestión de Caja / Turno
export function getActiveShift(): POSShiftSummary {
  const defaultShift: POSShiftSummary = {
    id: 'turno-' + new Date().toISOString().slice(0, 10),
    openedAt: new Date().toISOString(),
    initialCash: 100.00,
    totalSalesCount: 0,
    totalSalesAmount: 0,
    cashSalesAmount: 0,
    digitalSalesAmount: 0,
    cardSalesAmount: 0,
    cashInDrawer: 100.00,
    status: 'ABIERTA',
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHIFT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SHIFT, JSON.stringify(defaultShift));
      return defaultShift;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultShift;
  }
}

export function updateActiveShift(shift: POSShiftSummary): void {
  localStorage.setItem(STORAGE_KEYS.SHIFT, JSON.stringify(shift));
}
