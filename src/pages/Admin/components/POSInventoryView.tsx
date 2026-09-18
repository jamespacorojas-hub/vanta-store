import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Package,
  Download,
  MessageCircle,
  Check,
  Copy,
  AlertTriangle,
  ExternalLink,
  Eye,
  Plus,
  Minus,
  RefreshCw,
  FileSpreadsheet,
  Share2,
  Send,
  Smartphone,
  X,
  Layers,
  Sparkles,
  Filter,
  CheckCircle2,
  Tag,
  ArrowDownToLine,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PRODUCTS } from '../../../data';
import { Product } from '../../../types';
import productImageManifest from '../../../data/productImageManifest.json';

// Local storage key for dynamic stock overrides
const POS_STOCK_STORAGE_KEY = 'vanta_pos_stock_overrides';

export default function POSInventoryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  // Stock overrides saved in localStorage
  const [stockOverrides, setStockOverrides] = useState<{ [productId: string]: number }>(() => {
    try {
      const saved = localStorage.getItem(POS_STOCK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save stock overrides on change
  useEffect(() => {
    localStorage.setItem(POS_STOCK_STORAGE_KEY, JSON.stringify(stockOverrides));
  }, [stockOverrides]);

  // Active color selected per product for preview & download
  const [selectedColors, setSelectedColors] = useState<{ [productId: string]: string }>({
    camisa: 'Negro',
    camisero: 'Cemento',
    'manga-larga': 'Vino',
    clasico: 'Denim',
    notch: 'Botella',
    polera: 'Melange Oscuro',
  });

  // Active fabric selected per product
  const [selectedFabrics, setSelectedFabrics] = useState<{ [productId: string]: string }>({
    camisa: 'jersey',
    camisero: 'jersey',
    'manga-larga': 'jersey',
    clasico: 'jersey',
    notch: 'jersey',
    polera: 'jersey',
  });

  // Modal Lightbox for Fullscreen Image Zoom
  const [inspectImage, setInspectImage] = useState<{ url: string; name: string; color: string } | null>(null);

  // WhatsApp quick-dispatch modal
  const [whatsAppModalItem, setWhatsAppModalItem] = useState<{
    product: Product;
    color: string;
    fabric: string;
    imageUrl: string;
  } | null>(null);
  const [clientPhoneNumber, setClientPhoneNumber] = useState('');

  // Toast notifications
  const [actionToast, setActionToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  const categories = ['TODOS', 'Camisa', 'Camisero', 'Manga Larga', 'Clásico', 'Notch', 'Polera'];

  // Calculate actual stock of a product considering overrides
  const getProductStock = (product: Product) => {
    if (stockOverrides[product.id] !== undefined) {
      return stockOverrides[product.id];
    }
    return product.stock;
  };

  // Adjust stock (+ / -)
  const handleAdjustStock = (productId: string, delta: number) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const current = getProductStock(product);
    const updated = Math.max(0, current + delta);
    setStockOverrides((prev) => ({
      ...prev,
      [productId]: updated,
    }));
    showToast(`Stock actualizado para ${product.name}: ${updated} unds.`);
  };

  // Reset stock overrides
  const handleResetStock = () => {
    if (window.confirm('¿Deseas restablecer el stock a los valores originales de fábrica?')) {
      setStockOverrides({});
      localStorage.removeItem(POS_STOCK_STORAGE_KEY);
      showToast('Stock restablecido a valores por defecto.');
    }
  };

  // Resolve Image URL for a product, fabric and color
  const resolveGarmentImage = (productId: string, fabric: string, color: string, fallback: string) => {
    const manifest = productImageManifest as Record<string, Record<string, Record<string, string>>>;
    if (manifest[productId]) {
      const fabricKey = fabric.toLowerCase();
      if (manifest[productId][fabricKey] && manifest[productId][fabricKey][color]) {
        return manifest[productId][fabricKey][color];
      }
      // Check first available fabric
      const firstFabric = Object.keys(manifest[productId])[0];
      if (firstFabric && manifest[productId][firstFabric][color]) {
        return manifest[productId][firstFabric][color];
      }
    }
    return fallback;
  };

  // Download image directly to user's device
  const handleDownloadImage = async (imageUrl: string, filename: string) => {
    showToast(`Descargando imagen: ${filename}...`);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      showToast(`✅ Imagen descargada: ${filename}`);
    } catch {
      // Fallback
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`✅ Abriendo imagen para guardar: ${filename}`);
    }
  };

  // Download all available photos for a garment in sequence
  const handleDownloadAllPhotos = async (product: Product) => {
    const manifest = productImageManifest as Record<string, Record<string, Record<string, string>>>;
    const fabric = (selectedFabrics[product.id] || 'jersey').toLowerCase();
    const colorsList = product.colors.slice(0, 10);

    showToast(`Iniciando descarga masiva de ${colorsList.length} fotos de ${product.name}...`);

    for (let i = 0; i < colorsList.length; i++) {
      const color = colorsList[i];
      let imgUrl = product.images[0];
      if (manifest[product.id] && manifest[product.id][fabric] && manifest[product.id][fabric][color]) {
        imgUrl = manifest[product.id][fabric][color];
      }
      const filename = `VANTA_${product.name.replace(/\s+/g, '_')}_${color}.png`;
      await handleDownloadImage(imgUrl, filename);
      // Small pause between downloads
      await new Promise((r) => setTimeout(r, 400));
    }
    showToast(`🎉 ¡Descargadas ${colorsList.length} fotos de ${product.name}!`);
  };

  // Build formatted WhatsApp message for client
  const buildWhatsAppSpecMessage = (product: Product, color: string, fabric: string, imageUrl: string) => {
    const stock = getProductStock(product);
    const stockText = stock > 0 ? `Disponible (${stock} unds en tienda)` : 'Bajo pedido';
    const origin = window.location.origin;
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${origin}${imageUrl}`;

    return `🔥 *VANTA STUDIO — ${product.name.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
🏷️ *Precio:* S/ ${product.price.toFixed(2)} ${product.promoBadge ? `(${product.promoBadge})` : ''}
${product.promoSavings ? `⚡ *Ahorro:* ${product.promoSavings}\n` : ''}🧵 *Tejido:* ${fabric.toUpperCase()} (Algodón Peruano peinado)
🎨 *Color consultado:* ${color}
📏 *Tallas confeccionadas:* ${product.sizes.join(' · ')}
📦 *Stock en almacén:* ${stockText}
✨ *Detalle:* ${product.description.slice(0, 110)}...

💳 *Medios de Pago Oficiales:* Agora Pay y Oh! Pay (Acepta Yape, Plin y transferencias CCI desde BCP, BBVA, Interbank, etc.)
🚚 *Envíos:* Motorizado Express Lima 24h / Provincias por Olva Courier y Shalom Diario.

📸 *Foto en alta resolución:*
${fullImageUrl}
━━━━━━━━━━━━━━━━━━━━
¿Te gustaría separarlo en alguna talla en específico?`;
  };

  // Copy WhatsApp snippet
  const handleCopyWhatsAppSpec = (product: Product, color: string, fabric: string, imageUrl: string) => {
    const text = buildWhatsAppSpecMessage(product, color, fabric, imageUrl);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('📋 ¡Ficha técnica copiada lista para pegar en WhatsApp!');
    }
  };

  // Quick Action: Download Image + Copy WhatsApp message in one click
  const handleQuickDownloadAndCopy = (product: Product, color: string, fabric: string, imageUrl: string) => {
    const filename = `VANTA_${product.name.replace(/\s+/g, '_')}_${color}.png`;
    handleDownloadImage(imageUrl, filename);
    handleCopyWhatsAppSpec(product, color, fabric, imageUrl);
    showToast('⚡ ¡Foto descargada y mensaje copiado al portapapeles!');
  };

  // Send directly to WhatsApp
  const handleSendToWhatsApp = (product: Product, color: string, fabric: string, imageUrl: string, phone?: string) => {
    const msg = buildWhatsAppSpecMessage(product, color, fabric, imageUrl);
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    let waUrl = '';

    if (cleanPhone) {
      const formattedPhone = cleanPhone.startsWith('51') ? cleanPhone : `51${cleanPhone}`;
      waUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(msg)}`;
    } else {
      waUrl = `https://api.whatsapp.com/send?phone=51904536406&text=${encodeURIComponent(msg)}`;
    }

    window.open(waUrl, '_blank');
  };

  // Export Stock CSV
  const handleExportStockCSV = () => {
    const headers = ['ID', 'Producto', 'Categoría', 'Precio (S/)', 'Stock Actual', 'Estado', 'Colores Disponibles'];
    const rows = PRODUCTS.map((p) => {
      const stock = getProductStock(p);
      const status = stock === 0 ? 'AGOTADO' : stock <= 5 ? 'STOCK CRÍTICO' : 'NORMAL';
      return [p.id, `"${p.name}"`, `"${p.category}"`, p.price.toFixed(2), stock, status, `"${p.colors.join(', ')}"`];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VANTA_Inventario_Stock_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📊 Reporte de Stock exportado en formato CSV');
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const stock = getProductStock(p);
      const matchCat = selectedCategory === 'TODOS' || p.category.toLowerCase() === selectedCategory.toLowerCase();

      let matchStock = true;
      if (stockFilter === 'IN_STOCK') matchStock = stock > 5;
      if (stockFilter === 'LOW_STOCK') matchStock = stock > 0 && stock <= 5;
      if (stockFilter === 'OUT_OF_STOCK') matchStock = stock === 0;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabrics.some((f) => f.toLowerCase().includes(q)) ||
        p.colors.some((c) => c.toLowerCase().includes(q));

      return matchCat && matchStock && matchSearch;
    });
  }, [searchQuery, selectedCategory, stockFilter, stockOverrides]);

  // Overall KPIs
  const totalUnits = useMemo(() => {
    return PRODUCTS.reduce((acc, p) => acc + getProductStock(p), 0);
  }, [stockOverrides]);

  const criticalStockCount = useMemo(() => {
    return PRODUCTS.filter((p) => getProductStock(p) > 0 && getProductStock(p) <= 5).length;
  }, [stockOverrides]);

  const outOfStockCount = useMemo(() => {
    return PRODUCTS.filter((p) => getProductStock(p) === 0).length;
  }, [stockOverrides]);

  const totalInventoryValue = useMemo(() => {
    return PRODUCTS.reduce((acc, p) => acc + p.price * getProductStock(p), 0);
  }, [stockOverrides]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0d14] text-zinc-100 overflow-hidden font-sans">
      {/* ── TOP KPI BAR & ACTIONS ── */}
      <div className="p-3 sm:p-4 bg-[#121422] border-b border-[#1f2338] shrink-0 space-y-2.5 sm:space-y-3">
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-2.5 sm:p-3 rounded-lg bg-[#181b2e] border border-[#262b47] flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase block truncate">Total Almacén</span>
              <span className="text-base sm:text-xl font-mono font-black text-white truncate block">{totalUnits} unds</span>
            </div>
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 opacity-80 shrink-0 ml-1" />
          </div>

          <div className="p-2.5 sm:p-3 rounded-lg bg-[#181b2e] border border-[#262b47] flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase block truncate">Valor Stock</span>
              <span className="text-base sm:text-xl font-mono font-black text-emerald-400 truncate block">
                S/ {totalInventoryValue.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
            <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 opacity-80 shrink-0 ml-1" />
          </div>

          <div className="p-2.5 sm:p-3 rounded-lg bg-[#181b2e] border border-[#262b47] flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-amber-400 uppercase block truncate">Crítico (≤ 5)</span>
              <span className="text-base sm:text-xl font-mono font-black text-amber-300 truncate block">{criticalStockCount} mod.</span>
            </div>
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 opacity-80 shrink-0 ml-1" />
          </div>

          <div className="p-2.5 sm:p-3 rounded-lg bg-[#181b2e] border border-[#262b47] flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono text-rose-400 uppercase block truncate">Agotados</span>
              <span className="text-base sm:text-xl font-mono font-black text-rose-400 truncate block">{outOfStockCount} mod.</span>
            </div>
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 opacity-80 shrink-0 ml-1" />
          </div>
        </div>

        {/* Toolbar: Search, Filters & Export */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por prenda, tela o color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181b2e] border border-[#262b47] text-base sm:text-xs font-mono py-2 pl-9 pr-3 text-white rounded focus:outline-none focus:border-rose-500 placeholder:text-zinc-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-2.5 py-1.5 text-[10.5px] font-mono uppercase tracking-wider rounded transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-[#181b2e] text-zinc-400 hover:text-white border border-[#262b47]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stock Level Filter */}
          <div className="flex items-center gap-1 bg-[#181b2e] p-0.5 rounded border border-[#262b47]">
            <button
              onClick={() => setStockFilter('ALL')}
              className={`px-2 py-1 text-[10.5px] font-mono rounded ${
                stockFilter === 'ALL' ? 'bg-[#262b47] text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStockFilter('LOW_STOCK')}
              className={`px-2 py-1 text-[10.5px] font-mono rounded ${
                stockFilter === 'LOW_STOCK' ? 'bg-amber-600/30 text-amber-300 font-bold' : 'text-zinc-400 hover:text-amber-300'
              }`}
            >
              Crítico
            </button>
            <button
              onClick={() => setStockFilter('OUT_OF_STOCK')}
              className={`px-2 py-1 text-[10.5px] font-mono rounded ${
                stockFilter === 'OUT_OF_STOCK' ? 'bg-rose-600/30 text-rose-400 font-bold' : 'text-zinc-400 hover:text-rose-400'
              }`}
            >
              Agotado
            </button>
          </div>

          {/* Export & Reset Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportStockCSV}
              className="bg-[#181b2e] hover:bg-[#262b47] text-zinc-300 hover:text-white border border-[#262b47] text-xs font-mono px-3 py-1.5 rounded flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Exportar inventario a Excel/CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exportar</span>
            </button>
            <button
              onClick={handleResetStock}
              className="bg-[#181b2e] hover:bg-[#262b47] text-zinc-400 hover:text-rose-400 border border-[#262b47] text-xs font-mono p-1.5 rounded cursor-pointer transition-colors"
              title="Restablecer stock por defecto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Toast */}
      {actionToast && (
        <div className="fixed top-20 right-6 z-50 bg-rose-600 text-white font-mono text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* ── PRODUCTS & PHOTOS HUB GRID ── */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredProducts.map((product) => {
            const stock = getProductStock(product);
            const isLowStock = stock > 0 && stock <= 5;
            const isOutOfStock = stock === 0;

            const activeColor = selectedColors[product.id] || product.colors[0];
            const activeFabric = selectedFabrics[product.id] || product.fabrics[0] || 'jersey';
            const currentImg = resolveGarmentImage(product.id, activeFabric, activeColor, product.images[0]);

            const cleanImageName = `VANTA_${product.name.replace(/\s+/g, '_')}_${activeColor}.png`;

            return (
              <div
                key={product.id}
                className="bg-[#121422] border border-[#1f2338] rounded-lg p-3 sm:p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm"
              >
                {/* Product Header Row */}
                <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                  {/* Garment Photo Preview with Touch Inspection */}
                  <div
                    onClick={() =>
                      setInspectImage({
                        url: currentImg,
                        name: product.name,
                        color: activeColor,
                      })
                    }
                    className="relative w-32 h-40 xs:w-36 xs:h-44 sm:w-40 sm:h-48 rounded bg-zinc-950 border border-[#262b47] overflow-hidden shrink-0 group cursor-pointer"
                  >
                    <img
                      src={currentImg}
                      alt={`${product.name} - ${activeColor}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Small Left Arrow to change color */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const idx = product.colors.indexOf(activeColor);
                        const prev = idx <= 0 ? product.colors.length - 1 : idx - 1;
                        setSelectedColors((prevMap) => ({ ...prevMap, [product.id]: product.colors[prev] }));
                      }}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-black/75 hover:bg-rose-600 active:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow"
                      title="Color anterior"
                      aria-label="Color anterior"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    {/* Small Right Arrow to change color */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const idx = product.colors.indexOf(activeColor);
                        const next = idx >= product.colors.length - 1 ? 0 : idx + 1;
                        setSelectedColors((prevMap) => ({ ...prevMap, [product.id]: product.colors[next] }));
                      }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-black/75 hover:bg-rose-600 active:bg-rose-600 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow"
                      title="Siguiente color"
                      aria-label="Siguiente color"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Stock Status Badge */}
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                      <span
                        className={`text-[9px] sm:text-[9.5px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded border ${
                          isOutOfStock
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                            : isLowStock
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}
                      >
                        {isOutOfStock ? 'Agotado' : isLowStock ? `Crítico (${stock})` : `${stock} unds`}
                      </span>
                    </div>

                    {/* Mobile Tap Zoom Hint */}
                    <div className="absolute top-1.5 right-1.5 sm:hidden bg-black/70 p-1 rounded-full text-white/90">
                      <Eye className="w-3 h-3" />
                    </div>

                    {/* Image Action Overlay (Desktop Hover) */}
                    <div className="hidden sm:flex absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex-col items-center justify-center gap-2 p-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadImage(currentImg, cleanImageName);
                        }}
                        className="w-full bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-mono font-bold py-1 px-2 rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow"
                      >
                        <Download className="w-3.5 h-3.5" /> Descargar
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectImage({
                            url: currentImg,
                            name: product.name,
                            color: activeColor,
                          });
                        }}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-mono py-1 px-2 rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver en Grande
                      </button>
                    </div>

                    {/* Bottom Tag */}
                    <div className="absolute bottom-1 left-1 right-1 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] sm:text-[9.5px] font-mono text-zinc-300 text-center truncate border border-white/5">
                      {activeColor}
                    </div>
                  </div>

                  {/* Product Details & Rapid Actions */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      {/* Category & Price */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[9.5px] sm:text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold block truncate">
                            {product.category}
                          </span>
                          <h3 className="font-display font-black text-sm sm:text-lg text-white uppercase truncate">
                            {product.name}
                          </h3>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-mono text-sm sm:text-base font-black text-white">
                            S/ {product.price.toFixed(2)}
                          </div>
                          {product.promoBadge && (
                            <span className="text-[9px] sm:text-[9.5px] font-mono text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 block mt-0.5">
                              {product.promoBadge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Real-time Stock Editor Controls */}
                      <div className="mt-2 sm:mt-2.5 p-2 rounded bg-[#181b2e] border border-[#262b47] flex items-center justify-between gap-2">
                        <div className="text-[10.5px] sm:text-[11px] font-mono text-zinc-300 truncate">
                          Stock: <b className="text-white text-xs">{stock}</b> unds.
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleAdjustStock(product.id, -1)}
                            className="w-7 h-7 sm:w-6 sm:h-6 rounded bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-700 text-white flex items-center justify-center text-xs cursor-pointer"
                            title="Disminuir 1 und"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                          </button>
                          <button
                            onClick={() => handleAdjustStock(product.id, +1)}
                            className="w-7 h-7 sm:w-6 sm:h-6 rounded bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white flex items-center justify-center text-xs cursor-pointer"
                            title="Aumentar 1 und"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                          </button>
                          <button
                            onClick={() => handleAdjustStock(product.id, +5)}
                            className="px-2 h-7 sm:h-6 rounded bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-700 text-zinc-300 text-[10px] font-mono flex items-center justify-center cursor-pointer"
                            title="Ingreso de +5 unds"
                          >
                            +5
                          </button>
                        </div>
                      </div>

                      {/* Fabric Selector */}
                      <div className="mt-2">
                        <span className="text-[9px] sm:text-[9.5px] font-mono text-zinc-400 uppercase block mb-1">
                          Tela para la ficha:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.fabrics.map((fab) => (
                            <button
                              key={fab}
                              onClick={() =>
                                setSelectedFabrics((prev) => ({
                                  ...prev,
                                  [product.id]: fab,
                                }))
                              }
                              className={`px-2 py-0.5 rounded text-[9.5px] sm:text-[10px] font-mono cursor-pointer transition-colors ${
                                activeFabric.toLowerCase() === fab.toLowerCase()
                                  ? 'bg-zinc-200 text-black font-bold'
                                  : 'bg-[#181b2e] text-zinc-400 hover:text-white border border-[#262b47]'
                              }`}
                            >
                              {fab}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Garment Color Swatches for Rapid Photo Switching */}
                    <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[#1f2338]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9.5px] sm:text-[10px] font-mono text-zinc-400 uppercase font-bold truncate">
                          Colores ({product.colors.length}): Clic para ver
                        </span>
                        <button
                          onClick={() => handleDownloadAllPhotos(product)}
                          className="text-[9.5px] sm:text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer shrink-0 ml-1"
                          title="Descargar todas las fotos de este modelo"
                        >
                          <ArrowDownToLine className="w-3 h-3" /> Pack Completo
                        </button>
                      </div>

                      <div className="flex flex-nowrap sm:flex-wrap gap-1 overflow-x-auto sm:max-h-20 sm:overflow-y-auto no-scrollbar py-0.5 touch-pan-x">
                        {product.colors.map((col) => {
                          const isSelected = activeColor.toLowerCase() === col.toLowerCase();
                          return (
                            <button
                              key={col}
                              onClick={() =>
                                setSelectedColors((prev) => ({
                                  ...prev,
                                  [product.id]: col,
                                }))
                              }
                              className={`shrink-0 px-2 py-0.5 rounded text-[9.5px] sm:text-[10px] font-mono cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-rose-600 text-white font-bold ring-1 ring-white/60 shadow'
                                  : 'bg-[#181b2e] text-zinc-400 hover:text-white border border-[#262b47]'
                              }`}
                            >
                              {col}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick-Dispatch Bar for Sales Reps */}
                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#1f2338] grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* 1. Download Current Photo */}
                  <button
                    onClick={() => handleDownloadImage(currentImg, cleanImageName)}
                    className="bg-[#181b2e] hover:bg-[#262b47] active:bg-[#262b47] text-zinc-200 text-xs font-mono py-2.5 px-3 rounded flex items-center justify-center gap-1.5 border border-[#262b47] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-rose-400" />
                    <span>Descargar Foto</span>
                  </button>

                  {/* 2. Copy WhatsApp Text */}
                  <button
                    onClick={() => handleCopyWhatsAppSpec(product, activeColor, activeFabric, currentImg)}
                    className="bg-[#181b2e] hover:bg-[#262b47] active:bg-[#262b47] text-zinc-200 text-xs font-mono py-2.5 px-3 rounded flex items-center justify-center gap-1.5 border border-[#262b47] transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-sky-400" />
                    <span>Copiar Ficha WA</span>
                  </button>

                  {/* 3. Send to Client WhatsApp Modal */}
                  <button
                    onClick={() =>
                      setWhatsAppModalItem({
                        product,
                        color: activeColor,
                        fabric: activeFabric,
                        imageUrl: currentImg,
                      })
                    }
                    className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-mono font-bold py-2.5 px-3 rounded flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Enviar a Cliente</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODAL: ENVIAR RÁPIDO A CLIENTE POR WHATSAPP ── */}
      {whatsAppModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#141624] border border-[#242844] rounded-xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-emerald-600 flex items-center justify-center text-white">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-white uppercase">
                    Despacho WhatsApp al Cliente
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-400">
                    {whatsAppModalItem.product.name} — Color: {whatsAppModalItem.color}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsAppModalItem(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Phone Number Input */}
            <div>
              <label className="text-xs font-mono text-zinc-300 block mb-1">
                Número de WhatsApp del Cliente (9 dígitos):
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="tel"
                    placeholder="Ej: 987654321"
                    value={clientPhoneNumber}
                    onChange={(e) => setClientPhoneNumber(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 text-base sm:text-xs font-mono py-2.5 pl-9 pr-3 text-white rounded focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() =>
                    handleSendToWhatsApp(
                      whatsAppModalItem.product,
                      whatsAppModalItem.color,
                      whatsAppModalItem.fabric,
                      whatsAppModalItem.imageUrl,
                      clientPhoneNumber
                    )
                  }
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs px-4 py-2.5 rounded flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Abrir Chat
                </button>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 mt-1">
                * Si dejas el número vacío, WhatsApp te permitirá elegir el contacto de tu agenda.
              </p>
            </div>

            {/* Preview of the Formatted Text */}
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">
                Vista previa del mensaje formateado:
              </label>
              <pre className="bg-zinc-950 p-3 rounded text-[11px] font-mono text-zinc-300 max-h-40 sm:max-h-48 overflow-y-auto whitespace-pre-wrap border border-zinc-800 selection:bg-rose-600">
                {buildWhatsAppSpecMessage(
                  whatsAppModalItem.product,
                  whatsAppModalItem.color,
                  whatsAppModalItem.fabric,
                  whatsAppModalItem.imageUrl
                )}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <button
                onClick={() =>
                  handleQuickDownloadAndCopy(
                    whatsAppModalItem.product,
                    whatsAppModalItem.color,
                    whatsAppModalItem.fabric,
                    whatsAppModalItem.imageUrl
                  )
                }
                className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono py-2 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700"
              >
                <Download className="w-3.5 h-3.5 text-rose-400" />
                <span>Descargar Foto + Ficha</span>
              </button>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    handleCopyWhatsAppSpec(
                      whatsAppModalItem.product,
                      whatsAppModalItem.color,
                      whatsAppModalItem.fabric,
                      whatsAppModalItem.imageUrl
                    );
                  }}
                  className="flex-1 sm:flex-initial bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono py-2 px-3 rounded flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar
                </button>
                <button
                  onClick={() =>
                    handleSendToWhatsApp(
                      whatsAppModalItem.product,
                      whatsAppModalItem.color,
                      whatsAppModalItem.fabric,
                      whatsAppModalItem.imageUrl,
                      clientPhoneNumber
                    )
                  }
                  className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold py-2 px-4 rounded flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Enviar WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: IMAGE INSPECTION (ZOOM) ── */}
      {inspectImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <button
              onClick={() =>
                handleDownloadImage(
                  inspectImage.url,
                  `VANTA_${inspectImage.name.replace(/\s+/g, '_')}_${inspectImage.color}.png`
                )
              }
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold px-4 py-2 rounded flex items-center gap-2 cursor-pointer shadow"
            >
              <Download className="w-4 h-4" /> Descargar esta Foto
            </button>
            <button
              onClick={() => setInspectImage(null)}
              className="p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-3xl max-h-[80vh] overflow-hidden flex items-center justify-center">
            <img
              src={inspectImage.url}
              alt={inspectImage.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
            />
          </div>

          <div className="mt-3 text-center">
            <h4 className="text-white font-mono font-bold text-sm uppercase">
              {inspectImage.name} — Color: {inspectImage.color}
            </h4>
            <p className="text-zinc-500 text-xs font-mono mt-0.5">
              Presiona ESC o el botón superior para cerrar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
