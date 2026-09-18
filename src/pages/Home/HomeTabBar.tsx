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

export default function HomeTabBar() {
  const navigate = useNavigate();

  return (
    <div
      id="home-section-switcher"
      className="hidden sm:block sticky top-[68px] md:top-[96px] z-30 bg-paper/90 backdrop-blur-2xl text-ink border-b border-line py-3 px-4 sm:px-6 lg:px-8 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
        <div className="space-y-0.5">
          <span className="text-[10px] tracking-wider text-muted uppercase flex items-center gap-2 font-sans font-semibold">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Colección Activa • Atelier 2026
          </span>
          <h3 className="font-heading text-sm sm:text-base text-ink tracking-tight uppercase font-extrabold">
            Explora por Categoría
          </h3>
        </div>

        <div className="flex items-center overflow-x-auto no-scrollbar space-x-2 py-0.5">
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
              className="flex-shrink-0 px-4 py-2 text-xs font-sans tracking-wide uppercase transition-all duration-300 border border-line rounded-full cursor-pointer bg-panel/80 text-muted hover:text-ink hover:border-accent/40 hover:bg-paper font-medium"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
