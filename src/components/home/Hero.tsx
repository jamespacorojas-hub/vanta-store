import React from 'react';

interface HeroProps {
  onExploreClick: () => void;
  onTabSelect: (tabId: string) => void;
}

// The banner already carries the full creative (logo, headline, CTA, feature strip) as a single
// finished graphic, so this just presents it full-bleed and wires its "Descubre la colección"
// call-to-action to the real catalog navigation — no overlaid text duplicating what's baked in.
export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <section id="hero-banner" className="relative w-full bg-paper pt-[108px] sm:pt-[124px]">
      <button
        id="hero-banner-cta"
        onClick={onExploreClick}
        className="block w-full cursor-pointer"
        aria-label="Descubre la colección — ir al catálogo"
      >
        {/* The banner is a wide (~1.87:1) studio composition — on phones, showing it at full
            width would shrink the logo/headline/CTA to an illegible sliver, so we crop in on
            the centered brand block there and only reveal the full wide shot from sm: up. */}
        <img
          src="/imagenes/banner-principal.png"
          alt="Mont Store — Estilo que te define. Básicos premium, calidad que trasciende."
          className="w-full aspect-[4/5] object-cover object-center sm:aspect-auto sm:h-auto"
        />
      </button>
    </section>
  );
}
