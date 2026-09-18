export interface BannerItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  tag: string;
  ctaText?: string;
  ctaAction?: string;
  accent?: string;
  category?: string;
}

// All 11 official high-resolution banners from banner-image
export const ALL_BANNERS: BannerItem[] = [
  {
    id: 'banner-1',
    image: '/banners/banner-1.png',
    title: 'TU ESTILO. TU ESENCIA.',
    subtitle: 'Streetwear de alto gramaje, siluetas boxy contemporáneas y algodón 100% peruano.',
    tag: 'DROP EXCLUSIVO 2026',
    ctaText: 'Ver Colección',
    category: 'hero',
    accent: '#e11d48',
  },
  {
    id: 'banner-2',
    image: '/banners/banner-2.png',
    title: 'ARQUITECTURA DE SILUETAS',
    subtitle: 'Cortes estructurados para layering urbano en tejidos Waffle, Piqué y Jersey.',
    tag: 'EDICIÓN ATELIER',
    ctaText: 'Explorar Siluetas',
    category: 'lookbook',
    accent: '#f43f5e',
  },
  {
    id: 'banner-3',
    image: '/banners/banner-3.png',
    title: 'UN ESTILO, UNA VIDA',
    subtitle: 'Nuestra comunidad viste autenticidad, caída pesada y acabados de precisión.',
    tag: 'STREETWEAR COMMUNITY',
    ctaText: 'Comprar Ofertas',
    category: 'hero',
    accent: '#fb7185',
  },
  {
    id: 'banner-4',
    image: '/banners/banner-4.png',
    title: 'ESENCIALES EN MOVIMIENTO',
    subtitle: 'Prendas versátiles diseñadas para el ritmo de la ciudad moderna.',
    tag: 'NUEVA TEMPORADA',
    ctaText: 'Ver Nuevos Drops',
    category: 'hero',
    accent: '#e11d48',
  },
  {
    id: 'banner-5',
    image: '/banners/banner-5.png',
    title: 'MINIMALISMO & ESTRUCTURA',
    subtitle: 'Paleta neutral sofisticada con tonos orgánicos: cemento, arena, denim y carbón.',
    tag: 'COLOR PALETTE 2026',
    ctaText: 'Ver Gama Cromática',
    category: 'lookbook',
    accent: '#38bdf8',
  },
  {
    id: 'banner-6',
    image: '/banners/banner-6.png',
    title: 'PANORAMA URBANO',
    subtitle: 'Patronaje holgado sin perder la forma. Boxy fit perfeccionado.',
    tag: 'SIGNATURE FIT',
    ctaText: 'Guía de Tallas',
    category: 'lookbook',
    accent: '#fbbf24',
  },
  {
    id: 'banner-7',
    image: '/banners/banner-7.png',
    title: 'VANTA COLLECTIVE',
    subtitle: 'La convergencia entre diseño sartorial y cultura urbana contemporánea.',
    tag: 'COLLECCIÓN CÁPSULA',
    ctaText: 'Ver Novedades',
    category: 'hero',
    accent: '#a855f7',
  },
  {
    id: 'banner-8',
    image: '/banners/banner-8.png',
    title: 'PRECISIÓN EN CADA COSTURA',
    subtitle: 'Cuellos indeformables de rib doble aguja y caídas limpias.',
    tag: 'CALIDAD GARANTIZADA',
    ctaText: 'Comprar Packs',
    category: 'deals',
    accent: '#22c55e',
  },
  {
    id: 'banner-9',
    image: '/banners/banner-9.png',
    title: 'ACTITUD SIN ESFUERZO',
    subtitle: 'La prenda que complementa tu personalidad en cualquier ocasión.',
    tag: 'LOOKBOOK 2026',
    ctaText: 'Ver Catálogo',
    category: 'lookbook',
    accent: '#ec4899',
  },
  {
    id: 'banner-10',
    image: '/banners/banner-10.png',
    title: 'ARTE TEXTIL & GEOMETRÍA VITRAL',
    subtitle: 'Inspiración arquitectónica gótica reinterpretada en la moda urbana de alta gama.',
    tag: 'OBRA MAESTRA // ATELIER',
    ctaText: 'Descubrir Historia',
    category: 'masterpiece',
    accent: '#f59e0b',
  },
  {
    id: 'banner-11',
    image: '/banners/banner-11.png',
    title: 'INGENIERÍA TEXTIL TÁCTIL',
    subtitle: 'Tejidos de gramaje denso con suavidad superior al tacto. Algodón peinado y trama rústica.',
    tag: '420 GSM // TEXTURA PURA',
    ctaText: 'Explorar Tejidos',
    category: 'textiles',
    accent: '#e11d48',
  },
];

// Hero rotating selection
export const HERO_ROTATING_BANNERS = [
  ALL_BANNERS[0], // banner-1: Twilight Atelier
  ALL_BANNERS[2], // banner-3: Golden Hour Walk
  ALL_BANNERS[3], // banner-4: Grand Staircase Daylight
  ALL_BANNERS[6], // banner-7: Collective on steps
];

// Lookbook Showcase selection
export const LOOKBOOK_BANNERS = [
  ALL_BANNERS[9],  // banner-10: Stained glass vitral masterpiece
  ALL_BANNERS[10], // banner-11: Handcrafted tactile wool/felt
  ALL_BANNERS[5],  // banner-6: Architectural daylight
  ALL_BANNERS[4],  // banner-5: Neutral palette
];
