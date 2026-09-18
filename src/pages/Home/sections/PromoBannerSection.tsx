import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, ChevronLeft, ChevronRight, Clock, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../../../types';
import { PRODUCTS } from '../../../data';
import { getGarmentPhoto } from '../../../utils/productImages';
import { getColorClass } from '../../../utils/colorSwatch';

interface PromoBannerSectionProps {
  promotionalProduct: Product;
  onQuickView: (product: Product) => void;
}

export default function PromoBannerSection({ promotionalProduct, onQuickView }: PromoBannerSectionProps) {
  // Use all store products for the rotating carousel, placing promotionalProduct first
  const promoList = [
    promotionalProduct,
    ...PRODUCTS.filter((p) => p.id !== promotionalProduct.id),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const currentProduct = promoList[currentIndex] || promotionalProduct;

  // Auto-rotate product every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promoList.length);
      setSelectedColorIndex(0);
    }, 8000);
    return () => clearInterval(timer);
  }, [promoList.length]);

  // Reset selected color index when product changes
  useEffect(() => {
    setSelectedColorIndex(0);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + promoList.length) % promoList.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % promoList.length);
  };

  // Get current active color & photo
  const currentColor = currentProduct.colors[selectedColorIndex] || currentProduct.colors[0];
  const currentFabric = currentProduct.fabrics[0] || '';
  const currentPhoto =
    getGarmentPhoto(currentProduct.id, currentFabric, currentColor) ||
    currentProduct.images[selectedColorIndex] ||
    currentProduct.images[0];

  return (
    <section id="homepage-promo-banner" className="bg-panel/70 border-y border-line overflow-hidden py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-paper-soft border border-line rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 min-h-[460px]">
          {/* Left Promo Info */}
          <div className="p-6 sm:p-12 lg:p-16 flex flex-col justify-between space-y-6 z-10">
            <div className="space-y-4">
              {/* Live Rotation Indicator Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center space-x-1.5 border border-accent/30 bg-accent/10 px-3 py-1 text-xs uppercase text-accent font-bold rounded-full">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Oferta Limitada</span>
                </div>

                <div className="inline-flex items-center space-x-1.5 border border-line bg-panel px-3 py-1 text-xs text-muted uppercase rounded-full">
                  <span className="w-2 h-2 bg-accent rounded-full animate-ping" />
                  <Clock className="w-3 h-3 text-muted" />
                  <span>Rotación en vivo ({currentIndex + 1}/{promoList.length})</span>
                </div>
              </div>

              {/* Product Title & Description with smooth animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProduct.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-4"
                >
                  <h3 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-ink leading-tight tracking-tight">
                    {currentProduct.name}
                  </h3>
                  <p className="text-muted text-xs sm:text-sm font-normal leading-relaxed max-w-md">
                    {currentProduct.description || 'Prenda de edición especial desarrollada con fibras naturales de alto gramaje y patronaje urbano contemporáneo.'}
                  </p>

                  {/* Fabrics & Features */}
                  <div className="flex flex-wrap gap-2 pt-1 text-xs uppercase tracking-wider text-muted">
                    <span className="border border-line px-3 py-1 rounded-full bg-panel text-ink font-medium">
                      Categoría: {currentProduct.category}
                    </span>
                    <span className="border border-line px-3 py-1 rounded-full bg-panel text-ink font-medium">
                      Tejido: {currentProduct.fabrics.join(' • ')}
                    </span>
                  </div>

                  {/* Price block */}
                  <div className="flex items-baseline space-x-3 pt-2">
                    <span className="font-sans text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                      S/. {currentProduct.price.toFixed(2)}
                    </span>
                    {currentProduct.oldPrice && (
                      <span className="text-sm sm:text-base text-muted line-through">
                        S/. {currentProduct.oldPrice.toFixed(2)}
                      </span>
                    )}
                    {currentProduct.oldPrice && (
                      <span className="text-xs font-bold bg-rose-500/15 text-accent px-3 py-1 rounded-full uppercase tracking-wider">
                        -{Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Promo Tiers Badges */}
                  {currentProduct.promoTiers && currentProduct.promoTiers.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <span className="text-[10.5px] font-mono text-accent font-bold uppercase tracking-wider block">
                        🔥 Packs promocionales disponibles:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentProduct.promoTiers.map((t) => (
                          <span
                            key={t.label}
                            className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/30 text-ink flex items-center gap-1"
                          >
                            <span>{t.label}</span>
                            <span className="text-emerald-500 font-normal">· S/ {t.unitPrice.toFixed(2)} c/u</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action buttons & carousel navigation */}
            <div className="space-y-4 pt-4 border-t border-line">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="promo-cta-buy-btn"
                  onClick={() => onQuickView(currentProduct)}
                  className="bg-ink text-paper hover:opacity-95 text-xs font-sans font-bold uppercase tracking-wider py-3.5 px-7 rounded-full transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ver Prenda y Comprar</span>
                </button>

                {/* Prev / Next arrows */}
                <div className="flex items-center space-x-2">
                  <button
                    id="promo-prev-btn"
                    onClick={handlePrev}
                    className="p-3 rounded-full border border-line bg-panel text-muted hover:border-ink hover:text-ink hover:bg-paper transition-all cursor-pointer shadow-xs"
                    aria-label="Prenda anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    id="promo-next-btn"
                    onClick={handleNext}
                    className="p-3 rounded-full border border-line bg-panel text-muted hover:border-accent hover:text-accent hover:bg-paper transition-all cursor-pointer shadow-xs"
                    aria-label="Siguiente prenda"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Carousel Dot Indicators */}
              <div className="flex items-center space-x-2">
                {promoList.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all cursor-pointer rounded-full ${
                      idx === currentIndex
                        ? 'w-8 h-2 bg-accent shadow-sm'
                        : 'w-2 h-2 bg-line hover:bg-zinc-500'
                    }`}
                    title={p.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Stage — Real Product Garment Photo with interactive color swatches */}
          <div className="relative min-h-[360px] sm:min-h-[460px] bg-panel select-none flex flex-col justify-between overflow-hidden group">
            {/* Main Photo with transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentProduct.id}-${currentColor}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 w-full h-full"
              >
                {currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt={`${currentProduct.name} - ${currentColor}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Top Info Overlay */}
            <div className="relative z-10 p-6 flex justify-between items-start text-xs text-white uppercase tracking-wider drop-shadow-md">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10 text-zinc-300 rounded-full font-medium">
                VANTA // DROP DESTACADO
              </span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10 font-bold text-white rounded-full">
                {currentColor}
              </span>
            </div>

            {/* Bottom Info & Interactive Color Selector Overlay */}
            <div className="relative z-10 p-6 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent text-white">
              {/* Color Swatch Picker */}
              <div className="space-y-1.5">
                <span className="text-xs text-zinc-300 uppercase tracking-wider block font-medium">
                  Variantes de color disponibles:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.colors.map((colorName, idx) => (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`flex items-center gap-2 text-xs uppercase tracking-wider px-3 py-1.5 transition-all cursor-pointer rounded-full border ${
                        idx === selectedColorIndex
                          ? 'bg-white text-black font-extrabold border-white scale-105 shadow-md'
                          : 'bg-black/60 backdrop-blur-md text-zinc-300 border-white/15 hover:border-white hover:text-white'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full border ${getColorClass(colorName)}`} />
                      <span>{colorName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability & Stock status bar */}
              <div className="pt-2 border-t border-white/15 flex justify-between items-center text-xs uppercase tracking-wider text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  Alta demanda
                </span>
                <span>Stock: {currentProduct.stock} unidades</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
