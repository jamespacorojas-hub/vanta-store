import React from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { getColorClass } from '../../utils/colorSwatch';

interface FeaturedSpotlightCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
}

// The #1 curated pick — an editorial "hero of the ranking" tile, always-on actions
// (no hover-reveal) since it anchors the Destacados grid on both desktop and mobile.
export default function FeaturedSpotlightCard({
  product,
  onQuickView,
  onToggleFavorite,
  isFavorite,
}: FeaturedSpotlightCardProps) {
  return (
    <div
      id={`spotlight-card-${product.id}`}
      className="group flex flex-col h-full bg-paper-soft border border-accent/30"
    >
      {/* Product Photo Stage */}
      <div className="relative flex-1 min-h-[280px] sm:min-h-[380px] bg-panel p-6 sm:p-8 flex flex-col justify-between text-ink border-b border-line overflow-hidden">
        <img
          src={product.images[0]}
          alt={`${product.name} - ${product.colors[0]}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/10 to-ink/70 pointer-events-none" />

        {/* Rank marker */}
        <div className="flex items-start justify-between z-10">
          <div className="space-y-0.5">
            <span className="font-display text-4xl sm:text-5xl font-medium text-accent leading-none drop-shadow">N.º 01</span>
            <span className="text-[9px] tracking-[0.25em] text-paper-soft uppercase font-bold block drop-shadow">Más vendido esta temporada</span>
          </div>
          <button
            id={`spotlight-favorite-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className={`p-1.5 rounded-none transition-all duration-300 shrink-0 ${
              isFavorite
                ? 'bg-ink text-paper-soft border border-ink'
                : 'bg-paper-soft/60 text-ink hover:bg-paper-soft border border-line'
            }`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category / fabric tag */}
        <div className="flex flex-col items-center justify-center my-auto z-10 space-y-1 text-center py-6">
          <span className="text-xs tracking-[0.15em] text-paper-soft uppercase pt-1 drop-shadow">{product.category}</span>
          <span className="text-[10px] tracking-wide text-paper-soft/80 uppercase drop-shadow">{product.fabrics.join(' / ')}</span>
        </div>

        {/* Curator note */}
        <p className="text-[11px] sm:text-xs text-paper-soft/90 italic leading-relaxed max-w-md mx-auto text-center z-10 line-clamp-2 drop-shadow">
          "{product.description}"
        </p>
      </div>

      {/* Info + always-visible actions */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col font-sans">
        <div className="flex gap-1.5 mb-2 flex-wrap">
          {product.colors.map((color) => (
            <span
              key={color}
              className="flex items-center gap-1 text-[9px] text-muted border border-line pl-1 pr-1.5 py-0.5 uppercase tracking-wide bg-paper"
            >
              <span className={`w-2 h-2 rounded-full border ${getColorClass(color)}`} />
              {color}
            </span>
          ))}
        </div>

        <h3 className="font-display text-lg sm:text-xl font-medium text-ink leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-[11px] text-muted mb-4">
          Tallas: <span className="text-ink font-medium">{product.sizes.join(' • ')}</span>
        </p>

        <div className="flex items-center space-x-2 mb-4 pt-3 border-t border-line mt-auto">
          <span className="font-mono text-lg sm:text-xl font-black text-ink">
            S/. {product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="font-mono text-sm text-muted line-through">
              S/. {product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            id={`spotlight-quick-view-${product.id}`}
            onClick={() => onQuickView(product)}
            className="bg-paper-soft text-ink border border-ink hover:bg-ink hover:text-paper-soft text-[10px] uppercase tracking-widest py-2.5 transition-all flex items-center justify-center gap-1.5 font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            Ver detalle
          </button>
          <button
            id={`spotlight-add-to-cart-${product.id}`}
            onClick={() => onQuickView(product)}
            disabled={product.stock === 0}
            className="bg-ink text-paper-soft hover:bg-accent text-[10px] uppercase tracking-widest py-2.5 transition-all flex items-center justify-center gap-1.5 font-bold disabled:bg-panel disabled:text-muted disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
