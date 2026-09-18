import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import NuevosIngresosPremium from '../../components/home/NuevosIngresosPremium';
import TechnicalBlueprint from '../../components/product/TechnicalBlueprint';

interface NuevosIngresosPageProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, size: string, color: string, fabric?: string, sleeve?: string) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: Product[];
  onQuickView: (product: Product) => void;
  onExploreCatalog: () => void;
}

const NUEVOS_BANNERS = [
  {
    image: '/banners/banner-9.png',
    tag: 'LANZAMIENTO OFICIAL // DROP 2026',
    title: 'VANTA Atelier New Drop',
    subtitle: 'Algodón peinado 24/1 & Felpa pesada 420 GSM',
  },
  {
    image: '/banners/banner-5.png',
    tag: 'SILUETA COLECTIVA',
    title: 'Oversized Boxy Fit',
    subtitle: 'Hombro caído y caída rígida arquitectónica',
  },
  {
    image: '/banners/banner-2.png',
    tag: 'CORTE CONTEMPORÁNEO',
    title: 'Ingeniería Sartorial',
    subtitle: 'Costuras reforzadas y suavizado de silicona',
  },
];

export default function NuevosIngresosPage({
  products,
  onAddToCart,
  onToggleFavorite,
  favorites,
  onQuickView,
  onExploreCatalog,
}: NuevosIngresosPageProps) {
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % NUEVOS_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  return (
    <div id="nuevos-ingresos-page" className="pt-[78px] sm:pt-[96px] md:pt-[130px] bg-paper">

      {/* ── HERO: imagen a la derecha, texto a la izquierda, layout limpio sin superposición ── */}
      <section id="nuevos-ingresos-hero" className="bg-paper-soft border-b border-line overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[420px] sm:min-h-[500px]">

          {/* LEFT — texto */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-14 sm:py-20 gap-6">
            <Link
              id="back-to-home-link"
              to="/"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-accent transition-colors self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio
            </Link>

            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-muted uppercase flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                CO-01 // COLEC-NUEVA // DROP DE INGENIERÍA TEXTIL
              </span>
              <motion.h1
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-5xl sm:text-6xl leading-none tracking-tight"
              >
                NUEVOS
                <br />
                <span className="text-accent">CONTEMPORÁNEOS</span>
              </motion.h1>
            </div>

            <p className="text-muted text-sm font-light leading-relaxed max-w-md">
              Piezas de edición estrictamente limitada desarrolladas con patronajes de caja pesada (<span className="text-ink font-semibold">Relaxed Boxy Fit</span>) y hombros caídos de inspiración urbana vintage. {products.length} prendas disponibles en este drop.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { label: 'Caja Pesada Premium' },
                { label: 'Patronajes de Alta Costura' },
                { label: 'Edición Limitada' },
              ].map(item => (
                <span key={item.label} className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-muted bg-panel border border-line px-3.5 py-1.5 rounded-full">
                  {item.label}
                </span>
              ))}
            </div>

            {/* Live card */}
            <div className="text-xs font-sans text-muted space-y-2 border border-line bg-paper/60 backdrop-blur-md p-5 rounded-2xl self-start">
              {[
                { k: 'Línea', v: 'VANTA STUDIO 2026' },
                { k: 'Ubicación', v: 'Lima Metropolitana' },
                { k: 'Prendas', v: `${products.length} disponibles en drop` },
              ].map(row => (
                <div key={row.k} className="flex justify-between gap-8">
                  <span className="text-muted">{row.k}:</span>
                  <span className="font-bold text-ink">{row.v}</span>
                </div>
              ))}
              <div className="flex justify-between gap-8 pt-2 border-t border-line">
                <span className="text-muted">Estado:</span>
                <span className="font-extrabold text-accent flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  DROP ACTIVO
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — Rotating Hero Banners */}
          <div
            className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-full overflow-hidden flex items-center justify-center bg-black group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {NUEVOS_BANNERS.map((banner, idx) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-paper-soft/90 via-black/30 to-black/20" />
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-paper-soft to-transparent pointer-events-none hidden lg:block" />

                {/* Badge top */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="bg-black/60 backdrop-blur-md border border-white/15 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {banner.tag}
                  </span>
                </div>

                {/* Caption bottom */}
                <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                  <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">
                    {banner.title}
                  </h3>
                  <p className="text-xs text-zinc-300 font-light mt-0.5">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Navigation Dots & Controls */}
            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                {NUEVOS_BANNERS.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveBannerIdx(dotIdx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      dotIdx === activeBannerIdx
                        ? 'w-6 bg-accent'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Banner ${dotIdx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveBannerIdx((prev) => (prev - 1 + NUEVOS_BANNERS.length) % NUEVOS_BANNERS.length)}
                className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveBannerIdx((prev) => (prev + 1) % NUEVOS_BANNERS.length)}
                className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer"
                aria-label="Siguiente"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        {/* Bento Grid Capsule Highlights Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          <div className="bg-panel/70 text-ink p-6 border border-line rounded-3xl flex flex-col justify-between relative overflow-hidden min-h-[200px] shadow-sm">
            <div className="flex justify-between items-start z-10">
              <span className="text-xs font-sans tracking-wider text-muted uppercase font-semibold">01 // ESPECIFICACIONES CLAVE</span>
              <Sparkles className="w-4 h-4 text-accent" />
            </div>
            <div className="space-y-1.5 z-10">
              <h4 className="font-heading font-bold text-base text-ink uppercase">MATERIALES PESADOS</h4>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Lanzamiento confeccionado con hilado de algodón peinado 24/1 y felpa pesada de hasta 420 gramos con estructura indeformable.
              </p>
            </div>
            <div className="flex gap-2 z-10 text-xs text-muted border-t border-line pt-3 justify-between font-medium">
              <span>ANCHO CAJA: +4 CM</span>
              <span className="text-accent font-bold">PESO: 420 GSM</span>
            </div>
          </div>

          <div className="bg-panel/70 text-ink p-6 border border-line rounded-3xl flex flex-col justify-between min-h-[200px] shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-xs font-sans tracking-wider text-muted uppercase font-semibold">02 // EDICIÓN EXCLUSIVA</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-1 my-auto">
              <h4 className="font-heading font-bold text-base text-ink uppercase">TEXTIL AVANZADO</h4>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Cada prenda ha sido tratada con suavizado de silicona y fijador de color reactivo para un brillo mate y textura sedosa.
              </p>
            </div>
            <div className="text-xs text-muted flex items-center justify-between border-t border-line pt-3 font-medium">
              <span>FIBRA 100% NATURAL</span>
              <span className="text-ink font-semibold">TACTO SUAVE</span>
            </div>
          </div>

          <div className="bg-panel/70 text-ink p-6 border border-line rounded-3xl flex flex-col justify-between min-h-[200px] group/bento shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-xs font-sans tracking-wider text-muted uppercase font-semibold">03 // CAD SIMULATOR</span>
              <Ruler className="w-4 h-4 text-muted" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-heading font-bold text-base text-ink uppercase">PATRONAJE EN VIVO</h4>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Visualiza cómo medimos cada costura, dobladillo y hombro en nuestro simulador interactivo de cotas técnicas.
              </p>
            </div>
            <button
              id="scroll-to-blueprint-widget-btn"
              onClick={() => {
                const widget = document.getElementById('technical-blueprint-widget');
                if (widget) widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="text-xs uppercase tracking-wider text-ink border-b border-accent pb-0.5 self-start flex items-center gap-1.5 group-hover/bento:gap-2.5 transition-all font-bold cursor-pointer"
            >
              <span>Abrir plano esquemático</span>
              <ArrowRight className="w-3.5 h-3.5 text-accent" />
            </button>
          </div>
        </div>

        {/* Integrated Premium Launch Experience */}
        <NuevosIngresosPremium
          products={products}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          onQuickView={onQuickView}
        />

        {/* Technical Blueprint Widget */}
        <div id="technical-blueprint-widget" className="pt-16 border-t border-line scroll-mt-32">
          <div className="text-center space-y-2 mb-10 max-w-2xl mx-auto">
            <span className="text-[9.5px] font-mono tracking-[0.3em] text-accent uppercase font-bold block">
              LABORATORIO SARTORIAL // DROP FIT 2026
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-ink uppercase">
              Simulador Técnico & Guía de Tallas
            </h3>
            <p className="text-muted text-xs font-light max-w-lg mx-auto">
              Explora las cotas de patronaje en tiempo real, compara las medidas exactas de cada silueta y calcula tu talla ideal con nuestro recomendador inteligente.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <TechnicalBlueprint />
          </div>
        </div>

        {/* Closing CTA back to the full catalogue */}
        <div className="border-t border-line pt-12 flex flex-col items-center text-center gap-4">
          <p className="text-muted text-xs font-sans font-light max-w-md">
            ¿Buscas algo distinto? Explora el catálogo completo con todas nuestras siluetas y tejidos.
          </p>
          <button
            id="nuevos-ingresos-explore-catalog-btn"
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
