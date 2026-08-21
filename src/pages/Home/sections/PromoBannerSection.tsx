import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, ChevronLeft, ChevronRight, Clock, Sparkles, Eye, ShoppingBag } from 'lucide-react';
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
    <section id="homepage-promo-banner" className="bg-panel border-y border-line overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[460px]">
        {/* Left Promo Info */}
        <div className="p-8 sm:p-14 lg:p-20 flex flex-col justify-between space-y-6 z-10">
          <div className="space-y-4">
            {/* Live Rotation Indicator Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 border border-accent/30 bg-accent-soft px-3 py-1 text-[9px] tracking-[0.2em] uppercase text-accent font-bold">
                <Tag className="w-3.5 h-3.5" />
                <span>Oferta limitada de temporada</span>
              </div>

              <div className="inline-flex items-center space-x-1.5 border border-line bg-paper/60 px-2.5 py-1 text-[8.5px] font-mono tracking-wider text-muted uppercase">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
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
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-ink leading-tight">
                  {currentProduct.name}
                </h3>
                <p className="text-muted text-xs sm:text-sm font-light leading-relaxed max-w-md">
                  {currentProduct.description || 'Prenda de edición especial desarrollada con fibras naturales de alto gramaje y patronaje urbano contemporáneo.'}
                </p>

                {/* Fabrics & Features */}
                <div className="flex flex-wrap gap-2 pt-1 text-[9px] font-mono uppercase tracking-widest text-muted">
                  <span className="border border-line px-2 py-0.5 bg-paper">CAT: {currentProduct.category}</span>
                  <span className="border border-line px-2 py-0.5 bg-paper">TEJIDO: {currentProduct.fabrics.join(' / ')}</span>
                </div>

                {/* Price block */}
                <div className="flex items-baseline space-x-3 pt-2">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                    S/. {currentProduct.price.toFixed(2)}
                  </span>
                  {currentProduct.oldPrice && (
                    <span className="font-mono text-sm sm:text-base text-zinc-500 line-through">
                      S/. {currentProduct.oldPrice.toFixed(2)}
                    </span>
                  )}
                  {currentProduct.oldPrice && (
                    <span className="text-[9px] font-mono font-bold bg-rose-600 text-white px-2 py-0.5 uppercase tracking-wider">
                      -{Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action buttons & carousel navigation */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="promo-cta-buy-btn"
                onClick={() => onQuickView(currentProduct)}
                className="bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold uppercase tracking-widest py-3.5 px-7 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                VER PRENDA Y COMPRAR
              </button>

              {/* Prev / Next arrows */}
              <div className="flex items-center space-x-1.5">
                <button
                  id="promo-prev-btn"
                  onClick={handlePrev}
                  className="p-2.5 border border-zinc-700 bg-[#121218] text-zinc-200 hover:border-white hover:text-white hover:bg-[#1c1c28] transition-all cursor-pointer"
                  aria-label="Prenda anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="promo-next-btn"
                  onClick={handleNext}
                  className="p-2.5 border border-line bg-[#121218] text-zinc-200 hover:border-accent hover:text-white hover:bg-[#1c0810] transition-all cursor-pointer"
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
                  className={`transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 h-1.5 bg-accent shadow-[0_0_8px_rgba(225,29,72,0.6)] rounded-none'
                      : 'w-2 h-1.5 bg-line hover:bg-zinc-600 rounded-none'
                  }`}
                  title={p.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Stage — Real Product Garment Photo with interactive color swatches */}
        <div className="relative min-h-[380px] sm:min-h-[460px] bg-paper-soft border-l border-line select-none flex flex-col justify-between overflow-hidden group">
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
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              {/* Subtle gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-ink/20 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Top Info Overlay */}
          <div className="relative z-10 p-6 flex justify-between items-start text-[9px] font-mono text-white uppercase tracking-wider drop-shadow-md">
            <span className="bg-black/85 backdrop-blur-md px-2.5 py-1 border border-white/10 text-zinc-300">
              VANTA // SELECCIÓN EXCLUSIVA
            </span>
            <span className="bg-black/85 backdrop-blur-md px-2.5 py-1 border border-white/10 font-bold text-white">
              COLOR: {currentColor.toUpperCase()}
            </span>
          </div>

          {/* Bottom Info & Interactive Color Selector Overlay */}
          <div className="relative z-10 p-6 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent text-white">
            {/* Color Swatch Picker */}
            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest block">
                VER VARIANTES DE COLOR PARA ESTA PRENDA:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentProduct.colors.map((colorName, idx) => (
                  <button
                    key={colorName}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`flex items-center gap-1.5 text-[8.5px] font-mono uppercase tracking-wider px-2 py-1 transition-all cursor-pointer border ${
                      idx === selectedColorIndex
                        ? 'bg-white text-black font-bold border-white scale-105 shadow-md'
                        : 'bg-[#121218]/90 text-zinc-300 border-zinc-700 hover:border-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full border ${getColorClass(colorName)}`} />
                    <span>{colorName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability & Stock status bar */}
            <div className="pt-2 border-t border-white/15 flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-zinc-400">
              <span className="flex items-center gap-1 text-zinc-300 font-bold">
                <Sparkles className="w-3 h-3 text-rose-400" />
                DISPONIBILIDAD: ALTA DEMANDA
              </span>
              <span>STOCK: {currentProduct.stock} UNIDADES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
