import React, { useState } from 'react';
import { ArrowRight, Sparkles, Shield, Truck, Layers, ChevronRight } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onTabSelect: (tabId: string) => void;
}

const HERO_CAMPAIGNS = [
  {
    id: 'campana-1',
    title: 'TU ESTILO. TU ESENCIA.',
    subtitle: 'Streetwear de alto gramaje, siluetas boxy y textiles de ingeniería peruana.',
    tag: 'DROP OTOÑO / INVIERNO 2026',
    image: '/imagenes/banner-1.png',
  },
  {
    id: 'campana-2',
    title: 'ARQUITECTURA DE SILUETAS',
    subtitle: 'Cortes contemporáneos desarrollados en Waffle, Piqué, Waffer y Jersey pesado.',
    tag: 'EDICIÓN LIMITADA ATELIER',
    image: '/imagenes/banner-2.png',
  },
  {
    id: 'campana-3',
    title: 'ESTILO. ACTITUD. COMODIDAD.',
    subtitle: 'Línea de esenciales urbanos con corte relajado y acabados premium.',
    tag: 'NUEVA COLECCIÓN DROP 2026',
    image: '/imagenes/banner-3.png',
  },
];

export default function Hero({ onExploreClick, onTabSelect }: HeroProps) {
  const [activeCampaignIndex, setActiveCampaignIndex] = useState(0);
  const campaign = HERO_CAMPAIGNS[activeCampaignIndex];

  return (
    <section id="hero-banner" className="relative w-full bg-paper text-ink pt-[60px] sm:pt-[72px] md:pt-[105px] border-b border-line">
      {/* Top Gothic Editorial Ticker */}
      <div className="bg-panel border-b border-line py-2 px-3 overflow-hidden select-none">
        <div className="flex items-center justify-center gap-3 sm:gap-4 text-[8.5px] sm:text-[10px] font-mono tracking-[0.22em] text-muted uppercase">
          <span className="text-accent font-bold">✦</span>
          <span className="font-bold text-ink">VANTA ATELIER</span>
          <span className="text-muted/60">•</span>
          <span className="hidden sm:inline">HIGH-END STREETWEAR</span>
          <span className="hidden sm:inline text-muted/60">•</span>
          <span className="text-ink font-semibold">420 GSM ALGODÓN PERUANO</span>
          <span className="text-muted/60">•</span>
          <span className="text-accent font-bold">†</span>
        </div>
      </div>

      {/* Full-Width Edge-to-Edge Campaign Banner Frame */}
      <div className="w-full relative overflow-hidden bg-paper-soft border-b border-line shadow-xl group">
        <button
          id="hero-banner-cta"
          onClick={onExploreClick}
          className="block w-full cursor-pointer relative"
          aria-label="Descubre la colección — ir al catálogo"
        >
          <img
            key={campaign.image}
            src={campaign.image}
            alt={`VANTA — ${campaign.title}. ${campaign.subtitle}`}
            className="w-full h-auto object-contain block transition-transform duration-700 group-hover:scale-[1.006]"
          />
          {/* Subtle atmospheric vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </button>

        {/* Floating Campaign Switcher Tabs (Bottom Right of Banner) */}
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-5 sm:right-6 z-20 flex items-center gap-1.5 bg-paper/90 backdrop-blur-md p-1 border border-line shadow-md rounded-xs">
          {HERO_CAMPAIGNS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveCampaignIndex(i)}
              className={`text-[8.5px] sm:text-[9.5px] font-mono uppercase tracking-wider px-2.5 sm:px-3.5 py-1 sm:py-1.5 transition-all cursor-pointer rounded-xs ${
                activeCampaignIndex === i
                  ? 'bg-ink text-paper font-bold shadow-xs'
                  : 'text-muted hover:text-ink bg-transparent'
              }`}
            >
              Campaña {i + 1}
            </button>
          ))}
        </div>

        {/* Floating Badge (Top Left of Banner) */}
        <div className="absolute top-2.5 left-2.5 sm:top-5 sm:left-6 z-20">
          <span className="bg-paper/90 backdrop-blur-md text-ink text-[8px] sm:text-[9.5px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 border border-line font-bold shadow-md flex items-center gap-1.5 rounded-xs">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            {campaign.tag}
          </span>
        </div>
      </div>

      {/* Hero Actions & Quick Access Deck */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Action Buttons */}
          <div className="md:col-span-6 grid grid-cols-2 gap-2 sm:flex sm:gap-3">
            <button
              id="hero-explore-btn"
              onClick={onExploreClick}
              className="bg-ink text-paper hover:opacity-90 font-mono font-bold text-[11px] sm:text-xs uppercase tracking-wider py-3 px-4 sm:px-6 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer rounded-xs"
            >
              <span>CATÁLOGO 3D</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="hero-new-drop-btn"
              onClick={() => onTabSelect('lanzamientos')}
              className="bg-panel text-ink border border-line hover:border-ink/50 font-mono font-bold text-[11px] sm:text-xs uppercase tracking-wider py-3 px-4 sm:px-5 transition-all flex items-center justify-center gap-1.5 cursor-pointer rounded-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>NUEVOS DROPS</span>
            </button>
          </div>

          {/* Quick Category Chips */}
          <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-1.5 overflow-x-auto no-scrollbar py-1 touch-pan-y">
            <span className="text-[9px] font-mono text-muted uppercase tracking-widest hidden lg:inline mr-1">
              ACCESO RÁPIDO:
            </span>
            {['Camisas', 'Poleras', 'Camiseros', 'Clásicos', 'Manga Larga'].map((cat) => (
              <button
                key={cat}
                onClick={onExploreClick}
                className="text-[9px] font-mono text-muted hover:text-ink px-2.5 py-1.5 bg-panel border border-line hover:border-ink/40 transition-all uppercase whitespace-nowrap cursor-pointer rounded-xs"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Luxury Credibility Pillars */}
        <div className="mt-6 pt-5 border-t border-line grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 text-left">
          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-panel border border-line rounded-xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-paper border border-line flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5 text-ink" />
            </div>
            <div>
              <span className="text-[9.5px] sm:text-[10px] font-mono font-bold text-ink uppercase block">420 GSM PESADO</span>
              <span className="text-[8.5px] sm:text-[9px] font-sans text-muted leading-tight block">Estructura & caída boxy fit</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-panel border border-line rounded-xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-paper border border-line flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
            </div>
            <div>
              <span className="text-[9.5px] sm:text-[10px] font-mono font-bold text-ink uppercase block">19 TONALIDADES</span>
              <span className="text-[8.5px] sm:text-[9px] font-sans text-muted leading-tight block">Teñido reactivo anti-desgaste</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-panel border border-line rounded-xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-paper border border-line flex items-center justify-center shrink-0">
              <Truck className="w-3.5 h-3.5 text-ink" />
            </div>
            <div>
              <span className="text-[9.5px] sm:text-[10px] font-mono font-bold text-ink uppercase block">ENVÍOS EXPRESS</span>
              <span className="text-[8.5px] sm:text-[9px] font-sans text-muted leading-tight block">24-48h Lima & Provincias</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 sm:p-3 bg-panel border border-line rounded-xs">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-paper border border-line flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5 text-ink" />
            </div>
            <div>
              <span className="text-[9.5px] sm:text-[10px] font-mono font-bold text-ink uppercase block">GARANTÍA TOTAL</span>
              <span className="text-[8.5px] sm:text-[9px] font-sans text-muted leading-tight block">Cambios de talla en 7 días</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
