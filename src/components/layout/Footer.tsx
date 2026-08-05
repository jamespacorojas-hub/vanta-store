import React from 'react';
import { MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenWishlist: () => void;
}

export default function Footer({ onSelectCategory, onOpenWishlist }: FooterProps) {
  const paymentIcons = [
    'YAPE',
    'PLIN',
    'BCP',
    'BBVA',
    'INTERBANK',
    'CONTRA ENTREGA',
  ];

  return (
    <footer id="main-footer" className="bg-ink text-paper py-14 sm:py-20 font-sans border-t border-paper/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-tighter text-paper">
                MONT STORE
              </span>
              <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-paper/50">
                STREETWEAR EDITORIAL
              </span>
            </div>
            <p className="text-paper/60 text-xs leading-relaxed font-light">
              La marca de ropa urbana independiente que define la estética de la calle contemporánea en Lima. Diseños exclusivos y confección pesada de alta durabilidad.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-paper/80 font-bold">NUESTRO MENÚ</h3>
            <ul className="space-y-2 text-xs text-paper/60">
              <li>
                <button onClick={() => onSelectCategory('Inicio')} className="hover:text-accent-soft transition-colors uppercase">
                  INICIO / COLECCIÓN COMPLETA
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Nuevos ingresos')} className="hover:text-accent-soft transition-colors uppercase">
                  NUEVOS INGRESOS
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Prendas')} className="hover:text-accent-soft transition-colors uppercase">
                  CATÁLOGO DE PRENDAS
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Ofertas')} className="hover:text-accent-soft transition-colors uppercase">
                  OFERTAS ESPECIALES
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Polo')} className="hover:text-accent-soft transition-colors uppercase">
                  POLOS BOXY FIT
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('Polera')} className="hover:text-accent-soft transition-colors uppercase">
                  POLERAS
                </button>
              </li>
              <li>
                <button onClick={onOpenWishlist} className="hover:text-accent-soft transition-colors uppercase">
                  LISTA DE FAVORITOS
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-paper/80 font-bold">CONTACTO & UBICACIÓN</h3>
            <ul className="space-y-3.5 text-xs text-paper/60 font-sans font-light">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-paper/70 shrink-0 mt-0.5" />
                <span>
                  <b>Almacén Central:</b> San Isidro, Lima, Perú.<br />
                  <span className="text-[10px] text-paper/45">(Solo despachos online a nivel nacional)</span>
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-paper/70" />
                <a href="https://wa.me/51904536406" target="_blank" rel="noopener noreferrer" className="hover:text-accent-soft transition-colors font-mono">
                  +51 904 536 406
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment and Policies info */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-paper/80 font-bold">MÉTODOS DE PAGO</h3>
            <p className="text-paper/60 text-xs font-light leading-relaxed">
              Aceptamos pagos directos y envíos contra entrega para Lima Metropolitana. Procesos validados de inmediato.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1.5 select-none">
              {paymentIcons.map((pay) => (
                <span
                  key={pay}
                  className="bg-paper/5 border border-paper/15 text-paper/60 font-mono text-[9px] px-2 py-1 tracking-wider uppercase font-semibold"
                >
                  {pay}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-paper/10 mt-14 sm:mt-18 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-paper/45 space-y-4 sm:space-y-0">
          <span>© 2026 MONT STORE LIMA. TODOS LOS DERECHOS RESERVADOS.</span>
          <div className="flex space-x-6">
            <a href="#faq-and-policies" className="hover:text-accent-soft transition-colors">POLÍTICAS DE COMPRA</a>
            <a href="#faq-and-policies" className="hover:text-accent-soft transition-colors">CAMBIOS Y DEVOLUCIONES</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
