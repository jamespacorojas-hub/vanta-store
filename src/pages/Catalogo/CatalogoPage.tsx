import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  ShoppingBag,
  Send,
  Sparkles,
  Truck,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Product } from '../../types';
import { PRODUCTS } from '../../data';
import { COLOR_HEX } from '../../utils/colorSwatch';
import { getGarmentPhoto } from '../../utils/productImages';

interface CatalogoPageProps {
  favorites: Product[];
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  onAddToCart?: (
    product: Product,
    quantity: number,
    size: string,
    color: string,
    fabric?: string,
    sleeve?: string
  ) => void;
}

const FABRIC_SPECS: Record<string, { gsm: string; desc: string; feel: string }> = {
  Zyko: {
    gsm: '280 GSM',
    desc: 'Entramado rústico de hilos cruzados similar al lino grueso. Fresco y de caída orgánica.',
    feel: 'Rústico / Fresco',
  },
  Waffle: {
    gsm: '400 GSM',
    desc: 'Estructura alveolar tridimensional (nido de abeja). Caída pesada y acabado mate.',
    feel: 'Alveolar / Pesado',
  },
  Waffer: {
    gsm: '420 GSM',
    desc: 'Waffle extra-grueso de alta ingeniería. Mayor abrigo y máxima estructura.',
    feel: 'Estructurado / Rígido',
  },
  Piqué: {
    gsm: '300 GSM',
    desc: 'Punto de arroz característico de alta costura. Gran transpirabilidad y firmeza.',
    feel: 'Granulado / Firme',
  },
  Jersey: {
    gsm: '240 GSM',
    desc: 'Punto liso clásico de algodón peinado. Suave, ligero y flexible.',
    feel: 'Ultra Suave / Fluido',
  },
  Clásico: {
    gsm: '280 GSM',
    desc: 'Algodón plano de alta torsión y acabado pulido. Look liso, sobrio y uniforme.',
    feel: 'Compacto / Sobrio',
  },
  Clásica: {
    gsm: '280 GSM',
    desc: 'Algodón plano de alta torsión y acabado pulido. Look liso, sobrio y uniforme.',
    feel: 'Compacto / Sobrio',
  },
};

