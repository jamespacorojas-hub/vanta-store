import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Percent, Wallet, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, SaleProduct } from '../../types';
import DealProductCard from '../../components/cards/DealProductCard';
import ProductCard from '../../components/cards/ProductCard';

interface OfertasPageProps {
  saleProducts: SaleProduct[];
  crossSellProducts: Product[];
  onToggleFavorite: (product: Product) => void;
  favorites: Product[];
  onQuickView: (product: Product) => void;
  onExploreCatalog: () => void;
}

type SortMode = 'discount' | 'savings' | 'price';

const OFERTAS_HERO_BANNERS = [
  {
    image: '/banners/banner-3.png',
    tag: 'CAMPAÑA DROP 2026',
    title: 'Drop & Ofertas Exclusivas',
    subtitle: 'Precios directos sobre hilados pesados',
  },
  {
    image: '/banners/banner-8.png',
    tag: 'EDICIÓN ESPECIAL',
    title: 'Minimalist Urban Wear',
    subtitle: 'Algodón peinado y corte relajado',
  },
  {
    image: '/banners/banner-4.png',
    tag: 'DROP DE TEMPORADA',
    title: 'Cultura Callejera & Arquitectura',
    subtitle: 'Prendas con estructura indeformable',
  },
];

export default function OfertasPage({
  saleProducts,
  crossSellProducts,
  onToggleFavorite,
  favorites,
  onQuickView,
  onExploreCatalog,
}: OfertasPageProps) {
  const [sortMode, setSortMode] = useState<SortMode>('discount');
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);

  const maxDiscountPct = saleProducts.length > 0 ? Math.max(...saleProducts.map((p) => p.discountPct)) : 0;
  const maxSavings = saleProducts.length > 0 ? Math.max(...saleProducts.map((p) => p.savingsAmount)) : 0;

  // Auto rotate banners every 5 seconds
  useEffect(() => {
    if (isBannerHovered) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % OFERTAS_HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isBannerHovered]);

  const sortedDeals = useMemo(() => {
    const list = [...saleProducts];
    if (sortMode === 'savings') return list.sort((a, b) => b.savingsAmount - a.savingsAmount);
    if (sortMode === 'price') return list.sort((a, b) => a.price - b.price);
    return list.sort((a, b) => b.discountPct - a.discountPct);
  }, [saleProducts, sortMode]);

  return (
    <div id="ofertas-page" className="pt-14 sm:pt-16 md:pt-20 bg-paper">
      {/* Full-page header dedicated to deals with Campaign Banner */}
      <section id="ofertas-hero" className="relative bg-panel text-ink overflow-hidden border-b border-line">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[420px] sm:min-h-[500px]">
          {/* Left Column: Info & Stats (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-12 sm:py-16 gap-6">
            <Link
              id="back-to-home-link-ofertas"
              to="/"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink hover:text-accent transition-colors self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
            </Link>

            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-muted uppercase flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                PRECIOS REBAJADOS // STOCK REAL // TEMPORADA
              </span>
              <h1 className="font-display font-black text-4xl sm:text-6xl leading-tight tracking-tight">
                OFERTAS
                <br />
                <span className="text-accent">ACTIVAS AHORA</span>
              </h1>
            </div>

            <p className="text-muted text-xs sm:text-sm font-sans font-light leading-relaxed max-w-xl">
              Precios rebajados directamente sobre el precio de lista, sin cupones ni letra pequeña. Se actualizan por temporada y duran hasta agotar el stock disponible.
            </p>

            {/* Real stats bar */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-lg">
              <div className="bg-paper-soft border border-line p-3.5 sm:p-5 rounded-2xl shadow-xs">
                <div className="flex items-center gap-1.5 text-muted mb-1.5">
                  <Flame className="w-4 h-4 text-accent" />
                  <span className="text-xs uppercase tracking-wider font-semibold">En oferta</span>
                </div>
                <span className="font-sans text-2xl sm:text-3xl font-extrabold text-ink">{saleProducts.length}</span>
              </div>
              <div className="bg-paper-soft border border-line p-3.5 sm:p-5 rounded-2xl shadow-xs">
                <div className="flex items-center gap-1.5 text-muted mb-1.5">
                  <Percent className="w-4 h-4 text-accent" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Desc. máx.</span>
                </div>
                <span className="font-sans text-2xl sm:text-3xl font-extrabold text-accent">-{maxDiscountPct}%</span>
              </div>
              <div className="bg-paper-soft border border-line p-3.5 sm:p-5 rounded-2xl shadow-xs">
                <div className="flex items-center gap-1.5 text-muted mb-1.5">
                  <Wallet className="w-4 h-4 text-accent" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Ahorro máx.</span>
                </div>
                <span className="font-sans text-2xl sm:text-3xl font-extrabold text-ink">S/.{maxSavings.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Auto-rotating Campaign Banner (5 cols) */}
          <div
            className="lg:col-span-5 relative min-h-[300px] sm:min-h-[380px] lg:min-h-full bg-black overflow-hidden flex items-center justify-center border-t lg:border-t-0 lg:border-l border-line group"
            onMouseEnter={() => setIsBannerHovered(true)}
            onMouseLeave={() => setIsBannerHovered(false)}
          >
            {OFERTAS_HERO_BANNERS.map((banner, idx) => (
              <div
                key={banner.image}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === activeBannerIdx ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 pointer-events-none" />
                
                {/* Banner Caption */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-black/60 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {banner.tag}
                  </span>
                </div>
              </div>
            ))}

            {/* Bottom Info & Slide Controls */}
            <div className="absolute bottom-5 left-5 right-5 flex flex-col gap-3 z-10 text-white">
              <div className="flex items-center justify-between">
                <span className="bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  HASTA -{maxDiscountPct}% OFF
                </span>
                <span className="text-xs text-zinc-300 font-medium tracking-wide">
                  Stock Limitado 2026
                </span>
              </div>

              {/* Dots navigation */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  {OFERTAS_HERO_BANNERS.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setActiveBannerIdx(dotIdx)}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                        dotIdx === activeBannerIdx
                          ? 'w-6 bg-accent'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Ir al banner ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow navigation */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveBannerIdx((prev) => (prev - 1 + OFERTAS_HERO_BANNERS.length) % OFERTAS_HERO_BANNERS.length)}
                    className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
                    aria-label="Banner anterior"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveBannerIdx((prev) => (prev + 1) % OFERTAS_HERO_BANNERS.length)}
                    className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
                    aria-label="Siguiente banner"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        {/* Deals grid — sort controls instead of a full filter sidebar (the set is small and curated) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4 mb-10">
            <h2 className="font-heading font-extrabold text-xl sm:text-3xl text-ink">
              {saleProducts.length} {saleProducts.length === 1 ? 'prenda rebajada' : 'prendas rebajadas'}
            </h2>
            <div className="flex items-center gap-2 text-xs font-semibold">
              {[
                { id: 'discount' as const, label: 'Mayor descuento' },
                { id: 'savings' as const, label: 'Mayor ahorro' },
                { id: 'price' as const, label: 'Menor precio' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`ofertas-sort-${opt.id}`}
                  onClick={() => setSortMode(opt.id)}
                  className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                    sortMode === opt.id
                      ? 'bg-ink text-paper-soft border-ink shadow-sm'
                      : 'bg-paper-soft text-muted border-line hover:text-ink hover:border-accent/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {sortedDeals.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {sortedDeals.map((p) => (
                <DealProductCard
                  key={p.id}
                  product={p}
                  discountPct={p.discountPct}
                  savingsAmount={p.savingsAmount}
                  onQuickView={onQuickView}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.some((f) => f.id === p.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-paper-soft border border-line">
              <p className="text-xs uppercase tracking-widest font-black text-ink">No hay ofertas activas por ahora</p>
              <p className="text-muted text-xs mt-1.5 max-w-sm mx-auto font-light leading-relaxed">
                Vuelve pronto — las rebajas rotan por temporada. Mientras tanto, explora el catálogo completo.
              </p>
            </div>
          )}
        </div>

        {/* Cross-sell: the sale list is intentionally small and curated, so keep momentum with full-price bestsellers */}
        {crossSellProducts.length > 0 && (
          <div className="border-t border-line pt-16">
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-10 gap-3">
              <div>
                <span className="text-[10px] tracking-[0.25em] text-muted font-bold uppercase block">Precio de lista</span>
                <h2 className="font-display text-xl sm:text-2xl font-medium text-ink">También te puede interesar</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {crossSellProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={onQuickView}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.some((f) => f.id === p.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Closing CTA back to the full catalogue */}
        <div className="border-t border-line pt-12 flex flex-col items-center text-center gap-4">
          <p className="text-muted text-xs font-sans font-light max-w-md">
            ¿Buscas algo más específico? Explora el catálogo completo con todas nuestras siluetas y tejidos.
          </p>
          <button
            id="ofertas-explore-catalog-btn"
            onClick={onExploreCatalog}
            className="bg-accent text-white hover:bg-rose-600 text-xs font-mono font-bold uppercase tracking-widest py-4 px-8 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.35)]"
          >
            VER CATÁLOGO COMPLETO <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
