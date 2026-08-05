import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Heart, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CATEGORIES } from '../../data';

interface HeaderProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const MAIN_NAV_ITEMS = ['Inicio', 'Nuevos ingresos', 'Prendas', 'Catálogo', 'Ofertas'];

const PRODUCT_CATEGORIES_WITH_FABRICS = [
  { name: 'Camisa', fabrics: ['Waffle', 'Piqué', 'Clásica', 'Waffer'] },
  { name: 'Camisero', fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'] },
  { name: 'Manga Larga', fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'] },
  { name: 'Clásico', fabrics: ['Waffle', 'Clásico', 'Piqué', 'Waffer'] },
  { name: 'Notch', fabrics: ['Waffle', 'Piqué', 'Jersey', 'Waffer'] },
  { name: 'Polera', fabrics: ['Neru', 'Waffle', 'Piqué'] },
  { name: 'Polera c/ Cierre', fabrics: ['Neru', 'Waffle', 'Piqué'] },
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
          ? 'bg-paper/95 backdrop-blur-md border-b border-line shadow-xs'
          : 'bg-paper border-b border-line'
      }`}
    >
      {/* Promo banner */}
      <div
        id="promo-banner"
        className="bg-ink text-paper text-[10px] sm:text-xs uppercase tracking-[0.2em] py-2 text-center font-mono select-none"
      >
        ENVIOS A TODO EL PERU • COMPRA POR WHATSAPP • 10% OFF EN TU PRIMER PEDIDO
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger & Search */}
        <div className="flex items-center space-x-4">
          <button
            id="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-ink hover:text-accent transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center relative">
            <button
              id="search-toggle-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-ink hover:text-accent transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
            <div
              className={`absolute left-10 transition-all duration-300 overflow-hidden ${
                isSearchOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none'
              }`}
            >
              <input
                id="search-input-desktop"
                type="text"
                placeholder="Buscar prenda..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full text-sm py-1 px-3 border border-line focus:outline-none focus:border-accent font-sans bg-paper-soft"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn-desktop"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-sans"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex-1 flex justify-center md:justify-center">
          <button
            id="brand-logo-btn"
            onClick={() => handleCategoryClick('Inicio')}
            className="group flex flex-col items-center"
          >
            <span className="font-display text-2xl sm:text-3xl font-medium tracking-wide text-ink transition-transform duration-300 group-hover:scale-[1.02]">
              Mont Store
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-muted mt-0.5 font-semibold uppercase">
              Streetwear Editorial
            </span>
          </button>
        </div>

        {/* Right: Cart & Wishlist */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            id="wishlist-trigger-btn"
            onClick={onOpenWishlist}
            className="p-2 text-ink hover:text-accent transition-colors relative"
            aria-label="Ver favoritos"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span
                id="wishlist-badge"
                className="absolute top-0 right-0 bg-accent text-paper-soft text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold border border-paper"
              >
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            id="cart-trigger-btn"
            onClick={onOpenCart}
            className="p-2 text-ink hover:text-accent transition-colors relative"
            aria-label="Ver carrito"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                id="cart-badge"
                className="absolute top-0 right-0 bg-accent text-paper-soft text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-bold border border-paper"
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - below header */}
      <div className="md:hidden px-4 pb-3 bg-paper">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="search-input-mobile"
            type="text"
            placeholder="Buscar prenda..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs py-2 pl-9 pr-8 border border-line rounded-none focus:outline-none focus:border-accent font-sans bg-paper-soft"
          />
          {searchQuery && (
            <button
              id="clear-search-btn-mobile"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-mono"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Desktop Navigation Menus (Centered under logo on large viewports or standard navigation block) */}
      <nav id="desktop-navigation" className="hidden md:flex justify-center border-t border-line py-3 bg-paper">
        <ul className="flex space-x-8 text-[11px] uppercase tracking-[0.2em] font-medium items-center">
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
                    className={`transition-all duration-300 relative py-1 hover:opacity-60 flex items-center gap-1 ${
                      isPrendasActive
                        ? 'text-ink font-semibold tracking-[0.22em]'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <span>{item}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    {isPrendasActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-accent" />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 -translate-x-1/2 mt-2 w-[540px] bg-paper-soft border border-line shadow-xl z-50 p-5 rounded-none"
                      >
                        <div className="text-[9px] tracking-widest text-muted uppercase mb-3 border-b border-line pb-2">
                          SILUETAS Y VARIANTES DE TELA
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
                                className={`text-left p-2.5 transition-all duration-250 border border-transparent hover:bg-paper hover:border-line group/drop flex flex-col ${
                                  isSubActive ? 'bg-accent-soft border-accent/30' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className={`font-sans text-[11px] font-bold tracking-wider uppercase transition-colors ${
                                    isSubActive ? 'text-ink' : 'text-ink/80 group-hover/drop:text-ink'
                                  }`}>
                                    {pCat.name}
                                  </span>
                                  {isSubActive && (
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                                  )}
                                </div>
                                <div className="text-[9px] text-muted group-hover/drop:text-ink/70 mt-1 uppercase tracking-wide">
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
                  className={`transition-all duration-300 relative py-1 hover:opacity-60 ${
                    isActive
                      ? 'text-ink font-semibold tracking-[0.22em]'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {item}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-accent" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile Sidebar Navigation Drawer */}
      <div
        id="mobile-drawer"
        className={`fixed inset-0 z-50 transition-opacity duration-300 bg-ink/60 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          id="mobile-drawer-content"
          className={`fixed top-0 left-0 w-[80vw] max-w-sm h-full bg-paper z-50 p-6 flex flex-col transition-transform duration-300 transform ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8 border-b border-line pb-4">
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-wide text-ink">
                Mont Store
              </span>
              <span className="text-[8px] tracking-[0.3em] text-muted -mt-1 font-semibold">
                STREETWEAR
              </span>
            </div>
            <button
              id="close-mobile-menu"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-ink hover:text-accent transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <p className="text-[10px] tracking-widest text-muted uppercase mb-4">CATEGORÍAS</p>
            <ul className="space-y-3 text-sm font-sans uppercase tracking-wider">
              {/* Home / Inicio */}
              <li>
                <button
                  id="mobile-nav-item-inicio"
                  onClick={() => handleCategoryClick('Inicio')}
                  className={`w-full text-left py-2.5 transition-colors border-b border-line font-medium ${
                    activeCategory === 'Inicio' ? 'text-ink font-black pl-1' : 'text-muted hover:text-ink'
                  }`}
                >
                  INICIO
                </button>
              </li>

              {/* Nuevos Ingresos */}
              <li>
                <button
                  id="mobile-nav-item-nuevos-ingresos"
                  onClick={() => handleCategoryClick('Nuevos ingresos')}
                  className={`w-full text-left py-2.5 transition-colors border-b border-line flex items-center justify-between font-medium ${
                    activeCategory === 'Nuevos ingresos' ? 'text-ink font-black pl-1' : 'text-muted hover:text-ink'
                  }`}
                >
                  <span>NUEVOS INGRESOS</span>
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                  </span>
                </button>
              </li>

              {/* Collapsible PRENDAS */}
              <li>
                <button
                  id="mobile-nav-item-prendas"
                  onClick={() => setIsMobilePrendasOpen(!isMobilePrendasOpen)}
                  className={`w-full text-left py-2.5 transition-colors border-b border-line flex items-center justify-between font-medium ${
                    isPrendasActive ? 'text-ink font-black' : 'text-muted'
                  }`}
                >
                  <span>PRENDAS</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobilePrendasOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Collapsible List of garments */}
                <AnimatePresence initial={false}>
                  {isMobilePrendasOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden pl-3 pr-1 mt-1 space-y-1 bg-paper-soft/60 border-l border-line"
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
                            className={`w-full text-left py-2 transition-colors block ${
                              isSubActive ? 'text-ink font-bold text-xs' : 'text-muted hover:text-ink text-[11px]'
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

              {/* Catálogo */}
              <li>
                <button
                  id="mobile-nav-item-catalogo"
                  onClick={() => handleCategoryClick('Catálogo')}
                  className={`w-full text-left py-2.5 transition-colors border-b border-line font-medium ${
                    activeCategory === 'Catálogo' ? 'text-ink font-black pl-1' : 'text-muted hover:text-ink'
                  }`}
                >
                  CATÁLOGO
                </button>
              </li>

              {/* Ofertas */}
              <li>
                <button
                  id="mobile-nav-item-ofertas"
                  onClick={() => handleCategoryClick('Ofertas')}
                  className={`w-full text-left py-2.5 transition-colors border-b border-line font-medium ${
                    activeCategory === 'Ofertas' ? 'text-ink font-black pl-1' : 'text-muted hover:text-ink'
                  }`}
                >
                  OFERTAS
                </button>
              </li>
            </ul>
          </div>

          <div className="border-t border-line pt-6 mt-auto">
            <p className="text-[10px] tracking-wider text-muted mb-2">SÍGUENOS EN REDES</p>
            <div className="flex space-x-4 text-xs font-mono text-ink/70">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">INSTAGRAM</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">TIKTOK</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
