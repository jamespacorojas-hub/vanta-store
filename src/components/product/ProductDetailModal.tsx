import React, { useState, useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Send,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Camera,
  Ruler,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';
import { Product } from '../../types';
import { COLOR_HEX } from '../../utils/colorSwatch';
import { getGarmentPhoto } from '../../utils/productImages';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    size: string,
    color: string,
    fabric?: string,
    sleeve?: string
  ) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
  onSelectProduct: (product: Product) => void;
}

const BLUEPRINT_MAP: Record<string, string> = {
  polera: '/medidas/medida-polera.png',
  camisa: '/medidas/medida-camisa.png',
  clasico: '/medidas/medida-clasicos.png',
  'manga-larga': '/medidas/medida-manga-larga.png',
  camisero: '/medidas/medida-camisero.png',
  notch: '/medidas/medida-notch.png',
};

const TEXTURE_MAP: Record<string, string> = {
  Zyko: '/texturas/zyko.png',
  Neru: '/texturas/zyko.png',
  Waffle: '/texturas/waffle.png',
  Waffer: '/texturas/waffer.png',
  Piqué: '/texturas/pique.png',
  Jersey: '/texturas/jersey.png',
  Clásico: '/texturas/jersey.png',
  Clásica: '/texturas/jersey.png',
};

const FABRIC_SPECS: Record<
  string,
  { gsm: string; feel: string; weave: string; description: string }
> = {
  Zyko: {
    gsm: '280 GSM',
    feel: 'Rústico / Fresco',
    weave: 'Entramado irregular tipo lino',
    description:
      'Hilado orgánico con textura rústica cruzada. Proporciona máxima ventilación, caída natural y alta durabilidad para clima cálido y templado.',
  },
  Waffle: {
    gsm: '400 GSM',
    feel: 'Alveolar / Pesado',
    weave: 'Punto nido de abeja 3D',
    description:
      'Estructura tridimensional alveolar de alta densidad. Absorbe la luz evitando reflejos, ofrece gran aislamiento térmico y caída rígida.',
  },
  Waffer: {
    gsm: '420 GSM',
    feel: 'Ultra Pesado / Estructurado',
    weave: 'Waffle pesado reforzado',
    description:
      'Variante de tejido waffle de máxima ingeniería textil. Gramaje superior diseñado para mantener la silueta boxy fit intacta en todo momento.',
  },
  Piqué: {
    gsm: '300 GSM',
    feel: 'Granulado / Firme',
    weave: 'Punto de arroz de alta gama',
    description:
      'Tejido entrelazado fino característico de alta costura. Resistencia superior a las arrugas, excelente transpirabilidad y tacto premium.',
  },
  Jersey: {
    gsm: '240 GSM',
    feel: 'Ultra Suave / Fluido',
    weave: 'Punto liso peinado fino',
    description:
      'Algodón 100% peinado de fibra larga. Extraordinaria suavidad al contacto con la piel, gran adaptabilidad y confort para uso diario.',
  },
  Clásico: {
    gsm: '280 GSM',
    feel: 'Compacto / Sobrio',
    weave: 'Plano alta torsión',
    description:
      'Algodón plano de alta densidad y acabado pulido. Confección con costuras reforzadas que mantienen la caída rígida y uniforme.',
  },
  Clásica: {
    gsm: '280 GSM',
    feel: 'Compacto / Sobrio',
    weave: 'Plano alta torsión',
    description:
      'Algodón plano de alta densidad y acabado pulido. Confección con costuras reforzadas que mantienen la caída rígida y uniforme.',
  },
};

const SIZE_TABLE: Record<
  string,
  { size: string; ancho: string; largo: string; hombro: string }[]
