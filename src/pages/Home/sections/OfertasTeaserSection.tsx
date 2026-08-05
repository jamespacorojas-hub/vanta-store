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
    <section id="homepage-ofertas" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper border-t border-line scroll-mt-48">
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 border-b border-line pb-4 gap-3">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-muted font-bold uppercase flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> {saleProducts.length} prendas en oferta ahora
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink">
            Hasta -{maxDiscountPct}% de descuento
          </h2>
        </div>
        <button
          id="explore-ofertas-btn"
          onClick={() => navigate('/ofertas')}
          className="text-xs tracking-wider text-ink border-b border-accent pb-1 hover:text-accent uppercase flex items-center font-bold"
        >
          Ver todas las ofertas <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </section>
  );
}
