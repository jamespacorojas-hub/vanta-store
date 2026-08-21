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
  const [isHovered, setIsHovered] = useState(false);
  const [previewColor, setPreviewColor] = useState<string | null>(null);

  const activeImage = previewColor
    ? getProductImageByColor(product, previewColor) || product.images[0]
    : product.images[0];

  const activeColorName = previewColor || product.colors[0] || 'Original';

  return (
    <div
      id={`deal-card-${product.id}`}
      className="group flex flex-col h-full bg-[#0d0d12] relative border border-zinc-800 transition-all duration-500 hover:border-zinc-500 hover:shadow-[0_0_25px_rgba(0,0,0,0.8)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Deal banner — High-contrast luxury deal banner */}
      <div className="flex items-center justify-between bg-[#14141c] text-white border-b border-zinc-800 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5">
        <span className="font-mono text-[9px] sm:text-xs font-black tracking-wider bg-rose-700 text-white px-1.5 sm:px-2 py-0.5">-{discountPct}% OFF</span>
        <span className="font-mono text-[8px] sm:text-xs font-bold text-zinc-300 tracking-wide">
          AHORRO S/. {savingsAmount.toFixed(0)}
        </span>
      </div>

      {/* Product Photo Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#121218] select-none border-b border-zinc-800 flex flex-col justify-between p-2 sm:p-4 text-ink transition-all duration-500">
        {activeImage && (
          <img
            src={activeImage}
            alt={`${product.name} - ${activeColorName}`}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75 pointer-events-none" />

        <div className="hidden sm:flex justify-between items-start w-full z-10 text-[9px] font-mono text-zinc-300 uppercase tracking-wide drop-shadow">
          <span>{product.id.toUpperCase()}</span>
          <span className="text-zinc-400">2026</span>
        </div>

        <div className="hidden sm:block w-full z-10 space-y-1.5 pt-2 border-t border-white/15">
          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-300 uppercase drop-shadow">
            <span>Corte relajado</span>
            {product.stock <= 4 && product.stock > 0 ? (
              <span className="font-mono text-rose-400 font-bold">STOCK: {product.stock}!</span>
            ) : (
              <span className="font-mono text-zinc-300">STOCK: {product.stock}</span>
            )}
          </div>
        </div>

        {product.stock <= 4 && product.stock > 0 && (
          <span className="absolute top-2 left-2 sm:top-9 sm:left-3 z-10 flex items-center gap-1 text-[7px] sm:text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 bg-rose-700 text-white shadow-md">
            <Flame className="w-2.5 h-2.5" />
            Stock {product.stock}
          </span>
        )}

        <button
          id={`deal-favorite-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className={`absolute top-2 right-2 sm:top-9 sm:right-3 p-1.5 rounded-none backdrop-blur-md transition-all duration-300 z-10 ${
            isFavorite
              ? 'bg-rose-700 text-white border border-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.4)]'
              : 'bg-black/60 text-zinc-300 hover:text-white hover:bg-black/90 border border-white/15'
          }`}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Desktop hover actions */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-[#0c0c11]/95 backdrop-blur-md p-3 transition-all duration-300 hidden sm:flex flex-col gap-2 border-t border-zinc-800 z-20 text-ink ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <button
            id={`deal-quick-view-${product.id}`}
            onClick={() => onQuickView(product)}
            className="w-full bg-[#161620] text-zinc-200 border border-zinc-700 hover:border-zinc-400 hover:text-white text-[10px] uppercase tracking-widest py-2 transition-all flex items-center justify-center gap-1.5 font-mono font-semibold cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Ficha / Ver detalle
          </button>
          <button
            id={`deal-add-to-cart-${product.id}`}
            onClick={() => onQuickView(product)}
            disabled={product.stock === 0}
            className="w-full bg-white text-black hover:bg-zinc-200 text-[10px] uppercase tracking-widest py-2 transition-all flex items-center justify-center gap-1.5 font-mono font-bold shadow-md cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Comprar / Seleccionar
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col font-sans p-2.5 sm:p-4">
        {/* Interactive Color Swatches */}
        <div className="space-y-1 mb-1.5">
          <div className="flex items-center justify-between text-[7.5px] sm:text-[8.5px] font-mono uppercase text-zinc-400">
            <span className="truncate max-w-[90px] sm:max-w-none">Color: <strong className="text-zinc-200">{activeColorName}</strong></span>
            <span className="text-zinc-500 shrink-0">{product.colors.length} col.</span>
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
                      ? 'ring-2 ring-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <h3 className="font-sans font-bold text-[11px] sm:text-sm text-white tracking-wide leading-tight mb-1 group-hover:text-zinc-200 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-[8.5px] sm:text-[10px] text-zinc-400 mb-1 mt-auto font-mono truncate">
          Tallas: <span className="text-zinc-200 font-medium">{product.sizes.join(' • ')}</span>
        </p>

        <div className="flex items-baseline space-x-1.5 mt-auto pt-1.5 border-t border-zinc-800">
          <span className="font-mono text-xs sm:text-base font-black text-white">
            S/. {product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="font-mono text-[9px] sm:text-xs text-zinc-500 line-through">
              S/. {product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Mobile direct button */}
        <button
          id={`deal-quick-view-mob-${product.id}`}
          onClick={() => onQuickView(product)}
          className="mt-2 w-full bg-white text-black hover:bg-zinc-200 text-[9px] py-1.5 font-mono uppercase font-bold flex items-center justify-center gap-1 shadow-sm transition-all sm:hidden cursor-pointer"
        >
          <ShoppingBag className="w-3 h-3" />
          VER OFERTA
        </button>
      </div>
    </div>
  );
}
