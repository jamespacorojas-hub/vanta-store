import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { Product, SaleProduct } from '../../../types';
import DealProductCard from '../../../components/cards/DealProductCard';

interface OfertasTeaserSectionProps {
  saleProducts: SaleProduct[];
  maxDiscountPct: number;
  favorites: Product[];
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}

// Homepage preview of the Ofertas page — same deal-forward cards, but only a teaser.
// Full browsing (sorting, cross-sell) lives on the dedicated /ofertas page.
export default function OfertasTeaserSection({
  saleProducts,
  maxDiscountPct,
  favorites,
  onQuickView,
  onToggleFavorite,
}: OfertasTeaserSectionProps) {
  const navigate = useNavigate();

  if (saleProducts.length === 0) return null;

  return (
    <section id="homepage-ofertas" className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper text-ink border-t border-line scroll-mt-36">
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 sm:mb-12 border-b border-line pb-4 gap-2">
        <div>
          <span className="text-[9.5px] sm:text-[10px] font-mono tracking-[0.3em] text-muted font-bold uppercase flex items-center gap-1.5">
            <span className="text-accent">✦</span> {saleProducts.length} PRENDAS EN OFERTA // DROP LIMITADO <span className="text-accent">✦</span>
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-ink tracking-tight uppercase mt-1">
            Hasta <span className="text-accent font-mono">-{maxDiscountPct}%</span> de Descuento
          </h2>
        </div>
        <button
          id="explore-ofertas-btn"
          onClick={() => navigate('/ofertas')}
          className="text-xs font-mono tracking-wider text-ink border-b-2 border-accent pb-0.5 hover:text-accent uppercase flex items-center font-bold transition-colors cursor-pointer"
        >
          <span>Ver todas las ofertas</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-accent" />
        </button>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {saleProducts.map((p) => (
          <DealProductCard
            key={p.id}
            product={p}
            discountPct={p.discountPct}
            savingsAmount={p.savingsAmount}
            onQuickView={onQuickView}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.some((f) => f.id === p.id)}
          />
        ))}
      </div>

      {/* Mobile Dynamic Horizontal Glide Rail */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-muted uppercase">
          <span className="font-bold text-ink">Descuentos activos</span>
          <span className="flex items-center gap-1 text-accent font-bold">
            <span>Desliza para ofertas</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 -mx-4 pb-3 pt-1 touch-pan-x">
          {saleProducts.map((p) => (
            <div key={p.id} className="w-[72vw] max-w-[280px] shrink-0 snap-start">
              <DealProductCard
                product={p}
                discountPct={p.discountPct}
                savingsAmount={p.savingsAmount}
                onQuickView={onQuickView}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.some((f) => f.id === p.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
