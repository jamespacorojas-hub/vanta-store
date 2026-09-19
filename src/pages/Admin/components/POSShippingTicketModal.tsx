import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Printer,
  Package,
} from 'lucide-react';
import {
  POSSaleItem,
  POSCustomer,
  DestinationType,
  POSShippingInfo,
} from '../../../types/pos';

// Base64 QR fallback from Shalom ticket image
const DEFAULT_SHALOM_QR =
  'data:image/png;base64,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';

interface POSShippingTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: POSSaleItem[];
  customer: POSCustomer;
  destinationType: DestinationType;
  shippingCost: number;
  totalAmount: number;
  sellerName?: string;
  orderNumber?: string;
  shippingInfo?: POSShippingInfo;
  observations?: string;
  advanceAmount?: number;
  pendingBalance?: number;
  isAdvancePayment?: boolean;
}

export default function POSShippingTicketModal({
  isOpen,
  onClose,
  items,
  customer,
  destinationType,
  shippingCost,
  totalAmount,
  sellerName = 'Atelier Admin',
  orderNumber,
  shippingInfo,
  observations,
  advanceAmount,
  pendingBalance,
  isAdvancePayment = false,
}: POSShippingTicketModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(DEFAULT_SHALOM_QR);
  const now = useMemo(() => new Date(), []);

  const issueDateStr = useMemo(() => {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }, [now]);

  const totalQuantity = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const orderCode = useMemo(() => {
    if (orderNumber) return orderNumber;
    return String(Math.floor(10000000 + Math.random() * 90000000));
  }, [orderNumber]);

  // 4-letter security code like in Shalom tickets (e.g. CDTC)
  const fourLetterCode = useMemo(() => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    const seed = orderCode.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
    for (let i = 0; i < 4; i++) {
      code += letters[(seed * (i + 3) + i * 7) % letters.length];
    }
    return code;
  }, [orderCode]);

  // GRR number (Guía de Remisión Remitente)
  const grrNumber = useMemo(() => {
    return '100' + orderCode.slice(-5);
  }, [orderCode]);

  // Destination & recipient logic
  const isProvincia = destinationType === 'PROVINCIA';

  const recipientName = isProvincia
    ? (shippingInfo?.provincia?.consigneeName || customer.name || 'CLIENTE').toUpperCase()
    : (shippingInfo?.lima?.recipientName || customer.name || 'CLIENTE').toUpperCase();

  const recipientDni = isProvincia
    ? shippingInfo?.provincia?.consigneeDni || customer.documentNumber || ''
    : shippingInfo?.lima?.recipientDni || customer.documentNumber || '';

  const recipientPhone = isProvincia
    ? shippingInfo?.provincia?.consigneePhone || customer.phone || ''
    : shippingInfo?.lima?.recipientPhone || customer.phone || '';

  const recipientPhoneFormatted = recipientPhone
    ? recipientPhone.startsWith('+')
      ? recipientPhone
      : `+51 ${recipientPhone}`
    : '';

  const agencyName = isProvincia
    ? shippingInfo?.provincia?.agency === 'OTRA'
      ? (shippingInfo?.provincia?.otherAgencyName || 'OTRA').toUpperCase()
      : (shippingInfo?.provincia?.agency || 'SHALOM').toUpperCase()
    : 'SHALOM';

  const destinationCity = isProvincia
    ? (shippingInfo?.provincia?.departmentProvinceDistrict || shippingInfo?.provincia?.department || 'PROVINCIA').toUpperCase()
    : (shippingInfo?.lima?.district || customer.district || 'LIMA').toUpperCase();

  const deliveryAddress = isProvincia
    ? (shippingInfo?.provincia?.agencyBranch || 'ENTREGAR EN AGENCIA').toUpperCase()
    : (shippingInfo?.lima?.address || customer.address || 'ENTREGAR EN AGENCIA').toUpperCase();

  const deliveryReference = !isProvincia
    ? shippingInfo?.lima?.reference || ''
    : '';

  const transportType = isProvincia ? 'TERRESTRE' : 'MOTORIZADO';

  const formaPago = isProvincia
    ? shippingInfo?.provincia?.freightPayment === 'PAGO_DESTINO'
      ? 'Corporativo'
      : 'Pagado'
    : shippingCost === 0
    ? 'Recojo en Tienda'
    : 'Corporativo';

  // Dynamic QR code generation for the order
  useEffect(() => {
    const qrData = `https://shalom.com.pe/rastreo?orden=${orderCode}&codigo=${fourLetterCode}&dni=${recipientDni}`;
    QRCode.toDataURL(qrData, {
      width: 130,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#050505',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((err) => {
        console.warn('Fallback to static QR:', err);
        setQrCodeUrl(DEFAULT_SHALOM_QR);
      });
  }, [orderCode, fourLetterCode, recipientDni]);

  if (!isOpen || items.length === 0) return null;

  // Print handler with the EXACT Shalom ticket HTML & CSS
  const handlePrint = () => {
    // Build package row
    const packageDesc = totalQuantity > 1 ? `PAQUETE ${totalQuantity}` : 'MINI PAQU 1';
    const packageWeight = `/${(totalQuantity * 0.5).toFixed(2)}`;

    const paqueteRow = `
      <tr>
        <td>${packageDesc}</td>
        <td>${totalQuantity}</td>
        <td>PAQUETE</td>
        <td>${packageWeight}</td>
        <td></td>
      </tr>`;

    // Item details
    const itemDetailRows = items
      .map((item) => {
        const sleeve = item.selectedSleeve === 'Manga Larga' ? ' M/L' : '';
        return `
      <tr>
        <td>${item.productName.toUpperCase()}${sleeve} ${item.selectedSize}</td>
        <td>${item.selectedSize}<br>/peso</td>
      </tr>`;
      })
      .join('');

    const htmlString = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Datos Ticket ${agencyName}</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; background:#fff; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    color:#050505;
    font-size:9px;
  }
  .ticket {
    width:286px;
    min-height:800px;
    margin:0 auto;
    padding:25px 20px 16px;
    border:1px solid #333;
    background:#fff;
  }
  .center { text-align:center; }
  .company {
    font-size:7px;
    font-weight:700;
    line-height:1.2;
    margin-bottom:2px;
  }
  .company-sub {
    font-size:7px;
    line-height:1.15;
  }
  .title {
    font-size:9px;
    font-weight:700;
    margin:8px 0 17px;
  }
  .route {
    font-size:13px;
    line-height:1.15;
    margin-bottom:13px;
  }
  .section-title {
    font-size:8px;
    font-weight:700;
    margin:0 0 4px;
  }
  .line {
    font-size:8px;
    line-height:1.28;
    margin:0;
  }
  .label { font-weight:700; }
  .qr {
    width:118px;
    height:118px;
    display:block;
    margin:6px auto 17px;
    image-rendering:pixelated;
  }
  .block { margin-bottom:13px; }
  .small-gap { margin-bottom:8px; }
  .recipient { margin-top:3px; }
  .table {
    width:100%;
    border-collapse:collapse;
    font-size:8px;
    margin-top:3px;
  }
  .table th {
    font-weight:400;
    text-align:left;
    padding:0 4px 2px 0;
  }
  .table td {
    padding:2px 4px 0 0;
    vertical-align:top;
  }
  .table .head { font-weight:700; }
  .obs {
    margin-top:16px;
    line-height:1.25;
  }
  .warranty {
    margin-top:31px;
    font-size:8px;
    line-height:1.35;
  }
  .warranty-title {
    font-weight:700;
    margin-bottom:8px;
  }
  .bold { font-weight:700; }
  @media print {
    @page { size: auto; margin: 0; }
    body { margin:0; padding:0; }
    .ticket { border:none; margin:0; padding:15px 18px; width:286px; }
  }
