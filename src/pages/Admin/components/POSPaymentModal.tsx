import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  Truck,
  AlertCircle,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { PaymentMethodType, POSPaymentDetail } from '../../../types/pos';

interface POSPaymentModalProps {
  totalAmount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (payments: POSPaymentDetail[]) => void;
}

const PAYMENT_METHODS: { id: PaymentMethodType; label: string; icon: any; color: string }[] = [
  { id: 'EFECTIVO', label: 'Efectivo', icon: Banknote, color: 'text-emerald-400 border-emerald-500/30' },
  { id: 'YAPE', label: 'Yape', icon: Smartphone, color: 'text-purple-400 border-purple-500/30' },
  { id: 'PLIN', label: 'Plin', icon: Smartphone, color: 'text-cyan-400 border-cyan-500/30' },
  { id: 'TARJETA_POS', label: 'Tarjeta / POS', icon: CreditCard, color: 'text-amber-400 border-amber-500/30' },
  { id: 'TRANSFERENCIA_BCP', label: 'BCP', icon: Building, color: 'text-orange-400 border-orange-500/30' },
  { id: 'TRANSFERENCIA_BBVA', label: 'BBVA', icon: Building, color: 'text-blue-400 border-blue-500/30' },
  { id: 'TRANSFERENCIA_INTERBANK', label: 'Interbank', icon: Building, color: 'text-emerald-400 border-emerald-500/30' },
  { id: 'CONTRA_ENTREGA', label: 'Contra Entrega', icon: Truck, color: 'text-rose-400 border-rose-500/30' },
];

