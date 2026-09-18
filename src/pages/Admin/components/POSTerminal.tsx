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
  Truck,
  MapPin,
  Navigation,
  Clock,
  Package,
  ShieldCheck,
  Building2,
  Box,
  Copy,
  Clipboard,
  Coins,
  Smartphone,
  Banknote,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Product } from '../../../types';
import { PRODUCTS } from '../../../data';
import {
  POSSaleItem,
  POSCustomer,
  ReceiptType,
  DestinationType,
  TaxMode,
  PaymentMethodType,
  POSPaymentDetail,
  POSSale,
  POSShippingLima,
  POSShippingProvincia,
  POSShippingInfo,
  ShippingCourierLima,
  ShippingAgencyProvincia,
  ShippingDeliveryTypeProvincia,
  ShippingFreightPaymentProvincia,
  VANTA_BANK_ACCOUNTS,
} from '../../../types/pos';
import { getNextReceiptNumber, savePOSSale, getActiveSeller } from '../../../utils/posStorage';
import { getGarmentPhoto } from '../../../utils/productImages';
import POSPaymentModal, { POSAdvancePaymentInfo } from './POSPaymentModal';
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

const LIMA_DISTRICTS = [
  'Miraflores',
  'San Isidro',
  'Santiago de Surco',
  'San Borja',
  'La Molina',
  'San Miguel',
  'Jesús María',
  'Magdalena del Mar',
  'Lince',
  'Pueblo Libre',
  'Barranco',
  'Cercado de Lima',
  'Los Olivos',
  'San Martín de Porres',
  'Comas',
  'Independencia',
  'Ate Vitarte',
  'Santa Anita',
  'Chorrillos',
  'San Juan de Lurigancho',
  'San Juan de Miraflores',
  'Villa El Salvador',
  'Callao',
  'Bellavista',
  'La Perla',
  'Otro Distrito',
];

const PERU_DEPARTMENTS = [
  'Arequipa',
  'Cusco',
  'La Libertad',
  'Piura',
  'Junín',
  'Lambayeque',
  'Puno',
  'Áncash',
  'Ica',
  'San Martín',
  'Huánuco',
  'Ayacucho',
  'Cajamarca',
  'Loreto',
  'Ucayali',
  'Tacna',
  'Moquegua',
  'Amazonas',
  'Apurímac',
  'Huancavelica',
  'Madre de Dios',
  'Pasco',
  'Tumbes',
];

const PROVINCIA_EMPTY_TEMPLATE = `📦 *FORMULARIO DE ENVÍO – VANTA*
🚚 *Transporte: SHALOM*

👤 Nombres y apellidos:
🪪 DNI:
📱 Celular:
📍 Departamento / Provincia / Distrito:
🏢 Agencia Shalom donde recogerás tu pedido:`;

const LIMA_EMPTY_TEMPLATE = `📦 *FORMULARIO DE ENVÍO A LIMA – VANTA*

👤 Nombres y apellidos:
📱 Celular:
📍 Distrito:
🏠 Dirección completa (número, piso o departamento):
📌 Referencia para llegar:`;

