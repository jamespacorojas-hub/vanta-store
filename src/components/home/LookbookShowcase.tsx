import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { ALL_BANNERS } from '../../utils/banners';

interface LookbookShowcaseProps {
  onExploreClick: () => void;
}

// Curated selection of artistic lookbook banners from banner-image
const LOOKBOOK_SLIDES = [
  ALL_BANNERS[9], // banner-10: Stained glass vitral masterpiece
  ALL_BANNERS[1], // banner-2: Twilight Gothic architecture
  ALL_BANNERS[5], // banner-6: Architectural daylight panorama
  ALL_BANNERS[4], // banner-5: Minimalist neutral lineup
  ALL_BANNERS[7], // banner-8: Streetwear collective
];

export default function LookbookShowcase({ onExploreClick }: LookbookShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = LOOKBOOK_SLIDES.length;
  const slide = LOOKBOOK_SLIDES[currentIndex];

  // Auto-rotate every 5.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="lookbook-showcase"
      className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4 border-b border-line pb-4">
        <div>
          <span className="text-[10px] font-sans tracking-[0.25em] text-accent uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            GALERÍA EDITORIAL EN VIVO
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-ink tracking-tight uppercase mt-1">
            Lookbook Atelier 2026
          </h2>
          <p className="text-muted text-xs sm:text-sm font-normal max-w-lg mt-1">
            Perspectivas exclusivas de nuestra indumentaria urbana. La auto-rotación cambia entre ediciones diurnas, nocturnas y vitrales.
          </p>
        </div>

        {/* Slide Counter & Manual Controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted uppercase">
            Campaña <strong className="text-ink">0{currentIndex + 1}</strong> / 0{total}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrev}
              aria-label="Lookbook anterior"
              className="p-2.5 rounded-full border border-line bg-panel hover:bg-paper text-muted hover:text-ink transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Lookbook siguiente"
              className="p-2.5 rounded-full border border-line bg-panel hover:bg-paper text-muted hover:text-accent transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Banner Stage */}
      <div
        className="relative rounded-3xl overflow-hidden border border-line shadow-2xl bg-paper-soft group cursor-pointer"
        onClick={onExploreClick}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.title}
          className="w-full h-auto object-contain block transition-transform duration-700 ease-out group-hover:scale-[1.01] animate-in fade-in duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Floating Top Tag */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
          <span className="bg-black/65 backdrop-blur-xl text-white text-[9.5px] sm:text-xs font-sans tracking-wider uppercase px-4 py-1.5 border border-white/15 font-bold shadow-xl flex items-center gap-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {slide.tag}
          </span>
        </div>

        {/* Bottom Editorial Caption & Action */}
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-xl text-white space-y-1">
            <h3 className="font-heading font-black text-lg sm:text-2xl lg:text-3xl uppercase tracking-tight drop-shadow-md">
              {slide.title}
            </h3>
            <p className="text-zinc-300 text-xs sm:text-sm font-light drop-shadow-sm line-clamp-2">
              {slide.subtitle}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExploreClick();
            }}
            className="self-start sm:self-auto bg-white text-black hover:bg-accent hover:text-white font-sans font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full transition-all flex items-center gap-2 shadow-xl hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <span>Ver Colección</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Timer Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15 overflow-hidden">
          <div
            key={currentIndex}
            className="h-full bg-accent transition-all duration-300"
            style={{
              animation: isPaused ? 'none' : 'timer-progress 5.5s linear infinite',
            }}
          />
        </div>
      </div>

      {/* Thumbnail Nav Bar */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 mt-4">
        {LOOKBOOK_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            className={`relative rounded-xl overflow-hidden border transition-all cursor-pointer aspect-[16/9] ${
              idx === currentIndex
                ? 'border-accent ring-2 ring-accent/50 shadow-md scale-102'
                : 'border-line opacity-60 hover:opacity-100'
            }`}
            title={s.title}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <span className="absolute bottom-1 right-1.5 text-[8px] sm:text-[9.5px] font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded-sm backdrop-blur-xs">
              0{idx + 1}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
