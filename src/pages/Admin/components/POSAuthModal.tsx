import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldCheck, ArrowRight, Store, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { setPOSAuthenticated } from '../../../utils/posStorage';

interface POSAuthModalProps {
  onSuccess: () => void;
  onExit: () => void;
  theme?: 'dark' | 'light';
}

const DEFAULT_PIN = '3009';
const SELLERS = [
  'Administrador Principal',
  'Caja 01 - Mostrador',
  'Caja 02 - Tienda',
  'Ventas WhatsApp / Envíos',
];

export default function POSAuthModal({ onSuccess, onExit, theme = 'dark' }: POSAuthModalProps) {
  const [pin, setPin] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(SELLERS[0]);
  const [rememberSession, setRememberSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleKeyPress = (digit: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
      setErrorMsg('');
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Default PIN: 3009 o 'admin'
    if (pin === DEFAULT_PIN || pin === '3009' || pin === 'admin') {
      setPOSAuthenticated(rememberSession, selectedSeller);
      onSuccess();
    } else {
      setErrorMsg('PIN incorrecto. (PIN de acceso: 3009)');
      setPin('');
    }
  };

  // Allow keyboard typing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        if (pin.length < 6) {
          setPin((prev) => prev + e.key);
          setErrorMsg('');
        }
      } else if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, selectedSeller, rememberSession]);

  return (
    <div className="fixed inset-0 z-50 bg-[#070709]/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-[#0e0e14] border border-zinc-800 rounded-none shadow-[0_20px_70px_rgba(0,0,0,0.8)] max-h-[96vh] overflow-y-auto text-white flex flex-col my-auto">
        {/* Header */}
        <div className="bg-[#14141e] border-b border-zinc-800 p-4 sm:p-5 text-center relative shrink-0">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-2 sm:mb-3">
            <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-display font-black text-lg sm:text-xl tracking-[0.2em] text-white">VANTA</span>
            <span className="text-[9px] font-mono tracking-widest text-rose-400 border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-bold uppercase">
              POS ADMIN
            </span>
          </div>
          <p className="text-zinc-400 text-[11px] sm:text-xs font-mono tracking-wider mt-1">
            TERMINAL DE NOTAS DE VENTA & CAJA
          </p>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Seller / Cashier selector */}
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5 font-bold">
              Seleccionar Cajero / Vendedor:
            </label>
            <div className="relative">
              <select
                value={selectedSeller}
                onChange={(e) => setSelectedSeller(e.target.value)}
                className="w-full bg-[#161622] border border-zinc-700 text-xs font-mono py-2.5 px-3 text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer"
              >
                {SELLERS.map((s) => (
                  <option key={s} value={s} className="bg-[#14141e] text-white">
                    {s}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* PIN Input Display */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Ingresar PIN de Acceso:
              </label>
              <span className="text-[9px] font-mono text-rose-400/90 font-bold">PIN de acceso: 3009</span>
            </div>

            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                readOnly
                value={pin}
                placeholder="••••"
                className="w-full bg-[#161622] border-2 border-zinc-700 text-center font-mono text-2xl tracking-[0.3em] py-2.5 px-4 text-rose-400 focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                title={showPin ? 'Ocultar' : 'Mostrar'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="mt-2 text-rose-400 text-[11px] font-mono flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 p-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Numeric Touch Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="bg-[#181824] hover:bg-rose-500/20 active:bg-rose-500/40 border border-zinc-800 hover:border-rose-500/40 text-white font-mono text-lg font-bold py-3 transition-colors cursor-pointer"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="bg-[#181824] hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-mono text-xs uppercase font-bold py-3 transition-colors cursor-pointer"
            >
              C
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="bg-[#181824] hover:bg-rose-500/20 border border-zinc-800 text-white font-mono text-lg font-bold py-3 transition-colors cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-[#181824] hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-mono text-xs uppercase font-bold py-3 transition-colors cursor-pointer"
            >
              ⌫
            </button>
          </div>

          {/* Remember check */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="accent-rose-500 w-4 h-4 cursor-pointer"
              />
              <span>Recordar sesión en esta terminal</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onExit}
              className="flex-1 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-mono uppercase tracking-wider py-3 border border-zinc-700 transition-colors cursor-pointer"
            >
              Volver a la Tienda
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold uppercase tracking-wider py-3 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 cursor-pointer"
            >
              <span>Ingresar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
