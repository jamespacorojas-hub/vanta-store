import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';
import { Product, SaleProduct } from '../../../types';
import DealProductCard from '../../../components/cards/DealProductCard';

interface OfertasTeaserSectionProps {
  saleProducts: SaleProduct[];
  maxDiscountPct: number;
  favorites: Product[];
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}

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
    <section id="homepage-ofertas" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper text-ink border-t border-line scroll-mt-36">
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 sm:mb-12 border-b border-line pb-5 gap-3">
        <div>
          <span className="text-[10px] sm:text-xs font-sans tracking-widest text-muted font-bold uppercase flex items-center gap-2">
            <Flame className="w-4 h-4 text-accent" />
            {saleProducts.length} PRENDAS EN OFERTA • DROP LIMITADO
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight uppercase mt-1.5">
            Hasta <span className="text-accent font-sans">-{maxDiscountPct}%</span> de Descuento
          </h2>
        </div>
        <button
          id="explore-ofertas-btn"
          onClick={() => navigate('/ofertas')}
          className="bg-panel hover:bg-paper-soft text-ink border border-line hover:border-accent/40 text-xs font-semibold py-2.5 px-5 rounded-full uppercase flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
        >
          <span>Ver todas las ofertas</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent" />
        </button>
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="sm:hidden space-y-3">
        <div className="flex items-center justify-between px-1 text-xs font-sans text-muted uppercase">
          <span className="font-bold text-ink">Descuentos activos</span>
          <span className="flex items-center gap-1.5 text-accent font-semibold">
            <span>Desliza para ofertas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 -mx-4 pb-4 pt-1 touch-pan-x">
          {saleProducts.map((p) => (
            <div key={p.id} className="w-[74vw] max-w-[290px] shrink-0 snap-start">
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
