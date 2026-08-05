import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Send, AlertTriangle, ChevronRight, HelpCircle, Heart } from 'lucide-react';
import { Product } from '../../types';
import { PRODUCTS } from '../../data';
import { COLOR_HEX, LIGHT_COLOR_NAMES } from '../../utils/colorSwatch';
import { getGarmentPhoto } from '../../utils/productImages';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size: string, color: string, fabric?: string, sleeve?: string) => void;
  onToggleFavorite: (product: Product) => void;
  isFavorite: boolean;
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  onSelectProduct,
}: ProductDetailModalProps) {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFabric, setSelectedFabric] = useState<string>('');
  const [selectedSleeve, setSelectedSleeve] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Reset local states when active product changes
  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize('');
    setSelectedColor('');
    setSelectedFabric(product?.fabrics?.[0] || '');
    setSelectedSleeve(product?.sleeves?.[0] || '');
    setQuantity(1);
    setShowSizeGuide(false);
    setValidationError('');
    setSuccessMessage('');
  }, [product]);

  // Find related products (same category, excluding current product)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const handleAddToCart = () => {
    if (!selectedColor) {
      setValidationError('Por favor, selecciona un color disponible.');
      return;
    }
    if (!selectedSize) {
      setValidationError('Por favor, selecciona tu talla.');
      return;
    }
    if (product.fabrics && product.fabrics.length > 0 && !selectedFabric) {
      setValidationError('Por favor, selecciona una de las telas disponibles.');
      return;
    }
    if (product.sleeves && product.sleeves.length > 0 && !selectedSleeve) {
      setValidationError('Por favor, selecciona una de las mangas disponibles.');
      return;
    }
    if (quantity > product.stock) {
      setValidationError(`Solo quedan ${product.stock} unidades de este producto.`);
      return;
    }

    setValidationError('');
    onAddToCart(product, quantity, selectedSize, selectedColor, selectedFabric, selectedSleeve);

    // Show a premium toast message inside the detail modal
    setSuccessMessage('¡Prenda agregada al carrito con éxito!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleBuyOnWhatsApp = () => {
    if (!selectedColor) {
      setValidationError('Selecciona un color para comprar por WhatsApp.');
      return;
    }
    if (!selectedSize) {
      setValidationError('Selecciona una talla para comprar por WhatsApp.');
      return;
    }
    if (product.fabrics && product.fabrics.length > 0 && !selectedFabric) {
      setValidationError('Selecciona una tela para comprar por WhatsApp.');
      return;
    }
    if (product.sleeves && product.sleeves.length > 0 && !selectedSleeve) {
      setValidationError('Selecciona un tipo de manga para comprar por WhatsApp.');
      return;
    }
    setValidationError('');

    const formattedMessage = `Hola, MONT STORE. Quiero comprar directamente la siguiente prenda:

1. Producto: ${product.name}
   Color: ${selectedColor}
   Talla: ${selectedSize}
   Tela: ${selectedFabric}
   Manga: ${selectedSleeve}
   Cantidad: ${quantity}
   Precio: S/ ${(product.price).toFixed(2)}

Total estimado: S/ ${(product.price * quantity).toFixed(2)}
Costo de envío: Por confirmar

Quedo atento a la confirmación de disponibilidad para proceder con el pago. Gracias.`;

    const whatsappUrl = `https://wa.me/51904536406?text=${encodeURIComponent(formattedMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getSizeGuideDetails = () => {
    if (product.category === 'Pantalones') {
      return [
        { size: '30', details: 'Cintura: 76-80 cm | Largo: 102 cm' },
        { size: '32', details: 'Cintura: 80-84 cm | Largo: 104 cm' },
        { size: '34', details: 'Cintura: 84-88 cm | Largo: 106 cm' },
        { size: '36', details: 'Cintura: 88-92 cm | Largo: 108 cm' },
      ];
    }
    if (product.category === 'Accesorios') {
      return [{ size: 'Talla Única', details: 'Ajuste regulable de alta adaptabilidad.' }];
    }
    return [
      { size: 'S', details: 'Pecho (Ancho): 58 cm | Largo: 70 cm' },
      { size: 'M', details: 'Pecho (Ancho): 61 cm | Largo: 73 cm' },
      { size: 'L', details: 'Pecho (Ancho): 64 cm | Largo: 76 cm' },
      { size: 'XL', details: 'Pecho (Ancho): 67 cm | Largo: 79 cm' },
    ];
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-card"
        className="relative bg-paper w-full max-w-5xl h-full sm:h-auto sm:max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Close Button */}
        <button
          id="close-detail-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-ink text-paper-soft p-2 hover:bg-accent transition-colors"
          aria-label="Cerrar vista de producto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side: Interactive Color & Fabric Texture Simulator (No Images) */}
          <div className="p-4 sm:p-8 bg-panel flex flex-col justify-between border-r border-line text-ink min-h-[450px]">
            {/* Color mapping definition */}
            {(() => {
              const activeColorName = selectedColor || product.colors[0] || 'Negro';
              const activeColorHex = COLOR_HEX[activeColorName] || '#18181b';
              const activeFabricName = selectedFabric || product.fabrics[0] || 'Jersey';
              const isLightColor = LIGHT_COLOR_NAMES.includes(activeColorName);
              const realPhoto = getGarmentPhoto(product.id, activeFabricName, activeColorName);

              // Get CSS grid/pattern overlay depending on the fabric
              const getTextureOverlayStyle = () => {
                switch (activeFabricName) {
                  case 'Waffle':
                    return {
                      backgroundImage: `
                        linear-gradient(to right, rgba(${isLightColor ? '0,0,0,0.15' : '255,255,255,0.07'}) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(${isLightColor ? '0,0,0,0.15' : '255,255,255,0.07'}) 1px, transparent 1px)
                      `,
                      backgroundSize: '12px 12px',
                    };
                  case 'Waffer':
                    return {
                      backgroundImage: `
                        linear-gradient(to right, rgba(${isLightColor ? '0,0,0,0.2' : '255,255,255,0.1'}) 2px, transparent 2px),
                        linear-gradient(to bottom, rgba(${isLightColor ? '0,0,0,0.2' : '255,255,255,0.1'}) 2px, transparent 2px)
                      `,
                      backgroundSize: '18px 18px',
                    };
                  case 'Piqué':
                    return {
                      backgroundImage: `
                        radial-gradient(circle, rgba(${isLightColor ? '0,0,0,0.2' : '255,255,255,0.08'}) 1.5px, transparent 1.5px)
                      `,
                      backgroundSize: '6px 6px',
                    };
                  case 'Jersey':
                  case 'Clásica':
                  case 'Clásico':
                    return {
                      backgroundImage: `
                        linear-gradient(to right, rgba(${isLightColor ? '0,0,0,0.08' : '255,255,255,0.03'}) 1px, transparent 1px)
                      `,
                      backgroundSize: '4px 100%',
                    };
                  case 'Neru':
                    return {
                      backgroundImage: `
                        linear-gradient(to right, rgba(${isLightColor ? '0,0,0,0.12' : '255,255,255,0.05'}) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(${isLightColor ? '0,0,0,0.08' : '255,255,255,0.04'}) 2px, transparent 2px)
                      `,
                      backgroundSize: '8px 14px',
                    };
                  default:
                    return {};
                }
              };

              return (
                <div className="flex-1 flex flex-col justify-between h-full space-y-4">
                  {/* Top Simulator Brand Label */}
                  <div className="flex justify-between items-center text-[9px] text-muted pb-2 border-b border-line">
                    <span>SIMULADOR TEXTIL REAL-TIME</span>
                    <span className="animate-pulse flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      <span>FIBRA ACTIVA</span>
                    </span>
                  </div>

                  {/* Simulator Screen */}
                  <div
                    className="relative flex-1 aspect-[4/5] sm:aspect-auto w-full border border-line rounded-none flex flex-col justify-between p-6 overflow-hidden transition-all duration-700 shadow-inner"
                    style={realPhoto ? undefined : { backgroundColor: activeColorHex }}
                  >
                    {realPhoto ? (
                      <img
                        key={realPhoto}
                        src={realPhoto}
                        alt={`${product.name} color ${activeColorName}, tela ${activeFabricName}`}
                        className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <>
                        {/* Live Fabric texture layer overlay */}
                        <div
                          className="absolute inset-0 pointer-events-none opacity-90 transition-all duration-500"
                          style={getTextureOverlayStyle()}
                        />

                        {/* Dark/Light vignette for high-fashion depth */}
                        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/35 pointer-events-none" />
                      </>
                    )}
                    {realPhoto && (
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10 pointer-events-none" />
                    )}

                    {/* Technical details printed inside the textile block */}
                    <div className={`z-10 font-mono text-[9px] ${realPhoto || !isLightColor ? 'text-zinc-300' : 'text-zinc-800'} flex justify-between`}>
                      <span>MONT.ST // PROTOTYPE // v2.6</span>
                      <span>SARTORIAL SYSTEM</span>
                    </div>

                    {/* Big typography overlay in high-contrast — only for the CSS-simulated fallback */}
                    {!realPhoto && (
                      <div className="z-10 text-center my-auto select-none space-y-2">
                        <h2 className={`text-5xl sm:text-6xl font-sans font-black tracking-widest uppercase transition-all duration-300 ${isLightColor ? 'text-black' : 'text-white'}`}>
                          {product.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </h2>
                        <p className={`text-[10px] font-mono tracking-[0.3em] uppercase ${isLightColor ? 'text-zinc-700' : 'text-zinc-400'}`}>
                          {product.category}
                        </p>
                      </div>
                    )}
                    {realPhoto && <div className="z-10 my-auto" />}

                    {/* Live simulator technical readout overlay */}
                    <div className={`z-10 font-mono text-[9px] ${realPhoto || !isLightColor ? 'text-zinc-300' : 'text-zinc-800'} space-y-1 bg-ink/10 backdrop-blur-xs p-2.5 border border-white/5`}>
                      <div className="flex justify-between">
                        <span>COLOR ACTIVO:</span>
                        <span className="font-bold uppercase">{activeColorName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TEJIDO / TELA:</span>
                        <span className="font-bold uppercase text-accent">{activeFabricName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ESPECIFICACIÓN:</span>
                        <span className="font-bold">400 GSM COTTON BLEND</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Technical Description Tag */}
                  <div className="p-3 bg-paper-soft border border-line text-[9px] text-muted leading-relaxed">
                    <p className="uppercase text-[10px] text-ink mb-1 font-bold">FICHA TÉCNICA DEL TEJIDO:</p>
                    {activeFabricName === 'Waffle' && "Tejido alveolar tridimensional (nido de abeja) de alta densidad. Su relieve absorbe la luz reduciendo reflejos y proporciona un tacto abrigado con un peso y estructura inigualable."}
                    {activeFabricName === 'Waffer' && "Variante de waffle extra-grueso de alta ingeniería. Posee un gramaje superior de 420g para aislamiento térmico avanzado y siluetas hiper-estructuradas."}
                    {activeFabricName === 'Piqué' && "Tejido entrelazado de punto de arroz característico de alta gama. Máxima estabilidad dimensional, excelente resistencia a las arrugas y un acabado sutilmente granulado."}
                    {activeFabricName === 'Jersey' && "Punto liso clásico ultra suave de algodón peinado. Tejido ligero y fluido de 240g de tacto fresco ideal para uso diario bajo cualquier silueta urbana."}
                    {(activeFabricName === 'Clásica' || activeFabricName === 'Clásico') && "Algodón plano de alta torsión y acabado pulido. Ofrece un look liso, sobrio y uniforme con costuras reforzadas que mantienen la caída rígida del boxy-fit."}
                    {activeFabricName === 'Neru' && "Tejido orgánico de hilos rústicos cruzados que asemeja textura de lino grueso. Extraordinaria ventilación y un look arrugado natural muy de vanguardia."}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Right Side: Product configuration */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Category and Favorite status */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted">
                  {product.category}
                </span>
                <button
                  id={`favorite-detail-${product.id}`}
                  onClick={() => onToggleFavorite(product)}
                  className={`flex items-center space-x-1.5 text-xs transition-colors ${
                    isFavorite ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'FAVORITO' : 'AGREGAR A FAVORITOS'}</span>
                </button>
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight leading-tight">
                  {product.name}
                </h2>
                <div className="flex items-baseline space-x-3 mt-2">
                  <span className="font-mono text-xl sm:text-2xl font-black text-ink">
                    S/. {product.price.toFixed(2)}
                  </span>
                  {product.oldPrice && (
                    <span className="font-mono text-base text-muted line-through">
                      S/. {product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 border-t border-line pt-4">
                <h4 className="text-[11px] uppercase tracking-widest text-muted font-bold">DESCRIPCIÓN</h4>
                <p className="text-muted text-xs sm:text-sm leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Fabric Characteristics */}
              <div className="space-y-2 bg-paper-soft p-4 border border-line">
                <h4 className="text-[10px] uppercase tracking-[0.15em] text-muted font-bold">DETALLES DE CONFECCIÓN</h4>
                <p className="text-muted text-xs font-light leading-relaxed">
                  {product.fabricDetails}
                </p>
              </div>

              {/* Color Configuration */}
              <div className="space-y-2">
                <h4 className="text-[11px] uppercase tracking-widest text-muted font-bold">
                  COLOR DISPONIBLE: <span className="text-ink font-semibold uppercase">{selectedColor || 'Sin seleccionar'}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isColSelected = selectedColor === color;
                    return (
                      <button
                        id={`detail-color-option-${color.toLowerCase().replace(/\s+/g, '-')}`}
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`text-xs py-2 px-4 border transition-all ${
                          isColSelected
                            ? 'bg-ink text-paper-soft font-bold border-ink'
                            : 'bg-paper-soft text-muted hover:border-accent border-line'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Configuration & Size Guide */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] uppercase tracking-widest text-muted font-bold">
                    TALLA: <span className="text-ink font-semibold">{selectedSize || 'Sin seleccionar'}</span>
                  </h4>
                  <button
                    id="size-guide-toggle-btn"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="flex items-center text-[10px] text-muted hover:text-accent tracking-wider hover:underline"
                  >
                    <HelpCircle className="w-3.5 h-3.5 mr-1" />
                    GUÍA DE TALLAS
                  </button>
                </div>

                {/* Size guide measurement chart */}
                {showSizeGuide && (
                  <div className="bg-panel p-3.5 border border-line font-mono text-[10px] space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                    <p className="font-bold text-ink border-b border-line pb-1 mb-1">MEDIDAS ESTIMADAS DE STREETWEAR (Corte Holgado):</p>
                    {getSizeGuideDetails().map((row) => (
                      <div key={row.size} className="flex justify-between">
                        <span className="font-bold">{row.size}</span>
                        <span>{row.details}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSizeSelected = selectedSize === size;
                    return (
                      <button
                        id={`detail-size-option-${size.toLowerCase()}`}
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs font-mono w-12 h-12 flex items-center justify-center border transition-all ${
                          isSizeSelected
                            ? 'bg-ink text-paper-soft font-bold border-ink'
                            : 'bg-paper-soft text-muted hover:border-accent border-line'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fabric Configuration */}
              {product.fabrics && product.fabrics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] uppercase tracking-widest text-muted font-bold">
                    TELA DISPONIBLE (TEJIDO): <span className="text-ink font-semibold uppercase">{selectedFabric || 'Sin seleccionar'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.fabrics.map((fab) => {
                      const isFabSelected = selectedFabric === fab;
                      return (
                        <button
                          id={`detail-fabric-option-${fab.toLowerCase()}`}
                          key={fab}
                          onClick={() => setSelectedFabric(fab)}
                          className={`text-xs py-2 px-4 border transition-all ${
                            isFabSelected
                              ? 'bg-ink text-paper-soft font-bold border-ink'
                              : 'bg-paper-soft text-muted hover:border-accent border-line'
                          }`}
                        >
                          {fab}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sleeve Configuration */}
              {product.sleeves && product.sleeves.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] uppercase tracking-widest text-muted font-bold">
                    VARIANTE DE MANGA: <span className="text-ink font-semibold uppercase">{selectedSleeve || 'Sin seleccionar'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sleeves.map((slv) => {
                      const isSlvSelected = selectedSleeve === slv;
                      return (
                        <button
                          id={`detail-sleeve-option-${slv.toLowerCase().replace(/\s+/g, '-')}`}
                          key={slv}
                          onClick={() => setSelectedSleeve(slv)}
                          className={`text-xs py-2 px-4 border transition-all ${
                            isSlvSelected
                              ? 'bg-ink text-paper-soft font-bold border-ink'
                              : 'bg-paper-soft text-muted hover:border-accent border-line'
                          }`}
                        >
                          {slv}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock Status & Quantity selector */}
              <div className="flex items-center justify-between border-t border-line pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-muted">DISPONIBILIDAD</span>
                  {product.tags.includes('Próximamente') ? (
                    <span className="text-xs font-bold text-accent mt-0.5">
                      Próximo lanzamiento — confecciones en proceso
                    </span>
                  ) : product.stock <= 4 && product.stock > 0 ? (
                    <span className="text-xs font-bold text-red-500 animate-pulse flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      STOCK LIMITADO ({product.stock} disponibles)
                    </span>
                  ) : (
                    <span className={`text-xs font-bold mt-0.5 ${product.stock > 0 ? 'text-muted' : 'text-red-500'}`}>
                      {product.stock > 0 ? `En Stock (${product.stock} disponibles)` : 'Agotado'}
                    </span>
                  )}
                </div>

                {product.stock > 0 && (
                  <div className="flex items-center space-x-1 border border-line">
                    <button
                      id="qty-decrement"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 font-mono text-sm font-semibold text-muted hover:text-ink hover:bg-panel"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-bold text-ink">{quantity}</span>
                    <button
                      id="qty-increment"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1.5 font-mono text-sm font-semibold text-muted hover:text-ink hover:bg-panel"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications and Alerts */}
              {validationError && (
                <div id="validation-error-alert" className="bg-panel text-ink border border-line p-3.5 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              {successMessage && (
                <div id="success-notification-alert" className="bg-ink text-paper-soft p-3.5 text-xs text-center uppercase tracking-widest">
                  {successMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-ink text-paper-soft hover:bg-accent font-sans font-black text-xs tracking-[0.15em] uppercase py-4 px-6 flex items-center justify-center gap-2 disabled:bg-panel disabled:text-muted disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  AGREGAR AL CARRITO
                </button>
                <button
                  id="modal-buy-wa-btn"
                  onClick={handleBuyOnWhatsApp}
                  disabled={product.stock === 0}
                  className="w-full bg-paper-soft text-ink border-2 border-accent hover:bg-panel font-sans font-bold text-xs tracking-[0.15em] uppercase py-4 px-6 flex items-center justify-center gap-2 disabled:border-line disabled:text-muted"
                >
                  <Send className="w-4 h-4" />
                  COMPRAR DIRECTO WA
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="p-6 sm:p-8 bg-paper-soft border-t border-line">
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted font-bold mb-6">
              RECOMENDADOS DE LA LÍNEA
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((p) => (
                <div
                  id={`related-prod-${p.id}`}
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="bg-paper border border-line/60 p-3 flex flex-col justify-between cursor-pointer group transition-all hover:border-accent"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-panel mb-3 relative border border-line/50">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover grayscale opacity-95 group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-103" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <span className="text-[9px] text-muted uppercase tracking-wider">{p.category}</span>
                    <h4 className="font-sans font-bold text-xs text-ink group-hover:text-accent transition-colors uppercase leading-tight mt-0.5">
                      {p.name}
                    </h4>
                    <p className="font-mono text-xs font-black text-ink mt-2">
                      S/. {p.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
