import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, SaleProduct } from '../../types';
import { scrollToCatalog } from '../../utils/scrollToCatalog';
import Hero from '../../components/home/Hero';
import HomeTabBar from './HomeTabBar';
import DestacadosSection from './sections/DestacadosSection';
import PromoBannerSection from './sections/PromoBannerSection';
import OfertasTeaserSection from './sections/OfertasTeaserSection';
import SiluetasSection from './sections/SiluetasSection';
import MaterialesSection from './sections/MaterialesSection';
import CatalogSection from './sections/CatalogSection';

interface HomePageProps {
  activeCategory: string;
  onActiveCategoryChange: (cat: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  forceCatalogView: boolean;
  onForceCatalogViewChange: (show: boolean) => void;
  featuredProducts: Product[];
  promotionalProduct: Product;
  saleProducts: SaleProduct[];
  maxDiscountPct: number;
  favorites: Product[];
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  onShowToast: (message: string) => void;
}

export default function HomePage({
  activeCategory,
  onActiveCategoryChange,
  searchQuery,
  onClearSearch,
  forceCatalogView,
  onForceCatalogViewChange,
  featuredProducts,
  promotionalProduct,
  saleProducts,
  maxDiscountPct,
  favorites,
  onQuickView,
  onToggleFavorite,
  onShowToast,
}: HomePageProps) {
  const navigate = useNavigate();
  // Owned by CatalogSection's Filters sidebar
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);

  const handleToggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) => (prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]));
  };

  const handleSelectSiluetaCategory = (category: string) => {
    onActiveCategoryChange(category);
    setTimeout(scrollToCatalog, 200);
  };

  // "ver catálogo completo" always means the dedicated /catalogo showcase now
  const handleExploreCatalog = () => {
    navigate('/catalogo');
  };

  // Home sections and the inline Catalog view (Prendas / Siluetas / Materiales filtering)
  // are mutually exclusive — showing both at once was the "combined with Prendas" bug.
  const showHomeSections = activeCategory === 'Inicio' && !searchQuery && !forceCatalogView;
  const showCatalog = activeCategory !== 'Inicio' || !!searchQuery || forceCatalogView;

  return (
    <>
      {showHomeSections && (
        <>
          <Hero
            onExploreClick={handleExploreCatalog}
            onTabSelect={(tabId) => {
              if (tabId === 'lanzamientos') {
                navigate('/nuevos-ingresos');
              }
            }}
          />

          <HomeTabBar />

          {/* All homepage sections render in a continuous scroll (order tuned for conversion: proof → offers → navigation → deep content) */}
          <div className="relative">
            <div className="space-y-0">
              <DestacadosSection
                featuredProducts={featuredProducts}
                favorites={favorites}
                onQuickView={onQuickView}
                onToggleFavorite={onToggleFavorite}
                onExploreCatalog={handleExploreCatalog}
              />
              <PromoBannerSection promotionalProduct={promotionalProduct} onQuickView={onQuickView} />
            </div>

            <OfertasTeaserSection
              saleProducts={saleProducts}
              maxDiscountPct={maxDiscountPct}
              favorites={favorites}
              onQuickView={onQuickView}
              onToggleFavorite={onToggleFavorite}
            />

            <SiluetasSection onSelectCategory={handleSelectSiluetaCategory} />

            <MaterialesSection />
          </div>
        </>
      )}

      {showCatalog && (
        <CatalogSection
          activeCategory={activeCategory}
          onActiveCategoryChange={onActiveCategoryChange}
          searchQuery={searchQuery}
          onClearSearch={onClearSearch}
          selectedFabrics={selectedFabrics}
          onToggleFabric={handleToggleFabric}
          onClearFabrics={() => setSelectedFabrics([])}
          favorites={favorites}
          onQuickView={onQuickView}
          onToggleFavorite={onToggleFavorite}
          onShowToast={onShowToast}
        />
      )}
    </>
  );
}
