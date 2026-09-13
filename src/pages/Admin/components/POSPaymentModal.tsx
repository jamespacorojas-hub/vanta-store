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
  Copy,
  Coins,
} from 'lucide-react';
import { PaymentMethodType, POSPaymentDetail, VANTA_BANK_ACCOUNTS } from '../../../types/pos';

export interface POSAdvancePaymentInfo {
  isAdvance: boolean;
  advanceAmount: number;
  pendingBalance: number;
  accountId?: string;
  accountLabel?: string;
}

interface POSPaymentModalProps {
  totalAmount: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPayment: (payments: POSPaymentDetail[], advanceInfo?: POSAdvancePaymentInfo) => void;
  initialIsAdvance?: boolean;
  initialAdvanceAmount?: number;
  initialAccountId?: string;
}

const PAYMENT_METHODS: { id: PaymentMethodType; label: string; icon: any; color: string; accountId?: string }[] = [
  { id: 'EFECTIVO', label: 'Efectivo', icon: Banknote, color: 'text-emerald-400 border-emerald-500/30', accountId: 'EFECTIVO' },
  { id: 'YAPE', label: 'Yape', icon: Smartphone, color: 'text-purple-400 border-purple-500/30', accountId: 'YAPE_PLIN' },
  { id: 'PLIN', label: 'Plin', icon: Smartphone, color: 'text-cyan-400 border-cyan-500/30', accountId: 'YAPE_PLIN' },
  { id: 'TARJETA_POS', label: 'Tarjeta / POS', icon: CreditCard, color: 'text-amber-400 border-amber-500/30' },
  { id: 'TRANSFERENCIA_BCP', label: 'BCP Soles', icon: Building, color: 'text-orange-400 border-orange-500/30', accountId: 'BCP' },
  { id: 'TRANSFERENCIA_BBVA', label: 'BBVA Soles', icon: Building, color: 'text-blue-400 border-blue-500/30', accountId: 'BBVA' },
  { id: 'TRANSFERENCIA_INTERBANK', label: 'Interbank Soles', icon: Building, color: 'text-emerald-400 border-emerald-500/30', accountId: 'INTERBANK' },
  { id: 'CONTRA_ENTREGA', label: 'Contra Entrega', icon: Truck, color: 'text-rose-400 border-rose-500/30' },
];

