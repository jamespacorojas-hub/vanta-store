import { Product } from '../types';

export type ReceiptType = 'NOTA_VENTA' | 'BOLETA' | 'FACTURA';

export type DestinationType = 'LIMA' | 'PROVINCIA';

export type TaxMode = 'NO_TAX' | 'INCLUDED' | 'PLUS_TAX';

export type PaymentMethodType =
  | 'EFECTIVO'
  | 'YAPE'
  | 'PLIN'
  | 'TARJETA_POS'
  | 'TRANSFERENCIA_BCP'
  | 'TRANSFERENCIA_BBVA'
  | 'TRANSFERENCIA_INTERBANK'
  | 'CONTRA_ENTREGA'
  | 'MIXTO';

export interface POSSaleItem {
  id: string;
  productId: string;
  productName: string;
  image: string;
  category: string;
  selectedColor: string;
  selectedSize: string;
  selectedFabric?: string;
  selectedSleeve?: string;
  unitPrice: number;
  originalPrice: number;
  discountPct?: number;
  quantity: number;
  subtotal: number;
}

export interface POSCustomer {
  name: string; // Nombre de persona natural o contacto
  businessName?: string; // Razón Social (para Facturas con RUC)
  documentType: 'DNI' | 'RUC' | 'CE' | 'OTRO' | 'NINGUNO';
  documentNumber: string; // DNI (8 dígitos) o RUC (11 dígitos)
  phone: string;
  address?: string;
  fiscalAddress?: string; // Dirección fiscal para Facturas
  district?: string;
  city?: string;
}

export interface POSPaymentDetail {
  method: PaymentMethodType;
  amount: number;
  amountReceived?: number; // Para efectivo
  change?: number; // Vuelto
  referenceNumber?: string; // N° Operación Yape/Plin/Transferencia
}

export interface POSSale {
  id: string; // ID único interno
  receiptNumber: string; // ej. 0001-0000001
  receiptType: ReceiptType;
  destinationType: DestinationType; // LIMA o PROVINCIA
  createdAt: string; // ISO String
  formattedDate: string;
  formattedTime: string;
  sellerName: string;
  customer: POSCustomer;
  items: POSSaleItem[];
  subtotalAmount: number; // Subtotal neto / Operaciones gravadas
  shippingCost: number; // Costo de envío
  discountAmount: number;
  taxMode: TaxMode;
  taxAmount: number; // Monto de IGV 18%
  taxPercent: number; // 18 o 0
  totalAmount: number;
  payments: POSPaymentDetail[];
  status: 'COMPLETADA' | 'ANULADA';
  voidReason?: string;
  voidedAt?: string;
  observations?: string;
  notes?: string;
}

export interface POSShiftSummary {
  id: string;
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  totalSalesCount: number;
  totalSalesAmount: number;
  cashSalesAmount: number;
  digitalSalesAmount: number; // Yape + Plin + Transferencias
  cardSalesAmount: number;
  cashInDrawer: number;
  status: 'ABIERTA' | 'CERRADA';
}
