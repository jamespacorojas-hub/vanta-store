import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../../types';
import { getColorClass } from '../../utils/colorSwatch';

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
  const [isHovered, setIsHovered] = useState(false);
  const hasPhoto = product.images.length > 0;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  // Determine tag style (minimalist, warm, not neon)
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'Nuevo':
        return 'bg-ink text-paper-soft';
      case 'Oferta':
        return 'bg-accent-soft text-accent border border-accent/30';
      case 'Últimas unidades':
        return 'bg-panel text-ink border border-line font-bold';
      case 'Próximamente':
        return 'bg-paper text-ink border border-accent/40 font-bold';
      default:
        return 'bg-paper-soft text-ink';
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col h-full bg-paper-soft relative border border-line p-4 transition-all duration-500 hover:border-accent/40 shadow-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Photo Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-panel mb-3 sm:mb-4 select-none border border-line flex flex-col justify-between p-4 text-ink transition-all duration-500">
        {hasPhoto ? (
          <>
            {/* Real garment photo, swapped on hover if a second color/angle is available */}
            <img
              src={product.images[currentImageIndex] || product.images[0]}
              alt={`${product.name} - ${product.colors[0]}`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/60 pointer-events-none" />
          </>
        ) : (
          /* No real photo yet (garment not in production) — plain placeholder, never a stock photo */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
            <span className="font-display text-3xl sm:text-4xl font-medium text-muted select-none">
              {product.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold">Foto próximamente</span>
          </div>
        )}

        {/* Upper metadata row */}
        <div className={`flex justify-between items-start w-full z-10 text-[9px] uppercase tracking-wide ${hasPhoto ? 'text-paper-soft/90 drop-shadow' : 'text-muted'}`}>
          <span>{product.id.toUpperCase()}</span>
          <span>2026</span>
        </div>

        {/* Bottom Specs & Fabric badge row */}
        <div className={`w-full z-10 space-y-1.5 pt-2 border-t ${hasPhoto ? 'border-line/40 text-paper-soft' : 'border-line'}`}>
          <div className={`flex justify-between items-center text-[9px] uppercase ${hasPhoto ? 'text-paper-soft/90 drop-shadow' : 'text-muted'}`}>
            <span>Corte relajado</span>
            {product.tags.includes('Próximamente') ? (
              <span className="font-mono">PRÓX. LANZAMIENTO</span>
            ) : product.stock <= 4 && product.stock > 0 ? (
              <span className="font-mono text-red-400 font-bold">STOCK: {product.stock}!</span>
            ) : (
              <span className="font-mono">STOCK: {product.stock}</span>
            )}
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span className={`text-[9px] uppercase font-medium ${hasPhoto ? 'text-paper-soft/90 drop-shadow' : 'text-muted'}`}>Disponible en {product.fabrics[0]}</span>
          </div>
        </div>

        {/* Gray/Black Badges container (Upper left) */}
        <div className="absolute top-10 left-3 flex flex-col gap-1 z-10">
          {rank && (
            <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 select-none bg-accent text-paper-soft">
              N.º {String(rank).padStart(2, '0')} · Más vendido
            </span>
          )}
          {product.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[8px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 select-none ${getTagStyle(
                tag
              )}`}
            >
              {tag}
            </span>
          ))}
          {product.stock <= 4 && product.stock > 0 && (
            <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border animate-pulse-red shadow-xs shadow-red-500/20">
              Stock Limitado ({product.stock})
            </span>
          )}
          {product.stock === 0 && !product.tags.includes('Próximamente') && (
            <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-ink/70 text-paper">
              Agotado
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
          className={`absolute top-10 right-3 p-1.5 rounded-none backdrop-blur-xs transition-all duration-300 z-10 ${
            isFavorite
              ? 'bg-ink text-paper-soft border border-ink'
              : 'bg-paper-soft/60 text-ink hover:bg-paper-soft border border-line'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Hover quick-actions panel (Sliding or Fade up from bottom) */}
        <div className="absolute inset-x-0 bottom-0 bg-paper-soft p-3 transition-all duration-300 translate-y-full group-hover:translate-y-0 hidden sm:flex flex-col gap-2 border-t border-line z-20 text-ink">
          <button
            id={`quick-view-card-${product.id}`}
            onClick={() => onQuickView(product)}
            className="w-full bg-paper-soft text-ink border border-ink hover:bg-ink hover:text-paper-soft text-[10px] uppercase tracking-widest py-2 transition-all flex items-center justify-center gap-1.5 font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            Ficha / Ver detalle
          </button>
          <button
            id={`add-to-cart-card-${product.id}`}
            onClick={() => onQuickView(product)}
            disabled={product.stock === 0}
            className="w-full bg-ink text-paper-soft hover:bg-accent text-[10px] uppercase tracking-widest py-2 transition-all flex items-center justify-center gap-1.5 font-bold disabled:bg-panel disabled:text-muted disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Comprar / Seleccionar
          </button>
        </div>
      </div>

      {/* Product Card Info */}
      <div className="flex-1 flex flex-col font-sans">
        {/* Colors available indicators */}
        <div className="flex gap-1.5 mb-1.5 flex-wrap">
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

        {/* Name */}
        <h3 className="font-sans font-medium text-xs sm:text-sm text-ink tracking-wide leading-tight mb-1 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        {/* Sizes inline row */}
        <p className="text-[10px] text-muted mb-1 mt-auto">
          Tallas: <span className="text-ink font-medium">{product.sizes.join(' • ')}</span>
        </p>

        {/* Fabrics inline row */}
        <p className="text-[10px] text-muted mb-2">
          Telas: <span className="text-ink font-semibold">{product.fabrics.join(' • ')}</span>
        </p>

        {/* Price Tag with discount */}
        <div className="flex items-center space-x-2 mt-auto pt-1 border-t border-line">
          <span className="font-mono text-xs sm:text-sm font-black text-ink">
            S/. {product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="font-mono text-xs text-muted line-through">
              S/. {product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Mobile View Direct Buttons (No hover capability on mobile) */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:hidden">
          <button
            id={`quick-view-card-mob-${product.id}`}
            onClick={() => onQuickView(product)}
            className="bg-paper-soft text-ink border border-line text-[9px] py-1.5 flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3" />
            VER
          </button>
          <button
            id={`add-to-cart-card-mob-${product.id}`}
            onClick={() => onQuickView(product)}
            disabled={product.stock === 0}
            className="bg-ink text-paper-soft text-[9px] py-1.5 flex items-center justify-center gap-1 disabled:bg-panel disabled:text-muted"
          >
            <ShoppingBag className="w-3 h-3" />
            + CARRITO
          </button>
        </div>
      </div>
    </div>
  );
}
