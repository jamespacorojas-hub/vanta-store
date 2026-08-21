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
    <section id="featured-homepage-products" className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper text-ink scroll-mt-36">
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 sm:mb-12 border-b border-line pb-4 gap-2">
        <div>
          <span className="text-[9.5px] sm:text-[10px] font-mono tracking-[0.3em] text-muted font-bold uppercase flex items-center gap-1.5">
            <span className="text-accent">✦</span> PIEZAS ESENCIALES // DROP 2026 <span className="text-accent">✦</span>
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-ink tracking-tight uppercase mt-1">
            Básicos de Confección Pesada
          </h2>
        </div>
        <button
          id="explore-full-catalogue-btn"
          onClick={onExploreCatalog}
          className="text-xs font-mono tracking-wider text-ink border-b-2 border-accent pb-0.5 hover:text-accent uppercase flex items-center mt-1 sm:mt-0 font-bold transition-colors cursor-pointer"
        >
          <span>Ver todo el catálogo</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-accent" />
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
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 text-[10px] font-mono text-muted uppercase">
            <span className="font-bold text-ink">Colección en tendencia</span>
            <span className="flex items-center gap-1 text-accent font-bold">
              <span>Desliza para explorar</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 -mx-4 pb-3 pt-1 touch-pan-x">
            {featuredProducts.slice(1).map((p, i) => (
              <div key={p.id} className="w-[72vw] max-w-[280px] shrink-0 snap-start">
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