export default function POSPaymentModal({
  totalAmount,
  isOpen,
  onClose,
  onConfirmPayment,
}: POSPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('EFECTIVO');
  const [receivedAmount, setReceivedAmount] = useState<string>(totalAmount.toString());
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setReceivedAmount(totalAmount.toString());
      setReferenceNumber('');
      setErrorMessage('');
    }
  }, [isOpen, totalAmount]);

  if (!isOpen) return null;

  const numReceived = parseFloat(receivedAmount) || 0;
  const change = Math.max(0, numReceived - totalAmount);
  const isCash = selectedMethod === 'EFECTIVO';
  const isValidCash = isCash ? numReceived >= totalAmount : true;

  const handleQuickCash = (amount: number) => {
    setReceivedAmount(amount.toString());
  };

  const handleAddExact = () => {
    setReceivedAmount(totalAmount.toString());
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isCash && numReceived < totalAmount) {
      setErrorMessage(`El monto recibido (S/ ${numReceived.toFixed(2)}) es menor al total a cobrar (S/ ${totalAmount.toFixed(2)})`);
      return;
    }

    const paymentDetail: POSPaymentDetail = {
      method: selectedMethod,
      amount: totalAmount,
      amountReceived: isCash ? numReceived : totalAmount,
      change: isCash ? change : 0,
      referenceNumber: referenceNumber.trim() || undefined,
    };

    onConfirmPayment([paymentDetail]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0e0e14] border border-zinc-800 shadow-2xl text-white flex flex-col overflow-hidden my-auto max-h-[96vh]">
        {/* Header */}
        <div className="bg-[#14141e] border-b border-zinc-800 p-3.5 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500 shrink-0" />
            <h2 className="font-mono text-xs sm:text-base font-bold uppercase tracking-wider text-white">
              COBRAR VENTA — <span className="text-rose-400 font-black text-sm sm:text-xl ml-1">S/ {totalAmount.toFixed(2)}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-none hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
          {/* Method Selection Grid */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-2">
              1. Seleccionar Método de Pago:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethod(m.id);
                      setErrorMessage('');
                    }}
                    className={`p-3 border text-left transition-all flex flex-col justify-between h-20 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500 text-white shadow-md'
                        : 'bg-[#141420] border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-[#181826]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-zinc-400'}`} />
                      {isSelected && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                    </div>
                    <span className="font-mono text-xs font-bold uppercase tracking-wide">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Detail: Cash vs Digital */}
          {isCash ? (
            <div className="bg-[#141420] border border-zinc-800 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  Cobro en Efectivo
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Total a Cobrar: <b className="text-white">S/ {totalAmount.toFixed(2)}</b>
                </span>
              </div>

              {/* Amount Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Monto Recibido del Cliente (S/):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-zinc-400 text-sm">
                      S/
                    </span>
                    <input
                      type="number"
                      step="any"
                      value={receivedAmount}
                      onChange={(e) => {
                        setReceivedAmount(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full bg-[#181828] border-2 border-zinc-700 focus:border-rose-500 py-2.5 pl-9 pr-3 text-lg font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Change Box */}
                <div className={`p-3.5 border flex flex-col justify-center ${
                  numReceived >= totalAmount
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}>
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                    {numReceived >= totalAmount ? 'Vuelto a Entregar:' : 'Falta por Cobrar:'}
                  </span>
                  <span className="font-mono text-2xl font-black mt-0.5">
                    S/ {Math.abs(numReceived - totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div>
                <span className="block text-[9px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">
                  Billetes Rápidos:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleAddExact}
                    className="bg-[#1e1e2e] hover:bg-zinc-700 text-white font-mono text-xs px-3 py-1.5 border border-zinc-700 cursor-pointer"
                  >
                    Exacto (S/ {totalAmount.toFixed(2)})
                  </button>
                  {[20, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickCash(amt)}
                      className="bg-[#1e1e2e] hover:bg-rose-500/20 text-white font-mono text-xs px-3.5 py-1.5 border border-zinc-700 hover:border-rose-500/40 cursor-pointer"
                    >
                      S/ {amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#141420] border border-zinc-800 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  Datos de Pago: {selectedMethod.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono text-rose-400 font-bold">
                  Total: S/ {totalAmount.toFixed(2)}
                </span>
              </div>

              {selectedMethod === 'YAPE' || selectedMethod === 'PLIN' ? (
                <div className="text-xs font-mono text-zinc-300 bg-[#161624] p-3 border border-zinc-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Titular:</span>
                    <span className="font-bold text-white">BRYAN MICHAEL REQUENA AVILA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">R.U.C.:</span>
                    <span className="font-bold text-white">10714931062</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Número Celular:</span>
                    <span className="font-bold text-emerald-400">904 536 406 / 924 058 988</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                    <span>Monto a verificar:</span>
                    <span className="text-emerald-400 font-bold">S/ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ) : selectedMethod.startsWith('TRANSFERENCIA') ? (
                <div className="text-xs font-mono text-zinc-300 bg-[#161624] p-3 border border-zinc-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Banco:</span>
                    <span className="font-bold text-white">{selectedMethod.replace('TRANSFERENCIA_', '')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Beneficiario:</span>
                    <span className="text-zinc-200 font-bold">REQUENA AVILA BRYAN MICHAEL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">R.U.C.:</span>
                    <span className="text-zinc-200">10714931062</span>
                  </div>
                </div>
              ) : null}

              {/* Reference / Operation code input */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  N° de Operación / Código de Aprobación / Referencia (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej. 7489201"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full bg-[#181828] border border-zinc-700 focus:border-rose-500 py-2 px-3 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-500/15 border border-rose-500 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs uppercase tracking-wider py-3 border border-zinc-700 transition-colors cursor-pointer text-center"
            >
              <span className="hidden sm:inline">Cancelar (Esc)</span>
              <span className="sm:hidden">Cancelar</span>
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!isValidCash}
              className={`flex-2 font-mono text-xs font-bold uppercase tracking-wider py-3 px-3 sm:px-4 flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-lg cursor-pointer ${
                isValidCash
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
              }`}
            >
              <Check className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">CONFIRMAR COBRO & EMITIR TICKET (S/ {totalAmount.toFixed(2)})</span>
              <span className="sm:hidden">COBRAR S/ {totalAmount.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
