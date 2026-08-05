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
      className="sticky top-[108px] sm:top-[124px] z-30 bg-paper-soft/95 backdrop-blur-sm text-ink border-b border-line py-4 sm:py-5 px-4 sm:px-6 lg:px-8 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-muted uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            Navegación rápida
          </span>
          <h3 className="font-display text-sm sm:text-base text-ink">
            Explora la colección
          </h3>
        </div>

        <div className="flex items-center overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 space-x-1.5 py-1">
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
              className="flex-shrink-0 px-4 py-2 text-[10px] sm:text-[11px] tracking-wide uppercase transition-all border rounded-none cursor-pointer bg-paper text-muted border-line hover:text-ink hover:border-accent"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
