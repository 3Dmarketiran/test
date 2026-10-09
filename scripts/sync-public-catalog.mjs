import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = path.join(root, "public-data");
const endpoint = String(process.env.PUBLIC_CATALOG_API_URL || "").trim();

if (!endpoint) {
  console.warn("⚠️ PUBLIC_CATALOG_API_URL is not set; SEO pages/sitemap use the checked-in public-data snapshot. Set it to the backend public catalog endpoint to include currently published products and sellers.");
  process.exit(0);
}

const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error(`Live public catalog request failed: HTTP ${response.status} from ${endpoint}`);
const live = await response.json();
if (!live || !Array.isArray(live.products) || !Array.isArray(live.sellers)) {
  throw new Error("Live public catalog response must contain products[] and sellers[].");
}
const existingPath = path.join(dataDir, "catalog.json");
const existing = existsSync(existingPath) ? JSON.parse(readFileSync(existingPath, "utf8")) : {};
const catalog = {
  schemaVersion: 2,
  generatedAt: live.generatedAt || new Date().toISOString(),
  version: live.version || `build-${Date.now()}`,
  products: live.products,
  sellers: live.sellers,
  settings: live.settings ?? existing.settings ?? {},
  plans: live.plans ?? existing.plans ?? [],
  planCategories: live.planCategories ?? existing.planCategories ?? [],
};
writeFileSync(existingPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
writeFileSync(path.join(dataDir, "products.json"), `${JSON.stringify(catalog.products, null, 2)}\n`, "utf8");
writeFileSync(path.join(dataDir, "sellers.json"), `${JSON.stringify(catalog.sellers, null, 2)}\n`, "utf8");
if (catalog.settings) writeFileSync(path.join(dataDir, "settings.json"), `${JSON.stringify(catalog.settings, null, 2)}\n`, "utf8");
if (catalog.plans) writeFileSync(path.join(dataDir, "plans.json"), `${JSON.stringify(catalog.plans, null, 2)}\n`, "utf8");
console.log(`✅ Synced live public catalog for SEO generation: ${catalog.products.length} products, ${catalog.sellers.length} sellers.`);
