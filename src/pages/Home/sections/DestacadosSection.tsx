import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../../../types';
import ProductCard from '../../../components/cards/ProductCard';
import FeaturedSpotlightCard from '../../../components/cards/FeaturedSpotlightCard';

interface DestacadosSectionProps {
  featuredProducts: Product[];
  favorites: Product[];
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  onExploreCatalog: () => void;
}

export default function DestacadosSection({
  featuredProducts,
  favorites,
  onQuickView,
  onToggleFavorite,
  onExploreCatalog,
}: DestacadosSectionProps) {
  return (
    <section id="featured-homepage-products" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper text-ink scroll-mt-36">
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 sm:mb-12 border-b border-line pb-5 gap-3">
        <div>
          <span className="text-[10px] sm:text-xs font-sans tracking-widest text-muted font-bold uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            PIEZAS ESENCIALES • DROP 2026
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight uppercase mt-1.5">
            Básicos de Confección Pesada
          </h2>
        </div>
        <button
          id="explore-full-catalogue-btn"
          onClick={onExploreCatalog}
          className="bg-panel hover:bg-paper-soft text-ink border border-line hover:border-accent/40 text-xs font-semibold py-2.5 px-5 rounded-full uppercase flex items-center gap-2 transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
        >
          <span>Ver todo el catálogo</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent" />
        </button>
      </div>

      {/* Desktop View (5 Cols Grid) */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-6 items-start">
        {featuredProducts[0] && (
          <div className="lg:col-span-2">
            <FeaturedSpotlightCard
              product={featuredProducts[0]}
              onQuickView={onQuickView}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.some((f) => f.id === featuredProducts[0].id)}
            />
          </div>
        )}
        <div className="lg:col-span-3 grid grid-cols-2 xl:grid-cols-3 gap-5">
          {featuredProducts.slice(1).map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              rank={i + 2}
              onQuickView={onQuickView}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.some((f) => f.id === p.id)}
            />
          ))}
        </div>
      </div>

      {/* Mobile & Tablet Dynamic View: Spotlight Hero + Fluid Horizontal Glide Rail */}
      <div className="lg:hidden space-y-6">
        {featuredProducts[0] && (
          <FeaturedSpotlightCard
            product={featuredProducts[0]}
            onQuickView={onQuickView}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favorites.some((f) => f.id === featuredProducts[0].id)}
          />
        )}

        {/* Dynamic Horizontal Carousel Rail */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 text-xs font-sans text-muted uppercase">
            <span className="font-bold text-ink">Colección en tendencia</span>
            <span className="flex items-center gap-1.5 text-accent font-semibold">
              <span>Desliza para explorar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 -mx-4 pb-4 pt-1 touch-pan-x">
            {featuredProducts.slice(1).map((p, i) => (
              <div key={p.id} className="w-[74vw] max-w-[290px] shrink-0 snap-start">
                <ProductCard
                  product={p}
                  rank={i + 2}
                  onQuickView={onQuickView}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.some((f) => f.id === p.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
