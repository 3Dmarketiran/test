import React, { createContext, useContext, useEffect, useState } from "react";
import type { PlatformSettings, PublicCategory, PublicPlan, PublicProduct, PublicSeller } from "../types";
import bundledCatalog from "../../public-data/catalog.json";

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
  // First try the atomic catalog. If a CDN/browser has a stale or transient
  // response, retry once and then fall back to the individual snapshot files.
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return validateCatalog(await fetchJson(catalogUrl(), signal));
    } catch (error) {
      lastError = error;
      if (signal.aborted) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 180 : 420));
    }
  }

  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  try {
    const [products, sellers, categories, settings, plans] = await Promise.all([
      fetchJson(`${base}/public-data/products.json`, signal),
      fetchJson(`${base}/public-data/sellers.json`, signal),
      fetchJson(`${base}/public-data/categories.json`, signal),
      fetchJson(`${base}/public-data/settings.json`, signal),
      fetchJson(`${base}/public-data/plans.json`, signal).catch(() => []),
    ]);
    return validateCatalog({
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      version: "fallback",
      products,
      sellers,
      categories,
      settings,
      plans,
    });
  } catch {
    throw lastError instanceof Error ? lastError : new Error("اطلاعات سایت در دسترس نیست.");
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
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  return `${base}/${logoUrl.replace(/^\/+/, "")}`;
}

export function sellerInitials(name: string | null | undefined) {
  const value = (name || "فروشگاه").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts.slice(0, 2).map((x) => x[0]).join("") : value.slice(0, 2)).toUpperCase();
}

export function useData() { return useContext(DataContext); }
