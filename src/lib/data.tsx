import React, { createContext, useContext, useEffect, useState } from "react";
import type { PlatformSettings, PublicCategory, PublicPlan, PublicProduct, PublicSeller } from "../types";
import bundledCatalog from "../../public-data/catalog.json";
import { PUBLIC_CATALOG_API } from "./config";

export interface PublicCatalog {
  schemaVersion: number;
  generatedAt: string;
  version: string;
  products: PublicProduct[];
  sellers: PublicSeller[];
  categories: PublicCategory[];
  settings: PlatformSettings;
  plans: PublicPlan[];
}

interface DataState {
  products: PublicProduct[];
  sellers: PublicSeller[];
  categories: PublicCategory[];
  settings: PlatformSettings | null;
  plans: PublicPlan[];
  loading: boolean;
  error: string | null;
}

const initialCatalog = validateCatalog(bundledCatalog);
const initialState: DataState = {
  products: initialCatalog.products,
  sellers: initialCatalog.sellers,
  categories: initialCatalog.categories,
  settings: initialCatalog.settings,
  plans: initialCatalog.plans,
  loading: false,
  error: null,
};
const DataContext = createContext<DataState>(initialState);

function catalogUrl() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  return `${base}/public-data/catalog.json`;
}

async function fetchJson(path: string, signal: AbortSignal) {
  const response = await fetch(path, {
    signal,
    cache: "default",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`بارگذاری اطلاعات ناموفق بود (${response.status}).`);
  return response.json();
}

function validateCatalog(value: unknown): PublicCatalog {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("کاتالوگ عمومی معتبر نیست.");
  const catalog = value as Partial<PublicCatalog>;
  if (!Array.isArray(catalog.products) || !Array.isArray(catalog.sellers) || !Array.isArray(catalog.categories) || !catalog.settings) {
    throw new Error("ساختار کاتالوگ عمومی ناقص است.");
  }
  return { ...catalog, plans: Array.isArray(catalog.plans) ? catalog.plans : [] } as PublicCatalog;
}

async function fetchCatalog(signal: AbortSignal): Promise<PublicCatalog> {
  // Live backend is the source of truth. The GitHub snapshot is only the
  // instant first-paint/offline fallback so the site never opens blank.
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);
  const abortFromParent = () => controller.abort();
  signal.addEventListener("abort", abortFromParent, { once: true });

  try {
    const response = await fetch(PUBLIC_CATALOG_API, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Live catalog failed (${response.status}).`);
    return validateCatalog(await response.json());
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener("abort", abortFromParent);
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DataState>(initialState);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;
    fetchCatalog(controller.signal)
      .then((catalog) => {
        if (!mounted) return;
        setState({ products: catalog.products, sellers: catalog.sellers, categories: catalog.categories, settings: catalog.settings, plans: catalog.plans, loading: false, error: null });
      })
      .catch((error) => {
        if (!mounted || (error instanceof DOMException && error.name === "AbortError")) return;
        // The bundled catalog is already usable. Never blank the page because
        // a CDN/network refresh failed; keep the last known good snapshot visible.
        setState((current) => ({ ...current, loading: false, error: null }));
      });
    return () => { mounted = false; controller.abort(); };
  }, []);

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}

export function getSellerLogoUrl(logoUrl: string | null | undefined) {
  if (!logoUrl) return null;
  if (/^(https?:|data:|blob:)/i.test(logoUrl)) return logoUrl;
  if (/^\/api\//i.test(logoUrl)) return `${PUBLIC_CATALOG_API.replace(/\/api\/public\/catalog$/, "")}${logoUrl}`;
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  return `${base}/${logoUrl.replace(/^\/+/, "")}`;
}

export function sellerInitials(name: string | null | undefined) {
  const value = (name || "فروشگاه").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts.slice(0, 2).map((x) => x[0]).join("") : value.slice(0, 2)).toUpperCase();
}

export function useData() { return useContext(DataContext); }
