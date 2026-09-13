import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  FileText,
  DollarSign,
  Package,
  Lock,
  LogOut,
  Store,
  Sun,
  Moon,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { isPOSAuthenticated, clearPOSAuthentication, getActiveSeller } from '../../utils/posStorage';
import POSAuthModal from './components/POSAuthModal';
import POSTerminal from './components/POSTerminal';
import POSSalesHistory from './components/POSSalesHistory';
import POSCashRegister from './components/POSCashRegister';
import POSInventoryView from './components/POSInventoryView';

type POSTab = 'TERMINAL' | 'HISTORIAL' | 'CAJA' | 'STOCK';

interface AdminPOSPageProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export default function AdminPOSPage({ theme = 'dark', onToggleTheme }: AdminPOSPageProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isPOSAuthenticated());
  const [activeTab, setActiveTab] = useState<POSTab>('TERMINAL');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Clock in header
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    clearPOSAuthentication();
    setIsAuthenticated(false);
  };

  const handleExitToStore = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-paper text-ink overflow-hidden select-none font-sans">
      {/* If not authenticated, show PIN Login Modal */}
      {!isAuthenticated && (
        <POSAuthModal
          onSuccess={() => setIsAuthenticated(true)}
          onExit={handleExitToStore}
          theme={theme}
        />
      )}

      {/* POS Top Header Bar */}
      <header className="h-14 sm:h-16 bg-[#09090e] text-white border-b border-zinc-800 px-3 sm:px-5 flex items-center justify-between shrink-0 shadow-md">
        {/* Left: Brand and Environment */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/panther-white.png"
              alt="VANTA"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-contain shrink-0"
              onError={(e) => {
                e.currentTarget.src = '/logo-oficial.png';
              }}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-sm sm:text-base tracking-[0.2em] text-white leading-none">
                  VANTA
                </span>
                <span className="text-[8px] font-mono tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.5 font-bold uppercase">
                  POS v2.4
                </span>
              </div>
              <span className="text-[8px] font-mono text-zinc-400 tracking-wider uppercase mt-0.5">
                TERMINAL DE VENTAS & MOSTRADOR
              </span>
            </div>
          </div>
        </div>

        {/* Center: Module Tab Switcher */}
        <nav className="hidden md:flex items-center gap-1 bg-[#12121c] p-1 border border-zinc-800">
          <button
            onClick={() => setActiveTab('TERMINAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'TERMINAL'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>1. Mostrador (POS)</span>
          </button>

          <button
            onClick={() => setActiveTab('HISTORIAL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'HISTORIAL'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Historial Ventas</span>
          </button>

          <button
            onClick={() => setActiveTab('CAJA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'CAJA'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>3. Arqueo Caja</span>
          </button>

          <button
            onClick={() => setActiveTab('STOCK')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'STOCK'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>4. Stock & Precios</span>
          </button>
        </nav>

        {/* Right: Cashier Info, Theme, Lock & Exit */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Clock */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-zinc-300 bg-[#12121c] px-2.5 py-1.5 border border-zinc-800">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>{currentTime}</span>
          </div>

          {/* Active Cashier */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-300 bg-[#12121c] px-2.5 py-1.5 border border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[120px] font-bold">{getActiveSeller()}</span>
          </div>

          {/* Theme Switcher */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-1.5 sm:p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors cursor-pointer"
              title="Cambiar tema claro / oscuro"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-300" />
              )}
            </button>
          )}

          {/* Lock Terminal */}
          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 text-zinc-300 hover:text-rose-400 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono"
            title="Bloquear Terminal / Cerrar Sesión"
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Bloquear</span>
          </button>

          {/* Return to Online Store */}
          <button
            onClick={handleExitToStore}
            className="bg-zinc-800 hover:bg-zinc-700 text-white p-1.5 sm:px-3 sm:py-2 border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold"
            title="Volver a la Tienda Online"
          >
            <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
            <span className="hidden sm:inline">Ver Tienda</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="md:hidden grid grid-cols-4 gap-1 bg-[#0b0b12] border-b border-zinc-800 p-1 shrink-0">
        <button
          onClick={() => setActiveTab('TERMINAL')}
          className={`flex items-center justify-center gap-1 py-2 px-1 text-[10px] font-mono uppercase tracking-wider text-center transition-colors cursor-pointer ${
            activeTab === 'TERMINAL' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3 h-3 shrink-0" />
          <span>POS</span>
        </button>
        <button
          onClick={() => setActiveTab('HISTORIAL')}
          className={`flex items-center justify-center gap-1 py-2 px-1 text-[10px] font-mono uppercase tracking-wider text-center transition-colors cursor-pointer ${
            activeTab === 'HISTORIAL' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FileText className="w-3 h-3 shrink-0" />
          <span>Ventas</span>
        </button>
        <button
          onClick={() => setActiveTab('CAJA')}
          className={`flex items-center justify-center gap-1 py-2 px-1 text-[10px] font-mono uppercase tracking-wider text-center transition-colors cursor-pointer ${
            activeTab === 'CAJA' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3 h-3 shrink-0" />
          <span>Arqueo</span>
        </button>
        <button
          onClick={() => setActiveTab('STOCK')}
          className={`flex items-center justify-center gap-1 py-2 px-1 text-[10px] font-mono uppercase tracking-wider text-center transition-colors cursor-pointer ${
            activeTab === 'STOCK' ? 'bg-rose-600 text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Package className="w-3 h-3 shrink-0" />
          <span>Stock</span>
        </button>
      </div>

      {/* Body / Active Tab View */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'TERMINAL' && <POSTerminal />}
        {activeTab === 'HISTORIAL' && <POSSalesHistory />}
        {activeTab === 'CAJA' && <POSCashRegister />}
        {activeTab === 'STOCK' && <POSInventoryView />}
      </main>
    </div>
  );
}
