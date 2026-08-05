import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

type GarmentType = 'polo' | 'polera' | 'camisa' | 'manga-larga' | 'camisero' | 'notch';

interface GarmentConfig {
  label: string;
  shortLabel: string;
  image: string;
}

const garments: Record<GarmentType, GarmentConfig> = {
  polo:          { label: 'Polo Clásico',    shortLabel: 'POLO',      image: '/medidas/medida-clasicos.png' },
  polera:        { label: 'Polera / Hoodie', shortLabel: 'POLERA',    image: '/medidas/medida-polera.png' },
  camisa:        { label: 'Camisa Casual',   shortLabel: 'CAMISA',    image: '/medidas/medida-camisa.png' },
  'manga-larga': { label: 'Manga Larga',     shortLabel: 'M. LARGA',  image: '/medidas/medida-manga-larga.png' },
  camisero:      { label: 'Camisero',        shortLabel: 'CAMISERO',  image: '/medidas/medida-camisero.png' },
  notch:         { label: 'Notch / Collar',  shortLabel: 'NOTCH',     image: '/medidas/medida-notch.png' },
};

const ORDER: GarmentType[] = ['polo', 'polera', 'camisa', 'manga-larga', 'camisero', 'notch'];

export default function TechnicalBlueprint() {
  const [active, setActive] = useState<GarmentType>('polo');
  const [zoomed, setZoomed] = useState(false);

  const current = garments[active];
  const idx = ORDER.indexOf(active);
  const prev = () => setActive(ORDER[(idx - 1 + ORDER.length) % ORDER.length]);
  const next = () => setActive(ORDER[(idx + 1) % ORDER.length]);

  return (
    <>
      {/* ── ZOOM MODAL ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            key="zoom-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out"
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-5xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setZoomed(false)}
                className="absolute -top-11 right-0 text-white/50 hover:text-white flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Cerrar
              </button>
              {/* Prev / Next in modal */}
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white/40 hover:text-white transition-colors cursor-pointer">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white/40 hover:text-white transition-colors cursor-pointer">
                <ChevronRight className="w-6 h-6" />
              </button>
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  src={current.image}
                  alt={current.label}
                  className="w-full h-auto max-h-[88vh] object-contain rounded-sm"
                />
              </AnimatePresence>
              {/* Label */}
              <div className="text-center mt-3 font-mono text-[10px] text-white/50 uppercase tracking-widest">
                {current.label} · {idx + 1} / {ORDER.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── WIDGET ── */}
      <div id="technical-blueprint-content" className="w-full">

        {/* TABS */}
        <div className="flex items-center gap-1 mb-6 flex-wrap">
          {ORDER.map((type) => {
            const isActive = active === type;
            return (
              <button
                key={type}
                id={`blueprint-nav-${type}`}
                onClick={() => setActive(type)}
                className={`px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-ink text-paper-soft border-ink font-bold'
                    : 'bg-paper text-muted border-line hover:border-ink/40 hover:text-ink'
                }`}
              >
                {garments[type].shortLabel}
              </button>
            );
          })}
        </div>

        {/* IMAGE — full-width, the image already contains all the measurement info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative group cursor-zoom-in border border-line bg-[#1a1916] overflow-hidden"
            onClick={() => setZoomed(true)}
          >
            {/* Zoom hint */}
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-flex items-center gap-1.5 bg-ink/80 backdrop-blur-sm text-paper-soft px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest">
                <ZoomIn className="w-3 h-3" /> Ampliar imagen
              </span>
            </div>

            <img
              src={current.image}
              alt={`Guía de medidas — ${current.label}`}
              className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.01]"
              style={{ maxHeight: '600px' }}
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
                if (t.parentElement) {
                  t.parentElement.innerHTML = '<div class="flex items-center justify-center h-48 text-muted font-mono text-xs uppercase tracking-widest">Imagen no disponible</div>';
                }
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* BOTTOM NAV — prev/next + dots */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
          <button
            onClick={prev}
            className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Anterior
          </button>
          <div className="flex items-center gap-3">
            {ORDER.map((t, i) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`transition-all cursor-pointer ${
                  t === active
                    ? 'w-5 h-1.5 bg-ink rounded-full'
                    : 'w-1.5 h-1.5 bg-line hover:bg-muted rounded-full'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-muted hover:text-ink transition-colors cursor-pointer"
          >
            Siguiente <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Micro-note */}
        <p className="text-center font-mono text-[8px] uppercase tracking-[0.25em] text-muted/50 mt-4">
          Haz clic en la imagen para ampliar · Las medidas pueden variar ±1.5 cm
        </p>
      </div>
    </>
  );
}
