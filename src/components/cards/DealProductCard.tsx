import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Flame } from 'lucide-react';
import { SaleProduct } from '../../types';
import { getColorClass } from '../../utils/colorSwatch';
import { getProductImageByColor } from '../../utils/productImages';

interface DealProductCardProps {
  key?: string;
  product: SaleProduct;
  discountPct: number;
  savingsAmount: number;
  onQuickView: (product: SaleProduct) => void;
  onToggleFavorite: (product: SaleProduct) => void;
  isFavorite: boolean;
}

export default function DealProductCard({
  product,
  discountPct,
  savingsAmount,
  onQuickView,
  onToggleFavorite,
  isFavorite,
}: DealProductCardProps) {
  const [previewColor, setPreviewColor] = useState<string | null>(null);

  const activeImage = previewColor
    ? getProductImageByColor(product, previewColor) || product.images[0]
    : product.images[0];

  const activeColorName = previewColor || product.colors[0] || 'Original';

  return (
    <div
      id={`deal-card-${product.id}`}
      className="group flex flex-col h-full bg-paper-soft text-ink relative border border-line rounded-2xl p-2.5 sm:p-3.5 transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      {/* Product Photo Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-panel select-none flex items-center justify-center text-ink transition-all duration-500">
        {activeImage && (
          <img
            src={activeImage}
            alt={`${product.name} - ${activeColorName}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
          <span className="bg-rose-600 text-white font-extrabold text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
            <Flame className="w-3 h-3" />
            -{discountPct}% OFF
          </span>
          {product.stock <= 4 && product.stock > 0 && (
            <span className="bg-black/70 backdrop-blur-md text-amber-300 font-bold text-[9px] px-2 py-0.5 rounded-full border border-amber-500/30">
              Quedan {product.stock}
            </span>
          )}
        </div>

        {/* Favorite Icon */}
        <button
          id={`deal-favorite-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 z-10 cursor-pointer ${
            isFavorite
              ? 'bg-rose-600 text-white shadow-md scale-105'
              : 'bg-black/40 text-white hover:bg-white hover:text-black border border-white/15'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Desktop Quick-Actions Pill Bar */}
        <div className="absolute inset-x-2.5 bottom-2.5 transition-all duration-300 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:flex items-center gap-1.5 z-20">
          <button
            id={`deal-quick-view-${product.id}`}
            onClick={() => onQuickView(product)}
            className="flex-1 bg-paper/90 backdrop-blur-md text-ink hover:bg-paper border border-line/80 text-[11px] font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-muted" />
            <span>Ver Ficha</span>
          </button>
          <button
            id={`deal-add-to-cart-${product.id}`}
            onClick={() => onQuickView(product)}
            disabled={product.stock === 0}
            className="bg-accent text-white hover:bg-rose-600 p-2 rounded-xl transition-all flex items-center justify-center shadow-md cursor-pointer disabled:bg-panel disabled:text-muted"
            title="Seleccionar y comprar"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col pt-3 px-1">
        <div className="flex items-center justify-between text-[10px] text-muted font-medium uppercase tracking-wider mb-1">
          <span>{product.category}</span>
          <span className="text-accent font-semibold">Ahorro S/. {savingsAmount.toFixed(0)}</span>
        </div>

        <h3 className="font-heading font-bold text-xs sm:text-sm text-ink leading-snug mb-1.5 group-hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Multi-item Promo Badge */}
        {product.promoBadge && (
          <div className="mb-2 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center text-[10px] font-sans font-bold text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-full">
              {product.promoBadge}
            </span>
          </div>
        )}

        {/* Swatches */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex gap-1.5 items-center flex-wrap">
            {product.colors.slice(0, 4).map((color) => {
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
                  className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${getColorClass(
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
          <span className="text-[10px] text-muted font-medium">
            {product.sizes.join(' ')}
          </span>
        </div>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-line">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-extrabold text-sm sm:text-base text-ink tracking-tight">
              S/. {product.price.toFixed(2)}
            </span>
            <span className="text-[10px] sm:text-xs text-muted line-through">
              S/. {product.oldPrice.toFixed(2)}
            </span>
          </div>
          <span className="bg-rose-500/10 text-accent font-bold text-[10px] px-2 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        </div>

        {/* Mobile Button */}
        <button
          id={`deal-quick-view-mob-${product.id}`}
          onClick={() => onQuickView(product)}
          className="mt-2.5 w-full bg-accent text-white hover:bg-rose-600 text-[11px] font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all sm:hidden cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Aprovechar Oferta</span>
        </button>
      </div>
    </div>
  );
}
