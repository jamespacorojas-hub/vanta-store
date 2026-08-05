import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Heart } from 'lucide-react';
import { Product } from '../../types';
import { PRODUCTS } from '../../data';
import { COLOR_HEX, LIGHT_COLOR_NAMES } from '../../utils/colorSwatch';
import { getGarmentPhoto } from '../../utils/productImages';

interface CatalogoPageProps {
  favorites: Product[];
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}

const CARD_W = 208;
const CARD_H = 272;

// Destination for every "ver catálogo completo" CTA: a coverflow carousel — the active
// garment sits large at center, its neighbors peek from behind on either side.
export default function CatalogoPage({ favorites, onQuickView, onToggleFavorite }: CatalogoPageProps) {
  const [productIndex, setProductIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [fabricIndex, setFabricIndex] = useState(0);

  const product = PRODUCTS[productIndex];
  const currentColor = product.colors[colorIndex] || product.colors[0];
  const currentColorHex = COLOR_HEX[currentColor] || '#18181b';
  const isLightColor = LIGHT_COLOR_NAMES.includes(currentColor);
  const currentFabric = product.fabrics[fabricIndex] || product.fabrics[0];
  const currentPhoto = getGarmentPhoto(product.id, currentFabric, currentColor);
  const isFavorite = favorites.some((f) => f.id === product.id);

  // A different garment has a different color/fabric range — snap back to the first of each
  useEffect(() => {
    setColorIndex(0);
    setFabricIndex(0);
  }, [productIndex]);

  const spinProduct = (dir: 1 | -1) => {
    setProductIndex((prev) => (prev + dir + PRODUCTS.length) % PRODUCTS.length);
  };

  const spinColor = (dir: 1 | -1) => {
    setColorIndex((prev) => (prev + dir + product.colors.length) % product.colors.length);
  };

  return (
    <div id="catalogo-page" className="pt-[108px] sm:pt-[124px] bg-paper min-h-screen">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <Link
          id="back-to-home-link-catalogo"
          to="/"
          className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink hover:text-accent transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
        </Link>

        <div className="max-w-2xl mb-14">
          <span className="text-[10px] font-sans tracking-[0.35em] text-muted uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full" />
            CATÁLOGO COMPLETO
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl leading-tight mt-2.5 text-ink">
            Recorre cada prenda <span className="text-accent">y su color</span>
          </h1>
          <p className="text-muted text-xs sm:text-sm font-sans font-light leading-relaxed mt-5 max-w-xl">
            Desliza entre prendas con las flechas o toca una de los costados. La vista previa cambia en vivo con cada color.
          </p>
        </div>

        {/* Product name buttons — jump straight to a garment */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {PRODUCTS.map((p, i) => (
            <button
              id={`product-tab-${p.id}`}
              key={p.id}
              onClick={() => setProductIndex(i)}
              className={`text-[10px] uppercase tracking-widest font-mono font-semibold px-3.5 py-2 border transition-colors ${
                i === productIndex
                  ? 'bg-ink text-paper-soft border-ink'
                  : 'bg-paper-soft text-muted border-line hover:text-ink hover:border-accent'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Coverflow product carousel */}
        <div className="relative">
          <button
            id="coverflow-prev-product"
            onClick={() => spinProduct(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 border border-line bg-paper-soft hover:border-accent hover:text-accent transition-colors flex items-center justify-center"
            aria-label="Prenda anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            id="coverflow-stage"
            className="relative h-[300px] sm:h-[340px] overflow-hidden"
            style={{ perspective: '1400px' }}
          >
            {PRODUCTS.map((p, i) => {
              let offset = i - productIndex;
              const half = PRODUCTS.length / 2;
              if (offset > half) offset -= PRODUCTS.length;
              if (offset < -half) offset += PRODUCTS.length;
              const dist = Math.abs(offset);
              const isActive = offset === 0;
              const hidden = dist > 2;

              const translateX = offset * (CARD_W * 0.62);
              const scale = isActive ? 1 : dist === 1 ? 0.8 : 0.64;
              const rotateY = offset === 0 ? 0 : offset > 0 ? -22 : 22;
              const opacity = hidden ? 0 : isActive ? 1 : dist === 1 ? 0.75 : 0.4;
              const zIndex = 30 - dist;
              const activePhoto = isActive ? currentPhoto : undefined;
              const cardColorHex = isActive && !activePhoto ? currentColorHex : undefined;
              const cardIsLight = isActive ? isLightColor : false;
              // Real photo already carries strong contrast at the bottom via its own scrim, so
              // active-with-photo text always reads light regardless of the garment's color.
              const textTone = activePhoto ? 'text-zinc-200' : cardIsLight ? 'text-zinc-700' : isActive ? 'text-zinc-300' : 'text-muted';

              return (
                <button
                  key={p.id}
                  id={`coverflow-card-${p.id}`}
                  onClick={() => setProductIndex(i)}
                  aria-label={`Ver ${p.name}`}
                  className={`absolute top-1/2 left-1/2 flex flex-col justify-between p-4 sm:p-5 border transition-all duration-500 ease-out overflow-hidden ${
                    isActive ? 'border-accent shadow-[0_18px_40px_-12px_rgba(0,0,0,0.25)] cursor-default' : 'border-line bg-panel cursor-pointer'
                  }`}
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    marginLeft: -CARD_W / 2,
                    marginTop: -CARD_H / 2,
                    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    opacity,
                    zIndex,
                    pointerEvents: hidden ? 'none' : 'auto',
                    backgroundColor: cardColorHex,
                    transitionProperty: 'transform, opacity, background-color',
                  }}
                >
                  {activePhoto && (
                    <>
                      <img
                        key={activePhoto}
                        src={activePhoto}
                        alt={`${p.name} color ${currentColor}, tela ${currentFabric}`}
                        className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/70 pointer-events-none" />
                    </>
                  )}

                  <div className={`relative z-10 flex justify-between text-[8px] font-mono uppercase tracking-widest ${textTone}`}>
                    <span>{p.id.toUpperCase()}</span>
                    <span>2026</span>
                  </div>
                  {!activePhoto && (
                    <div className="relative z-10 text-center my-auto select-none">
                      <span className={`font-display text-5xl sm:text-6xl font-medium ${isActive ? (cardIsLight ? 'text-zinc-900' : 'text-white') : 'text-ink'}`}>
                        {p.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className={`relative z-10 text-center ${textTone}`}>
                    <div className="font-sans text-[11px] font-semibold uppercase tracking-wide">{p.name}</div>
                    {isActive && (
                      <div className="text-[9px] font-mono uppercase tracking-widest mt-1">{currentColor}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            id="coverflow-next-product"
            onClick={() => spinProduct(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 border border-line bg-paper-soft hover:border-accent hover:text-accent transition-colors flex items-center justify-center"
            aria-label="Prenda siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mt-2 mb-10">
          <span className="text-[9px] uppercase tracking-widest text-muted font-mono">
            Prenda {productIndex + 1} / {PRODUCTS.length}
          </span>
        </div>

        {/* Color rail for the active garment */}
        <div className="max-w-md mx-auto border border-line bg-paper-soft">
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-line">
            <button
              id="color-rail-prev"
              onClick={() => spinColor(-1)}
              className="p-1.5 border border-line hover:border-accent hover:text-accent transition-colors shrink-0"
              aria-label="Color anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 flex items-center justify-center gap-1.5 flex-wrap">
              {product.colors.map((color, i) => (
                <button
                  id={`color-rail-dot-${color.toLowerCase().replace(/\s+/g, '-')}`}
                  key={color}
                  onClick={() => setColorIndex(i)}
                  title={color}
                  aria-label={`Ver color ${color}`}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    i === colorIndex ? 'ring-2 ring-accent ring-offset-2 ring-offset-paper-soft border-ink scale-110' : 'border-line'
                  }`}
                  style={{ backgroundColor: COLOR_HEX[color] || '#18181b' }}
                />
              ))}
            </div>
            <button
              id="color-rail-next"
              onClick={() => spinColor(1)}
              className="p-1.5 border border-line hover:border-accent hover:text-accent transition-colors shrink-0"
              aria-label="Color siguiente"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 border-b border-line text-[10px] font-mono uppercase tracking-widest">
            <span className="text-ink font-bold">{currentColor}</span>
            <span className="text-muted">{colorIndex + 1} / {product.colors.length}</span>
          </div>

          {/* Fabric buttons for this garment */}
          <div className="px-4 py-3.5 border-b border-line">
            <span className="text-[9px] uppercase tracking-widest text-muted font-mono block mb-2">
              Telas disponibles
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.fabrics.map((fabric, i) => (
                <button
                  id={`fabric-tab-${fabric.toLowerCase().replace(/\s+/g, '-')}`}
                  key={fabric}
                  onClick={() => setFabricIndex(i)}
                  className={`text-[10px] uppercase tracking-wide font-semibold px-3 py-1.5 border transition-colors ${
                    i === fabricIndex
                      ? 'bg-accent text-paper-soft border-accent'
                      : 'bg-paper text-muted border-line hover:text-ink hover:border-accent'
                  }`}
                >
                  {fabric}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-muted">
                Tela seleccionada: <span className="text-ink font-medium">{currentFabric}</span>
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono text-base font-black text-ink">S/. {product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <span className="font-mono text-xs text-muted line-through">S/. {product.oldPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="coverflow-favorite-btn"
                onClick={() => onToggleFavorite(product)}
                className={`p-2.5 border transition-colors ${
                  isFavorite ? 'bg-ink text-paper-soft border-ink' : 'text-muted border-line hover:text-ink'
                }`}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                id="coverflow-view-detail-btn"
                onClick={() => onQuickView(product)}
                className="flex items-center gap-2 bg-ink text-paper-soft hover:bg-accent text-[10px] uppercase tracking-widest font-bold py-2.5 px-5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Ver ficha y comprar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
