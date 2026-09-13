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

export type ShippingCourierLima = 'MOTORIZADO_EXPRESS' | 'OLVA_LIMA' | 'SHALOM_LIMA' | 'RECOJO_SHOWROOM';
export type ShippingAgencyProvincia = 'SHALOM' | 'OLVA_COURIER' | 'MARVISUR' | 'CIVA' | 'FLORES' | 'OTRA';
export type ShippingDeliveryTypeProvincia = 'AGENCIA' | 'DOMICILIO';
export type ShippingFreightPaymentProvincia = 'PAGO_DESTINO' | 'PAGADO';

export interface POSShippingLima {
  recipientName: string; // Nombres y apellidos
  recipientPhone: string; // Celular
  district: string; // Distrito
  address: string; // Dirección completa (número, piso o departamento)
  reference?: string; // Referencia para llegar
  recipientDni?: string;
  courier?: ShippingCourierLima;
  deliveryWindow?: string;
}

export interface POSShippingProvincia {
  consigneeName: string; // Nombres y apellidos
  consigneeDni: string; // DNI
  consigneePhone: string; // Celular
  departmentProvinceDistrict?: string; // Departamento / Provincia / Distrito
  department?: string;
  provinceCity?: string;
  agency: ShippingAgencyProvincia;
  otherAgencyName?: string;
  agencyBranch?: string; // Agencia Shalom donde recogerás tu pedido
  deliveryType?: ShippingDeliveryTypeProvincia; // AGENCIA o DOMICILIO
  address?: string; // Dirección si es entrega a domicilio
  freightPayment?: ShippingFreightPaymentProvincia; // Pago en Destino (S/ 0 en comprobante) vs Pagado
  claveRetiro?: string;
}

export interface POSShippingInfo {
  destination: DestinationType;
  shippingCost: number;
  lima?: POSShippingLima;
  provincia?: POSShippingProvincia;
}

export interface POSSale {
  id: string; // ID único interno
  receiptNumber: string; // ej. 0001-0000001
  receiptType: ReceiptType;
  destinationType: DestinationType; // LIMA o PROVINCIA
  shippingInfo?: POSShippingInfo;
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
  advanceAmount?: number; // Monto de adelanto recibido (a cuenta)
  pendingBalance?: number; // Saldo pendiente por cobrar (totalAmount - advanceAmount)
  paymentAccountId?: string; // Cuenta / banco receptor (ej. YAPE_PLIN, BCP, etc.)
  paymentAccountLabel?: string; // Etiqueta descriptiva (ej. Yape Bryan Requena)
  isAdvancePayment?: boolean; // Flag si fue venta con pago parcial / a cuenta
  payments: POSPaymentDetail[];
  status: 'COMPLETADA' | 'ANULADA';
  voidReason?: string;
  voidedAt?: string;
  observations?: string;
  notes?: string;
}

export interface VantaBankAccount {
  id: string;
  name: string;
  bank: string;
  currency: string;
  number: string;
  cci?: string;
  holder: string;
  ruc: string;
  badgeColor?: string;
  qrImage?: string;
}

export const VANTA_BANK_ACCOUNTS: VantaBankAccount[] = [
  {
    id: 'YAPE_PLIN',
    name: 'Yape / Plin',
    bank: 'Billetera Digital',
    currency: 'Soles (S/)',
    number: '904 536 406 / 924 058 988',
    cci: '094-00141000636992-1-53',
    holder: 'BRYAN MICHAEL REQUENA AVILA',
    ruc: '10714931062',
    badgeColor: 'purple',
    qrImage: '/pagos/codigo-qr.jpeg',
  },
  {
    id: 'BCP',
    name: 'BCP Soles',
    bank: 'Banco de Crédito BCP',
    currency: 'Soles (S/)',
    number: '191-0014100063-0-53',
    cci: '002-191-0014100063053-53',
    holder: 'BRYAN MICHAEL REQUENA AVILA',
    ruc: '10714931062',
    badgeColor: 'orange',
  },
  {
    id: 'BBVA',
    name: 'BBVA Soles',
    bank: 'BBVA Perú',
    currency: 'Soles (S/)',
    number: '0011-0175-0200543981',
    cci: '011-175-000200543981-74',
    holder: 'BRYAN MICHAEL REQUENA AVILA',
    ruc: '10714931062',
    badgeColor: 'blue',
  },
  {
    id: 'INTERBANK',
    name: 'Interbank Soles',
    bank: 'Interbank',
    currency: 'Soles (S/)',
    number: '200-3001249821',
    cci: '003-200-003001249821-39',
    holder: 'BRYAN MICHAEL REQUENA AVILA',
    ruc: '10714931062',
    badgeColor: 'emerald',
  },
  {
    id: 'EFECTIVO',
    name: 'Efectivo en Caja',
    bank: 'Caja Tienda',
    currency: 'Soles (S/)',
    number: 'Recepción Directa',
    holder: 'Atelier VANTA',
    ruc: '10714931062',
    badgeColor: 'zinc',
  },
];

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
