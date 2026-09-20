// Runs after `vite build` (spec sections 4/33/39):
//  1. Copies /public-data/*.json into dist/public-data — Vite's own
//     `public/` dir (favicon, robots.txt) is copied automatically, but
//     public-data lives at the repo root next to src/ so the backend's
//     publish pipeline can commit to a stable, well-known path.
//  2. Generates sitemap.xml from the published product/seller catalog.
//  3. Ensures .nojekyll so GitHub Pages doesn't run Jekyll over dist/.
import { readFileSync, writeFileSync, cpSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");
const dataDir = path.join(root, "public-data");

cpSync(dataDir, path.join(dist, "public-data"), { recursive: true });

const siteUrl = process.env.PUBLIC_SITE_URL || "https://example.com";
const products = JSON.parse(readFileSync(path.join(dataDir, "products.json"), "utf-8"));
const sellers = JSON.parse(readFileSync(path.join(dataDir, "sellers.json"), "utf-8"));

const staticUrls = ["/", "/#/products", "/#/categories", "/#/about", "/#/contact"];
const productUrls = products.map((p) => `/#/products/${p.slug}`);
const sellerUrls = sellers.map((s) => `/#/sellers/${s.slug}`);

const urls = [...staticUrls, ...productUrls, ...sellerUrls];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${siteUrl.replace(/\/$/, "")}${u}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(path.join(dist, "sitemap.xml"), sitemap, "utf-8");

if (!existsSync(path.join(dist, ".nojekyll"))) {
  writeFileSync(path.join(dist, ".nojekyll"), "");
}

console.log(`✅ postbuild: copied public-data, wrote sitemap.xml (${urls.length} URLs).`);
