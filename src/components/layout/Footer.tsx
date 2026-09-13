import React from 'react';
import { MapPin, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import TikTokIcon from '../shared/TikTokIcon';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenWishlist: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export default function Footer({ onSelectCategory, onOpenWishlist, theme = 'dark', onToggleTheme }: FooterProps) {
  const paymentIcons = [
    'YAPE',
    'PLIN',
    'BCP',
    'BBVA',
    'INTERBANK',
    'CONTRA ENTREGA',
  ];

  return (
    <footer id="main-footer" className="bg-paper-soft text-ink py-12 sm:py-16 font-sans border-t border-line relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Brand & Social Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-line">
          <div className="flex items-center gap-3.5">
            <img
              src={theme === 'light' ? '/panther-dark.png' : '/panther-white.png'}
              alt="VANTA Panther"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain drop-shadow-sm shrink-0"
              onError={(e) => {
                e.currentTarget.src = '/logo-oficial.png';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl sm:text-3xl tracking-[0.22em] text-ink leading-none">
                  VANTA
                </span>
                <span className="text-[7.5px] font-mono tracking-[0.3em] uppercase text-muted font-bold border border-line bg-panel px-2 py-0.5">
                  ATELIER
                </span>
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.35em] uppercase text-muted mt-1 flex items-center gap-1 font-semibold">
                <span className="text-rose-500 font-bold">†</span> HIGH-END STREETWEAR <span className="text-rose-500 font-bold">†</span>
              </span>
            </div>
          </div>

          {/* Social Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="https://www.tiktok.com/@vanta_ptr?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-panel hover:bg-accent hover:text-white text-ink border border-line px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-300 shadow-sm group"
            >
              <TikTokIcon className="w-4 h-4 transition-transform group-hover:scale-115" />
              <span>TIKTOK @vanta_ptr</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-white" />
            </a>

            <a
              href="https://wa.me/51904536406"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-panel hover:bg-emerald-600 hover:text-white text-ink border border-line px-4 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-300 shadow-sm group"
            >
              <img src="/iconos/whatsapp.jfif" alt="WhatsApp" className="w-4 h-4 object-cover rounded-full transition-transform group-hover:scale-110" />
              <span>WHATSAPP VENTAS</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* Middle Navigation & Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 py-10">
          {/* Col 1: Manifesto */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted font-bold flex items-center gap-1.5">
              <span className="text-rose-500">◈</span> MANIFIESTO
            </h3>
            <p className="text-muted text-xs leading-relaxed font-light font-sans">
              Indumentaria urbana contemporánea con textiles pesados de ingeniería peruana. Siluetas boxy fit, teñido reactivo y confección de resistencia industrial.
            </p>
            <div className="pt-2 text-[10px] font-mono text-muted">
              <span>LIMA, PERÚ • DESPACHOS A NIVEL NACIONAL</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (Clean 2-column or list) */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted font-bold flex items-center gap-1.5">
              <span className="text-rose-500">◈</span> NAVEGACIÓN
            </h3>
            <ul className="grid grid-cols-2 gap-x-2 gap-y-2 text-[11px] font-mono uppercase text-muted">
              <li>
                <button onClick={() => onSelectCategory('Inicio')} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Nuevos ingresos')} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Nuevos Drops ✦
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Prendas')} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Catálogo
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Ofertas')} className="hover:text-ink transition-colors cursor-pointer text-left text-rose-500 font-bold">
                  Ofertas %
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Polera')} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Poleras
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Camisa')} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Camisas
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Camisero')} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Camiseros
                </button>
              </li>
              <li>
                <button onClick={onOpenWishlist} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Favoritos ♡
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Location */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted font-bold flex items-center gap-1.5">
              <span className="text-rose-500">◈</span> ATENCIÓN & PEDIDOS
            </h3>
            <ul className="space-y-2.5 text-xs text-muted font-sans font-light">
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
                <span>
                  <b className="text-ink font-mono text-[11px]">Centro de Envíos:</b> San Isidro, Lima.<br />
                  <span className="text-[10px] text-muted">(Despachos express 24-48h)</span>
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-muted shrink-0" />
                <a href="https://wa.me/51904536406" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-rose-500 transition-colors font-mono text-xs font-semibold">
                  +51 904 536 406
                </a>
              </li>
              <li className="text-[10px] font-mono text-muted pt-1">
                Horario: Lunes a Sábado de 09:00 a 22:00
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Methods */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted font-bold flex items-center gap-1.5">
              <span className="text-rose-500">◈</span> MÉTODOS DE PAGO
            </h3>
            <p className="text-muted text-xs font-light leading-relaxed font-sans">
              Pagos digitales y contra entrega en Lima. Proceso verificado de inmediato.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 select-none">
              {paymentIcons.map((pay) => (
                <span
                  key={pay}
                  className="bg-panel border border-line text-muted font-mono text-[8.5px] px-2.5 py-1 tracking-wider uppercase font-semibold hover:border-accent hover:text-ink transition-colors"
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line & Legal */}
        <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-muted gap-3 text-center sm:text-left">
          <span>© 2026 VANTA STREETWEAR LIMA. TODOS LOS DERECHOS RESERVADOS.</span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:text-rose-300 transition-colors font-bold uppercase flex items-center gap-1"
            >
              <span>◈ TERMINAL POS (ADMIN) ↗</span>
            </a>
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="hover:text-ink transition-colors cursor-pointer text-accent font-bold uppercase"
              >
                MODO: {theme === 'dark' ? 'CLARO ☼' : 'OSCURO ☾'}
              </button>
            )}
            <a href="#terminos" className="hover:text-ink transition-colors">TÉRMINOS</a>
            <a href="#cambios" className="hover:text-ink transition-colors">CAMBIOS</a>
            <a href="#envios" className="hover:text-ink transition-colors">ENVÍOS</a>
            <a href="#privacidad" className="hover:text-ink transition-colors">PRIVACIDAD</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
