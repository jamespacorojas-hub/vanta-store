import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { SlidersHorizontal } from 'lucide-react';
import { Product } from '../../../types';
import { PRODUCTS } from '../../../data';
import { scrollToCatalog } from '../../../utils/scrollToCatalog';
import Filters from '../../../components/home/Filters';
import ProductCard from '../../../components/cards/ProductCard';

interface CatalogSectionProps {
  activeCategory: string;
  onActiveCategoryChange: (cat: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
  selectedFabrics: string[];
  onToggleFabric: (fabric: string) => void;
  onClearFabrics: () => void;
  favorites: Product[];
  onQuickView: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
  onShowToast: (message: string) => void;
}

type SortBy = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'sale';

// The "Prendas" browsing experience: full filter sidebar + sortable grid across the whole catalog.
// Owns its own filter state — only selectedFabrics is shared (Materiales tiles can pre-select one).
export default function CatalogSection({
  activeCategory,
  onActiveCategoryChange,
  searchQuery,
  onClearSearch,
  selectedFabrics,
  onToggleFabric,
  onClearFabrics,
  favorites,
  onQuickView,
  onToggleFavorite,
  onShowToast,
}: CatalogSectionProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([30, 300]);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy>('popular');
  const [isFiltersMobileOpen, setIsFiltersMobileOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFiltersSelectCategory = (cat: string) => {
    if (cat === 'Nuevos ingresos') { navigate('/nuevos-ingresos'); return; }
    if (cat === 'Ofertas') { navigate('/ofertas'); return; }
    onActiveCategoryChange(cat);
    scrollToCatalog();
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  const handleToggleColor = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
  };

  const handleResetFilters = () => {
    onActiveCategoryChange('Inicio');
    onClearSearch();
    setSelectedSizes([]);
    setSelectedColors([]);
    onClearFabrics();
    setPriceRange([30, 300]);
    setOnlyInStock(false);
    setSortBy('popular');
    onShowToast('Filtros reiniciados.');
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Category Filter
      if (activeCategory === 'Nuevos ingresos') {
        if (!product.tags.includes('Nuevo')) return false;
      } else if (activeCategory === 'Ofertas') {
        if (!product.tags.includes('Oferta') && !product.oldPrice) return false;
      } else if (activeCategory !== 'Inicio') {
        if (product.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      }

      // 2. Search Box Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // 3. Sizes filter
      if (selectedSizes.length > 0) {
        const hasSize = product.sizes.some((size) => selectedSizes.includes(size));
        if (!hasSize) return false;
      }

      // 4. Colors filter
      if (selectedColors.length > 0) {
        const hasColor = product.colors.some((col) => selectedColors.includes(col));
        if (!hasColor) return false;
      }

      // 4.5. Fabrics filter
      if (selectedFabrics.length > 0) {
        const hasFabric = product.fabrics.some((f) => selectedFabrics.includes(f));
        if (!hasFabric) return false;
      }

      // 5. Price range
      if (product.price > priceRange[1]) return false;

      // 6. Stock availability
      if (onlyInStock && product.stock === 0) return false;

      return true;
    });
  }, [activeCategory, searchQuery, selectedSizes, selectedColors, selectedFabrics, priceRange, onlyInStock]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest') {
      return list.sort((a, b) => {
        const aNew = a.tags.includes('Nuevo') ? 1 : 0;
        const bNew = b.tags.includes('Nuevo') ? 1 : 0;
        return bNew - aNew;
      });
    }
    if (sortBy === 'sale') {
      return list.sort((a, b) => {
        const aSale = a.tags.includes('Oferta') || a.oldPrice ? 1 : 0;
        const bSale = b.tags.includes('Oferta') || b.oldPrice ? 1 : 0;
        return bSale - aSale;
      });
    }
    // Default: 'popular' (by stock size or standard index)
    return list.sort((a, b) => b.stock - a.stock);
  }, [filteredProducts, sortBy]);

  return (
    <section id="catalog-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 scroll-mt-24">
      {/* Section title & Active details */}
      <div className="border-b border-line pb-6 mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.2em] text-muted uppercase">
            Catálogo de productos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink leading-tight">
            {activeCategory === 'Inicio' ? 'Colección general' : activeCategory}
          </h2>
          {searchQuery && (
            <p className="text-xs text-muted font-mono mt-1.5">
              Búsqueda: <span className="text-ink font-bold">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Controls: sorting & mobile filters trigger */}
        <div className="flex items-center justify-between sm:justify-end gap-3.5 pt-2 sm:pt-0">
          {/* Mobile filter toggle */}
          <button
            id="mobile-filters-trigger"
            onClick={() => setIsFiltersMobileOpen(true)}
            className="lg:hidden flex items-center space-x-2 border border-line px-4 py-2.5 bg-paper-soft text-xs uppercase tracking-wider text-ink font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros</span>
          </button>

          {/* Sorting selector */}
          <div className="flex items-center space-x-2">
            <label htmlFor="sorting-select-box" className="hidden sm:block text-[10px] uppercase tracking-widest text-muted">
              Ordenar:
            </label>
            <select
              id="sorting-select-box"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="text-xs font-mono border border-line bg-paper-soft py-2 px-3 text-ink focus:outline-none focus:border-accent rounded-none"
            >
              <option value="popular">Popularidad</option>
              <option value="newest">Novedades Primero</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="sale">Ofertas Primero</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Catalog Split View */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Filters Sidebar */}
        <Filters
          category={activeCategory}
          onSelectCategory={handleFiltersSelectCategory}
          selectedSizes={selectedSizes}
          onToggleSize={handleToggleSize}
          selectedColors={selectedColors}
          onToggleColor={handleToggleColor}
          selectedFabrics={selectedFabrics}
          onToggleFabric={onToggleFabric}
          priceRange={priceRange}
          onPriceRangeChange={(range) => setPriceRange(range)}
          onlyInStock={onlyInStock}
          onToggleInStock={() => setOnlyInStock(!onlyInStock)}
          sortBy={sortBy}
          onChangeSort={(s) => setSortBy(s)}
          onResetFilters={handleResetFilters}
          isMobileOpen={isFiltersMobileOpen}
          setIsMobileOpen={setIsFiltersMobileOpen}
          totalProductsCount={sortedProducts.length}
        />

        {/* Right: Products list grid */}
        <div className="flex-1">
          {sortedProducts.length === 0 ? (
            <div id="no-products-found" className="text-center py-20 bg-paper-soft border border-line p-8">
              <p className="text-xs uppercase tracking-widest font-black text-ink">Ningún artículo coincide con los filtros</p>
              <p className="text-muted text-xs mt-1.5 max-w-sm mx-auto font-light leading-relaxed">
                Intenta cambiar el rango de precios, eliminar filtros de tallas/colores o reinicia la búsqueda de prendas.
              </p>
              <button
                id="catalog-reset-filters-btn"
                onClick={handleResetFilters}
                className="bg-accent text-white px-6 py-3 text-xs font-mono font-bold tracking-widest uppercase mt-6 hover:bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all"
              >
                Reiniciar todos los filtros
              </button>
            </div>
          ) : (
            <div>
              <p className="text-[10px] tracking-widest text-muted mb-4 uppercase">
                Mostrando {sortedProducts.length} de {PRODUCTS.length} artículos
              </p>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                {sortedProducts.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                  >
                    <ProductCard
                      product={p}
                      onQuickView={onQuickView}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={favorites.some((f) => f.id === p.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
