import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  FileText,
  DollarSign,
  Package,
  Lock,
  Store,
  Sun,
  Moon,
  ShieldCheck,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Clock3,
  RefreshCw,
  BarChart3,
  Settings,
  ChevronsUpDown,
  LayoutGrid,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { isPOSAuthenticated, clearPOSAuthentication, getActiveSeller } from '../../utils/posStorage';
import POSAuthModal from './components/POSAuthModal';
import POSTerminal from './components/POSTerminal';
import POSSalesHistory from './components/POSSalesHistory';
import POSCashRegister from './components/POSCashRegister';
import POSInventoryView from './components/POSInventoryView';

type POSTab = 'TERMINAL' | 'HISTORIAL' | 'CAJA' | 'STOCK' | 'PANEL' | 'NOVEDADES';

interface AdminPOSPageProps {
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export default function AdminPOSPage({ theme = 'dark', onToggleTheme }: AdminPOSPageProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isPOSAuthenticated());
  
  // Default to HISTORIAL (Cobranzas) if path is /cobranzas or /finanzas
  const [activeTab, setActiveTab] = useState<POSTab>(() => {
    if (window.location.pathname.includes('cobranzas') || window.location.pathname.includes('finanzas')) {
      return 'HISTORIAL';
    }
    return 'HISTORIAL'; // Default to Cobranzas to showcase the exact screen
  });

  const [isFinanzasOpen, setIsFinanzasOpen] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Clock
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
    <div className="fixed inset-0 z-50 flex bg-[#0c0d14] text-zinc-100 overflow-hidden select-none font-sans">
      {/* If not authenticated, show PIN Login Modal */}
      {!isAuthenticated && (
        <POSAuthModal
          onSuccess={() => setIsAuthenticated(true)}
          onExit={handleExitToStore}
          theme={theme}
        />
      )}

