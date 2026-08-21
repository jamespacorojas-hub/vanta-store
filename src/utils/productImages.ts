import { Product } from '../types';
import productImageManifest from '../data/productImageManifest.json';

const manifest = productImageManifest as Record<string, Record<string, Record<string, string>>>;

function normalizeFabric(fabric?: string): string {
  if (!fabric) return 'jersey';
  const clean = fabric.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (clean === 'pique') return 'pique';
  if (clean === 'waffle') return 'waffle';
  if (clean === 'waffer') return 'waffer';
  return 'jersey';
}

function normalizeColorName(color?: string): string {
  if (!color) return '';
  const trimmed = color.trim();
  if (/^p\.?\s*rosa$/i.test(trimmed) || /palo\s*rosa/i.test(trimmed)) return 'Palo Rosa';
  if (/^m\.?\s*oscuro$/i.test(trimmed) || /melange/i.test(trimmed)) return 'Melange Oscuro';
  if (/^marr[oó]n$/i.test(trimmed)) return 'Marrón';
  if (/botella/i.test(trimmed)) return 'Botella';
  if (/^pacay/i.test(trimmed)) return 'Pacay';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Retrieves the photo for a given product ID, fabric, and color from the manifest.
 */
export function getGarmentPhoto(productId: string, fabric?: string, color?: string): string | undefined {
  if (!productId) return undefined;
  const productKey = productId.toLowerCase().trim();
  const productData = manifest[productKey];
  if (!productData) return undefined;

  const targetFabric = normalizeFabric(fabric);
  const targetColor = normalizeColorName(color);

  if (targetColor) {
    // 1. Try exact requested fabric first
    if (productData[targetFabric] && productData[targetFabric][targetColor]) {
      return productData[targetFabric][targetColor];
    }
    // 1b. Try Marron / Marrón alternate
    if (targetColor === 'Marrón' && productData[targetFabric]?.['Marron']) {
      return productData[targetFabric]['Marron'];
    }

    // 2. Try other fabrics as fallback if not in requested fabric
    const fallbackFabrics = ['waffle', 'jersey', 'pique', 'waffer'].filter(f => f !== targetFabric);
    for (const fab of fallbackFabrics) {
      if (productData[fab] && productData[fab][targetColor]) {
        return productData[fab][targetColor];
      }
    }
  }

  // 3. First available photo in requested fabric
  if (productData[targetFabric]) {
    const colors = Object.values(productData[targetFabric]);
    if (colors.length > 0) return colors[0];
  }

  // 4. First available photo in any fabric for this garment
  for (const fab of Object.keys(productData)) {
    const colors = Object.values(productData[fab]);
    if (colors.length > 0) return colors[0];
  }

  return undefined;
}

/**
 * Retrieves the best matching image URL for a given product and color name.
 */
export function getProductImageByColor(
  product: Product,
  colorName?: string,
  preferredFabric?: string
): string | undefined {
  if (!product) return undefined;

  const targetFabric = normalizeFabric(preferredFabric);
  const targetColor = normalizeColorName(colorName);

  if (targetColor && product.colorImages) {
    const fabricMap = (product.colorImages as Record<string, Record<string, string>>)[targetFabric];
    if (fabricMap && fabricMap[targetColor]) {
      return fabricMap[targetColor];
    }
  }

  if (targetColor && product.id) {
    const fromManifest = getGarmentPhoto(product.id, targetFabric, targetColor);
    if (fromManifest) return fromManifest;
  }

  // Fallback to first available product image
  return product.images && product.images.length > 0 ? product.images[0] : undefined;
}

