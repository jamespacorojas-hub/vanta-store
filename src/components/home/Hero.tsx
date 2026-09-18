import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Shield, Truck, Layers, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { HERO_ROTATING_BANNERS } from '../../utils/banners';

interface HeroProps {
  onExploreClick: () => void;
  onTabSelect: (tabId: string) => void;
}

export default function Hero({ onExploreClick, onTabSelect }: HeroProps) {
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalCampaigns = HERO_ROTATING_BANNERS.length;
  const campaign = HERO_ROTATING_BANNERS[activeCampaignIndex];

  // Auto-rotation every 5.5 seconds (paused on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveCampaignIndex((prev) => (prev + 1) % totalCampaigns);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, totalCampaigns]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveCampaignIndex((prev) => (prev - 1 + totalCampaigns) % totalCampaigns);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveCampaignIndex((prev) => (prev + 1) % totalCampaigns);
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
    <section id="hero-banner" className="relative w-full bg-paper text-ink pt-16 sm:pt-18 border-b border-line select-none">
      {/* Campaign Banner Frame with controlled height */}
      <div
        className="w-full relative overflow-hidden bg-neutral-950 group flex items-center justify-center max-h-[300px] sm:max-h-[380px] md:max-h-[440px] lg:max-h-[480px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          id="hero-banner-cta"
          onClick={onExploreClick}
          className="block w-full cursor-pointer relative flex items-center justify-center overflow-hidden"
          aria-label="Descubre la colección — ir al catálogo"
        >
          {/* Ambient blurred backdrop on ultra-wide screens */}
          <img
            src={campaign.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
          />
          <img
            key={campaign.image}
            src={campaign.image}
            alt={`VANTA — ${campaign.title}. ${campaign.subtitle}`}
            className="relative z-10 w-full max-h-[300px] sm:max-h-[380px] md:max-h-[440px] lg:max-h-[480px] object-contain block mx-auto transition-transform duration-700 ease-out group-hover:scale-[1.01] animate-in fade-in duration-500"
          />
          {/* Subtle atmospheric vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none z-10" />
        </button>

        {/* Prev / Next Slide Arrow Controls */}
        <button
          onClick={handlePrev}
          aria-label="Banner anterior"
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-75 hover:opacity-100 hover:scale-105 cursor-pointer shadow-xl"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Banner siguiente"
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all opacity-75 hover:opacity-100 hover:scale-105 cursor-pointer shadow-xl"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Floating Campaign Switcher Tabs (Bottom Right of Banner) */}
        <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-8 z-20 flex items-center gap-1.5 bg-black/65 backdrop-blur-xl p-1.5 border border-white/15 shadow-2xl rounded-full">
          {HERO_ROTATING_BANNERS.map((c, i) => (
            <button
              key={c.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveCampaignIndex(i);
              }}
              className={`text-[9.5px] sm:text-xs font-sans uppercase tracking-wider px-3 sm:px-4 py-1.5 transition-all cursor-pointer rounded-full ${
                activeCampaignIndex === i
                  ? 'bg-white text-black font-extrabold shadow-md scale-102'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              0{i + 1}
            </button>
          ))}
        </div>

        {/* Floating Badge (Top Left of Banner) */}
        <div className="absolute top-3 left-3 sm:top-6 sm:left-8 z-20 flex flex-wrap gap-2 items-center">
          <span className="bg-black/65 backdrop-blur-xl text-white text-[9px] sm:text-[11px] font-sans tracking-wider uppercase px-3.5 py-1.5 border border-white/15 font-bold shadow-xl flex items-center gap-2 rounded-full">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            {campaign.tag}
          </span>
          <span className="hidden sm:flex bg-accent/90 backdrop-blur-xl text-white text-[9px] sm:text-[11px] font-sans tracking-wider uppercase px-3 py-1.5 border border-accent/40 font-bold shadow-xl items-center gap-1.5 rounded-full">
            <Flame className="w-3.5 h-3.5" />
            PROMOS 2X Y 3X
          </span>
        </div>

        {/* Animated Timer Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15 overflow-hidden z-20">
          <div
            key={activeCampaignIndex}
            className="h-full bg-accent transition-all duration-300"
            style={{
              animation: isPaused ? 'none' : 'timer-progress 5.5s linear infinite',
            }}
          />
        </div>
      </div>

      {/* Hero Actions & Quick Access Deck */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Action Buttons */}
          <div className="md:col-span-6 grid grid-cols-2 gap-2.5 sm:flex sm:gap-3">
            <button
              id="hero-explore-btn"
              onClick={onExploreClick}
              className="bg-ink text-paper hover:opacity-95 font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-new-drop-btn"
              onClick={() => onTabSelect('lanzamientos')}
              className="bg-panel hover:bg-paper-soft text-ink border border-line hover:border-accent/40 font-sans font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Nuevos Drops</span>
            </button>
          </div>

          {/* Quick Category Chips */}
          <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-sans font-semibold text-muted uppercase tracking-wider hidden lg:inline mr-1">
              ACCESO RÁPIDO:
            </span>
            {['Camisas', 'Poleras', 'Camiseros', 'Clásicos', 'Manga Larga'].map((cat) => (
              <button
                key={cat}
                onClick={onExploreClick}
                className="text-xs font-sans text-muted hover:text-ink px-3.5 py-2 bg-panel hover:bg-paper-soft border border-line hover:border-ink/40 transition-all uppercase whitespace-nowrap cursor-pointer rounded-full font-medium"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Luxury Credibility Pillars */}
        <div className="mt-8 pt-6 border-t border-line grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
          <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-panel/70 border border-line rounded-2xl hover:border-accent/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="w-4 h-4 text-ink" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-sans font-bold text-ink uppercase block">420 GSM PESADO</span>
              <span className="text-[10px] sm:text-[11px] font-sans text-muted leading-tight block">Estructura & caída boxy fit</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-panel/70 border border-line rounded-2xl hover:border-accent/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-sans font-bold text-ink uppercase block">19 TONALIDADES</span>
              <span className="text-[10px] sm:text-[11px] font-sans text-muted leading-tight block">Teñido reactivo anti-desgaste</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-panel/70 border border-line rounded-2xl hover:border-accent/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-4 h-4 text-ink" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-sans font-bold text-ink uppercase block">ENVÍOS EXPRESS</span>
              <span className="text-[10px] sm:text-[11px] font-sans text-muted leading-tight block">24-48h Lima & Provincias</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-panel/70 border border-line rounded-2xl hover:border-accent/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-paper border border-line flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-4 h-4 text-ink" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-sans font-bold text-ink uppercase block">GARANTÍA TOTAL</span>
              <span className="text-[10px] sm:text-[11px] font-sans text-muted leading-tight block">Cambios de talla en 7 días</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
