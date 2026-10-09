export const API_URL =
  (import.meta.env.VITE_API_URL || "https://api.3dmarketiran.ir").replace(/\/$/, "");

export const PUBLIC_ASSET_BASE_URL =
  (import.meta.env.VITE_PUBLIC_ASSET_BASE_URL || "").replace(/\/$/, "");

export const PUBLIC_CATALOG_API = `${API_URL}/api/public/catalog`;
export const VISITOR_COUNTRY_API = `${API_URL}/api/public/visitor-country`;

export const PUBLIC_SITE_URL =
  (import.meta.env.VITE_PUBLIC_SITE_URL || "https://3dmarketiran.ir").replace(/\/$/, "");

export const ADMIN_URL =
  (import.meta.env.VITE_ADMIN_URL || "https://admin.3dmarketiran.ir/#/login").replace(/\/$/, "");

export const SUPPORT_PHONE =
  import.meta.env.VITE_SUPPORT_PHONE || "09144142898";
