import React from 'react';
import { useNavigate } from 'react-router-dom';
import { scrollToSection } from '../../utils/scrollToCatalog';

interface Tab {
  id: string;
  sectionId?: string;
  navigateTo?: string;
  label: string;
}

const TABS: Tab[] = [
  { id: 'destacados', sectionId: 'featured-homepage-products', label: 'Destacados' },
  { id: 'ofertas', sectionId: 'homepage-ofertas', label: 'Ofertas' },
  { id: 'siluetas', sectionId: 'visual-collections', label: 'Siluetas' },
  { id: 'materiales', sectionId: 'interactive-fabrics', label: 'Tejidos' },
  { id: 'nuevos-ingresos', navigateTo: '/nuevos-ingresos', label: 'Nuevos ingresos →' },
  { id: 'catalogo', navigateTo: '/catalogo', label: 'Catálogo' },
];

// Sticky quick-jump nav — every section below is always rendered (continuous scroll).
// "Nuevos ingresos" and "Catálogo" are destinations on their own dedicated pages.
export default function HomeTabBar() {
  const navigate = useNavigate();

  return (
    <div
      id="home-section-switcher"
      className="hidden sm:block sticky top-[76px] sm:top-[88px] md:top-[112px] z-30 bg-paper/95 backdrop-blur-xl text-ink border-b border-line py-3 px-4 sm:px-6 lg:px-8 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
        <div className="space-y-0.5">
          <span className="text-[8.5px] sm:text-[9px] tracking-[0.32em] text-muted uppercase flex items-center gap-1.5 font-mono font-bold">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            ✦ NAVEGACIÓN RÁPIDA // DROP 2026 ✦
          </span>
          <h3 className="font-display text-sm sm:text-base text-ink tracking-wider uppercase font-bold">
            Explora la colección
          </h3>
        </div>

        <div className="flex items-center overflow-x-auto no-scrollbar space-x-1.5 py-0.5">
          {TABS.map((tab) => (
            <button
              id={`home-switcher-tab-${tab.id}`}
              key={tab.id}
              onClick={() => {
                if (tab.navigateTo) {
                  navigate(tab.navigateTo);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                  return;
                }
                scrollToSection(tab.sectionId!);
              }}
              className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-[9.5px] sm:text-[11px] font-mono tracking-wider uppercase transition-all duration-300 border border-line rounded-xs cursor-pointer bg-panel text-muted hover:text-ink hover:border-ink/40 hover:bg-paper-soft"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
