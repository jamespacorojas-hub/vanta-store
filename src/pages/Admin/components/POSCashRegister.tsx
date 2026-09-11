import React, { useState, useMemo } from 'react';
import {
  Banknote,
  Smartphone,
  CreditCard,
  Building,
  DollarSign,
  Printer,
  Calendar,
  Lock,
  ArrowDownCircle,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getStoredSales, getActiveShift, updateActiveShift, getActiveSeller } from '../../../utils/posStorage';
import { POSShiftSummary } from '../../../types/pos';

export default function POSCashRegister() {
  const sales = getStoredSales();
  const [shift, setShift] = useState<POSShiftSummary>(() => getActiveShift());
  const [initialCashInput, setInitialCashInput] = useState<string>(shift.initialCash.toString());
  const [isEditingInitial, setIsEditingInitial] = useState(false);

  // Filter sales for today / active shift
  const validSales = useMemo(() => {
    return sales.filter((s) => s.status === 'COMPLETADA');
  }, [sales]);

  // Breakdown by payment methods
  const paymentBreakdown = useMemo(() => {
    let cash = 0;
    let yape = 0;
    let plin = 0;
    let card = 0;
    let transfer = 0;
    let contraEntrega = 0;

    validSales.forEach((s) => {
      s.payments.forEach((p) => {
        if (p.method === 'EFECTIVO') cash += p.amount;
        else if (p.method === 'YAPE') yape += p.amount;
        else if (p.method === 'PLIN') plin += p.amount;
        else if (p.method === 'TARJETA_POS') card += p.amount;
        else if (p.method.startsWith('TRANSFERENCIA')) transfer += p.amount;
        else if (p.method === 'CONTRA_ENTREGA') contraEntrega += p.amount;
      });
    });

    const digitalTotal = yape + plin + transfer;
    const totalSales = cash + yape + plin + card + transfer + contraEntrega;
    const expectedCashInDrawer = shift.initialCash + cash;

    return {
      cash,
      yape,
      plin,
      card,
      transfer,
      contraEntrega,
      digitalTotal,
      totalSales,
      expectedCashInDrawer,
    };
  }, [validSales, shift.initialCash]);

  // Top selling products
  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string; qty: number; total: number; image: string }> = {};

    validSales.forEach((s) => {
      s.items.forEach((item) => {
        if (!counts[item.productId]) {
          counts[item.productId] = {
            name: item.productName,
            qty: 0,
            total: 0,
            image: item.image,
          };
        }
        counts[item.productId].qty += item.quantity;
        counts[item.productId].total += item.subtotal;
      });
    });

    return Object.values(counts)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [validSales]);

  const handleSaveInitialCash = () => {
    const num = parseFloat(initialCashInput) || 0;
    const updated = { ...shift, initialCash: num };
    setShift(updated);
    updateActiveShift(updated);
    setIsEditingInitial(false);
  };

  const handlePrintZReport = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-paper text-ink overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-paper-soft p-4 border border-line">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-ink">
              ARQUEO DE CAJA & RESUMEN DE VENTAS
            </h2>
          </div>
          <p className="text-[11px] font-mono text-muted mt-1">
            Turno actual: <b className="text-ink">{getActiveSeller()}</b> • Fecha: {new Date().toLocaleDateString('es-PE')}
          </p>
        </div>

        <button
          onClick={handlePrintZReport}
          className="bg-accent hover:bg-rose-600 text-white font-mono text-xs font-bold py-2.5 px-4 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Reporte Z</span>
        </button>
      </div>

      {/* Main Totals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-panel p-4 border border-line flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Venta Total Neta</span>
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-mono font-black text-ink block">
              S/ {paymentBreakdown.totalSales.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-muted mt-1 block">
              {validSales.length} {validSales.length === 1 ? 'comprobante emitido' : 'comprobantes emitidos'}
            </span>
          </div>
        </div>

        {/* Expected Cash in Drawer */}
        <div className="bg-panel p-4 border border-line flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Efectivo en Gaveta</span>
            <Banknote className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-mono font-black text-emerald-400 block">
              S/ {paymentBreakdown.expectedCashInDrawer.toFixed(2)}
            </span>
            <div className="text-[10px] font-mono text-muted flex items-center justify-between mt-1">
              <span>(Inicial S/ {shift.initialCash.toFixed(2)} + Ventas S/ {paymentBreakdown.cash.toFixed(2)})</span>
            </div>
          </div>
        </div>

        {/* Digital Payments */}
        <div className="bg-panel p-4 border border-line flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Billeteras & Transferencias</span>
            <Smartphone className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-mono font-black text-purple-400 block">
              S/ {paymentBreakdown.digitalTotal.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-muted mt-1 block">
              Yape S/ {paymentBreakdown.yape.toFixed(2)} • Plin S/ {paymentBreakdown.plin.toFixed(2)} • Bancos S/ {paymentBreakdown.transfer.toFixed(2)}
            </span>
          </div>
        </div>

        {/* POS Cards */}
        <div className="bg-panel p-4 border border-line flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Tarjetas / POS Físico</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-mono font-black text-amber-400 block">
              S/ {paymentBreakdown.card.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-muted mt-1 block">
              Tarjetas Visa / Mastercard
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Cash Breakdown Table + Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown by Payment Method */}
        <div className="bg-panel border border-line p-4 sm:p-5 space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-ink font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            Desglose por Métodos de Pago
          </h3>

          <div className="divide-y divide-line/60 text-xs font-mono">
            {/* Initial Cash */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-muted" />
                <span>Saldo Inicial en Caja (Fondo de Sencillo):</span>
              </div>
              {isEditingInitial ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={initialCashInput}
                    onChange={(e) => setInitialCashInput(e.target.value)}
                    className="w-20 bg-paper border border-line px-2 py-0.5 text-xs text-ink"
                  />
                  <button
                    onClick={handleSaveInitialCash}
                    className="bg-accent text-white px-2 py-0.5 text-[10px] font-bold"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-bold">S/ {shift.initialCash.toFixed(2)}</span>
                  <button
                    onClick={() => setIsEditingInitial(true)}
                    className="text-[10px] text-accent hover:underline cursor-pointer"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>

            {/* Cash */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ventas en Efectivo (Cash):</span>
              </div>
              <span className="font-bold text-emerald-400">S/ {paymentBreakdown.cash.toFixed(2)}</span>
            </div>

            {/* Yape */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>Yape:</span>
              </div>
              <span className="font-bold">S/ {paymentBreakdown.yape.toFixed(2)}</span>
            </div>

            {/* Plin */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Plin:</span>
              </div>
              <span className="font-bold">S/ {paymentBreakdown.plin.toFixed(2)}</span>
            </div>

            {/* Tarjeta */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Tarjeta de Crédito / Débito:</span>
              </div>
              <span className="font-bold">S/ {paymentBreakdown.card.toFixed(2)}</span>
            </div>

            {/* Transferencias */}
            <div className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <span>Transferencias Bancarias (BCP / BBVA / Interbank):</span>
              </div>
              <span className="font-bold">S/ {paymentBreakdown.transfer.toFixed(2)}</span>
            </div>

            {/* Contra Entrega */}
            {paymentBreakdown.contraEntrega > 0 && (
              <div className="py-2.5 flex items-center justify-between">
                <span>Contra Entrega (Por Liquidar):</span>
                <span className="font-bold">S/ {paymentBreakdown.contraEntrega.toFixed(2)}</span>
              </div>
            )}

            {/* Total Sales Row */}
            <div className="py-3 flex items-center justify-between text-sm font-bold border-t-2 border-line">
              <span>TOTAL RECAUDADO EN EL TURNO:</span>
              <span className="text-accent text-base">S/ {paymentBreakdown.totalSales.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Top Selling Garments */}
        <div className="bg-panel border border-line p-4 sm:p-5 space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-ink font-bold flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Prendas Más Vendidas en el Turno
          </h3>

          <div className="space-y-2.5">
            {topProducts.map((p, idx) => (
              <div
                key={p.name}
                className="bg-paper p-2.5 border border-line flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 object-cover border border-line bg-paper-soft"
                  />
                  <div>
                    <h4 className="font-mono text-xs font-bold text-ink uppercase">{p.name}</h4>
                    <span className="text-[10px] font-mono text-muted">
                      {p.qty} {p.qty === 1 ? 'unidad vendida' : 'unidades vendidas'}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono font-bold text-xs text-accent">
                  S/ {p.total.toFixed(2)}
                </div>
              </div>
            ))}

            {topProducts.length === 0 && (
              <div className="py-10 text-center text-muted font-mono text-xs">
                Aún no hay ventas registradas en este turno.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
