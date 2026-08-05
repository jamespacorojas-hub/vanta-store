import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Flame } from 'lucide-react';
import { Product } from '../../types';
import { getColorClass } from '../../utils/colorSwatch';

interface DealProductCardProps {
  product: Product;
  discountPct: number;
  savingsAmount: number;
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
}

// Price-forward variant for Ofertas: the discount and soles saved lead the card,
// not a small corner badge — this is the deal, not just another garment.
export default function DealProductCard({
  product,
  discountPct,
  savingsAmount,
  onQuickView,
  onToggleFavorite,
  isFavorite,
}: DealProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={`deal-card-${product.id}`}
      className="group flex flex-col h-full bg-paper-soft relative border border-line transition-all duration-500 hover:border-accent/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Deal banner — the dominant element, not a corner sticker */}
      <div className="flex items-center justify-between bg-ink text-paper-soft px-3 py-2">
        <span className="font-mono text-sm font-black tracking-wider">-{discountPct}% OFF</span>
        <span className="font-mono text-[10px] sm:text-xs font-bold text-accent-soft tracking-wide">
          AHORRAS S/. {savingsAmount.toFixed(2)}
        </span>
      </div>

      {/* Product Photo Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-panel select-none border-b border-line flex flex-col justify-between p-4 text-ink transition-all duration-500">
        <img
          src={product.images[0]}
          alt={`${product.name} - ${product.colors[0]}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/60 pointer-events-none" />

        <div className="flex justify-between items-start w-full z-10 text-[9px] text-paper-soft/90 uppercase tracking-wide drop-shadow">
          <span>{product.id.toUpperCase()}</span>
          <span>2026</span>
        </div>

        <div className="w-full z-10 space-y-1.5 pt-2 border-t border-line/40">
          <div className="flex justify-between items-center text-[9px] text-paper-soft/90 uppercase drop-shadow">
            <span>Corte relajado</span>
            {product.stock <= 4 && product.stock > 0 ? (
              <span className="font-mono text-red-400 font-bold">STOCK: {product.stock}!</span>
            ) : (
              <span className="font-mono">STOCK: {product.stock}</span>
            )}
          </div>
        </div>

        {product.stock <= 4 && product.stock > 0 && (
          <span className="absolute top-9 left-3 z-10 flex items-center gap-1 text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-red-700 text-paper-soft">
            <Flame className="w-2.5 h-2.5" />
            ¡Solo quedan {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-9 left-3 z-10 text-[8px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-ink/70 text-paper">
            Agotado
          </span>
        )}

        <button
          id={`deal-favorite-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className={`absolute top-9 right-3 p-1.5 rounded-none backdrop-blur-xs transition-all duration-300 z-10 ${
            isFavorite
              ? 'bg-ink text-paper-soft border border-ink'
              : 'bg-paper-soft/60 text-ink hover:bg-paper-soft border border-line'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <div
          className={`absolute inset-x-0 bottom-0 bg-paper-soft p-3 transition-all duration-300 hidden sm:flex flex-col gap-2 border-t border-line z-20 text-ink ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <button
            id={`deal-quick-view-${product.id}`}
            onClick={() => onQuickView(product)}
            className="w-full bg-paper-soft text-ink border border-ink hover:bg-ink hover:text-paper-soft text-[10px] uppercase tracking-widest py-2 transition-all flex items-center justify-center gap-1.5 font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            Ficha / Ver detalle
          </button>
          <button
            id={`deal-add-to-cart-${product.id}`}
            onClick={() => onQuickView(product)}
            disabled={product.stock === 0}
            className="w-full bg-ink text-paper-soft hover:bg-accent text-[10px] uppercase tracking-widest py-2 transition-all flex items-center justify-center gap-1.5 font-bold disabled:bg-panel disabled:text-muted disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Comprar / Seleccionar
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col font-sans p-4">
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

        <h3 className="font-sans font-medium text-xs sm:text-sm text-ink tracking-wide leading-tight mb-1 group-hover:text-accent transition-colors">
          {product.name}
        </h3>

        <p className="text-[10px] text-muted mb-2 mt-auto">
          Tallas: <span className="text-ink font-medium">{product.sizes.join(' • ')}</span>
        </p>

        <div className="flex items-baseline space-x-2 mt-auto pt-2 border-t border-line">
          <span className="font-mono text-sm sm:text-base font-black text-accent">
            S/. {product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="font-mono text-xs text-muted line-through">
              S/. {product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:hidden">
          <button
            id={`deal-quick-view-mob-${product.id}`}
            onClick={() => onQuickView(product)}
            className="bg-paper-soft text-ink border border-line text-[9px] py-1.5 flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3" />
            VER
          </button>
          <button
            id={`deal-add-to-cart-mob-${product.id}`}
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
