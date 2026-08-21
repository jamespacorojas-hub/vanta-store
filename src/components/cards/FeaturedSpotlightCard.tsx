import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { getColorClass } from '../../utils/colorSwatch';
import { getProductImageByColor } from '../../utils/productImages';

interface FeaturedSpotlightCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
}

export default function FeaturedSpotlightCard({
  product,
  onQuickView,
  onToggleFavorite,
  isFavorite,
}: FeaturedSpotlightCardProps) {
  const [previewColor, setPreviewColor] = useState<string | null>(null);

  const activeImage = previewColor
    ? getProductImageByColor(product, previewColor) || product.images[0]
    : product.images[0];

  const activeColorName = previewColor || product.colors[0] || 'Original';

  return (
    <div
      id={`spotlight-card-${product.id}`}
      className="group flex flex-col h-full bg-paper-soft text-ink border border-line shadow-xl hover:border-accent transition-all duration-500 rounded-sm overflow-hidden"
    >
      {/* Product Photo Stage */}
      <div className="relative flex-1 min-h-[260px] sm:min-h-[360px] bg-panel p-4 sm:p-7 flex flex-col justify-between border-b border-line overflow-hidden">
        {activeImage && (
          <img
            src={activeImage}
            alt={`${product.name} - ${activeColorName}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75 pointer-events-none" />

        {/* Rank marker */}
        <div className="flex items-start justify-between z-10">
          <div className="space-y-0.5">
            <span className="font-display text-3xl sm:text-5xl font-black text-white leading-none drop-shadow-md">
              N.º 01
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] font-mono tracking-[0.28em] text-zinc-300 uppercase font-bold block drop-shadow">
              ✦ MÁS VENDIDO ✦
            </span>
          </div>
          <button
            id={`spotlight-favorite-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className={`p-2 rounded-full transition-all duration-300 shrink-0 backdrop-blur-md cursor-pointer ${
              isFavorite
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-black/60 text-zinc-300 hover:text-white border border-white/20'
            }`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Category / fabric tag */}
        <div className="flex flex-col items-center justify-center my-auto z-10 space-y-1 text-center py-4">
          <span className="text-[11px] font-mono tracking-[0.25em] text-white uppercase drop-shadow bg-black/60 px-3 py-1 border border-white/15">
            {product.category}
          </span>
          <span className="text-[9.5px] font-mono tracking-widest text-zinc-300 uppercase drop-shadow">
            {product.fabrics.join(' / ')}
          </span>
        </div>

        {/* Curator note */}
        <p className="text-[11px] text-zinc-200 italic leading-relaxed max-w-md mx-auto text-center z-10 line-clamp-2 drop-shadow">
          "{product.description}"
        </p>
      </div>

      {/* Info + actions */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between font-sans">
        <div>
          {/* Interactive Color Swatches */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-[8.5px] font-mono uppercase text-muted">
              <span>Color: <strong className="text-ink">{activeColorName}</strong></span>
              <span>{product.colors.length} colores</span>
            </div>

            <div className="flex gap-1.5 flex-wrap items-center">
              {product.colors.slice(0, 8).map((color) => {
                const isColorActive = activeColorName === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewColor(color);
                    }}
                    onMouseEnter={() => setPreviewColor(color)}
                    title={`Ver en color ${color}`}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${getColorClass(
                      color
                    )} ${
                      isColorActive
                        ? 'ring-2 ring-accent scale-110 shadow-sm'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <h3 className="font-display text-lg sm:text-xl font-bold text-ink tracking-wide leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-muted mb-3 font-mono">
            Tallas: <span className="text-ink font-semibold">{product.sizes.join(' • ')}</span>
          </p>
        </div>

        <div>
          <div className="flex items-baseline space-x-2 mb-3.5 pt-2.5 border-t border-line">
            <span className="font-mono text-xl sm:text-2xl font-black text-ink">
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
              className="bg-panel text-ink border border-line hover:border-ink/50 text-[10px] uppercase tracking-wider py-2.5 transition-all flex items-center justify-center gap-1.5 font-mono font-semibold cursor-pointer rounded-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver detalle</span>
            </button>
            <button
              id={`spotlight-add-to-cart-${product.id}`}
              onClick={() => onQuickView(product)}
              disabled={product.stock === 0}
              className="bg-ink text-paper hover:opacity-90 text-[10px] uppercase tracking-wider py-2.5 transition-all flex items-center justify-center gap-1.5 font-mono font-bold shadow-md cursor-pointer disabled:bg-panel disabled:text-muted rounded-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