export default function POSPaymentModal({
  totalAmount,
  isOpen,
  onClose,
  onConfirmPayment,
  initialIsAdvance = false,
  initialAdvanceAmount,
  initialAccountId,
}: POSPaymentModalProps) {
  const [isAdvance, setIsAdvance] = useState<boolean>(initialIsAdvance);
  const [advanceAmountInput, setAdvanceAmountInput] = useState<string>(
    (initialAdvanceAmount && initialAdvanceAmount > 0 && initialAdvanceAmount < totalAmount
      ? initialAdvanceAmount
      : Math.round(totalAmount * 0.5)
    ).toString()
  );

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('EFECTIVO');
  const [receivedAmount, setReceivedAmount] = useState<string>(totalAmount.toString());
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Compute effective amount to collect right now
  const parsedAdvance = Math.min(totalAmount, Math.max(0, parseFloat(advanceAmountInput) || 0));
  const targetAmountToCollect = isAdvance ? parsedAdvance : totalAmount;
  const pendingBalance = Math.max(0, totalAmount - (isAdvance ? parsedAdvance : totalAmount));

  useEffect(() => {
    if (isOpen) {
      setIsAdvance(initialIsAdvance);
      const defaultAdv =
        initialAdvanceAmount && initialAdvanceAmount > 0 && initialAdvanceAmount < totalAmount
          ? initialAdvanceAmount
          : Math.round(totalAmount * 0.5);
      setAdvanceAmountInput(defaultAdv.toString());
      const effAmount = initialIsAdvance ? defaultAdv : totalAmount;
      setReceivedAmount(effAmount.toString());
      setReferenceNumber('');
      setErrorMessage('');

      if (initialAccountId === 'BCP') setSelectedMethod('TRANSFERENCIA_BCP');
      else if (initialAccountId === 'BBVA') setSelectedMethod('TRANSFERENCIA_BBVA');
      else if (initialAccountId === 'INTERBANK') setSelectedMethod('TRANSFERENCIA_INTERBANK');
      else if (initialAccountId === 'YAPE_PLIN') setSelectedMethod('YAPE');
    }
  }, [isOpen, totalAmount, initialIsAdvance, initialAdvanceAmount, initialAccountId]);

  if (!isOpen) return null;

  const numReceived = parseFloat(receivedAmount) || 0;
  const change = Math.max(0, numReceived - targetAmountToCollect);
  const isCash = selectedMethod === 'EFECTIVO';
  const isValidCash = isCash ? numReceived >= targetAmountToCollect : true;

  const handleToggleMode = (modeAdvance: boolean) => {
    setIsAdvance(modeAdvance);
    setErrorMessage('');
    const newTarget = modeAdvance ? parsedAdvance : totalAmount;
    setReceivedAmount(newTarget.toString());
  };

  const handleAdvancePreset = (amount: number) => {
    const safeAmount = Math.min(totalAmount, Math.max(1, amount));
    setAdvanceAmountInput(safeAmount.toString());
    setReceivedAmount(safeAmount.toString());
  };

  const handleAdvancePercent = (pct: number) => {
    const val = Math.round((totalAmount * pct) / 100);
    handleAdvancePreset(val);
  };

  const handleQuickCash = (amount: number) => {
    setReceivedAmount(amount.toString());
  };

  const handleAddExact = () => {
    setReceivedAmount(targetAmountToCollect.toString());
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isAdvance && parsedAdvance <= 0) {
      setErrorMessage('Por favor ingresa un monto válido de adelanto mayor a S/ 0.');
      return;
    }

    if (isCash && numReceived < targetAmountToCollect) {
      setErrorMessage(
        `El monto recibido (S/ ${numReceived.toFixed(2)}) es menor al monto a cobrar (S/ ${targetAmountToCollect.toFixed(2)})`
      );
      return;
    }

    const currentMethodObj = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
    const accountId = currentMethodObj?.accountId;
    const matchedAccount = VANTA_BANK_ACCOUNTS.find((acc) => acc.id === accountId);

    const paymentDetail: POSPaymentDetail = {
      method: selectedMethod,
      amount: targetAmountToCollect,
      amountReceived: isCash ? numReceived : targetAmountToCollect,
      change: isCash ? change : 0,
      referenceNumber: referenceNumber.trim() || undefined,
    };

    const advanceData: POSAdvancePaymentInfo = {
      isAdvance: isAdvance && pendingBalance > 0,
      advanceAmount: isAdvance ? targetAmountToCollect : totalAmount,
      pendingBalance: isAdvance ? pendingBalance : 0,
      accountId: accountId,
      accountLabel: matchedAccount ? `${matchedAccount.name} (${matchedAccount.holder})` : selectedMethod.replace('_', ' '),
    };

    onConfirmPayment([paymentDetail], advanceData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#0e0e14] border border-zinc-800 shadow-2xl text-white flex flex-col overflow-hidden my-auto max-h-[96vh]">
        {/* Header */}
        <div className="bg-[#14141e] border-b border-zinc-800 p-3.5 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0 ${isAdvance ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'}`} />
            <div>
              <h2 className="font-mono text-xs sm:text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span>{isAdvance ? 'REGISTRAR ADELANTO' : 'COBRAR VENTA'}</span>
                <span className="text-zinc-500">|</span>
                <span className="text-rose-400 font-black text-sm sm:text-lg">
                  Total Venta: S/ {totalAmount.toFixed(2)}
                </span>
              </h2>
              {isAdvance && (
                <span className="text-[10px] font-mono text-amber-300 font-semibold block mt-0.5">
                  ⚡ Cobrando Adelanto: S/ {parsedAdvance.toFixed(2)} • Saldo Pendiente: S/ {pendingBalance.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-none hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
          {/* Toggle: Pago Total vs Con Adelanto */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-2">
              1. Modalidad de Cobro:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleToggleMode(false)}
                className={`py-2.5 px-3 border text-center transition-all cursor-pointer font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 ${
                  !isAdvance
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-[#141420] border-zinc-800 text-zinc-400 hover:text-white hover:bg-[#181826]'
                }`}
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>PAGO COMPLETO (100%): S/ {totalAmount.toFixed(2)}</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleMode(true)}
                className={`py-2.5 px-3 border text-center transition-all cursor-pointer font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 ${
                  isAdvance
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-[#141420] border-zinc-800 text-zinc-400 hover:text-white hover:bg-[#181826]'
                }`}
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>⚡ CON ADELANTO / A CUENTA</span>
              </button>
            </div>
          </div>

          {/* If Adelanto Mode: Selector of Advance Amount */}
          {isAdvance && (
            <div className="bg-[#141424] border border-amber-500/40 p-3.5 sm:p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  Monto del Adelanto (Pago Inicial):
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Total de la Nota: <b>S/ {totalAmount.toFixed(2)}</b>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-amber-400 font-bold text-sm">
                    S/
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={advanceAmountInput}
                    onChange={(e) => {
                      setAdvanceAmountInput(e.target.value);
                      const num = parseFloat(e.target.value) || 0;
                      setReceivedAmount(num.toString());
                      setErrorMessage('');
                    }}
                    className="w-full bg-[#1a1a2e] border-2 border-amber-500/60 focus:border-amber-400 py-2 pl-9 pr-3 text-base font-mono font-black text-amber-300 focus:outline-none"
                    placeholder="Monto adelanto"
                  />
                </div>

                <div className="bg-[#0e0e18] border border-zinc-800 p-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 block">
                      Saldo Pendiente:
                    </span>
                    <span className="font-mono text-base font-black text-rose-400">
                      S/ {pendingBalance.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 max-w-[120px] text-right">
                    Cobro en entrega o previo al envío
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons for Advance */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[9.5px] font-mono uppercase text-zinc-400 font-bold mr-1">
                  Atajos:
                </span>
                <button
                  type="button"
                  onClick={() => handleAdvancePercent(50)}
                  className="bg-[#1e1e30] hover:bg-amber-500/20 text-amber-300 font-mono text-[10.5px] px-2.5 py-1 border border-amber-500/30 font-bold cursor-pointer"
                >
                  50% (S/ {Math.round(totalAmount * 0.5)})
                </button>
                {[20, 30, 40, 50, 70, 100, 150].map((amt) => {
                  if (amt >= totalAmount) return null;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleAdvancePreset(amt)}
                      className="bg-[#1e1e30] hover:bg-zinc-700 text-zinc-200 font-mono text-[10.5px] px-2 py-1 border border-zinc-700 cursor-pointer"
                    >
                      S/ {amt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Method Selection Grid */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-2">
              2. Cuenta Receptora / Método de Pago ({isAdvance ? `Adelanto de S/ ${targetAmountToCollect.toFixed(2)}` : `Total de S/ ${targetAmountToCollect.toFixed(2)}`}):
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

          {/* Payment Detail Section: Cash vs Bank/Digital */}
          {isCash ? (
            <div className="bg-[#141420] border border-zinc-800 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  Cobro en Efectivo {isAdvance ? '(Adelanto en Caja)' : '(Total en Caja)'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Monto a Cobrar: <b className="text-white">S/ {targetAmountToCollect.toFixed(2)}</b>
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
                <div
                  className={`p-3.5 border flex flex-col justify-center ${
                    numReceived >= targetAmountToCollect
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
                    {numReceived >= targetAmountToCollect ? 'Vuelto a Entregar:' : 'Falta por Cobrar:'}
                  </span>
                  <span className="font-mono text-2xl font-black mt-0.5">
                    S/ {Math.abs(numReceived - targetAmountToCollect).toFixed(2)}
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
                    className="bg-[#1e1e2e] hover:bg-zinc-700 text-white font-mono text-xs px-3 py-1.5 border border-zinc-700 cursor-pointer font-bold"
                  >
                    Exacto (S/ {targetAmountToCollect.toFixed(2)})
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
            <div className="bg-[#141420] border border-zinc-800 p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  Datos de la Cuenta Receptora: {selectedMethod.replace('_', ' ')}
                </span>
                <span className="text-xs font-mono text-rose-400 font-bold">
                  Monto a Verificar: S/ {targetAmountToCollect.toFixed(2)}
                </span>
              </div>

              {/* Specialized Bank Cards with 1-click copy */}
              {selectedMethod === 'YAPE' || selectedMethod === 'PLIN' ? (
                <div className="text-xs font-mono bg-[#161624] p-3.5 border border-purple-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Titular de Cuenta:</span>
                    <span className="font-bold text-white">BRYAN MICHAEL REQUENA AVILA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">R.U.C.:</span>
                    <span className="font-bold text-white">10714931062</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Número Yape/Plin:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400 text-sm">904 536 406</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('904536406', 'yape1')}
                        className="p-1 bg-[#202034] hover:bg-zinc-700 text-zinc-300 text-[10px] border border-zinc-700 cursor-pointer"
                        title="Copiar número"
                      >
                        {copiedText === 'yape1' ? '✓ Copiado' : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Número Secundario:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400">924 058 988</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('924058988', 'yape2')}
                        className="p-1 bg-[#202034] hover:bg-zinc-700 text-zinc-300 text-[10px] border border-zinc-700 cursor-pointer"
                        title="Copiar número"
                      >
                        {copiedText === 'yape2' ? '✓ Copiado' : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800">
                    <span>Monto a verificar:</span>
                    <span className="text-emerald-400 font-bold text-sm">S/ {targetAmountToCollect.toFixed(2)}</span>
                  </div>
                </div>
              ) : selectedMethod === 'TRANSFERENCIA_BCP' ? (
                <div className="text-xs font-mono bg-[#161624] p-3.5 border border-orange-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Banco:</span>
                    <span className="font-bold text-orange-400">BANCO DE CRÉDITO DEL PERÚ (BCP)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Titular:</span>
                    <span className="text-white font-bold">BRYAN MICHAEL REQUENA AVILA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">N° de Cuenta Soles:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">191-0014100063-0-53</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('1910014100063053', 'bcp-num')}
                        className="p-1 bg-[#202034] hover:bg-zinc-700 text-zinc-300 text-[10px] border border-zinc-700 cursor-pointer"
                        title="Copiar número de cuenta"
                      >
                        {copiedText === 'bcp-num' ? '✓ Copiado' : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">CCI Interbancario:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 text-[11px]">002-191-0014100063053-53</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('002191001410006305353', 'bcp-cci')}
                        className="p-1 bg-[#202034] hover:bg-zinc-700 text-zinc-300 text-[10px] border border-zinc-700 cursor-pointer"
                        title="Copiar CCI"
                      >
                        {copiedText === 'bcp-cci' ? '✓ Copiado' : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedMethod === 'TRANSFERENCIA_BBVA' ? (
                <div className="text-xs font-mono bg-[#161624] p-3.5 border border-blue-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Banco:</span>
                    <span className="font-bold text-blue-400">BBVA CONTINENTAL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Titular:</span>
                    <span className="text-white font-bold">BRYAN MICHAEL REQUENA AVILA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">N° de Cuenta:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">0011-0175-0200543981</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('001101750200543981', 'bbva-num')}
                        className="p-1 bg-[#202034] hover:bg-zinc-700 text-zinc-300 text-[10px] border border-zinc-700 cursor-pointer"
                        title="Copiar cuenta BBVA"
                      >
                        {copiedText === 'bbva-num' ? '✓ Copiado' : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">CCI Interbancario:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 text-[11px]">011-175-000200543981-74</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('01117500020054398174', 'bbva-cci')}
                        className="p-1 bg-[#202034] hover:bg-zinc-700 text-zinc-300 text-[10px] border border-zinc-700 cursor-pointer"
                        title="Copiar CCI BBVA"
                      >
                        {copiedText === 'bbva-cci' ? '✓ Copiado' : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedMethod === 'TRANSFERENCIA_INTERBANK' ? (
                <div className="text-xs font-mono bg-[#161624] p-3.5 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Banco:</span>
                    <span className="font-bold text-emerald-400">INTERBANK</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Titular:</span>
                    <span className="text-white font-bold">BRYAN MICHAEL REQUENA AVILA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">N° de Cuenta:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">200-3001249821</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('2003001249821', 'ibk-num')}
                        className="p-1 bg-[#202034] hover:bg-zinc-700 text-zinc-300 text-[10px] border border-zinc-700 cursor-pointer"
                        title="Copiar cuenta Interbank"
                      >
                        {copiedText === 'ibk-num' ? '✓ Copiado' : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">CCI Interbancario:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 text-[11px]">003-200-003001249821-39</span>
                      <button
                        type="button"
                        onClick={() => handleCopy('00320000300124982139', 'ibk-cci')}
                        className="p-1 bg-[#202034] hover:bg-zinc-700 text-zinc-300 text-[10px] border border-zinc-700 cursor-pointer"
                        title="Copiar CCI Interbank"
                      >
                        {copiedText === 'ibk-cci' ? '✓ Copiado' : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
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

          {/* Pending Balance Notice */}
          {isAdvance && pendingBalance > 0 && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Quedará un saldo pendiente por cobrar de:</span>
              </span>
              <span className="font-bold font-mono text-sm bg-amber-500/20 px-2 py-0.5 border border-amber-500/40">
                S/ {pendingBalance.toFixed(2)}
              </span>
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
                  ? isAdvance
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/40'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
              }`}
            >
              <Check className="w-4 h-4 shrink-0" />
              {isAdvance ? (
                <>
                  <span className="hidden sm:inline">
                    CONFIRMAR ADELANTO S/ {targetAmountToCollect.toFixed(2)} (SALDO: S/ {pendingBalance.toFixed(2)})
                  </span>
                  <span className="sm:hidden">
                    ADELANTO S/ {targetAmountToCollect.toFixed(2)}
                  </span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    CONFIRMAR COBRO TOTAL & EMITIR TICKET (S/ {totalAmount.toFixed(2)})
                  </span>
                  <span className="sm:hidden">COBRAR S/ {totalAmount.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

