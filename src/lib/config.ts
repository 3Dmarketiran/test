export const API_URL =
  (import.meta.env.VITE_API_URL || "https://threedmarketiran-backend.onrender.com").replace(/\/$/, "");

export const PUBLIC_SITE_URL =
  (import.meta.env.VITE_PUBLIC_SITE_URL || window.location.origin).replace(/\/$/, "");

export const ADMIN_URL =
  (import.meta.env.VITE_ADMIN_URL || "https://3dmarketiran.github.io/frontend-admin/#/login").replace(/\/$/, "");

export const SUPPORT_PHONE =
  import.meta.env.VITE_SUPPORT_PHONE || "09144142898";
