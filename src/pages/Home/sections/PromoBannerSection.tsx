import React from 'react';
import { Tag } from 'lucide-react';
import { Product } from '../../../types';

interface PromoBannerSectionProps {
  promotionalProduct: Product;
  onQuickView: (product: Product) => void;
}

export default function PromoBannerSection({ promotionalProduct, onQuickView }: PromoBannerSectionProps) {
  return (
    <section id="homepage-promo-banner" className="bg-panel border-y border-line">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
        {/* Left Promo text */}
        <div className="p-8 sm:p-16 lg:p-24 flex flex-col justify-center space-y-6">
          <div className="inline-flex self-start items-center space-x-1.5 border border-accent/30 bg-accent-soft px-3 py-1 text-[9px] tracking-[0.2em] uppercase rounded-none text-accent">
            <Tag className="w-3.5 h-3.5" />
            <span>Oferta limitada de temporada</span>
          </div>
          <h3 className="font-display text-3xl sm:text-4xl font-medium text-ink leading-tight">
            {promotionalProduct.name}
          </h3>
          <p className="text-muted text-xs sm:text-sm font-light leading-relaxed max-w-md">
            Aprovecha nuestra promoción destacada. Esta prenda premium streetwear de alta costura urbana ahora cuenta con precio preferencial. Incluye detalles reflectivos y estampado industrial.
          </p>
          <div className="flex items-baseline space-x-3">
            <span className="font-mono text-xl sm:text-2xl font-black text-ink">S/. {promotionalProduct.price.toFixed(2)}</span>
            {promotionalProduct.oldPrice && (
              <span className="font-mono text-sm text-muted line-through">S/. {promotionalProduct.oldPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            id="promo-cta-buy-btn"
            onClick={() => onQuickView(promotionalProduct)}
            className="bg-ink text-paper-soft hover:bg-accent text-xs font-bold uppercase tracking-widest py-4 px-8 self-start transition-all"
          >
            Comprar prenda en detalle
          </button>
        </div>

        {/* Right Promo photo - Typographic layout (0 images) */}
        <div className="aspect-square sm:aspect-auto h-[350px] sm:h-auto overflow-hidden bg-paper-soft border-l border-line select-none p-8 flex flex-col justify-between text-ink relative">
          <div className="flex justify-between items-start z-10 text-[9px] text-muted uppercase tracking-wide">
            <span>Mont Store</span>
            <span>Precio exclusivo</span>
          </div>

          <div className="z-10 text-center my-auto space-y-2">
            <span className="text-[9px] text-muted uppercase tracking-widest block">Pieza de confección seleccionada</span>
            <h4 className="font-display text-4xl sm:text-5xl font-medium text-ink">
              {promotionalProduct.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </h4>
            <p className="text-[10px] text-muted uppercase tracking-widest block">
              Categoría: {promotionalProduct.category}
            </p>
            <p className="text-[8px] text-muted max-w-xs mx-auto uppercase tracking-wide">
              Tejidos: {promotionalProduct.fabrics.join(' / ')}
            </p>
          </div>

          <div className="z-10 border-t border-line pt-4 flex justify-between items-center text-[9px] text-muted uppercase tracking-wide">
            <span>Disponibilidad: alta demanda</span>
            <span className="font-mono">Stock: {promotionalProduct.stock} unidades</span>
          </div>
        </div>
      </div>
    </section>
  );
}
