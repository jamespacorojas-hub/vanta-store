import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Send, AlertCircle, ShoppingBag, Truck, MapPin, MessageSquare } from 'lucide-react';
import { CartItem, OrderDetails } from '../../types';
import PaymentInstructions from './PaymentInstructions';
import { getGarmentPhoto } from '../../utils/productImages';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const LIMA_DISTRICTS = [
  'Miraflores',
  'San Isidro',
  'Santiago de Surco',
  'San Borja',
  'La Molina',
  'Barranco',
  'Magdalena del Mar',
  'Jesús María',
  'Lince',
  'Pueblo Libre',
  'San Miguel',
  'Surquillo',
  'Chorrillos',
  'Cercado de Lima',
  'Los Olivos',
  'San Martín de Porres',
  'Ate Vitarte',
  'Otro Distrito (Lima)',
];

const PAYMENT_METHODS = [
  'Agora Pay (Celular / QR / Transferencias otros bancos)',
  'Oh! Pay / Tarjeta Oh! (Celular / Cuenta / QR / Transferencias otros bancos)',
  'Pago Contra Entrega (Sujeto a cobertura - Solo Lima)',
];

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [shippingType, setShippingType] = useState<'lima' | 'provincia' | 'chat'>('lima');
  const [district, setDistrict] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setFormError('El carrito está vacío.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Por favor, ingresa tu nombre completo.');
      return;
    }
    if (shippingType === 'lima' && !district) {
      setFormError('Por favor, selecciona tu distrito de entrega en Lima.');
      return;
    }
    if (shippingType === 'provincia' && !customCity.trim()) {
      setFormError('Por favor, ingresa tu ciudad o provincia de destino.');
      return;
    }
    if (!paymentMethod) {
      setFormError('Por favor, selecciona un método de pago preferido.');
      return;
    }

    setFormError('');

    let shippingTypeLabel = 'Lima Metropolitana (Motorizado Express)';
    let shippingDest = district;
    let shippingAddr = deliveryAddress.trim() || 'Coordinar dirección por WhatsApp';

    if (shippingType === 'provincia') {
      shippingTypeLabel = 'Envío a Provincia (Shalom / Olva Courier)';
      shippingDest = customCity.trim();
      shippingAddr = deliveryAddress.trim() || 'Coordinar agencia o dirección por WhatsApp';
    } else if (shippingType === 'chat') {
      shippingTypeLabel = 'Coordinar Envío y Dirección por Chat';
      shippingDest = 'Por coordinar en el chat de WhatsApp';
      shippingAddr = 'Por coordinar en el chat de WhatsApp';
    }

    // Generate formatted message string
    let orderText = `Hola, MONT STORE. Quiero realizar el siguiente pedido:\n\n`;

    cartItems.forEach((item, index) => {
      orderText += `${index + 1}. Producto: ${item.product.name}\n`;
      orderText += `   Color: ${item.selectedColor}\n`;
      orderText += `   Talla: ${item.selectedSize}\n`;
      if (item.selectedFabric) {
        orderText += `   Tela: ${item.selectedFabric}\n`;
      }
      if (item.selectedSleeve) {
        orderText += `   Manga: ${item.selectedSleeve}\n`;
      }
      orderText += `   Cantidad: ${item.quantity}\n`;
      orderText += `   Precio: S/ ${(item.product.price).toFixed(2)}\n\n`;
    });

    orderText += `Subtotal: S/ ${subtotal.toFixed(2)}\n`;
    orderText += `Costo de envío: Por confirmar\n`;
    orderText += `Total de productos: ${totalQuantity}\n\n`;
    orderText += `Nombre del cliente: ${customerName.trim()}\n`;
    orderText += `Tipo de envío: ${shippingTypeLabel}\n`;
    orderText += `Destino / Ciudad: ${shippingDest}\n`;
    orderText += `Dirección / Referencia: ${shippingAddr}\n`;
    orderText += `Método de pago: ${paymentMethod}\n\n`;
    orderText += `Quedo atento a la confirmación de disponibilidad. Gracias.`;

    const officialWhatsAppNumber = '51904536406'; // official number representation
    const whatsappUrl = `https://wa.me/${officialWhatsAppNumber}?text=${encodeURIComponent(orderText)}`;
    
    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        id="cart-drawer-container"
        className="w-full max-w-md bg-paper h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between bg-paper-soft">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-ink" />
            <span className="text-xs uppercase tracking-widest font-black text-ink">
              CARRITO ({totalQuantity})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {cartItems.length > 0 && (
              <button
                id="clear-all-cart-btn"
                onClick={onClearCart}
                className="text-[10px] tracking-widest text-muted hover:text-red-500 hover:underline py-1 px-2 uppercase transition-all"
              >
                VACIAR
              </button>
            )}
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 hover:bg-panel text-ink transition-all"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div id="empty-cart-state" className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
              <div className="w-16 h-16 rounded-full bg-paper-soft flex items-center justify-center border border-line">
                <ShoppingBag className="w-6 h-6 text-muted" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-ink">CARRITO VACÍO</p>
                <p className="text-muted text-xs mt-1.5 font-light">
                  Añade prendas de la colección para iniciar tu pedido.
                </p>
              </div>
              <button
                id="empty-cart-back-to-shop"
                onClick={onClose}
                className="bg-ink text-paper-soft px-6 py-2.5 text-xs tracking-wider uppercase hover:bg-accent"
              >
                VOLVER A LA TIENDA
              </button>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div className="space-y-4 border-b border-line pb-6">
                {cartItems.map((item) => {
                  const fabric = item.selectedFabric || item.product.fabrics[0] || '';
                  const color = item.selectedColor || item.product.colors[0] || '';
                  const photo = getGarmentPhoto(item.product.id, fabric, color) || item.product.images?.[0];

                  return (
                    <div
                      id={`cart-item-${item.id}`}
                      key={item.id}
                      className="flex space-x-3.5 bg-paper-soft border border-line p-2.5 relative group"
                    >
                      {/* Item Image */}
                      <div className="w-16 aspect-[3/4] bg-panel shrink-0 select-none border border-line overflow-hidden relative flex flex-col justify-between p-1.5 text-ink">
                        {photo ? (
                          <img
                            src={photo}
                            alt={item.product.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <span className="text-[6px] font-mono text-muted uppercase tracking-widest relative z-0">COD-{item.product.id.substring(0, 3).toUpperCase()}</span>
                        <div className="text-[11px] font-black tracking-wider text-center my-auto relative z-0">
                          {item.product.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="text-[5px] font-mono text-muted text-center uppercase relative z-0">{item.selectedFabric || item.product.fabrics[0]}</span>
                      </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between font-sans">
                      <div>
                        <h4 className="font-bold text-xs uppercase text-ink leading-tight pr-5">
                          {item.product.name}
                        </h4>
                        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-muted font-mono mt-1">
                          <span>COL: <b className="text-ink">{item.selectedColor}</b></span>
                          <span>|</span>
                          <span>TAL: <b className="text-ink">{item.selectedSize}</b></span>
                          {item.selectedFabric && (
                            <>
                              <span>|</span>
                              <span>TELA: <b className="text-ink uppercase">{item.selectedFabric}</b></span>
                            </>
                          )}
                          {item.selectedSleeve && (
                            <>
                              <span>|</span>
                              <span>MNG: <b className="text-ink uppercase">{item.selectedSleeve}</b></span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Incrementor */}
                        <div className="flex items-center border border-line">
                          <button
                            id={`cart-qty-dec-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2.5 py-0.5 text-muted hover:text-ink hover:bg-paper font-mono"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono text-ink font-semibold">{item.quantity}</span>
                          <button
                            id={`cart-qty-inc-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                            className="px-2.5 py-0.5 text-muted hover:text-ink hover:bg-paper font-mono"
                          >
                            +
                          </button>
                        </div>

                        {/* Price tag */}
                        <span className="font-mono text-xs font-black text-ink">
                          S/. {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      id={`cart-remove-${item.id}`}
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-2.5 right-2.5 text-muted hover:text-ink transition-colors"
                      aria-label="Eliminar artículo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  )
                })}
              </div>

              {/* Order form fields */}
              <form id="checkout-whatsapp-form" onSubmit={handleCheckout} className="space-y-4">
                <div className="border-b border-line pb-3 mb-2">
                  <h3 className="text-xs uppercase tracking-widest font-black text-ink">
                    DATOS DE ENVÍO Y CONFIRMACIÓN
                  </h3>
                  <p className="text-[10px] text-muted mt-1">
                    Completa la información antes de enviar el pedido a WhatsApp.
                  </p>
                </div>

                {/* Customer name */}
                <div className="space-y-1">
                  <label htmlFor="customer-name-input" className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                    Nombre Completo *
                  </label>
                  <input
                    id="customer-name-input"
                    type="text"
                    required
                    placeholder="Ej. James Rojas"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs p-3 border border-line rounded-none bg-paper-soft focus:outline-none focus:border-accent font-sans"
                  />
                </div>

                {/* Tipo de Envío */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                    Tipo de Envío / Destino *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-panel border border-line">
                    <button
                      type="button"
                      id="shipping-type-lima-btn"
                      onClick={() => setShippingType('lima')}
                      className={`py-2 px-1 text-[9px] font-mono uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 border cursor-pointer ${
                        shippingType === 'lima'
                          ? 'bg-ink text-paper-soft border-ink font-bold shadow-xs'
                          : 'bg-transparent text-muted border-transparent hover:text-ink hover:bg-paper/50'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Lima</span>
                    </button>

                    <button
                      type="button"
                      id="shipping-type-provincia-btn"
                      onClick={() => setShippingType('provincia')}
                      className={`py-2 px-1 text-[9px] font-mono uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 border cursor-pointer ${
                        shippingType === 'provincia'
                          ? 'bg-ink text-paper-soft border-ink font-bold shadow-xs'
                          : 'bg-transparent text-muted border-transparent hover:text-ink hover:bg-paper/50'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Provincia</span>
                    </button>

                    <button
                      type="button"
                      id="shipping-type-chat-btn"
                      onClick={() => setShippingType('chat')}
                      className={`py-2 px-1 text-[9px] font-mono uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 border cursor-pointer ${
                        shippingType === 'chat'
                          ? 'bg-accent text-paper-soft border-accent font-bold shadow-xs'
                          : 'bg-transparent text-muted border-transparent hover:text-ink hover:bg-paper/50'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Por Chat</span>
                    </button>
                  </div>
                </div>

                {/* Conditional Destination Inputs */}
                {shippingType === 'lima' && (
                  <>
                    <div className="space-y-1">
                      <label htmlFor="district-select" className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        Distrito de Lima *
                      </label>
                      <select
                        id="district-select"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full text-xs p-3 border border-line rounded-none bg-paper-soft focus:outline-none focus:border-accent font-sans"
                      >
                        <option value="">-- Seleccionar Distrito --</option>
                        {LIMA_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="delivery-address-input" className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        Dirección de Entrega <span className="text-muted/60 font-normal">(Opcional: o coordinar por chat)</span>
                      </label>
                      <input
                        id="delivery-address-input"
                        type="text"
                        placeholder="Ej. Av. Javier Prado 1240, Dpto 402"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full text-xs p-3 border border-line rounded-none bg-paper-soft focus:outline-none focus:border-accent font-sans"
                      />
                    </div>
                  </>
                )}

                {shippingType === 'provincia' && (
                  <>
                    <div className="space-y-1">
                      <label htmlFor="custom-city-input" className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        Ciudad / Provincia de Destino *
                      </label>
                      <input
                        id="custom-city-input"
                        type="text"
                        required
                        placeholder="Ej. Arequipa / Trujillo / Cusco / Chiclayo"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        className="w-full text-xs p-3 border border-line rounded-none bg-paper-soft focus:outline-none focus:border-accent font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="delivery-address-input-provincia" className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                        Agencia (Shalom / Olva) o Dirección <span className="text-muted/60 font-normal">(Opcional)</span>
                      </label>
                      <input
                        id="delivery-address-input-provincia"
                        type="text"
                        placeholder="Ej. Shalom Agencia Central / Olva Domicilio"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full text-xs p-3 border border-line rounded-none bg-paper-soft focus:outline-none focus:border-accent font-sans"
                      />
                    </div>
                  </>
                )}

                {shippingType === 'chat' && (
                  <div className="p-3 border border-accent/30 bg-accent-soft text-accent text-[10px] font-sans font-medium flex items-center space-x-2 leading-relaxed">
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>Coordinaremos tu dirección exacta, ciudad o agencia preferida directamente por WhatsApp.</span>
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-1">
                  <label htmlFor="payment-method-select" className="block text-[10px] uppercase tracking-wider text-muted font-semibold">
                    Método de Pago Preferido *
                  </label>
                  <select
                    id="payment-method-select"
                    required
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full text-xs p-3 border border-line rounded-none bg-paper-soft focus:outline-none focus:border-accent font-sans"
                  >
                    <option value="">-- Seleccionar Método --</option>
                    {PAYMENT_METHODS.map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Interactive QR and Cellular transfer instructions for Agora / Oh! */}
                {(() => {
                  if (paymentMethod.toLowerCase().includes('agora')) {
                    return <PaymentInstructions method="agora" />;
                  } else if (paymentMethod.toLowerCase().includes('oh!')) {
                    return <PaymentInstructions method="oh" />;
                  }
                  return null;
                })()}

                {formError && (
                  <div id="cart-form-error" className="bg-paper-soft border border-red-200 text-red-600 p-3 text-xs flex items-center space-x-1.5 font-sans font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {/* Footer sticky block */}
        {cartItems.length > 0 && (
          <div className="border-t border-line p-4 sm:p-6 bg-paper-soft space-y-4">
            <div className="space-y-1.5 font-sans">
              <div className="flex justify-between text-xs text-muted">
                <span>Costo de Envío:</span>
                <span className="uppercase tracking-wider font-semibold text-ink">POR CONFIRMAR</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-xs uppercase tracking-widest font-black text-ink">SUBTOTAL ESTIMADO</span>
                <span className="font-mono text-lg font-black text-ink">S/. {subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="finalize-order-wa-btn"
              type="submit"
              onClick={handleCheckout}
              className="w-full bg-ink text-paper-soft hover:bg-accent text-xs font-sans font-black uppercase tracking-[0.2em] py-4 flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              FINALIZAR PEDIDO POR WHATSAPP
            </button>
            <p className="text-[10px] text-muted text-center">
              Al finalizar, se abrirá WhatsApp con el pedido listo para enviar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
