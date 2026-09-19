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
    if (receiptType === 'NOTA_VENTA') return 'NOTA DE VENTA';
    if (receiptType === 'BOLETA') return 'BOLETA DE VENTA ELECTRÓNICA';
    if (receiptType === 'FACTURA') return 'FACTURA ELECTRÓNICA';
    return isCompletedSale ? 'NOTA DE VENTA' : 'COTIZACIÓN / PROFORMA';
  }, [receiptType, isCompletedSale]);

  // Generate or use distinct official document code (Número de orden aleatorio)
  const documentCode = useMemo(() => {
    if (existingReceiptNumber) {
      // Si tiene el formato correlativo secuencial antiguo (ej. NV-0001-0000001 o 0001-0000001), convertir a aleatorio
      if (
        /^NV-?0001-\d+/i.test(existingReceiptNumber) ||
        /^0001-\d+/i.test(existingReceiptNumber)
      ) {
        const seed = Math.abs(
          items.reduce((acc, it) => acc + it.productId.charCodeAt(0) * it.quantity, 0) +
            Math.floor(computedTotal * 10) +
            (customer?.phone ? parseInt(customer.phone.replace(/\D/g, '').slice(-4) || '3819', 10) : 3819)
        );
        const rand = 100000 + (seed % 900000);
        return String(rand);
      }
      return existingReceiptNumber;
    }
    const seed = Math.abs(
      items.reduce((acc, it) => acc + it.productId.charCodeAt(0) * it.quantity, 0) +
        Math.floor(computedTotal * 10) +
        Math.floor(Math.random() * 899999)
    );
    const rand = 100000 + (seed % 900000);
    return String(rand);
  }, [existingReceiptNumber, items, computedTotal, customer?.phone]);

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

  // High-fidelity A4 Print — OPTION 1: MINIMAL LUXURY (SWISS HIGH-FASHION)
  const handlePrintA4 = () => {
    // Build shipping one-liner
    let shippingText = '';
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
          ? 'PAGO EN DESTINO'
          : `Flete pagado (S/ ${shippingCost.toFixed(2)})`;
      shippingText = `ENVÍO: PROVINCIA (${agency}) · Destino: ${location} · Sede/Dir: ${agencyBranch} · [${freightText}]`;
    } else {
      const district = shippingInfo?.lima?.district || customer.district || 'Lima';
      const address = shippingInfo?.lima?.address || customer.address || 'Showroom';
      const reference = shippingInfo?.lima?.reference ? ` (Ref: ${shippingInfo.lima.reference})` : '';
      const shippingLine = shippingCost === 0 ? 'Recojo en Showroom / Gratis' : `Delivery Motorizado S/ ${shippingCost.toFixed(2)}`;
      shippingText = `ENVÍO: LIMA (${district}) · Dir: ${address}${reference} · [${shippingLine}]`;
    }

    // Build items rows HTML (Option 1: Stark, clean typography with red numbered index)
    const itemsHtml = items
      .map((item, idx) => {
        const itemNumber = String(idx + 1).padStart(2, '0');
        const isMangaLarga = item.selectedSleeve === 'Manga Larga';
        return `
      <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#fafaf9'};border-bottom:1px solid #e2e8f0;">
        <td style="padding:10px 12px;border-right:1px solid #e2e8f0;">
          <div style="display:flex;align-items:baseline;gap:6px;">
            <span style="font-family:monospace;font-weight:800;color:#e11d48;font-size:10.5px;">${itemNumber}.</span>
            <span style="font-weight:800;color:#000000;font-size:11px;text-transform:uppercase;letter-spacing:0.02em;">${item.productName}</span>
            ${isMangaLarga ? '<span style="font-size:7.5px;font-weight:800;background:#000;color:#fff;padding:1px 4px;font-family:monospace;">M/L</span>' : ''}
          </div>
          <div style="font-size:8px;color:#64748b;font-family:monospace;margin-top:2px;padding-left:22px;">
            COD: ${item.productId.toUpperCase()} &nbsp;·&nbsp; ${item.selectedFabric || 'Textil 420 GSM'} &nbsp;·&nbsp; Color: ${item.selectedColor}
          </div>
        </td>
        <td style="padding:10px 8px;text-align:center;font-family:monospace;font-weight:700;font-size:11px;color:#000000;border-right:1px solid #e2e8f0;">
          ${item.selectedSize}
        </td>
        <td style="padding:10px 8px;text-align:center;font-family:monospace;font-weight:800;font-size:11px;color:#000000;border-right:1px solid #e2e8f0;">
          ${item.quantity}
        </td>
        <td style="padding:10px 12px;text-align:right;font-family:monospace;font-size:10.5px;color:#334155;border-right:1px solid #e2e8f0;">
          ${item.unitPrice.toFixed(2)}
        </td>
        <td style="padding:10px 12px;text-align:right;font-family:monospace;font-weight:800;font-size:11.5px;color:#000000;">
          ${item.subtotal.toFixed(2)}
        </td>
      </tr>`;
      })
      .join('');

    let advanceHtml = '';
    if (isAdvancePayment && typeof pendingBalance === 'number' && pendingBalance > 0) {
      const adv = advanceAmount ?? computedTotal - pendingBalance;
      advanceHtml = `
        <div style="display:flex;justify-content:flex-end;margin-top:-14px;margin-bottom:20px;">
          <div style="width:280px;border:1.5px solid #000;background:#fff;font-family:monospace;padding:8px 12px;">
            <div style="display:flex;justify-content:space-between;color:#047857;font-size:9.5px;font-weight:800;margin-bottom:4px;">
              <span>ADELANTO RECIBIDO:</span><span>S/. ${adv.toFixed(2)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;color:#e11d48;font-size:11px;font-weight:900;padding-top:4px;border-top:1px dashed #000;">
              <span>SALDO PENDIENTE:</span><span>S/. ${pendingBalance.toFixed(2)}</span>
            </div>
            <div style="font-size:7.5px;color:#64748b;margin-top:3px;">* Saldo a liquidar contraentrega o previo al despacho.</div>
          </div>
        </div>`;
    } else if (isCompletedSale) {
      advanceHtml = `
        <div style="display:flex;justify-content:flex-end;margin-top:-14px;margin-bottom:20px;">
          <span style="font-family:monospace;font-size:8.5px;font-weight:800;color:#047857;border:1px solid #047857;padding:3px 10px;text-transform:uppercase;letter-spacing:0.08em;">
            ✓ PAGADO AL 100% EN SOLES
          </span>
        </div>`;
    }

    const obsHtml = observations
      ? `<div style="margin-bottom:18px;padding:8px 12px;background:#fafaf9;border-left:3px solid #000000;">
          <div style="font-weight:800;color:#000000;font-size:8px;text-transform:uppercase;font-family:monospace;margin-bottom:2px;">OBSERVACIONES:</div>
          <p style="color:#334155;font-size:9px;margin:0;font-family:monospace;">${observations}</p>
        </div>`
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

    const htmlString = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${documentTitle.replace(/\s+/g, '_')}_${documentCode}_VANTA</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 15mm 15mm 15mm 15mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { margin: 0; padding: 0; background: #ffffff; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; color: #000000; }
    table { border-collapse: collapse; width: 100%; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body>
<div style="background:#ffffff;max-width:190mm;margin:0 auto;padding:10px 0;">

  <!-- ═══════ HEADER: OPTION 1 MINIMAL LUXURY ═══════ -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
    <div>
      <div style="font-size:40px;font-weight:900;letter-spacing:0.18em;color:#000000;line-height:1;margin-bottom:8px;">VANTA</div>
      <div style="font-size:9.5px;color:#000000;font-family:monospace;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;">
        VANTA ATELIER // ${documentTitle}
      </div>
      <div style="font-size:9px;color:#475569;font-family:monospace;margin-top:4px;">
        Order No: <strong style="color:#000000;font-size:10px;">${documentCode}</strong> &nbsp;|&nbsp; Fecha: ${issueDate}
      </div>
      <div style="font-size:8px;color:#64748b;font-family:monospace;margin-top:2px;">
        Atendido por: ${sellerName} &nbsp;|&nbsp; Lima, Perú
      </div>
      ${isCompletedSale ? '<div style="margin-top:5px;"><span style="font-size:7.5px;font-family:monospace;font-weight:800;background:#000;color:#fff;padding:2px 8px;text-transform:uppercase;letter-spacing:0.1em;">✓ REGISTRADA EN SISTEMA</span></div>' : ''}
    </div>

    <!-- LOGO DE LA MARCA (VANTA) -->
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
      <div style="width:76px;height:76px;display:flex;align-items:center;justify-content:center;border-radius:50%;border:1.5px solid #000000;padding:4px;background:#ffffff;">
        <img src="${logoUrl}" alt="VANTA" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.innerHTML='<span style=font-size:30px;font-weight:900;color:#000;>V</span>'"/>
      </div>
      <span style="font-family:monospace;font-size:7.5px;letter-spacing:0.18em;font-weight:900;color:#000000;text-transform:uppercase;">OFFICIAL ATELIER</span>
    </div>
  </div>

  <div style="border-bottom:1.5px solid #000000;margin-bottom:16px;"></div>

  <!-- ═══════ BILL TO / CLIENTE ═══════ -->
  <div style="margin-bottom:20px;font-family:monospace;font-size:9.5px;line-height:1.6;color:#1e293b;">
    <div style="font-size:8px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;margin-bottom:3px;">
      BILL TO / DATOS DEL CLIENTE:
    </div>
    <div style="font-size:12px;font-weight:900;color:#000000;text-transform:uppercase;letter-spacing:0.04em;">
      ${clientName}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:3px;color:#334155;">
      ${clientDni ? `<span>DNI/RUC: <strong style="color:#000;">${clientDni}</strong></span>` : ''}
      ${clientPhone ? `<span>TELÉFONO: <strong style="color:#000;">${clientPhone}</strong></span>` : ''}
      ${customer.address ? `<span>DIR: ${customer.address}</span>` : ''}
    </div>
    <div style="margin-top:3px;color:#334155;">
      ${shippingText}
    </div>
  </div>

  <!-- ═══════ ITEMS TABLE (OPTION 1 STYLE) ═══════ -->
  <div style="margin-bottom:22px;border:1.5px solid #000000;">
    <table>
      <thead>
        <tr style="background:#000000;color:#ffffff;">
          <th style="padding:8px 12px;font-family:monospace;font-size:8.5px;font-weight:800;letter-spacing:0.1em;text-align:left;">ITEM / PRENDA</th>
          <th style="padding:8px 8px;font-family:monospace;font-size:8.5px;font-weight:800;letter-spacing:0.1em;text-align:center;width:55px;">TALLA</th>
          <th style="padding:8px 8px;font-family:monospace;font-size:8.5px;font-weight:800;letter-spacing:0.1em;text-align:center;width:44px;">CANT.</th>
          <th style="padding:8px 12px;font-family:monospace;font-size:8.5px;font-weight:800;letter-spacing:0.1em;text-align:right;width:95px;">PRECIO UNIT. (S/.)</th>
          <th style="padding:8px 14px;font-family:monospace;font-size:8.5px;font-weight:800;letter-spacing:0.1em;text-align:right;width:100px;">TOTAL (S/.)</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
  </div>

  <!-- ═══════ FINANCIAL SUMMARY BOX (OPTION 1 STYLE) ═══════ -->
  <div style="display:flex;justify-content:flex-end;margin-bottom:24px;">
    <div style="width:280px;border:1.5px solid #000000;font-family:monospace;">
      <div style="display:flex;justify-content:space-between;padding:6px 12px;font-size:9.5px;border-bottom:1px solid #000000;">
        <span style="font-weight:700;color:#475569;">SUBTOTAL:</span>
        <span style="font-weight:800;color:#000000;">S/. ${subtotalItems.toFixed(2)}</span>
      </div>
      ${discountAmount > 0 ? `
      <div style="display:flex;justify-content:space-between;padding:6px 12px;font-size:9.5px;border-bottom:1px solid #000000;color:#e11d48;">
        <span style="font-weight:700;">DESCUENTO:</span>
        <span style="font-weight:800;">-S/. ${discountAmount.toFixed(2)}</span>
      </div>` : ''}
      ${shippingCost > 0 ? `
      <div style="display:flex;justify-content:space-between;padding:6px 12px;font-size:9.5px;border-bottom:1px solid #000000;">
        <span style="font-weight:700;color:#475569;">ENVÍO / FLETE:</span>
        <span style="font-weight:800;color:#000000;">S/. ${shippingCost.toFixed(2)}</span>
      </div>` : ''}
      <div style="background:#000000;color:#ffffff;display:flex;justify-content:space-between;align-items:center;padding:9px 12px;">
        <span style="font-weight:900;font-size:11px;letter-spacing:0.08em;color:#e11d48;">TOTAL:</span>
        <span style="font-weight:900;font-size:15px;color:#ffffff;">S/. ${computedTotal.toFixed(2)}</span>
      </div>
    </div>
  </div>

  ${advanceHtml}
  ${obsHtml}

  <!-- ═══════ AUTHENTICITY STAMP / GUARANTEE FOOTER ═══════ -->
  <div style="margin-top:40px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border-top:1px solid #e2e8f0;padding-top:24px;">
    <div style="width:52px;height:52px;border-radius:50%;border:1.5px solid #000000;display:flex;align-items:center;justify-content:center;padding:5px;">
      <img src="${logoUrl}" alt="V" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.parentElement.innerHTML='<span style=font-weight:900;font-size:20px;>V</span>'"/>
    </div>
    <div style="font-family:monospace;font-size:8.5px;font-weight:900;letter-spacing:0.18em;text-transform:uppercase;color:#000000;">
      AUTHENTICITY GUARANTEED // VANTA ATELIER
    </div>
    <div style="font-size:7.5px;color:#64748b;font-family:monospace;text-align:center;line-height:1.5;">
      Confección de alto gramaje · Hilado 420 / 300 GSM · Algodón reactivo premium<br/>
      Cambios válidos dentro de los 7 días posteriores a la entrega con etiqueta original intacta.
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
            className="w-full max-w-2xl bg-white text-slate-900 border border-slate-300 p-6 sm:p-10 shadow-sm font-sans text-xs relative"
            style={{ minHeight: '650px' }}
          >
            {/* Header / Brand Banner (Option 1: Minimal Luxury) */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-black pb-5 mb-5 gap-4">
              <div>
                <span className="font-display font-black text-3xl sm:text-4xl tracking-[0.18em] text-black block leading-none mb-1.5">
                  VANTA
                </span>
                <span className="text-[9.5px] font-mono uppercase font-bold tracking-widest text-black block">
                  VANTA ATELIER // {documentTitle}
                </span>
                <p className="text-[9px] text-slate-500 font-mono mt-1">
                  Order No: <strong className="text-black font-bold text-[10px]">{documentCode}</strong> &nbsp;|&nbsp; Fecha: {issueDate}
                </p>
                <p className="text-[8px] text-slate-400 font-mono mt-0.5">
                  Atendido por: {sellerName} &nbsp;|&nbsp; Lima, Perú
                </p>
                {isCompletedSale && (
                  <span className="inline-block text-[7.5px] font-mono uppercase tracking-widest bg-black text-white px-2 py-0.5 font-bold mt-1.5">
                    ✓ REGISTRADA EN EL SISTEMA
                  </span>
                )}
              </div>

              {/* Logo Oficial de la Marca */}
              <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-2 border-black p-1 bg-white flex items-center justify-center shadow-xs">
                  <img
                    src="/vanta-logo.png"
                    alt="VANTA"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = '/logo-oficial.png';
                    }}
                  />
                </div>
                <span className="font-mono text-[7px] tracking-[0.2em] font-black text-black uppercase">
                  OFFICIAL ATELIER
                </span>
              </div>
            </div>

            {/* Bill To / Datos del Cliente (Option 1 Minimal Style) */}
            <div className="mb-5 font-mono text-[10px] text-slate-800 leading-relaxed border-b border-slate-200 pb-4">
              <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
                BILL TO / DATOS DEL CLIENTE:
              </span>
              <p className="font-black text-xs text-black uppercase tracking-wider">
                {shippingInfo?.provincia?.consigneeName ||
                  shippingInfo?.lima?.recipientName ||
                  customer.businessName ||
                  customer.name ||
                  'Cliente de Mostrador'}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[9.5px] text-slate-600">
                {(shippingInfo?.provincia?.consigneeDni ||
                  shippingInfo?.lima?.recipientDni ||
                  customer.documentNumber) && (
                  <span>
                    DNI/RUC:{' '}
                    <strong className="text-black">
                      {shippingInfo?.provincia?.consigneeDni ||
                        shippingInfo?.lima?.recipientDni ||
                        customer.documentNumber}
                    </strong>
                  </span>
                )}
                {(shippingInfo?.provincia?.consigneePhone ||
                  shippingInfo?.lima?.recipientPhone ||
                  customer.phone) && (
                  <span>
                    TELÉFONO:{' '}
                    <strong className="text-black">
                      {shippingInfo?.provincia?.consigneePhone ||
                        shippingInfo?.lima?.recipientPhone ||
                        customer.phone}
                    </strong>
                  </span>
                )}
                {customer.address && <span>DIR: {customer.address}</span>}
              </div>
              <div className="mt-1 text-[9px] text-slate-600">
                {destinationType === 'PROVINCIA' ? (
                  <span>
                    ENVÍO:{' '}
                    <strong className="text-black">
                      PROVINCIA ({shippingInfo?.provincia?.agency === 'OTRA' ? shippingInfo?.provincia?.otherAgencyName || 'OTRA' : shippingInfo?.provincia?.agency || 'SHALOM'})
                    </strong>{' '}
                    · Destino:{' '}
                    {shippingInfo?.provincia?.departmentProvinceDistrict ||
                      (shippingInfo?.provincia?.provinceCity
                        ? `${shippingInfo.provincia.provinceCity}, ${shippingInfo.provincia.department}`
                        : shippingInfo?.provincia?.department) ||
                      customer.district ||
                      'Provincia'}{' '}
                    · Sede/Dir:{' '}
                    {shippingInfo?.provincia?.agencyBranch ||
                      (shippingInfo?.provincia?.deliveryType === 'DOMICILIO'
                        ? shippingInfo?.provincia?.address || customer.address || ''
                        : 'Sede Central')}{' '}
                    · [
                    {shippingInfo?.provincia?.freightPayment === 'PAGO_DESTINO'
                      ? 'PAGO EN DESTINO'
                      : `Flete pagado (S/ ${shippingCost.toFixed(2)})`}
                    ]
                  </span>
                ) : (
                  <span>
                    ENVÍO:{' '}
                    <strong className="text-black">
                      LIMA ({shippingInfo?.lima?.district || customer.district || 'Lima'})
                    </strong>{' '}
                    · Dir:{' '}
                    {shippingInfo?.lima?.address || customer.address || 'Showroom'}
                    {shippingInfo?.lima?.reference ? ` (Ref: ${shippingInfo.lima.reference})` : ''}{' '}
                    · [
                    {shippingCost === 0
                      ? 'Recojo en Showroom / Gratis'
                      : `Delivery Motorizado S/ ${shippingCost.toFixed(2)}`}
                    ]
                  </span>
                )}
              </div>
            </div>

            {/* Products Table (Option 1 Style) */}
            <div className="overflow-x-auto mb-5 border border-black">
              <table className="w-full border-collapse text-[10.5px]">
                <thead>
                  <tr className="bg-black text-white font-mono text-[8.5px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 text-left">Item / Prenda</th>
                    <th className="py-2.5 px-2 text-center w-14">Talla</th>
                    <th className="py-2.5 px-2 text-center w-12">Cant.</th>
                    <th className="py-2.5 px-3 text-right w-24">Precio Unit. (S/.)</th>
                    <th className="py-2.5 px-3 text-right w-24">Total (S/.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  {items.map((item, idx) => {
                    const itemNum = String(idx + 1).padStart(2, '0');
                    const isMangaLarga = item.selectedSleeve === 'Manga Larga';
                    return (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="py-2.5 px-3 border-r border-slate-200">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-mono font-black text-rose-600 text-[10px]">
                              {itemNum}.
                            </span>
                            <span className="font-bold text-black uppercase text-[11px] tracking-tight">
                              {item.productName}
                            </span>
                            {isMangaLarga && (
                              <span className="font-mono text-[7px] font-bold bg-black text-white px-1.5 py-0.2">
                                M/L
                              </span>
                            )}
                          </div>
                          <div className="text-[8px] text-slate-500 font-mono mt-0.5 pl-4">
                            COD: {item.productId.toUpperCase()} • {item.selectedFabric || 'Textil 420 GSM'} • Color: {item.selectedColor}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-black border-r border-slate-200">
                          {item.selectedSize}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-black text-black border-r border-slate-200">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700 border-r border-slate-200">
                          {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-black">
                          {item.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals & Financial Breakdown (Option 1 Style) */}
            <div className="flex justify-end mb-6">
              <div className="w-full sm:w-68 border border-black font-mono text-[10px]">
                <div className="flex justify-between text-slate-600 py-1.5 px-2.5 border-b border-black">
                  <span className="font-bold">SUBTOTAL:</span>
                  <span className="font-bold text-black">S/. {subtotalItems.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 py-1.5 px-2.5 border-b border-black font-bold">
                    <span>DESCUENTO:</span>
                    <span>-S/. {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {shippingCost > 0 && (
                  <div className="flex justify-between text-slate-600 py-1.5 px-2.5 border-b border-black">
                    <span className="font-bold">ENVÍO / FLETE:</span>
                    <span className="font-bold text-black">S/. {shippingCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center bg-black text-white py-2 px-2.5">
                  <span className="font-black text-rose-500 tracking-wider text-[11px]">TOTAL:</span>
                  <span className="font-black text-white text-sm">
                    S/. {computedTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Adelanto y Saldo Pendiente (Pago Parcial) */}
            {isAdvancePayment && typeof pendingBalance === 'number' && pendingBalance > 0 ? (
              <div className="flex justify-end -mt-3 mb-6">
                <div className="w-full sm:w-68 border border-black p-2.5 bg-white font-mono text-[10px]">
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>ADELANTO RECIBIDO:</span>
                    <span>S/. {(advanceAmount ?? (computedTotal - pendingBalance)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-black text-[11px] pt-1 mt-1 border-t border-dashed border-black">
                    <span>SALDO PENDIENTE:</span>
                    <span>S/. {pendingBalance.toFixed(2)}</span>
                  </div>
                  <div className="text-[7.5px] text-slate-500 mt-1 italic">
                    * Saldo a liquidar contraentrega o previo al despacho.
                  </div>
                </div>
              </div>
            ) : isCompletedSale ? (
              <div className="flex justify-end -mt-3 mb-6">
                <span className="font-mono text-[8px] font-bold text-emerald-700 border border-emerald-700 px-2.5 py-0.5 uppercase tracking-wider">
                  ✓ PAGADO AL 100% EN SOLES
                </span>
              </div>
            ) : null}

            {/* Observations if any */}
            {observations && (
              <div className="p-2.5 bg-slate-50 border-l-2 border-black mb-6 text-[9.5px] font-mono">
                <span className="font-bold text-black uppercase block mb-0.5">Observaciones:</span>
                <p className="text-slate-600">{observations}</p>
              </div>
            )}

            {/* Sello de Autenticidad / Garantía (Option 1 Style) - Sin Métodos de Pago */}
            <div className="border-t border-slate-200 pt-6 mt-4 flex flex-col items-center justify-center gap-1.5 text-center">
              <div className="w-12 h-12 rounded-full border border-black p-1 flex items-center justify-center">
                <img
                  src="/vanta-logo.png"
                  alt="VANTA"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/logo-oficial.png';
                  }}
                />
              </div>
              <span className="font-mono text-[8px] font-black tracking-[0.2em] text-black uppercase">
                AUTHENTICITY GUARANTEED // VANTA ATELIER
              </span>
              <p className="text-[7.5px] text-slate-500 font-mono max-w-md leading-relaxed">
                Confección de alto gramaje · Hilado 420 / 300 GSM · Algodón reactivo premium<br />
                Cambios de prenda válidos dentro de los 7 días posteriores a la entrega con etiqueta original intacta.
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