export default function CatalogoPage({
  favorites,
  onQuickView,
  onToggleFavorite,
  onAddToCart,
}: CatalogoPageProps) {
  const [productIndex, setProductIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [fabricIndex, setFabricIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [addedToast, setAddedToast] = useState<string>('');

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const product = PRODUCTS[productIndex];
  const currentColor = product.colors[colorIndex] || product.colors[0];
  const currentColorHex = COLOR_HEX[currentColor] || '#18181b';
  const currentFabric = product.fabrics[fabricIndex] || product.fabrics[0];
  const currentPhoto =
    getGarmentPhoto(product.id, currentFabric, currentColor) ||
    product.images[0];
  const isFavorite = favorites.some((f) => f.id === product.id);
  const fabricSpec = FABRIC_SPECS[currentFabric] || {
    gsm: '300 GSM',
    desc: 'Tejido premium seleccionado para confección de alto gramaje.',
    feel: 'Premium Blend',
  };

  // Reset color and fabric index when switching garment
  useEffect(() => {
    setColorIndex(0);
    setFabricIndex(0);
  }, [productIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        spinProduct(-1);
      } else if (e.key === 'ArrowRight') {
        spinProduct(1);
      } else if (e.key === 'ArrowUp') {
        spinColor(-1);
      } else if (e.key === 'ArrowDown') {
        spinColor(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [productIndex, colorIndex, product.colors.length]);

  const spinProduct = (dir: 1 | -1) => {
    setProductIndex((prev) => (prev + dir + PRODUCTS.length) % PRODUCTS.length);
  };

  const spinColor = (dir: 1 | -1) => {
    setColorIndex(
      (prev) => (prev + dir + product.colors.length) % product.colors.length
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    // Only spin if predominantly a horizontal swipe
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      if (diffX > 0) spinProduct(1);
      else spinProduct(-1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart(
        product,
        1,
        selectedSize,
        currentColor,
        currentFabric,
        product.sleeves?.[0]
      );
      setAddedToast(`✓ ${product.name} agregada a la bolsa`);
      setTimeout(() => setAddedToast(''), 2500);
    } else {
      onQuickView(product);
    }
  };

  const handleBuyOnWhatsApp = () => {
    const formattedMessage = `Hola, VANTA. Deseo comprar desde el Catálogo 3D:

• Prenda: ${product.name}
• Color: ${currentColor}
• Tejido: ${currentFabric} (${fabricSpec.gsm})
• Talla: ${selectedSize}
• Precio: S/ ${product.price.toFixed(2)}

Por favor confirmar disponibilidad y métodos de pago oficiales. Gracias.`;

    const whatsappUrl = `https://wa.me/51904536406?text=${encodeURIComponent(
      formattedMessage
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      id="catalogo-page"
      className="pt-[78px] sm:pt-[96px] md:pt-[130px] bg-paper text-ink min-h-screen relative overflow-x-clip selection:bg-accent selection:text-white"
    >
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        {/* Top Breadcrumb & Badge */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            id="back-to-home-link-catalogo"
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-ink transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Volver al inicio</span>
          </Link>

          <span className="text-[10px] font-mono uppercase tracking-widest text-muted bg-panel px-3 py-1 rounded-full border border-line">
            SHOWCASE 3D // DROP 2026
          </span>
        </div>

        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-[10px] font-mono tracking-[0.3em] text-accent font-bold uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            VISUALIZADOR EN TIEMPO REAL
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight uppercase">
            Catálogo Interactivo
          </h1>
          <p className="text-muted text-xs sm:text-sm font-sans font-light max-w-md mx-auto">
            Explora cada silueta y personaliza en vivo el tejido, el color y la talla.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 p-1 bg-panel border border-line rounded-full shadow-xs max-w-full overflow-x-auto no-scrollbar">
            {PRODUCTS.map((p, i) => {
              const isSelected = i === productIndex;
              return (
                <button
                  id={`product-tab-${p.id}`}
                  key={p.id}
                  onClick={() => setProductIndex(i)}
                  className={`text-[10px] sm:text-xs uppercase tracking-wider font-mono font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent text-white shadow-sm scale-102'
                      : 'text-muted hover:text-ink hover:bg-paper'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3D COVERFLOW STAGE ── */}
        <div className="relative mb-8 sm:mb-12">
          {/* Controls Left / Right */}
          <button
            id="coverflow-prev-product"
            onClick={() => spinProduct(-1)}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-paper/90 backdrop-blur-md border border-line rounded-full hover:border-accent text-muted hover:text-ink transition-all flex items-center justify-center shadow-md hover:scale-105 cursor-pointer"
            aria-label="Prenda anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            id="coverflow-next-product"
            onClick={() => spinProduct(1)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-paper/90 backdrop-blur-md border border-line rounded-full hover:border-accent text-muted hover:text-ink transition-all flex items-center justify-center shadow-md hover:scale-105 cursor-pointer"
            aria-label="Prenda siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 3D Stage Container */}
          <div
            id="coverflow-stage"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative h-[360px] sm:h-[420px] overflow-hidden flex items-center justify-center select-none"
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

              const cardW = 260;
              const cardH = 350;

              const translateX = offset * (cardW * 0.75);
              const scale = isActive ? 1 : dist === 1 ? 0.84 : 0.68;
              const rotateY = offset === 0 ? 0 : offset > 0 ? -24 : 24;
              const opacity = hidden ? 0 : isActive ? 1 : dist === 1 ? 0.65 : 0.3;
              const zIndex = 30 - dist;

              const cardPhoto = isActive
                ? currentPhoto
                : getGarmentPhoto(p.id, p.fabrics[0], p.colors[0]) ||
                  p.images[0];

              return (
                <div
                  key={p.id}
                  id={`coverflow-card-${p.id}`}
                  onClick={() => !isActive && setProductIndex(i)}
                  className={`absolute top-1/2 left-1/2 flex flex-col justify-between p-4 border transition-all duration-500 ease-out overflow-hidden rounded-lg shadow-xl ${
                    isActive
                      ? 'border-accent shadow-[0_10px_35px_rgba(225,29,72,0.25)] bg-paper-soft cursor-default'
                      : 'border-line bg-panel cursor-pointer hover:border-muted'
                  }`}
                  style={{
                    width: `${cardW}px`,
                    height: `${cardH}px`,
                    marginLeft: `-${cardW / 2}px`,
                    marginTop: `-${cardH / 2}px`,
                    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    opacity,
                    zIndex,
                    pointerEvents: hidden ? 'none' : 'auto',
                  }}
                >
                  {/* Photo Display */}
                  <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
                    {cardPhoto ? (
                      <img
                        key={cardPhoto}
                        src={cardPhoto}
                        alt={`${p.name} - ${currentColor}`}
                        className="w-full h-full object-contain transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display text-5xl font-bold text-muted/20">
                        {p.name[0]}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-3 border-t border-line text-center space-y-1">
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
                      {p.name}
                    </h3>
                    {isActive ? (
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-muted">
                        <span
                          className="w-2 h-2 rounded-full border border-line"
                          style={{ backgroundColor: currentColorHex }}
                        />
                        <span className="text-ink font-bold">{currentColor}</span>
                        <span>•</span>
                        <span className="text-accent font-bold">{currentFabric}</span>
                      </div>
                    ) : (
                      <span className="text-[9px] font-mono text-muted uppercase">
                        Tocar para ver
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {PRODUCTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setProductIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === productIndex
                    ? 'w-6 bg-accent'
                    : 'w-1.5 bg-line hover:bg-muted'
                }`}
                aria-label={`Ir a producto ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── CLEAN STUDIO CONTROL CONSOLE ── */}
        <div className="max-w-4xl mx-auto bg-paper-soft border border-line rounded-lg shadow-xl overflow-hidden">
          {/* Header Strip */}
          <div className="bg-panel px-6 py-3 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                PERSONALIZAR // {product.name}
              </span>
            </div>
            <span className="font-mono text-[11px] text-muted">
              Stock: <strong className="text-ink">{product.stock} unidades</strong>
            </span>
          </div>

          {/* Controls Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Left: Colors & Swatches */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted font-medium">
                  Color: <strong className="text-ink font-semibold">{currentColor}</strong>
                </span>
                <span className="font-mono text-[10px] text-muted">
                  ({colorIndex + 1}/{product.colors.length})
                </span>
              </div>

              {/* Swatches */}
              <div className="p-2.5 bg-panel/50 border border-line rounded-sm flex flex-wrap gap-2.5 items-center">
                {product.colors.map((color, i) => {
                  const isSel = i === colorIndex;
                  const hex = COLOR_HEX[color] || '#18181b';
                  return (
                    <button
                      key={color}
                      onClick={() => setColorIndex(i)}
                      title={color}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all cursor-pointer p-0.5 relative flex items-center justify-center ${
                        isSel
                          ? 'ring-2 ring-accent ring-offset-2 ring-offset-paper-soft shadow-sm'
                          : 'border border-line hover:border-ink/50 opacity-80 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <span
                        className="w-full h-full rounded-full block shadow-inner border border-black/20"
                        style={{ backgroundColor: hex }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Sizes */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-medium">
                    Talla: <strong className="text-ink font-semibold">{selectedSize}</strong>
                  </span>
                  <span className="font-mono text-[10px] text-muted">Boxy Fit</span>
                </div>

                <div className="flex gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`flex-1 py-2 font-mono text-xs font-bold uppercase transition-all cursor-pointer rounded-sm border ${
                        selectedSize === sz
                          ? 'bg-accent text-white border-accent shadow-sm'
                          : 'bg-panel text-muted border-line hover:border-ink/40 hover:text-ink'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Fabrics, Price & CTAs */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Fabrics */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-medium">
                    Tejido: <strong className="text-ink font-semibold">{currentFabric}</strong>
                  </span>
                  <span className="font-mono text-[10px] text-accent font-bold">
                    {fabricSpec.gsm} · {fabricSpec.feel}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.fabrics.map((fab, i) => {
                    const isSel = i === fabricIndex;
                    return (
                      <button
                        key={fab}
                        onClick={() => setFabricIndex(i)}
                        className={`px-3.5 py-1.5 text-xs font-mono uppercase font-bold transition-all cursor-pointer rounded-sm border ${
                          isSel
                            ? 'bg-ink text-paper border-ink shadow-sm'
                            : 'bg-panel text-muted border-line hover:border-ink/40 hover:text-ink'
                        }`}
                      >
                        {fab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-line">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono text-muted uppercase">PRECIO:</span>
                  <span className="font-mono text-2xl font-black text-ink">
                    S/ {product.price.toFixed(2)}
                  </span>
                </div>

                {addedToast && (
                  <div className="py-1.5 px-3 bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-mono font-bold text-center rounded-sm animate-in fade-in">
                    {addedToast}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleAddToCartClick}
                    className="w-full bg-ink text-paper hover:opacity-90 font-mono font-bold text-xs uppercase tracking-wider py-3 px-3 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md rounded-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Añadir a la Bolsa</span>
                  </button>

                  <button
                    onClick={handleBuyOnWhatsApp}
                    className="w-full bg-[#161620] hover:bg-[#20202e] text-white border border-zinc-700 font-mono font-bold text-xs uppercase tracking-wider py-3 px-3 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md rounded-sm"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <button
                  onClick={() => onQuickView(product)}
                  className="w-full text-center text-xs font-mono text-muted hover:text-accent flex items-center justify-center gap-1 pt-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver ficha técnica y guía de medidas</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="bg-panel px-6 py-3 border-t border-line flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-muted">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-accent" />
              <span>Envíos rápidos a todo el Perú</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>100% Algodón Peinado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-accent" />
              <span>Garantía y cambios de talla</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
