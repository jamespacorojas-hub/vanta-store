import React from 'react';
import { X, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { CATEGORIES } from '../../data';

interface FiltersProps {
  category: string;
  onSelectCategory: (cat: string) => void;
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  selectedColors: string[];
  onToggleColor: (color: string) => void;
  selectedFabrics: string[];
  onToggleFabric: (fabric: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onlyInStock: boolean;
  onToggleInStock: () => void;
  sortBy: string;
  onChangeSort: (sort: any) => void;
  onResetFilters: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  totalProductsCount: number;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL'];
const AVAILABLE_FABRICS = ['Waffle', 'Piqué', 'Clásica', 'Clásico', 'Waffer', 'Jersey', 'Neru'];
const AVAILABLE_COLORS = [
  'Azul',
  'Beige',
  'Botella',
  'Cemento',
  'Denim',
  'Melange Oscuro',
  'Negro',
  'Pacay',
  'Palo Rosa',
  'Perla',
  'Vino',
  'Marrón',
  'Camote',
  'Topo',
  'Plomo',
  'Blanco',
  'Gris',
];

export default function Filters({
  category,
  onSelectCategory,
  selectedSizes,
  onToggleSize,
  selectedColors,
  onToggleColor,
  selectedFabrics,
  onToggleFabric,
  priceRange,
  onPriceRangeChange,
  onlyInStock,
  onToggleInStock,
  sortBy,
  onChangeSort,
  onResetFilters,
  isMobileOpen,
  setIsMobileOpen,
  totalProductsCount,
}: FiltersProps) {
  const handlePriceSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPriceRangeChange([priceRange[0], parseInt(e.target.value)]);
  };

  const activeFiltersCount =
    (category !== 'Inicio' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    selectedFabrics.length +
    (priceRange[1] < 300 ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-8 font-sans">
      {/* Header section with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-line">
        <h3 className="text-xs uppercase tracking-widest font-semibold flex items-center">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtros ({activeFiltersCount})
        </h3>
        {activeFiltersCount > 0 && (
          <button
            id="reset-filters-btn"
            onClick={onResetFilters}
            className="flex items-center text-[10px] tracking-wider text-muted hover:text-ink transition-colors"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            LIMPIAR TODO
          </button>
        )}
      </div>

      {/* Categories filter */}
      <div className="space-y-3">
        <h4 className="text-[11px] uppercase tracking-widest text-muted font-semibold">Categoría</h4>
        <div className="flex flex-col space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                id={`filter-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`text-left text-xs tracking-wide py-1 transition-all flex items-center justify-between group/filter-btn ${
                  isActive
                    ? 'text-ink font-semibold translate-x-1'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  {isActive && <span className="w-1 h-1 bg-accent rounded-full animate-pulse" />}
                  <span>{cat}</span>
                </div>
                {cat === 'Nuevos ingresos' && (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes filter */}
      <div className="space-y-3">
        <h4 className="text-[11px] uppercase tracking-widest text-muted font-semibold">Tallas</h4>
        <div className="grid grid-cols-4 gap-1.5">
          {AVAILABLE_SIZES.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                id={`filter-size-${size.toLowerCase()}`}
                key={size}
                onClick={() => onToggleSize(size)}
                className={`text-[10px] sm:text-xs font-mono py-2 text-center transition-all ${
                  isSelected
                    ? 'bg-accent text-paper-soft font-bold'
                    : 'bg-paper-soft text-muted hover:bg-panel border border-line'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors filter */}
      <div className="space-y-3">
        <h4 className="text-[11px] uppercase tracking-widest text-muted font-semibold">Colores</h4>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_COLORS.map((col) => {
            const isSelected = selectedColors.includes(col);
            return (
              <button
                id={`filter-color-${col.toLowerCase().replace(/\s+/g, '-')}`}
                key={col}
                onClick={() => onToggleColor(col)}
                className={`text-[10px] px-2.5 py-1.5 border transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'border-accent bg-accent text-paper-soft font-bold'
                    : 'border-line bg-paper-soft text-muted hover:border-ink'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-paper-soft" />}
                <span>{col}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabrics filter */}
      <div className="space-y-3">
        <h4 className="text-[11px] uppercase tracking-widest text-muted font-semibold">Telas (Tejidos)</h4>
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_FABRICS.map((fab) => {
            const isSelected = selectedFabrics.includes(fab);
            return (
              <button
                id={`filter-fabric-${fab.toLowerCase()}`}
                key={fab}
                onClick={() => onToggleFabric(fab)}
                className={`text-[10px] px-2.5 py-1.5 border transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'border-accent bg-accent text-paper-soft font-bold'
                    : 'border-line bg-paper-soft text-muted hover:border-ink'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-paper-soft" />}
                <span>{fab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range filter */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] uppercase tracking-widest text-muted font-semibold">Rango de precio</h4>
          <span className="text-xs font-mono font-medium text-ink">Hasta S/. {priceRange[1]}</span>
        </div>
        <div className="space-y-2">
          <input
            id="price-range-slider"
            type="range"
            min="30"
            max="300"
            step="10"
            value={priceRange[1]}
            onChange={handlePriceSlide}
            className="w-full accent-accent h-1 bg-panel cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>S/. 30</span>
            <span>S/. 300</span>
          </div>
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-2 border-t border-line flex items-center justify-between">
        <label htmlFor="only-in-stock-cb" className="text-xs text-muted font-medium cursor-pointer">
          Mostrar solo con stock
        </label>
        <button
          id="only-in-stock-btn"
          onClick={onToggleInStock}
          className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
            onlyInStock ? 'bg-accent' : 'bg-panel'
          }`}
          aria-label="Filtrar por stock"
        >
          <div
            className={`bg-paper-soft w-4 h-4 rounded-full shadow-md transform duration-300 ${
              onlyInStock ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop View Sidebar */}
      <aside id="desktop-filters-sidebar" className="hidden lg:block w-64 shrink-0 pr-8 border-r border-line">
        <div className="sticky top-28 space-y-6">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Drawer (Sliding Panel) */}
      <div
        id="mobile-filters-drawer"
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 bg-ink/60 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      >
        <div
          id="mobile-filters-container"
          className={`fixed bottom-0 left-0 w-full max-h-[85vh] overflow-y-auto bg-paper-soft rounded-t-2xl z-50 p-6 flex flex-col transition-transform duration-300 transform ${
            isMobileOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
            <span className="text-xs uppercase tracking-widest font-black">
              Filtrar prendas
            </span>
            <button
              id="close-mobile-filters"
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 text-ink hover:bg-panel rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-10">
            <FilterContent />
          </div>

          <div className="border-t border-line pt-4 bg-paper-soft sticky bottom-0 flex justify-between gap-3">
            <button
              id="mobile-filters-reset-btn"
              onClick={() => {
                onResetFilters();
                setIsMobileOpen(false);
              }}
              className="w-1/3 py-3 border border-line text-xs uppercase tracking-widest text-muted hover:text-ink transition-all"
            >
              LIMPIAR
            </button>
            <button
              id="mobile-filters-apply-btn"
              onClick={() => setIsMobileOpen(false)}
              className="w-2/3 py-3 bg-ink text-paper-soft text-xs font-black uppercase tracking-widest transition-all hover:bg-accent"
            >
              VER {totalProductsCount} PRENDAS
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