export default function POSTerminal({ onSaleCompleted }: POSTerminalProps) {
  // Filters and search
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mobile / Tablet pane view ('catalog' vs 'register')
  const [mobilePane, setMobilePane] = useState<'catalog' | 'register'>('catalog');
  // Visual layout mode for product catalog ('compact' grid vs 'list' table rows)
  const [catalogViewMode, setCatalogViewMode] = useState<'compact' | 'list'>('compact');

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

  // WhatsApp form clipboard & auto-parse helpers
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [pasteModalType, setPasteModalType] = useState<'LIMA' | 'PROVINCIA' | null>(null);
  const [pasteModalText, setPasteModalText] = useState<string>('');

  // Structured Shipping Forms
  const [shippingLima, setShippingLima] = useState<POSShippingLima>({
    recipientName: '',
    recipientPhone: '',
    recipientDni: '',
    district: 'Miraflores',
    address: '',
    reference: '',
    courier: 'MOTORIZADO_EXPRESS',
    deliveryWindow: 'Cualquier horario',
  });

  const [shippingProvincia, setShippingProvincia] = useState<POSShippingProvincia>({
    consigneeName: '',
    consigneeDni: '',
    consigneePhone: '',
    departmentProvinceDistrict: '',
    department: 'Arequipa',
    provinceCity: '',
    agency: 'SHALOM',
    otherAgencyName: '',
    deliveryType: 'AGENCIA',
    agencyBranch: '',
    address: '',
    freightPayment: 'PAGO_DESTINO',
    claveRetiro: '',
  });

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

  // Adelanto (Pago a Cuenta) & Cuenta de la Venta state
  const [isAdvanceMode, setIsAdvanceMode] = useState<boolean>(false);
  const [customAdvanceAmount, setCustomAdvanceAmount] = useState<string>('');
  const [selectedReceivingAccount, setSelectedReceivingAccount] = useState<string>('YAPE_PLIN');
  const [copySaleAccountFeedback, setCopySaleAccountFeedback] = useState<string | null>(null);

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

  // Adelanto & Saldo Pendiente (Pago a cuenta) calculations
  const effectiveAdvanceAmount = useMemo(() => {
    if (!isAdvanceMode) return totalAmount;
    const parsed = parseFloat(customAdvanceAmount);
    if (isNaN(parsed) || parsed <= 0) return Math.round(totalAmount * 0.5);
    return Math.min(totalAmount, parsed);
  }, [isAdvanceMode, customAdvanceAmount, totalAmount]);

  const effectivePendingBalance = useMemo(() => {
    if (!isAdvanceMode) return 0;
    return Math.max(0, totalAmount - effectiveAdvanceAmount);
  }, [isAdvanceMode, totalAmount, effectiveAdvanceAmount]);

  // One-click copy "Cuenta de la Venta" for WhatsApp with bank details
  const handleCopySaleAccount = () => {
    const isProv = destinationType === 'PROVINCIA';
    const clientName = isProv
      ? shippingProvincia.consigneeName || customer.name || 'Cliente'
      : shippingLima.recipientName || customer.name || 'Cliente';
    const clientPhone = isProv
      ? shippingProvincia.consigneePhone || customer.phone || ''
      : shippingLima.recipientPhone || customer.phone || '';

    const currentDocCode = lastCompletedSale ? lastCompletedSale.receiptNumber : nextReceiptNumber;
    let text = `📦 *RESUMEN DE VENTA Y CUENTA — VANTA ATELIER*\n`;
    text += `📄 *NOTA DE VENTA:* ${currentDocCode}\n`;
    text += `👤 *Cliente:* ${clientName}\n`;
    if (clientPhone) text += `📱 *Celular:* ${clientPhone}\n`;
    text += `📍 *Destino:* ${isProv ? (shippingProvincia.departmentProvinceDistrict || shippingProvincia.department || 'Provincia') : (shippingLima.district || 'Lima')}\n`;
    if (isProv) {
      const agencyName = shippingProvincia.agency === 'OTRA' ? (shippingProvincia.otherAgencyName || 'Agencia') : shippingProvincia.agency;
      text += `🏢 *Agencia Shalom / Courier:* ${agencyName} ${shippingProvincia.agencyBranch ? '— ' + shippingProvincia.agencyBranch : ''}\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🛍️ *PRENDAS DETALLE:*\n`;
    cartItems.forEach((it, idx) => {
      const sleeve = it.selectedSleeve ? ` [${it.selectedSleeve}]` : '';
      text += `${idx + 1}. *${it.productName}*${sleeve} (${it.selectedSize} / ${it.selectedColor}) x${it.quantity} = S/ ${it.subtotal.toFixed(2)}\n`;
    });
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💵 *Subtotal:* S/ ${rawSubtotal.toFixed(2)}\n`;
    if (shippingCost > 0) {
      text += `🚚 *Envío:* S/ ${shippingCost.toFixed(2)}\n`;
    } else if (isProv && shippingProvincia.freightPayment === 'PAGO_DESTINO') {
      text += `🚚 *Flete Agencia:* PAGO EN DESTINO (S/ 0.00 en pedido)\n`;
    }
    if (computedDiscount > 0) {
      text += `🏷️ *Descuento aplicado:* -S/ ${computedDiscount.toFixed(2)}\n`;
    }
    text += `*TOTAL DE LA VENTA: S/ ${totalAmount.toFixed(2)}*\n`;
    text += `----------------------------\n`;
    if (isAdvanceMode && effectivePendingBalance > 0) {
      text += `💰 *ADELANTO A PAGAR:* S/ ${effectiveAdvanceAmount.toFixed(2)}\n`;
      text += `⏳ *SALDO PENDIENTE:* S/ ${effectivePendingBalance.toFixed(2)} (contraentrega o previo al despacho)\n`;
    } else {
      text += `💰 *TOTAL A ABONAR (100%):* S/ ${totalAmount.toFixed(2)}\n`;
    }
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💳 *CUENTAS BANCARIAS OFICIALES — VANTA:*\n`;
    text += `👤 *Titular:* BRYAN MICHAEL REQUENA AVILA\n`;
    text += `🪪 *R.U.C.:* 10714931062\n\n`;
    text += `🟣 *Yape / Plin:* 904 536 406 / 924 058 988\n`;
    text += `🟠 *BCP Soles:* 191-0014100063-0-53 (CCI: 002-191-0014100063053-53)\n`;
    text += `🔵 *BBVA Soles:* 0011-0175-0200543981 (CCI: 011-175-000200543981-74)\n`;
    text += `🟢 *Interbank:* 200-3001249821 (CCI: 003-200-003001249821-39)\n`;
    text += `🌐 *CCI Multi-banco:* 094-00141000636992-1-53\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📸 *Por favor enviar foto o captura de tu constancia de abono por este medio para proceder con la reserva y empaque de tus prendas.* ¡Muchas gracias! 🔥🖤\n`;

    navigator.clipboard.writeText(text);
    setCopySaleAccountFeedback('✓ Cuenta de la Venta copiada para WhatsApp');
    setTimeout(() => setCopySaleAccountFeedback(null), 3000);
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

  // Keep customer and shipping synced for Lima
  const updateShippingLima = (updates: Partial<POSShippingLima>) => {
    setShippingLima((prev) => {
      const next = { ...prev, ...updates };
      setCustomer((c) => ({
        ...c,
        name: next.recipientName || (c.name === 'Cliente Mostrador' ? 'Cliente Lima' : c.name),
        phone: next.recipientPhone || c.phone,
        documentType: next.recipientDni ? 'DNI' : (c.documentType === 'RUC' ? 'RUC' : 'NINGUNO'),
        documentNumber: next.recipientDni || c.documentNumber,
        district: next.district,
        address: next.address
          ? `${next.address} - ${next.district}${next.reference ? ' (Ref: ' + next.reference + ')' : ''}`
          : c.address,
      }));
      return next;
    });

    if (updates.courier === 'RECOJO_SHOWROOM') {
      setShippingCost(0);
    } else if (updates.courier && shippingCost === 0) {
      setShippingCost(10);
    }
  };

  // Keep customer and shipping synced for Provincia
  const updateShippingProvincia = (updates: Partial<POSShippingProvincia>) => {
    setShippingProvincia((prev) => {
      const next = { ...prev, ...updates };
      const agencyName = next.agency === 'OTRA' ? (next.otherAgencyName || 'Agencia') : next.agency;
      const loc = next.departmentProvinceDistrict || (next.provinceCity ? `${next.provinceCity} - ${next.department}` : next.department || 'Provincia');
      const addrSummary = next.agencyBranch
        ? `Agencia ${agencyName}: ${next.agencyBranch} (${loc})`
        : `Agencia ${agencyName} (${loc})`;

      setCustomer((c) => ({
        ...c,
        name: next.consigneeName || (c.name === 'Cliente Mostrador' ? 'Cliente Provincia' : c.name),
        phone: next.consigneePhone || c.phone,
        documentType: 'DNI',
        documentNumber: next.consigneeDni || c.documentNumber,
        district: loc,
        address: addrSummary,
      }));
      return next;
    });

    if (updates.freightPayment === 'PAGO_DESTINO') {
      setShippingCost(0);
    } else if (updates.freightPayment === 'PAGADO' && shippingCost === 0) {
      setShippingCost(15);
    }
  };

  // One-click copy empty template for WhatsApp
  const handleCopyEmptyTemplate = (type: 'LIMA' | 'PROVINCIA') => {
    const text = type === 'PROVINCIA' ? PROVINCIA_EMPTY_TEMPLATE : LIMA_EMPTY_TEMPLATE;
    navigator.clipboard.writeText(text);
    setCopyFeedback(type === 'PROVINCIA' ? '✓ Formulario Provincia copiado' : '✓ Formulario Lima copiado');
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Auto-parse customer WhatsApp message
  const handleApplyPastedText = () => {
    if (!pasteModalType || !pasteModalText.trim()) {
      setPasteModalType(null);
      return;
    }
    const lines = pasteModalText.split('\n');
    if (pasteModalType === 'PROVINCIA') {
      const updates: Partial<POSShippingProvincia> = {};
      for (const rawLine of lines) {
        const line = rawLine.replace(/[*_]/g, '').trim();
        if (!line) continue;

        if (/transporte/i.test(line)) {
          const parts = line.split(/:\s*/);
          if (parts[1]) {
            const val = parts[1].trim().toUpperCase();
            if (val.includes('SHALOM')) updates.agency = 'SHALOM';
            else if (val.includes('OLVA')) updates.agency = 'OLVA_COURIER';
            else if (val.includes('MARVISUR')) updates.agency = 'MARVISUR';
            else if (val.includes('CIVA')) updates.agency = 'CIVA';
            else if (val.includes('FLORES')) updates.agency = 'FLORES';
            else {
              updates.agency = 'OTRA';
              updates.otherAgencyName = val;
            }
          }
        } else if (/nombres?\s*(y\s*apellidos?)?/i.test(line)) {
          const parts = line.split(/:\s*/);
          if (parts[1]) updates.consigneeName = parts.slice(1).join(':').trim();
        } else if (/dni/i.test(line)) {
          const match = line.match(/\b\d{8}\b/);
          if (match) updates.consigneeDni = match[0];
          else {
            const parts = line.split(/:\s*/);
            if (parts[1]) updates.consigneeDni = parts[1].replace(/[^0-9]/g, '').slice(0, 8);
          }
        } else if (/(celular|telf|tel[eé]fono|whatsapp|movil)/i.test(line)) {
          const match = line.match(/\b9\d{8}\b/);
          if (match) updates.consigneePhone = match[0];
          else {
            const parts = line.split(/:\s*/);
            if (parts[1]) updates.consigneePhone = parts[1].replace(/[^0-9]/g, '');
          }
        } else if (/(departamento|provincia|distrito|destino|ciudad)/i.test(line) && !/agencia/i.test(line)) {
          const parts = line.split(/:\s*/);
          if (parts[1]) {
            updates.departmentProvinceDistrict = parts.slice(1).join(':').trim();
          }
        } else if (/(agencia|donde\s*recoger|sucursal|sede)/i.test(line)) {
          const parts = line.split(/:\s*/);
          if (parts[1]) {
            updates.agencyBranch = parts.slice(1).join(':').trim();
          }
        }
      }
      updateShippingProvincia(updates);
    } else {
      const updates: Partial<POSShippingLima> = {};
      for (const rawLine of lines) {
        const line = rawLine.replace(/[*_]/g, '').trim();
        if (!line) continue;

        if (/nombres?\s*(y\s*apellidos?)?/i.test(line)) {
          const parts = line.split(/:\s*/);
          if (parts[1]) updates.recipientName = parts.slice(1).join(':').trim();
        } else if (/(celular|telf|tel[eé]fono|whatsapp|movil)/i.test(line)) {
          const match = line.match(/\b9\d{8}\b/);
          if (match) updates.recipientPhone = match[0];
          else {
            const parts = line.split(/:\s*/);
            if (parts[1]) updates.recipientPhone = parts[1].replace(/[^0-9]/g, '');
          }
        } else if (/distrito/i.test(line) && !/departamento/i.test(line)) {
          const parts = line.split(/:\s*/);
          if (parts[1]) updates.district = parts.slice(1).join(':').trim();
        } else if (/(direcci[oó]n|calle|av\.|jr\.|piso|dpto)/i.test(line)) {
          const parts = line.split(/:\s*/);
          if (parts[1]) updates.address = parts.slice(1).join(':').trim();
        } else if (/referencia/i.test(line)) {
          const parts = line.split(/:\s*/);
          if (parts[1]) updates.reference = parts.slice(1).join(':').trim();
        }
      }
      updateShippingLima(updates);
    }
    setPasteModalText('');
    setPasteModalType(null);
  };

  // Confirm payment and create Sale
  const handleConfirmPayment = (
    payments: POSPaymentDetail[],
    advanceInfo?: POSAdvancePaymentInfo
  ) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const shippingInfo: POSShippingInfo = {
      destination: destinationType,
      shippingCost: shippingCost,
      lima: destinationType === 'LIMA' ? { ...shippingLima } : undefined,
      provincia: destinationType === 'PROVINCIA' ? { ...shippingProvincia } : undefined,
    };

    const hasAdvance = advanceInfo ? advanceInfo.isAdvance : isAdvanceMode;
    const finalAdvanceAmount = advanceInfo ? advanceInfo.advanceAmount : (isAdvanceMode ? effectiveAdvanceAmount : totalAmount);
    const finalPendingBalance = advanceInfo ? advanceInfo.pendingBalance : (isAdvanceMode ? effectivePendingBalance : 0);
    const finalAccountId = advanceInfo?.accountId || selectedReceivingAccount;
    const finalAccountLabel = advanceInfo?.accountLabel;

    const newSale: POSSale = {
      id: 'sale-' + Date.now(),
      receiptNumber: nextReceiptNumber,
      receiptType: receiptType,
      destinationType: destinationType,
      shippingInfo: shippingInfo,
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
      advanceAmount: hasAdvance ? finalAdvanceAmount : totalAmount,
      pendingBalance: hasAdvance ? finalPendingBalance : 0,
      paymentAccountId: finalAccountId,
      paymentAccountLabel: finalAccountLabel,
      isAdvancePayment: hasAdvance && finalPendingBalance > 0,
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

  // Directly emit and register Nota de Venta, then open A4 document (or Ticket)
  const handleCreateNotaVentaDirect = (openMode: 'A4' | 'TICKET' = 'A4') => {
    if (cartItems.length === 0) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const shippingInfo: POSShippingInfo = {
      destination: destinationType,
      shippingCost: shippingCost,
      lima: destinationType === 'LIMA' ? { ...shippingLima } : undefined,
      provincia: destinationType === 'PROVINCIA' ? { ...shippingProvincia } : undefined,
    };

    const hasAdvance = isAdvanceMode;
    const finalAdvanceAmount = isAdvanceMode ? effectiveAdvanceAmount : totalAmount;
    const finalPendingBalance = isAdvanceMode ? effectivePendingBalance : 0;
    const finalAccountId = selectedReceivingAccount;
    const finalAccountLabel = VANTA_BANK_ACCOUNTS.find((a) => a.id === selectedReceivingAccount)?.name;

    const paymentMethod: PaymentMethodType =
      selectedReceivingAccount === 'YAPE_PLIN'
        ? 'YAPE'
        : selectedReceivingAccount === 'EFECTIVO'
        ? 'EFECTIVO'
        : selectedReceivingAccount === 'BBVA_SOLES'
        ? 'TRANSFERENCIA_BBVA'
        : selectedReceivingAccount === 'INTERBANK_SOLES'
        ? 'TRANSFERENCIA_INTERBANK'
        : 'TRANSFERENCIA_BCP';

    const newSale: POSSale = {
      id: 'sale-' + Date.now(),
      receiptNumber: nextReceiptNumber,
      receiptType: receiptType || 'NOTA_VENTA',
      destinationType: destinationType,
      shippingInfo: shippingInfo,
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
      advanceAmount: hasAdvance ? finalAdvanceAmount : totalAmount,
      pendingBalance: hasAdvance ? finalPendingBalance : 0,
      paymentAccountId: finalAccountId,
      paymentAccountLabel: finalAccountLabel,
      isAdvancePayment: hasAdvance && finalPendingBalance > 0,
      payments: [
        {
          method: paymentMethod,
          amount: hasAdvance ? finalAdvanceAmount : totalAmount,
        },
      ],
      status: 'COMPLETADA',
      observations: observations.trim() || undefined,
    };

    savePOSSale(newSale);
    setLastCompletedSale(newSale);
    if (onSaleCompleted) onSaleCompleted(newSale);

    if (openMode === 'A4') {
      setIsProformaModalOpen(true);
    } else {
      setIsTicketModalOpen(true);
    }
  };

  const handleNewSale = () => {
    handleClearTicket();
    setShippingCost(0);
    setObservations('');
    setDestinationType('LIMA');
    setTaxMode('NO_TAX');
    setIsAdvanceMode(false);
    setCustomAdvanceAmount('');
    setIsTicketModalOpen(false);
    setIsProformaModalOpen(false);
    setLastCompletedSale(null);
    setShippingLima({
      recipientName: '',
      recipientPhone: '',
      recipientDni: '',
      district: 'Miraflores',
      address: '',
      reference: '',
      courier: 'MOTORIZADO_EXPRESS',
      deliveryWindow: 'Cualquier horario',
    });
    setShippingProvincia({
      consigneeName: '',
      consigneeDni: '',
      consigneePhone: '',
      departmentProvinceDistrict: '',
      department: 'Arequipa',
      provinceCity: '',
      agency: 'SHALOM',
      otherAgencyName: '',
      deliveryType: 'AGENCIA',
      agencyBranch: '',
      address: '',
      freightPayment: 'PAGO_DESTINO',
      claveRetiro: '',
    });
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

          {/* Category Filter Pills & View Mode Switcher */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border rounded-md ${
                    selectedCategory === cat
                      ? 'bg-accent text-white border-accent font-bold shadow-xs'
                      : 'bg-panel text-muted hover:text-ink border-line hover:border-muted/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-panel border border-line rounded-md p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setCatalogViewMode('compact')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  catalogViewMode === 'compact' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-ink'
                }`}
                title="Cuadrícula Compacta"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setCatalogViewMode('list')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  catalogViewMode === 'list' ? 'bg-accent text-white shadow-xs' : 'text-muted hover:text-ink'
                }`}
                title="Lista Rápida (Filas)"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Catalog Display (Compact Grid or Fast List) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {catalogViewMode === 'compact' ? (
            /* Cuadrícula Compacta Optimizada para POS */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-2.5 content-start">
              {filteredProducts.map((product) => {
                const defaultPhoto = product.images[0] || '';
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelectProduct(product)}
                    className="bg-panel border border-line hover:border-accent transition-all text-left p-2 rounded-xl flex flex-col justify-between group cursor-pointer hover:shadow-md relative overflow-hidden"
                  >
                    {/* Compact Image */}
                    <div className="relative w-full h-24 sm:h-28 bg-paper-soft rounded-lg overflow-hidden mb-1.5">
                      <img
                        src={defaultPhoto}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-1 right-1 bg-black/75 backdrop-blur-xs border border-white/10 text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded text-emerald-400">
                        Stock: {product.stock}
                      </div>
                      {product.promoBadge && (
                        <div className="absolute bottom-1 left-1 bg-accent/90 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Promo
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <span className="text-[8.5px] font-mono text-muted uppercase tracking-wider block truncate">
                        {product.category}
                      </span>
                      <h3 className="font-mono text-xs font-bold text-ink uppercase truncate leading-tight group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between pt-1 border-t border-line/60">
                        <span className="font-mono text-xs font-black text-accent">
                          S/ {product.price.toFixed(2)}
                        </span>
                        <span className="text-[8.5px] font-mono bg-paper px-1.5 py-0.2 rounded border border-line text-muted uppercase">
                          {product.colors.length} col.
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Modo Lista Rápida (Filas ultra-ágiles para cajero) */
            <div className="flex flex-col gap-1.5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="bg-panel border border-line hover:border-accent p-2 rounded-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-11 h-11 rounded-lg object-cover shrink-0 border border-line"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-bold text-ink uppercase truncate group-hover:text-accent transition-colors">
                        {product.name}
                      </div>
                      <div className="text-[9.5px] font-mono text-muted flex items-center gap-2 mt-0.5">
                        <span className="uppercase">{product.category}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">Stock: {product.stock}</span>
                        <span>•</span>
                        <span>{product.colors.length} col.</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs font-black text-accent">
                      S/ {product.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="bg-accent hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-colors shadow-xs"
                    >
                      + Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

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

            {/* Destination Toggle Tabs: Lima vs Provincia */}
            <div className="flex bg-panel p-1 border border-line rounded-xs gap-1">
              <button
                type="button"
                onClick={() => {
                  setDestinationType('LIMA');
                  if (shippingCost === 15) setShippingCost(10);
                }}
                className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  destinationType === 'LIMA'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-muted hover:text-ink hover:bg-paper'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>🛵 Envío Lima</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDestinationType('PROVINCIA');
                  if (shippingProvincia.freightPayment === 'PAGO_DESTINO') {
                    setShippingCost(0);
                  } else if (shippingCost === 0 || shippingCost === 10) {
                    setShippingCost(15);
                  }
                }}
                className={`flex-1 py-1.5 px-2 flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  destinationType === 'PROVINCIA'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-muted hover:text-ink hover:bg-paper'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>📦 Envío Provincia</span>
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

          {/* Forms Section */}
          <div className="space-y-2">
            {receiptType === 'FACTURA' ? (
              /* FACTURA FIELDS: RUC, Razón Social, Dirección Fiscal, Contacto */
              <div className="space-y-2 bg-panel/80 p-2.5 border border-accent/40 rounded-xs">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-accent">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    DATOS FISCALES (FACTURA CON RUC):
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
            ) : null}

            {/* SPECIALIZED FORM 1: ENVÍO LIMA METROPOLITANA */}
            {destinationType === 'LIMA' && (
              <div className="bg-panel border border-line p-2.5 space-y-2.5 rounded-xs">
                {/* Form Header */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-line pb-1.5">
                  <div className="flex items-center gap-1.5 text-accent font-mono text-[10.5px] font-bold uppercase">
                    <Truck className="w-3.5 h-3.5 text-accent" />
                    <span>📦 FORMULARIO DE ENVÍO A LIMA – VANTA</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyEmptyTemplate('LIMA')}
                      className="px-2 py-0.5 bg-paper hover:bg-zinc-800 text-muted hover:text-ink border border-line text-[9px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copiar plantilla vacía para WhatsApp"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>Copiar Plantilla</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPasteModalText('');
                        setPasteModalType('LIMA');
                      }}
                      className="px-2 py-0.5 bg-accent/10 hover:bg-accent text-accent hover:text-white border border-accent/40 text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Pegar mensaje de WhatsApp para auto-completar"
                    >
                      <Clipboard className="w-2.5 h-2.5" />
                      <span>Pegar de WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* 1. Nombres y apellidos + Celular */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5">
                  <div className="sm:col-span-7">
                    <label className="block text-[9px] font-mono text-muted uppercase font-bold mb-0.5">
                      👤 Nombres y apellidos:
                    </label>
                    <input
                      type="text"
                      placeholder="Nombres y apellidos completos"
                      value={shippingLima.recipientName}
                      onChange={(e) => updateShippingLima({ recipientName: e.target.value })}
                      className="w-full bg-paper border border-line text-[10.5px] font-mono py-1 px-2 text-ink font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className="block text-[9px] font-mono text-muted uppercase font-bold mb-0.5">
                      📱 Celular:
                    </label>
                    <input
                      type="text"
                      placeholder="9 dígitos"
                      value={shippingLima.recipientPhone}
                      onChange={(e) => updateShippingLima({ recipientPhone: e.target.value.replace(/[^0-9]/g, '') })}
                      className="w-full bg-paper border border-line text-[10.5px] font-mono py-1 px-2 text-ink font-bold focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* 2. Distrito */}
                <div>
                  <label className="block text-[9px] font-mono text-muted uppercase font-bold mb-0.5">
                    📍 Distrito:
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={LIMA_DISTRICTS.includes(shippingLima.district) ? shippingLima.district : 'Otro Distrito'}
                      onChange={(e) => {
                        if (e.target.value !== 'Otro Distrito') {
                          updateShippingLima({ district: e.target.value });
                        }
                      }}
                      className="flex-1 bg-paper border border-line text-[10px] font-mono py-1 px-1.5 text-ink focus:outline-none focus:border-accent cursor-pointer font-semibold"
                    >
                      {LIMA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="O escribir distrito..."
                      value={shippingLima.district}
                      onChange={(e) => updateShippingLima({ district: e.target.value })}
                      className="w-40 bg-paper border border-line text-[10px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* 3. Dirección completa */}
                <div>
                  <label className="block text-[9px] font-mono text-muted uppercase font-bold mb-0.5">
                    🏠 Dirección completa (número, piso o departamento):
                  </label>
                  <input
                    type="text"
                    placeholder="Calle, Jr., Av., N°, Piso, Interior o Departamento"
                    value={shippingLima.address}
                    onChange={(e) => updateShippingLima({ address: e.target.value })}
                    className="w-full bg-paper border border-line text-[10.5px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-accent"
                  />
                </div>

                {/* 4. Referencia para llegar */}
                <div>
                  <label className="block text-[9px] font-mono text-muted uppercase font-bold mb-0.5">
                    📌 Referencia para llegar:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Frente al parque, reja negra, portón blanco..."
                    value={shippingLima.reference || ''}
                    onChange={(e) => updateShippingLima({ reference: e.target.value })}
                    className="w-full bg-paper border border-line text-[10px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Quick Shipping Cost Selector for Lima */}
                <div className="flex flex-wrap items-center justify-between bg-paper p-1.5 border border-line text-[10px] font-mono gap-1.5">
                  <span className="text-muted uppercase font-bold flex items-center gap-1">
                    <Truck className="w-3 h-3 text-accent" />
                    Costo Envío Lima:
                  </span>
                  <div className="flex items-center gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        updateShippingLima({ courier: 'RECOJO_SHOWROOM' });
                        setShippingCost(0);
                      }}
                      className={`px-1.5 py-0.5 border cursor-pointer ${
                        shippingCost === 0
                          ? 'bg-accent text-white border-accent font-bold'
                          : 'bg-panel text-muted border-line'
                      }`}
                    >
                      S/ 0 (Recojo Tienda)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateShippingLima({ courier: 'MOTORIZADO_EXPRESS' });
                        setShippingCost(10);
                      }}
                      className={`px-1.5 py-0.5 border cursor-pointer ${
                        shippingCost === 10
                          ? 'bg-accent text-white border-accent font-bold'
                          : 'bg-panel text-muted border-line'
                      }`}
                    >
                      S/ 10 (Estándar)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateShippingLima({ courier: 'MOTORIZADO_EXPRESS' });
                        setShippingCost(15);
                      }}
                      className={`px-1.5 py-0.5 border cursor-pointer ${
                        shippingCost === 15
                          ? 'bg-accent text-white border-accent font-bold'
                          : 'bg-panel text-muted border-line'
                      }`}
                    >
                      S/ 15 (Express)
                    </button>
                    <div className="relative w-16">
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8.5px] text-muted">S/</span>
                      <input
                        type="number"
                        value={shippingCost || ''}
                        placeholder="0"
                        onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                        className="w-full bg-panel border border-line text-[10px] font-mono font-bold py-0.5 pl-5 pr-1 text-ink focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SPECIALIZED FORM 2: ENVÍO PROVINCIA */}
            {destinationType === 'PROVINCIA' && (
              <div className="bg-panel border border-purple-500/30 p-2.5 space-y-2.5 rounded-xs">
                {/* Form Header */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-line pb-1.5">
                  <div className="flex items-center gap-1.5 text-purple-400 font-mono text-[10.5px] font-bold uppercase">
                    <Package className="w-3.5 h-3.5 text-purple-400" />
                    <span>📦 FORMULARIO DE ENVÍO – VANTA</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyEmptyTemplate('PROVINCIA')}
                      className="px-2 py-0.5 bg-paper hover:bg-zinc-800 text-muted hover:text-ink border border-line text-[9px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copiar plantilla vacía para WhatsApp"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>Copiar Plantilla</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPasteModalText('');
                        setPasteModalType('PROVINCIA');
                      }}
                      className="px-2 py-0.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Pegar mensaje de WhatsApp para auto-completar"
                    >
                      <Clipboard className="w-2.5 h-2.5" />
                      <span>Pegar de WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* 🚚 Transporte Selector */}
                <div className="space-y-1 bg-paper p-1.5 border border-line">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-purple-300 font-bold uppercase">🚚 Transporte:</span>
                    <span className="text-muted font-bold">
                      {shippingProvincia.agency === 'OTRA' ? (shippingProvincia.otherAgencyName || 'OTRA') : shippingProvincia.agency}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
                    {[
                      { id: 'SHALOM' as const, label: '★ SHALOM' },
                      { id: 'OLVA_COURIER' as const, label: 'OLVA' },
                      { id: 'MARVISUR' as const, label: 'MARVISUR' },
                      { id: 'CIVA' as const, label: 'CIVA' },
                      { id: 'FLORES' as const, label: 'FLORES' },
                      { id: 'OTRA' as const, label: 'OTRA' },
                    ].map((ag) => (
                      <button
                        key={ag.id}
                        type="button"
                        onClick={() => updateShippingProvincia({ agency: ag.id })}
                        className={`py-1 text-[9px] font-mono font-bold border transition-colors cursor-pointer text-center ${
                          shippingProvincia.agency === ag.id
                            ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                            : 'bg-paper text-muted hover:text-ink border-line'
                        }`}
                      >
                        {ag.label}
                      </button>
                    ))}
                  </div>
                  {shippingProvincia.agency === 'OTRA' && (
                    <input
                      type="text"
                      placeholder="Nombre de la agencia de transporte (ej: Expreso Ancash, Molina...)"
                      value={shippingProvincia.otherAgencyName || ''}
                      onChange={(e) => updateShippingProvincia({ otherAgencyName: e.target.value })}
                      className="w-full bg-panel border border-line text-[10px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-purple-400 mt-1"
                    />
                  )}
                </div>

                {/* 1. Nombres y apellidos + DNI + Celular */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5">
                  <div className="sm:col-span-5">
                    <label className="block text-[9px] font-mono text-muted uppercase font-bold mb-0.5">
                      👤 Nombres y apellidos:
                    </label>
                    <input
                      type="text"
                      placeholder="Quien retira en agencia"
                      value={shippingProvincia.consigneeName}
                      onChange={(e) => updateShippingProvincia({ consigneeName: e.target.value })}
                      className="w-full bg-paper border border-line text-[10.5px] font-mono py-1 px-2 text-ink font-semibold focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[9px] font-mono text-purple-400 uppercase font-bold mb-0.5">
                      🪪 DNI:
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      placeholder="8 dígitos"
                      value={shippingProvincia.consigneeDni}
                      onChange={(e) =>
                        updateShippingProvincia({
                          consigneeDni: e.target.value.replace(/[^0-9]/g, ''),
                        })
                      }
                      className="w-full bg-paper border border-purple-500/50 text-[10.5px] font-mono font-bold py-1 px-2 text-purple-300 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[9px] font-mono text-muted uppercase font-bold mb-0.5">
                      📱 Celular:
                    </label>
                    <input
                      type="text"
                      placeholder="9 dígitos"
                      value={shippingProvincia.consigneePhone}
                      onChange={(e) =>
                        updateShippingProvincia({
                          consigneePhone: e.target.value.replace(/[^0-9]/g, ''),
                        })
                      }
                      className="w-full bg-paper border border-line text-[10.5px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* 2. Departamento / Provincia / Distrito */}
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[9px] font-mono text-muted uppercase font-bold">
                      📍 Departamento / Provincia / Distrito:
                    </label>
                    <select
                      onChange={(e) => {
                        const dep = e.target.value;
                        if (!dep) return;
                        updateShippingProvincia({
                          department: dep,
                          departmentProvinceDistrict: shippingProvincia.departmentProvinceDistrict
                            ? `${dep} / ${shippingProvincia.departmentProvinceDistrict.split('/').slice(1).join('/').trim()}`
                            : `${dep} / `
                        });
                      }}
                      className="bg-paper border border-line text-[9px] font-mono px-1 py-0.5 text-muted hover:text-ink cursor-pointer"
                    >
                      <option value="">Región rápida...</option>
                      {PERU_DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Ej: Junín / Huancayo / El Tambo (o Cusco / San Jerónimo)"
                    value={shippingProvincia.departmentProvinceDistrict || ''}
                    onChange={(e) => updateShippingProvincia({ departmentProvinceDistrict: e.target.value })}
                    className="w-full bg-paper border border-line text-[10.5px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-purple-400 font-semibold"
                  />
                </div>

                {/* 3. Agencia Shalom / Transporte donde recogerás tu pedido */}
                <div>
                  <label className="block text-[9px] font-mono text-muted uppercase font-bold mb-0.5">
                    🏢 Agencia {shippingProvincia.agency === 'OTRA' ? (shippingProvincia.otherAgencyName || 'de Transporte') : shippingProvincia.agency === 'SHALOM' ? 'Shalom' : shippingProvincia.agency} donde recogerás tu pedido:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Shalom Huancayo Ferrocarril / Sede Central / Agencia Grau..."
                    value={shippingProvincia.agencyBranch || ''}
                    onChange={(e) => updateShippingProvincia({ agencyBranch: e.target.value })}
                    className="w-full bg-paper border border-line text-[10.5px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-purple-400 font-semibold"
                  />
                </div>

                {/* Freight Payment Mode */}
                <div className="bg-paper p-1.5 border border-line space-y-1.5">
                  <div className="flex items-center justify-between text-[9.5px] font-mono">
                    <span className="text-muted uppercase font-bold">Modalidad del Flete:</span>
                    <span className="text-purple-400 font-bold">
                      {shippingProvincia.freightPayment === 'PAGO_DESTINO'
                        ? '🏷️ Pago en Destino (S/ 0 en comprobante)'
                        : '💳 Flete Pagado en la Venta'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        updateShippingProvincia({ freightPayment: 'PAGO_DESTINO' });
                        setShippingCost(0);
                      }}
                      className={`flex-1 py-1 px-2 text-[9px] font-mono font-bold border cursor-pointer text-center ${
                        shippingProvincia.freightPayment === 'PAGO_DESTINO'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                          : 'bg-panel text-muted border-line hover:text-ink'
                      }`}
                    >
                      ✓ PAGO EN DESTINO (Cliente paga al recoger en agencia)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateShippingProvincia({ freightPayment: 'PAGADO' });
                        if (shippingCost === 0) setShippingCost(15);
                      }}
                      className={`py-1 px-2 text-[9px] font-mono font-bold border cursor-pointer text-center ${
                        shippingProvincia.freightPayment === 'PAGADO'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                          : 'bg-panel text-muted border-line hover:text-ink'
                      }`}
                    >
                      FLETE PAGADO
                    </button>
                  </div>

                  {shippingProvincia.freightPayment === 'PAGADO' && (
                    <div className="flex items-center justify-between pt-1 border-t border-line text-[10px] font-mono">
                      <span className="text-muted">Monto de Flete Cobrado:</span>
                      <div className="flex items-center gap-1">
                        {[15, 20, 25].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setShippingCost(amt)}
                            className={`px-1.5 py-0.5 border cursor-pointer ${
                              shippingCost === amt
                                ? 'bg-purple-600 text-white border-purple-500 font-bold'
                                : 'bg-panel text-muted border-line'
                            }`}
                          >
                            S/ {amt}
                          </button>
                        ))}
                        <div className="relative w-16">
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[8.5px] text-muted">S/</span>
                          <input
                            type="number"
                            value={shippingCost || ''}
                            placeholder="0"
                            onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                            className="w-full bg-panel border border-line text-[10px] font-mono font-bold py-0.5 pl-5 pr-1 text-ink focus:outline-none focus:border-purple-400"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional Clave de Retiro */}
                  <div className="pt-1">
                    <input
                      type="text"
                      placeholder="Clave de retiro de encomienda (Opcional, si la agencia lo requiere)"
                      value={shippingProvincia.claveRetiro || ''}
                      onChange={(e) => updateShippingProvincia({ claveRetiro: e.target.value })}
                      className="w-full bg-panel border border-line text-[9.5px] font-mono py-1 px-2 text-ink focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Observations input */}
            <input
              type="text"
              placeholder="Observaciones de la venta / notas de empaque y rotulado (Opcional)..."
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

            {/* Adelanto & Saldo Pendiente (Cuenta de la Venta) Card */}
            <div className="bg-panel border border-line p-3 space-y-2.5 mt-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono uppercase font-bold text-accent tracking-wider flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-accent" />
                  ADELANTO Y SALDO (PAGO A CUENTA):
                </span>
                {isAdvanceMode && effectivePendingBalance > 0 && (
                  <span className="text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5">
                    CON SALDO PENDIENTE
                  </span>
                )}
              </div>

              {/* Mode Toggle Buttons */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAdvanceMode(false)}
                  className={`py-1.5 px-2 text-[10px] font-mono uppercase font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    !isAdvanceMode
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 font-black shadow-xs'
                      : 'bg-paper text-muted border-line hover:text-ink hover:bg-paper-soft'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>Pago Total (100%)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAdvanceMode(true);
                    if (!customAdvanceAmount) {
                      setCustomAdvanceAmount(Math.round(totalAmount * 0.5).toString());
                    }
                  }}
                  className={`py-1.5 px-2 text-[10px] font-mono uppercase font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    isAdvanceMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-black shadow-xs'
                      : 'bg-paper text-muted border-line hover:text-ink hover:bg-paper-soft'
                  }`}
                >
                  <Coins className="w-3 h-3" />
                  <span>Con Adelanto / A Cuenta</span>
                </button>
              </div>

              {/* Expanded details when isAdvanceMode is true */}
              {isAdvanceMode && (
                <div className="space-y-2 pt-1 border-t border-line/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9.5px] font-mono uppercase tracking-wider text-muted mb-1 font-bold">
                        Monto de Adelanto (S/):
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-400">
                          S/
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={customAdvanceAmount}
                          placeholder={Math.round(totalAmount * 0.5).toString()}
                          onChange={(e) => setCustomAdvanceAmount(e.target.value)}
                          className="w-full bg-paper border border-amber-500/60 focus:border-amber-400 py-1 pl-7 pr-2 text-xs font-mono font-black text-amber-300 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-paper border border-line p-1.5 flex flex-col justify-center">
                      <span className="text-[8.5px] font-mono uppercase tracking-wider text-muted">
                        Saldo Pendiente:
                      </span>
                      <span className="font-mono text-sm font-black text-rose-500">
                        S/ {effectivePendingBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[8.5px] font-mono text-muted uppercase mr-0.5">Atajos:</span>
                    <button
                      type="button"
                      onClick={() => setCustomAdvanceAmount(Math.round(totalAmount * 0.5).toString())}
                      className="text-[9px] font-mono px-1.5 py-0.5 bg-paper hover:bg-zinc-700 text-amber-300 border border-amber-500/30 cursor-pointer font-bold"
                    >
                      50% (S/ {Math.round(totalAmount * 0.5)})
                    </button>
                    {[20, 30, 50, 70, 100].map((amt) => {
                      if (amt >= totalAmount) return null;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setCustomAdvanceAmount(amt.toString())}
                          className="text-[9px] font-mono px-1.5 py-0.5 bg-paper hover:bg-zinc-700 text-ink border border-line cursor-pointer"
                        >
                          S/ {amt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Receiving Account selector */}
                  <div>
                    <label className="block text-[9.5px] font-mono uppercase tracking-wider text-muted mb-1 font-bold">
                      Cuenta Receptora / Banco de la Venta:
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      {VANTA_BANK_ACCOUNTS.map((acc) => {
                        const isAccSelected = selectedReceivingAccount === acc.id;
                        return (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => setSelectedReceivingAccount(acc.id)}
                            className={`p-1.5 text-left text-[9px] font-mono border transition-all cursor-pointer truncate ${
                              isAccSelected
                                ? 'bg-accent/15 text-accent border-accent font-bold'
                                : 'bg-paper text-muted border-line hover:text-ink hover:border-zinc-500'
                            }`}
                            title={`${acc.name} - ${acc.holder}`}
                          >
                            <div className="font-bold truncate">{acc.name}</div>
                            <div className="text-[8px] text-muted truncate">{acc.number}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* One-Click Actions: Emit Nota de Venta A4 & Copy WhatsApp */}
              <div className="pt-1.5 space-y-1.5">
                <button
                  id="pos-direct-emit-a4-btn"
                  type="button"
                  onClick={() => handleCreateNotaVentaDirect('A4')}
                  disabled={cartItems.length === 0}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-rose-950/30 rounded-xs"
                  title="Crear y registrar inmediatamente la Nota de Venta en el sistema y abrir para descargar en formato A4 (PDF)"
                >
                  <FileText className="w-4 h-4" />
                  <span>CREAR NOTA DE VENTA Y DESCARGAR A4</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySaleAccount}
                  disabled={cartItems.length === 0}
                  className="w-full bg-paper hover:bg-paper-soft text-ink hover:text-accent border border-line hover:border-accent text-[10px] font-mono uppercase font-bold py-2 px-3 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                  title="Copiar resumen comercial de la venta con cuentas bancarias para enviar al cliente por WhatsApp"
                >
                  <Copy className="w-3.5 h-3.5 text-accent" />
                  <span>COPIAR CUENTA DE LA VENTA (WHATSAPP)</span>
                </button>
                {copySaleAccountFeedback && (
                  <span className="block text-[9.5px] font-mono text-emerald-400 font-bold text-center mt-0.5 animate-fade-in">
                    {copySaleAccountFeedback}
                  </span>
                )}
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
                onClick={() => {
                  if (lastCompletedSale) {
                    setIsProformaModalOpen(true);
                  } else {
                    handleCreateNotaVentaDirect('A4');
                  }
                }}
                className="flex-1 bg-panel hover:bg-paper border border-line hover:border-accent hover:text-accent text-ink font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-3 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                title="Emitir y ver Nota de Venta oficial en Formato A4 (PDF)"
              >
                <FileText className="w-4 h-4 text-accent" />
                <span>NOTA DE VENTA A4</span>
              </button>
            </div>

            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={() => setIsPaymentModalOpen(true)}
              className={`w-full ${
                isAdvanceMode && effectivePendingBalance > 0
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-accent hover:bg-rose-600 text-white'
              } disabled:bg-panel disabled:text-muted disabled:cursor-not-allowed font-mono text-xs font-bold uppercase tracking-wider py-3.5 px-4 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer`}
            >
              <CreditCard className="w-4 h-4" />
              {isAdvanceMode && effectivePendingBalance > 0 ? (
                <span>
                  COBRAR ADELANTO S/ {effectiveAdvanceAmount.toFixed(2)} (SALDO: S/ {effectivePendingBalance.toFixed(2)})
                </span>
              ) : (
                <span>COBRAR S/ {totalAmount.toFixed(2)} (F4)</span>
              )}
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
        initialIsAdvance={isAdvanceMode}
        initialAdvanceAmount={effectiveAdvanceAmount}
        initialAccountId={selectedReceivingAccount}
      />

      {/* POSTicket Modal */}
      <POSTicketModal
        isOpen={isTicketModalOpen}
        sale={lastCompletedSale}
        onClose={() => setIsTicketModalOpen(false)}
        onNewSale={handleNewSale}
      />

      {/* POS Nota de Venta / Proforma A4 Modal */}
      <POSProformaModal
        isOpen={isProformaModalOpen}
        onClose={() => setIsProformaModalOpen(false)}
        items={lastCompletedSale?.items || cartItems}
        customer={lastCompletedSale?.customer || customer}
        destinationType={lastCompletedSale?.destinationType || destinationType}
        shippingCost={lastCompletedSale?.shippingCost ?? shippingCost}
        discountAmount={lastCompletedSale?.discountAmount ?? computedDiscount}
        totalAmount={lastCompletedSale?.totalAmount ?? totalAmount}
        sellerName={lastCompletedSale?.sellerName || getActiveSeller()}
        existingReceiptNumber={lastCompletedSale?.receiptNumber || nextReceiptNumber}
        receiptType={lastCompletedSale?.receiptType || receiptType}
        isCompletedSale={Boolean(lastCompletedSale)}
        shippingInfo={
          lastCompletedSale?.shippingInfo || {
            destination: destinationType,
            shippingCost: shippingCost,
            lima: destinationType === 'LIMA' ? shippingLima : undefined,
            provincia: destinationType === 'PROVINCIA' ? shippingProvincia : undefined,
          }
        }
        advanceAmount={
          lastCompletedSale?.advanceAmount !== undefined
            ? lastCompletedSale.advanceAmount
            : isAdvanceMode
            ? effectiveAdvanceAmount
            : undefined
        }
        pendingBalance={
          lastCompletedSale?.pendingBalance !== undefined
            ? lastCompletedSale.pendingBalance
            : isAdvanceMode
            ? effectivePendingBalance
            : undefined
        }
        isAdvancePayment={
          lastCompletedSale?.isAdvancePayment ??
          (isAdvanceMode && effectivePendingBalance > 0)
        }
        paymentAccountId={lastCompletedSale?.paymentAccountId || selectedReceivingAccount}
        paymentAccountLabel={
          lastCompletedSale?.paymentAccountLabel ||
          VANTA_BANK_ACCOUNTS.find((a) => a.id === selectedReceivingAccount)?.name
        }
        observations={lastCompletedSale?.observations || observations}
        onOpenTicket={() => {
          setIsProformaModalOpen(false);
          setIsTicketModalOpen(true);
        }}
        onNewSale={handleNewSale}
        onRegisterSale={() => handleCreateNotaVentaDirect('A4')}
      />

      {/* WhatsApp Quick Paste Auto-Fill Modal */}
      {pasteModalType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0e0e15] border border-zinc-700 p-5 text-white shadow-2xl space-y-4 rounded-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2 text-accent font-mono text-xs font-bold uppercase">
                <Clipboard className="w-4 h-4 text-accent" />
                <span>Pegar datos desde WhatsApp — {pasteModalType === 'PROVINCIA' ? 'Envío Provincia' : 'Envío Lima'}</span>
              </div>
              <button
                type="button"
                onClick={() => setPasteModalType(null)}
                className="text-zinc-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] font-mono text-zinc-400">
              Pega a continuación el mensaje que te envió el cliente con sus datos. El sistema extraerá automáticamente el nombre, celular, DNI, dirección o agencia:
            </p>

            <textarea
              rows={7}
              value={pasteModalText}
              onChange={(e) => setPasteModalText(e.target.value)}
              placeholder={pasteModalType === 'PROVINCIA' ? PROVINCIA_EMPTY_TEMPLATE : LIMA_EMPTY_TEMPLATE}
              className="w-full bg-[#161622] border border-zinc-700 p-2.5 text-xs font-mono text-white focus:outline-none focus:border-accent"
              autoFocus
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    if (text) setPasteModalText(text);
                  } catch (err) {
                    console.error('Clipboard access denied', err);
                  }
                }}
                className="text-[10.5px] font-mono text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Clipboard className="w-3 h-3" />
                <span>Pegar desde Portapapeles</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasteModalText('');
                    setPasteModalType(null);
                  }}
                  className="px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white border border-zinc-700 bg-zinc-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyPastedText}
                  disabled={!pasteModalText.trim()}
                  className="px-4 py-1.5 text-xs font-mono font-bold text-white bg-accent hover:bg-rose-500 disabled:opacity-50 cursor-pointer shadow-md"
                >
                  ✓ Auto-completar Formulario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copy Feedback Toast */}
      {copyFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-mono text-xs px-4 py-2.5 shadow-2xl rounded-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{copyFeedback}</span>
        </div>
      )}
    </div>
  );
}
