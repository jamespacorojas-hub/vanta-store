import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Percent, Wallet, Flame } from 'lucide-react';
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

export default function OfertasPage({
  saleProducts,
  crossSellProducts,
  onToggleFavorite,
  favorites,
  onQuickView,
  onExploreCatalog,
}: OfertasPageProps) {
  const [sortMode, setSortMode] = useState<SortMode>('discount');

  const maxDiscountPct = saleProducts.length > 0 ? Math.max(...saleProducts.map((p) => p.discountPct)) : 0;
  const maxSavings = saleProducts.length > 0 ? Math.max(...saleProducts.map((p) => p.savingsAmount)) : 0;

  const sortedDeals = useMemo(() => {
    const list = [...saleProducts];
    if (sortMode === 'savings') return list.sort((a, b) => b.savingsAmount - a.savingsAmount);
    if (sortMode === 'price') return list.sort((a, b) => a.price - b.price);
    return list.sort((a, b) => b.discountPct - a.discountPct);
  }, [saleProducts, sortMode]);

  return (
    <div id="ofertas-page" className="pt-[78px] sm:pt-[96px] md:pt-[130px] bg-paper">
      {/* Full-page header dedicated to deals — stats, not spec sheets */}
      <section id="ofertas-hero" className="relative bg-panel text-ink overflow-hidden border-b border-line">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Link
            id="back-to-home-link-ofertas"
            to="/"
            className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink hover:text-accent transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
          </Link>

          <div className="max-w-2xl">
            <span className="text-[10px] font-sans tracking-[0.35em] text-muted uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-accent rounded-full" />
              PRECIOS REBAJADOS // STOCK REAL
            </span>
            <h1 className="font-display font-black text-4xl sm:text-6xl leading-tight mt-2.5">
              OFERTAS
              <br />
              <span className="text-accent">ACTIVAS AHORA</span>
            </h1>
            <p className="text-muted text-xs sm:text-sm font-sans font-light leading-relaxed mt-5 max-w-xl">
              Precios rebajados directamente sobre el precio de lista, sin cupones ni letra pequeña. Se actualizan por temporada y duran hasta agotar el stock disponible.
            </p>
          </div>

          {/* Real stats bar — no invented urgency, only what the data actually says */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-12 max-w-2xl">
            <div className="bg-paper-soft border border-line p-4 sm:p-5">
              <div className="flex items-center gap-1.5 text-muted mb-1.5">
                <Flame className="w-3.5 h-3.5 text-accent" />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold">En oferta</span>
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-black text-ink">{saleProducts.length}</span>
            </div>
            <div className="bg-paper-soft border border-line p-4 sm:p-5">
              <div className="flex items-center gap-1.5 text-muted mb-1.5">
                <Percent className="w-3.5 h-3.5 text-accent" />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold">Descuento máx.</span>
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-black text-ink">-{maxDiscountPct}%</span>
            </div>
            <div className="bg-paper-soft border border-line p-4 sm:p-5">
              <div className="flex items-center gap-1.5 text-muted mb-1.5">
                <Wallet className="w-3.5 h-3.5 text-accent" />
                <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold">Ahorro máx.</span>
              </div>
              <span className="font-mono text-2xl sm:text-3xl font-black text-ink">S/.{maxSavings.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20">
        {/* Deals grid — sort controls instead of a full filter sidebar (the set is small and curated) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4 mb-10">
            <h2 className="font-display text-xl sm:text-2xl font-medium text-ink">
              {saleProducts.length} {saleProducts.length === 1 ? 'prenda rebajada' : 'prendas rebajadas'}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold">
              {[
                { id: 'discount' as const, label: 'Mayor descuento' },
                { id: 'savings' as const, label: 'Mayor ahorro' },
                { id: 'price' as const, label: 'Menor precio' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  id={`ofertas-sort-${opt.id}`}
                  onClick={() => setSortMode(opt.id)}
                  className={`px-3 py-2 border transition-colors ${
                    sortMode === opt.id
                      ? 'bg-ink text-paper-soft border-ink'
                      : 'bg-paper-soft text-muted border-line hover:text-ink'
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
