import type { PublicProduct, PublicSeller } from "../types";

// Avoid indexing obvious development fixtures or empty records. Real content is
// retained when its description or media provides enough information to users.
const PLACEHOLDER_NAME = /^(?:test(?:\s*\d+)?|testing|demo|sample|example|placeholder|تست(?:\s*\d+)?|نمونه\s*آزمایشی)$/iu;

export function isPlaceholderName(value: string | null | undefined): boolean {
  return PLACEHOLDER_NAME.test(String(value || "").trim());
}

export function isPlaceholderProduct(product: PublicProduct): boolean {
  const description = (product.shortDescription || product.fullDescription || "").trim();
  return isPlaceholderName(product.name) && (!description || isPlaceholderName(description));
}

export function isIndexableProduct(product: PublicProduct): boolean {
  if (isPlaceholderProduct(product)) return false;
  const productName = (product.name || "").trim();
  const sellerName = (product.seller?.storeName || "").trim();
  if (productName.length < 3 || !product.seller?.slug || sellerName.length < 2 || isPlaceholderName(sellerName)) return false;
  const description = (product.shortDescription || product.fullDescription || "").trim();
  const validMedia = (value: string | undefined) => {
    if (!value) return false;
    try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; }
  };
  const hasImage = (product.images ?? []).some((image) => validMedia(image?.url));
  const hasModel = (product.models ?? []).some((model) => validMedia(model?.url));
  // A unique description is ideal, but valid product media is also meaningful
  // content for this 3D/AR showcase marketplace.
  return description.length >= 30 || hasImage || hasModel;
}

export function isPlaceholderSeller(seller: PublicSeller, products: PublicProduct[]): boolean {
  if (!isPlaceholderName(seller.storeName) || Boolean(seller.description?.trim())) return false;
  const sellerProducts = products.filter((product) => product.seller?.slug === seller.slug);
  return sellerProducts.every(isPlaceholderProduct);
}

export function isIndexableSeller(seller: PublicSeller, products: PublicProduct[]): boolean {
  const name = (seller.storeName || "").trim();
  if (name.length < 2 || isPlaceholderName(name) || isPlaceholderSeller(seller, products)) return false;
  if ((seller.description || "").trim().length >= 40) return true;
  return products.some((product) => product.seller?.slug === seller.slug && isIndexableProduct(product));
}
