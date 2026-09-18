import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Share2,
  Volume2,
  VolumeX,
  MessageCircle,
  ExternalLink,
  Grid,
  BookOpen,
  Sparkles,
  Check,
  Copy,
  Eye,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ZoomIn,
  X,
  Smartphone,
  Tag,
  HandMetal
} from 'lucide-react';
import { PRODUCTS } from '../../data';
import productImageManifest from '../../data/productImageManifest.json';

// Helper to play subtle synthesized page-turn sound using Web Audio API
const playFlipSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio not allowed or unsupported; safe to ignore
  }
};

export default function CatalogoInteractivoPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'spread' | 'single' | 'grid'>('spread');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Touch gesture references for mobile swipe navigation
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Selected active colors per garment page (product.id -> selected color name)
  const [activeColors, setActiveColors] = useState<{ [productId: string]: string }>({
    camisa: 'Negro',
    camisero: 'Cemento',
    'manga-larga': 'Vino',
    clasico: 'Denim',
    notch: 'Botella',
    polera: 'Melange Oscuro',
  });

  const totalPages = 10;

  // Handle color change for interactive garment previews
  const handleSelectColor = (productId: string, color: string) => {
    setActiveColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };

  // Cycle garment colors using small arrow navigation
  const handlePrevColor = (productId: string, colors: string[]) => {
    const currentColor = activeColors[productId] || colors[0];
    const currentIndex = colors.indexOf(currentColor);
    const prevIndex = currentIndex <= 0 ? colors.length - 1 : currentIndex - 1;
    handleSelectColor(productId, colors[prevIndex]);
  };

  const handleNextColor = (productId: string, colors: string[]) => {
    const currentColor = activeColors[productId] || colors[0];
    const currentIndex = colors.indexOf(currentColor);
    const nextIndex = currentIndex >= colors.length - 1 ? 0 : currentIndex + 1;
    handleSelectColor(productId, colors[nextIndex]);
  };

  // Helper to get dynamic image for a garment based on its selected color
  const getGarmentImage = (productId: string, fallback: string) => {
    const chosenColor = activeColors[productId];
    const manifest = productImageManifest as Record<string, Record<string, Record<string, string>>>;
    if (manifest[productId]) {
      // Priority check for jersey or waffle
      const fabricKey = Object.keys(manifest[productId])[0];
      if (fabricKey && manifest[productId][fabricKey][chosenColor]) {
        return manifest[productId][fabricKey][chosenColor];
      }
    }
    return fallback;
  };

  // Helper to get thumbnail image for each catalog page in visual index
  const getPageThumbnail = (pageNum: number): string => {
    switch (pageNum) {
      case 1:
        return '/banners/banner-1.png';
      case 2:
        return '/banners/banner-2.png';
      case 3:
        return getGarmentImage('camisa', '/productos/camisa/jersey/blanco.png');
      case 4:
        return getGarmentImage('camisero', '/productos/camisero/jersey/cemento.png');
      case 5:
        return getGarmentImage('manga-larga', '/productos/manga-larga/jersey/vino.png');
      case 6:
        return getGarmentImage('clasico', '/productos/clasico/jersey/denim.png');
      case 7:
        return getGarmentImage('notch', '/productos/notch/jersey/botella.png');
      case 8:
        return getGarmentImage('polera', '/productos/polera/jersey/negro.png');
      case 9:
        return '/banners/banner-3.png';
      case 10:
        return '/banners/banner-4.png';
      default:
        return '/banners/banner-1.png';
    }
  };

  // Page turn navigation
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      if (isSoundEnabled) playFlipSound();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [isSoundEnabled, totalPages]
  );

  const handleNextPage = useCallback(() => {
    if (viewMode === 'spread' && currentPage < totalPages) {
      handlePageChange(Math.min(totalPages, currentPage + (currentPage === 1 ? 1 : 2)));
    } else {
      handlePageChange(Math.min(totalPages, currentPage + 1));
    }
  }, [currentPage, totalPages, viewMode, handlePageChange]);

  const handlePrevPage = useCallback(() => {
    if (viewMode === 'spread') {
      handlePageChange(Math.max(1, currentPage - (currentPage === 2 ? 1 : 2)));
    } else {
      handlePageChange(Math.max(1, currentPage - 1));
    }
  }, [currentPage, viewMode, handlePageChange]);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (zoomImage) {
        if (e.key === 'Escape') setZoomImage(null);
        return;
      }
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'ArrowLeft') handlePrevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextPage, handlePrevPage, zoomImage]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Share catalog link
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedToast('¡Enlace del Catálogo copiado al portapapeles!');
      setTimeout(() => setCopiedToast(null), 3500);
    }
  };

  // Build WhatsApp inquiry link
  const openWhatsAppInquiry = (productName?: string, colorName?: string, price?: number, promoText?: string) => {
    let msg = `Hola VANTA, vengo del *Catálogo Interactivo 2026*.\n`;
    if (productName) {
      msg += `Me interesa pedir la siguiente prenda:\n`;
      msg += `👕 *Prenda:* ${productName}\n`;
      if (colorName) msg += `🎨 *Color:* ${colorName}\n`;
      if (promoText) {
        msg += `🔥 *Promoción:* ${promoText}\n`;
      } else if (price) {
        msg += `💰 *Precio Catálogo:* S/ ${price.toFixed(2)}\n`;
      }
      msg += `¿Tienen stock disponible para entrega inmediata?`;
    } else {
      msg += `Deseo recibir asesoría y consultar disponibilidad de las promociones de la colección actual.`;
    }
    const waUrl = `https://api.whatsapp.com/send?phone=51904536406&text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  // Touch Swipe Navigation for Mobile Devices (Smartphones)
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only detect single finger gestures to allow pinch zoom if needed
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

      // Check if horizontal movement is dominant and exceeds minimum threshold (45px)
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        if (deltaX < 0) {
          // Swiped left -> Next page
          handleNextPage();
        } else {
          // Swiped right -> Previous page
          handlePrevPage();
        }
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Garment mapping for pages 3 to 8
  const productMap: { [page: number]: typeof PRODUCTS[0] } = useMemo(
    () => ({
      3: PRODUCTS[0], // Camisa Box Fit
      4: PRODUCTS[1], // Camisero Urbano
      5: PRODUCTS[2], // Manga Larga 90s
      6: PRODUCTS[3], // Clásico Box Tee
      7: PRODUCTS[4], // Cuello Notch
      8: PRODUCTS[5], // Polera Zyko
    }),
    []
  );

  // Pages titles map for quick navigation
  const pageTitles = [
    { num: 1, title: 'Portada VANTA 2026', tag: 'Campaña' },
    { num: 2, title: 'Manifiesto & Filosofía', tag: 'Editorial' },
    { num: 3, title: 'Camisa Boxy Fit', tag: 'Colección' },
    { num: 4, title: 'Camisero Urbano', tag: 'Colección' },
    { num: 5, title: 'Polo Manga Larga 90s', tag: 'Colección' },
    { num: 6, title: 'Polo Clásico Heavy Tee', tag: 'Colección' },
    { num: 7, title: 'Cuello Notch Minimal', tag: 'Colección' },
    { num: 8, title: 'Hoodie Polera Zyko 420 GSM', tag: 'Colección' },
    { num: 9, title: 'Guía de Tallas & Medidas', tag: 'Tallas' },
    { num: 10, title: 'Carta de Telas & Medios de Pago', tag: 'Envíos y Pagos' },
  ];

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col selection:bg-rose-600 selection:text-white font-sans antialiased">
      {/* ── TOP FLOATING CONTROL BAR (EDITORIAL HEADER) ── */}
      <header className="sticky top-0 z-50 bg-[#0c0d14]/95 backdrop-blur-md border-b border-zinc-800/80 px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-1 sm:gap-3 select-none">
        {/* Brand: Pure Panther Logo Icon + VANTA */}
        <a
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 shrink-0 hover:opacity-85 transition-opacity cursor-pointer"
          title="Ir a la tienda VANTA"
        >
          <img
            src="/vanta-panther-white.png"
            alt="VANTA"
            className="h-7 sm:h-8 w-auto object-contain drop-shadow-sm shrink-0"
          />
          <span className="font-display font-black tracking-[0.2em] text-white text-xs sm:text-sm">
            VANTA
          </span>
          <span className="hidden lg:inline-block ml-1 text-[9px] font-mono tracking-widest text-zinc-400 uppercase bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
            LOOKBOOK
          </span>
        </a>

        {/* Center: Page Switcher & Small Arrows */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 active:bg-zinc-800 disabled:opacity-20 transition-colors cursor-pointer"
            title="Página Anterior (←)"
            aria-label="Página Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Quick Page Jump Selector */}
          <div className="relative flex items-center">
            <select
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-[10.5px] sm:text-xs font-mono py-1 pl-1.5 pr-4 sm:pl-2.5 sm:pr-6 rounded focus:outline-none focus:border-rose-500 cursor-pointer appearance-none max-w-[70px] xs:max-w-[88px] sm:max-w-[170px] md:max-w-none truncate"
            >
              {pageTitles.map((p) => (
                <option key={p.num} value={p.num}>
                  {p.num < 10 ? `0${p.num}` : p.num}/{totalPages} {p.title}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-1 sm:right-1.5 text-zinc-500 text-[8px] sm:text-[9px]">▼</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 active:bg-zinc-800 disabled:opacity-20 transition-colors cursor-pointer"
            title="Página Siguiente (→)"
            aria-label="Página Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Tools: View Mode Toggle (ALL devices), Audio, WhatsApp, Share */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* View Mode Toggle — now visible on ALL screen sizes */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded p-0.5">
            <button
              onClick={() => setViewMode('spread')}
              className={`p-1 sm:px-2 sm:py-1 text-[11px] font-mono rounded transition-colors flex items-center gap-1 ${
                viewMode === 'spread' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Vista Revista (Doble Página)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Revista</span>
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`p-1 sm:px-2 sm:py-1 text-[11px] font-mono rounded transition-colors flex items-center gap-1 ${
                viewMode === 'single' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Página Individual"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Página</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 sm:px-2 sm:py-1 text-[11px] font-mono rounded transition-colors flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Índice Visual (Todas las Páginas)"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Índice</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title={isSoundEnabled ? 'Silenciar sonido de página' : 'Activar sonido de página'}
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Compartir catálogo"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:block p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Pantalla Completa"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Order via WhatsApp Direct CTA */}
          <button
            onClick={() => openWhatsAppInquiry()}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold p-1.5 sm:px-2.5 sm:py-1.5 rounded transition-all shadow-sm cursor-pointer shrink-0"
            title="Pedir por WhatsApp al 904536406"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">WhatsApp</span>
          </button>

          {/* Store Switcher */}
          <a
            href="/"
            className="hidden xl:flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-rose-400 transition-colors px-2 py-1 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
          >
            <span>Tienda</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Toast notification */}
      {copiedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          {copiedToast}
        </div>
      )}

      {/* ── MAIN STAGE WITH TOUCH SWIPE ── */}
      <main
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex-1 flex flex-col items-center justify-center p-2 xs:p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full touch-pan-y"
      >
        {/* GRID VIEW (OVERVIEW OF ALL PAGES) */}
        {viewMode === 'grid' ? (
          <div className="w-full space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h2 className="text-xl font-display font-black tracking-wider text-white uppercase">
                  Índice Visual del Catálogo
                </h2>
                <p className="text-xs font-mono text-zinc-400">
                  Selecciona cualquier página para abrirla en modo lectura
                </p>
              </div>
              <button
                onClick={() => setViewMode('spread')}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" /> Volver a Modo Revista
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {pageTitles.map((p) => (
                <div
                  key={p.num}
                  onClick={() => {
                    setCurrentPage(p.num);
                    setViewMode('spread');
                  }}
                  className={`group relative bg-zinc-900 rounded-xl overflow-hidden border transition-all cursor-pointer hover:scale-[1.02] shadow-lg ${
                    currentPage === p.num ? 'border-rose-500 ring-2 ring-rose-500/40' : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <div className="aspect-[3/4] bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
                    <img
                      src={getPageThumbnail(p.num)}
                      alt={p.title}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                    {/* Page badge at top-left */}
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white border border-white/10 shadow">
                      {p.num < 10 ? `0${p.num}` : p.num}
                    </div>

                    {/* Active indicator */}
                    {currentPage === p.num && (
                      <div className="absolute top-2 right-2 bg-rose-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                        ACTUAL
                      </div>
                    )}

                    {/* Bottom info */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                        {p.tag}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-tight truncate">
                        {p.title}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* MAGAZINE / BOOK VIEW */
          <div className="w-full flex flex-col items-center">
            {/* The Book Stage Container with Side Floating Small Arrows */}
            <div className="relative w-full max-w-6xl">
              {/* Floating Left Small Arrow (Previous Page) */}
              {currentPage > 1 && (
                <button
                  onClick={handlePrevPage}
                  className="hidden sm:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-zinc-900/90 hover:bg-rose-600 text-zinc-300 hover:text-white border border-zinc-700/80 hover:border-rose-500 shadow-2xl items-center justify-center transition-all cursor-pointer group hover:scale-110"
                  title="Página Anterior (←)"
                  aria-label="Página Anterior"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Floating Right Small Arrow (Next Page) */}
              {currentPage < totalPages && (
                <button
                  onClick={handleNextPage}
                  className="hidden sm:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-zinc-900/90 hover:bg-rose-600 text-zinc-300 hover:text-white border border-zinc-700/80 hover:border-rose-500 shadow-2xl items-center justify-center transition-all cursor-pointer group hover:scale-110"
                  title="Página Siguiente (→)"
                  aria-label="Página Siguiente"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* The Book Stage */}
              <div className="w-full shadow-2xl rounded-xl overflow-hidden border border-zinc-800/80 bg-[#11131c]">
              {/* If spread mode on desktop: Show 2 pages side-by-side (unless page 1 cover) */}
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[620px] md:min-h-[700px]">
                {/* ── SPREAD LOGIC ── */}
                {currentPage === 1 ? (
                  /* COVER SPREAD (Full page presentation) */
                  <div className="col-span-1 md:col-span-2 relative flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-[#0c0d14] via-[#121422] to-[#1a1727]">
                    <div className="flex-1 p-5 xs:p-7 sm:p-10 md:p-14 flex flex-col justify-between z-10">
                      <div>
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-rose-400 font-bold">
                            Catálogo Oficial · Primavera / Otoño 2026
                          </span>
                        </div>

                        <h1 className="text-3xl xs:text-5xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-white uppercase leading-[0.95] mb-3 sm:mb-4">
                          VANTA<br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-zinc-200 to-white">
                            STUDIO
                          </span>
                        </h1>

                        <p className="text-xs sm:text-base text-zinc-300 font-light max-w-md leading-relaxed mt-2 sm:mt-4">
                          Siluetas pesadas, caídas estructuradas y patrones boxy confeccionados artesanalmente en Lima con Algodón Peruano de alta densidad.
                        </p>

                        <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3">
                          <button
                            onClick={handleNextPage}
                            className="bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-mono text-xs uppercase tracking-wider pl-5 pr-3 py-3 sm:py-2.5 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 transition-all cursor-pointer group"
                          >
                            <span>Explorar Colección</span>
                            <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </button>
                          <button
                            onClick={() => openWhatsAppInquiry()}
                            className="text-zinc-300 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer px-4 py-3 sm:py-2 rounded-full hover:bg-zinc-800/60 active:bg-zinc-800 border border-zinc-800"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Contacto Asesor (904 536 406)</span>
                            <ChevronRight className="w-3 h-3 text-zinc-500" />
                          </button>
                        </div>

                        {/* Mobile Swipe Hint */}
                        <div className="sm:hidden text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 mt-4 pt-3 border-t border-zinc-800/60">
                          <HandMetal className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Desliza con el dedo (swipe ‹ ›) para hojear el catálogo</span>
                        </div>
                      </div>

                      {/* Cover Footer Specs */}
                      <div className="pt-6 sm:pt-8 mt-6 sm:mt-0 border-t border-zinc-800/80 grid grid-cols-3 gap-2 sm:gap-4 text-left font-mono">
                        <div>
                          <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase">Tejidos</div>
                          <div className="text-[11px] sm:text-xs font-bold text-zinc-200">24/1 & 20/1</div>
                        </div>
                        <div>
                          <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase">Envíos</div>
                          <div className="text-[11px] sm:text-xs font-bold text-zinc-200">Nacional 24h</div>
                        </div>
                        <div>
                          <div className="text-[9px] sm:text-[10px] text-zinc-500 uppercase">Origen</div>
                          <div className="text-[11px] sm:text-xs font-bold text-zinc-200">Lima, Perú</div>
                        </div>
                      </div>
                    </div>

                    {/* Cover Editorial Image */}
                    <div className="flex-1 relative min-h-[260px] max-h-[380px] md:max-h-none md:min-h-full">
                      <img
                        src="/banners/banner-1.png"
                        alt="VANTA Editorial Cover"
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c0d14] via-transparent to-transparent" />
                      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-zinc-300 border border-white/10">
                        LOOKBOOK VOL. IV
                      </div>
                    </div>
                  </div>
                ) : currentPage === 2 ? (
                  /* MANIFESTO & TABLE OF CONTENTS */
                  <>
                    {/* Left Page: Manifesto */}
                    <div className="p-5 xs:p-7 sm:p-10 md:p-12 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between bg-[#0e1019]">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-500 font-bold block mb-2">
                          02 / EDITORIAL
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider mb-4 sm:mb-6">
                          Manifiesto de Construcción
                        </h2>

                        <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                          <p>
                            En <b className="text-white font-semibold">VANTA</b> concebimos la indumentaria básica no como un complemento, sino como la base estructural del porte contemporáneo.
                          </p>
                          <p>
                            Nuestras prendas son confeccionadas con hilatura peinada de fibra larga, garantizando una textura densa que no se deforma, un peso táctil de alta presencia y cuellos con alma interna indeformable.
                          </p>
                          <blockquote className="border-l-2 border-rose-500 pl-4 py-1 text-zinc-200 italic font-serif">
                            «El volumen y la proporción dictan la presencia. Siluetas relajadas sin perder la disciplina del corte.»
                          </blockquote>
                        </div>

                        <div className="mt-6 sm:mt-8 grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3 font-mono text-xs">
                          <div className="p-3 rounded bg-zinc-900/80 border border-zinc-800">
                            <span className="text-rose-400 font-bold block">100% ALGODÓN</span>
                            <span className="text-[11px] text-zinc-400">Tejido reactivo que mantiene el color tras decenas de lavadas.</span>
                          </div>
                          <div className="p-3 rounded bg-zinc-900/80 border border-zinc-800">
                            <span className="text-teal-400 font-bold block">BOXY PATTERN</span>
                            <span className="text-[11px] text-zinc-400">Hombros sutilmente caídos y longitud recortada al cinturón.</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500 flex justify-between">
                        <span>VANTA STUDIO ARCHIVE</span>
                        <span>PÁGINA 02</span>
                      </div>
                    </div>

                    {/* Right Page: Table of Contents & Banners */}
                    <div className="p-5 xs:p-7 sm:p-10 md:p-12 flex flex-col justify-between bg-[#111422]">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-bold block mb-2">
                          03 / ÍNDICE DE PRENDAS
                        </span>
                        <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wider mb-4 sm:mb-6">
                          Directorio de Colección
                        </h3>

                        <div className="space-y-2 sm:space-y-2.5">
                          {pageTitles.slice(2, 8).map((item) => (
                            <button
                              key={item.num}
                              onClick={() => handlePageChange(item.num)}
                              className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded bg-zinc-900/60 hover:bg-zinc-800 active:bg-zinc-800 border border-zinc-800/70 hover:border-rose-500/50 transition-all text-left cursor-pointer group"
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-xs font-bold text-rose-400 group-hover:text-rose-300">
                                  0{item.num}
                                </span>
                                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white uppercase">
                                  {item.title}
                                </span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        <span className="text-xs text-rose-400 font-mono font-bold">
                          🔥 Promociones activas desde S/ 35
                        </span>
                        <button
                          onClick={() => handlePageChange(3)}
                          className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 font-mono uppercase tracking-wider cursor-pointer group shrink-0"
                        >
                          <span>Comenzar Lookbook</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : currentPage >= 3 && currentPage <= 8 ? (
                  /* PRODUCT SPREADS (PAGES 3 TO 8) */
                  (() => {
                    const product = productMap[currentPage] || PRODUCTS[0];
                    const activeColor = activeColors[product.id] || product.colors[0];
                    const currentImg = getGarmentImage(product.id, product.images[0]);

                    return (
                      <>
                        {/* Left Page: Big Visual & Color Selector */}
                        <div className="p-4 xs:p-5 sm:p-6 md:p-10 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between bg-[#0e1019] relative">
                          {/* Image Container with Zoom trigger & Small Arrows to switch colors */}
                          <div className="relative aspect-[4/5] max-h-[360px] sm:max-h-none w-full mx-auto rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800/80 group touch-manipulation">
                            <img
                              src={currentImg}
                              alt={`${product.name} - ${activeColor}`}
                              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Small Left Arrow on Photo (Comfortable touch target) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrevColor(product.id, product.colors);
                              }}
                              className="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-black/75 active:bg-rose-600 sm:hover:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs border border-white/20 hover:scale-110 shadow-lg active:scale-95"
                              title="Color anterior (←)"
                              aria-label="Color anterior"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Small Right Arrow on Photo (Comfortable touch target) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNextColor(product.id, product.colors);
                              }}
                              className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-black/75 active:bg-rose-600 sm:hover:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs border border-white/20 hover:scale-110 shadow-lg active:scale-95"
                              title="Siguiente color (→)"
                              aria-label="Siguiente color"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>

                            {/* Zoom button badge */}
                            <button
                              onClick={() => setZoomImage(currentImg)}
                              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 bg-black/60 hover:bg-black/90 backdrop-blur-md p-2 rounded-full text-white transition-colors cursor-pointer"
                              title="Inspeccionar en detalle (Zoom)"
                            >
                              <ZoomIn className="w-4 h-4" />
                            </button>

                            {/* Color Tag Overlay */}
                            <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 z-10 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 flex items-center gap-1.5 sm:gap-2">
                              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                              <span className="text-[11px] sm:text-xs font-mono text-white font-bold truncate max-w-[150px]">
                                Color: {activeColor}
                              </span>
                            </div>

                            {/* Promo Badge */}
                            {product.promoBadge && (
                              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 bg-rose-600 text-white font-mono font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded shadow-lg">
                                {product.promoBadge}
                              </div>
                            )}
                          </div>

                          {/* Color Switcher Bar with Small Arrow Navigation */}
                          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-zinc-800">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 truncate">
                                <span>Variantes ({product.colors.indexOf(activeColor) + 1}/{product.colors.length}):</span>
                                <b className="text-white truncate">{activeColor}</b>
                              </span>

                              {/* Pequeñas flechas para cambiar color */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handlePrevColor(product.id, product.colors)}
                                  className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-zinc-800 hover:bg-rose-600 active:bg-rose-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-zinc-700/60"
                                  title="Color anterior"
                                  aria-label="Color anterior"
                                >
                                  <ChevronLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleNextColor(product.id, product.colors)}
                                  className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-zinc-800 hover:bg-rose-600 active:bg-rose-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-zinc-700/60"
                                  title="Siguiente color"
                                  aria-label="Siguiente color"
                                >
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Responsive Horizontal Scroll Swatches */}
                            <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 overflow-x-auto sm:max-h-20 sm:overflow-y-auto no-scrollbar py-1 touch-pan-x">
                              {product.colors.map((col) => {
                                const isSelected = activeColor.toLowerCase() === col.toLowerCase();
                                return (
                                  <button
                                    key={col}
                                    onClick={() => handleSelectColor(product.id, col)}
                                    className={`shrink-0 px-2.5 py-1 text-[11px] sm:text-[10px] font-mono rounded-full sm:rounded transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-rose-600 text-white font-bold shadow-md ring-1 ring-white/50'
                                        : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 active:bg-zinc-700 hover:text-white border border-zinc-700/50'
                                    }`}
                                  >
                                    {col}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Right Page: Garment Specs, Sizing & Direct WhatsApp Inquiry */}
                        <div className="p-5 xs:p-6 sm:p-6 md:p-10 flex flex-col justify-between bg-[#111422]">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose-400 font-bold">
                                COLECCIÓN VANTA · PÁG 0{currentPage}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                                Stock Inmediato
                              </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight">
                              {product.name}
                            </h2>

                            {/* Price & Savings */}
                            <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                              <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                                S/ {product.price.toFixed(2)}
                              </span>
                              {product.oldPrice && (
                                <span className="text-sm font-mono text-zinc-500 line-through">
                                  S/ {product.oldPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                {product.promoDetail}
                              </span>
                            </div>

                            {/* Promo Tiers Action Cards */}
                            {product.promoTiers && product.promoTiers.length > 0 && (
                              <div className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-rose-950/20 via-zinc-900/60 to-amber-950/20 border border-rose-500/30">
                                <div className="text-[10.5px] font-mono text-rose-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                                    <span>Packs en Promoción (Toca para pedir):</span>
                                  </span>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {product.promoTiers.map((tier) => (
                                    <button
                                      key={tier.label}
                                      onClick={() => openWhatsAppInquiry(product.name, activeColor, tier.price, tier.label)}
                                      className="p-2 rounded-lg bg-black/50 hover:bg-rose-600 active:bg-rose-700 border border-zinc-700/80 hover:border-rose-400 text-center transition-all cursor-pointer group/tier"
                                      title={`Pedir ${tier.label} al WhatsApp`}
                                    >
                                      <div className="text-[10px] font-mono text-zinc-300 group-hover/tier:text-white font-bold leading-tight truncate">
                                        {tier.quantity} {product.category === 'Camisa' ? 'camisas' : product.category === 'Polera' ? 'poleras' : 'polos'}
                                      </div>
                                      <div className="text-sm font-mono font-black text-white my-0.5">
                                        S/ {tier.price}
                                      </div>
                                      <div className="text-[9px] font-mono text-emerald-400 group-hover/tier:text-zinc-100 font-semibold truncate">
                                        S/ {tier.unitPrice.toFixed(2)} c/u
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Description */}
                            <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mt-3 sm:mt-4">
                              {product.description}
                            </p>

                            {/* Technical Specs List */}
                            <div className="mt-5 sm:mt-6 space-y-2 sm:space-y-2.5 font-mono text-xs">
                              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                                <span className="text-zinc-400">Tejidos Disponibles:</span>
                                <span className="font-semibold text-zinc-200 text-right">{product.fabrics.join(' · ')}</span>
                              </div>
                              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                                <span className="text-zinc-400">Tallas Confeccionadas:</span>
                                <span className="font-bold text-rose-400">S · M · L · XL</span>
                              </div>
                              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                                <span className="text-zinc-400">Fit & Calce:</span>
                                <span className="font-semibold text-zinc-200">Boxy Fit Streetwear</span>
                              </div>
                              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                                <span className="text-zinc-400">Gramaje Estimado:</span>
                                <span className="font-semibold text-zinc-200">240 - 280 GSM</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions: Direct WhatsApp Order */}
                          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-800/80 space-y-3">
                            <button
                              onClick={() => openWhatsAppInquiry(product.name, activeColor, product.price)}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/40 transition-all cursor-pointer"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Pedir {product.name} ({activeColor}) al 904 536 406</span>
                            </button>

                            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-rose-400" /> Lima 24h & Nacional
                              </span>
                              <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Garantía VANTA
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()
                ) : currentPage === 9 ? (
                  /* PAGE 9: SIZING GUIDE & REAL MEASUREMENTS */
                  <>
                    <div className="p-5 xs:p-7 sm:p-10 md:p-12 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between bg-[#0e1019]">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-400 font-bold block mb-2">
                          09 / ESPECIFICACIONES
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight mb-3 sm:mb-4">
                          Guía de Tallas & Medidas Reales
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed mb-4 sm:mb-6">
                          Nuestros cortes son <b className="text-white">Boxy Fit</b> (hombros caídos con caída recta y cómoda). Si buscas un look oversize marcado, mantén tu talla regular.
                        </p>

                        {/* Sizing Table with mobile horizontal scroll */}
                        <div className="overflow-x-auto -mx-1 sm:mx-0">
                          <table className="w-full text-left font-mono text-xs border border-zinc-800 min-w-[280px]">
                            <thead className="bg-zinc-900 text-zinc-400 text-[10px] uppercase">
                              <tr>
                                <th className="p-2 sm:p-2.5 border-b border-zinc-800">Talla</th>
                                <th className="p-2 sm:p-2.5 border-b border-zinc-800">Ancho Pecho</th>
                                <th className="p-2 sm:p-2.5 border-b border-zinc-800">Largo Total</th>
                                <th className="p-2 sm:p-2.5 border-b border-zinc-800">Manga</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                              <tr className="hover:bg-zinc-900/40">
                                <td className="p-2 sm:p-2.5 font-bold text-rose-400">S (Small)</td>
                                <td className="p-2 sm:p-2.5">54 cm</td>
                                <td className="p-2 sm:p-2.5">70 cm</td>
                                <td className="p-2 sm:p-2.5">22 cm</td>
                              </tr>
                              <tr className="hover:bg-zinc-900/40">
                                <td className="p-2 sm:p-2.5 font-bold text-rose-400">M (Medium)</td>
                                <td className="p-2 sm:p-2.5">57 cm</td>
                                <td className="p-2 sm:p-2.5">73 cm</td>
                                <td className="p-2 sm:p-2.5">23 cm</td>
                              </tr>
                              <tr className="hover:bg-zinc-900/40">
                                <td className="p-2 sm:p-2.5 font-bold text-rose-400">L (Large)</td>
                                <td className="p-2 sm:p-2.5">60 cm</td>
                                <td className="p-2 sm:p-2.5">75 cm</td>
                                <td className="p-2 sm:p-2.5">24 cm</td>
                              </tr>
                              <tr className="hover:bg-zinc-900/40">
                                <td className="p-2 sm:p-2.5 font-bold text-rose-400">XL (Extra Large)</td>
                                <td className="p-2 sm:p-2.5">63 cm</td>
                                <td className="p-2 sm:p-2.5">77 cm</td>
                                <td className="p-2 sm:p-2.5">25 cm</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                          <span className="font-bold text-zinc-200 block">💡 Consejo de Calce:</span>
                          <p>
                            Mide una prenda tuya extendida sobre una mesa plana y compara el ancho de axila a axila con nuestra tabla para asegurar el calce ideal.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 sm:pt-6 mt-4 sm:mt-0 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
                        VANTA SIZE SYSTEM · MEDIDAS EN CENTÍMETROS
                      </div>
                    </div>

                    {/* Right Page: Recommendation by Height & Weight */}
                    <div className="p-5 xs:p-7 sm:p-10 md:p-12 flex flex-col justify-between bg-[#111422]">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400 font-bold block mb-2">
                          CALCULADOR DE TALLA
                        </span>
                        <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wider mb-4 sm:mb-6">
                          Recomendación por Estatura
                        </h3>

                        <div className="space-y-2.5 sm:space-y-3 font-mono text-xs">
                          <div className="p-3 sm:p-3.5 rounded bg-zinc-900/80 border border-zinc-800 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5">
                            <div>
                              <div className="font-bold text-white">1.60m a 1.70m · 55 a 68 kg</div>
                              <div className="text-[11px] text-zinc-400">Calce relajado con caída moderna</div>
                            </div>
                            <span className="text-xs sm:text-sm font-black text-rose-400 px-2.5 sm:px-3 py-1 bg-rose-500/10 rounded border border-rose-500/30 shrink-0 self-start xs:self-center">
                              TALLA S
                            </span>
                          </div>

                          <div className="p-3 sm:p-3.5 rounded bg-zinc-900/80 border border-zinc-800 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5">
                            <div>
                              <div className="font-bold text-white">1.70m a 1.78m · 68 a 78 kg</div>
                              <div className="text-[11px] text-zinc-400">El estándar boxy fit balanceado</div>
                            </div>
                            <span className="text-xs sm:text-sm font-black text-rose-400 px-2.5 sm:px-3 py-1 bg-rose-500/10 rounded border border-rose-500/30 shrink-0 self-start xs:self-center">
                              TALLA M
                            </span>
                          </div>

                          <div className="p-3 sm:p-3.5 rounded bg-zinc-900/80 border border-zinc-800 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5">
                            <div>
                              <div className="font-bold text-white">1.78m a 1.86m · 78 a 88 kg</div>
                              <div className="text-[11px] text-zinc-400">Silueta streetwear amplia</div>
                            </div>
                            <span className="text-xs sm:text-sm font-black text-rose-400 px-2.5 sm:px-3 py-1 bg-rose-500/10 rounded border border-rose-500/30 shrink-0 self-start xs:self-center">
                              TALLA L
                            </span>
                          </div>

                          <div className="p-3 sm:p-3.5 rounded bg-zinc-900/80 border border-zinc-800 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5">
                            <div>
                              <div className="font-bold text-white">1.85m a 1.95m · 88 a 100+ kg</div>
                              <div className="text-[11px] text-zinc-400">Máximo confort y volumen</div>
                            </div>
                            <span className="text-xs sm:text-sm font-black text-rose-400 px-2.5 sm:px-3 py-1 bg-rose-500/10 rounded border border-rose-500/30 shrink-0 self-start xs:self-center">
                              TALLA XL
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 sm:pt-6 mt-4 sm:mt-0 border-t border-zinc-800/80">
                        <button
                          onClick={() => openWhatsAppInquiry(undefined, undefined, undefined)}
                          className="w-full bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-700 text-white font-bold text-xs uppercase py-3 rounded flex items-center justify-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-400" />
                          <span>¿Dudas con tu talla? Pregúntale a un asesor</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* PAGE 10: FABRIC GUIDE, OFFICIAL PAYMENTS & SHIPPING */
                  <>
                    <div className="p-5 xs:p-7 sm:p-10 md:p-12 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between bg-[#0e1019]">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-400 font-bold block mb-2">
                          10 / TEXTILES & CALIDAD
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight mb-3 sm:mb-4">
                          Carta de Telas VANTA
                        </h2>

                        <div className="space-y-2.5 sm:space-y-3 font-mono text-xs">
                          <div className="p-2.5 sm:p-3 rounded bg-zinc-900 border border-zinc-800">
                            <span className="font-bold text-white block">WAFFLE TEXTURED</span>
                            <span className="text-[11px] text-zinc-400">
                              Estructura alveolar tridimensional de alta transpirabilidad y tacto premium.
                            </span>
                          </div>
                          <div className="p-2.5 sm:p-3 rounded bg-zinc-900 border border-zinc-800">
                            <span className="font-bold text-white block">JERSEY HEAVYWEIGHT 24/1</span>
                            <span className="text-[11px] text-zinc-400">
                              100% Algodón peinado de superficie lisa, ultra suave y caída recta.
                            </span>
                          </div>
                          <div className="p-2.5 sm:p-3 rounded bg-zinc-900 border border-zinc-800">
                            <span className="font-bold text-white block">PIQUÉ ESTRUCTURADO</span>
                            <span className="text-[11px] text-zinc-400">
                              Tejido de punto micro-gofrado con mayor densidad, ideal para camisas y cuellos polo.
                            </span>
                          </div>
                          <div className="p-2.5 sm:p-3 rounded bg-zinc-900 border border-zinc-800">
                            <span className="font-bold text-white block">ZYKO FLEECE 420 GSM</span>
                            <span className="text-[11px] text-zinc-400">
                              Felpa de alto gramaje para poleras y hoodies. Máxima calidez sin deformación.
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 sm:pt-6 mt-4 sm:mt-0 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500">
                        GARANTÍA DE FABRICACIÓN 100% PERUANA
                      </div>
                    </div>

                    {/* Right Page: Payments & Ordering CTA */}
                    <div className="p-5 xs:p-7 sm:p-10 md:p-12 flex flex-col justify-between bg-[#111422]">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-2">
                          CHECKOUT DIRECTO
                        </span>
                        <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wider mb-3 sm:mb-4">
                          Medios de Pago Oficiales
                        </h3>

                        <div className="p-3 sm:p-4 rounded bg-zinc-900/90 border border-zinc-800 space-y-2.5 sm:space-y-3 mb-4 sm:mb-6">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-bold text-xs text-white uppercase tracking-wider">
                              AGORA PAY & OH! PAY
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 font-light">
                            Aceptamos pagos directos y transferencias interbancarias (CCI) desde cualquier entidad financiera (Yape, Plin, BCP, BBVA, Interbank, Scotiabank).
                          </p>
                        </div>

                        <div className="space-y-2 text-xs font-mono text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>Lima: Envíos express en 24 a 48 horas hábiles</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>Provincias: Agencias Olva Courier y Shalom Diario</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                            <span>Cambios inmediatos por talla dentro de los 7 días</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 sm:pt-6 mt-4 sm:mt-0 border-t border-zinc-800/80 space-y-2.5 sm:space-y-3">
                        <button
                          onClick={() => openWhatsAppInquiry(undefined, undefined, undefined)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 sm:py-4 px-4 rounded flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/40 transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>Hacer Pedido al WhatsApp: 904 536 406</span>
                        </button>

                        <a
                          href="/"
                          className="w-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-mono py-2.5 rounded flex items-center justify-center gap-2 transition-colors border border-zinc-700"
                        >
                          <span>Explorar Carrito & Tienda Online Completa</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            </div>

            {/* ── BOTTOM NAVIGATION STRIP (PEQUEÑAS FLECHAS) ── */}
            <div className="w-full max-w-6xl mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-2 border-t border-zinc-800/80 pb-20 sm:pb-2">
              {/* Pequeñas flechas de navegación */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-rose-600 active:bg-rose-600 disabled:opacity-20 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-800 hover:border-rose-500 cursor-pointer transition-all disabled:hover:bg-zinc-900 shadow-sm"
                  title="Página Anterior (←)"
                  aria-label="Página Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="font-mono text-xs text-zinc-400 select-none flex items-center gap-1.5">
                  <span className="font-bold text-white text-sm">
                    {currentPage < 10 ? `0${currentPage}` : currentPage}
                  </span>
                  <span className="text-zinc-600">/</span>
                  <span>{totalPages < 10 ? `0${totalPages}` : totalPages}</span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-rose-600 active:bg-rose-600 disabled:opacity-20 text-zinc-300 hover:text-white flex items-center justify-center border border-zinc-800 hover:border-rose-500 cursor-pointer transition-all disabled:hover:bg-zinc-900 shadow-sm"
                  title="Página Siguiente (→)"
                  aria-label="Página Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Indicadores lineales de página (sin botones toscos) */}
              <div className="flex items-center gap-1.5">
                {pageTitles.map((p) => (
                  <button
                    key={p.num}
                    onClick={() => handlePageChange(p.num)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentPage === p.num
                        ? 'w-7 bg-rose-600 shadow-sm shadow-rose-900/50'
                        : 'w-2 bg-zinc-800 hover:bg-zinc-600'
                    }`}
                    title={p.title}
                    aria-label={`Ir a página ${p.num}`}
                  />
                ))}
              </div>

              {/* WhatsApp Quick Link */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openWhatsAppInquiry()}
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Pedidos al WhatsApp: 904 536 406</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MOBILE FLOATING STICKY ACTION BAR (Pages 3 to 8) ── */}
        {currentPage >= 3 && currentPage <= 8 && productMap[currentPage] && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d14]/95 backdrop-blur-md border-t border-zinc-800 p-2.5 px-3 flex items-center gap-2 sm:hidden shadow-2xl">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 active:bg-zinc-800 flex items-center justify-center shrink-0 disabled:opacity-25 cursor-pointer shadow"
              title="Página Anterior (←)"
              aria-label="Página Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Fast WhatsApp CTA */}
            <button
              onClick={() => {
                const prod = productMap[currentPage];
                const col = activeColors[prod.id] || prod.colors[0];
                openWhatsAppInquiry(prod.name, col, prod.price);
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 truncate cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">
                Pedir {productMap[currentPage].name} ({activeColors[productMap[currentPage].id] || productMap[currentPage].colors[0]}) · S/ {productMap[currentPage].price.toFixed(2)}
              </span>
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 active:bg-zinc-800 flex items-center justify-center shrink-0 disabled:opacity-25 cursor-pointer shadow"
              title="Página Siguiente (→)"
              aria-label="Página Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>

      {/* ── LIGHTBOX MODAL FOR ULTRA-HD ZOOM ── */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              onClick={() => openWhatsAppInquiry()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Consultar esta foto en WhatsApp
            </button>
            <button
              onClick={() => setZoomImage(null)}
              className="p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-4xl max-h-[85vh] overflow-auto flex items-center justify-center">
            <img
              src={zoomImage}
              alt="Detalle prenda VANTA"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
            />
          </div>
          <p className="text-zinc-400 font-mono text-xs mt-3">
            Presiona ESC o la X superior para cerrar la vista en detalle
          </p>
        </div>
      )}
    </div>
  );
}