      {/* ── LEFT SIDEBAR (Matching user's screenshot) ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0c0d14] border-r border-[#1a1c29] flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          {/* Logo / Brand Header */}
          <div className="h-14 px-4 border-b border-[#1a1c29] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-rose-600 flex items-center justify-center font-display font-black text-white text-xs tracking-wider shadow-sm">
                V
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-sm tracking-[0.2em] text-white leading-none">
                  VANTA
                </span>
                <span className="text-[8.5px] font-mono tracking-wider text-rose-400 mt-0.5 uppercase">
                  SISTEMA DE GESTIÓN
                </span>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-6">
            {/* 1. GENERAL SECTION */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold px-2 block mb-1.5">
                GENERAL
              </span>

              <button
                onClick={() => {
                  setActiveTab('TERMINAL');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-sans rounded-md transition-colors cursor-pointer ${
                  activeTab === 'TERMINAL'
                    ? 'bg-[#181b2a] text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-zinc-400" />
                <span>Panel Mostrador (POS)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('NOVEDADES');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-sans rounded-md transition-colors cursor-pointer ${
                  activeTab === 'NOVEDADES'
                    ? 'bg-[#181b2a] text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-zinc-400" />
                <span>Novedades</span>
              </button>

              <a
                href="/catalogo-interactivo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-sans rounded-md transition-colors text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20"
                title="Abrir Catálogo Interactivo externo para clientes"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  <span className="font-semibold">Catálogo Interactivo</span>
                </div>
                <ExternalLink className="w-3 h-3 text-rose-400" />
              </a>
            </div>

            {/* 2. FINANZAS Y TESORERÍA (From Screenshot) */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold px-2 block mb-1.5">
                FINANZAS Y TESORERÍA
              </span>

              {/* Collapsible Ingresos */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsFinanzasOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-sans text-zinc-300 hover:text-white rounded-md hover:bg-zinc-900/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-teal-400" />
                    <span className="font-semibold text-zinc-200">Ingresos</span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                      isFinanzasOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>

                {/* Sub-items */}
                {isFinanzasOpen && (
                  <div className="ml-3 pl-3 border-l border-zinc-800 space-y-0.5 mt-1">
                    <button
                      onClick={() => {
                        setActiveTab('TERMINAL');
                        setIsMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 rounded transition-colors text-left"
                    >
                      <Clock3 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Ventas Pendientes</span>
                    </button>

                    {/* COBRANZAS (Active Highlight as in Screenshot) */}
                    <button
                      onClick={() => {
                        setActiveTab('HISTORIAL');
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-all text-left relative ${
                        activeTab === 'HISTORIAL'
                          ? 'bg-[#161a29] text-sky-400 font-semibold before:absolute before:left-[-13px] before:top-1 before:bottom-1 before:w-1 before:bg-sky-400 before:rounded-r'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Cobranzas</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('HISTORIAL');
                        setIsMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 rounded transition-colors text-left"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Cambios Voluntarios</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('CAJA');
                        setIsMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 rounded transition-colors text-left"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Ingreso Bruto</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Extra Operations */}
              <button
                onClick={() => {
                  setActiveTab('CAJA');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-sans rounded-md transition-colors cursor-pointer ${
                  activeTab === 'CAJA'
                    ? 'bg-[#181b2a] text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <DollarSign className="w-4 h-4 text-zinc-400" />
                <span>Arqueo de Caja</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('STOCK');
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-sans rounded-md transition-colors cursor-pointer ${
                  activeTab === 'STOCK'
                    ? 'bg-[#181b2a] text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-zinc-400" />
                  <span>Stock & Fotos WhatsApp</span>
                </div>
                <span className="text-[9px] font-mono bg-rose-600/20 text-rose-400 px-1.5 py-0.5 rounded font-bold border border-rose-500/30">
                  FOTOS
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom User Profile Section (Matching Screenshot) */}
        <div className="p-3 border-t border-[#1a1c29] space-y-2 shrink-0">
          <button
            onClick={() => handleExitToStore()}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white rounded hover:bg-zinc-900/50 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configuración</span>
          </button>

          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#141624] border border-[#1e2238]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-teal-900/80 border border-teal-500/40 text-teal-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                V2
              </div>
              <div className="min-w-0">
                <div className="font-sans font-bold text-xs text-zinc-200 truncate">
                  Validador 2
                </div>
                <div className="text-[9.5px] font-mono text-zinc-400 truncate">
                  Validador-Pagos (VANTA)
                </div>
              </div>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              onClick={handleExitToStore}
              className="text-[11px] text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Store className="w-3 h-3" /> Ver Tienda
            </button>
            <button
              onClick={handleLogout}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
            >
              <Lock className="w-3 h-3" /> Bloquear
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT STAGE ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Mobile Header Toggle */}
        <div className="md:hidden h-12 bg-[#0c0d14] border-b border-[#1a1c29] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-display font-black text-sm tracking-wider text-white">VANTA</span>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            {currentTime}
          </div>
        </div>

        {/* Dynamic View rendering */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'HISTORIAL' && <POSSalesHistory />}
          {activeTab === 'TERMINAL' && <POSTerminal />}
          {activeTab === 'CAJA' && <POSCashRegister />}
          {activeTab === 'STOCK' && <POSInventoryView />}
          {activeTab === 'NOVEDADES' && (
            <div className="p-8 text-center text-zinc-400 space-y-3 max-w-md mx-auto my-auto">
              <Sparkles className="w-8 h-8 text-rose-500 mx-auto" />
              <h2 className="text-lg font-bold text-white uppercase">Novedades VANTA POS v2.4</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Módulo de Cobranzas integrado con generación automática de pedidos cada 3 horas y cuadros de productos compactos para venta ágil.
              </p>
              <button
                onClick={() => setActiveTab('HISTORIAL')}
                className="bg-accent text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider"
              >
                Ir a Cobranzas
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
