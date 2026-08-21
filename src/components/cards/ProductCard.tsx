import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
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

  // Determine tag style (Luxury gothic & refined crimson accents)
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'Nuevo':
        return 'bg-white text-black font-bold border border-white shadow-xs';
      case 'Oferta':
        return 'bg-rose-700 text-white font-bold border border-rose-600 shadow-xs';
      case 'Últimas unidades':
        return 'bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold';
      case 'Próximamente':
        return 'bg-[#0a0a0f] text-zinc-400 border border-zinc-800 font-bold';
      default:
        return 'bg-zinc-900 text-zinc-200 border border-zinc-800';
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col h-full bg-paper-soft relative border border-line p-2 sm:p-4 transition-all duration-500 hover:border-accent hover:shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Photo Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-panel mb-2.5 sm:mb-4 select-none border border-line flex flex-col justify-between p-2 sm:p-4 text-ink transition-all duration-500 group-hover:border-accent/40">
        {hasPhoto && activeImage ? (
          <>
            <img
              src={activeImage}
              alt={`${product.name} - ${activeColorName}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
          </>
        ) : (
          /* Placeholder for unreleased garments */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4 bg-panel">
            <span className="font-display text-2xl sm:text-4xl font-medium text-muted select-none">
              {product.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-muted font-bold font-mono">Foto próximamente</span>
          </div>
        )}

        {/* Upper metadata row (desktop only) */}
        <div className={`hidden sm:flex justify-between items-start w-full z-10 text-[9px] font-mono uppercase tracking-wide ${hasPhoto ? 'text-zinc-200 drop-shadow-md' : 'text-zinc-500'}`}>
          <span>{product.id.toUpperCase()}</span>
          <span className="text-zinc-400">2026</span>
        </div>

        {/* Bottom Specs & Fabric badge row (desktop only) */}
        <div className={`hidden sm:block w-full z-10 space-y-1.5 pt-2 border-t ${hasPhoto ? 'border-white/15 text-zinc-200' : 'border-zinc-800'}`}>
          <div className={`flex justify-between items-center text-[9px] font-mono uppercase ${hasPhoto ? 'text-zinc-200 drop-shadow-md' : 'text-zinc-500'}`}>
            <span>Corte relajado</span>
            {product.tags.includes('Próximamente') ? (
              <span className="font-mono text-zinc-400">PRÓX. LANZAMIENTO</span>
            ) : product.stock <= 4 && product.stock > 0 ? (
              <span className="font-mono text-rose-400 font-bold">STOCK: {product.stock}!</span>
            ) : (
              <span className="font-mono text-zinc-300">STOCK: {product.stock}</span>
            )}
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
            <span className={`text-[9px] uppercase font-medium ${hasPhoto ? 'text-zinc-200 drop-shadow-md' : 'text-zinc-500'}`}>
              Disponible en {product.fabrics[0]}
            </span>
          </div>
        </div>

        {/* Badges container (Upper left) */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {rank && (
            <span className="text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 select-none bg-white text-black shadow-md">
              N.º {String(rank).padStart(2, '0')}
            </span>
          )}
          {product.tags.slice(0, 1).map((tag) => (
            <span
              key={tag}
              className={`text-[7px] sm:text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 select-none ${getTagStyle(
                tag
              )}`}
            >
              {tag}
            </span>
          ))}
          {product.stock <= 4 && product.stock > 0 && (
            <span className="text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-rose-950/90 text-rose-200 border border-rose-700">
              Stock {product.stock}
            </span>
          )}
        </div>

        {/* Favorite Icon (Upper right) */}
        <button
          id={`favorite-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 rounded-none backdrop-blur-md transition-all duration-300 z-10 ${
            isFavorite
              ? 'bg-rose-700 text-white border border-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.4)]'
              : 'bg-black/60 text-zinc-300 hover:text-white hover:bg-black/90 border border-white/15'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Desktop Hover quick-actions panel */}
        <div className="absolute inset-x-0 bottom-0 bg-paper-soft/95 backdrop-blur-md p-3 transition-all duration-300 translate-y-full group-hover:translate-y-0 hidden sm:flex flex-col gap-2 border-t border-line z-20 text-ink">
          <button
            id={`quick-view-card-${product.id}`}
            onClick={() => onQuickView(product)}
            className="w-full bg-panel text-ink border border-line hover:border-accent hover:text-accent text-[10px] uppercase tracking-widest py-2 transition-all flex items-center justify-center gap-1.5 font-mono font-semibold cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-muted" />
            Ficha / Ver detalle
          </button>
          <button
            id={`add-to-cart-card-${product.id}`}
            onClick={() => onQuickView(product)}
            disabled={product.stock === 0}
            className="w-full bg-accent text-white hover:bg-rose-600 text-[10px] uppercase tracking-widest py-2 transition-all flex items-center justify-center gap-1.5 font-mono font-bold shadow-md cursor-pointer disabled:bg-panel disabled:text-muted disabled:shadow-none disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Comprar / Seleccionar
          </button>
        </div>
      </div>

      {/* Product Card Info */}
      <div className="flex-1 flex flex-col font-sans px-0.5">
        {/* Interactive Color Swatches Row */}
        <div className="space-y-1 mb-1.5">
          <div className="flex items-center justify-between text-[7.5px] sm:text-[8.5px] font-mono uppercase text-muted">
            <span className="truncate max-w-[90px] sm:max-w-none">Color: <strong className="text-ink">{activeColorName}</strong></span>
            <span className="text-muted shrink-0">{product.colors.length} col.</span>
          </div>

          <div className="flex gap-1 sm:gap-1.5 flex-wrap items-center">
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
                  title={`Ver en color ${color}`}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border transition-all cursor-pointer ${
                    getColorClass(color)
                  } ${
                    isColorActive
                      ? 'ring-2 ring-accent scale-110 shadow-sm'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                />
              );
            })}
            {product.colors.length > 4 && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="text-[7px] sm:text-[8px] font-mono text-muted hover:text-ink px-1 py-0.5 border border-line bg-panel transition-colors"
                title="Ver todos los colores"
              >
                +{product.colors.length - 4}
              </button>
            )}
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-display font-bold text-[11px] sm:text-sm text-ink tracking-wide leading-tight mb-1 group-hover:text-accent transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Sizes inline row */}
        <p className="text-[8.5px] sm:text-[10px] text-muted mb-0.5 font-mono truncate">
          Tallas: <span className="text-ink font-medium">{product.sizes.join(' • ')}</span>
        </p>

        {/* Price Tag with discount */}
        <div className="flex items-baseline space-x-1.5 mt-auto pt-1.5 border-t border-line">
          <span className="font-mono text-xs sm:text-base font-black text-ink">
            S/. {product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="font-mono text-[9px] sm:text-xs text-muted line-through">
              S/. {product.oldPrice.toFixed(2)}
            </span>
          )}
          {product.oldPrice && (
            <span className="font-mono text-[7.5px] sm:text-[8.5px] font-bold text-accent ml-auto">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Mobile Clean Direct Action Button */}
        <button
          id={`quick-view-card-mob-${product.id}`}
          onClick={() => onQuickView(product)}
          className="mt-2 w-full bg-accent text-white hover:bg-rose-600 text-[9px] py-1.5 font-mono uppercase font-bold flex items-center justify-center gap-1 shadow-sm transition-all sm:hidden cursor-pointer"
        >
          <ShoppingBag className="w-3 h-3" />
          VER PRENDA
        </button>
      </div>
    </div>
  );
}
