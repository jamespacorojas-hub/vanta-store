import { Product } from '../types';
import productImageManifest from '../data/productImageManifest.json';

const manifest = productImageManifest as Record<string, Record<string, Record<string, string>>>;

/**
 * Retrieves the photo for a given product ID, fabric, and color from the manifest.
 */
export function getGarmentPhoto(productId: string, fabric?: string, color?: string): string | undefined {
  if (!productId) return undefined;
  const productKey = productId.toLowerCase();
  const productData = manifest[productKey];
  if (!productData) return undefined;

  if (color) {
    const fabricsToTry = fabric 
      ? [fabric.toLowerCase(), 'jersey', 'waffle', 'pique', 'waffer']
      : ['jersey', 'waffle', 'pique', 'waffer'];

    for (const fab of fabricsToTry) {
      if (productData[fab] && productData[fab][color]) {
        return productData[fab][color];
      }
    }
  }

  // First available photo in any fabric/color for this garment
  for (const fab of Object.keys(productData)) {
    const colors = Object.values(productData[fab]);
    if (colors.length > 0) return colors[0];
  }

  return undefined;
}

/**
 * Retrieves the best matching image URL for a given product and color name.
 * Falls back to available fabrics (jersey, waffle, pique, waffer) or default product images.
 */
export function getProductImageByColor(
  product: Product,
  colorName?: string,
  preferredFabric?: string
): string | undefined {
  if (!product) return undefined;

  if (colorName && product.colorImages) {
    const fabricKeys = preferredFabric
      ? [preferredFabric.toLowerCase(), 'jersey', 'waffle', 'pique', 'waffer']
      : ['jersey', 'waffle', 'pique', 'waffer'];

    for (const fab of fabricKeys) {
      const fabricMap = (product.colorImages as Record<string, Record<string, string>>)[fab];
      if (fabricMap && fabricMap[colorName]) {
        return fabricMap[colorName];
      }
    }
  }

  if (colorName && product.id) {
    const fromManifest = getGarmentPhoto(product.id, preferredFabric, colorName);
    if (fromManifest) return fromManifest;
  }

  // Fallback to first available product image
  return product.images && product.images.length > 0 ? product.images[0] : undefined;
}
