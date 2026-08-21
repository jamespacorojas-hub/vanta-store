import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid, Sparkles, Tag, ShoppingBag, Heart } from 'lucide-react';

interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export default function MobileBottomNav({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
}: MobileBottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const navItems = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: Home,
      isActive: currentPath === '/',
      onClick: () => {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'catalogo',
      label: 'Catálogo',
      icon: Grid,
      isActive: currentPath === '/catalogo',
      onClick: () => {
        navigate('/catalogo');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'nuevos',
      label: 'Nuevos',
      icon: Sparkles,
      isActive: currentPath === '/nuevos-ingresos',
      badge: '✦',
      onClick: () => {
        navigate('/nuevos-ingresos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'ofertas',
      label: 'Ofertas',
      icon: Tag,
      isActive: currentPath === '/ofertas',
      badge: '%',
      onClick: () => {
        navigate('/ofertas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-paper-soft/95 backdrop-blur-xl border-t border-line px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.15)]"
      aria-label="Navegación móvil"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded-lg transition-all relative cursor-pointer ${
                item.isActive
                  ? 'text-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${item.isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.6]'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 text-[8px] font-mono font-bold text-accent">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[9.5px] font-mono tracking-wider mt-1 uppercase ${item.isActive ? 'font-bold text-ink' : 'font-medium text-muted'}`}>
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-1 h-1 bg-accent rounded-full mt-0.5" />
              )}
            </button>
          );
        })}

        {/* Wishlist Button on Mobile Bottom Nav */}
        <button
          onClick={onOpenWishlist}
          className="flex flex-col items-center justify-center py-1 px-2.5 min-w-[50px] min-h-[48px] text-muted hover:text-ink transition-all relative cursor-pointer"
        >
          <div className="relative">
            <Heart className="w-5 h-5 stroke-[1.6]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[8px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[9.5px] font-mono tracking-wider mt-1 uppercase font-medium text-muted">
            Deseos
          </span>
        </button>

        {/* Cart Button with Counter Badge */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] bg-ink text-paper rounded-md shadow-md transition-all active:scale-95 cursor-pointer ml-1"
        >
          <div className="relative flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-accent text-white text-[8.5px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono font-black tracking-wider uppercase mt-0.5">
            Bolsa
          </span>
        </button>
      </div>
    </nav>
  );
}
