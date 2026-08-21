import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  Sliders,
  Maximize2,
  Info,
  Shuffle,
} from 'lucide-react';
import productImageManifest from '../../data/productImageManifest.json';
import { getColorClass } from '../../utils/colorSwatch';

type GarmentType = 'polo' | 'polera' | 'camisa' | 'manga-larga' | 'camisero' | 'notch';
type SizeType = 'S' | 'M' | 'L' | 'XL';

const manifest = productImageManifest as Record<string, Record<string, Record<string, string>>>;

const MANIFEST_KEY_MAP: Record<GarmentType, string> = {
  polo: 'clasico',
  polera: 'polera',
  camisa: 'camisa',
  'manga-larga': 'manga-larga',
  camisero: 'camisero',
  notch: 'notch',
};

// Extract full photo pool for a garment
function getPhotoPoolForGarment(type: GarmentType): { color: string; fabric: string; url: string }[] {
  const key = MANIFEST_KEY_MAP[type] || 'clasico';
  const garmentData = manifest[key];
  if (!garmentData) return [];

  const pool: { color: string; fabric: string; url: string }[] = [];
  for (const [fabric, colors] of Object.entries(garmentData)) {
    for (const [color, url] of Object.entries(colors)) {
      pool.push({ color, fabric, url });
    }
  }
  return pool;
}

interface MeasurementSet {
  largo: number;
  ancho: number;
  cuello?: number;
  manga?: number;
  mangaAlta?: number;
  mangaBaja?: number;
  abertura?: number;
  puno?: number;
}

interface GarmentData {
  label: string;
  shortLabel: string;
  categoryTag: string;
  fitName: string;
  description: string;
  image: string;
  sizes: SizeType[];
  columns: { key: keyof MeasurementSet; label: string; tooltip: string }[];
  measurements: Record<SizeType, MeasurementSet>;
  careTips: string;
}

