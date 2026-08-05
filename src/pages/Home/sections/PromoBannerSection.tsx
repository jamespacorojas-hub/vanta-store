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
                  <span className="font-mono text-2xl sm:text-3xl font-black text-accent">
                    S/. {currentProduct.price.toFixed(2)}
                  </span>
                  {currentProduct.oldPrice && (
                    <span className="font-mono text-sm sm:text-base text-muted line-through">
                      S/. {currentProduct.oldPrice.toFixed(2)}
                    </span>
                  )}
                  {currentProduct.oldPrice && (
                    <span className="text-[9px] font-mono font-bold bg-accent text-paper-soft px-2 py-0.5 uppercase tracking-wider">
                      -{Math.round(((currentProduct.oldPrice - currentProduct.price) / currentProduct.oldPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action buttons & carousel navigation */}
          <div className="space-y-4 pt-4 border-t border-line">
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="promo-cta-buy-btn"
                onClick={() => onQuickView(currentProduct)}
                className="bg-ink text-paper-soft hover:bg-accent text-xs font-mono font-bold uppercase tracking-widest py-3.5 px-7 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                VER PRENDA Y COMPRAR
              </button>

              {/* Prev / Next arrows */}
              <div className="flex items-center space-x-1.5">
                <button
                  id="promo-prev-btn"
                  onClick={handlePrev}
                  className="p-2.5 border border-line bg-paper text-ink hover:bg-ink hover:text-paper-soft transition-all cursor-pointer"
                  aria-label="Prenda anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  id="promo-next-btn"
                  onClick={handleNext}
                  className="p-2.5 border border-line bg-paper text-ink hover:bg-ink hover:text-paper-soft transition-all cursor-pointer"
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
                      ? 'w-6 h-1.5 bg-ink rounded-none'
                      : 'w-2 h-1.5 bg-line hover:bg-muted rounded-none'
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
          <div className="relative z-10 p-6 flex justify-between items-start text-[9px] font-mono text-paper-soft uppercase tracking-wider drop-shadow-md">
            <span className="bg-ink/80 backdrop-blur-sm px-2.5 py-1 border border-paper/10">
              MONT STORE // SELECCIÓN EXCLUSIVA
            </span>
            <span className="bg-ink/80 backdrop-blur-sm px-2.5 py-1 border border-paper/10 font-bold">
              COLOR: {currentColor.toUpperCase()}
            </span>
          </div>

          {/* Bottom Info & Interactive Color Selector Overlay */}
          <div className="relative z-10 p-6 space-y-3 bg-gradient-to-t from-ink via-ink/80 to-transparent text-paper-soft">
            {/* Color Swatch Picker */}
            <div className="space-y-1.5">
              <span className="text-[8px] font-mono text-paper-soft/70 uppercase tracking-widest block">
                VER VARIANTES DE COLOR PARA ESTA PRENDA:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentProduct.colors.map((colorName, idx) => (
                  <button
                    key={colorName}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`flex items-center gap-1.5 text-[8.5px] font-mono uppercase tracking-wider px-2 py-1 transition-all cursor-pointer border ${
                      idx === selectedColorIndex
                        ? 'bg-paper-soft text-ink font-bold border-paper-soft scale-105 shadow-md'
                        : 'bg-ink/70 text-paper-soft/80 border-paper/20 hover:border-paper/60 hover:text-paper'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full border ${getColorClass(colorName)}`} />
                    <span>{colorName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability & Stock status bar */}
            <div className="pt-2 border-t border-paper/15 flex justify-between items-center text-[9px] font-mono uppercase tracking-widest text-paper-soft/80">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-accent-soft" />
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