</style>
</head>
<body>
  <main class="ticket">
    <div class="center">
      <div class="company">SHALOM EMPRESARIAL S.A.C</div>
      <div class="company-sub">AV. MEXICO N° 1187 LA VICTORIA - LIMA - LIMA</div>
      <div class="company-sub">RUC:20512525458</div>
      <div class="company-sub">CENTRAL TELEFÓNICA 01-5007878</div>
      <div class="company-sub">https://shalom.com.pe/</div>

      <div class="title">DATOS TICKET ${agencyName}</div>
      <div class="route">${destinationCity}<br>${deliveryAddress} - ${transportType}</div>
    </div>

    <div class="block">
      <div class="section-title">DATOS</div>
      <p class="line"><span class="label">NRO. ORDEN:</span> ${orderCode} &nbsp;&nbsp; <span class="label">CÓDIGO:</span> ${fourLetterCode}</p>
      <p class="line"><span class="label">Fecha Emisión:</span> ${issueDateStr}</p>
      <p class="line"><span class="label">Fecha Traslado:</span> ${issueDateStr}</p>
      <img class="qr" src="${qrCodeUrl}" alt="Código QR">
    </div>

    <div class="block">
      <p class="line"><span class="label">Origen:</span> ÁREA SHALOM EMPRESAS</p>
      <p class="line"><span class="label">Destino:</span></p>
      <p class="line">${destinationCity}</p>
      <p class="line">${deliveryAddress}</p>
      ${deliveryReference ? `<p class="line">REF. ${deliveryReference.toUpperCase()}</p>` : ''}
      <p class="line"><span class="label">DATOS DEL REMITENTE</span></p>
      <p class="line"><span class="label">Nombre/Raz. Social:</span> VANTA STREETWEAR / TECNOLOGIA Y DISTRIBUCION</p>
      <p class="line"><span class="label">DNI/RUC:</span> 10714931062 - &nbsp;<span class="label">Teléfono:</span> 904536406</p>
      <p class="line"><span class="label">GRR:</span> ${grrNumber}</p>
    </div>

    <div class="block">
      <div class="section-title">DATOS DEL DESTINATARIO</div>
      <p class="line"><span class="label">Nombre/Raz. Social:</span> ${recipientName}</p>
      <p class="line"><span class="label">DNI/RUC:</span> ${recipientDni || '-'} &nbsp;&nbsp; <span class="label">Teléfono:</span> ${recipientPhoneFormatted || '-'}</p>
    </div>

    <div class="block">
      <div class="section-title">ENTREGA</div>
      <p class="line"><span class="label">Direccion:</span> ${deliveryAddress}</p>
      <p class="line"><span class="label">Contacto 1:</span> ${recipientDni} &nbsp; ${recipientName}</p>
    </div>

    <div class="block">
      <div class="section-title">FORMA DE PAGO: <span class="bold">${formaPago}</span></div>
      <table class="table">
        <tr class="head">
          <th>Descripción</th>
          <th>Cantidad</th>
          <th>Unidad de<br>medida</th>
          <th>Peso</th>
          <th>Sub total</th>
        </tr>
        ${paqueteRow}
      </table>
    </div>

    <div class="block">
      <table class="table">
        ${itemDetailRows}
      </table>
    </div>

    <div class="obs">
      <div class="bold">Observaciones:</div>
      ${observations ? `<div style="font-size:8px;line-height:1.2;">${observations}</div>` : '<div style="height:12px"></div>'}
      <div class="bold">Observaciones:</div>
    </div>

    <div class="warranty">
      <div class="warranty-title">USTED NO CONTRATÓ EL SERVICIO DE GARANTÍA</div>
      <div>Cuenta con una COBERTURA máxima hasta 10 veces el valor<br>
      del flete sobre el envío afectado.<br>
      (Cobertura no aplicable si el daño sufrido fue propio del mal<br>
      embalaje)</div>
      <div class="bold">Recibido sin verificación de contenido</div>
    </div>
  </main>