> = {
  default: [
    { size: 'S', ancho: '56 cm', largo: '70 cm', hombro: '52 cm' },
    { size: 'M', ancho: '59 cm', largo: '73 cm', hombro: '55 cm' },
    { size: 'L', ancho: '62 cm', largo: '76 cm', hombro: '58 cm' },
    { size: 'XL', ancho: '65 cm', largo: '79 cm', hombro: '61 cm' },
  ],
};

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: ProductDetailModalProps) {
  if (!product) return null;

  const [activeMediaTab, setActiveMediaTab] = useState<'photo' | 'blueprint' | 'texture'>('photo');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string>('');

  useEffect(() => {
    setSelectedColor(product.colors[0] || 'Negro');
    setSelectedFabric(product.fabrics[0] || 'Jersey');
    setSelectedSize('M');
    setQuantity(1);
    setActiveMediaTab('photo');
    setToastMessage('');
  }, [product]);

  const activeColor = selectedColor || product.colors[0] || 'Negro';
  const activeColorHex = COLOR_HEX[activeColor] || '#18181b';
  const activeFabric = selectedFabric || product.fabrics[0] || 'Jersey';
  const fabricData = FABRIC_SPECS[activeFabric] || {
    gsm: '300 GSM',
    feel: 'Premium Cotton',
    weave: 'Algodón Peinado',
    description: 'Confección de alta densidad con fibras peruanas seleccionadas.',
  };

  const garmentPhoto =
    getGarmentPhoto(product.id, activeFabric, activeColor) ||
    product.images[0];

  const blueprintImage = BLUEPRINT_MAP[product.id] || '/medidas/medida-clasicos.png';
  const textureImage = TEXTURE_MAP[activeFabric] || '/texturas/jersey.png';

  const handleAddToCart = () => {
    onAddToCart(
      product,
      quantity,
      selectedSize,
      activeColor,
      activeFabric,
      product.sleeves?.[0]
    );
    setToastMessage(`✓ ${product.name} (${activeColor} - ${selectedSize}) agregada`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleBuyOnWhatsApp = () => {
    const msg = `Hola, VANTA. Deseo realizar el pedido de la siguiente prenda:

1. Prenda: ${product.name}
2. Color: ${activeColor}
3. Tejido: ${activeFabric} (${fabricData.gsm})
4. Talla: ${selectedSize} (Corte Boxy Fit)
5. Cantidad: ${quantity}
6. Precio: S/ ${(product.price * quantity).toFixed(2)}

Por favor confirmar disponibilidad y métodos de pago oficiales. Gracias.`;

    const url = `https://wa.me/51904536406?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-card"
        className="relative bg-paper-soft text-ink border border-line w-full max-w-5xl max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col rounded-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Bar */}
        <div className="sticky top-0 z-30 bg-paper-soft/95 backdrop-blur-md border-b border-line px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
              FICHA TÉCNICA // {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(product)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-accent text-white border-accent'
                  : 'bg-paper text-muted border-line hover:text-ink hover:border-ink/40'
              }`}
              title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              aria-label="Favorito"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-paper text-muted hover:text-ink border border-line rounded-full hover:border-ink/40 transition-all cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* ── LEFT: MULTI-VIEW MEDIA STAGE (6 cols) ── */}
          <div className="lg:col-span-6 bg-panel p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-line">
            {/* View Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-paper border border-line rounded-sm mb-4">
              <button
                onClick={() => setActiveMediaTab('photo')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMediaTab === 'photo'
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Foto Real</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('blueprint')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMediaTab === 'blueprint'
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Plano & Medidas</span>
              </button>

              <button
                onClick={() => setActiveMediaTab('texture')}
                className={`flex-1 py-1.5 px-2 text-[11px] font-mono font-bold uppercase tracking-wider rounded-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeMediaTab === 'texture'
                    ? 'bg-ink text-paper shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Textura Textil</span>
              </button>
            </div>

            {/* Stage Viewer */}
            <div className="relative w-full aspect-[4/4] sm:aspect-[4/5] max-h-[380px] sm:max-h-[460px] bg-paper border border-line rounded-sm flex items-center justify-center overflow-hidden p-3 group">
              {activeMediaTab === 'photo' && (
                <>
                  {garmentPhoto ? (
                    <img
                      key={garmentPhoto}
                      src={garmentPhoto}
                      alt={`${product.name} ${activeColor}`}
                      className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-6xl font-bold text-muted/20">
                      {product.name[0]}
                    </div>
                  )}

                  {/* Active Photo Pill */}
                  <div className="absolute bottom-3 left-3 bg-paper/90 backdrop-blur-md border border-line px-2.5 py-1 text-[10px] font-mono text-ink rounded-full flex items-center gap-1.5 shadow-sm">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-line"
                      style={{ backgroundColor: activeColorHex }}
                    />
                    <span className="font-bold">{activeColor}</span>
                    <span className="text-muted">·</span>
                    <span className="text-accent font-bold">{activeFabric}</span>
                  </div>
                </>
              )}

              {activeMediaTab === 'blueprint' && (
                <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-black rounded-xs relative overflow-hidden">
                  <img
                    src={blueprintImage}
                    alt={`Plano técnico de medidas - ${product.name}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2.5 bg-black/90 backdrop-blur-md px-3 py-1 border border-[#3a3224] rounded-xs shadow-md">
                    <span className="text-[9.5px] font-mono text-[#D1C2A5] uppercase tracking-wider font-bold">
                      ✦ CUADRO OFICIAL DE MEDIDAS (cm) ✦
                    </span>
                  </div>
                </div>
              )}

              {activeMediaTab === 'texture' && (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
                  <img
                    src={textureImage}
                    alt={`Macro textura de ${activeFabric}`}
                    className="w-full h-full object-contain rounded-xs drop-shadow-sm"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-3 bg-paper/90 backdrop-blur-md border border-line px-3 py-1 text-center rounded-sm">
                    <span className="font-mono text-xs font-bold text-accent uppercase block">
                      {activeFabric} · {fabricData.gsm}
                    </span>
                    <span className="font-mono text-[9px] text-muted uppercase">
                      {fabricData.weave}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Micro Spec Strip */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="bg-paper border border-line p-2 rounded-xs">
                <span className="text-muted block text-[9px]">GRAMAJE</span>
                <strong className="text-ink text-xs">{fabricData.gsm}</strong>
              </div>
              <div className="bg-paper border border-line p-2 rounded-xs">
                <span className="text-muted block text-[9px]">CORTE</span>
                <strong className="text-ink text-xs">BOXY OVERSIZED</strong>
              </div>
              <div className="bg-paper border border-line p-2 rounded-xs">
                <span className="text-muted block text-[9px]">ORIGEN</span>
                <strong className="text-ink text-xs">100% PERUANO</strong>
              </div>
            </div>
          </div>

          {/* ── RIGHT: TECHNICAL DETAILS & PURCHASE PANEL (6 cols) ── */}
          <div className="lg:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Product Title & Pricing */}
              <div className="space-y-1.5 border-b border-line pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted font-bold">
                    VANTA ATELIER · DROP 2026
                  </span>
                  <span className="bg-panel border border-line text-muted font-mono text-[9px] px-2 py-0.5 uppercase">
                    STOCK: {product.stock} DISP.
                  </span>
                </div>

                <h1 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-ink">
                    S/ {product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="font-mono text-sm sm:text-base text-muted line-through">
                      S/ {product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  {product.oldPrice && (
                    <span className="text-[10px] font-mono font-bold text-accent bg-accent-soft px-2 py-0.5 rounded-full border border-accent/20">
                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* 1. Fabric Selection (Tejido) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted">
                    1. TEJIDO: <strong className="text-ink">{activeFabric}</strong>
                  </span>
                  <span className="text-accent font-bold text-[10px]">
                    {fabricData.gsm} · {fabricData.feel}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.fabrics.map((fab) => {
                    const isSel = fab === activeFabric;
                    return (
                      <button
                        key={fab}
                        onClick={() => setSelectedFabric(fab)}
                        className={`px-3 py-1.5 text-xs font-mono uppercase font-bold rounded-xs border transition-all cursor-pointer ${
                          isSel
                            ? 'bg-accent text-white border-accent shadow-sm'
                            : 'bg-panel text-muted border-line hover:border-ink/40 hover:text-ink'
                        }`}
                      >
                        {fab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Color Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted">
                    2. COLOR: <strong className="text-ink">{activeColor}</strong>
                  </span>
                  <span className="text-muted text-[10px]">
                    {product.colors.length} disponibles
                  </span>
                </div>

                <div className="p-2.5 bg-panel/50 border border-line rounded-sm flex flex-wrap gap-2.5 items-center max-h-32 overflow-y-auto no-scrollbar">
                  {product.colors.map((c) => {
                    const isSel = c === activeColor;
                    const hex = COLOR_HEX[c] || '#18181b';
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        title={c}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all cursor-pointer p-0.5 relative flex items-center justify-center ${
                          isSel
                            ? 'ring-2 ring-accent ring-offset-2 ring-offset-paper-soft shadow-sm'
                            : 'border border-line hover:border-ink/50 opacity-80 hover:opacity-100 hover:scale-105'
                        }`}
                      >
                        <span
                          className="w-full h-full rounded-full block shadow-inner border border-black/20"
                          style={{ backgroundColor: hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Size Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted">
                    3. TALLA: <strong className="text-ink">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setActiveMediaTab('blueprint')}
                    className="text-accent hover:underline flex items-center gap-1 text-[10px] cursor-pointer"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Ver medidas del plano</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  {product.sizes.map((sz) => {
                    const isSel = sz === selectedSize;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`flex-1 py-2.5 text-xs font-mono font-bold uppercase rounded-xs border transition-all cursor-pointer ${
                          isSel
                            ? 'bg-ink text-paper border-ink shadow-sm'
                            : 'bg-panel text-muted border-line hover:border-ink/40 hover:text-ink'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Specifications Summary Box */}
              <div className="bg-panel border border-line p-3.5 rounded-sm space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-accent font-mono font-bold text-[10px] uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>ESPECIFICACIONES DE CONFECCIÓN:</span>
                </div>
                <p className="text-muted leading-relaxed font-sans text-xs">
                  {fabricData.description}
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[10px] text-muted pt-1 border-t border-line/60">
                  <div>• Hilos: 100% Algodón Peinado</div>
                  <div>• Teñido: Reactivo al frío</div>
                  <div>• Costuras: Reforzadas dobles</div>
                  <div>• Cuello: Rib elástico indeformable</div>
                </div>
              </div>
            </div>

            {/* Action Bar & WhatsApp Buy */}
            <div className="space-y-3 pt-2 border-t border-line">
              {toastMessage && (
                <div className="py-2 px-3 bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-mono font-bold text-center rounded-sm animate-in fade-in">
                  {toastMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  id="ficha-add-to-cart-cta"
                  onClick={handleAddToCart}
                  className="w-full bg-ink text-paper hover:opacity-90 font-mono font-bold text-xs uppercase tracking-widest py-3.5 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md rounded-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Agregar al Carrito</span>
                </button>

                <button
                  id="ficha-buy-whatsapp-cta"
                  onClick={handleBuyOnWhatsApp}
                  className="w-full bg-[#161620] hover:bg-[#222230] text-white border border-zinc-700 font-mono font-bold text-xs uppercase tracking-widest py-3.5 px-4 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md rounded-sm"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Comprar por WhatsApp</span>
                </button>
              </div>

              {/* Guarantees row */}
              <div className="grid grid-cols-3 gap-1 text-center font-mono text-[9px] text-muted pt-2 border-t border-line/60">
                <div className="flex items-center justify-center gap-1">
                  <Truck className="w-3 h-3 text-accent" />
                  <span>Envíos 24-48h</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-accent" />
                  <span>Garantía Oficial</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <RotateCcw className="w-3 h-3 text-accent" />
                  <span>Cambios 7 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
