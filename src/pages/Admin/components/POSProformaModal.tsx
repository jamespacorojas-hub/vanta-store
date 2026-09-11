import React, { useRef, useState, useMemo } from 'react';
import { X, Printer, Send, Download, ShieldCheck, Check, Copy, FileText, User, MapPin, Phone } from 'lucide-react';
import { POSSaleItem, POSCustomer, DestinationType } from '../../../types/pos';

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
  isCompletedSale?: boolean;
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
  isCompletedSale = false,
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

  // Generate a distinct Proforma code or use existing receipt number
  const documentCode = useMemo(() => {
    if (existingReceiptNumber) {
      return existingReceiptNumber;
    }
    const seed = Math.abs(
      items.reduce((acc, it) => acc + it.productId.charCodeAt(0) * it.quantity, 0) +
      Math.floor(computedTotal * 10)
    );
    const codeNum = String((seed % 9000) + 1000).padStart(4, '0');
    return `PF-${new Date().getFullYear()}-${codeNum}`;
  }, [existingReceiptNumber, items, computedTotal]);

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

  const handlePrintA4 = () => {
    const printWindow = window.open('', '_blank', 'width=840,height=1050');
    if (!printWindow) {
      window.print();
      return;
    }

    const contentHtml = printableRef.current?.innerHTML || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${isCompletedSale ? 'Comprobante' : 'Proforma'}_${documentCode}_VANTA_POS</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              color: #090d16;
              background-color: #ffffff;
              padding: 10px;
              font-size: 11px;
              line-height: 1.4;
            }
            .font-mono {
              font-family: 'JetBrains Mono', monospace;
            }
            .font-display {
              font-family: 'Cinzel', serif;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            th, td {
              padding: 6px 8px;
              text-align: left;
              border-bottom: 1px solid #e2e8f0;
            }
            th {
              background-color: #f8fafc;
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              border-top: 1px solid #090d16;
              border-bottom: 1px solid #090d16;
            }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          ${contentHtml}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSendWhatsApp = () => {
    const rawPhone = (customer.phone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length === 9 ? `51${rawPhone}` : rawPhone || '51904536406';

    let msg = `Hola *${customer.name || customer.businessName || 'Estimado(a)'}*, le saluda VANTA Atelier.\n\n`;
    msg += `Le compartimos su cotización/proforma formal emitida desde nuestro terminal:\n`;
    msg += `📄 *CÓDIGO:* ${documentCode}\n`;
    msg += `📅 *Fecha:* ${issueDate}\n`;
    msg += `👤 *Asesor:* ${sellerName}\n`;
    msg += `💰 *TOTAL COTIZADO:* S/ ${computedTotal.toFixed(2)}\n\n`;
    msg += `*Prendas (${totalQuantity} unid):*\n`;
    items.forEach((it, idx) => {
      msg += `${idx + 1}. ${it.productName} [${it.selectedSize} / ${it.selectedColor}] x${it.quantity} = S/ ${it.subtotal.toFixed(2)}\n`;
    });
    msg += `\nPara confirmar su pedido o coordinar despacho, responda a este chat. ¡Muchas gracias!`;

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
              {isCompletedSale ? 'COMPROBANTE FORMAL A4' : 'PROFORMA / COTIZACIÓN FORMAL A4'} // POS ADMIN
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyCode}
              className="hidden sm:flex items-center gap-1 text-[10px] font-mono border border-line px-2 py-1 bg-panel text-muted hover:text-ink cursor-pointer transition-colors"
              title="Copiar código"
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

        {/* Proforma Sheet Preview (Exact A4 Styling) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8 bg-panel flex justify-center">
          <div
            ref={printableRef}
            className="w-full max-w-2xl bg-white text-slate-900 border border-slate-200 p-6 sm:p-10 shadow-lg font-sans text-xs relative"
            style={{ minHeight: '700px' }}
          >
            {/* Header / Brand Banner */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 mb-5 gap-4">
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

              <div className="text-left sm:text-right space-y-1">
                <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold block">
                  {isCompletedSale ? 'COMPROBANTE OFICIAL' : 'COTIZACIÓN / PROFORMA'}
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
              </div>
            </div>

            {/* Client and Destination Info Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 mb-5 text-[10.5px]">
              <div className="space-y-1">
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-400 font-bold block flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-500" />
                  DATOS DEL CLIENTE / RECEPTOR
                </span>
                <p className="font-bold text-slate-900 uppercase">
                  {customer.businessName || customer.name || 'Cliente de Mostrador'}
                </p>
                {customer.documentNumber && (
                  <p className="text-slate-600 font-mono text-[9.5px]">
                    {customer.documentType || 'DOC'}: <strong>{customer.documentNumber}</strong>
                  </p>
                )}
                {customer.phone && (
                  <p className="text-slate-600 font-mono text-[9.5px] flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" />
                    <span>{customer.phone}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-slate-400 font-bold block flex sm:justify-end items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  MODALIDAD Y DESTINO
                </span>
                <p className="font-semibold text-slate-900">
                  {destinationType === 'PROVINCIA' ? 'Envío a Provincia (Agencia Shalom / Olva)' : 'Lima Metropolitana (Motorizado / Entrega en Tienda)'}
                </p>
                <p className="text-slate-600 text-[10px] truncate">
                  {customer.fiscalAddress || customer.address || customer.district || (destinationType === 'PROVINCIA' ? 'Agencia Provincia' : 'Entrega directa')}
                </p>
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
                        <div>Talla: <b className="text-slate-900">{item.selectedSize}</b> | Color: <b className="text-slate-900">{item.selectedColor}</b></div>
                        <div className="text-slate-500 text-[8.5px]">
                          {item.selectedFabric || 'Textil Pesado'} • {item.selectedSleeve || 'Manga Corta'}
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

            {/* Totals Breakdown */}
            <div className="flex justify-end mb-5">
              <div className="w-full sm:w-64 space-y-1.5 font-mono text-[10.5px]">
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
                  <span className="font-bold text-slate-950 tracking-wider">TOTAL EN SOLES:</span>
                  <span className="font-black text-rose-700 text-base font-mono">
                    S/. {computedTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

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
                  • <strong>Yape / Plin / Agora Pay / Oh! Pay:</strong> <span className="font-bold text-slate-950 bg-slate-200 px-1">924 058 988</span>
                </p>
                <p className="text-slate-800">
                  • <strong>Titular:</strong> BRYAN MICHAEL REQUENA AVILA
                </p>
                <p className="text-slate-800">
                  • <strong>CCI Interbancario:</strong> 094-00141000636992-1-53
                </p>
                <p className="text-[8px] text-slate-500 pt-0.5">
                  * Indicar el código <strong>{documentCode}</strong> en la referencia de pago o enviar comprobante al WhatsApp comercial.
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
                • Cambios de talla válidos dentro de los 7 días posteriores a la entrega con etiqueta original intacta.
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
          <div className="text-[10px] text-muted font-mono hidden sm:block">
            Formato A4 optimizado a 300 DPI para impresión física o guardar como archivo PDF.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="pos-proforma-wa-btn"
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-none bg-panel text-ink border border-line hover:border-accent font-mono font-bold text-xs uppercase tracking-wider py-2.5 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer rounded-xs"
            >
              <Send className="w-3.5 h-3.5 text-emerald-500" />
              <span>ENVIAR AL WHATSAPP DEL CLIENTE</span>
            </button>

            <button
              id="pos-proforma-print-pdf-btn"
              onClick={handlePrintA4}
              className="flex-1 sm:flex-none bg-accent text-white hover:bg-rose-600 font-mono font-bold text-xs uppercase tracking-wider py-2.5 px-5 flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer rounded-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DESCARGAR / GUARDAR A4 PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