const GARMENTS: Record<GarmentType, GarmentData> = {
  polo: {
    label: 'Polos Basics',
    shortLabel: 'POLO BASICS',
    categoryTag: 'ESENCIAL ALGODÓN PESADO // CORTE OVERSIZE',
    fitName: 'Corte Oversize Boxy',
    description:
      'Diseño amplio con caída estructurada, cuello redondo de rib cerrado y hombro caído para mayor comodidad y estilo streetwear.',
    image: '/medidas/medida-clasicos.png',
    sizes: ['S', 'M', 'L', 'XL'],
    columns: [
      { key: 'largo', label: 'Largo (cm)', tooltip: 'Desde la esquina del cuello hasta la basta inferior.' },
      { key: 'ancho', label: 'Ancho (cm)', tooltip: 'Medido horizontalmente de sisa a sisa en plano.' },
      { key: 'cuello', label: 'Cuello (cm)', tooltip: 'Diámetro de abertura de cuello.' },
      { key: 'manga', label: 'Manga (cm)', tooltip: 'Largo de manga desde costura de hombro.' },
      { key: 'abertura', label: 'Abertura (cm)', tooltip: 'Boca de la manga.' },
    ],
    measurements: {
      S: { largo: 63, ancho: 53, cuello: 21, manga: 19, abertura: 17 },
      M: { largo: 65, ancho: 55, cuello: 22, manga: 20, abertura: 18 },
      L: { largo: 68, ancho: 57, cuello: 22, manga: 21, abertura: 19 },
      XL: { largo: 71, ancho: 59, cuello: 22, manga: 22, abertura: 20 },
    },
    careTips: 'Lavar en frío del revés. No usar secadora para preservar la densidad del tejido.',
  },
  polera: {
    label: 'Polera Oversize',
    shortLabel: 'POLERA OVERSIZE',
    categoryTag: 'FELPA PESADA DE ALTO GRAMAJE // OVERSIZE',
    fitName: 'Drop-Shoulder Boxy Fit',
    description:
      'Silueta de máxima presencia con hombro caído, pretina acanalada y mangas de volumen estructurado.',
    image: '/medidas/medida-polera.png',
    sizes: ['S', 'M', 'L'],
    columns: [
      { key: 'ancho', label: 'Ancho (cm)', tooltip: 'Ancho de pecho de sisa a sisa.' },
      { key: 'largo', label: 'Largo (cm)', tooltip: 'Largo vertical de la polera.' },
      { key: 'manga', label: 'Manga (cm)', tooltip: 'Largo de manga desde hombro caído.' },
      { key: 'cuello', label: 'Cuello (cm)', tooltip: 'Diámetro de cuello.' },
      { key: 'puno', label: 'Alto Puño (cm)', tooltip: 'Alto de rib en puños.' },
    ],
    measurements: {
      S: { ancho: 62, largo: 53, manga: 57, cuello: 21, puno: 5 },
      M: { ancho: 64, largo: 55, manga: 56, cuello: 21, puno: 5 },
      L: { ancho: 66, largo: 56, manga: 58, cuello: 22, puno: 5 },
      XL: { ancho: 68, largo: 58, manga: 59, cuello: 22, puno: 5 },
    },
    careTips: 'Secado en plano. No planchar directamente sobre el tejido para mantener su caída.',
  },
  camisa: {
    label: 'Camisas Street',
    shortLabel: 'CAMISA STREET',
    categoryTag: 'TEJIDO TEXTURIZADO // CORTE RELAJADO',
    fitName: 'Corte Relajado Urbano',
    description:
      'Diseño cómodo y moderno con solapa cubana y botonadura frontal para un estilo auténtico y urbano.',
    image: '/medidas/medida-camisa.png',
    sizes: ['S', 'M', 'L', 'XL'],
    columns: [
      { key: 'largo', label: 'Largo (cm)', tooltip: 'Largo total desde la esquina del cuello.' },
      { key: 'ancho', label: 'Ancho (cm)', tooltip: 'Ancho de sisa a sisa.' },
      { key: 'cuello', label: 'Cuello (cm)', tooltip: 'Abertura de solapa.' },
      { key: 'manga', label: 'Manga (cm)', tooltip: 'Largo de manga corta.' },
      { key: 'abertura', label: 'Abertura (cm)', tooltip: 'Boca de manga.' },
    ],
    measurements: {
      S: { largo: 65, ancho: 50, cuello: 16, manga: 22, abertura: 17 },
      M: { largo: 66, ancho: 53, cuello: 19, manga: 23, abertura: 18 },
      L: { largo: 70, ancho: 54, cuello: 20, manga: 24, abertura: 19 },
      XL: { largo: 73, ancho: 55, cuello: 21, manga: 25, abertura: 20 },
    },
    careTips: 'Secar a la sombra en colgador para conservar el cuello nítido.',
  },
  'manga-larga': {
    label: 'Polo Manga Larga',
    shortLabel: 'MANGA LARGA',
    categoryTag: 'ALGODÓN PESADO // PUÑOS ACANALADOS',
    fitName: 'Longsleeve Boxy Cut',
    description:
      'Silueta con mangas completas y puños ceñidos de rib. Ideal para climas templados y looks en capas.',
    image: '/medidas/medida-manga-larga.png',
    sizes: ['S', 'M', 'L', 'XL'],
    columns: [
      { key: 'largo', label: 'Largo (cm)', tooltip: 'Largo vertical de la prenda.' },
      { key: 'ancho', label: 'Ancho (cm)', tooltip: 'Ancho de pecho de sisa a sisa.' },
      { key: 'mangaAlta', label: 'Manga Alta (cm)', tooltip: 'Desde hombro hasta la muñeca.' },
      { key: 'mangaBaja', label: 'Manga Baja (cm)', tooltip: 'Desde axila hasta el puño.' },
    ],
    measurements: {
      S: { largo: 61, ancho: 45, mangaAlta: 59, mangaBaja: 50 },
      M: { largo: 64, ancho: 49, mangaAlta: 60, mangaBaja: 51 },
      L: { largo: 67, ancho: 51, mangaAlta: 61, mangaBaja: 51 },
      XL: { largo: 69, ancho: 57, mangaAlta: 62, mangaBaja: 52 },
    },
    careTips: 'Lavar con agua fría para no alterar la longitud de las mangas.',
  },
  camisero: {
    label: 'Polos Camiseros',
    shortLabel: 'CAMISERO',
    categoryTag: 'CUELLO SARTORIAL // BOTONADURA',
    fitName: 'Corte Clásico Urbano',
    description:
      'Estructura refinada con cuello camisero formal y tejido streetwear de gramaje pesado.',
    image: '/medidas/medida-camisero.png',
    sizes: ['S', 'M', 'L', 'XL'],
    columns: [
      { key: 'largo', label: 'Largo (cm)', tooltip: 'Largo total desde la esquina del cuello.' },
      { key: 'ancho', label: 'Ancho (cm)', tooltip: 'Ancho de sisa a sisa.' },
      { key: 'cuello', label: 'Cuello (cm)', tooltip: 'Diámetro de cuello.' },
      { key: 'manga', label: 'Manga (cm)', tooltip: 'Largo de manga.' },
      { key: 'abertura', label: 'Abertura (cm)', tooltip: 'Boca de manga.' },
    ],
    measurements: {
      S: { largo: 62, ancho: 52, cuello: 21, manga: 20, abertura: 16 },
      M: { largo: 64, ancho: 54, cuello: 22, manga: 21, abertura: 17 },
      L: { largo: 68, ancho: 56, cuello: 22, manga: 22, abertura: 17 },
      XL: { largo: 70, ancho: 58, cuello: 23, manga: 23, abertura: 19 },
    },
    careTips: 'Planchar cuello del revés a temperatura media.',
  },
  notch: {
    label: 'Polos Cuello Pico',
    shortLabel: 'CUELLO PICO',
    categoryTag: 'ESCOTE EN V SIN BOTONES // CORTE OVERSIZE',
    fitName: 'Corte Oversize V-Collar',
    description:
      'Abertura de cuello en pico minimalista sin botones que estiliza la línea del torso con porte vanguardista.',
    image: '/medidas/medida-cuellov.png',
    sizes: ['S', 'M', 'L', 'XL'],
    columns: [
      { key: 'largo', label: 'Largo (cm)', tooltip: 'Largo total de prenda.' },
      { key: 'ancho', label: 'Ancho (cm)', tooltip: 'Ancho de pecho medido en plano.' },
      { key: 'cuello', label: 'Cuello (cm)', tooltip: 'Profundidad de escote.' },
      { key: 'manga', label: 'Manga (cm)', tooltip: 'Largo de manga.' },
      { key: 'abertura', label: 'Abertura (cm)', tooltip: 'Boca de la manga.' },
    ],
    measurements: {
      S: { largo: 64, ancho: 50, cuello: 20, manga: 19, abertura: 14 },
      M: { largo: 67, ancho: 53, cuello: 21, manga: 20, abertura: 15 },
      L: { largo: 69, ancho: 55, cuello: 22, manga: 21, abertura: 16 },
      XL: { largo: 72, ancho: 58, cuello: 23, manga: 22, abertura: 17 },
    },
    careTips: 'Lavar en ciclo suave para conservar la forma del escote en pico.',
  },
};

