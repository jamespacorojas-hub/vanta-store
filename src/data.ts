import { Product, FAQItem } from './types';
import productImageManifest from './data/productImageManifest.json';

const GARMENT_COLORS = [
  'Azul', 'Beige', 'Blanco', 'Botella', 'Camote', 'Cemento', 'Denim', 'Gris',
  'Lila', 'Marrón', 'Melange Oscuro', 'Morado', 'Pacay', 'Palo Rosa', 'Perla',
  'Plomo', 'Topo', 'Vino',
];

export const CATEGORIES = [
  'Inicio',
  'Nuevos ingresos',
  'Camisa',
  'Camisero',
  'Manga Larga',
  'Clásico',
  'Notch',
  'Polera',
  'Ofertas',
];

export const PRODUCTS: Product[] = [
  {
    id: 'camisa',
    name: 'Camisa',
    category: 'Camisa',
    price: 32.00,
    oldPrice: 45.00,
    promoBadge: '2 x S/ 55 · 4 x S/ 99 · 8 x S/ 190',
    promoSavings: 'Desde S/ 23.75 c/u',
    promoDetail: '2 camisas x S/ 55 | 4 camisas x S/ 99 | 8 camisas x S/ 190',
    promoTiers: [
      { quantity: 2, price: 55, label: '2 camisas x S/ 55', unitPrice: 27.50 },
      { quantity: 4, price: 99, label: '4 camisas x S/ 99', unitPrice: 24.75 },
      { quantity: 8, price: 190, label: '8 camisas x S/ 190', unitPrice: 23.75 },
    ],
    description: 'Camisa minimalista de alta gama confeccionada para un estilo streetwear refinado. Presenta un cuello impecable, silueta boxy contemporánea y acabados de costura invisibles.',
    fabricDetails: 'Disponible en tejidos premium seleccionados: Waffle, Jersey, Piqué, Waffer. Aporta una textura táctil incomparable y un peso óptimo para una caída perfecta.',
    images: [
      productImageManifest.camisa.waffle.Blanco,
      productImageManifest.camisa.jersey.Negro,
      productImageManifest.camisa.jersey.Beige,
      productImageManifest.camisa.jersey.Denim,
    ],
    colorImages: productImageManifest.camisa,
    colors: ['Blanco', 'Negro', 'Beige', 'Denim', 'Vino', 'Botella', 'Cemento', ...GARMENT_COLORS.filter(c => !['Blanco', 'Negro', 'Beige', 'Denim', 'Vino', 'Botella', 'Cemento'].includes(c))],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Nuevo', 'Promo Pack'],
    stock: 24,
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'camisero',
    name: 'Camisero',
    category: 'Camisero',
    price: 25.00,
    oldPrice: 35.00,
    promoBadge: '5 x S/ 99 · 6 x S/ 109 · 10 x S/ 180',
    promoSavings: 'Desde S/ 18.00 c/u',
    promoDetail: '5 polos x S/ 99 | 6 polos x S/ 109 | 10 polos x S/ 180',
    promoTiers: [
      { quantity: 5, price: 99, label: '5 polos x S/ 99', unitPrice: 19.80 },
      { quantity: 6, price: 109, label: '6 polos x S/ 109', unitPrice: 18.17 },
      { quantity: 10, price: 180, label: '10 polos x S/ 180', unitPrice: 18.00 },
    ],
    description: 'Nuestra silueta Camisero de corte relajado, ideal para layering urbano. Cuenta con bolsillo frontal plano y una caída fluida que brinda máxima movilidad y un estilo contemporáneo.',
    fabricDetails: 'Confeccionado artesanalmente en tu tela preferida: Waffle, Jersey, Piqué, Waffer. Alta durabilidad y suavidad al tacto.',
    images: [
      productImageManifest.camisero.jersey.Cemento,
      productImageManifest.camisero.jersey.Denim,
      productImageManifest.camisero.jersey.Negro,
      productImageManifest.camisero.jersey.Beige,
    ],
    colorImages: productImageManifest.camisero,
    colors: ['Cemento', 'Denim', 'Negro', 'Beige', 'Botella', 'Vino', 'Plomo', ...GARMENT_COLORS.filter(c => !['Cemento', 'Denim', 'Negro', 'Beige', 'Botella', 'Vino', 'Plomo'].includes(c))],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Lanzamiento', 'Promo Pack'],
    stock: 18,
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'manga-larga',
    name: 'Manga Larga',
    category: 'Manga Larga',
    price: 22.00,
    oldPrice: 35.00,
    promoBadge: '4 x S/ 69 · 8 x S/ 99 · 16 x S/ 190',
    promoSavings: 'Desde S/ 11.88 c/u',
    promoDetail: '4 polos x S/ 69 | 8 polos x S/ 99 | 16 polos x S/ 190',
    promoTiers: [
      { quantity: 4, price: 69, label: '4 polos x S/ 69', unitPrice: 17.25 },
      { quantity: 8, price: 99, label: '8 polos x S/ 99', unitPrice: 12.38 },
      { quantity: 16, price: 190, label: '16 polos x S/ 190', unitPrice: 11.88 },
    ],
    description: 'Polo pesado de manga larga de silueta holgada. Presenta puños de rib acanalados y cuello cerrado de 3cm para un ajuste streetwear de inspiración retro de los 90s.',
    fabricDetails: 'Disponible en tejidos seleccionados: Waffle, Jersey, Piqué, Waffer. Textura acogedora de alta transpirabilidad.',
    images: [
      productImageManifest['manga-larga'].jersey.Vino,
      productImageManifest['manga-larga'].jersey.Negro,
      productImageManifest['manga-larga'].jersey.Plomo,
      productImageManifest['manga-larga'].jersey.Blanco,
    ],
    colorImages: productImageManifest['manga-larga'],
    colors: ['Vino', 'Negro', 'Plomo', 'Blanco', 'Azul', 'Botella', 'Melange Oscuro', ...GARMENT_COLORS.filter(c => !['Vino', 'Negro', 'Plomo', 'Blanco', 'Azul', 'Botella', 'Melange Oscuro'].includes(c))],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Oferta', 'Mega Promo'],
    stock: 15,
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'clasico',
    name: 'Básicos Vanta',
    category: 'Clásico',
    price: 15.00,
    oldPrice: 25.00,
    promoBadge: '3 x S/ 35 · 6 x S/ 55 · 12 x S/ 99',
    promoSavings: 'Desde S/ 8.25 c/u',
    promoDetail: '3 polos x S/ 35 | 6 polos x S/ 55 | 12 polos x S/ 99',
    promoTiers: [
      { quantity: 3, price: 35, label: '3 polos x S/ 35', unitPrice: 11.67 },
      { quantity: 6, price: 55, label: '6 polos x S/ 55', unitPrice: 9.17 },
      { quantity: 12, price: 99, label: '12 polos x S/ 99', unitPrice: 8.25 },
    ],
    description: 'El polo básico indispensable para cualquier rotación urbana. Ofrece un corte boxy fit ultra balanceado, hombros ligeramente caídos y costura reforzada indeformable.',
    fabricDetails: 'Tejido pesado estructurado en opciones: Waffle, Jersey, Piqué, Waffer. No encoge ni deforma con las lavadas continuas.',
    images: [
      productImageManifest.clasico.jersey.Denim,
      productImageManifest.clasico.jersey.Blanco,
      productImageManifest.clasico.jersey.Negro,
      productImageManifest.clasico.jersey.Botella,
    ],
    colorImages: productImageManifest.clasico,
    colors: ['Denim', 'Blanco', 'Negro', 'Botella', 'Vino', 'Beige', 'Cemento', ...GARMENT_COLORS.filter(c => !['Denim', 'Blanco', 'Negro', 'Botella', 'Vino', 'Beige', 'Cemento'].includes(c))],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Básico', 'Pack 12x'],
    stock: 30,
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'notch',
    name: 'Cuello Pico',
    category: 'Notch',
    price: 22.00,
    oldPrice: 32.00,
    promoBadge: '3 x S/ 55 · 6 x S/ 99 · 12 x S/ 180',
    promoSavings: 'Desde S/ 15.00 c/u',
    promoDetail: '3 polos x S/ 55 | 6 polos x S/ 99 | 12 polos x S/ 180',
    promoTiers: [
      { quantity: 3, price: 55, label: '3 polos x S/ 55', unitPrice: 18.33 },
      { quantity: 6, price: 99, label: '6 polos x S/ 99', unitPrice: 16.50 },
      { quantity: 12, price: 180, label: '12 polos x S/ 180', unitPrice: 15.00 },
    ],
    description: 'Polo minimalista con cuello pico / notch (abertura sutil en V sin botones). Otorga un look refinado sin sacrificar la comodidad ni el porte de la silueta.',
    fabricDetails: 'Disponible para personalizar en telas: Waffle, Piqué, Jersey, Waffer. Ofrece excelente retención de forma.',
    images: [
      productImageManifest.notch.jersey.Botella,
      productImageManifest.notch.jersey.Beige,
      productImageManifest.notch.jersey.Negro,
      productImageManifest.notch.jersey.Vino,
    ],
    colorImages: productImageManifest.notch,
    colors: ['Botella', 'Beige', 'Negro', 'Vino', 'Blanco', 'Topo', 'Palo Rosa', ...GARMENT_COLORS.filter(c => !['Botella', 'Beige', 'Negro', 'Vino', 'Blanco', 'Topo', 'Palo Rosa'].includes(c))],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Nuevo', 'Promo Pack'],
    stock: 22,
    fabrics: ['Waffle', 'Piqué', 'Jersey', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'polera',
    name: 'Polera Zyko',
    category: 'Polera',
    price: 35.00,
    oldPrice: 55.00,
    promoBadge: '2 x S/ 55 · 5 x S/ 99 · 10 x S/ 190',
    promoSavings: 'Desde S/ 19.00 c/u',
    promoDetail: '2 poleras x S/ 55 | 5 poleras x S/ 99 | 10 poleras x S/ 190',
    promoTiers: [
      { quantity: 2, price: 55, label: '2 poleras x S/ 55', unitPrice: 27.50 },
      { quantity: 5, price: 99, label: '5 poleras x S/ 99', unitPrice: 19.80 },
      { quantity: 10, price: 190, label: '10 poleras x S/ 190', unitPrice: 19.00 },
    ],
    description: 'Sudadera con capucha (hoodie) Polera Zyko de silueta oversized. Su capucha pesada de doble capa sin cordón otorga un perfil limpio y moderno, complementado por un forro interior suave.',
    fabricDetails: 'Confección pesada y acogedora en tus telas favoritas: Zyko, Waffle, Jersey, Piqué, Waffer. El estándar definitivo de comodidad urbana.',
    images: [
      productImageManifest.polera.jersey['Melange Oscuro'],
      productImageManifest.polera.jersey.Negro,
      productImageManifest.polera.jersey.Vino,
      productImageManifest.polera.jersey.Azul,
    ],
    colorImages: productImageManifest.polera,
    colors: ['Melange Oscuro', 'Negro', 'Vino', 'Azul', 'Botella', 'Cemento', 'Beige', ...GARMENT_COLORS.filter(c => !['Melange Oscuro', 'Negro', 'Vino', 'Azul', 'Botella', 'Cemento', 'Beige'].includes(c))],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Nuevo', 'Mega Oferta'],
    stock: 16,
    fabrics: ['Zyko', 'Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Larga']
  }
];

export const FAQS: FAQItem[] = [
  {
    question: '¿Cómo realizo una compra en VANTA?',
    answer: 'La compra se inicia seleccionando tus prendas, tallas y colores preferidos en nuestra web. Una vez añadidas al carrito, completa tus datos de entrega y haz clic en "Finalizar pedido por WhatsApp". Se generará automáticamente un mensaje con tu pedido estructurado que nos llegará para confirmar stock inmediato y brindarte los datos de pago.',
  },
  {
    question: '¿Cuáles son los métodos de pago disponibles?',
    answer: 'Nuestros métodos de pago oficiales y exclusivos son AGORA PAY y OH! PAY. Puedes pagar cómodamente escaneando nuestro código QR, transfiriendo por número celular de destino, o realizando transferencias interbancarias desde cualquier otra entidad (como Yape, Plin, BCP, BBVA, Interbank, etc.) utilizando sus respectivos códigos interbancarios (CCI). Al final del checkout, podrás visualizar y copiar las guías interbancarias detalladas para cada aplicación.',
  },
  {
    question: '¿Hacen envíos a todo el Perú?',
    answer: 'Sí. Realizamos envíos a nivel nacional a través de Olva Courier o Shalom. Para Lima Metropolitana, contamos con servicio de motorizado express con entrega en un plazo de 24 a 48 horas hábiles.',
  },
  {
    question: '¿Cuál es la política de cambios?',
    answer: 'Se admiten cambios de talla o prenda dentro de los primeros 7 días posteriores a la recepción. El producto debe estar completamente nuevo, sin usar, con todas sus etiquetas intactas y en su empaque original. Los costos de envío correspondientes al cambio son asumidos por el cliente, salvo defectos de fabricación.',
  },
  {
    question: '¿Tienen tienda física?',
    answer: 'Actualmente operamos de manera 100% online con envíos rápidos desde nuestro almacén central ubicado en San Isidro, Lima. Esto nos permite mantener un control estricto de calidad y ofrecer lanzamientos exclusivos semanales.',
  }
];
