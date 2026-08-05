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
  'Polera c/ Cierre',
  'Ofertas',
];

export const PRODUCTS: Product[] = [
  {
    id: 'camisa',
    name: 'Camisa',
    category: 'Camisa',
    price: 45.00,
    oldPrice: 55.00,
    description: 'Camisa minimalista de alta gama confeccionada para un estilo streetwear refinado. Presenta un cuello impecable, silueta boxy contemporánea y acabados de costura invisibles.',
    fabricDetails: 'Disponible en tejidos premium seleccionados: Waffle, Jersey, Piqué, Waffer. Aporta una textura táctil incomparable y un peso óptimo para una caída perfecta.',
    images: [
      productImageManifest.camisa.jersey.Negro,
      productImageManifest.camisa.jersey.Azul,
    ],
    colorImages: productImageManifest.camisa,
    colors: ['Negro', ...GARMENT_COLORS],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Nuevo'],
    stock: 24,
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'camisero',
    name: 'Camisero',
    category: 'Camisero',
    price: 45.00,
    description: 'Nuestra silueta Camisero de corte relajado, ideal para layering urbano. Cuenta con bolsillo frontal plano y una caída fluida que brinda máxima movilidad y un estilo contemporáneo.',
    fabricDetails: 'Confeccionado artesanalmente en tu tela preferida: Waffle, Jersey, Piqué, Waffer. Alta durabilidad y suavidad al tacto.',
    images: [
      productImageManifest.camisero.jersey.Negro,
      productImageManifest.camisero.jersey.Azul,
    ],
    colorImages: productImageManifest.camisero,
    colors: ['Negro', ...GARMENT_COLORS],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Lanzamiento'],
    stock: 18,
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'manga-larga',
    name: 'Manga Larga',
    category: 'Manga Larga',
    price: 55.00,
    oldPrice: 65.00,
    description: 'Polo pesado de manga larga de silueta holgada. Presenta puños de rib acanalados y cuello cerrado de 3cm para un ajuste streetwear de inspiración retro de los 90s.',
    fabricDetails: 'Disponible en tejidos seleccionados: Waffle, Jersey, Piqué, Waffer. Textura acogedora de alta transpirabilidad.',
    images: [
      productImageManifest['manga-larga'].jersey.Negro,
      productImageManifest['manga-larga'].jersey.Azul,
    ],
    colorImages: productImageManifest['manga-larga'],
    colors: ['Negro', ...GARMENT_COLORS],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Oferta', 'Nuevo'],
    stock: 15,
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'clasico',
    name: 'Clásico',
    category: 'Clásico',
    price: 40.00,
    description: 'El polo clásico e indispensable para cualquier clóset. Ofrece un corte boxy fit ultra balanceado, hombros ligeramente caídos y una costura reforzada de doble aguja en el cuello.',
    fabricDetails: 'Tejido pesado estructurado en opciones: Waffle, Jersey, Piqué, Waffer. No encoge ni deforma con las lavadas continuas.',
    images: [
      productImageManifest.clasico.jersey.Negro,
      productImageManifest.clasico.jersey.Azul,
    ],
    colorImages: productImageManifest.clasico,
    colors: ['Negro', ...GARMENT_COLORS],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Básico'],
    stock: 30,
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'notch',
    name: 'Notch',
    category: 'Notch',
    price: 45.00,
    description: 'Polo de diseño minimalista con cuello Notch (abertura sutil sin botones). Otorga un look refinado sin sacrificar la comodidad ni el carácter relajado de la indumentaria streetwear.',
    fabricDetails: 'Disponible para personalizar en telas: Waffle, Piqué, Jersey, Waffer. Ofrece excelente retención de forma.',
    images: [
      productImageManifest.notch.jersey.Negro,
      productImageManifest.notch.jersey.Azul,
    ],
    colorImages: productImageManifest.notch,
    colors: ['Negro', ...GARMENT_COLORS],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Nuevo'],
    stock: 22,
    fabrics: ['Waffle', 'Piqué', 'Jersey', 'Waffer'],
    sleeves: ['Manga Corta', 'Manga Larga']
  },
  {
    id: 'polera',
    name: 'Polera',
    category: 'Polera',
    price: 75.00,
    oldPrice: 89.00,
    description: 'Sudadera con capucha (hoodie) de silueta oversized. Su capucha pesada de doble capa sin cordón otorga un perfil limpio y moderno, complementado por un forro interior suave.',
    fabricDetails: 'Confección pesada y acogedora en tus telas favoritas: Waffle, Jersey, Piqué, Waffer. El estándar definitivo de comodidad urbana.',
    images: [
      productImageManifest.polera.jersey.Negro,
      productImageManifest.polera.jersey.Azul,
    ],
    colorImages: productImageManifest.polera,
    colors: ['Negro', ...GARMENT_COLORS],
    sizes: ['S', 'M', 'L', 'XL'],
    tags: ['Nuevo', 'Oferta'],
    stock: 16,
    fabrics: ['Waffle', 'Jersey', 'Piqué', 'Waffer'],
    sleeves: ['Manga Larga']
  },
  {
    id: 'polera-cierre',
    name: 'Polera c/ Cierre',
    category: 'Polera c/ Cierre',
    price: 85.00,
    description: 'Sudadera con capucha y cierre completo mediante cremallera de deslizamiento suave. Silueta oversized ajustable con puños y basta acanalados para retener el calor corporal. Próximo lanzamiento: las confecciones aún están en proceso de producción.',
    fabricDetails: 'Tejido pesado y abrigador disponible en: Neru, Waffle, Piqué. Costuras reforzadas de resistencia industrial.',
    // Sin fotos todavía — confección aún no finalizada. No usar placeholders genéricos que no
    // representan la prenda real; los componentes de tarjeta muestran un estado "próximamente" en su lugar.
    images: [],
    colors: [
      'Azul', 'Beige', 'Botella', 'Cemento', 'Denim', 'Melange Oscuro', 'Negro',
      'Pacay', 'Palo Rosa', 'Perla', 'Vino', 'Marrón', 'Camote', 'Topo', 'Plomo',
      'Blanco', 'Gris'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    // Confecciones aún no finalizadas — próximo lanzamiento, todavía sin stock disponible
    tags: ['Próximamente'],
    stock: 0,
    fabrics: ['Neru', 'Waffle', 'Piqué'],
    sleeves: ['Manga Larga']
  }
];

export const FAQS: FAQItem[] = [
  {
    question: '¿Cómo realizo una compra en MONT STORE?',
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
