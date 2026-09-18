import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
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
      className="group flex flex-col h-full bg-paper-soft text-ink border border-line rounded-3xl overflow-hidden shadow-xl hover:border-accent/40 transition-all duration-500"
    >
      {/* Product Photo Stage */}
      <div className="relative flex-1 min-h-[300px] sm:min-h-[420px] bg-panel flex flex-col justify-between overflow-hidden">
        {activeImage && (
          <img
            src={activeImage}
            alt={`${product.name} - ${activeColorName}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 pointer-events-none" />

        {/* Top Floating Row: Pill badge & Favorite */}
        <div className="flex items-center justify-between p-4 sm:p-5 z-10">
          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md text-white border border-white/15 px-3 py-1 rounded-full shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-wide uppercase">
              DROP DESTACADO #01
            </span>
          </div>

          <button
            id={`spotlight-favorite-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer ${
              isFavorite
                ? 'bg-rose-600 text-white shadow-lg scale-105'
                : 'bg-black/50 text-white hover:bg-white hover:text-black border border-white/20'
            }`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Floating Info Over Image */}
        <div className="p-4 sm:p-6 z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-white/90 backdrop-blur-md text-black font-extrabold text-[9.5px] uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
            <span className="text-white/80 text-[11px] font-medium tracking-wide">
              {product.fabrics.join(' • ')}
            </span>
          </div>
          <p className="text-zinc-200 text-xs sm:text-sm line-clamp-2 drop-shadow-sm pt-1">
            {product.description}
          </p>
        </div>
      </div>

      {/* Info + Actions */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between font-sans bg-paper-soft">
        <div>
          {/* Swatches Header */}
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span>Color: <strong className="text-ink font-semibold">{activeColorName}</strong></span>
            <span>{product.colors.length} variantes</span>
          </div>

          {/* Swatches List */}
          <div className="flex gap-2 flex-wrap items-center mb-3">
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
                  title={`Color: ${color}`}
                  className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${getColorClass(
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

          {/* Product Name */}
          <h3 className="font-heading font-extrabold text-lg sm:text-xl text-ink tracking-tight leading-snug mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-muted mb-4">
            Tallas disponibles: <span className="text-ink font-semibold">{product.sizes.join(' • ')}</span>
          </p>
        </div>

        <div>
          {/* Price Tag */}
          <div className="flex items-baseline gap-2 mb-4 pt-3 border-t border-line">
            <span className="font-sans font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
              S/. {product.price.toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-muted line-through">
                S/. {product.oldPrice.toFixed(2)}
              </span>
            )}
            {product.oldPrice && (
              <span className="ml-auto bg-rose-500/10 text-accent font-bold text-xs px-2.5 py-0.5 rounded-full">
                AHORRA S/. {(product.oldPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id={`spotlight-quick-view-${product.id}`}
              onClick={() => onQuickView(product)}
              className="bg-panel hover:bg-paper text-ink border border-line text-xs font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4 text-muted" />
              <span>Ver Detalle</span>
            </button>
            <button
              id={`spotlight-add-to-cart-${product.id}`}
              onClick={() => onQuickView(product)}
              disabled={product.stock === 0}
              className="bg-accent hover:bg-rose-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:bg-panel disabled:text-muted"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
