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
    <section id="featured-homepage-products" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper scroll-mt-48">
      <div className="flex flex-col sm:flex-row items-baseline justify-between mb-12 border-b border-line pb-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] text-muted font-bold uppercase block">Productos destacados</span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink">Piezas esenciales</h2>
        </div>
        <button
          id="explore-full-catalogue-btn"
          onClick={onExploreCatalog}
          className="text-xs tracking-wider text-ink border-b border-accent pb-1 hover:text-accent uppercase flex items-center mt-2 sm:mt-0 font-bold"
        >
          Ver todo el catálogo <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
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
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
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
    </section>
  );
}
