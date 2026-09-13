import React, { useRef, useState, useMemo } from 'react';
import {
  X,
  Printer,
  Send,
  Download,
  ShieldCheck,
  Check,
  Copy,
  FileText,
  User,
  MapPin,
  Phone,
  Truck,
  Package,
  RefreshCw,
} from 'lucide-react';
import {
  POSSaleItem,
  POSCustomer,
  DestinationType,
  POSShippingInfo,
  ReceiptType,
} from '../../../types/pos';

interface POSProformaModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: POSSaleItem[];
  customer: POSCustomer;
  destinationType: DestinationType;
  shippingCost?: number;
  discountAmount?: number;
  totalAmount?: number;
  sellerName?: string;
  existingReceiptNumber?: string;
  receiptType?: ReceiptType;
  isCompletedSale?: boolean;
  shippingInfo?: POSShippingInfo;
  advanceAmount?: number;
  pendingBalance?: number;
  isAdvancePayment?: boolean;
  paymentAccountId?: string;
  paymentAccountLabel?: string;
  observations?: string;
  onOpenTicket?: () => void;
  onNewSale?: () => void;
  onRegisterSale?: () => void;
}

export default function POSProformaModal({
  isOpen,
  onClose,
  items,
  customer,
  destinationType,
  shippingCost = 0,
  discountAmount = 0,
  totalAmount,
  sellerName = 'Atelier Admin',
  existingReceiptNumber,
  receiptType = 'NOTA_VENTA',
  isCompletedSale = false,
  shippingInfo,
  advanceAmount,
  pendingBalance,
  isAdvancePayment = false,
  paymentAccountId,
  paymentAccountLabel,
  observations,
  onOpenTicket,
  onNewSale,
  onRegisterSale,
}: POSProformaModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  // Compute subtotal and total
  const subtotalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  }, [items]);

  const computedTotal = useMemo(() => {
    if (typeof totalAmount === 'number' && totalAmount > 0) return totalAmount;
    return Math.max(0, subtotalItems - discountAmount + shippingCost);
  }, [totalAmount, subtotalItems, discountAmount, shippingCost]);

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  // Title of the official document
  const documentTitle = useMemo(() => {
    if (receiptType === 'NOTA_VENTA') return 'NOTA DE VENTA ELECTRÓNICA';
    if (receiptType === 'BOLETA') return 'BOLETA DE VENTA ELECTRÓNICA';
    if (receiptType === 'FACTURA') return 'FACTURA ELECTRÓNICA';
    return isCompletedSale ? 'NOTA DE VENTA ELECTRÓNICA' : 'COTIZACIÓN / PROFORMA';
  }, [receiptType, isCompletedSale]);

  // Generate or use distinct official document code
  const documentCode = useMemo(() => {
    if (existingReceiptNumber) {
      if (
        receiptType === 'NOTA_VENTA' &&
        !existingReceiptNumber.startsWith('NV-') &&
        !existingReceiptNumber.startsWith('BV-') &&
        !existingReceiptNumber.startsWith('FT-')
      ) {
        return `NV-${existingReceiptNumber}`;
      }
      return existingReceiptNumber;
    }
    const seed = Math.abs(
      items.reduce((acc, it) => acc + it.productId.charCodeAt(0) * it.quantity, 0) +
        Math.floor(computedTotal * 10)
    );
    const codeNum = String((seed % 9000) + 1000).padStart(4, '0');
    return isCompletedSale || receiptType === 'NOTA_VENTA'
      ? `NV-0001-${codeNum}`
      : `PF-${new Date().getFullYear()}-${codeNum}`;
  }, [existingReceiptNumber, items, computedTotal, isCompletedSale, receiptType]);

  const issueDate = useMemo(() => {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
  }, []);

  if (!isOpen || items.length === 0) return null;

  // High-fidelity A4 Print — BANNER STYLE, inline CSS, Blob URL (no Tailwind, no popup blocker)
  const handlePrintA4 = () => {
    // Build shipping block HTML
    let shippingHtml = '';
    if (destinationType === 'PROVINCIA') {
      const agency =
        shippingInfo?.provincia?.agency === 'OTRA'
          ? shippingInfo?.provincia?.otherAgencyName || 'OTRA'
          : shippingInfo?.provincia?.agency || 'SHALOM';
      const location =
        shippingInfo?.provincia?.departmentProvinceDistrict ||
        (shippingInfo?.provincia?.provinceCity
          ? `${shippingInfo.provincia.provinceCity}, ${shippingInfo.provincia.department}`
          : shippingInfo?.provincia?.department) ||
        customer.district ||
        'Provincia';
      const agencyBranch =
        shippingInfo?.provincia?.agencyBranch ||
        (shippingInfo?.provincia?.deliveryType === 'DOMICILIO'
          ? shippingInfo?.provincia?.address || customer.address || ''
          : 'Sede Central');
      const freightText =
        shippingInfo?.provincia?.freightPayment === 'PAGO_DESTINO'
          ? 'PAGO EN DESTINO (S/ 0.00 en pedido)'
          : `Flete pagado (S/ ${shippingCost.toFixed(2)})`;
      shippingHtml = `
        <div style="font-weight:700;color:#7c3aed;font-size:10px;text-transform:uppercase;margin-bottom:6px;">📦 ENVÍO PROVINCIA</div>
        <div style="display:flex;gap:6px;align-items:baseline;margin-bottom:3px;">
          <span style="font-size:7.5px;color:#94a3b8;font-family:monospace;min-width:54px;">TRANS.</span>
          <span style="font-weight:700;color:#1e293b;font-size:10px;">${agency}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:baseline;margin-bottom:3px;">
          <span style="font-size:7.5px;color:#94a3b8;font-family:monospace;min-width:54px;">DESTINO</span>
          <span style="color:#334155;font-size:9.5px;">${location}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:baseline;margin-bottom:3px;">
          <span style="font-size:7.5px;color:#94a3b8;font-family:monospace;min-width:54px;">AGENCIA</span>
          <span style="color:#334155;font-size:9.5px;">${agencyBranch}</span>
        </div>
        <div style="margin-top:6px;padding:4px 6px;background:#ede9fe;border-left:3px solid #7c3aed;font-size:8px;color:#5b21b6;font-family:monospace;">${freightText}</div>`;
    } else {
      const district = shippingInfo?.lima?.district || customer.district || 'Lima';
      const address = shippingInfo?.lima?.address || customer.address || 'Lima';
      const reference = shippingInfo?.lima?.reference || '';
      const shippingLine = shippingCost === 0 ? 'Recojo en tienda / Gratis' : `Delivery S/ ${shippingCost.toFixed(2)}`;
      shippingHtml = `
        <div style="font-weight:700;color:#be123c;font-size:10px;text-transform:uppercase;margin-bottom:6px;">🚚 ENVÍO A LIMA</div>
        <div style="display:flex;gap:6px;align-items:baseline;margin-bottom:3px;">
          <span style="font-size:7.5px;color:#94a3b8;font-family:monospace;min-width:54px;">DISTRITO</span>
          <span style="font-weight:700;color:#1e293b;font-size:10px;">${district}</span>
        </div>
        <div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:3px;">
          <span style="font-size:7.5px;color:#94a3b8;font-family:monospace;min-width:54px;padding-top:1px;">DIRECCIÓN</span>
          <span style="color:#334155;font-size:9.5px;">${address}</span>
        </div>
        ${reference ? `<div style="display:flex;gap:6px;align-items:flex-start;margin-bottom:3px;"><span style="font-size:7.5px;color:#94a3b8;font-family:monospace;min-width:54px;padding-top:1px;">REF.</span><span style="color:#475569;font-size:9px;">${reference}</span></div>` : ''}
        <div style="margin-top:6px;padding:4px 6px;background:#fff1f2;border-left:3px solid #be123c;font-size:8px;color:#9f1239;font-family:monospace;">${shippingLine}</div>`;
    }

    // Build items rows HTML
    const itemsHtml = items
      .map(
        (item, idx) => `
      <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding:6px 8px;font-family:monospace;font-size:9px;color:#94a3b8;border-bottom:1px solid #f1f5f9;">${idx + 1}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;">
          <div style="font-weight:700;color:#0f172a;font-size:10px;">${item.productName}</div>
          <div style="font-size:7.5px;color:#94a3b8;font-family:monospace;text-transform:uppercase;margin-top:1px;">COD: ${item.productId.toUpperCase()}</div>
        </td>
        <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;font-family:monospace;font-size:8.5px;">
          <div style="color:#334155;">T: <b style="color:#0f172a;">${item.selectedSize}</b> &nbsp;|&nbsp; C: <b style="color:#0f172a;">${item.selectedColor}</b></div>
          <div style="color:#94a3b8;font-size:7.5px;margin-top:1px;">${item.selectedFabric || 'Textil'} · ${item.selectedSleeve || 'M/C'}</div>
        </td>
        <td style="padding:6px 8px;text-align:center;font-family:monospace;font-weight:800;font-size:11px;color:#0f172a;border-bottom:1px solid #f1f5f9;">${item.quantity}</td>
        <td style="padding:6px 8px;text-align:right;font-family:monospace;font-size:9.5px;color:#475569;border-bottom:1px solid #f1f5f9;">S/. ${item.unitPrice.toFixed(2)}</td>
        <td style="padding:6px 8px;text-align:right;font-family:monospace;font-weight:700;font-size:10px;color:#0f172a;border-bottom:1px solid #f1f5f9;">S/. ${item.subtotal.toFixed(2)}</td>
      </tr>`
      )
      .join('');

    const discountRow =
      discountAmount > 0
        ? `<tr style="background:#fff1f2;">
            <td colspan="5" style="padding:5px 8px;font-family:monospace;font-size:9px;color:#be123c;font-weight:700;text-align:right;">DESCUENTO APLICADO:</td>
            <td style="padding:5px 8px;text-align:right;font-family:monospace;font-weight:700;color:#be123c;font-size:10px;">-S/. ${discountAmount.toFixed(2)}</td>
          </tr>`
        : '';

    const shippingRow =
      shippingCost > 0
        ? `<tr style="background:#f8fafc;">
            <td colspan="5" style="padding:5px 8px;font-family:monospace;font-size:9px;color:#475569;text-align:right;">DESPACHO / ENVÍO:</td>
            <td style="padding:5px 8px;text-align:right;font-family:monospace;color:#0f172a;font-size:10px;font-weight:600;">S/. ${shippingCost.toFixed(2)}</td>
          </tr>`
        : '';

    let advanceHtml = '';
    if (isAdvancePayment && typeof pendingBalance === 'number' && pendingBalance > 0) {
      const adv = advanceAmount ?? computedTotal - pendingBalance;
      advanceHtml = `
        <div style="margin-top:10px;border:2px solid #f59e0b;border-radius:3px;overflow:hidden;">
          <div style="background:#f59e0b;padding:4px 10px;">
            <span style="font-family:monospace;font-size:8px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:0.08em;">PAGO PARCIAL / A CUENTA</span>
          </div>
          <div style="padding:8px 10px;background:#fffbeb;">
            <div style="display:flex;justify-content:space-between;color:#065f46;font-weight:700;font-size:9.5px;margin-bottom:4px;">
              <span>💰 ADELANTO RECIBIDO:</span><span>S/. ${adv.toFixed(2)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;color:#be123c;font-weight:900;font-size:12px;padding-top:6px;border-top:1px dashed #f59e0b;">
              <span>⏳ SALDO PENDIENTE:</span><span>S/. ${pendingBalance.toFixed(2)}</span>
            </div>
            <div style="font-size:7px;color:#92400e;font-family:monospace;margin-top:4px;">* Saldo a liquidar contraentrega o previo al despacho.</div>
          </div>
        </div>`;
    } else if (isCompletedSale) {
      advanceHtml = `<div style="margin-top:8px;text-align:center;padding:5px;background:#f0fdf4;border:1px solid #86efac;">
        <span style="font-size:9px;font-family:monospace;font-weight:800;color:#15803d;text-transform:uppercase;letter-spacing:0.06em;">✓ PAGADO AL 100% EN SOLES</span></div>`;
    }

    const paymentLine = paymentAccountLabel
      ? `<div style="text-align:right;margin-top:6px;font-size:8.5px;font-family:monospace;color:#64748b;">Medio de pago: <strong style="color:#0f172a;">${paymentAccountLabel}</strong></div>`
      : '';

    const obsHtml = observations
      ? `<div style="margin-bottom:12px;padding:8px 10px;background:#f8fafc;border-left:3px solid #cbd5e1;">
          <div style="font-weight:700;color:#475569;font-size:8px;text-transform:uppercase;font-family:monospace;margin-bottom:3px;">OBSERVACIONES</div>
          <p style="color:#334155;font-size:9px;margin:0;">${observations}</p>
        </div>`
      : '';

    const registeredBadgeHtml = isCompletedSale
      ? `<div style="background:#15803d;color:#fff;font-size:7.5px;font-family:monospace;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;padding:3px 10px;display:inline-block;margin-top:5px;">✓ REGISTRADA EN SISTEMA</div>`
      : '';

    const clientName =
      shippingInfo?.provincia?.consigneeName ||
      shippingInfo?.lima?.recipientName ||
      customer.businessName ||
      customer.name ||
      'Cliente de Mostrador';
    const clientDni =
      shippingInfo?.provincia?.consigneeDni ||
      shippingInfo?.lima?.recipientDni ||
      customer.documentNumber;
    const clientPhone =
      shippingInfo?.provincia?.consigneePhone ||
      shippingInfo?.lima?.recipientPhone ||
      customer.phone;

    const logoUrl = `${window.location.origin}/vanta-logo.png`;
    const qrUrl = `${window.location.origin}/pagos/codigo-qr.jpeg`;

    const htmlString = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${documentTitle.replace(/\s+/g, '_')}_${documentCode}_VANTA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { margin: 0; padding: 0; background: #fff; font-family: 'Inter', system-ui, sans-serif; font-size: 11px; color: #0f172a; }
    table { border-collapse: collapse; width: 100%; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body>
<div style="background:#fff;">

  <!-- ═══════ BANNER HEADER ═══════ -->
  <div style="background:#0f172a;padding:16px 22px;display:flex;justify-content:space-between;align-items:center;gap:16px;">
    <div style="display:flex;align-items:center;gap:14px;">
      <div style="width:58px;height:58px;border-radius:50%;overflow:hidden;background:#1e293b;flex-shrink:0;border:2px solid #e11d48;display:flex;align-items:center;justify-content:center;">
        <img src="${logoUrl}" alt="V" style="width:56px;height:56px;border-radius:50%;object-fit:cover;" onerror="this.parentElement.innerHTML='<span style=font-size:20px;font-weight:900;color:#fff;>V</span>'"/>
      </div>
      <div>
        <div style="font-size:30px;font-weight:900;letter-spacing:0.22em;color:#fff;line-height:1;">VANTA</div>
        <div style="font-size:8px;color:#e11d48;font-family:monospace;text-transform:uppercase;letter-spacing:0.14em;margin-top:4px;">ATELIER POS &nbsp;·&nbsp; ${documentTitle}</div>
        <div style="font-size:7px;color:#475569;font-family:monospace;margin-top:2px;">Ingeniería Textil · Streetwear · Lima, Perú · +51 904 536 406</div>
      </div>
    </div>
    <div style="text-align:right;flex-shrink:0;">
      <div style="background:#e11d48;padding:6px 14px;display:inline-block;margin-bottom:6px;">
        <span style="font-family:monospace;font-size:14px;font-weight:800;color:#fff;letter-spacing:0.06em;">${documentCode}</span>
      </div>
      <div style="font-size:8px;color:#94a3b8;font-family:monospace;display:block;">${issueDate}</div>
      <div style="font-size:7.5px;color:#64748b;font-family:monospace;display:block;margin-top:2px;">Vendedor: <span style="color:#94a3b8;">${sellerName}</span></div>
      ${registeredBadgeHtml}
    </div>
  </div>
  <div style="height:3px;background:#e11d48;"></div>

  <!-- BODY -->
  <div style="padding:16px 22px;">

    <!-- CLIENT + SHIPPING CARDS -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div style="border:1px solid #e2e8f0;border-top:3px solid #0f172a;padding:12px;">
        <div style="font-family:monospace;font-size:8px;text-transform:uppercase;letter-spacing:0.1em;color:#64748b;font-weight:700;margin-bottom:8px;">👤 DATOS DEL CLIENTE</div>
        <div style="font-weight:800;font-size:11px;color:#0f172a;text-transform:uppercase;margin-bottom:5px;">${clientName}</div>
        ${clientDni ? `<div style="display:flex;gap:6px;margin-bottom:3px;font-size:9px;"><span style="font-family:monospace;color:#94a3b8;min-width:48px;">DNI/RUC</span><span style="font-weight:600;color:#334155;">${clientDni}</span></div>` : ''}
        ${clientPhone ? `<div style="display:flex;gap:6px;font-size:9px;"><span style="font-family:monospace;color:#94a3b8;min-width:48px;">CELULAR</span><span style="font-weight:600;color:#334155;">${clientPhone}</span></div>` : ''}
      </div>
      <div style="border:1px solid #e2e8f0;border-top:3px solid ${destinationType === 'PROVINCIA' ? '#7c3aed' : '#be123c'};padding:12px;">
        ${shippingHtml}
      </div>
    </div>

    <!-- PRODUCTS TABLE -->
    <div style="margin-bottom:16px;border:1px solid #e2e8f0;overflow:hidden;">
      <table>
        <thead>
          <tr style="background:#0f172a;">
            <th style="padding:8px;font-family:monospace;font-size:8px;text-transform:uppercase;color:#94a3b8;text-align:left;width:26px;">#</th>
            <th style="padding:8px;font-family:monospace;font-size:8px;text-transform:uppercase;color:#94a3b8;text-align:left;">PRENDA / MODELO</th>
            <th style="padding:8px;font-family:monospace;font-size:8px;text-transform:uppercase;color:#94a3b8;text-align:left;">ESPECIFICACIONES</th>
            <th style="padding:8px;font-family:monospace;font-size:8px;text-transform:uppercase;color:#94a3b8;text-align:center;width:44px;">CANT.</th>
            <th style="padding:8px;font-family:monospace;font-size:8px;text-transform:uppercase;color:#94a3b8;text-align:right;width:70px;">P. UNIT.</th>
            <th style="padding:8px;font-family:monospace;font-size:8px;text-transform:uppercase;color:#94a3b8;text-align:right;width:70px;">SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          ${discountRow}
          ${shippingRow}
          <tr style="background:#f8fafc;border-top:1px solid #e2e8f0;">
            <td colspan="5" style="padding:6px 8px;font-family:monospace;font-size:9px;color:#64748b;text-align:right;font-weight:600;">SUBTOTAL PRENDAS:</td>
            <td style="padding:6px 8px;text-align:right;font-family:monospace;font-size:10px;font-weight:700;color:#0f172a;">S/. ${subtotalItems.toFixed(2)}</td>
          </tr>
          <tr style="background:#0f172a;">
            <td colspan="5" style="padding:8px;font-family:monospace;font-size:10px;font-weight:800;color:#fff;text-align:right;letter-spacing:0.08em;">TOTAL DE LA VENTA:</td>
            <td style="padding:8px;text-align:right;font-family:monospace;font-size:15px;font-weight:900;color:#e11d48;">S/. ${computedTotal.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="display:flex;justify-content:flex-end;margin-bottom:16px;">
      <div style="min-width:260px;">${advanceHtml}${paymentLine}</div>
    </div>

    ${obsHtml}

    <!-- PAYMENT ACCOUNTS -->
    <div style="border:1px solid #e2e8f0;border-top:3px solid #e11d48;display:flex;margin-bottom:14px;">
      <div style="flex-shrink:0;padding:12px;background:#f8fafc;border-right:1px solid #e2e8f0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:90px;">
        <div style="width:68px;height:68px;border:1px solid #cbd5e1;padding:3px;background:#fff;">
          <img src="${qrUrl}" alt="QR" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.display='none'"/>
        </div>
        <div style="font-size:6.5px;font-family:monospace;color:#94a3b8;text-transform:uppercase;font-weight:700;margin-top:4px;text-align:center;">QR MULTI-BANCO</div>
      </div>
      <div style="flex:1;padding:12px 14px;">
        <div style="font-family:monospace;font-size:8px;font-weight:800;color:#e11d48;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">✦ CUENTAS OFICIALES DE ABONO</div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:3px 10px;font-family:monospace;font-size:8.5px;color:#1e293b;">
          <span style="color:#94a3b8;font-size:7.5px;">YAPE / PLIN</span><span style="font-weight:700;background:#f1f5f9;padding:1px 5px;">904 536 406 / 924 058 988</span>
          <span style="color:#94a3b8;font-size:7.5px;">BCP SOLES</span><span>191-0014100063-0-53</span>
          <span style="color:#94a3b8;font-size:7.5px;">BBVA SOLES</span><span>0011-0175-0200543981</span>
          <span style="color:#94a3b8;font-size:7.5px;">INTERBANK</span><span>200-3001249821</span>
          <span style="color:#94a3b8;font-size:7.5px;">TITULAR</span><span style="font-weight:600;">BRYAN MICHAEL REQUENA AVILA &nbsp;·&nbsp; RUC 10714931062</span>
        </div>
        <div style="margin-top:6px;font-size:7.5px;color:#94a3b8;font-family:monospace;">* Indicar N° doc. <strong style="color:#475569;">${documentCode}</strong> en referencia · WhatsApp: +51 904 536 406</div>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="border-top:1px solid #e2e8f0;padding-top:8px;font-size:7.5px;color:#94a3b8;font-family:monospace;line-height:1.7;">
      <span style="font-size:8px;color:#475569;font-weight:700;text-transform:uppercase;">GARANTÍA VANTA ATELIER PERÚ</span>
      &nbsp;·&nbsp; Cambios válidos 7 días con etiqueta intacta &nbsp;·&nbsp; Hilado 420 / 300 GSM &nbsp;·&nbsp; Lavar agua fría, sin centrifugado, secar a la sombra.
      <div style="margin-top:3px;color:#cbd5e1;">Sistema POS VANTA Store © ${new Date().getFullYear()} · Todos los derechos reservados.</div>
    </div>

  </div>
</div>
<script>
  window.onload = function() {
    setTimeout(function() { window.focus(); window.print(); }, 400);
  };
</script>
</body>
</html>`;

    // Use Blob URL — avoids popup blockers and cross-origin style issues entirely
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    if (!win) {
      // Fallback: write into a new window if open was blocked
      const fallback = window.open('', '_blank', 'width=960,height=1200');
      if (fallback) {
        fallback.document.write(htmlString);
        fallback.document.close();
      } else {
        alert('Tu navegador bloqueó la ventana emergente. Por favor permite ventanas emergentes para este sitio e intenta de nuevo.');
      }
    }
    // Revoke the blob URL after a short delay so the window has time to load it
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  };

  const handleSendWhatsApp = () => {
    const rawPhone = (customer.phone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length === 9 ? `51${rawPhone}` : rawPhone || '51904536406';

    let msg = `Hola *${customer.name || customer.businessName || 'Estimado(a)'}*, le saluda VANTA Atelier.\n\n`;
    msg += `Le compartimos su *${documentTitle}* emitida desde nuestro terminal de ventas:\n`;
    msg += `📄 *DOCUMENTO:* ${documentCode}\n`;
    msg += `📅 *Fecha:* ${issueDate}\n`;
    msg += `👤 *Atendido por:* ${sellerName}\n`;
    msg += `💰 *TOTAL DE LA VENTA:* S/ ${computedTotal.toFixed(2)}\n`;

    if (isAdvancePayment && typeof pendingBalance === 'number' && pendingBalance > 0) {
      const adv = advanceAmount ?? (computedTotal - pendingBalance);
      msg += `💵 *Adelanto registrado:* S/ ${adv.toFixed(2)}\n`;
      msg += `⏳ *Saldo pendiente:* S/ ${pendingBalance.toFixed(2)} (contraentrega o previo al despacho)\n`;
    }

    if (paymentAccountLabel) {
      msg += `💳 *Medio / Banco:* ${paymentAccountLabel}\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*Prendas (${totalQuantity} unid):*\n`;
    items.forEach((it, idx) => {
      const sleeve = it.selectedSleeve ? ` [${it.selectedSleeve}]` : '';
      msg += `${idx + 1}. *${it.productName}*${sleeve} (${it.selectedSize} / ${it.selectedColor}) x${it.quantity} = S/ ${it.subtotal.toFixed(2)}\n`;
    });
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `\nPara cualquier coordinación o seguimiento de su paquete, responda a este chat. ¡Muchas gracias por elegir VANTA! 🔥🖤`;

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(documentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      id="pos-proforma-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="pos-proforma-modal-container"
        className="w-full max-w-3xl bg-paper text-ink border border-line shadow-2xl flex flex-col max-h-[96vh] overflow-hidden my-auto animate-in zoom-in-95 duration-200 rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-paper-soft border-b border-line flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-ink">
              {documentTitle} // FORMATO A4
            </span>
            {isCompletedSale && (
              <span className="text-[8.5px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 font-bold">
                REGISTRADA
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="hidden sm:flex items-center gap-1 text-[10px] font-mono border border-line px-2 py-1 bg-panel text-muted hover:text-ink cursor-pointer transition-colors"
              title="Copiar código del documento"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'COPIADO' : documentCode}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-ink hover:bg-panel rounded-full transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Proforma / Nota de Venta Sheet Preview (Exact A4 Styling) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8 bg-panel flex justify-center">
          <div
            ref={printableRef}
            className="w-full max-w-2xl bg-white text-slate-900 border border-slate-200 p-6 sm:p-10 shadow-lg font-sans text-xs relative"
            style={{ minHeight: '700px' }}
          >
            {/* Header / Brand Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 mb-5 gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="/vanta-logo.png"
                  alt="VANTA"
                  className="w-12 h-12 rounded-full object-contain shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/logo-oficial.png';
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-2xl sm:text-3xl tracking-[0.2em] text-slate-950">
                      VANTA
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-slate-900 text-white px-2 py-0.5 tracking-widest font-bold">
                      ATELIER POS
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 font-mono uppercase tracking-wider mt-1">
                    Ingeniería Textil // Confección Streetwear de Alto Gramaje
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono">
                    Sede Central: Lima, Perú • WhatsApp Comercial: +51 904 536 406
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-500 font-bold block">
                  {documentTitle}
                </span>
                <span className="font-mono text-base font-black text-rose-700 tracking-wider block">
                  {documentCode}
                </span>
                <span className="text-[9.5px] font-mono text-slate-600 block">
                  Fecha: <strong>{issueDate}</strong>
                </span>
                <span className="text-[8.5px] font-mono text-slate-400 block">
                  Atendido por: <strong>{sellerName}</strong>
                </span>
                {isCompletedSale && (
                  <span className="inline-block text-[8px] font-mono uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 font-bold">
                    ✓ REGISTRADA EN EL SISTEMA
                  </span>
                )}
              </div>
            </div>

            {/* Client and Destination Info Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 mb-5 text-[10.5px]">
              <div className="space-y-1">
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-400 font-bold block flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-500" />
                  DATOS DEL CLIENTE / CONSIGNADO
                </span>
                <p className="font-bold text-slate-900 uppercase">
                  {shippingInfo?.provincia?.consigneeName ||
                    shippingInfo?.lima?.recipientName ||
                    customer.businessName ||
                    customer.name ||
                    'Cliente de Mostrador'}
                </p>
                {(shippingInfo?.provincia?.consigneeDni ||
                  shippingInfo?.lima?.recipientDni ||
                  customer.documentNumber) && (
                  <p className="text-slate-600 font-mono text-[9.5px]">
                    DNI / RUC:{' '}
                    <strong>
                      {shippingInfo?.provincia?.consigneeDni ||
                        shippingInfo?.lima?.recipientDni ||
                        customer.documentNumber}
                    </strong>
                  </p>
                )}
                {(shippingInfo?.provincia?.consigneePhone ||
                  shippingInfo?.lima?.recipientPhone ||
                  customer.phone) && (
                  <p className="text-slate-600 font-mono text-[9.5px] flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" />
                    <span>
                      {shippingInfo?.provincia?.consigneePhone ||
                        shippingInfo?.lima?.recipientPhone ||
                        customer.phone}
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-400 font-bold block flex sm:justify-end items-center gap-1">
                  {destinationType === 'PROVINCIA' ? (
                    <Package className="w-3 h-3 text-purple-600" />
                  ) : (
                    <Truck className="w-3 h-3 text-rose-600" />
                  )}
                  {destinationType === 'PROVINCIA'
                    ? 'FORMULARIO DE ENVÍO – VANTA'
                    : 'FORMULARIO DE ENVÍO A LIMA – VANTA'}
                </span>
                {destinationType === 'PROVINCIA' ? (
                  <div>
                    <p className="font-bold text-purple-900 uppercase">
                      🚚 Transporte:{' '}
                      {shippingInfo?.provincia?.agency === 'OTRA'
                        ? shippingInfo?.provincia?.otherAgencyName || 'OTRA'
                        : shippingInfo?.provincia?.agency || 'SHALOM'}
                    </p>
                    <p className="text-slate-800 text-[10px] mt-0.5">
                      📍{' '}
                      {shippingInfo?.provincia?.departmentProvinceDistrict ||
                        (shippingInfo?.provincia?.provinceCity
                          ? `${shippingInfo.provincia.provinceCity}, ${shippingInfo.provincia.department}`
                          : shippingInfo?.provincia?.department) ||
                        customer.district ||
                        'Provincia'}
                    </p>
                    <p className="text-slate-700 text-[10px] mt-0.5">
                      🏢 Agencia:{' '}
                      {shippingInfo?.provincia?.agencyBranch ||
                        (shippingInfo?.provincia?.deliveryType === 'DOMICILIO'
                          ? shippingInfo?.provincia?.address || customer.address
                          : 'Sede Central')}
                    </p>
                    <p className="text-slate-500 font-mono text-[9px] mt-0.5">
                      🏷️{' '}
                      {shippingInfo?.provincia?.freightPayment === 'PAGO_DESTINO'
                        ? 'PAGO EN DESTINO (S/ 0.00 en pedido)'
                        : `Flete pagado (S/ ${shippingCost.toFixed(2)})`}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-bold text-slate-950 uppercase">
                      📍 Distrito: {shippingInfo?.lima?.district || customer.district || 'Lima'}
                    </p>
                    <p className="text-slate-700 text-[10px] mt-0.5">
                      🏠 Dirección: {shippingInfo?.lima?.address || customer.address || 'Lima'}
                    </p>
                    {shippingInfo?.lima?.reference && (
                      <p className="text-slate-600 text-[9.5px] mt-0.5">
                        📌 Ref: {shippingInfo.lima.reference}
                      </p>
                    )}
                    <p className="text-slate-500 font-mono text-[9px] mt-0.5">
                      🛵 Envío:{' '}
                      {shippingCost === 0
                        ? 'Recojo en tienda / Gratis'
                        : `Delivery S/ ${shippingCost.toFixed(2)}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Garments Table */}
            <div className="overflow-x-auto mb-5">
              <table className="w-full border-collapse text-[10.5px]">
                <thead>
                  <tr className="border-y-2 border-slate-900 bg-slate-100 font-mono text-[9px] text-slate-800 uppercase tracking-wider">
                    <th className="py-2 px-2 text-left w-8">#</th>
                    <th className="py-2 px-2 text-left">Prenda / Modelo</th>
                    <th className="py-2 px-2 text-left">Especificaciones</th>
                    <th className="py-2 px-2 text-center w-12">Cant.</th>
                    <th className="py-2 px-2 text-right w-20">P. Unit.</th>
                    <th className="py-2 px-2 text-right w-20">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2 px-2 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-2">
                        <span className="font-bold text-slate-950 block">{item.productName}</span>
                        <span className="text-[8.5px] text-slate-500 font-mono uppercase">
                          COD: {item.productId.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-[9.5px] text-slate-600 font-mono">
                        <div>
                          Talla: <b className="text-slate-900">{item.selectedSize}</b> | Color:{' '}
                          <b className="text-slate-900">{item.selectedColor}</b>
                        </div>
                        <div className="text-slate-500 text-[8.5px]">
                          {item.selectedFabric || 'Textil Pesado'} •{' '}
                          {item.selectedSleeve || 'Manga Corta'}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center font-mono font-bold text-slate-800">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-2 text-right font-mono text-slate-700">
                        S/. {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-slate-950">
                        S/. {item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Financial Breakdown */}
            <div className="flex justify-end mb-5">
              <div className="w-full sm:w-72 space-y-1.5 font-mono text-[10.5px]">
                <div className="flex justify-between text-slate-600 py-1 border-b border-slate-200">
                  <span>Subtotal Prendas:</span>
                  <span className="font-semibold text-slate-900">S/. {subtotalItems.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-700 py-1 border-b border-slate-200 font-bold">
                    <span>Descuento Aplicado:</span>
                    <span>-S/. {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-slate-600 py-1 border-b border-slate-200">
                    <span>Despacho / Envío:</span>
                    <span className="font-semibold text-slate-900">S/. {shippingCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 text-sm border-t-2 border-slate-900">
                  <span className="font-bold text-slate-950 tracking-wider">TOTAL DE LA VENTA:</span>
                  <span className="font-black text-rose-700 text-base font-mono">
                    S/. {computedTotal.toFixed(2)}
                  </span>
                </div>

                {/* Adelanto y Saldo Pendiente (Pago Parcial) */}
                {isAdvancePayment && typeof pendingBalance === 'number' && pendingBalance > 0 ? (
                  <div className="mt-2 pt-2 border-t border-dashed border-amber-300 space-y-1 bg-amber-50/80 p-2.5 border border-amber-200 rounded-xs">
                    <div className="flex justify-between text-emerald-800 font-bold text-[10px]">
                      <span>💰 ADELANTO RECIBIDO:</span>
                      <span>S/. {(advanceAmount ?? (computedTotal - pendingBalance)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-rose-700 font-black text-xs pt-1 border-t border-amber-200">
                      <span>⏳ SALDO PENDIENTE:</span>
                      <span>S/. {pendingBalance.toFixed(2)}</span>
                    </div>
                    <div className="text-[8px] text-amber-900 font-mono italic mt-0.5">
                      * Saldo a liquidar contraentrega o previo al despacho del paquete.
                    </div>
                  </div>
                ) : isCompletedSale ? (
                  <div className="mt-1 text-right">
                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-xs inline-block">
                      ✓ PAGADO 100% EN SOLES
                    </span>
                  </div>
                ) : null}

                {/* Medio / Banco de Pago */}
                {paymentAccountLabel && (
                  <div className="flex justify-between text-[9px] text-slate-600 pt-1">
                    <span>Medio de Pago:</span>
                    <span className="font-bold text-slate-800">{paymentAccountLabel}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Observations if any */}
            {observations && (
              <div className="p-2.5 bg-slate-50 border border-slate-200 mb-5 text-[9.5px] font-mono">
                <span className="font-bold text-slate-800 uppercase block mb-0.5">Observaciones:</span>
                <p className="text-slate-600">{observations}</p>
              </div>
            )}

            {/* Payment Accounts and Real QR Section */}
            <div className="border border-slate-200 p-3.5 bg-slate-50 mb-5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-3 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-white border border-slate-300 p-1 shadow-xs">
                  <img
                    src="/pagos/codigo-qr.jpeg"
                    alt="Código QR de Pago VANTA"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mt-1 text-center font-bold">
                  QR MULTI-BANCO
                </span>
              </div>

              <div className="sm:col-span-9 space-y-1 text-[9.5px] font-mono">
                <span className="text-[8px] uppercase font-bold tracking-wider text-rose-700 block">
                  ✦ CUENTAS OFICIALES PARA ABONO O TRANSFERENCIA
                </span>
                <p className="text-slate-800">
                  • <strong>Yape / Plin / Agora Pay / Oh! Pay:</strong>{' '}
                  <span className="font-bold text-slate-950 bg-slate-200 px-1">904 536 406 / 924 058 988</span>
                </p>
                <p className="text-slate-800">
                  • <strong>BCP Soles:</strong> 191-0014100063-0-53 (CCI: 002-191-0014100063053-53)
                </p>
                <p className="text-slate-800">
                  • <strong>Titular:</strong> BRYAN MICHAEL REQUENA AVILA (RUC: 10714931062)
                </p>
                <p className="text-[8px] text-slate-500 pt-0.5">
                  * Indicar el número de documento <strong>{documentCode}</strong> en la referencia de abono o enviar comprobante al WhatsApp comercial.
                </p>
              </div>
            </div>

            {/* Atelier Policy Box */}
            <div className="border-t border-slate-200 pt-3 text-[8px] text-slate-400 font-mono space-y-0.5 leading-tight">
              <div className="flex items-center gap-1 text-slate-600 font-semibold uppercase">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>GARANTÍA DE CONFECCIÓN // VANTA ATELIER PERÚ</span>
              </div>
              <p>
                • Cambios de prenda válidos dentro de los 7 días posteriores a la entrega con etiqueta original intacta.
              </p>
              <p>
                • Hilado pesado 420 GSM / 300 GSM. Cuidado textil: lavar con agua fría, sin centrifugado agresivo, secado a la sombra.
              </p>
              <p className="text-slate-400 pt-0.5">
                Documento emitido por el sistema POS de VANTA Store. Todos los derechos reservados © {new Date().getFullYear()}.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 sm:p-4 bg-paper-soft border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenTicket && (
              <button
                type="button"
                onClick={onOpenTicket}
                className="bg-panel hover:bg-zinc-800 text-ink border border-line font-mono text-xs uppercase py-2.5 px-3 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Ver versión en ticket térmico de 80mm"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Ticket 80mm</span>
              </button>
            )}

            {onNewSale && (
              <button
                type="button"
                onClick={onNewSale}
                className="bg-panel hover:bg-zinc-800 text-ink border border-line font-mono text-xs uppercase py-2.5 px-3 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Iniciar una nueva venta vacía"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Nueva Venta</span>
              </button>
            )}

            {onRegisterSale && !isCompletedSale && (
              <button
                type="button"
                onClick={onRegisterSale}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase py-2.5 px-3.5 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                title="Confirmar y registrar esta Nota de Venta en el sistema"
              >
                <Check className="w-4 h-4" />
                <span>Registrar Nota</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="pos-proforma-wa-btn"
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider py-2.5 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-xs shadow-sm"
              title="Compartir nota y resumen al WhatsApp del cliente"
            >
              <Send className="w-3.5 h-3.5" />
              <span>ENVIAR A WHATSAPP</span>
            </button>

            <button
              id="pos-proforma-print-pdf-btn"
              onClick={handlePrintA4}
              className="flex-1 sm:flex-none bg-accent text-white hover:bg-rose-600 font-mono font-bold text-xs uppercase tracking-wider py-2.5 px-5 flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer rounded-xs"
              title="Abrir vista de impresión A4 para guardar en PDF o imprimir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DESCARGAR / IMPRIMIR A4 (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
