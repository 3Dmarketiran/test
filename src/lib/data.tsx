import React, { createContext, useContext, useEffect, useState } from "react";
import type { PlatformSettings, PublicPlan, PublicPlanCategory, PublicProduct, PublicSeller } from "../types";
import bundledCatalog from "../../public-data/catalog.json";
import { API_URL, PUBLIC_ASSET_BASE_URL, PUBLIC_CATALOG_API } from "./config";

export interface PublicCatalog {
  schemaVersion: number;
  generatedAt: string;
  version: string;
  products: PublicProduct[];
  sellers: PublicSeller[];
  settings: PlatformSettings;
  plans: PublicPlan[];
  planCategories: PublicPlanCategory[];
}

interface DataState {
  products: PublicProduct[];
  sellers: PublicSeller[];
  settings: PlatformSettings | null;
  plans: PublicPlan[];
  planCategories: PublicPlanCategory[];
  loading: boolean;
  error: string | null;
}

const initialCatalog = validateCatalog(bundledCatalog);
const initialState: DataState = {
  products: initialCatalog.products,
  sellers: initialCatalog.sellers,
  settings: initialCatalog.settings,
  plans: initialCatalog.plans,
  planCategories: initialCatalog.planCategories || [],
  loading: true,
  error: null,
};
const DataContext = createContext<DataState>(initialState);


function validateCatalog(value: unknown): PublicCatalog {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("کاتالوگ عمومی معتبر نیست.");
  const catalog = value as Partial<PublicCatalog>;
  if (catalog.schemaVersion !== 2) throw new Error("نسخه ساختار کاتالوگ عمومی پشتیبانی نمی‌شود.");
  if (!Array.isArray(catalog.products) || !Array.isArray(catalog.sellers) || !catalog.settings) {
    throw new Error("ساختار کاتالوگ عمومی ناقص است.");
  }
  return normalizeCatalog({ ...catalog, plans: Array.isArray(catalog.plans) ? catalog.plans : [], planCategories: Array.isArray(catalog.planCategories) ? catalog.planCategories : [] } as PublicCatalog);
}

async function fetchCatalog(signal: AbortSignal): Promise<PublicCatalog> {
  // Live backend is the source of truth. The GitHub snapshot is only the
  // instant first-paint/offline fallback so the site never opens blank.
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);
  const abortFromParent = () => controller.abort();
  signal.addEventListener("abort", abortFromParent, { once: true });

  try {
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      try {
        const response = await fetch(PUBLIC_CATALOG_API, {
          signal: controller.signal,
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          if (![408, 429, 500, 502, 503, 504].includes(response.status) || attempt === 2) {
            throw new Error(`Live catalog failed (${response.status}).`);
          }
        } else {
          return validateCatalog(await response.json());
        }
      } catch (error) {
        lastError = error;
        if (error instanceof DOMException && error.name === "AbortError") throw error;
        if (attempt === 2) throw error;
      }
      await new Promise((resolve) => window.setTimeout(resolve, 700 * (attempt + 1)));
    }
    throw lastError instanceof Error ? lastError : new Error("Live catalog temporarily unavailable.");
  } finally {
    window.clearTimeout(timeout);
    signal.removeEventListener("abort", abortFromParent);
  }
}



function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function normalizeCatalog(catalog: PublicCatalog): PublicCatalog {
  const planCategories = catalog.planCategories && catalog.planCategories.length > 0
    ? catalog.planCategories
    : catalog.plans.length > 0
      ? [{ id: "general", name: "پلن‌های فروشندگان", slug: "general", description: "پلن‌های فعلی فروشندگان", sortOrder: 0, isActive: true }]
      : [];
  const plans = catalog.plans.map((plan, index) => ({
    ...plan,
    categoryId: plan.categoryId || (planCategories[0]?.id ?? null),
    sortOrder: plan.sortOrder ?? index,
  }));
  return {
    ...catalog,
    plans,
    planCategories,
    products: catalog.products.map((product) => ({
      ...product,
      images: product.images.map((image) => ({
        ...image,
        url: normalizePublicAssetUrl(image.url),
      })),
      models: product.models.map((model) => ({
        ...model,
        url: normalizePublicAssetUrl(model.url),
      })),
    })),
    sellers: shuffle(catalog.sellers).map((seller) => ({
      ...seller,
      logoUrl: seller.logoUrl ? normalizePublicAssetUrl(seller.logoUrl) : seller.logoUrl,
    })),
  };
}

/**
 * Normalize legacy catalog URLs to the Cloudflare R2 delivery domain.
 * New live catalogs already contain direct R2 URLs.
 */
function normalizePublicAssetUrl(value: string): string {
  if (!value) return value;

  try {
    const url = new URL(value);
    const legacyStorageMarker = "/storage/v1/object/public/";
    const legacyStorageIndex = url.pathname.indexOf(legacyStorageMarker);
    const backendMarker = "/api/public/assets/";
    const backendIndex = url.pathname.indexOf(backendMarker);

    if (PUBLIC_ASSET_BASE_URL) {
      if (legacyStorageIndex >= 0) {
        const remainder = url.pathname.slice(legacyStorageIndex + legacyStorageMarker.length);
        const slash = remainder.indexOf("/");
        if (slash >= 0) {
          const key = remainder.slice(slash + 1);
          return `${PUBLIC_ASSET_BASE_URL}/${key.split("/").map((segment) => encodeURIComponent(decodeURIComponent(segment))).join("/")}`;
        }
      }
      if (backendIndex >= 0) {
        const key = url.pathname.slice(backendIndex + backendMarker.length);
        return `${PUBLIC_ASSET_BASE_URL}/${key.split("/").filter(Boolean).map((segment) => encodeURIComponent(decodeURIComponent(segment))).join("/")}`;
      }
    }

    return value;
  } catch {
    return value;
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

        // The live catalog is authoritative. Never merge bundled records into
        // it, otherwise an unpublished/deleted item can be resurrected in the
        // browser from a stale build artifact.
        setState({
          products: catalog.products,
          sellers: catalog.sellers,
          settings: catalog.settings,
          plans: catalog.plans,
          planCategories: catalog.planCategories,
          loading: false,
          error: null,
        });
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
  return normalizePublicAssetUrl(logoUrl);
}

export function sellerInitials(name: string | null | undefined) {
  const value = (name || "فروشگاه").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts.slice(0, 2).map((x) => x[0]).join("") : value.slice(0, 2)).toUpperCase();
}

export function useData() { return useContext(DataContext); }
