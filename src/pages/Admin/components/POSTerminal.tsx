import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  User,
  Phone,
  FileText,
  CreditCard,
  RotateCcw,
  Sparkles,
  Check,
  X,
  Tag,
  Percent,
  Building,
  Calculator,
  Edit3,
} from 'lucide-react';
import { Product } from '../../../types';
import { PRODUCTS } from '../../../data';
import { POSSaleItem, POSCustomer, ReceiptType, DestinationType, TaxMode, POSPaymentDetail, POSSale } from '../../../types/pos';
import { getNextReceiptNumber, savePOSSale, getActiveSeller } from '../../../utils/posStorage';
import { getGarmentPhoto } from '../../../utils/productImages';
import POSPaymentModal from './POSPaymentModal';
import POSTicketModal from './POSTicketModal';
import POSProformaModal from './POSProformaModal';

interface POSTerminalProps {
  onSaleCompleted?: (sale: POSSale) => void;
}

const CATEGORY_TABS = [
  'Todos',
  'Camisa',
  'Camisero',
  'Manga Larga',
  'Clásico',
  'Notch',
  'Polera',
];

export default function POSTerminal({ onSaleCompleted }: POSTerminalProps) {
  // Filters and search
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mobile / Tablet pane view ('catalog' vs 'register')
  const [mobilePane, setMobilePane] = useState<'catalog' | 'register'>('catalog');

  // Cart / Sale items
  const [cartItems, setCartItems] = useState<POSSaleItem[]>([]);
  const [destinationType, setDestinationType] = useState<DestinationType>('LIMA');
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [observations, setObservations] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [receiptType, setReceiptType] = useState<ReceiptType>('NOTA_VENTA');
  const [taxMode, setTaxMode] = useState<TaxMode>('NO_TAX');
  const [customTargetTotal, setCustomTargetTotal] = useState<string>('');

  // Customer details
  const [customer, setCustomer] = useState<POSCustomer>({
    name: 'Cliente Mostrador',
    businessName: '',
    documentType: 'NINGUNO',
    documentNumber: '',
    phone: '',
    address: '',
    fiscalAddress: '',
    district: '',
  });

  // Modal for configuring a product before adding (size, color, fabric, custom price)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variantColor, setVariantColor] = useState<string>('');
  const [variantSize, setVariantSize] = useState<string>('M');
  const [variantFabric, setVariantFabric] = useState<string>('Waffle');
  const [variantSleeve, setVariantSleeve] = useState<string>('Manga Corta');
  const [variantQuantity, setVariantQuantity] = useState<number>(1);
  const [variantPrice, setVariantPrice] = useState<number>(0);

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isProformaModalOpen, setIsProformaModalOpen] = useState(false);
  const [lastCompletedSale, setLastCompletedSale] = useState<POSSale | null>(null);

  // Next receipt number
  const nextReceiptNumber = useMemo(() => getNextReceiptNumber(receiptType), [receiptType, lastCompletedSale]);

  // Open modal when product is clicked
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setVariantColor(product.colors[0] || 'Negro');
    setVariantSize(product.sizes[0] || 'M');
    setVariantFabric(product.fabrics[0] || 'Waffle');
    setVariantSleeve(product.sleeves[0] || 'Manga Corta');
    setVariantQuantity(1);
    setVariantPrice(product.price);
  };

  // Add configured variant to sale items
  const handleAddVariantToCart = () => {
    if (!selectedProduct) return;

    const unitPrice = variantPrice > 0 ? variantPrice : selectedProduct.price;
    const itemId = `${selectedProduct.id}-${variantColor}-${variantSize}-${variantFabric}-${variantSleeve}-${unitPrice}`;
    const existingIndex = cartItems.findIndex((item) => item.id === itemId);

    const photo = getGarmentPhoto(selectedProduct.id, variantFabric, variantColor) || selectedProduct.images[0];

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += variantQuantity;
      updated[existingIndex].subtotal = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setCartItems(updated);
    } else {
      const newItem: POSSaleItem = {
        id: itemId,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        image: photo,
        category: selectedProduct.category,
        selectedColor: variantColor,
        selectedSize: variantSize,
        selectedFabric: variantFabric,
        selectedSleeve: variantSleeve,
        unitPrice: unitPrice,
        originalPrice: selectedProduct.oldPrice || unitPrice,
        quantity: variantQuantity,
        subtotal: unitPrice * variantQuantity,
      };
      setCartItems([...cartItems, newItem]);
    }

    setSelectedProduct(null);
  };

  // Set unit price for all items currently in cart (e.g. bulk discount / por mayor)
  const handleApplyGlobalItemPrice = (uniformPrice: number) => {
    if (uniformPrice <= 0) return;
    const updated = cartItems.map((item) => ({
      ...item,
      unitPrice: uniformPrice,
      subtotal: item.quantity * uniformPrice,
    }));
    setCartItems(updated);
    setDiscountAmount(0);
    setDiscountPercent(0);
  };

  // Adjust item quantity
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.unitPrice,
          };
        }
        return item;
      })
      .filter(Boolean) as POSSaleItem[];

    setCartItems(updated);
  };

  // Adjust item unit price directly on the fly
  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    const validPrice = Math.max(0, newPrice);
    const updated = cartItems.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          unitPrice: validPrice,
          subtotal: item.quantity * validPrice,
        };
      }
      return item;
    });
    setCartItems(updated);
  };

  // Remove item
  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((i) => i.id !== itemId));
  };

  // Clear ticket
  const handleClearTicket = () => {
    setCartItems([]);
    setDiscountAmount(0);
    setDiscountPercent(0);
    setCustomTargetTotal('');
  };

  // Change receipt type with smart customer defaults
  const handleReceiptTypeChange = (type: ReceiptType) => {
    setReceiptType(type);
    if (type === 'FACTURA') {
      setTaxMode('INCLUDED');
      setCustomer((prev) => ({
        ...prev,
        documentType: 'RUC',
        name: prev.name === 'Cliente Mostrador' ? '' : prev.name,
      }));
    } else if (type === 'BOLETA') {
      setTaxMode('INCLUDED');
      setCustomer((prev) => ({
        ...prev,
        documentType: prev.documentType === 'RUC' ? 'DNI' : prev.documentType || 'DNI',
      }));
    } else {
      setTaxMode('NO_TAX');
      setCustomer((prev) => ({
        ...prev,
        documentType: 'NINGUNO',
      }));
    }
  };

  // Calculations
  const rawSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartItems]);

  const computedDiscount = useMemo(() => {
    if (discountPercent > 0) {
      return (rawSubtotal * discountPercent) / 100;
    }
    return Math.min(rawSubtotal, discountAmount);
  }, [rawSubtotal, discountPercent, discountAmount]);

  const netItemsAmount = useMemo(() => {
    return Math.max(0, rawSubtotal - computedDiscount);
  }, [rawSubtotal, computedDiscount]);

  // Tax calculations
  const { baseAmount, taxAmount, taxPercent, totalAmount } = useMemo(() => {
    if (taxMode === 'PLUS_TAX') {
      const base = netItemsAmount;
      const tax = base * 0.18;
      const total = base + tax + shippingCost;
      return { baseAmount: base, taxAmount: tax, taxPercent: 18, totalAmount: total };
    }
    if (taxMode === 'INCLUDED') {
      const totalNet = netItemsAmount;
      const base = totalNet / 1.18;
      const tax = totalNet - base;
      const total = totalNet + shippingCost;
      return { baseAmount: base, taxAmount: tax, taxPercent: 18, totalAmount: total };
    }
    // NO_TAX
    const base = netItemsAmount;
    const total = base + shippingCost;
    return { baseAmount: base, taxAmount: 0, taxPercent: 0, totalAmount: total };
  }, [netItemsAmount, taxMode, shippingCost]);

  // Quick auto-squaring total tool (Cuadrar total exacto)
  const handleAutoSquareTotal = (target: number) => {
    if (isNaN(target) || target <= 0) return;
    const currentBaseTotal = rawSubtotal + shippingCost;
    const neededDiscount = Math.max(0, currentBaseTotal - target);
    setDiscountAmount(neededDiscount);
    setDiscountPercent(0);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = selectedCategory === 'Todos' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.colors.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.fabrics.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Confirm payment and create Sale
  const handleConfirmPayment = (payments: POSPaymentDetail[]) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newSale: POSSale = {
      id: 'sale-' + Date.now(),
      receiptNumber: nextReceiptNumber,
      receiptType: receiptType,
      destinationType: destinationType,
      createdAt: now.toISOString(),
      formattedDate,
      formattedTime,
      sellerName: getActiveSeller(),
      customer: { ...customer },
      items: [...cartItems],
      subtotalAmount: baseAmount,
      shippingCost: shippingCost,
      discountAmount: computedDiscount,
      taxMode: taxMode,
      taxAmount: taxAmount,
      taxPercent: taxPercent,
      totalAmount: totalAmount,
      payments: payments,
      status: 'COMPLETADA',
      observations: observations.trim() || undefined,
    };

    savePOSSale(newSale);
    setLastCompletedSale(newSale);
    setIsPaymentModalOpen(false);
    setIsTicketModalOpen(true);
    if (onSaleCompleted) onSaleCompleted(newSale);
  };

  const handleNewSale = () => {
    handleClearTicket();
    setShippingCost(0);
    setObservations('');
    setDestinationType('LIMA');
    setTaxMode('NO_TAX');
    setIsTicketModalOpen(false);
    setCustomer({
      name: 'Cliente Mostrador',
      businessName: '',
      documentType: 'NINGUNO',
      documentNumber: '',
      phone: '',
      address: '',
      fiscalAddress: '',
      district: '',
    });
  };

  // Keyboard shortcut: F4 opens payment modal if items in cart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F4' && cartItems.length > 0 && !isPaymentModalOpen && !isTicketModalOpen && !selectedProduct) {
        e.preventDefault();
        setIsPaymentModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems, isPaymentModalOpen, isTicketModalOpen, selectedProduct]);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden bg-paper text-ink relative">
      {/* Mobile/Tablet Pane Switcher (< lg screens) */}
      <div className="lg:hidden flex bg-[#101018] border-b border-line p-1.5 shrink-0 gap-1.5 z-20">
        <button
          type="button"
          onClick={() => setMobilePane('catalog')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
            mobilePane === 'catalog'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-panel text-muted hover:text-ink border border-line'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Prendas ({filteredProducts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setMobilePane('register')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer relative ${
            mobilePane === 'register'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-panel text-muted hover:text-ink border border-line'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Ticket ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
          {cartItems.length > 0 && (
            <span className="bg-white text-rose-600 px-1.5 py-0.2 rounded-full text-[9.5px] font-black">
              S/ {totalAmount.toFixed(0)}
            </span>
          )}
        </button>
      </div>

      {/* LEFT COLUMN: Catalog and Search */}
      <div
        className={`flex-1 flex-col h-full border-r border-line overflow-hidden ${
          mobilePane === 'catalog' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        {/* Top Filter and Search Bar */}
        <div className="p-3 sm:p-4 bg-paper-soft border-b border-line space-y-3 shrink-0">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar prenda por nombre, tela, color... (ej. Camisa, Waffle, Negro)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-panel border border-line text-xs font-mono py-2 pl-9 pr-8 text-ink focus:outline-none focus:border-accent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-accent text-white border-accent font-bold shadow-xs'
                    : 'bg-panel text-muted hover:text-ink border-line hover:border-muted/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-3 content-start">
          {filteredProducts.map((product) => {
            const defaultPhoto = product.images[0] || '';
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectProduct(product)}
                className="bg-panel border border-line hover:border-accent/70 transition-all text-left p-2.5 flex flex-col justify-between group cursor-pointer hover:shadow-md relative overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-paper-soft overflow-hidden mb-2">
                  <img
                    src={defaultPhoto}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 right-1.5 bg-paper/90 border border-line text-[9px] font-mono font-bold px-1.5 py-0.5 text-accent">
                    Stock: {product.stock}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <span className="text-[9px] font-mono text-muted uppercase tracking-wider block">
                    {product.category}
                  </span>
                  <h3 className="font-mono text-xs font-bold text-ink uppercase truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-line/60">
                    <span className="font-mono text-xs font-bold text-accent">
                      S/ {product.price.toFixed(2)}
                    </span>
                    <span className="text-[9px] font-mono bg-paper px-1.5 py-0.5 border border-line text-muted uppercase">
                      {product.colors.length} col.
                    </span>
                  </div>
                </div>
              </button>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 text-center text-muted font-mono text-xs">
              No se encontraron prendas con los criterios de búsqueda.
            </div>
          )}
        </div>

        {/* Floating Mobile Cart Bar when in catalog view and cart has items */}
        {cartItems.length > 0 && (
          <div className="lg:hidden p-2.5 bg-paper-soft/95 backdrop-blur-md border-t border-line shrink-0">
            <button
              type="button"
              onClick={() => setMobilePane('register')}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase py-2.5 px-4 flex items-center justify-between shadow-lg shadow-rose-950/40 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="bg-white text-rose-600 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
                <span>Ver Nota de Venta</span>
              </div>
              <span className="text-sm font-black">S/ {totalAmount.toFixed(2)} →</span>
            </button>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: POS Active Cart / Ticket Register */}
      <div
        className={`w-full lg:w-[420px] xl:w-[460px] flex-col h-full bg-paper-soft shrink-0 border-t lg:border-t-0 border-line ${
          mobilePane === 'register' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        {/* Mobile back to catalog button */}
        <div className="lg:hidden p-2 bg-paper border-b border-line shrink-0">
          <button
            type="button"
            onClick={() => setMobilePane('catalog')}
            className="w-full py-1.5 px-3 bg-panel hover:bg-zinc-800 text-ink border border-line text-xs font-mono uppercase font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>← Seguir Agregando Prendas</span>
          </button>
        </div>
        {/* Register Header */}
        <div className="p-3 sm:p-4 border-b border-line bg-paper space-y-2.5">
          {/* Document Type & Destination Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Document Type */}
            <div className="flex gap-1">
              {(['NOTA_VENTA', 'BOLETA', 'FACTURA'] as ReceiptType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleReceiptTypeChange(type)}
                  className={`text-[9.5px] font-mono uppercase px-2.5 py-1 border transition-colors cursor-pointer font-bold ${
                    receiptType === type
                      ? 'bg-accent text-white border-accent shadow-xs'
                      : 'bg-panel text-muted hover:text-ink border-line'
                  }`}
                >
                  {type === 'NOTA_VENTA' ? 'Nota Venta' : type === 'BOLETA' ? 'Boleta' : 'Factura (RUC)'}
                </button>
              ))}
            </div>

            {/* Destination Toggle (Lima vs Provincia) */}
            <div className="flex bg-panel p-0.5 border border-line rounded-xs">
              <button
                type="button"
                onClick={() => {
                  setDestinationType('LIMA');
                  if (shippingCost === 15) setShippingCost(10);
                }}
                className={`px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                  destinationType === 'LIMA'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                LIMA
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestinationType('PROVINCIA');
                  if (shippingCost === 0 || shippingCost === 10) setShippingCost(15);
                }}
                className={`px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                  destinationType === 'PROVINCIA'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                PROVINCIA
              </button>
            </div>
          </div>

          {/* Number, Date & Tax Mode preview */}
          <div className="flex items-center justify-between bg-panel p-2 border border-line text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-muted">
                N° Serie: <b className="text-accent font-bold">N° {nextReceiptNumber}</b>
              </span>
              <span className={`text-[8.5px] px-1 py-0.2 uppercase font-bold border ${
                taxMode === 'NO_TAX' ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
              }`}>
                {taxMode === 'NO_TAX' ? 'Sin IGV' : taxMode === 'INCLUDED' ? 'IGV Incl.' : '+18% IGV'}
              </span>
            </div>
            <span className="text-muted text-[10px]">
              Cajero: <b className="text-ink">{getActiveSeller()}</b>
            </span>
          </div>

          {/* Customer / Company Inputs (Specialized for Facturas vs Boletas vs Notas de Venta) */}
          <div className="space-y-1.5">
            {receiptType === 'FACTURA' ? (
              /* FACTURA FIELDS: RUC, Razón Social, Dirección Fiscal, Contacto */
              <div className="space-y-1.5 bg-panel/70 p-2 border border-accent/30 rounded-xs">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-accent">
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    DATOS DE LA EMPRESA A FACTURAR:
                  </span>
                  <span className="text-zinc-400 text-[9px]">RUC 11 dígitos</span>
                </div>

                <div className="flex gap-2">
                  <div className="w-36">
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="RUC (20... / 10...)"
                      value={customer.documentNumber}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          documentType: 'RUC',
                          documentNumber: e.target.value.replace(/[^0-9]/g, ''),
                        })
                      }
                      className="w-full bg-paper border border-accent text-[11px] font-mono py-1 px-2 text-ink font-bold focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Razón Social (Nombre de la Empresa)"
                      value={customer.businessName || customer.name}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          businessName: e.target.value,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-paper border border-line text-[11px] font-mono py-1 px-2 text-ink font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Dirección Fiscal de la Empresa"
                    value={customer.fiscalAddress || customer.address}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        fiscalAddress: e.target.value,
                        address: e.target.value,
                      })
                    }
                    className="flex-1 bg-paper border border-line text-[10.5px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    placeholder="Telf / Contacto"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-32 bg-paper border border-line text-[10.5px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            ) : (
              /* NOTA DE VENTA / BOLETA FIELDS */
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Nombre del Cliente"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full bg-panel border border-line text-[11px] font-mono py-1.5 pl-8 pr-2 text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="relative w-36">
                    <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="WhatsApp / Telf"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full bg-panel border border-line text-[11px] font-mono py-1.5 pl-8 pr-2 text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Address & Document */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={
                      destinationType === 'PROVINCIA'
                        ? 'Dirección de Envío / Ciudad (Provincia)'
                        : 'Dirección / Distrito (Lima)'
                    }
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="flex-1 bg-panel border border-line text-[11px] font-mono py-1 px-2.5 text-ink focus:outline-none focus:border-accent"
                  />
                  <input
                    type="text"
                    placeholder={receiptType === 'BOLETA' ? 'DNI (8 dígs)' : 'DNI / RUC'}
                    value={customer.documentNumber}
                    onChange={(e) => setCustomer({ ...customer, documentNumber: e.target.value })}
                    className="w-28 bg-panel border border-line text-[11px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-accent"
                  />
                </div>
              </>
            )}

            {/* Shipping Cost Quick Selector */}
            <div className="flex items-center justify-between bg-panel p-1.5 border border-line text-[10px] font-mono">
              <span className="text-muted uppercase font-bold">
                Envío ({destinationType}):
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShippingCost(0)}
                  className={`px-1.5 py-0.5 border cursor-pointer ${
                    shippingCost === 0
                      ? 'bg-accent text-white border-accent font-bold'
                      : 'bg-paper text-muted border-line'
                  }`}
                >
                  S/ 0 (Recojo)
                </button>
                <button
                  type="button"
                  onClick={() => setShippingCost(10)}
                  className={`px-1.5 py-0.5 border cursor-pointer ${
                    shippingCost === 10
                      ? 'bg-accent text-white border-accent font-bold'
                      : 'bg-paper text-muted border-line'
                  }`}
                >
                  S/ 10 (Lima)
                </button>
                <button
                  type="button"
                  onClick={() => setShippingCost(15)}
                  className={`px-1.5 py-0.5 border cursor-pointer ${
                    shippingCost === 15
                      ? 'bg-accent text-white border-accent font-bold'
                      : 'bg-paper text-muted border-line'
                  }`}
                >
                  S/ 15 (Prov)
                </button>
                <div className="relative w-14">
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8.5px] text-muted">S/</span>
                  <input
                    type="number"
                    value={shippingCost || ''}
                    placeholder="0"
                    onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-paper border border-line text-[9.5px] py-0.5 pl-4 pr-1 text-ink focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Observations input */}
            <input
              type="text"
              placeholder="Observaciones de la venta / envío (Opcional)..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full bg-panel border border-line text-[10.5px] font-mono py-1 px-2.5 text-ink focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-panel border border-line p-2.5 flex items-center justify-between gap-2 hover:border-muted/50 transition-colors"
            >
              {/* Product Thumbnail */}
              <img
                src={item.image}
                alt={item.productName}
                className="w-11 h-11 object-cover border border-line bg-paper shrink-0"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-mono text-xs font-bold text-ink uppercase truncate">
                  {item.productName}
                </h4>
                <div className="text-[9px] font-mono text-muted flex flex-wrap gap-1 mt-0.5">
                  <span className="bg-paper px-1 border border-line">Talla {item.selectedSize}</span>
                  <span className="bg-paper px-1 border border-line">{item.selectedColor}</span>
                  {item.selectedSleeve && (
                    <span className="bg-paper px-1 border border-line text-accent font-bold">
                      {item.selectedSleeve === 'Manga Larga' ? 'M. Larga' : 'M. Corta'}
                    </span>
                  )}
                  {item.selectedFabric && <span className="bg-paper px-1 border border-line">{item.selectedFabric}</span>}
                </div>

                {/* Editable Unit Price (Para cuadrar precios individualmente) */}
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9.5px] font-mono text-muted">P. Unit:</span>
                  <div className="relative w-20">
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-muted">S/</span>
                    <input
                      type="number"
                      step="0.5"
                      value={item.unitPrice || ''}
                      onChange={(e) => handleUpdateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                      className="w-full bg-paper border border-line text-[11px] font-mono font-bold text-accent py-0.5 pl-4 pr-1 focus:outline-none focus:border-accent"
                      title="Editar precio unitario para cuadrar la venta"
                    />
                  </div>
                </div>
              </div>

              {/* Quantity Adjusters */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleUpdateQuantity(item.id, -1)}
                  className="w-6 h-6 bg-paper hover:bg-zinc-700 border border-line flex items-center justify-center text-ink cursor-pointer text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-xs font-bold w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleUpdateQuantity(item.id, 1)}
                  className="w-6 h-6 bg-paper hover:bg-zinc-700 border border-line flex items-center justify-center text-ink cursor-pointer text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div className="text-right shrink-0">
                <div className="font-mono text-xs font-bold text-ink">
                  S/ {item.subtotal.toFixed(2)}
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-muted hover:text-rose-500 mt-1 cursor-pointer p-1"
                  title="Eliminar de la nota"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {cartItems.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted">
              <Tag className="w-10 h-10 stroke-[1.2] mb-2 opacity-40 text-muted" />
              <p className="font-mono text-xs uppercase font-bold">Ticket de Venta Vacío</p>
              <p className="text-[10px] font-mono mt-1 opacity-70">
                Selecciona prendas del catálogo para agregar a la nota de venta.
              </p>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary & Square-Up Tools */}
        <div className="p-3 sm:p-4 border-t border-line bg-paper space-y-2.5 shrink-0">
          {/* Tax Mode Selector (Para Facturas, Boletas o Notas de Venta) */}
          <div className="flex items-center justify-between bg-panel p-1.5 border border-line text-[10px] font-mono">
            <span className="text-muted uppercase font-bold flex items-center gap-1">
              <Calculator className="w-3 h-3 text-accent" />
              Régimen IGV:
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setTaxMode('NO_TAX')}
                className={`px-2 py-0.5 border cursor-pointer ${
                  taxMode === 'NO_TAX'
                    ? 'bg-accent text-white border-accent font-bold'
                    : 'bg-paper text-muted border-line'
                }`}
              >
                0% (Sin IGV)
              </button>
              <button
                type="button"
                onClick={() => setTaxMode('INCLUDED')}
                className={`px-2 py-0.5 border cursor-pointer ${
                  taxMode === 'INCLUDED'
                    ? 'bg-accent text-white border-accent font-bold'
                    : 'bg-paper text-muted border-line'
                }`}
              >
                Incluye IGV (18%)
              </button>
              <button
                type="button"
                onClick={() => setTaxMode('PLUS_TAX')}
                className={`px-2 py-0.5 border cursor-pointer ${
                  taxMode === 'PLUS_TAX'
                    ? 'bg-accent text-white border-accent font-bold'
                    : 'bg-paper text-muted border-line'
                }`}
              >
                +18% IGV
              </button>
            </div>
          </div>

          {/* Quick Wholesale Price / Bulk Pricing Tool */}
          {cartItems.length > 0 && (
            <div className="bg-panel p-2 border border-line space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted uppercase font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-accent" />
                  Precio Mayorista (Todas las prendas):
                </span>
                <div className="flex gap-1">
                  {[35, 40, 45, 50].map((uniformP) => (
                    <button
                      key={uniformP}
                      type="button"
                      onClick={() => handleApplyGlobalItemPrice(uniformP)}
                      className="text-[9px] px-1.5 py-0.5 bg-paper hover:bg-zinc-700 text-ink border border-line font-bold cursor-pointer transition-colors"
                      title={`Fijar todas las prendas a S/ ${uniformP}`}
                    >
                      S/ {uniformP}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Target Total Tool (Fijar precio cerrado) */}
              <div className="pt-1.5 border-t border-line/60 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-accent font-bold uppercase flex items-center gap-1">
                    <Calculator className="w-3 h-3" />
                    Fijar Total Exacto (Cuadrar):
                  </span>
                  <span className="text-[9px] text-muted">Ajusta el total automáticamente</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted">S/</span>
                    <input
                      type="number"
                      placeholder="Escribe el total exacto (Ej. 650, 600, 100...)"
                      value={customTargetTotal}
                      onChange={(e) => setCustomTargetTotal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAutoSquareTotal(parseFloat(customTargetTotal) || 0);
                      }}
                      className="w-full bg-paper border border-line focus:border-accent text-xs font-mono font-bold py-1.5 pl-8 pr-2 text-ink focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAutoSquareTotal(parseFloat(customTargetTotal) || 0)}
                    className="bg-accent hover:opacity-90 text-white px-3 py-1.5 text-[10px] font-mono uppercase font-bold cursor-pointer transition-opacity shadow-sm"
                  >
                    CUADRAR
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {[50, 80, 100, 150, 200, 300, 400, 500, 600, 650, 700].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setCustomTargetTotal(amt.toString());
                        handleAutoSquareTotal(amt);
                      }}
                      className="text-[8.5px] font-mono bg-paper hover:bg-zinc-700 text-muted hover:text-ink border border-line px-1.5 py-0.2 cursor-pointer"
                    >
                      S/{amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subtotals breakdown */}
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between text-muted">
              <span>Prendas ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items):</span>
              <span>S/ {rawSubtotal.toFixed(2)}</span>
            </div>

            {taxMode !== 'NO_TAX' && (
              <>
                <div className="flex justify-between text-muted text-[11px]">
                  <span>Op. Gravadas (Base):</span>
                  <span>S/ {baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted text-[11px]">
                  <span>I.G.V. (18%):</span>
                  <span>S/ {taxAmount.toFixed(2)}</span>
                </div>
              </>
            )}

            {shippingCost > 0 && (
              <div className="flex justify-between text-muted">
                <span>Envío ({destinationType}):</span>
                <span>+S/ {shippingCost.toFixed(2)}</span>
              </div>
            )}

            {computedDiscount > 0 && (
              <div className="flex justify-between text-rose-500 font-bold">
                <span>Descuento / Ajuste aplicado:</span>
                <span>-S/ {computedDiscount.toFixed(2)}</span>
              </div>
            )}

            {/* Editable TOTAL A COBRAR row */}
            <div className="flex items-center justify-between text-base font-mono font-black text-ink pt-1.5 border-t border-line">
              <span className="text-sm">TOTAL A COBRAR:</span>
              <div className="flex items-center gap-1">
                <span className="text-accent text-sm">S/</span>
                <input
                  type="number"
                  step="0.5"
                  value={totalAmount.toFixed(2)}
                  onChange={(e) => {
                    const typed = parseFloat(e.target.value);
                    if (!isNaN(typed)) handleAutoSquareTotal(typed);
                  }}
                  className="w-28 bg-panel border border-accent/60 text-accent text-lg font-mono font-black text-right px-2 py-0.5 focus:outline-none focus:border-accent"
                  title="Puedes editar el total a cobrar directamente aquí"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearTicket}
                disabled={cartItems.length === 0}
                className="bg-panel hover:bg-zinc-800 disabled:opacity-40 text-muted hover:text-ink font-mono text-xs uppercase px-3 py-2.5 border border-line transition-colors cursor-pointer flex items-center justify-center"
                title="Limpiar nota"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="pos-open-proforma-btn"
                type="button"
                disabled={cartItems.length === 0}
                onClick={() => setIsProformaModalOpen(true)}
                className="flex-1 bg-panel hover:bg-paper border border-line hover:border-accent hover:text-accent text-ink font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-3 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                title="Generar Proforma / Cotización A4 en PDF para el cliente"
              >
                <FileText className="w-4 h-4 text-accent" />
                <span>COTIZAR / PROFORMA A4</span>
              </button>
            </div>

            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full bg-accent hover:bg-rose-600 disabled:bg-panel disabled:text-muted disabled:cursor-not-allowed text-white font-mono text-xs font-bold uppercase tracking-wider py-3.5 px-4 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>COBRAR S/ {totalAmount.toFixed(2)} (F4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Variant Quick-Select Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg bg-[#0e0e14] border border-zinc-800 text-white shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-[#14141e] border-b border-zinc-800 p-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                  {selectedProduct.category}
                </span>
                <h3 className="font-mono text-sm font-bold uppercase text-white">
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Garment Preview Thumbnail */}
              <div className="flex items-center gap-3 bg-[#141420] p-3 border border-zinc-800">
                <img
                  src={
                    getGarmentPhoto(selectedProduct.id, variantFabric, variantColor) ||
                    selectedProduct.images[0]
                  }
                  alt={selectedProduct.name}
                  className="w-16 h-16 object-cover border border-zinc-700 bg-black"
                />
                <div>
                  <div className="text-xs font-mono font-bold uppercase text-white">
                    {selectedProduct.name} — {variantColor}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                    Tela: <b className="text-zinc-200">{variantFabric}</b> | Talla: <b className="text-zinc-200">{variantSize}</b>
                  </div>
                  <div className="text-xs font-mono text-rose-400 font-bold mt-1">
                    Precio: S/ {selectedProduct.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Fabric selection */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-bold">
                  1. Seleccionar Tipo de Tela:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.fabrics.map((fabric) => (
                    <button
                      key={fabric}
                      type="button"
                      onClick={() => setVariantFabric(fabric)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer ${
                        variantFabric === fabric
                          ? 'bg-rose-600 text-white border-rose-500 font-bold'
                          : 'bg-[#181824] text-zinc-300 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      {fabric}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color selection */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-bold">
                  2. Seleccionar Color:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setVariantColor(color)}
                      className={`p-2 text-left text-[10.5px] font-mono uppercase border transition-all cursor-pointer truncate ${
                        variantColor === color
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500 font-bold'
                          : 'bg-[#181824] text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-bold">
                  3. Seleccionar Talla:
                </label>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setVariantSize(size)}
                      className={`flex-1 py-2 text-xs font-mono font-bold uppercase border transition-all cursor-pointer text-center ${
                        variantSize === size
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-[#181824] text-zinc-300 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleeve selection (Manga Corta / Manga Larga) */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                    4. Tipo de Manga:
                  </label>
                  <span className="text-[9px] font-mono text-rose-400 font-bold">
                    {variantSleeve === 'Manga Larga' ? '✦ MANGA LARGA' : '✦ MANGA CORTA'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {['Manga Corta', 'Manga Larga'].map((sleeve) => (
                    <button
                      key={sleeve}
                      type="button"
                      onClick={() => setVariantSleeve(sleeve)}
                      className={`flex-1 py-2 text-xs font-mono uppercase font-bold border transition-all cursor-pointer text-center ${
                        variantSleeve === sleeve
                          ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                          : 'bg-[#181824] text-zinc-300 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      {sleeve}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between bg-[#141420] p-3 border border-zinc-800">
                <span className="text-xs font-mono uppercase font-bold text-zinc-300">
                  Cantidad:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVariantQuantity(Math.max(1, variantQuantity - 1))}
                    className="w-8 h-8 bg-[#1e1e2c] border border-zinc-700 flex items-center justify-center text-white cursor-pointer hover:bg-zinc-700"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-bold w-8 text-center text-white">
                    {variantQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setVariantQuantity(variantQuantity + 1)}
                    className="w-8 h-8 bg-[#1e1e2c] border border-zinc-700 flex items-center justify-center text-white cursor-pointer hover:bg-zinc-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 5. Custom Price Configuration (Configurar precio antes de agregar) */}
              <div className="bg-[#141420] p-3 border border-zinc-800 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    5. Precio Unitario Personalizado:
                  </label>
                  <span className="text-[9px] font-mono text-zinc-400">
                    Catálogo: S/ {selectedProduct.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-400">S/</span>
                    <input
                      type="number"
                      step="0.5"
                      value={variantPrice || ''}
                      onChange={(e) => setVariantPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#181828] border border-rose-500/60 text-white font-mono font-bold text-sm py-1.5 pl-8 pr-2 focus:outline-none focus:border-rose-500"
                      placeholder="0.00"
                      title="Ingresa el precio unitario deseado para esta prenda"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[35, 40, 45, 50, 55].map((price) => (
                      <button
                        key={price}
                        type="button"
                        onClick={() => setVariantPrice(price)}
                        className={`px-2 py-1.5 text-[10px] font-mono font-bold border transition-colors cursor-pointer ${
                          variantPrice === price ? 'bg-rose-600 text-white border-rose-500' : 'bg-[#181824] text-zinc-300 border-zinc-700 hover:border-zinc-500'
                        }`}
                      >
                        S/{price}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-[#14141e] border-t border-zinc-800 p-4 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs uppercase py-3 border border-zinc-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddVariantToCart}
                className="flex-2 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider py-3 flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  AGREGAR A LA NOTA (S/ {((variantPrice > 0 ? variantPrice : selectedProduct.price) * variantQuantity).toFixed(2)})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Payment Modal */}
      <POSPaymentModal
        isOpen={isPaymentModalOpen}
        totalAmount={totalAmount}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* POSTicket Modal */}
      <POSTicketModal
        isOpen={isTicketModalOpen}
        sale={lastCompletedSale}
        onClose={() => setIsTicketModalOpen(false)}
        onNewSale={handleNewSale}
      />

      {/* POS Proforma / Cotización A4 Modal */}
      <POSProformaModal
        isOpen={isProformaModalOpen}
        onClose={() => setIsProformaModalOpen(false)}
        items={cartItems}
        customer={customer}
        destinationType={destinationType}
        shippingCost={shippingCost}
        discountAmount={computedDiscount}
        totalAmount={totalAmount}
        sellerName={getActiveSeller()}
      />
    </div>
  );
}
