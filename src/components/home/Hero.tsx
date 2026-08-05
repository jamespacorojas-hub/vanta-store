import React from 'react';

interface HeroProps {
  onExploreClick: () => void;
  onTabSelect: (tabId: string) => void;
}

// The banner carries the full studio composition (logo, headline, models, features).
// Using full-width uncropped display ensures both models and all brand text are 100% visible on mobile and desktop.
export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <section id="hero-banner" className="relative w-full bg-paper pt-[140px] md:pt-[156px]">
      <button
        id="hero-banner-cta"
        onClick={onExploreClick}
        className="block w-full cursor-pointer"
        aria-label="Descubre la colección — ir al catálogo"
      >
        <img
          src="/imagenes/banner-principal.png"
          alt="Mont Store — Estilo que te define. Básicos premium, calidad que trasciende."
          className="w-full h-auto object-contain block"
        />
      </button>
    </section>
  );
}
