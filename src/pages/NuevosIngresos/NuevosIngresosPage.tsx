import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles, Ruler } from 'lucide-react';
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

export default function NuevosIngresosPage({
  products,
  onAddToCart,
  onToggleFavorite,
  favorites,
  onQuickView,
  onExploreCatalog,
}: NuevosIngresosPageProps) {
  return (
    <div id="nuevos-ingresos-page" className="pt-[108px] sm:pt-[124px] bg-paper">

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
            <div className="flex flex-wrap gap-3">
              {[
                { icon: '▣', label: 'CAJA PESADA PREMIUM' },
                { icon: '✕', label: 'PATRONAJES DE INGENIERÍA' },
                { icon: '◎', label: 'EDICIÓN LIMITADA' },
              ].map(item => (
                <span key={item.label} className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-muted border border-line px-2 py-1">
                  {item.icon} {item.label}
                </span>
              ))}
            </div>

            {/* Live card */}
            <div className="text-[9px] font-mono text-muted space-y-1.5 border border-line bg-paper p-4 self-start">
              {[
                { k: 'SISTEMA', v: 'MONT_CAD_V4.5' },
                { k: 'UBICACIÓN', v: 'LIMA METROPOLITANA' },
                { k: 'PIEZAS', v: `${products.length} EN DROP` },
              ].map(row => (
                <div key={row.k} className="flex justify-between gap-8">
                  <span className="text-muted">{row.k}:</span>
                  <span className="font-bold text-ink">{row.v}</span>
                </div>
              ))}
              <div className="flex justify-between gap-8 pt-1 border-t border-line">
                <span className="text-muted">DISP:</span>
                <span className="font-black text-accent animate-pulse">● DROP ACTIVO</span>
              </div>
            </div>
          </div>

          {/* RIGHT — imagen real sin superposición */}
          <div className="relative hidden lg:block">
            <img
              src="/imagenes/banner-secundario.png"
              alt="Nuevos Ingresos — Colección Drop"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* sutil sombra izquierda para fundir con el fondo */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper-soft to-transparent pointer-events-none" />
          </div>

          {/* Mobile: imagen debajo del texto */}
          <div className="lg:hidden w-full h-56 overflow-hidden relative">
            <img
              src="/imagenes/banner-secundario.png"
              alt="Nuevos Ingresos"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-paper-soft/80 to-transparent pointer-events-none" />
          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        {/* Bento Grid Capsule Highlights Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="bg-panel text-ink p-5 border border-line flex flex-col justify-between relative overflow-hidden h-[180px]">
            <div className="flex justify-between items-start z-10">
              <span className="text-[8px] font-sans tracking-widest text-muted uppercase">01 // ESPECIFICACIONES CLAVE</span>
              <Sparkles className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="space-y-1.5 z-10">
              <h4 className="font-sans font-black text-sm tracking-widest text-ink uppercase">MATERIALES PREMIUM</h4>
              <p className="text-[10px] font-sans font-light text-muted leading-relaxed">
                Lanzamiento confeccionado con hilado de algodón peinado 24/1 y felpa italiana pesada de hasta 420 gramos de textura tridimensional.
              </p>
            </div>
            <div className="flex gap-2 z-10 text-[8px] font-mono text-muted uppercase border-t border-line pt-2.5 justify-between">
              <span>ANCHO CAJA: +4 CM</span>
              <span>PESO MAX: 420 GSM</span>
            </div>
          </div>

          <div className="bg-paper-soft text-ink p-5 border border-line flex flex-col justify-between h-[180px]">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-sans tracking-widest text-muted uppercase">02 // EDICIÓN EXCLUSIVA</span>
              <span className="w-1.5 h-1.5 bg-ink rounded-full" />
            </div>
            <div className="space-y-1 my-auto">
              <h4 className="font-sans font-black text-sm tracking-widest text-ink uppercase">TEXTIL AVANZADO</h4>
              <p className="text-[10px] font-sans font-light text-muted leading-normal">
                Cada prenda ha sido tratada con suavizado de silicona y fijador de color reactivo de alto espectro para un brillo mate duradero.
              </p>
            </div>
            <div className="text-[8.5px] font-sans text-muted flex items-center justify-between border-t border-line pt-2">
              <span>FIBRA NATURAL</span>
              <span>TACTO ULTRA SUAVE</span>
            </div>
          </div>

          <div className="bg-paper border border-line p-5 flex flex-col justify-between h-[180px] group/bento">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-sans tracking-widest text-muted uppercase">03 // CAD SIMULATOR</span>
              <Ruler className="w-3.5 h-3.5 text-muted" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-sans font-black text-sm tracking-widest text-ink uppercase">PATRONAJE EN VIVO</h4>
              <p className="text-[10px] font-sans font-light text-muted leading-relaxed">
                ¿Quieres ver cómo medimos cada costura, dobladillo y hombro? Abre nuestro visualizador técnico interactivo con simulador de medidas.
              </p>
            </div>
            <button
              id="scroll-to-blueprint-widget-btn"
              onClick={() => {
                const widget = document.getElementById('technical-blueprint-widget');
                if (widget) widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="text-[9px] font-mono uppercase tracking-wider text-ink border-b border-ink pb-0.5 self-start flex items-center gap-1 group-hover/bento:gap-2 transition-all font-bold"
            >
              ABRIR PLANO ESQUEMÁTICO <ArrowRight className="w-3 h-3" />
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
          <div className="text-center space-y-1.5 mb-10">
            <span className="text-[9px] font-sans tracking-[0.2em] text-muted uppercase block">LABORATORIO SARTORIAL // PATRONAJE</span>
            <h3 className="text-xl font-sans font-bold tracking-widest text-ink uppercase">VISUALIZADOR TÉCNICO DE PRENDAS</h3>
            <p className="text-muted text-[10px] font-sans font-light max-w-md mx-auto">
              Haz clic en las líneas acotadas del plano para simular y comprender los encajes holgados de nuestras siluetas.
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
            className="bg-ink text-paper-soft hover:bg-accent text-xs font-mono font-bold uppercase tracking-widest py-4 px-8 transition-all flex items-center gap-2"
          >
            VER CATÁLOGO COMPLETO <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
