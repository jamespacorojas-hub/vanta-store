export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  description: string;
  fabricDetails: string;
  images: string[];
  /** Real garment photos by fabric then color, e.g. colorImages['Jersey']['Azul']. Only set for lines with a PRODUCTOS/ photo set. */
  colorImages?: Record<string, Record<string, string>>;
  colors: string[];
  sizes: string[];
  tags: string[]; // e.g., "Nuevo", "Oferta", "Últimas unidades"
  stock: number;
  fabrics: string[];
  sleeves: string[];
}

export interface SaleProduct extends Product {
  discountPct: number;
  savingsAmount: number;
}

export interface CartItem {
  id: string; // unique cart identifier, e.g. productID + color + size + fabric + sleeve
  product: Product;
  selectedColor: string;
  selectedSize: string;
  selectedFabric?: string;
  selectedSleeve?: string;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  onlyInStock: boolean;
  sortBy: 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'sale';
}

export interface OrderDetails {
  customerName: string;
  district: string;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
