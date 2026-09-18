import React from 'react';
import { MapPin, Phone, ArrowUpRight } from 'lucide-react';
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
    <footer id="main-footer" className="bg-panel/40 text-ink py-12 sm:py-16 font-sans border-t border-line relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Brand & Social Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-line">
          <div className="flex items-center gap-3.5">
            <img
              src={theme === 'light' ? '/panther-dark.png' : '/panther-white.png'}
              alt="VANTA Panther"
              className="w-12 h-12 rounded-full object-contain drop-shadow-sm shrink-0"
              onError={(e) => {
                e.currentTarget.src = '/logo-oficial.png';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-ink leading-none">
                  VANTA
                </span>
                <span className="text-[10px] font-sans tracking-widest uppercase text-accent font-bold border border-accent/20 bg-accent/10 px-2.5 py-0.5 rounded-full">
                  STUDIO 2026
                </span>
              </div>
              <span className="text-xs font-sans text-muted mt-1 block font-medium">
                High-End Streetwear • Confección Pesada
              </span>
            </div>
          </div>

          {/* Social Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.tiktok.com/@vanta_ptr?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-paper hover:bg-accent hover:text-white text-ink border border-line rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-sm hover:scale-[1.02] group"
            >
              <TikTokIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>TikTok @vanta_ptr</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-white" />
            </a>

            <a
              href="https://wa.me/51904536406"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-paper hover:bg-emerald-600 hover:text-white text-ink border border-line rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-sm hover:scale-[1.02] group"
            >
              <img src="/iconos/whatsapp.jfif" alt="WhatsApp" className="w-4 h-4 object-cover rounded-full transition-transform group-hover:scale-110" />
              <span>WhatsApp Ventas</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* Middle Navigation & Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 py-10">
          {/* Col 1: Manifesto */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-ink font-bold font-heading">
              Manifiesto
            </h3>
            <p className="text-muted text-xs sm:text-sm leading-relaxed font-normal">
              Indumentaria urbana contemporánea con textiles pesados de ingeniería peruana. Siluetas boxy fit, teñido reactivo y confección de resistencia industrial.
            </p>
            <div className="pt-2 text-xs text-muted font-medium">
              <span>Lima, Perú • Despachos a nivel nacional</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-ink font-bold font-heading">
              Navegación
            </h3>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs font-medium text-muted">
              <li>
                <button onClick={() => onSelectCategory('Inicio')} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Nuevos ingresos')} className="hover:text-accent transition-colors cursor-pointer text-left">
                  Nuevos Drops
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Prendas')} className="hover:text-ink transition-colors cursor-pointer text-left">
                  Catálogo
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Ofertas')} className="hover:text-rose-500 transition-colors cursor-pointer text-left font-bold text-rose-500">
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
                  Favoritos
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Location */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-ink font-bold font-heading">
              Atención & Pedidos
            </h3>
            <ul className="space-y-2.5 text-xs text-muted font-normal">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                <span>
                  <strong className="text-ink font-semibold">Centro de Despachos:</strong> San Isidro, Lima.<br />
                  <span className="text-[11px] text-muted">Despachos express en 24-48h</span>
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted shrink-0" />
                <a href="https://wa.me/51904536406" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-accent transition-colors font-semibold">
                  +51 904 536 406
                </a>
              </li>
              <li className="text-xs text-muted pt-1">
                Lunes a Sábado de 09:00 a 22:00
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Methods */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-ink font-bold font-heading">
              Métodos de Pago
            </h3>
            <p className="text-muted text-xs font-normal leading-relaxed">
              Pagos digitales y contra entrega en Lima. Proceso verificado de inmediato.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 select-none">
              {paymentIcons.map((pay) => (
                <span
                  key={pay}
                  className="bg-paper border border-line text-muted font-sans text-[10px] px-3 py-1 rounded-full uppercase font-medium hover:border-accent hover:text-ink transition-colors"
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line & Legal */}
        <div className="border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-3 text-center sm:text-left">
          <span>© 2026 VANTA STUDIO. Confección Pesada en Lima, Perú.</span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:text-rose-300 transition-colors font-bold uppercase"
            >
              <span>Terminal POS ↗</span>
            </a>
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="hover:text-ink transition-colors cursor-pointer text-accent font-bold uppercase"
              >
                Tema: {theme === 'dark' ? 'Modo Claro ☼' : 'Modo Oscuro ☾'}
              </button>
            )}
            <a href="#terminos" className="hover:text-ink transition-colors">Términos</a>
            <a href="#cambios" className="hover:text-ink transition-colors">Cambios</a>
            <a href="#envios" className="hover:text-ink transition-colors">Envíos</a>
            <a href="#privacidad" className="hover:text-ink transition-colors">Privacidad</a>
            <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
