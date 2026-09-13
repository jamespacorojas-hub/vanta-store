import React, { useState, useMemo } from 'react';
import {
  Search,
  Printer,
  Send,
  Ban,
  Download,
  Calendar,
  FileText,
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { POSSale } from '../../../types/pos';
import { getStoredSales, voidPOSSale } from '../../../utils/posStorage';
import POSTicketModal from './POSTicketModal';
import POSProformaModal from './POSProformaModal';

interface POSSalesHistoryProps {
  onRefreshStats?: () => void;
}

export default function POSSalesHistory({ onRefreshStats }: POSSalesHistoryProps) {
  const [sales, setSales] = useState<POSSale[]>(() => getStoredSales());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'TODOS' | 'COMPLETADA' | 'ANULADA'>('TODOS');
  const [filterMethod, setFilterMethod] = useState<string>('TODOS');
  const [selectedSaleForTicket, setSelectedSaleForTicket] = useState<POSSale | null>(null);
  const [selectedSaleForA4, setSelectedSaleForA4] = useState<POSSale | null>(null);

  // Void modal state
  const [saleToVoid, setSaleToVoid] = useState<POSSale | null>(null);
  const [voidReason, setVoidReason] = useState('Error en digitación / cambio de prenda');

  const refreshData = () => {
    const updated = getStoredSales();
    setSales(updated);
    if (onRefreshStats) onRefreshStats();
  };

  const handleVoidSale = () => {
    if (!saleToVoid) return;
    const updated = voidPOSSale(saleToVoid.id, voidReason);
    setSales(updated);
    setSaleToVoid(null);
    if (onRefreshStats) onRefreshStats();
  };

  // Filtered sales list
  const filteredSales = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return sales.filter((s) => {
      const matchSearch =
        !q ||
        s.receiptNumber.toLowerCase().includes(q) ||
        s.customer.name.toLowerCase().includes(q) ||
        (s.customer.phone && s.customer.phone.includes(q)) ||
        (s.customer.documentNumber && s.customer.documentNumber.includes(q)) ||
        (s.shippingInfo?.provincia && (
          s.shippingInfo.provincia.consigneeName.toLowerCase().includes(q) ||
          s.shippingInfo.provincia.consigneeDni.includes(q) ||
          (s.shippingInfo.provincia.departmentProvinceDistrict && s.shippingInfo.provincia.departmentProvinceDistrict.toLowerCase().includes(q)) ||
          (s.shippingInfo.provincia.department && s.shippingInfo.provincia.department.toLowerCase().includes(q)) ||
          (s.shippingInfo.provincia.provinceCity && s.shippingInfo.provincia.provinceCity.toLowerCase().includes(q)) ||
          s.shippingInfo.provincia.agency.toLowerCase().includes(q) ||
          (s.shippingInfo.provincia.agencyBranch && s.shippingInfo.provincia.agencyBranch.toLowerCase().includes(q))
        )) ||
        (s.shippingInfo?.lima && (
          s.shippingInfo.lima.recipientName.toLowerCase().includes(q) ||
          s.shippingInfo.lima.district.toLowerCase().includes(q) ||
          (s.shippingInfo.lima.recipientDni && s.shippingInfo.lima.recipientDni.includes(q)) ||
          (s.shippingInfo.lima.address && s.shippingInfo.lima.address.toLowerCase().includes(q))
        ));

      const matchStatus = filterStatus === 'TODOS' || s.status === filterStatus;
      const matchMethod =
        filterMethod === 'TODOS' || s.payments.some((p) => p.method === filterMethod);

      return matchSearch && matchStatus && matchMethod;
    });
  }, [sales, searchQuery, filterStatus, filterMethod]);

  // Totals calculations
  const stats = useMemo(() => {
    const validSales = sales.filter((s) => s.status === 'COMPLETADA');
    const totalAmount = validSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalItems = validSales.reduce((sum, s) => sum + s.items.reduce((acc, i) => acc + i.quantity, 0), 0);
    const voidCount = sales.filter((s) => s.status === 'ANULADA').length;

    return {
      salesCount: validSales.length,
      totalAmount,
      totalItems,
      voidCount,
    };
  }, [sales]);

  // Export to CSV
  const handleExportCSV = () => {
    if (sales.length === 0) return;

    const headers = [
      'Nro Comprobante',
      'Tipo',
      'Fecha',
      'Hora',
      'Cliente / Consignado',
      'Doc / DNI',
      'Telefono',
      'Tipo Envio',
      'Destino / Distrito',
      'Agencia / Courier',
      'Detalle Envio / Sucursal',
      'Flete',
      'Prendas Total',
      'Subtotal S/',
      'Descuento S/',
      'Total S/',
      'Adelanto S/',
      'Saldo Pendiente S/',
      'Cuenta Receptora',
      'Metodos Pago',
      'Estado',
      'Cajero',
    ];

    const rows = sales.map((s) => {
      const isProv = s.destinationType === 'PROVINCIA' || Boolean(s.shippingInfo?.provincia);
      const prov = s.shippingInfo?.provincia;
      const lima = s.shippingInfo?.lima;

      const clientName = isProv ? (prov?.consigneeName || s.customer.name) : (lima?.recipientName || s.customer.name || 'Cliente Varios');
      const docNum = isProv ? (prov?.consigneeDni || s.customer.documentNumber || '') : (lima?.recipientDni || s.customer.documentNumber || '');
      const phoneNum = isProv ? (prov?.consigneePhone || s.customer.phone || '') : (lima?.recipientPhone || s.customer.phone || '');
      const destName = isProv
        ? (prov?.departmentProvinceDistrict || (prov?.provinceCity ? `${prov.provinceCity}, ${prov.department}` : prov?.department) || 'Provincia')
        : (lima?.district || 'Lima');
      const agencyName = isProv
        ? (prov?.agency === 'OTRA' ? (prov?.otherAgencyName || 'OTRA') : (prov?.agency || 'SHALOM'))
        : (lima?.courier ? lima.courier.replace('_', ' ') : 'Motorizado');
      const detailEnvio = isProv
        ? (prov?.agencyBranch || prov?.address || '')
        : (lima?.address ? `${lima.address} ${lima.reference ? `(Ref: ${lima.reference})` : ''}` : '');
      const fleteStr = isProv
        ? (prov?.freightPayment === 'PAGO_DESTINO' ? 'PAGO EN DESTINO' : `FLETE PAGADO S/ ${s.shippingCost.toFixed(2)}`)
        : (s.shippingCost === 0 ? 'RECOJO TIENDA' : `S/ ${s.shippingCost.toFixed(2)}`);

      return [
        s.receiptNumber,
        s.receiptType,
        s.formattedDate,
        s.formattedTime,
        `"${clientName}"`,
        `"${docNum}"`,
        `"${phoneNum}"`,
        isProv ? 'PROVINCIA' : 'LIMA',
        `"${destName}"`,
        `"${agencyName}"`,
        `"${detailEnvio}"`,
        `"${fleteStr}"`,
        s.items.reduce((acc, i) => acc + i.quantity, 0),
        s.subtotalAmount.toFixed(2),
        s.discountAmount.toFixed(2),
        s.totalAmount.toFixed(2),
        (s.advanceAmount !== undefined ? s.advanceAmount.toFixed(2) : s.totalAmount.toFixed(2)),
        (s.pendingBalance !== undefined ? s.pendingBalance.toFixed(2) : '0.00'),
        `"${s.paymentAccountLabel || ''}"`,
        `"${s.payments.map((p) => p.method).join(', ')}"`,
        s.status,
        `"${s.sellerName}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VANTA_VENTAS_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick WhatsApp forward
  const handleSendWhatsApp = (sale: POSSale) => {
    let phone = sale.shippingInfo?.provincia?.consigneePhone || sale.shippingInfo?.lima?.recipientPhone || sale.customer.phone || '';
    phone = phone.replace(/[^0-9]/g, '');
    if (phone.length === 9) phone = `51${phone}`;

    let msg = `*VANTA STREETWEAR — NOTA DE VENTA*\n`;
    msg += `*Comprobante:* ${sale.receiptNumber}\n`;
    msg += `*Fecha:* ${sale.formattedDate} ${sale.formattedTime}\n`;
    msg += `*Total de la Venta:* S/ ${sale.totalAmount.toFixed(2)}\n`;
    if (sale.advanceAmount !== undefined && sale.advanceAmount < sale.totalAmount) {
      msg += `💰 *Adelanto pagado:* S/ ${sale.advanceAmount.toFixed(2)}\n`;
      msg += `⏳ *Saldo pendiente:* S/ ${(sale.pendingBalance ?? (sale.totalAmount - sale.advanceAmount)).toFixed(2)}\n`;
    }
    if (sale.paymentAccountLabel) {
      msg += `💳 *Cuenta receptora:* ${sale.paymentAccountLabel}\n`;
    }
    msg += `*Cliente:* ${sale.shippingInfo?.provincia?.consigneeName || sale.shippingInfo?.lima?.recipientName || sale.customer.name}\n\n`;
    msg += `*Detalle de prendas:*\n`;
    sale.items.forEach((item, idx) => {
      msg += `• ${item.quantity}x ${item.productName} (${item.selectedSize} / ${item.selectedColor}) - S/ ${item.subtotal.toFixed(2)}\n`;
    });
    msg += `\n¡Gracias por tu preferencia en VANTA! 🖤`;

    const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-paper text-ink overflow-hidden">
      {/* Top Stat Summary Cards */}
      <div className="p-3 sm:p-4 bg-paper-soft border-b border-line grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
        <div className="bg-panel p-3 border border-line">
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted block">
            Ventas Realizadas
          </span>
          <span className="text-xl font-mono font-black text-ink mt-0.5 block">
            {stats.salesCount}
          </span>
        </div>

        <div className="bg-panel p-3 border border-line">
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted block">
            Recaudación Neta
          </span>
          <span className="text-xl font-mono font-black text-accent mt-0.5 block">
            S/ {stats.totalAmount.toFixed(2)}
          </span>
        </div>

        <div className="bg-panel p-3 border border-line">
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted block">
            Prendas Despachadas
          </span>
          <span className="text-xl font-mono font-black text-ink mt-0.5 block">
            {stats.totalItems} unds.
          </span>
        </div>

        <div className="bg-panel p-3 border border-line">
          <span className="text-[9px] font-mono uppercase tracking-widest text-muted block">
            Notas Anuladas
          </span>
          <span className="text-xl font-mono font-black text-muted mt-0.5 block">
            {stats.voidCount}
          </span>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="p-3 sm:p-4 bg-paper border-b border-line flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar por N° Nota (NV-0001), Cliente, Teléfono o DNI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel border border-line text-xs font-mono py-2 pl-9 pr-3 text-ink focus:outline-none focus:border-accent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-panel border border-line text-xs font-mono py-2 px-2.5 text-ink cursor-pointer"
          >
            <option value="TODOS">Todos los Estados</option>
            <option value="COMPLETADA">Solo Completadas</option>
            <option value="ANULADA">Solo Anuladas</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="bg-panel border border-line text-xs font-mono py-2 px-2.5 text-ink cursor-pointer"
          >
            <option value="TODOS">Todos los Pagos</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="YAPE">Yape</option>
            <option value="PLIN">Plin</option>
            <option value="TARJETA_POS">Tarjeta / POS</option>
            <option value="TRANSFERENCIA_BCP">BCP</option>
            <option value="TRANSFERENCIA_BBVA">BBVA</option>
            <option value="TRANSFERENCIA_INTERBANK">Interbank</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          disabled={sales.length === 0}
          className="bg-panel hover:bg-zinc-800 disabled:opacity-50 text-ink font-mono text-xs py-2 px-3 border border-line flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-accent" />
          <span>Exportar CSV / Excel</span>
        </button>
      </div>

      {/* Sales Table Container */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {filteredSales.length > 0 ? (
          <table className="w-full min-w-[760px] text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-line bg-panel text-muted uppercase text-[10px] tracking-wider">
                <th className="p-3">Comprobante</th>
                <th className="p-3">Fecha / Hora</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Prendas</th>
                <th className="p-3">Método Pago</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredSales.map((sale) => {
                const totalItemsCount = sale.items.reduce((sum, i) => sum + i.quantity, 0);
                const isCompleted = sale.status === 'COMPLETADA';

                return (
                  <tr
                    key={sale.id}
                    className={`hover:bg-panel/50 transition-colors ${
                      !isCompleted ? 'opacity-60 bg-rose-950/10' : ''
                    }`}
                  >
                    {/* Receipt Number & Destination */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-accent">{sale.receiptNumber}</span>
                        {sale.destinationType === 'PROVINCIA' || Boolean(sale.shippingInfo?.provincia) ? (
                          <span
                            className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-xs uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            title={`Agencia: ${sale.shippingInfo?.provincia?.agency === 'OTRA' ? (sale.shippingInfo?.provincia?.otherAgencyName || 'OTRA') : (sale.shippingInfo?.provincia?.agency || 'SHALOM')}`}
                          >
                            📦 {sale.shippingInfo?.provincia?.agency === 'OTRA' ? (sale.shippingInfo?.provincia?.otherAgencyName || 'PROVINCIA') : (sale.shippingInfo?.provincia?.agency || 'SHALOM')}
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-bold px-1.5 py-0.2 rounded-xs uppercase bg-zinc-700/50 text-zinc-300 border border-zinc-600">
                            🛵 {sale.shippingInfo?.lima?.district || 'LIMA'}
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-muted uppercase mt-0.5">
                        {sale.receiptType.replace('_', ' ')}
                      </div>
                    </td>

                    {/* Date / Time */}
                    <td className="p-3 whitespace-nowrap">
                      <div>{sale.formattedDate}</div>
                      <div className="text-[10px] text-muted">{sale.formattedTime}</div>
                    </td>

                    {/* Customer */}
                    <td className="p-3">
                      <div className="font-bold truncate max-w-[180px] text-ink">
                        {sale.shippingInfo?.provincia?.consigneeName ||
                          sale.shippingInfo?.lima?.recipientName ||
                          sale.customer.businessName ||
                          sale.customer.name ||
                          'Cliente Varios'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted flex-wrap">
                        {(sale.shippingInfo?.provincia?.consigneeDni || sale.shippingInfo?.lima?.recipientDni || sale.customer.documentNumber) && (
                          <span className="font-mono text-[9px] font-semibold text-accent">
                            DNI: {sale.shippingInfo?.provincia?.consigneeDni || sale.shippingInfo?.lima?.recipientDni || sale.customer.documentNumber}
                          </span>
                        )}
                        {(sale.shippingInfo?.provincia?.consigneePhone || sale.shippingInfo?.lima?.recipientPhone || sale.customer.phone) && (
                          <span>📱 {sale.shippingInfo?.provincia?.consigneePhone || sale.shippingInfo?.lima?.recipientPhone || sale.customer.phone}</span>
                        )}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="p-3">
                      <span className="bg-panel px-2 py-0.5 border border-line text-[10.5px]">
                        {totalItemsCount} {totalItemsCount === 1 ? 'prenda' : 'prendas'}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {sale.payments.map((p, idx) => (
                          <span
                            key={idx}
                            className="bg-panel border border-line px-1.5 py-0.5 text-[9.5px] uppercase font-semibold text-muted"
                          >
                            {p.method.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="p-3 text-right">
                      <div className="font-bold text-ink text-sm">
                        S/ {sale.totalAmount.toFixed(2)}
                      </div>
                      {sale.advanceAmount !== undefined && sale.advanceAmount < sale.totalAmount ? (
                        <div className="mt-0.5 space-y-0.5">
                          <div className="text-[9px] font-mono text-emerald-400 font-semibold">
                            Adelanto: S/ {sale.advanceAmount.toFixed(2)}
                          </div>
                          <div className="text-[9.5px] font-mono font-bold text-amber-400">
                            Saldo: S/ {(sale.pendingBalance ?? (sale.totalAmount - sale.advanceAmount)).toFixed(2)}
                          </div>
                        </div>
                      ) : null}
                      {sale.discountAmount > 0 && (
                        <div className="text-[9px] text-rose-500">
                          -S/ {sale.discountAmount.toFixed(2)} desc.
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="p-3 text-center">
                      {isCompleted ? (
                        sale.pendingBalance && sale.pendingBalance > 0 ? (
                          <span
                            className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5"
                            title={`Saldo pendiente por cobrar: S/ ${sale.pendingBalance.toFixed(2)}`}
                          >
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                            SALDO S/ {sale.pendingBalance.toFixed(2)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
                            <CheckCircle className="w-3 h-3" />
                            PAGADA 100%
                          </span>
                        )
                      ) : (
                        <span
                          title={sale.voidReason}
                          className="inline-flex items-center gap-1 text-[9.5px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 cursor-help"
                        >
                          <XCircle className="w-3 h-3" />
                          ANULADA
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View / Download A4 Format */}
                        <button
                          onClick={() => setSelectedSaleForA4(sale)}
                          className="p-1.5 bg-panel hover:bg-rose-600 hover:text-white text-muted border border-line transition-colors cursor-pointer"
                          title="Descargar / Imprimir Nota de Venta en Formato A4 (PDF)"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-400 hover:text-white" />
                        </button>

                        {/* View / Print Ticket */}
                        <button
                          onClick={() => setSelectedSaleForTicket(sale)}
                          className="p-1.5 bg-panel hover:bg-accent hover:text-white text-muted border border-line transition-colors cursor-pointer"
                          title="Ver / Reimprimir Ticket"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* WhatsApp */}
                        <button
                          onClick={() => handleSendWhatsApp(sale)}
                          className="p-1.5 bg-panel hover:bg-emerald-600 hover:text-white text-muted border border-line transition-colors cursor-pointer"
                          title="Enviar por WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        {/* Void button */}
                        {isCompleted && (
                          <button
                            onClick={() => setSaleToVoid(sale)}
                            className="p-1.5 bg-panel hover:bg-rose-600 hover:text-white text-muted border border-line transition-colors cursor-pointer"
                            title="Anular Nota de Venta"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 text-muted">
            <FileText className="w-12 h-12 stroke-[1.2] mb-3 opacity-30" />
            <p className="font-mono text-xs uppercase font-bold">No hay comprobantes para mostrar</p>
            <p className="text-[10px] font-mono mt-1 opacity-70">
              Las notas de venta emitidas desde el terminal de mostrador aparecerán listadas aquí.
            </p>
          </div>
        )}
      </div>

      {/* Ticket Modal for Reprinting */}
      <POSTicketModal
        isOpen={Boolean(selectedSaleForTicket)}
        sale={selectedSaleForTicket}
        onClose={() => setSelectedSaleForTicket(null)}
        onNewSale={() => setSelectedSaleForTicket(null)}
      />

      {/* Void Sale Confirmation Modal */}
      {saleToVoid && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e0e14] border border-rose-900/60 p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-400">
              <Ban className="w-5 h-5" />
              <h3 className="font-mono text-sm font-bold uppercase">
                Anular Nota de Venta {saleToVoid.receiptNumber}
              </h3>
            </div>

            <p className="text-xs font-mono text-zinc-300">
              ¿Estás seguro de anular esta nota de venta por un total de{' '}
              <b className="text-white">S/ {saleToVoid.totalAmount.toFixed(2)}</b>? Esta acción quedará registrada en el historial.
            </p>

            <div>
              <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                Motivo de anulación:
              </label>
              <input
                type="text"
                value={voidReason}
                onChange={(e) => setVoidReason(e.target.value)}
                className="w-full bg-[#161622] border border-zinc-700 py-2 px-3 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSaleToVoid(null)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs uppercase py-2.5 border border-zinc-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleVoidSale}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase py-2.5 cursor-pointer shadow-lg shadow-rose-950/40"
              >
                Confirmar Anulación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formal A4 Document Preview & Download Modal */}
      {selectedSaleForA4 && (
        <POSProformaModal
          isOpen={Boolean(selectedSaleForA4)}
          onClose={() => setSelectedSaleForA4(null)}
          items={selectedSaleForA4.items}
          customer={selectedSaleForA4.customer}
          destinationType={selectedSaleForA4.destinationType}
          shippingCost={selectedSaleForA4.shippingCost}
          discountAmount={selectedSaleForA4.discountAmount}
          totalAmount={selectedSaleForA4.totalAmount}
          sellerName={selectedSaleForA4.sellerName}
          existingReceiptNumber={selectedSaleForA4.receiptNumber}
          receiptType={selectedSaleForA4.receiptType}
          isCompletedSale={true}
          shippingInfo={selectedSaleForA4.shippingInfo}
          advanceAmount={selectedSaleForA4.advanceAmount}
          pendingBalance={selectedSaleForA4.pendingBalance}
          isAdvancePayment={selectedSaleForA4.isAdvancePayment}
          paymentAccountId={selectedSaleForA4.paymentAccountId}
          paymentAccountLabel={selectedSaleForA4.paymentAccountLabel}
          observations={selectedSaleForA4.observations}
          onOpenTicket={() => {
            const s = selectedSaleForA4;
            setSelectedSaleForA4(null);
            setSelectedSaleForTicket(s);
          }}
        />
      )}
    </div>
  );
}
