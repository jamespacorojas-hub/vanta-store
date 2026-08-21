import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, Heart, Shield, Percent, Truck, Gift, Eye, Clock, AlertTriangle, Check, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { Product, CartItem } from '../../types';
import { PRODUCTS } from '../../data';
import { getProductImageByColor } from '../../utils/productImages';

interface NuevosIngresosPremiumProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number, size: string, color: string, fabric?: string, sleeve?: string) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: Product[];
  onQuickView: (product: Product) => void;
}

export default function NuevosIngresosPremium({
  products,
  onAddToCart,
  onToggleFavorite,
  favorites,
  onQuickView,
}: NuevosIngresosPremiumProps) {
  // Filter active fabrics inside the new arrivals
  const [selectedFabricFilter, setSelectedFabricFilter] = useState<string>('Todos');
  
  // Custom states for the "Mixturas" Outfit Combiner
  const [mixProduct1, setMixProduct1] = useState<Product>(products[0] || PRODUCTS[0]);
  const [mixProduct2, setMixProduct2] = useState<Product>(products[3] || products[1] || PRODUCTS[2]);
  
  const [mixSize1, setMixSize1] = useState<string>('M');
  const [mixColor1, setMixColor1] = useState<string>('Negro');
  const [mixFabric1, setMixFabric1] = useState<string>('Waffle');
  
  const [mixSize2, setMixSize2] = useState<string>('L');
  const [mixColor2, setMixColor2] = useState<string>('Cemento');
  const [mixFabric2, setMixFabric2] = useState<string>('Jersey');

  // Real-time viewer count simulation
  const [viewers, setViewers] = useState<number>(54);
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => {
        const diff = Math.floor(Math.random() * 9) - 4;
        const next = prev + diff;
        return next < 30 ? 30 : next > 95 ? 95 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Countdown to the next capsule drop
  const [timeLeft, setTimeLeft] = useState({ horas: 14, minutos: 42, segundos: 19 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.segundos > 0) {
          return { ...prev, segundos: prev.segundos - 1 };
        } else if (prev.minutos > 0) {
          return { ...prev, minutos: prev.minutos - 1, segundos: 59 };
        } else if (prev.horas > 0) {
          return { horas: prev.horas - 1, minutos: 59, segundos: 59 };
        } else {
          return { horas: 24, minutos: 0, segundos: 0 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Active Promo Coupon States
  const [couponCopied, setCouponCopied] = useState(false);
  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('NUEVO15');
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  };

  // Filter products based on selected fabric
  const filteredNewProducts = products.filter((p) => {
    if (selectedFabricFilter === 'Todos') return true;
    return p.fabrics.includes(selectedFabricFilter);
  });

  // Calculate prices for the Mix Combination (Both items combined with a 15% discount)
  const originalTotal = mixProduct1.price + mixProduct2.price;
  const discountRate = 0.15;
  const bundlePrice = Math.round(originalTotal * (1 - discountRate) * 10) / 10;

  const handleAddMixToCart = () => {
    // Add both products with selected specs to cart
    onAddToCart(mixProduct1, 1, mixSize1, mixColor1, mixFabric1);
    onAddToCart(mixProduct2, 1, mixSize2, mixColor2, mixFabric2);
    
    // Push simulated global event or scroll to cart trigger
    const toastEvent = new CustomEvent('show-toast', {
      detail: `Mixtura agregada: ${mixProduct1.name} + ${mixProduct2.name} con 15% de descuento.`
    });
    window.dispatchEvent(toastEvent);
  };

  return (
    <div className="space-y-12 w-full" id="nuevos-ingresos-premium-block">
      
      {/* 1. Dynamic Streetwear Live Info & Announcement Bar */}
      <div className="bg-accent text-paper-soft px-4 py-2 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono tracking-widest uppercase font-bold gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-paper-soft rounded-full animate-ping" />
          <span>ALERTA DE SEGURIDAD: COMPRA RESPALDADA CON OH! PAY / AGORA PAY</span>
        </div>
        <div className="flex items-center gap-6">
          <span>👥 {viewers} CLIENTES COMPRANDO EL DROP EN ESTE INSTANTE</span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            SIGUIENTE REABASTECIMIENTO EN: {timeLeft.horas}h {timeLeft.minutos}m {timeLeft.segundos}s
          </span>
        </div>
      </div>

      {/* 2. Interactive Promotions Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Promotion card 1: Coupon Code */}
        <div className="bg-paper-soft border border-line p-5 flex flex-col justify-between hover:border-accent transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-sans tracking-widest text-muted uppercase">PROMO EXPANSIVA</span>
            <Percent className="w-4 h-4 text-ink" />
          </div>
          <div className="space-y-1.5 my-3">
            <h4 className="font-sans font-black text-sm tracking-wider text-ink uppercase">15% DE DESCUENTO DIRECTO</h4>
            <p className="text-[10px] font-sans font-light text-muted leading-relaxed">
              Usa el código del drop en el checkout para ahorrar 15% en cualquier combinación de nuevos ingresos.
            </p>
          </div>
          <button
            onClick={handleCopyCoupon}
            className={`w-full py-2.5 px-3 text-[9px] font-mono tracking-widest uppercase font-bold transition-all border flex items-center justify-between ${
              couponCopied
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-ink text-paper-soft border-ink hover:bg-accent'
            }`}
          >
            <span>{couponCopied ? 'CUPÓN COPIADO ✓' : 'COPIAR CÓDIGO: NUEVO15'}</span>
            <span className="text-[8px] opacity-75">{couponCopied ? 'LISTO' : 'COPY'}</span>
          </button>
        </div>

        {/* Promotion card 2: Delivery status */}
        <div className="bg-paper-soft border border-line p-5 flex flex-col justify-between hover:border-accent transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-sans tracking-widest text-muted uppercase">COBERTURA MOTORIZADA</span>
            <Truck className="w-4 h-4 text-ink" />
          </div>
          <div className="space-y-1.5 my-3">
            <h4 className="font-sans font-black text-sm tracking-wider text-ink uppercase">ENVÍO DE CARGO EXPRESS S/. 0</h4>
            <p className="text-[10px] font-sans font-light text-muted leading-relaxed">
              Entrega prioritaria de 24 horas en Lima Metropolitana sin costo para cualquier orden con artículos de este drop.
            </p>
          </div>
          <div className="text-[9px] font-sans text-muted border-t border-line/60 pt-2.5 flex justify-between">
            <span>ENTREGA SÓLIDA // LIMA</span>
            <span className="text-ink font-bold">AUTOMÁTICO</span>
          </div>
        </div>

        {/* Promotion card 3: Free gift tier */}
        <div className="bg-paper-soft border border-line p-5 flex flex-col justify-between hover:border-accent transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-sans tracking-widest text-muted uppercase">TOTE DE REGALO</span>
            <Gift className="w-4 h-4 text-accent" />
          </div>
          <div className="space-y-1.5 my-3">
            <h4 className="font-sans font-black text-sm tracking-wider text-ink uppercase">LONA MORRAL GRATUITO</h4>
            <p className="text-[10px] font-sans font-light text-muted leading-relaxed">
              Por compras superiores a S/. 160 te obsequiamos un bolso utilitario VANTA de lona cruda resistente de 400g.
            </p>
          </div>
          <div className="text-[9px] font-sans text-muted border-t border-line/60 pt-2.5 flex justify-between">
            <span>HASTA AGOTAR STOCK</span>
            <span className="font-mono text-accent font-bold">94% COMPLETADO</span>
          </div>
        </div>
      </div>

      {/* 3. The Bespoke Interactive Outfit Combiner ("Mixturas") */}
      <div className="bg-panel text-ink border border-line p-6 md:p-8 relative overflow-hidden">
        {/* Banner header badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-line pb-4 mb-6 z-10 relative gap-3">
          <div>
            <span className="text-[8px] font-sans tracking-[0.3em] text-accent uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              SARTORIAL COMPILATOR // LABORAL DROP CO-01
            </span>
            <h3 className="font-display font-semibold text-xl md:text-2xl tracking-widest text-ink uppercase mt-1">
              EL REVOLUCIONARIO COMBINADOR DE MIXTURAS
            </h3>
          </div>
          <div className="bg-paper-soft border border-line px-3 py-1.5 font-sans text-[9px] text-muted flex items-center gap-2">
            <span className="font-bold text-accent">% MIX PROMO:</span>
            <span>Ahorra 15% inmediato</span>
          </div>
        </div>

        {/* Dynamic Interactive Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch z-10 relative">
          
          {/* Item 1 Select Column */}
          <div className="lg:col-span-4 bg-paper-soft border border-line p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-line pb-2">
                <span className="font-sans text-[10px] text-muted font-bold">PRENDA PRIMARIA (CÁPSULA)</span>
                <span className="font-mono text-[9px] text-ink font-bold">S/. {mixProduct1.price.toFixed(2)}</span>
              </div>

              {/* Product selector buttons */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans text-muted block uppercase">SELECCIONAR MODELO:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {products.slice(0, 2).map((prod) => (
                    <button
                      key={`mix1-${prod.id}`}
                      onClick={() => setMixProduct1(prod)}
                      className={`py-1.5 px-2 text-[9px] font-sans tracking-wider uppercase transition-all ${
                        mixProduct1.id === prod.id
                          ? 'bg-accent text-paper-soft font-black'
                          : 'bg-panel text-muted border border-line hover:text-ink'
                      }`}
                    >
                      {prod.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs parameters */}
              <div className="space-y-2 pt-2">
                <div>
                  <label className="text-[9px] font-sans text-muted block uppercase mb-1">TALLA DE LA PRENDA:</label>
                  <div className="flex space-x-1">
                    {mixProduct1.sizes.map((sz) => (
                      <button
                        key={`size1-${sz}`}
                        onClick={() => setMixSize1(sz)}
                        className={`w-7 h-7 text-[9px] font-mono uppercase font-bold flex items-center justify-center transition-all ${
                          mixSize1 === sz
                            ? 'bg-accent text-white font-black shadow-[0_0_8px_rgba(225,29,72,0.4)]'
                            : 'bg-panel text-muted border border-line hover:bg-paper'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-sans text-muted block uppercase mb-1">COLOR DE LA PRENDA:</label>
                  <select
                    value={mixColor1}
                    onChange={(e) => setMixColor1(e.target.value)}
                    className="w-full text-[9px] font-sans bg-paper border border-line p-1.5 text-ink focus:outline-none focus:border-accent"
                  >
                    {mixProduct1.colors.slice(0, 7).map((color) => (
                      <option key={`color1-${color}`} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-sans text-muted block uppercase mb-1">TELA / TEJIDO EXCLUSIVO:</label>
                  <div className="flex flex-wrap gap-1">
                    {mixProduct1.fabrics.map((fab) => (
                      <button
                        key={`fab1-${fab}`}
                        onClick={() => setMixFabric1(fab)}
                        className={`px-1.5 py-1 text-[8px] font-sans tracking-wider uppercase ${
                          mixFabric1 === fab
                            ? 'bg-accent-soft text-ink font-bold'
                            : 'bg-panel text-muted border border-line'
                        }`}
                      >
                        {fab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Micro image preview */}
            <div className="flex items-center gap-3 bg-panel p-2 border border-line">
              <img
                src={getProductImageByColor(mixProduct1, mixColor1, mixFabric1) || mixProduct1.images[0]}
                alt={`${mixProduct1.name} - ${mixColor1}`}
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-cover border border-line"
              />
              <div className="font-sans text-[8.5px] text-muted">
                <span className="block font-black text-ink uppercase">{mixProduct1.name} ({mixColor1})</span>
                <span>Configuración de corte boxy fit</span>
              </div>
            </div>
          </div>

          {/* Plus symbol middle block */}
          <div className="lg:col-span-1 flex flex-col justify-center items-center font-sans font-black text-2xl text-muted">
            <span>+</span>
          </div>

          {/* Item 2 Select Column */}
          <div className="lg:col-span-4 bg-paper-soft border border-line p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-line pb-2">
                <span className="font-sans text-[10px] text-muted font-bold">PRENDA COMPLEMENTARIA</span>
                <span className="font-mono text-[9px] text-ink font-bold">S/. {mixProduct2.price.toFixed(2)}</span>
              </div>

              {/* Product selector buttons */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-sans text-muted block uppercase">SELECCIONAR MODELO:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {products.slice(2, 4).map((prod) => (
                    <button
                      key={`mix2-${prod.id}`}
                      onClick={() => setMixProduct2(prod)}
                      className={`py-1.5 px-2 text-[9px] font-sans tracking-wider uppercase transition-all ${
                        mixProduct2.id === prod.id
                          ? 'bg-accent text-paper-soft font-black'
                          : 'bg-panel text-muted border border-line hover:text-ink'
                      }`}
                    >
                      {prod.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs parameters */}
              <div className="space-y-2 pt-2">
                <div>
                  <label className="text-[9px] font-sans text-muted block uppercase mb-1">TALLA DE LA PRENDA:</label>
                  <div className="flex space-x-1">
                    {mixProduct2.sizes.map((sz) => (
                      <button
                        key={`size2-${sz}`}
                        onClick={() => setMixSize2(sz)}
                        className={`w-7 h-7 text-[9px] font-mono uppercase font-bold flex items-center justify-center transition-all ${
                          mixSize2 === sz
                            ? 'bg-accent text-white font-black shadow-[0_0_8px_rgba(225,29,72,0.4)]'
                            : 'bg-panel text-muted border border-line hover:bg-paper'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-sans text-muted block uppercase mb-1">COLOR DE LA PRENDA:</label>
                  <select
                    value={mixColor2}
                    onChange={(e) => setMixColor2(e.target.value)}
                    className="w-full text-[9px] font-sans bg-paper border border-line p-1.5 text-ink focus:outline-none focus:border-accent"
                  >
                    {mixProduct2.colors.map((c) => (
                      <option key={`color2-${c}`} value={c}>{c.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-sans text-muted block uppercase mb-1">TELA / TEJIDO EXCLUSIVO:</label>
                  <div className="flex flex-wrap gap-1">
                    {mixProduct2.fabrics.map((fab) => (
                      <button
                        key={`fab2-${fab}`}
                        onClick={() => setMixFabric2(fab)}
                        className={`px-1.5 py-1 text-[8px] font-sans tracking-wider uppercase ${
                          mixFabric2 === fab
                            ? 'bg-accent-soft text-ink font-bold'
                            : 'bg-panel text-muted border border-line'
                        }`}
                      >
                        {fab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Micro image preview */}
            <div className="flex items-center gap-3 bg-panel p-2 border border-line">
              <img
                src={getProductImageByColor(mixProduct2, mixColor2, mixFabric2) || mixProduct2.images[0]}
                alt={`${mixProduct2.name} - ${mixColor2}`}
                referrerPolicy="no-referrer"
                className="w-10 h-10 object-cover border border-line"
              />
              <div className="font-sans text-[8.5px] text-muted">
                <span className="block font-black text-ink uppercase">{mixProduct2.name} ({mixColor2})</span>
                <span>Configuración de manga drop acoplada</span>
              </div>
            </div>
          </div>

          {/* Interactive Outfit Summary & Purchase Column */}
          <div className="lg:col-span-3 bg-paper-soft border border-accent/30 p-5 flex flex-col justify-between relative overflow-hidden">
            {/* Visual warning ticker */}
            <div className="absolute top-0 right-0 bg-accent text-paper-soft text-[7px] font-sans px-2 py-0.5 tracking-wider font-bold">
              COMBO PACK DISPONIBLE
            </div>

            <div className="space-y-4 pt-1">
              <span className="font-sans text-[8px] text-muted tracking-widest block uppercase">CÁLCULO DE MIXTURA</span>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-muted font-light">
                  <span>{mixProduct1.name}:</span>
                  <span className="font-mono font-normal">S/. {mixProduct1.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted font-light">
                  <span>{mixProduct2.name}:</span>
                  <span className="font-mono font-normal">S/. {mixProduct2.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-accent text-[10px] font-mono font-bold">
                  <span>DESCUENTO MIX 15%:</span>
                  <span>- S/. {(originalTotal * discountRate).toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-line pt-3.5 space-y-1">
                <span className="text-[8px] font-sans text-muted block uppercase">PRECIO TOTAL DE MIXTURA:</span>
                <span className="text-3xl font-mono font-black tracking-tight text-ink block">
                  S/. {bundlePrice.toFixed(2)}
                </span>
              </div>

              <div className="bg-panel p-2 border border-line rounded-none text-[8px] font-sans text-muted space-y-1">
                <div>• Recibe un tote bag gratis</div>
                <div>• Delivery Express prioridad máxima</div>
              </div>
            </div>

            <button
              onClick={handleAddMixToCart}
              className="w-full mt-6 bg-white text-black hover:bg-zinc-200 py-3.5 px-4 font-mono text-[10px] tracking-widest uppercase font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>COMPRAR MIXTURA</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4. Fine Curated Filter Bar for New arrivals */}
      <div className="border-y border-line py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[8px] font-sans tracking-widest text-muted uppercase block">FILTRAR POR TEXTURA REVOLUCIONARIA</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['Todos', 'Waffle', 'Jersey', 'Piqué', 'Waffer', 'Clásica', 'Clásico', 'Zyko'].map((weave) => {
              const isSelected = selectedFabricFilter === weave;
              return (
                <button
                  key={`filter-${weave}`}
                  onClick={() => setSelectedFabricFilter(weave)}
                  className={`py-1.5 px-3 text-[9px] font-sans tracking-widest uppercase border transition-all ${
                    isSelected
                      ? 'bg-accent text-paper-soft border-accent font-bold'
                      : 'bg-paper-soft text-muted border-line hover:border-accent hover:text-ink'
                  }`}
                >
                  {weave}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-[10px] font-mono text-muted uppercase text-right">
          MOSTRANDO <span className="text-ink font-black">{filteredNewProducts.length} DE {products.length}</span> ARTÍCULOS EXCLUSIVOS EN NUEVOS INGRESOS
        </div>
      </div>

      {/* 5. Highly Crafted Streetwear Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        {filteredNewProducts.map((p) => {
          const isLiked = favorites.some((f) => f.id === p.id);
          return (
            <motion.div
              layout
              key={p.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-paper-soft border border-line hover:border-accent transition-all duration-300 flex flex-col justify-between h-full relative"
            >
              {/* Hot tag overlay */}
              <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                <span className="bg-accent text-white text-[7px] sm:text-[7.5px] font-mono font-bold tracking-widest uppercase px-1.5 sm:px-2 py-0.5 shadow-[0_0_8px_rgba(225,29,72,0.4)]">
                  NUEVO
                </span>
                {p.oldPrice && (
                  <span className="bg-[#24060f] text-rose-300 border border-accent/50 text-[7px] sm:text-[7.5px] font-mono font-bold tracking-widest uppercase px-1.5 sm:px-2 py-0.5">
                    OFERTA
                  </span>
                )}
              </div>

              {/* Favorites action */}
              <button
                onClick={() => onToggleFavorite(p)}
                className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-muted hover:text-red-500 hover:scale-105 active:scale-90 transition-all cursor-pointer"
              >
                <Heart className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

              {/* Image zoom-on-hover box */}
              <div className="relative overflow-hidden aspect-[4/5] bg-[#121218] border-b border-line">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Micro tech details overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-sm p-2 text-zinc-200 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex justify-between items-center text-[7px] font-mono">
                  <span>FIBRA ANTIALÉRGICA S/S</span>
                  <span>PRE-CONFECCIONADO</span>
                </div>
              </div>

              {/* Details & Interactive Quick Adds */}
              <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-4">
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <h3 className="font-display font-semibold text-xs sm:text-sm text-ink group-hover:text-accent transition-colors truncate">
                      {p.name}
                    </h3>
                    <div className="flex items-center space-x-1.5">
                      {p.oldPrice && (
                        <span className="text-[9px] sm:text-xs text-muted line-through font-mono">
                          S/. {p.oldPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm text-ink font-bold font-mono">
                        S/. {p.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[9px] sm:text-[10px] font-sans font-light text-muted leading-relaxed line-clamp-1 sm:line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1 border-t border-line mt-1">
                    {p.fabrics.slice(0, 2).map((fabric) => (
                      <span key={fabric} className="text-[7px] sm:text-[7.5px] font-mono uppercase bg-[#14141c] text-muted border border-line px-1.5 py-0.5">
                        {fabric}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Grid Buttons */}
                <button
                  onClick={() => onQuickView(p)}
                  className="w-full bg-white text-black hover:bg-zinc-200 text-[8.5px] sm:text-[9.5px] font-mono tracking-wider uppercase font-bold py-2 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>VER PRENDA</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
