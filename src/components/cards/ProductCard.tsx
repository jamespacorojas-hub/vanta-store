import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Flame, Tag } from 'lucide-react';
import { Product } from '../../types';
import { getColorClass } from '../../utils/colorSwatch';
import { getProductImageByColor } from '../../utils/productImages';

interface ProductCardProps {
  key?: string;
  product: Product;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
  /** Ranking position (1-indexed) for curated "most sold" contexts, e.g. Destacados. Omit elsewhere. */
  rank?: number;
}

export default function ProductCard({
  product,
  onQuickView,
  onToggleFavorite,
  isFavorite,
  rank,
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const hasPhoto = product.images.length > 0;

  const handleMouseEnter = () => {
    if (!previewColor && product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    if (!previewColor) {
      setCurrentImageIndex(0);
    }
  };

  // Active displayed image: checks preview color first, then hover index, then fallback
  const activeImage = previewColor
    ? getProductImageByColor(product, previewColor) || product.images[0]
    : product.images[currentImageIndex] || product.images[0];

  const activeColorName = previewColor || product.colors[0] || 'Original';

  // Determine tag style with modern pill design
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'Nuevo':
        return 'bg-white text-black font-bold shadow-sm';
      case 'Oferta':
        return 'bg-rose-600 text-white font-bold shadow-sm';
      case 'Últimas unidades':
        return 'bg-amber-500/90 text-black font-semibold backdrop-blur-sm';
      case 'Próximamente':
        return 'bg-zinc-800/90 text-zinc-300 font-medium backdrop-blur-sm';
      default:
        return 'bg-black/60 text-white border border-white/10 backdrop-blur-md';
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col h-full bg-paper-soft text-ink relative border border-line rounded-2xl p-2.5 sm:p-3.5 transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Photo Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-panel select-none flex items-center justify-center text-ink transition-all duration-500">
        {hasPhoto && activeImage ? (
          <>
            <img
              src={activeImage}
              alt={`${product.name} - ${activeColorName}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </>
        ) : (
          /* Placeholder for unreleased garments */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4 bg-panel">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-muted/60 select-none">
              {product.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted font-medium">Próximamente</span>
          </div>
        )}

        {/* Floating Badges Container (Upper Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 items-start">
          {product.promoBadge && (
            <span className="text-[9px] sm:text-[10px] font-sans font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-200 fill-amber-200" />
              {product.promoBadge.split('·')[0].trim()}
            </span>
          )}
          {rank && (
            <span className="text-[9px] sm:text-[10px] font-sans font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-white text-black shadow-md">
              #{rank} TOP
            </span>
          )}
          {product.tags.slice(0, 1).map((tag) => (
            <span
              key={tag}
              className={`text-[9px] sm:text-[10px] font-sans uppercase tracking-wide px-2.5 py-0.5 rounded-full ${getTagStyle(
                tag
              )}`}
            >
              {tag}
            </span>
          ))}
          {product.stock <= 4 && product.stock > 0 && (
            <span className="text-[8.5px] font-sans font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-rose-600/90 text-white shadow-sm backdrop-blur-sm">
              Solo {product.stock} disp.
            </span>
          )}
        </div>

        {/* Favorite Icon (Upper Right) - Sleek Floating Circle */}
        <button
          id={`favorite-btn-${product.id}`}
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

        {/* Desktop Quick-Actions Pill Bar (Hover slide up) */}
        <div className="absolute inset-x-2.5 bottom-2.5 transition-all duration-300 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:flex items-center gap-1.5 z-20">
          <button
            id={`quick-view-card-${product.id}`}
            onClick={() => onQuickView(product)}
            className="flex-1 bg-paper/90 backdrop-blur-md text-ink hover:bg-paper border border-line/80 text-[11px] font-semibold py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-muted" />
            <span>Ver Ficha</span>
          </button>
          <button
            id={`add-to-cart-card-${product.id}`}
            onClick={() => onQuickView(product)}
            disabled={product.stock === 0}
            className="bg-accent text-white hover:bg-rose-600 p-2 rounded-xl transition-all flex items-center justify-center shadow-md cursor-pointer disabled:bg-panel disabled:text-muted disabled:shadow-none disabled:cursor-not-allowed"
            title="Seleccionar talla y comprar"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col pt-3 px-1">
        {/* Category & Fabric Subtitle */}
        <div className="flex items-center justify-between text-[10px] text-muted font-medium uppercase tracking-wider mb-1">
          <span>{product.category}</span>
          <span className="truncate max-w-[100px] text-muted/80">{product.fabrics[0]}</span>
        </div>

        {/* Product Title */}
        <h3 className="font-heading font-bold text-xs sm:text-sm text-ink leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Color Swatches Row */}
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
            {product.colors.length > 4 && (
              <span className="text-[9px] text-muted font-medium ml-0.5">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
          <span className="text-[10px] text-muted font-medium">
            {product.sizes.join(' ')}
          </span>
        </div>

        {/* Promotion Ribbon */}
        {product.promoBadge && (
          <div className="mt-1 mb-2 p-1.5 px-2.5 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-between text-[10px]">
            <span className="font-sans font-bold text-accent tracking-wide flex items-center gap-1 truncate">
              <Tag className="w-3 h-3 shrink-0" />
              <span>{product.promoBadge}</span>
            </span>
            {product.promoSavings && (
              <span className="text-emerald-400 font-semibold text-[9.5px] shrink-0 ml-1">
                {product.promoSavings}
              </span>
            )}
          </div>
        )}

        {/* Price Tag with Modern Discount Pill */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-line">
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-extrabold text-sm sm:text-base text-ink tracking-tight">
              S/. {product.price.toFixed(2)}
            </span>
            {product.oldPrice && (
              <span className="text-[10px] sm:text-xs text-muted line-through">
                S/. {product.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.oldPrice && (
            <span className="bg-rose-500/15 text-accent font-bold text-[10px] px-2 py-0.5 rounded-full border border-rose-500/20">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Mobile Quick Action Button */}
        <button
          id={`quick-view-card-mob-${product.id}`}
          onClick={() => onQuickView(product)}
          className="mt-2.5 w-full bg-panel hover:bg-accent hover:text-white border border-line text-ink text-[11px] font-semibold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all sm:hidden cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Ver Prenda</span>
        </button>
      </div>
    </div>
  );
}
