import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Product, CartItem } from './types';
import { PRODUCTS } from './data';

// Component Imports
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProductDetailModal from './components/product/ProductDetailModal';
import CartDrawer from './components/cart/CartDrawer';
import WishlistDrawer from './components/cart/WishlistDrawer';
import Benefits from './components/home/Benefits';
import CustomerReviews from './components/home/CustomerReviews';
import FAQAndPolicies from './components/home/FAQAndPolicies';
import FloatingWhatsApp from './components/shared/FloatingWhatsApp';
import MobileBottomNav from './components/layout/MobileBottomNav';

// Page Imports
import HomePage from './pages/Home/HomePage';
import NuevosIngresosPage from './pages/NuevosIngresos/NuevosIngresosPage';
import OfertasPage from './pages/Ofertas/OfertasPage';
import CatalogoPage from './pages/Catalogo/CatalogoPage';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Category & Home navigation state (cross-cutting: Header needs these outside the routed pages)
  const [activeCategory, setActiveCategory] = useState<string>('Inicio');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // Forces the inline catalog view on Home even when activeCategory is still 'Inicio' —
  // needed for the Materiales fabric tiles, since a fabric pick isn't a category change.
  const [forceCatalogView, setForceCatalogView] = useState<boolean>(false);

  // Drawers and Modals state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart & Wishlist state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('vanta_store_cart') || localStorage.getItem('mont_store_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vanta_store_favorites') || localStorage.getItem('mont_store_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Theme State with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('vanta_store_theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  // Apply Theme class to document root and body
  useEffect(() => {
    localStorage.setItem('vanta_store_theme', theme);
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'light') {
      root.classList.add('light');
      body.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      body.classList.remove('light');
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Safe Body Scroll Lock when Modal or Drawers are active
  useEffect(() => {
    if (selectedProduct || isCartOpen || isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct, isCartOpen, isWishlistOpen]);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('vanta_store_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Persist Favorites
  useEffect(() => {
    localStorage.setItem('vanta_store_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Global toast notifications
  const [notification, setNotification] = useState<string>('');

  // Show a global micro-notification
  const showToast = (message: string) => {
    setNotification(message);
    const timer = setTimeout(() => {
      setNotification('');
    }, 3000);
    return () => clearTimeout(timer);
  };

  // Toggle Favorite
  const handleToggleFavorite = (product: Product) => {
    const exists = favorites.find((p) => p.id === product.id);
    if (exists) {
      setFavorites(favorites.filter((p) => p.id !== product.id));
      showToast(`Quitado de favoritos: ${product.name}`);
    } else {
      setFavorites([...favorites, product]);
      showToast(`¡Agregado a favoritos: ${product.name}!`);
    }
  };

  // Add Item to Cart
  const handleAddToCart = (product: Product, quantity: number, size: string, color: string, fabric?: string, sleeve?: string) => {
    const itemId = `${product.id}-${color}-${size}-${fabric || 'Default'}-${sleeve || 'Default'}`;
    const existingIndex = cartItems.findIndex((item) => item.id === itemId);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: itemId,
        product,
        selectedColor: color,
        selectedSize: size,
        selectedFabric: fabric,
        selectedSleeve: sleeve,
        quantity,
      };
      setCartItems([...cartItems, newItem]);
    }
    showToast(`Agregado al carrito: ${product.name} (${size} / ${color})`);
  };

  // Update Cart Item Quantity
  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity };
      }
      return item;
    });
    setCartItems(updated);
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    setCartItems(cartItems.filter((i) => i.id !== id));
    if (item) {
      showToast(`Eliminado del carrito: ${item.product.name}`);
    }
  };

  // Clear Cart fully
  const handleClearCart = () => {
    setCartItems([]);
    showToast('Carrito vaciado por completo.');
  };

  // Scroll to Catalog view on demand
  const scrollToCatalog = () => {
    const section = document.getElementById('catalog-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Shared nav handler for Header & Footer category links
  const handleSelectCategory = (cat: string) => {
    if (cat === 'Nuevos ingresos') {
      navigate('/nuevos-ingresos');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (cat === 'Ofertas') {
      navigate('/ofertas');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (cat === 'Catálogo') {
      navigate('/catalogo');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    if (location.pathname !== '/') navigate('/');
    setActiveCategory(cat);
    if (cat !== 'Inicio') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      setForceCatalogView(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Destination for every "ver catálogo completo" CTA (Hero, Destacados, Ofertas, Nuevos Ingresos)
  const handleExploreCatalog = () => {
    navigate('/catalogo');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Featured and New Releases for homepage sections (independent of filters)
  const featuredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.stock > 10).slice(0, 4);
  }, []);

  const promotionalProduct = PRODUCTS.find((p) => p.tags.includes('Oferta')) || PRODUCTS[0];

  // Products currently on sale, with discount % pre-computed for the Ofertas sections
  const saleProducts = useMemo(() => {
    return PRODUCTS
      .filter((p) => p.oldPrice && p.oldPrice > p.price)
      .map((p) => ({
        ...p,
        discountPct: Math.round(((p.oldPrice! - p.price) / p.oldPrice!) * 100),
        savingsAmount: p.oldPrice! - p.price,
      }))
      .sort((a, b) => b.discountPct - a.discountPct);
  }, []);

  const maxDiscountPct = saleProducts.length > 0 ? Math.max(...saleProducts.map((p) => p.discountPct)) : 0;

  // Full-price products, for cross-selling on the Ofertas page without repeating items already shown at a discount
  const nonSaleProducts = useMemo(() => {
    return PRODUCTS.filter((p) => !(p.oldPrice && p.oldPrice > p.price));
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div id="vanta-store-workspace" className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-paper-soft relative pb-16 md:pb-0">
      {/* Dynamic Header */}
      <Header
        activeCategory={
          location.pathname === '/nuevos-ingresos'
            ? 'Nuevos ingresos'
            : location.pathname === '/ofertas'
            ? 'Ofertas'
            : location.pathname === '/catalogo'
            ? 'Catálogo'
            : activeCategory
        }
        onSelectCategory={handleSelectCategory}
        cartCount={totalCartCount}
        wishlistCount={favorites.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q) {
            setTimeout(scrollToCatalog, 150);
          }
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <Routes>
        <Route
          path="/nuevos-ingresos"
          element={
            <NuevosIngresosPage
              products={PRODUCTS.filter((p) => p.tags.includes('Nuevo'))}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
              onQuickView={(p) => setSelectedProduct(p)}
              onExploreCatalog={handleExploreCatalog}
            />
          }
        />
        <Route
          path="/ofertas"
          element={
            <OfertasPage
              saleProducts={saleProducts}
              crossSellProducts={nonSaleProducts}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
              onQuickView={(p) => setSelectedProduct(p)}
              onExploreCatalog={handleExploreCatalog}
            />
          }
        />
        <Route
          path="/catalogo"
          element={
            <CatalogoPage
              favorites={favorites}
              onQuickView={(p) => setSelectedProduct(p)}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route
          path="/"
          element={
            <HomePage
              activeCategory={activeCategory}
              onActiveCategoryChange={setActiveCategory}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              forceCatalogView={forceCatalogView}
              onForceCatalogViewChange={setForceCatalogView}
              featuredProducts={featuredProducts}
              promotionalProduct={promotionalProduct}
              saleProducts={saleProducts}
              maxDiscountPct={maxDiscountPct}
              favorites={favorites}
              onQuickView={(p) => setSelectedProduct(p)}
              onToggleFavorite={handleToggleFavorite}
              onShowToast={showToast}
            />
          }
        />
      </Routes>

      {/* Dynamic Homepage Sections (Always visible at the bottom) — Catálogo keeps only Reseñas */}
      {location.pathname !== '/catalogo' && <Benefits />}
      <CustomerReviews />
      {location.pathname !== '/catalogo' && <FAQAndPolicies />}

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Floating Buttons */}
      <FloatingWhatsApp />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Wishlist Favorites Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleToggleFavorite}
        onQuickView={(prod) => setSelectedProduct(prod)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedProduct ? favorites.some((f) => f.id === selectedProduct.id) : false}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Global Toast micro-alerts */}
      {notification && (
        <div
          id="global-toast-notification"
          className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-50 bg-[#121218] text-white px-4 py-3 border border-zinc-700 shadow-2xl flex items-center space-x-2.5 font-mono text-[10px] uppercase tracking-widest animate-in slide-in-from-bottom-5 duration-300"
        >
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{notification}</span>
          <button
            id="close-toast-btn"
            onClick={() => setNotification('')}
            className="text-zinc-400 hover:text-white pl-2 border-l border-zinc-700 font-mono font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
