import React, { useRef, useState } from 'react';
import {
  Printer,
  Send,
  Copy,
  Check,
  X,
  RefreshCw,
  MapPin,
  Phone,
  Package,
  Truck,
  ShieldCheck,
  QrCode,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import { POSSale, DestinationType } from '../../../types/pos';
import POSProformaModal from './POSProformaModal';

interface POSTicketModalProps {
  sale: POSSale | null;
  isOpen: boolean;
  onClose: () => void;
  onNewSale: () => void;
}

export type TicketTheme = 'EDITORIAL_WHITE' | 'ATELIER_NOIR';

export default function POSTicketModal({ sale, isOpen, onClose, onNewSale }: POSTicketModalProps) {
  const [copied, setCopied] = useState(false);
  const [isA4ModalOpen, setIsA4ModalOpen] = useState(false);
  const [activeDestination, setActiveDestination] = useState<DestinationType>(
    sale?.destinationType || 'LIMA'
  );
  const [ticketTheme, setTicketTheme] = useState<TicketTheme>('EDITORIAL_WHITE');
  const ticketRef = useRef<HTMLDivElement>(null);

  // Sync destination if sale changes
  React.useEffect(() => {
    if (sale?.destinationType) {
      setActiveDestination(sale.destinationType);
    }
  }, [sale]);

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    if (!ticketRef.current) {
      window.print();
      return;
    }

    const ticketHtml = ticketRef.current.outerHTML;
    const printWindow = window.open('', '_blank', 'width=720,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${isFactura ? 'Factura' : isBoleta ? 'Boleta' : 'Nota_Venta'}_${sale.receiptNumber}_VANTA</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              background-color: #f1f5f9;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              padding: 24px 12px;
              min-height: 100vh;
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
            }
            #printable-pos-ticket {
              width: 100%;
              max-width: 540px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            }
            @media print {
              body {
                background: #ffffff !important;
                background-color: #ffffff !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              #printable-pos-ticket {
                box-shadow: none !important;
                margin: 0 auto !important;
                max-width: 100% !important;
                border-radius: 0 !important;
              }
              @page {
                margin: 6mm;
                size: auto;
              }
            }
          </style>
        </head>
        <body>
          ${ticketHtml}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const isProvincia = activeDestination === 'PROVINCIA';
  const isFactura = sale.receiptType === 'FACTURA';
  const isBoleta = sale.receiptType === 'BOLETA';
  const isDark = ticketTheme === 'ATELIER_NOIR';

  // Date parsing
  const dateParts = sale.formattedDate ? sale.formattedDate.split('/') : ['', '', ''];
  const day = dateParts[0] || new Date().getDate().toString().padStart(2, '0');
  const month = dateParts[1] || (new Date().getMonth() + 1).toString().padStart(2, '0');
  const year = dateParts[2] || new Date().getFullYear().toString();

  // Payment method flags
  const hasCash = sale.payments.some((p) => p.method === 'EFECTIVO');
  const hasTransfer = sale.payments.some(
    (p) => p.method.startsWith('TRANSFERENCIA') || p.method === 'TARJETA_POS'
  );
  const hasYapePlin = sale.payments.some((p) => p.method === 'YAPE' || p.method === 'PLIN');
  const otherPayment = sale.payments.find(
    (p) => p.method === 'CONTRA_ENTREGA' || p.method === 'MIXTO'
  );

  // Calculate totals
  const subtotal = sale.subtotalAmount;
  const shipping = sale.shippingCost || 0;
  const total = sale.totalAmount;
  const hasTax = (sale.taxPercent || 0) > 0 && (sale.taxAmount || 0) > 0;

  const generateWhatsAppMessage = () => {
    let msg = `*VANTA STREETWEAR — COMPROBANTE OFICIAL*\n`;
    msg += `*EMISOR:* REQUENA AVILA BRYAN MICHAEL\n`;
    msg += `*R.U.C.:* 10714931062\n`;
    msg += `*COMPROBANTE:* ${isFactura ? 'FACTURA ELECTRÓNICA' : isBoleta ? 'BOLETA DE VENTA' : 'NOTA DE VENTA'} ${activeDestination}\n`;
    msg += `*N°:* ${sale.receiptNumber}\n`;
    msg += `*FECHA:* ${day}/${month}/${year}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    if (isFactura) {
      msg += `*R.U.C. CLIENTE:* ${sale.customer.documentNumber}\n`;
      msg += `*RAZÓN SOCIAL:* ${sale.customer.businessName || sale.customer.name}\n`;
      if (sale.customer.fiscalAddress || sale.customer.address)
        msg += `*DIR. FISCAL:* ${sale.customer.fiscalAddress || sale.customer.address}\n`;
      if (sale.customer.phone) msg += `*TELÉFONO:* ${sale.customer.phone}\n`;
    } else {
      msg += `*CLIENTE:* ${sale.customer.name || 'Cliente Varios'}\n`;
      if (sale.customer.documentNumber)
        msg += `*DNI / RUC:* ${sale.customer.documentNumber}\n`;
      if (sale.customer.phone) msg += `*TELÉFONO:* ${sale.customer.phone}\n`;
      if (sale.customer.address || sale.customer.district)
        msg += `*DIRECCIÓN:* ${sale.customer.address || ''} ${sale.customer.district || ''}\n`;
    }

    msg += `*DESTINO:* ${activeDestination} - PERÚ\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*DETALLE DE PRENDAS:*\n`;

    sale.items.forEach((item, idx) => {
      const sleeveStr = item.selectedSleeve ? ` [${item.selectedSleeve}]` : '';
      const desc = `${item.productName}${sleeveStr}${item.selectedFabric ? ' (' + item.selectedFabric + ')' : ''}${item.selectedColor ? ' ' + item.selectedColor : ''}`;
      msg += `${idx + 1}. *${desc}*\n`;
      msg += `   • Cant: ${item.quantity} | Talla: ${item.selectedSize} | P.Unit: S/ ${item.unitPrice.toFixed(2)} | Total: S/ ${item.subtotal.toFixed(2)}\n`;
    });

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    if (hasTax) {
      msg += `*OP. GRAVADAS (SUBTOTAL):* S/ ${subtotal.toFixed(2)}\n`;
      msg += `*I.G.V. (18%):* S/ ${(sale.taxAmount || 0).toFixed(2)}\n`;
    } else {
      msg += `*SUBTOTAL:* S/ ${subtotal.toFixed(2)}\n`;
    }

    if (shipping > 0) {
      msg += `*ENVÍO (${activeDestination}):* S/ ${shipping.toFixed(2)}\n`;
    }
    if (sale.discountAmount > 0) {
      msg += `*DESCUENTO / AJUSTE:* -S/ ${sale.discountAmount.toFixed(2)}\n`;
    }
    msg += `*TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n`;
    msg += `*FORMA DE PAGO:* ${sale.payments.map((p) => p.method.replace('_', ' ')).join(', ')}\n`;

    if (sale.observations) {
      msg += `*OBSERVACIONES:* ${sale.observations}\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*¡GRACIAS POR TU COMPRA!*\n`;
    msg += `_Tu estilo, nuestra pasión._\n`;
    msg += `📱 WhatsApp: +51 904 536 406\n`;
    msg += `📍 Instagram/TikTok: @vantastreetwear.oficial\n`;
    return encodeURIComponent(msg);
  };

  const handleSendWhatsApp = () => {
    let phone = sale.customer.phone ? sale.customer.phone.replace(/[^0-9]/g, '') : '';
    if (phone.length === 9) phone = `51${phone}`;
    const msg = generateWhatsAppMessage();
    const url = phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
    window.open(url, '_blank');
  };

  const handleCopyText = () => {
    const raw = decodeURIComponent(generateWhatsAppMessage());
    navigator.clipboard.writeText(raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#0b0b10] border border-zinc-800 shadow-2xl flex flex-col max-h-[96vh] overflow-hidden my-auto text-white rounded-xl">
        {/* Top Control Bar (Hidden on print) */}
        <div className="print:hidden bg-[#121218] border-b border-zinc-800 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase font-bold tracking-wider text-emerald-400">
              {isFactura ? 'Factura Electrónica Emitida' : isBoleta ? 'Boleta de Venta Emitida' : 'Nota de Venta Oficial'}
            </span>
          </div>

          {/* Theme & Destination Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme Toggle */}
            <div className="flex bg-[#1a1a24] p-0.5 border border-zinc-700 rounded-sm">
              <button
                onClick={() => setTicketTheme('EDITORIAL_WHITE')}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isDark
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Editorial Blanco</span>
              </button>
              <button
                onClick={() => setTicketTheme('ATELIER_NOIR')}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Atelier Noir</span>
              </button>
            </div>

            {/* Destination Toggle */}
            <div className="flex bg-[#1a1a24] p-0.5 border border-zinc-700 rounded-sm">
              <button
                onClick={() => setActiveDestination('LIMA')}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  !isProvincia ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Lima
              </button>
              <button
                onClick={() => setActiveDestination('PROVINCIA')}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                  isProvincia ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Provincia
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-sm cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons Toolbar (Hidden on print) */}
        <div className="print:hidden p-2.5 sm:p-3 bg-[#0f0f15] border-b border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-rose-600 hover:bg-rose-500 text-white font-mono text-[11px] sm:text-xs font-bold py-2 sm:py-2.5 px-2.5 sm:px-4 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all rounded-xs"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Ticket 80mm</span>
              <span className="sm:hidden">Ticket</span>
            </button>
            <button
              onClick={() => setIsA4ModalOpen(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-amber-200 border border-amber-500/50 hover:border-amber-400 font-mono text-[11px] sm:text-xs font-bold py-2 sm:py-2.5 px-2.5 sm:px-3.5 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all rounded-xs"
              title="Ver y descargar comprobante formal en hoja A4 completa"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Formato A4</span>
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] sm:text-xs font-bold py-2 sm:py-2.5 px-2.5 sm:px-4 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all rounded-xs"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[11px] sm:text-xs py-2 sm:py-2.5 px-2.5 sm:px-3 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-zinc-700 rounded-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              onClick={onNewSale}
              className="bg-white hover:bg-zinc-200 text-black font-mono text-[11px] sm:text-xs font-bold py-2 sm:py-2.5 px-2.5 sm:px-3.5 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors rounded-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nueva Venta</span>
            </button>
          </div>
        </div>

        {/* Voucher Scrollable Preview Canvas */}
        <div
          id="printable-pos-ticket-wrapper"
          className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-8 bg-[#07070a] flex justify-center items-start"
        >
          {/* ========================================================================= */}
          {/* LUXURY STREETWEAR VOUCHER / FACTURA (HIGH FASHION ARCHITECTURAL DESIGN)    */}
          {/* ========================================================================= */}
          <div
            id="printable-pos-ticket"
            ref={ticketRef}
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: isDark ? '#0C0C10' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#000000',
              border: isDark ? '2px solid #272730' : '2.5px solid #000000',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: isDark
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(225, 29, 72, 0.15)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
            className="select-none flex flex-col"
          >
            {/* 1. TOP OFFICIAL BRAND HEADER */}
            <div
              className="vanta-ticket-header"
              style={{
                backgroundColor: isDark ? '#121218' : '#000000',
                background: isDark ? '#121218' : '#000000',
                color: '#FFFFFF',
                padding: '22px 24px 18px',
                borderBottom: isDark ? '2px solid #272730' : '2.5px solid #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              {/* Left Brand Identity */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src="/vanta-logo.png"
                  alt="VANTA STREETWEAR"
                  style={{
                    width: '68px',
                    height: '68px',
                    objectFit: 'contain',
                    borderRadius: '50%',
                    display: 'block',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Cinzel', 'Cinzel Decorative', serif",
                      fontWeight: 900,
                      fontSize: '18px',
                      letterSpacing: '0.22em',
                      color: '#FFFFFF',
                      lineHeight: '1',
                    }}
                  >
                    VANTA
                  </div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '8px',
                      letterSpacing: '0.25em',
                      color: isDark ? '#FDA4AF' : '#D4D4D8',
                      textTransform: 'uppercase',
                      marginTop: '3px',
                      fontWeight: 'bold',
                    }}
                  >
                    STREETWEAR ✦ ATELIER
                  </div>
                  <div
                    style={{
                      fontSize: '8.5px',
                      fontFamily: 'monospace',
                      color: '#A1A1AA',
                      marginTop: '4px',
                      lineHeight: '1.2',
                    }}
                  >
                    <div>REQUENA AVILA BRYAN MICHAEL</div>
                    <div style={{ color: isDark ? '#FB7185' : '#E4E4E7', fontWeight: 'bold' }}>
                      R.U.C. 10714931062
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Series & Voucher Details */}
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <h1
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 900,
                    fontSize: isFactura ? '14px' : '17px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    margin: 0,
                    lineHeight: '1.1',
                  }}
                >
                  {isFactura
                    ? 'FACTURA ELECTRÓNICA'
                    : isBoleta
                    ? 'BOLETA DE VENTA'
                    : 'NOTA DE VENTA'}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <span
                    className="vanta-ticket-badge"
                    style={{
                      backgroundColor: isDark ? '#E11D48' : '#52525B',
                      background: isDark ? '#E11D48' : '#52525B',
                      color: '#FFFFFF',
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      fontSize: '9.5px',
                      padding: '2px 10px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
                    {activeDestination}
                  </span>
                  <span
                    style={{
                      fontSize: '12.5px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                      letterSpacing: '0.05em',
                    }}
                  >
                    N° {sale.receiptNumber}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    color: '#D4D4D8',
                    marginTop: '4px',
                    fontWeight: 'bold',
                  }}
                >
                  EMISIÓN: {day} / {month} / {year}
                </div>
              </div>
            </div>

            {/* 2. BODY CONTENT */}
            <div
              style={{
                backgroundColor: isDark ? '#0C0C10' : '#FFFFFF',
                color: isDark ? '#FFFFFF' : '#000000',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Customer / Company Header Card */}
              <div
                style={{
                  border: isDark ? '1px solid #272730' : '1.5px solid #000000',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  backgroundColor: isDark ? '#14141E' : '#FAFAFA',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '11px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: isDark ? '1px solid #272730' : '1px solid #E4E4E7',
                    paddingBottom: '5px',
                    marginBottom: '2px',
                  }}
                >
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: '10px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isDark ? '#FDA4AF' : '#000000',
                    }}
                  >
                    {isFactura ? 'DATOS FISCALES DEL ADQUIRENTE' : 'DATOS DEL CLIENTE'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '9px',
                      color: isDark ? '#A1A1AA' : '#71717A',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {isProvincia ? 'DESTINO: PROVINCIA - PERÚ' : 'DESTINO: LIMA METROPOLITANA'}
                  </span>
                </div>

                {isFactura ? (
                  /* FACTURA CLIENT FIELDS */
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '9.5px', color: isDark ? '#A1A1AA' : '#71717A', display: 'block', fontWeight: 'bold' }}>
                        RUC CLIENTE:
                      </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '11.5px', color: isDark ? '#FFFFFF' : '#000000' }}>
                        {sale.customer.documentNumber || '-'}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '9.5px', color: isDark ? '#A1A1AA' : '#71717A', display: 'block', fontWeight: 'bold' }}>
                        RAZÓN SOCIAL:
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {sale.customer.businessName || sale.customer.name || '-'}
                      </span>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ fontSize: '9.5px', color: isDark ? '#A1A1AA' : '#71717A', display: 'block', fontWeight: 'bold' }}>
                        DIRECCIÓN FISCAL:
                      </span>
                      <span style={{ fontWeight: 500, fontSize: '10.5px' }}>
                        {sale.customer.fiscalAddress || sale.customer.address || '-'}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '9.5px', color: isDark ? '#A1A1AA' : '#71717A', display: 'block', fontWeight: 'bold' }}>
                        TELÉFONO DE CONTACTO:
                      </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {sale.customer.phone || '-'}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '9.5px', color: isDark ? '#A1A1AA' : '#71717A', display: 'block', fontWeight: 'bold' }}>
                        TIPO DE COMPROBANTE:
                      </span>
                      <span style={{ fontWeight: 'bold', color: isDark ? '#FDA4AF' : '#000000' }}>
                        FACTURA ELECTRÓNICA
                      </span>
                    </div>
                  </div>
                ) : (
                  /* NOTA DE VENTA / BOLETA CLIENT FIELDS */
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '9.5px', color: isDark ? '#A1A1AA' : '#71717A', display: 'block', fontWeight: 'bold' }}>
                        CLIENTE:
                      </span>
                      <span style={{ fontWeight: 'bold', fontSize: '11.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {sale.customer.name || 'Cliente Varios'}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '9.5px', color: isDark ? '#A1A1AA' : '#71717A', display: 'block', fontWeight: 'bold' }}>
                        DNI / RUC:
                      </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {sale.customer.documentNumber || '-'}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '9.5px', color: isDark ? '#A1A1AA' : '#71717A', display: 'block', fontWeight: 'bold' }}>
                        TELÉFONO:
                      </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {sale.customer.phone || '-'}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '9.5px', color: isDark ? '#A1A1AA' : '#71717A', display: 'block', fontWeight: 'bold' }}>
                        {isProvincia ? 'DIRECCIÓN DE ENVÍO:' : 'DIRECCIÓN / DISTRITO:'}
                      </span>
                      <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {sale.customer.address || sale.customer.district || '-'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. ITEM DETAIL TABLE */}
              <div
                style={{
                  border: isDark ? '1.5px solid #272730' : '2px solid #000000',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                >
                  <thead>
                    <tr
                      className="vanta-ticket-th"
                      style={{
                        backgroundColor: isDark ? '#181824' : '#000000',
                        background: isDark ? '#181824' : '#000000',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: '9.5px',
                        letterSpacing: '0.06em',
                        textAlign: 'center',
                        WebkitPrintColorAdjust: 'exact',
                        printColorAdjust: 'exact',
                      }}
                    >
                      <th style={{ padding: '8px 4px', borderRight: isDark ? '1px solid #272730' : '1.5px solid #3F3F46', width: '40px' }}>
                        CANT.
                      </th>
                      <th style={{ padding: '8px 10px', borderRight: isDark ? '1px solid #272730' : '1.5px solid #3F3F46', textAlign: 'left' }}>
                        DESCRIPCIÓN DE PRENDA
                      </th>
                      <th style={{ padding: '8px 4px', borderRight: isDark ? '1px solid #272730' : '1.5px solid #3F3F46', width: '48px' }}>
                        TALLA
                      </th>
                      <th style={{ padding: '8px 6px', borderRight: isDark ? '1px solid #272730' : '1.5px solid #3F3F46', width: '64px', textAlign: 'right' }}>
                        P. UNIT.
                      </th>
                      <th style={{ padding: '8px 8px', width: '70px', textAlign: 'right' }}>
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item, idx) => {
                      const isEven = idx % 2 === 0;
                      const isMangaLarga = item.selectedSleeve === 'Manga Larga';
                      return (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                            backgroundColor: isDark
                              ? isEven ? '#0C0C10' : '#101017'
                              : isEven ? '#FFFFFF' : '#FAFAFA',
                          }}
                        >
                          <td
                            style={{
                              textAlign: 'center',
                              fontWeight: 'bold',
                              padding: '8px 4px',
                              borderRight: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                            }}
                          >
                            {item.quantity}
                          </td>
                          <td
                            style={{
                              padding: '8px 10px',
                              fontWeight: 600,
                              borderRight: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                              lineHeight: '1.3',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 'bold' }}>{item.productName}</span>
                              {isMangaLarga && (
                                <span
                                  style={{
                                    fontSize: '8.5px',
                                    backgroundColor: isDark ? '#E11D48' : '#000000',
                                    color: '#FFFFFF',
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  MANGA LARGA
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '9px', color: isDark ? '#A1A1AA' : '#71717A', marginTop: '2px' }}>
                              {item.selectedFabric && <span>Tela: {item.selectedFabric}</span>}
                              {item.selectedColor && <span> • Color: {item.selectedColor}</span>}
                            </div>
                          </td>
                          <td
                            style={{
                              textAlign: 'center',
                              fontWeight: 'bold',
                              padding: '8px 4px',
                              borderRight: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                            }}
                          >
                            <span
                              style={{
                                border: isDark ? '1px solid #3F3F46' : '1px solid #A1A1AA',
                                padding: '2px 5px',
                                borderRadius: '4px',
                                fontSize: '10px',
                              }}
                            >
                              {item.selectedSize}
                            </span>
                          </td>
                          <td
                            style={{
                              textAlign: 'right',
                              fontWeight: 600,
                              padding: '8px 6px',
                              borderRight: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                            }}
                          >
                            {item.unitPrice.toFixed(2)}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 'bold', padding: '8px 8px' }}>
                            {item.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 4. FINANCIAL SUMMARY & STAMPS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr',
                  gap: '16px',
                  alignItems: 'start',
                }}
              >
                {/* Left Side: Payment Stamp & Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Payment Methods Checkbox Box */}
                  <div
                    style={{
                      border: isDark ? '1px solid #272730' : '1.5px solid #000000',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      backgroundColor: isDark ? '#14141E' : '#FAFAFA',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 'bold',
                        fontSize: '9.5px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '6px',
                        color: isDark ? '#FDA4AF' : '#000000',
                      }}
                    >
                      MÉTODO DE PAGO UTILIZADO:
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '6px',
                        fontFamily: 'monospace',
                        fontSize: '9.5px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '14px',
                            height: '14px',
                            border: isDark ? '1px solid #FDA4AF' : '1.5px solid #000000',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '9px',
                            backgroundColor: hasCash ? (isDark ? '#E11D48' : '#000000') : 'transparent',
                            color: '#FFFFFF',
                          }}
                        >
                          {hasCash ? '✓' : ''}
                        </div>
                        <span>EFECTIVO</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '14px',
                            height: '14px',
                            border: isDark ? '1px solid #FDA4AF' : '1.5px solid #000000',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '9px',
                            backgroundColor: hasTransfer ? (isDark ? '#E11D48' : '#000000') : 'transparent',
                            color: '#FFFFFF',
                          }}
                        >
                          {hasTransfer ? '✓' : ''}
                        </div>
                        <span>TRANSFERENCIA</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '14px',
                            height: '14px',
                            border: isDark ? '1px solid #FDA4AF' : '1.5px solid #000000',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '9px',
                            backgroundColor: hasYapePlin ? (isDark ? '#E11D48' : '#000000') : 'transparent',
                            color: '#FFFFFF',
                          }}
                        >
                          {hasYapePlin ? '✓' : ''}
                        </div>
                        <span>YAPE / PLIN</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '14px',
                            height: '14px',
                            border: isDark ? '1px solid #FDA4AF' : '1.5px solid #000000',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '9px',
                            backgroundColor: otherPayment ? (isDark ? '#E11D48' : '#000000') : 'transparent',
                            color: '#FFFFFF',
                          }}
                        >
                          {otherPayment ? '✓' : ''}
                        </div>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {otherPayment ? otherPayment.method.replace('_', ' ') : 'OTRO'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Observations Box */}
                  <div
                    style={{
                      border: isDark ? '1px solid #272730' : '1.5px solid #000000',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      backgroundColor: isDark ? '#14141E' : '#FAFAFA',
                      fontSize: '9.5px',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: isDark ? '#FDA4AF' : '#000000', display: 'block', marginBottom: '2px' }}>
                      OBSERVACIONES / DESPACHO:
                    </span>
                    <span style={{ fontFamily: 'monospace', color: isDark ? '#D4D4D8' : '#3F3F46' }}>
                      {sale.observations || 'Prenda(s) verificada(s) y aprobada(s) por control de calidad.'}
                    </span>
                  </div>

                  {/* Provincia Special Guarantee */}
                  {isProvincia && (
                    <div
                      style={{
                        border: isDark ? '1px solid #E11D48' : '1.5px solid #000000',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: isDark ? '#200812' : '#FAFAFA',
                      }}
                    >
                      <Truck style={{ width: '22px', height: '22px', color: isDark ? '#FB7185' : '#000000', flexShrink: 0 }} />
                      <div style={{ fontSize: '8.5px', lineHeight: '1.2' }}>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase', color: isDark ? '#FDA4AF' : '#000000' }}>
                          ENVÍO A PROVINCIA ASEGURADO
                        </div>
                        <div style={{ color: isDark ? '#E4E4E7' : '#52525B' }}>
                          Despacho en 24h hábiles con seguimiento en tiempo real.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Totals Summary Box */}
                <div
                  style={{
                    border: isDark ? '2px solid #272730' : '2px solid #000000',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                >
                  {hasTax ? (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          borderBottom: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                          backgroundColor: isDark ? '#14141E' : '#FAFAFA',
                        }}
                      >
                        <span style={{ fontWeight: 'bold', fontSize: '9.5px', textTransform: 'uppercase' }}>OP. GRAVADAS:</span>
                        <span style={{ fontWeight: 'bold' }}>S/. {subtotal.toFixed(2)}</span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          borderBottom: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                          backgroundColor: isDark ? '#14141E' : '#FAFAFA',
                        }}
                      >
                        <span style={{ fontWeight: 'bold', fontSize: '9.5px', textTransform: 'uppercase' }}>I.G.V. (18%):</span>
                        <span style={{ fontWeight: 'bold' }}>S/. {(sale.taxAmount || 0).toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderBottom: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                        backgroundColor: isDark ? '#14141E' : '#FAFAFA',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}>SUBTOTAL:</span>
                      <span style={{ fontWeight: 'bold' }}>S/. {subtotal.toFixed(2)}</span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderBottom: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                      backgroundColor: isDark ? '#14141E' : '#FAFAFA',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', fontSize: '9.5px', textTransform: 'uppercase' }}>
                      {isProvincia ? 'ENVÍO (PROVINCIA):' : 'ENVÍO (LIMA):'}
                    </span>
                    <span style={{ fontWeight: 'bold' }}>
                      {shipping > 0 ? `S/. ${shipping.toFixed(2)}` : 'S/. 0.00'}
                    </span>
                  </div>

                  {sale.discountAmount > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderBottom: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                        backgroundColor: isDark ? '#2B0B14' : '#FFF1F2',
                        color: isDark ? '#FDA4AF' : '#BE123C',
                      }}
                    >
                      <span style={{ fontWeight: 'bold', fontSize: '9.5px', textTransform: 'uppercase' }}>DESCUENTO / AJUSTE:</span>
                      <span style={{ fontWeight: 'bold' }}>-S/. {sale.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* High Impact Total Box */}
                  <div
                    className="vanta-ticket-total-row"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      backgroundColor: isDark ? '#E11D48' : '#000000',
                      background: isDark ? '#E11D48' : '#000000',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      WebkitPrintColorAdjust: 'exact',
                      printColorAdjust: 'exact',
                    }}
                  >
                    <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '11px' }}>
                      TOTAL A PAGAR:
                    </span>
                    <span style={{ fontWeight: 900, fontSize: '16px' }}>
                      S/. {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. VALIDATION SEAL & AUTHENTICITY */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: isDark ? '1px solid #1E1E28' : '1px solid #E4E4E7',
                  fontSize: '9px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck style={{ width: '20px', height: '20px', color: isDark ? '#FDA4AF' : '#000000' }} />
                  <div>
                    <div style={{ fontWeight: 'bold', textTransform: 'uppercase', color: isDark ? '#FFFFFF' : '#000000' }}>
                      AUTENTICIDAD GARANTIZADA
                    </div>
                    <div style={{ color: isDark ? '#A1A1AA' : '#71717A' }}>
                      Prenda original de edición limitada VANTA.
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontFamily: 'monospace', color: isDark ? '#A1A1AA' : '#71717A' }}>
                  <div>TERMINAL: POS-01 ✦ CAJERO VIP</div>
                  <div style={{ fontSize: '8px', letterSpacing: '0.05em' }}>HASH: {sale.id.slice(0, 16)}</div>
                </div>
              </div>
            </div>

            {/* 6. BOTTOM LUXURY BLACK BANNER */}
            <div
              className="vanta-ticket-footer"
              style={{
                backgroundColor: isDark ? '#121218' : '#000000',
                background: isDark ? '#121218' : '#000000',
                color: '#FFFFFF',
                padding: '16px 24px',
                borderTop: isDark ? '2px solid #272730' : '2.5px solid #000000',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '9.5px' }}>
                {/* Branch / Dispatch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!isProvincia ? (
                    <>
                      <MapPin style={{ width: '18px', height: '18px', color: '#FFFFFF', flexShrink: 0 }} />
                      <div style={{ lineHeight: '1.2' }}>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>RECOJO EN ALMACÉN</div>
                        <div style={{ color: '#A1A1AA' }}>Los Olivos - San Isidro, Lima</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Package style={{ width: '18px', height: '18px', color: '#FFFFFF', flexShrink: 0 }} />
                      <div style={{ lineHeight: '1.2' }}>
                        <div style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>ENVÍOS A TODO EL PERÚ</div>
                        <div style={{ color: '#A1A1AA' }}>Transporte express garantizado</div>
                      </div>
                    </>
                  )}
                </div>

                {/* WhatsApp Concierge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'right' }}>
                  <div style={{ lineHeight: '1.2' }}>
                    <div style={{ fontWeight: 'bold', color: '#FFFFFF', fontFamily: 'monospace', fontSize: '10.5px' }}>
                      904 536 406
                    </div>
                    <div style={{ color: '#A1A1AA' }}>@vantastreetwear.oficial</div>
                  </div>
                  <Phone style={{ width: '14px', height: '14px', color: '#FFFFFF' }} />
                </div>
              </div>

              {/* Tagline */}
              <div
                style={{
                  textAlign: 'center',
                  paddingTop: '6px',
                  borderTop: '1px solid #272730',
                  fontSize: '8px',
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: isDark ? '#FDA4AF' : '#D4D4D8',
                  fontWeight: 'bold',
                }}
              >
                V A N T A &nbsp; S T R E E T W E A R &nbsp; ✦ &nbsp; P E R Ú
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formal A4 Document Preview & Download Modal */}
      {isA4ModalOpen && sale && (
        <POSProformaModal
          isOpen={isA4ModalOpen}
          onClose={() => setIsA4ModalOpen(false)}
          items={sale.items}
          customer={sale.customer}
          destinationType={activeDestination}
          shippingCost={sale.shippingCost}
          discountAmount={sale.discountAmount}
          totalAmount={sale.totalAmount}
          sellerName={sale.sellerName}
          existingReceiptNumber={sale.receiptNumber}
          isCompletedSale={true}
        />
      )}
    </div>
  );
}
