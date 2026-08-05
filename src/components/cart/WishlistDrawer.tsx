import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Product[];
  onRemoveFavorite: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onQuickView,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      id="wishlist-drawer-overlay"
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        id="wishlist-drawer-container"
        className="w-full max-w-md bg-paper h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-paper-soft">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-ink fill-ink" />
            <span className="text-xs uppercase tracking-widest font-black">
              MIS FAVORITOS ({favorites.length})
            </span>
          </div>
          <button
            id="close-wishlist-btn"
            onClick={onClose}
            className="p-1.5 hover:bg-panel text-ink transition-all"
            aria-label="Cerrar favoritos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {favorites.length === 0 ? (
            <div id="empty-wishlist-state" className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="w-16 h-16 rounded-full bg-paper-soft flex items-center justify-center border border-line">
                <Heart className="w-6 h-6 text-muted" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-ink">SIN FAVORITOS</p>
                <p className="text-muted text-xs mt-1.5 font-light">
                  Añade prendas pulsando el ícono de corazón en el catálogo.
                </p>
              </div>
              <button
                id="empty-wishlist-back-to-shop"
                onClick={onClose}
                className="bg-ink text-paper-soft px-6 py-2.5 text-xs tracking-wider uppercase hover:bg-accent"
              >
                VOLVER AL CATÁLOGO
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((product) => (
                <div
                  id={`wishlist-item-${product.id}`}
                  key={product.id}
                  className="flex space-x-3.5 bg-paper-soft border border-line p-2.5 relative group"
                >
                  {/* Item Image Placeholder - 0 Images */}
                  <div className="w-16 aspect-[3/4] bg-panel shrink-0 select-none border border-line flex flex-col justify-between p-1.5 text-ink">
                    <span className="text-[6px] font-mono text-muted uppercase tracking-widest">COD-{product.id.substring(0, 3).toUpperCase()}</span>
                    <div className="text-[11px] font-black tracking-wider text-center my-auto">
                      {product.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <span className="text-[5px] font-mono text-muted text-center uppercase">{product.fabrics[0]}</span>
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 flex flex-col justify-between font-sans">
                    <div>
                      <span className="text-[9px] text-muted uppercase tracking-wider">
                        {product.category}
                      </span>
                      <h4 className="font-bold text-xs uppercase text-ink leading-tight mt-0.5">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline space-x-2 mt-1">
                        <span className="font-mono text-xs font-black text-ink">
                          S/. {product.price.toFixed(2)}
                        </span>
                        {product.oldPrice && (
                          <span className="font-mono text-[10px] text-muted line-through">
                            S/. {product.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        id={`wishlist-buy-${product.id}`}
                        onClick={() => {
                          onQuickView(product);
                          onClose();
                        }}
                        className="flex-1 bg-ink text-paper-soft hover:bg-accent text-[9px] py-1.5 px-3 flex items-center justify-center gap-1 uppercase tracking-wider font-bold"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        AGREGAR / VER OPCIONES
                      </button>
                    </div>
                  </div>

                  {/* Remove from favorites */}
                  <button
                    id={`wishlist-remove-${product.id}`}
                    onClick={() => onRemoveFavorite(product)}
                    className="absolute top-2.5 right-2.5 text-muted hover:text-red-500 transition-colors"
                    aria-label="Quitar de favoritos"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
