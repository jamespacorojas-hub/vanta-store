import manifest from '../data/productImageManifest.json';

// Product.fabrics uses display names; the manifest (built from the PRODUCTOS/ folders) keys fabrics by slug.
const FABRIC_SLUGS: Record<string, string> = {
  Waffle: 'waffle',
  Jersey: 'jersey',
  Piqué: 'pique',
  Waffer: 'waffer',
};

type ImageManifest = Record<string, Record<string, Record<string, string>>>;
const MANIFEST = manifest as ImageManifest;

/** Real garment photo for a given product line ('camisa' | 'camisero'), fabric and color, if one was found under PRODUCTOS/. */
export function getGarmentPhoto(productId: string, fabric: string, color: string): string | undefined {
  const fabricSlug = FABRIC_SLUGS[fabric] ?? fabric.toLowerCase();
  return MANIFEST[productId]?.[fabricSlug]?.[color];
}

export function hasGarmentPhotos(productId: string): boolean {
  return Boolean(MANIFEST[productId]);
}