<script>
  window.onload = function() {
    setTimeout(function() { window.focus(); window.print(); }, 400);
  };
</script>
</body>
</html>`;

    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl, '_blank');
    if (!win) {
      const fallback = window.open('', '_blank', 'width=380,height=900');
      if (fallback) {
        fallback.document.write(htmlString);
        fallback.document.close();
      } else {
        alert('Tu navegador bloqueó la ventana emergente. Permite ventanas emergentes e intenta de nuevo.');
      }
    }
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  };

  const packageDescPreview = totalQuantity > 1 ? `PAQUETE ${totalQuantity}` : 'MINI PAQU 1';
  const packageWeightPreview = `/${(totalQuantity * 0.5).toFixed(2)}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[340px] bg-white border border-zinc-700 shadow-2xl text-[#050505] flex flex-col max-h-[96vh] overflow-hidden rounded-xs"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '9px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#101018] border-b border-zinc-800 text-white shrink-0">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-purple-300">
              Datos Ticket {agencyName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Exact Shalom Preview */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-white" style={{ padding: '20px 18px 16px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '7px', fontWeight: 700, lineHeight: 1.2, marginBottom: '2px' }}>
              SHALOM EMPRESARIAL S.A.C
            </div>
            <div style={{ fontSize: '7px', lineHeight: 1.15 }}>AV. MEXICO N° 1187 LA VICTORIA - LIMA - LIMA</div>
            <div style={{ fontSize: '7px', lineHeight: 1.15 }}>RUC:20512525458</div>
            <div style={{ fontSize: '7px', lineHeight: 1.15 }}>CENTRAL TELEFÓNICA 01-5007878</div>
            <div style={{ fontSize: '7px', lineHeight: 1.15 }}>https://shalom.com.pe/</div>

            <div style={{ fontSize: '9px', fontWeight: 700, margin: '8px 0 17px' }}>
              DATOS TICKET {agencyName}
            </div>
            <div style={{ fontSize: '13px', lineHeight: 1.15, marginBottom: '13px' }}>
              {destinationCity}
              <br />
              {deliveryAddress} - {transportType}
            </div>
          </div>

          {/* DATOS con QR */}
          <div style={{ marginBottom: '13px' }}>
            <div style={{ fontSize: '8px', fontWeight: 700, margin: '0 0 4px' }}>DATOS</div>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>NRO. ORDEN:</span> {orderCode} &nbsp;&nbsp;{' '}
              <span style={{ fontWeight: 700 }}>CÓDIGO:</span> {fourLetterCode}
            </p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Fecha Emisión:</span> {issueDateStr}
            </p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Fecha Traslado:</span> {issueDateStr}
            </p>
            <img
              src={qrCodeUrl}
              alt="Código QR"
              style={{
                width: '118px',
                height: '118px',
                display: 'block',
                margin: '6px auto 17px',
                imageRendering: 'pixelated',
              }}
            />
          </div>

          {/* ORIGEN / DESTINO / REMITENTE */}
          <div style={{ marginBottom: '13px' }}>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Origen:</span> ÁREA SHALOM EMPRESAS
            </p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Destino:</span>
            </p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>{destinationCity}</p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>{deliveryAddress}</p>
            {deliveryReference && (
              <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
                REF. {deliveryReference.toUpperCase()}
              </p>
            )}
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0, fontWeight: 700 }}>
              DATOS DEL REMITENTE
            </p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Nombre/Raz. Social:</span> VANTA STREETWEAR / TECNOLOGIA Y DISTRIBUCION
            </p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>DNI/RUC:</span> 10714931062 - &nbsp;
              <span style={{ fontWeight: 700 }}>Teléfono:</span> 904536406
            </p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>GRR:</span> {grrNumber}
            </p>
          </div>

          {/* DATOS DEL DESTINATARIO */}
          <div style={{ marginBottom: '13px' }}>
            <div style={{ fontSize: '8px', fontWeight: 700, margin: '0 0 4px' }}>DATOS DEL DESTINATARIO</div>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Nombre/Raz. Social:</span> {recipientName}
            </p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>DNI/RUC:</span> {recipientDni || '-'} &nbsp;&nbsp;{' '}
              <span style={{ fontWeight: 700 }}>Teléfono:</span>{' '}
              {recipientPhoneFormatted || '-'}
            </p>
          </div>

          {/* ENTREGA */}
          <div style={{ marginBottom: '13px' }}>
            <div style={{ fontSize: '8px', fontWeight: 700, margin: '0 0 4px' }}>ENTREGA</div>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Direccion:</span> {deliveryAddress}
            </p>
            <p style={{ fontSize: '8px', lineHeight: 1.28, margin: 0 }}>
              <span style={{ fontWeight: 700 }}>Contacto 1:</span> {recipientDni || ''} &nbsp;{' '}
              {recipientName}
            </p>
          </div>

          {/* FORMA DE PAGO + TABLA */}
          <div style={{ marginBottom: '13px' }}>
            <div style={{ fontSize: '8px', fontWeight: 700, margin: '0 0 4px' }}>
              FORMA DE PAGO: <span style={{ fontWeight: 700 }}>{formaPago}</span>
            </div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '8px',
                marginTop: '3px',
              }}
            >
              <thead>
                <tr>
                  <th style={{ fontWeight: 700, textAlign: 'left', padding: '0 4px 2px 0' }}>
                    Descripción
                  </th>
                  <th style={{ fontWeight: 700, textAlign: 'left', padding: '0 4px 2px 0' }}>
                    Cantidad
                  </th>
                  <th style={{ fontWeight: 700, textAlign: 'left', padding: '0 4px 2px 0' }}>
                    Unidad de
                    <br />
                    medida
                  </th>
                  <th style={{ fontWeight: 700, textAlign: 'left', padding: '0 4px 2px 0' }}>Peso</th>
                  <th style={{ fontWeight: 700, textAlign: 'left', padding: '0 4px 2px 0' }}>
                    Sub total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '2px 4px 0 0', verticalAlign: 'top' }}>
                    {packageDescPreview}
                  </td>
                  <td style={{ padding: '2px 4px 0 0', verticalAlign: 'top' }}>{totalQuantity}</td>
                  <td style={{ padding: '2px 4px 0 0', verticalAlign: 'top' }}>PAQUETE</td>
                  <td style={{ padding: '2px 4px 0 0', verticalAlign: 'top' }}>{packageWeightPreview}</td>
                  <td style={{ padding: '2px 4px 0 0', verticalAlign: 'top' }}></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ITEM DETAILS */}
          <div style={{ marginBottom: '13px' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '8px',
                marginTop: '3px',
              }}
            >
              <tbody>
                {items.map((item) => {
                  const sleeve = item.selectedSleeve === 'Manga Larga' ? ' M/L' : '';
                  return (
                    <tr key={item.id}>
                      <td style={{ padding: '2px 4px 0 0', verticalAlign: 'top' }}>
                        {item.productName.toUpperCase()}
                        {sleeve} {item.selectedSize}
                      </td>
                      <td style={{ padding: '2px 4px 0 0', verticalAlign: 'top' }}>
                        {item.selectedSize}
                        <br />
                        /peso
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* OBSERVACIONES */}
          <div style={{ marginTop: '16px', lineHeight: 1.25 }}>
            <div style={{ fontWeight: 700 }}>Observaciones:</div>
            {observations ? (
              <div style={{ fontSize: '8px', lineHeight: 1.2 }}>{observations}</div>
            ) : (
              <div style={{ height: '12px' }}></div>
            )}
            <div style={{ fontWeight: 700 }}>Observaciones:</div>
          </div>

          {/* GARANTÍA */}
          <div style={{ marginTop: '31px', fontSize: '8px', lineHeight: 1.35 }}>
            <div style={{ fontWeight: 700, marginBottom: '8px' }}>
              USTED NO CONTRATÓ EL SERVICIO DE GARANTÍA
            </div>
            <div>
              Cuenta con una COBERTURA máxima hasta 10 veces el valor
              <br />
              del flete sobre el envío afectado.
              <br />
              (Cobertura no aplicable si el daño sufrido fue propio del mal
              <br />
              embalaje)
            </div>
            <div style={{ fontWeight: 700 }}>Recibido sin verificación de contenido</div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="p-2.5 border-t border-zinc-300 bg-zinc-100 shrink-0 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-[10px] font-mono font-bold uppercase border border-zinc-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Cerrar
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2 bg-[#050505] hover:bg-zinc-800 text-white text-[10.5px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            IMPRIMIR TICKET SHALOM
          </button>
        </div>
      </div>
    </div>
  );
}
