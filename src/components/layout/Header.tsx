import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Heart, Search, ChevronDown, Sun, Moon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../../data';
import TikTokIcon from '../shared/TikTokIcon';

interface HeaderProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const MAIN_NAV_ITEMS = ['Inicio', 'Nuevos ingresos', 'Prendas', 'Catálogo', 'Ofertas'];

const PRODUCT_CATEGORIES_WITH_FABRICS = [
  { name: 'Camisa', fabrics: ['Waffle', 'Piqué', 'Clásica', 'Waffer'] },
  { name: 'Camisero', fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'] },
  { name: 'Manga Larga', fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'] },
  { name: 'Clásico', fabrics: ['Waffle', 'Clásico', 'Piqué', 'Waffer'] },
  { name: 'Notch', fabrics: ['Waffle', 'Piqué', 'Jersey', 'Waffer'] },
  { name: 'Polera', fabrics: ['Zyko', 'Waffle', 'Piqué'] },
];

export default function Header({
  activeCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  onSearchChange,
  theme = 'dark',
  onToggleTheme,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobilePrendasOpen, setIsMobilePrendasOpen] = useState(false);

  const isPrendasActive = PRODUCT_CATEGORIES_WITH_FABRICS.some(item => item.name === activeCategory);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isPrendasActive) {
      setIsMobilePrendasOpen(true);
    }
  }, [activeCategory, isPrendasActive]);

  const handleCategoryClick = (cat: string) => {
    onSelectCategory(cat);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-paper/95 backdrop-blur-xl border-b border-line shadow-md'
          : 'bg-paper/98 backdrop-blur-md border-b border-line/80'
      }`}
    >
      {/* Main Unified Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu Trigger + Brand Logo Icon + Search Bar */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button
            id="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-muted hover:text-ink transition-colors cursor-pointer rounded-lg hover:bg-panel"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo Icon — strictly panther icon */}
          <button
            id="brand-logo-btn"
            onClick={() => handleCategoryClick('Inicio')}
            className="group flex items-center cursor-pointer transition-transform duration-200 hover:scale-105 shrink-0 p-1"
            aria-label="VANTA — Ir al inicio"
            title="VANTA"
          >
            <img
              src={theme === 'light' ? '/vanta-panther-dark.png' : '/vanta-panther-white.png'}
              alt="VANTA"
              className="h-9 sm:h-10 md:h-11 w-auto object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          {/* Search Bar next to Logo Icon (Desktop) */}
          <div className="hidden md:flex items-center relative">
            <Search className="w-4 h-4 absolute left-3 text-muted pointer-events-none" />
            <input
              id="search-input-desktop"
              type="text"
              placeholder="Buscar prenda o tejido..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-36 lg:w-48 focus:w-48 lg:focus:w-60 text-xs py-2 pl-9 pr-7 border border-line focus:outline-none focus:border-accent bg-panel/80 text-ink placeholder:text-muted rounded-full shadow-inner font-sans transition-all duration-300"
            />
            {searchQuery && (
              <button
                id="clear-search-btn-desktop"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink cursor-pointer p-0.5"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Center: Desktop Navigation Items */}
        <nav id="desktop-navigation" className="hidden md:flex items-center justify-center flex-1 min-w-0 mx-2 lg:mx-4">
          <ul className="flex items-center space-x-4 lg:space-x-6 text-[11px] lg:text-[12px] uppercase tracking-[0.16em] font-semibold">
            {MAIN_NAV_ITEMS.map((item) => {
              if (item === 'Prendas') {
                return (
                  <li
                    key={item}
                    className="relative py-1"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button
                      id="nav-item-prendas"
                      className={`transition-all duration-200 relative py-1 hover:text-accent flex items-center gap-1 cursor-pointer ${
                        isPrendasActive
                          ? 'text-ink font-bold'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      <span>{item}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-accent' : ''}`} />
                      {isPrendasActive && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 -translate-x-1/2 mt-2 w-[540px] bg-paper/95 backdrop-blur-2xl border border-line shadow-2xl z-50 p-5 rounded-3xl"
                        >
                          <div className="text-xs font-semibold tracking-wider text-muted uppercase mb-3 border-b border-line pb-2.5 flex items-center justify-between">
                            <span>SILUETAS Y VARIANTES DE TELA</span>
                            <span className="text-[10px] text-accent font-bold">ATELIER 2026</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {PRODUCT_CATEGORIES_WITH_FABRICS.map((pCat) => {
                              const isSubActive = activeCategory === pCat.name;
                              return (
                                <button
                                  key={pCat.name}
                                  onClick={() => {
                                    onSelectCategory(pCat.name);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`text-left p-3 transition-all duration-200 border rounded-2xl group/drop flex flex-col cursor-pointer ${
                                    isSubActive
                                      ? 'bg-accent/10 border-accent/30 text-accent'
                                      : 'border-line/60 bg-panel/60 hover:bg-paper-soft hover:border-accent/30'
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="font-heading text-xs sm:text-sm font-bold tracking-tight uppercase text-ink group-hover/drop:text-accent transition-colors">
                                      {pCat.name}
                                    </span>
                                    {isSubActive && (
                                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                    )}
                                  </div>
                                  <div className="text-[10px] text-muted mt-0.5 tracking-wide">
                                    Telas: {pCat.fabrics.join(' • ')}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              const isActive = activeCategory === item;
              return (
                <li key={item}>
                  <button
                    id={`nav-item-${item.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onSelectCategory(item)}
                    className={`transition-all duration-200 relative py-1 hover:text-accent cursor-pointer ${
                      isActive
                        ? 'text-ink font-bold'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {item}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                    )}
                  </button>
                </li>
              );
            })}

            {/* Standalone Interactive Catalog Link */}
            <li>
              <a
                href="/catalogo-interactivo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:text-rose-400 border border-rose-500/30 text-[10px] lg:text-[10.5px] font-bold tracking-wider transition-all whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>CATÁLOGO ↗</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Right: Theme Toggle, Wishlist, and Cart Bag */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          {/* Mobile Search Button */}
          <button
            id="search-toggle-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-muted hover:text-ink transition-colors cursor-pointer rounded-full hover:bg-panel"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              className="p-2 text-muted hover:text-ink transition-colors cursor-pointer rounded-full hover:bg-panel"
              aria-label="Cambiar tema claro / oscuro"
              title={theme === 'dark' ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>
          )}

          {/* Wishlist Button */}
          <button
            id="wishlist-trigger-btn"
            onClick={onOpenWishlist}
            className="p-2 text-muted hover:text-ink transition-colors relative cursor-pointer rounded-full hover:bg-panel"
            aria-label="Ver favoritos"
            title="Favoritos"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span
                id="wishlist-badge"
                className="absolute top-0.5 right-0.5 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-black shadow-md"
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Bag Button */}
          <button
            id="cart-trigger-btn"
            onClick={onOpenCart}
            className="p-2 text-muted hover:text-ink transition-colors relative cursor-pointer rounded-full hover:bg-panel"
            aria-label="Ver carrito"
            title="Bolsa de compra"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                id="cart-badge"
                className="absolute top-0.5 right-0.5 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-black shadow-md"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Interactive Search Bar - Expands smoothly only when triggered */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-3 pb-3 pt-1 bg-paper border-b border-line overflow-hidden"
          >
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="search-input-mobile"
                type="text"
                placeholder="Buscar prenda o tejido..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full text-xs py-2.5 pl-10 pr-9 border border-line bg-panel text-ink focus:outline-none focus:border-accent font-sans placeholder:text-muted rounded-full shadow-inner"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn-mobile"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-medium"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Navigation Drawer */}
      <div
        id="mobile-drawer"
        className={`fixed inset-0 z-50 transition-opacity duration-300 bg-black/85 backdrop-blur-md ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          id="mobile-drawer-content"
          className={`fixed top-0 left-0 w-[85vw] max-w-xs h-full bg-paper text-ink z-50 p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.9)] border-r border-line transition-transform duration-300 transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={theme === 'light' ? '/vanta-panther-dark.png' : '/vanta-panther-white.png'}
                  alt="VANTA"
                  className="h-9 w-auto object-contain drop-shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="font-display text-xl font-black tracking-wider text-ink leading-none">
                    VANTA
                  </span>
                  <span className="text-[7.5px] tracking-[0.25em] text-muted mt-0.5 font-semibold uppercase">
                    STREETWEAR
                  </span>
                </div>
              </div>
              <button
                id="close-mobile-menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-ink hover:text-accent transition-colors rounded-sm hover:bg-panel"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions (Bolsa & Favoritos moved into sidebar) */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                id="mobile-drawer-cart-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="p-3 bg-panel border border-line rounded-sm flex items-center justify-between text-ink hover:border-accent transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono font-bold uppercase">Bolsa</span>
                </div>
                {cartCount > 0 ? (
                  <span className="bg-accent text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-muted">0</span>
                )}
              </button>

              <button
                id="mobile-drawer-wishlist-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenWishlist();
                }}
                className="p-3 bg-panel border border-line rounded-sm flex items-center justify-between text-ink hover:border-accent transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-mono font-bold uppercase">Deseos</span>
                </div>
                {wishlistCount > 0 ? (
                  <span className="bg-rose-500 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-muted">0</span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto pr-1">
            <p className="text-[9px] font-mono tracking-widest text-muted uppercase mb-3 font-bold">
              NAVEGACIÓN // DROP 2026
            </p>
            <ul className="space-y-1.5 text-xs font-mono uppercase tracking-wider">
              {/* Standalone Interactive Catalog (External Lookbook) */}
              <li>
                <a
                  href="/catalogo-interactivo"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left py-2.5 px-3 rounded-xs transition-colors flex items-center justify-between font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    <span>CATÁLOGO INTERACTIVO 2026</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded">
                    VER ↗
                  </span>
                </a>
              </li>

              {/* Home / Inicio */}
              <li>
                <button
                  id="mobile-nav-item-inicio"
                  onClick={() => handleCategoryClick('Inicio')}
                  className={`w-full text-left py-2.5 px-3 rounded-xs transition-colors flex items-center justify-between font-bold ${
                    activeCategory === 'Inicio'
                      ? 'bg-panel text-ink border-l-2 border-accent'
                      : 'text-muted hover:text-ink hover:bg-panel/40'
                  }`}
                >
                  <span>INICIO</span>
                  <span className="text-[10px] text-muted">01</span>
                </button>
              </li>

              {/* Nuevos Ingresos */}
              <li>
                <button
                  id="mobile-nav-item-nuevos-ingresos"
                  onClick={() => handleCategoryClick('Nuevos ingresos')}
                  className={`w-full text-left py-2.5 px-3 rounded-xs transition-colors flex items-center justify-between font-bold ${
                    activeCategory === 'Nuevos ingresos'
                      ? 'bg-panel text-ink border-l-2 border-accent'
                      : 'text-muted hover:text-ink hover:bg-panel/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>NUEVOS DROPS</span>
                    <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  </div>
                  <span className="text-[10px] text-accent font-bold">NUEVO</span>
                </button>
              </li>

              {/* Catálogo 3D */}
              <li>
                <button
                  id="mobile-nav-item-catalogo"
                  onClick={() => handleCategoryClick('Catálogo')}
                  className={`w-full text-left py-2.5 px-3 rounded-xs transition-colors flex items-center justify-between font-bold ${
                    activeCategory === 'Catálogo'
                      ? 'bg-panel text-ink border-l-2 border-accent'
                      : 'text-muted hover:text-ink hover:bg-panel/40'
                  }`}
                >
                  <span>CATÁLOGO 3D</span>
                  <span className="text-[9px] font-mono text-muted bg-panel px-1.5 py-0.5 border border-line">
                    3D VIEW
                  </span>
                </button>
              </li>

              {/* Ofertas */}
              <li>
                <button
                  id="mobile-nav-item-ofertas"
                  onClick={() => handleCategoryClick('Ofertas')}
                  className={`w-full text-left py-2.5 px-3 rounded-xs transition-colors flex items-center justify-between font-bold ${
                    activeCategory === 'Ofertas'
                      ? 'bg-panel text-ink border-l-2 border-accent'
                      : 'text-muted hover:text-ink hover:bg-panel/40'
                  }`}
                >
                  <span>OFERTAS DE TEMPORADA</span>
                  <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 border border-rose-500/20">
                    % SALE
                  </span>
                </button>
              </li>

              {/* Collapsible PRENDAS */}
              <li className="pt-2">
                <button
                  id="mobile-nav-item-prendas"
                  onClick={() => setIsMobilePrendasOpen(!isMobilePrendasOpen)}
                  className={`w-full text-left py-2.5 px-3 rounded-xs transition-colors flex items-center justify-between font-bold border border-line bg-panel/60 ${
                    isPrendasActive ? 'text-ink border-accent' : 'text-muted hover:text-ink'
                  }`}
                >
                  <span>COLECCIÓN DE PRENDAS</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isMobilePrendasOpen ? 'rotate-180 text-accent' : ''
                    }`}
                  />
                </button>

                {/* Collapsible List of garments */}
                <AnimatePresence initial={false}>
                  {isMobilePrendasOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-2 pr-1 mt-1.5 space-y-1 bg-panel/30 border-l-2 border-accent"
                    >
                      {PRODUCT_CATEGORIES_WITH_FABRICS.map((pCat) => {
                        const isSubActive = activeCategory === pCat.name;
                        return (
                          <button
                            key={pCat.name}
                            id={`mobile-nav-item-sub-${pCat.name.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => {
                              handleCategoryClick(pCat.name);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left py-2 px-2 transition-colors block rounded-xs ${
                              isSubActive
                                ? 'text-accent font-black text-xs bg-panel'
                                : 'text-muted hover:text-ink text-[11px] hover:bg-panel/40'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="uppercase tracking-wider">{pCat.name}</span>
                              {isSubActive && <span className="w-1.5 h-1.5 bg-accent rounded-full" />}
                            </div>
                            <div className="text-[8px] text-muted uppercase mt-0.5">
                              Telas: {pCat.fabrics.join(' • ')}
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </div>

          {/* Drawer Footer Utility Deck */}
          <div className="border-t border-line pt-4 mt-auto space-y-3">

            {onToggleTheme && (
              <button
                id="mobile-theme-toggle-btn"
                onClick={onToggleTheme}
                className="w-full flex items-center justify-between p-2.5 border border-line bg-panel text-ink font-mono text-xs uppercase tracking-wider cursor-pointer rounded-sm hover:border-ink/40"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600" />
                  )}
                  <span>MODO {theme === 'dark' ? 'CLARO' : 'OSCURO'}</span>
                </div>
                <span className="text-[9px] text-accent font-bold">CAMBIAR</span>
              </button>
            )}

            {/* Quick Link to Policies and Terms */}
            <a
              href="#faq-and-policies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-between p-2 border border-line bg-panel/60 text-muted hover:text-ink font-mono text-[10px] uppercase tracking-wider rounded-sm transition-colors"
            >
              <span>📜 POLÍTICAS & TÉRMINOS</span>
              <span className="text-accent font-bold">VER ↗</span>
            </a>

            <div className="flex items-center justify-between text-xs font-mono text-muted pt-1">
              <a
                href="https://wa.me/51904536406"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent flex items-center gap-1.5 text-[11px] font-bold"
              >
                <span>WhatsApp Oficial ↗</span>
              </a>

              <a
                href="https://www.tiktok.com/@vanta_ptr?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent flex items-center gap-1 text-[11px] font-bold"
              >
                <TikTokIcon className="w-3.5 h-3.5" />
                <span>TikTok ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