const ORDER: GarmentType[] = ['polo', 'polera', 'camisa', 'manga-larga', 'camisero', 'notch'];


export default function TechnicalBlueprint() {
  const [activeGarment, setActiveGarment] = useState<GarmentType>('polo');
  const [selectedSize, setSelectedSize] = useState<SizeType>('M');
  const [viewMode, setViewMode] = useState<'interactive' | 'poster'>('interactive');
  const [zoomed, setZoomed] = useState(false);
  const [activeDimension, setActiveDimension] = useState<string | null>(null);

  // Active Real Garment Photo
  const [activePhotoObj, setActivePhotoObj] = useState<{ color: string; fabric: string; url: string } | null>(null);

  // Fit Finder Calculator state
  const [heightCm, setHeightCm] = useState(175);
  const [weightKg, setWeightKg] = useState(72);
  const [fitPreference, setFitPreference] = useState<'regular' | 'oversize'>('oversize');

  const garment = GARMENTS[activeGarment];
  const activeMeasurements = garment.measurements[selectedSize] || garment.measurements['M'];

  // Randomize real product photo on garment change or on mount
  useEffect(() => {
    const pool = getPhotoPoolForGarment(activeGarment);
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setActivePhotoObj(pool[randomIndex]);
    }
  }, [activeGarment]);

  const handleRandomizePhoto = () => {
    const pool = getPhotoPoolForGarment(activeGarment);
    if (pool.length > 1) {
      const currentUrl = activePhotoObj?.url;
      const filtered = pool.filter((p) => p.url !== currentUrl);
      const randomIndex = Math.floor(Math.random() * filtered.length);
      setActivePhotoObj(filtered[randomIndex]);
    }
  };

  // Smart Fit Recommendation Formula
  const getRecommendedSize = (): SizeType => {
    let score = weightKg * 1.0 - (heightCm - 170) * 0.4;
    if (fitPreference === 'oversize') score += 8;

    if (score < 58) return 'S';
    if (score < 72) return 'M';
    if (score < 86) return 'L';
    return 'XL';
  };

  const recommendedSize = getRecommendedSize();

  const idx = ORDER.indexOf(activeGarment);
  const prev = () => setActiveGarment(ORDER[(idx - 1 + ORDER.length) % ORDER.length]);
  const next = () => setActiveGarment(ORDER[(idx + 1) % ORDER.length]);

  const photoPool = getPhotoPoolForGarment(activeGarment);

  return (
    <>
      {/* ── ZOOM MODAL FOR POSTER VIEW ── */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            key="zoom-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out p-4"
            onClick={() => setZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative w-full max-w-4xl bg-black rounded-xs p-2 border border-[#382f22] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setZoomed(false)}
                className="absolute -top-11 right-0 text-white/70 hover:text-white flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" /> Cerrar
              </button>
              <img
                src={garment.image}
                alt={garment.label}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xs"
              />
              <div className="text-center mt-3 font-mono text-xs text-[#D1C2A5] uppercase tracking-widest font-bold">
                VANTA ATELIER · {garment.label}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="technical-blueprint-interactive" className="w-full space-y-6 text-ink">
        {/* ── 1. GARMENT SELECTOR TABS & VIEW TOGGLE ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line pb-4">
          {/* Garment type pills */}
          <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 w-full sm:w-auto pb-1 sm:pb-0">
            {ORDER.map((type) => {
              const isAct = activeGarment === type;
              return (
                <button
                  key={type}
                  id={`blueprint-nav-${type}`}
                  onClick={() => setActiveGarment(type)}
                  className={`px-3.5 sm:px-4 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider transition-all rounded-xs border cursor-pointer shrink-0 ${
                    isAct
                      ? 'bg-ink text-paper border-ink font-bold shadow-xs'
                      : 'bg-panel text-muted border-line hover:text-ink hover:border-ink/40'
                  }`}
                >
                  {GARMENTS[type].shortLabel}
                </button>
              );
            })}
          </div>

          {/* Mode Switcher: Interactivo vs Lámina HD */}
          <div className="flex items-center gap-1 bg-panel border border-line p-1 rounded-xs self-end sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1 font-mono text-[9.5px] sm:text-[10px] uppercase tracking-wider transition-all rounded-xs cursor-pointer flex items-center gap-1 ${
                viewMode === 'interactive'
                  ? 'bg-ink text-paper font-bold shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Ruler className="w-3 h-3 text-accent" />
              <span>Simulador Interactivo</span>
            </button>
            <button
              onClick={() => setViewMode('poster')}
              className={`px-3 py-1 font-mono text-[9.5px] sm:text-[10px] uppercase tracking-wider transition-all rounded-xs cursor-pointer flex items-center gap-1 ${
                viewMode === 'poster'
                  ? 'bg-ink text-paper font-bold shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              <Maximize2 className="w-3 h-3 text-accent" />
              <span>Lámina HD</span>
            </button>
          </div>
        </div>

        {/* ── 2. VIEW MODE: INTERACTIVE SIZING LABORATORY ── */}
        {viewMode === 'interactive' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: ARCHITECTURAL ATELIER STAGE (7 cols) — Seamless Black Background */}
            <div className="lg:col-span-7 bg-black border border-[#2b2419] rounded-xs p-4 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[480px] shadow-2xl">
              {/* Subtle ambient lighting vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(40,32,20,0.35)_0%,_rgba(0,0,0,0.95)_75%)] pointer-events-none" />

              {/* Garment Header Bar */}
              <div className="flex items-start justify-between z-10 mb-3 gap-2">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.25em] text-[#D1C2A5] uppercase font-bold block">
                    {garment.categoryTag}
                  </span>
                  <h4 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    {garment.label}
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">
                    Silueta: <strong className="text-white">{garment.fitName}</strong>
                  </span>
                </div>

                {/* Size Selector in Blueprint Header */}
                <div className="flex items-center gap-1 bg-[#121110] border border-[#382f22] p-1 rounded-xs shrink-0">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase px-1 hidden sm:inline">
                    TALLA:
                  </span>
                  {garment.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 font-mono text-xs font-bold uppercase transition-all rounded-xs cursor-pointer flex items-center justify-center ${
                        selectedSize === s
                          ? 'bg-[#D1C2A5] text-black shadow-sm font-black scale-105'
                          : 'text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real Garment Photo Stage with Overlaid Dimension Lines */}
              <div className="relative flex-1 flex items-center justify-center my-2 py-4 z-10">
                {/* Real Garment Photo */}
                <div className="relative w-full max-w-[310px] sm:max-w-[340px] aspect-[4/4] flex items-center justify-center">
                  {activePhotoObj?.url ? (
                    <img
                      key={activePhotoObj.url}
                      src={activePhotoObj.url}
                      alt={`${garment.label} - ${activePhotoObj.color}`}
                      className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.9)] transition-all duration-500"
                    />
                  ) : (
                    <img
                      src={garment.image}
                      alt={garment.label}
                      className="w-full h-full object-contain"
                    />
                  )}

                  {/* Dimension Lines Overlay over Real Photo */}
                  <svg
                    viewBox="0 0 320 320"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    fill="none"
                    stroke="#D1C2A5"
                  >
                    {/* Largo Dimension Line (Vertical Right) */}
                    <line x1="285" y1="35" x2="285" y2="285" strokeWidth="1.2" strokeDasharray="3 3" />
                    <line x1="278" y1="35" x2="292" y2="35" strokeWidth="1.5" />
                    <line x1="278" y1="285" x2="292" y2="285" strokeWidth="1.5" />
                    <circle cx="285" cy="35" r="2.5" fill="#D1C2A5" />
                    <circle cx="285" cy="285" r="2.5" fill="#D1C2A5" />

                    {/* Ancho Pecho Dimension Line (Horizontal Center) */}
                    <line x1="45" y1="165" x2="275" y2="165" strokeWidth="1.2" strokeDasharray="3 3" />
                    <line x1="45" y1="158" x2="45" y2="172" strokeWidth="1.5" />
                    <line x1="275" y1="158" x2="275" y2="172" strokeWidth="1.5" />
                    <circle cx="45" cy="165" r="2.5" fill="#D1C2A5" />
                    <circle cx="275" cy="165" r="2.5" fill="#D1C2A5" />

                    {/* Cuello Dimension Line (Top Center) */}
                    <line x1="120" y1="22" x2="200" y2="22" strokeWidth="1.2" strokeDasharray="3 3" />
                    <line x1="120" y1="16" x2="120" y2="28" strokeWidth="1.5" />
                    <line x1="200" y1="16" x2="200" y2="28" strokeWidth="1.5" />
                  </svg>

                  {/* 1. Largo Dynamic Pin */}
                  <div
                    className="absolute -right-2 sm:right-1 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-md border border-[#D1C2A5] px-2.5 py-1 rounded-xs shadow-lg font-mono text-[10px] sm:text-xs font-bold text-white cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setActiveDimension('largo')}
                  >
                    <span className="text-[#D1C2A5] text-[8.5px] block font-mono">LARGO</span>
                    <span>{activeMeasurements.largo} cm</span>
                  </div>

                  {/* 2. Ancho Pecho Dynamic Pin */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-black/90 backdrop-blur-md border border-[#D1C2A5] px-2.5 py-1 rounded-xs shadow-lg font-mono text-[10px] sm:text-xs font-bold text-white cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setActiveDimension('ancho')}
                  >
                    <span className="text-[#D1C2A5] text-[8.5px] block font-mono text-center">ANCHO PECHO</span>
                    <span className="block text-center">{activeMeasurements.ancho} cm</span>
                  </div>

                  {/* 3. Cuello Dynamic Pin */}
                  {activeMeasurements.cuello && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-[#3d3426] px-2 py-0.5 rounded-xs shadow-md font-mono text-[9px] sm:text-[10px] text-zinc-300 cursor-pointer hover:text-white"
                      onClick={() => setActiveDimension('cuello')}
                    >
                      <span>CUELLO: </span>
                      <strong className="text-[#D1C2A5]">{activeMeasurements.cuello} cm</strong>
                    </div>
                  )}

                  {/* 4. Manga Dynamic Pin */}
                  {activeMeasurements.manga && (
                    <div
                      className="absolute top-12 left-0 sm:left-1 bg-black/90 backdrop-blur-md border border-[#3d3426] px-2 py-0.5 rounded-xs shadow-md font-mono text-[9px] sm:text-[10px] text-zinc-300 cursor-pointer hover:text-white"
                      onClick={() => setActiveDimension('manga')}
                    >
                      <span>MANGA: </span>
                      <strong className="text-[#D1C2A5]">{activeMeasurements.manga} cm</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Swatch Row & Randomizer Button */}
              <div className="z-10 pt-3 border-t border-[#262017] flex flex-wrap items-center justify-between gap-2.5">
                {activePhotoObj && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      Prenda de muestra:
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#141210] border border-[#332b20] text-zinc-200 text-[10px] font-mono rounded-full">
                      <span className={`w-2.5 h-2.5 rounded-full border border-white/20 ${getColorClass(activePhotoObj.color)}`} />
                      <strong>{activePhotoObj.color}</strong>
                      <span className="text-zinc-500">· {activePhotoObj.fabric}</span>
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRandomizePhoto}
                  className="px-2.5 py-1 bg-[#181512] hover:bg-[#241f1a] text-[#D1C2A5] border border-[#3d3324] text-[10px] font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Cargar otra prenda aleatoria"
                >
                  <Shuffle className="w-3 h-3 text-[#D1C2A5]" />
                  <span>Cambiar prenda de muestra</span>
                </button>
              </div>
            </div>

            {/* RIGHT: NATIVE DATA TABLE & FIT FINDER (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Native Measurements Table */}
              <div className="bg-panel border border-line rounded-xs p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-ink">
                    <Ruler className="w-4 h-4 text-accent" />
                    <span>Cuadro de Medidas (cm)</span>
                  </div>
                  <span className="text-[9px] font-mono uppercase text-muted">
                    Unidad: Centímetros
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-line text-[9.5px] text-muted uppercase">
                        <th className="py-2 px-2.5">Talla</th>
                        {garment.columns.map((col) => (
                          <th key={col.key} className="py-2 px-2 text-center" title={col.tooltip}>
                            {col.label.replace(' (cm)', '')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/60">
                      {garment.sizes.map((s) => {
                        const isSelected = selectedSize === s;
                        const m = garment.measurements[s];
                        return (
                          <tr
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-accent/15 font-bold text-ink border-l-2 border-accent'
                                : 'hover:bg-paper-soft text-muted hover:text-ink'
                            }`}
                          >
                            <td className="py-2.5 px-2.5 font-bold flex items-center gap-1.5">
                              <span>{s}</span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                              )}
                            </td>
                            {garment.columns.map((col) => (
                              <td key={col.key} className="py-2.5 px-2 text-center">
                                {m[col.key] !== undefined ? `${m[col.key]}` : '-'}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-line text-[10px] font-mono text-muted">
                  <span>Toca una fila para previsualizar</span>
                  <span className="text-ink font-semibold">Talla activa: {selectedSize}</span>
                </div>
              </div>

              {/* Smart Fit Finder (Recomendador Inteligente de Talla) */}
              <div className="bg-paper-soft border border-line rounded-xs p-5 space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-line pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="font-mono text-xs font-bold uppercase text-ink">
                      ¿Cuál es mi talla? (Fit Finder)
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-accent font-bold uppercase">
                    Asistente VANTA
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Estatura Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[11px] text-muted">
                      <span>Estatura:</span>
                      <strong className="text-ink">{heightCm} cm</strong>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="195"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full accent-accent cursor-pointer h-1.5 bg-panel rounded-lg"
                    />
                  </div>

                  {/* Peso Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[11px] text-muted">
                      <span>Peso:</span>
                      <strong className="text-ink">{weightKg} kg</strong>
                    </div>
                    <input
                      type="range"
                      min="48"
                      max="110"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full accent-accent cursor-pointer h-1.5 bg-panel rounded-lg"
                    />
                  </div>

                  {/* Fit Preference Buttons */}
                  <div className="space-y-1 pt-1">
                    <span className="block font-mono text-[10px] text-muted uppercase">
                      Preferencia de Calce:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFitPreference('regular')}
                        className={`py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                          fitPreference === 'regular'
                            ? 'bg-ink text-paper border-ink font-bold'
                            : 'bg-panel text-muted border-line hover:text-ink'
                        }`}
                      >
                        Calce Regular
                      </button>
                      <button
                        type="button"
                        onClick={() => setFitPreference('oversize')}
                        className={`py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-xs border transition-all cursor-pointer ${
                          fitPreference === 'oversize'
                            ? 'bg-ink text-paper border-ink font-bold'
                            : 'bg-panel text-muted border-line hover:text-ink'
                        }`}
                      >
                        Boxy Oversize
                      </button>
                    </div>
                  </div>

                  {/* Recommendation Result Card */}
                  <div className="p-3.5 bg-panel border border-accent/40 rounded-xs flex items-center justify-between mt-3 shadow-xs">
                    <div>
                      <span className="text-[8.5px] font-mono uppercase text-muted block">
                        Talla recomendada para ti:
                      </span>
                      <span className="font-mono text-lg font-black text-ink">
                        TALLA {recommendedSize}
                      </span>
                      <span className="text-[10px] text-muted block font-light">
                        {fitPreference === 'oversize'
                          ? 'Silueta holgada con hombro caído y caída boxy.'
                          : 'Ajuste cómodo y equilibrado al torso.'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedSize(recommendedSize)}
                      className="px-3 py-1.5 bg-ink text-paper font-mono text-[10px] uppercase font-bold rounded-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                    >
                      Aplicar {recommendedSize}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── 3. VIEW MODE: POSTER HD VIEW ── */
          <AnimatePresence mode="wait">
            <motion.div
              key={activeGarment}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative group cursor-zoom-in border border-line bg-panel rounded-xs overflow-hidden"
              onClick={() => setZoomed(true)}
            >
              {/* Zoom badge */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center gap-1.5 bg-ink/80 backdrop-blur-sm text-paper px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-widest rounded-xs shadow-md">
                  <ZoomIn className="w-3.5 h-3.5" /> Ampliar lámina completa
                </span>
              </div>

              <img
                src={garment.image}
                alt={`Guía de medidas oficial — ${garment.label}`}
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                style={{ maxHeight: '640px' }}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── 4. BOTTOM NAVIGATION DECK ── */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          <button
            onClick={prev}
            className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior ({GARMENTS[ORDER[(idx - 1 + ORDER.length) % ORDER.length]].shortLabel})
          </button>
          <div className="flex items-center gap-2">
            {ORDER.map((t) => (
              <button
                key={t}
                onClick={() => setActiveGarment(t)}
                className={`transition-all cursor-pointer ${
                  t === activeGarment
                    ? 'w-6 h-1.5 bg-accent rounded-full'
                    : 'w-2 h-1.5 bg-line hover:bg-muted rounded-full'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-muted hover:text-ink transition-colors cursor-pointer"
          >
            Siguiente ({GARMENTS[ORDER[(idx + 1) % ORDER.length]].shortLabel}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
