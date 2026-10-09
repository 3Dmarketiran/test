import { readFileSync, existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");
const site = new URL(process.env.PUBLIC_SITE_URL || "https://3dmarketiran.ir").origin;
const sitemapPath = path.join(dist, "sitemap.xml");
if (!existsSync(sitemapPath)) fail("dist/sitemap.xml is missing.");
const catalogPath = path.join(root, "public-data", "catalog.json");
if (!existsSync(catalogPath)) fail("public-data/catalog.json is missing.");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const catalogProducts = Array.isArray(catalog.products) ? catalog.products : [];
const sitemap = readFileSync(sitemapPath, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeXml(match[1]));
if (!sitemapUrls.length) fail("Sitemap has no URL entries.");
if (sitemapUrls.some((value) => { const parsed = new URL(value); return Boolean(parsed.hash || parsed.search); })) fail("Sitemap contains a fragment or query string.");
if (new Set(sitemapUrls).size !== sitemapUrls.length) fail("Sitemap contains duplicate URLs.");

const indexed = new Set(sitemapUrls);
const htmlFiles = collectHtml(dist).filter((file) => !file.endsWith(`${path.sep}404.html`));
const pageByRoute = new Map();
for (const file of htmlFiles) {
  const relative = path.relative(dist, file).split(path.sep).join("/");
  const routePath = relative === "index.html" ? "/" : `/${relative.replace(/\/index\.html$/, "").replace(/\.html$/, "")}/`;
  pageByRoute.set(routePath, { file, html: readFileSync(file, "utf8") });
}

let checkedIndexedPages = 0;
let checkedAllHtmlPages = 0;
for (const [routePath, { file, html }] of pageByRoute.entries()) {
  checkedAllHtmlPages += 1;
  const routeUrl = new URL(routePath, `${site}/`).href;
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = getMetaContent(html, "name", "description");
  const robots = getMetaContent(html, "name", "robots") || "";
  const canonical = getCanonical(html);
  if (!title) fail(`Missing title: ${routePath}`);
  if (title.length > 70) fail(`Title exceeds the build target of 70 characters: ${routePath} (${title.length})`);
  if (!description || description.length < 40) fail(`Missing/too-short meta description: ${routePath}`);
  if (!canonical) fail(`Missing canonical: ${routePath}`);
  const canonicalUrl = new URL(decodeHtml(canonical), `${site}/`);
  if (canonicalUrl.search || canonicalUrl.hash) fail(`Canonical contains query/hash: ${routePath}`);
  if (indexed.has(routeUrl)) {
    if (canonicalUrl.href !== routeUrl) fail(`Canonical does not match sitemap URL: ${routePath} (canonical=${canonicalUrl.href})`);
    if (/\bnoindex\b/i.test(robots)) fail(`Noindex page is listed in sitemap: ${routePath}`);
    if (!/<h1\b[^>]*>\s*[^<][\s\S]*?<\/h1>/i.test(html)) fail(`Missing non-empty H1: ${routePath}`);
    checkedIndexedPages += 1;
  } else if (!/\bnoindex\b/i.test(robots)) {
    fail(`Page is excluded from the sitemap but is not marked noindex: ${routePath} (${file})`);
  }

  const jsonLdScripts = [...html.matchAll(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)];
  const parsedSchemas = [];
  for (const jsonLd of jsonLdScripts) {
    try { parsedSchemas.push(JSON.parse(jsonLd[1])); } catch (error) { fail(`Invalid JSON-LD on ${routePath}: ${error.message}`); }
  }
  if ([...html.matchAll(/<img\b[^>]*>/gi)].some(([tag]) => !/\balt=["'][^"']+/.test(tag))) fail(`Image missing alt text: ${routePath}`);
  if (indexed.has(routeUrl) && /^\/products\/[^/]+\/$/.test(routePath)) {
    if (!jsonLdScripts.some((match) => /"@type":"Product"/.test(match[1]))) fail(`Indexable product route has no Product schema: ${routePath}`);
    const slug = decodeURIComponent(routePath.split("/")[2] || "");
    const product = catalogProducts.find((item) => item.slug === slug);
    const graphItems = parsedSchemas.flatMap((schema) => Array.isArray(schema?.["@graph"]) ? schema["@graph"] : [schema]);
    const productNode = graphItems.find((item) => item?.["@type"] === "Product");
    if (product && product.price != null && Number.isFinite(Number(product.price)) && Number(product.price) >= 0) {
      const expectedPrice = String(Math.round(Number(product.price)) * 10);
      if (productNode?.offers?.price !== expectedPrice || productNode?.offers?.priceCurrency !== "IRR") {
        fail(`Product Offer schema price/currency does not match the displayed toman price: ${routePath}`);
      }
    }
  }
  if (indexed.has(routeUrl) && /^\/sellers\/[^/]+\/$/.test(routePath) && !jsonLdScripts.some((match) => /"@type":"ProfilePage"/.test(match[1]))) fail(`Indexable seller route has no ProfilePage schema: ${routePath}`);
}

for (const urlValue of sitemapUrls) {
  const url = new URL(urlValue);
  if (url.origin !== site) fail(`Unexpected sitemap host: ${url.origin}`);
  if (url.hash || url.search) fail(`Sitemap URL includes query/hash: ${urlValue}`);
  if (!pageByRoute.has(url.pathname)) fail(`Sitemap route has no generated HTML file: ${urlValue}`);
}

const robotsPath = path.join(dist, "robots.txt");
if (!existsSync(robotsPath)) fail("dist/robots.txt is missing.");
const robotsText = readFileSync(robotsPath, "utf8");
if (!robotsText.includes(`${site}/sitemap.xml`)) fail("robots.txt does not point at the generated sitemap.");
for (const rootFile of ["CNAME", "3dmarketiran-logo.svg", "404.html", "llms.txt", ".nojekyll"]) {
  if (!existsSync(path.join(dist, rootFile))) fail(`Expected deployed root file is missing: ${rootFile}`);
}
const notFoundHtml = readFileSync(path.join(dist, "404.html"), "utf8");
if (!/\bnoindex\b/i.test(getMetaContent(notFoundHtml, "name", "robots") || "")) fail("404.html must be noindex.");
const home = readFileSync(path.join(dist, "index.html"), "utf8");
if (!/application\/ld\+json/.test(home)) fail("Homepage is missing structured data.");
if (/src\/main\.tsx/.test(home)) fail("dist/index.html still references the Vite source entry; the production Vite build may not have run.");
if (!/<script\b[^>]*\bsrc=["'][^"']+\.js(?:\?[^"']*)?["'][^>]*>/i.test(home)) fail("dist/index.html is missing the bundled JavaScript entry.");
if (checkedIndexedPages !== sitemapUrls.length) fail(`Only ${checkedIndexedPages} of ${sitemapUrls.length} sitemap routes were verified.`);
console.log(`✅ SEO build verification passed: ${checkedIndexedPages} sitemap routes and ${checkedAllHtmlPages + 1} generated HTML pages validated (metadata, canonical, indexation, H1, JSON-LD, sitemap/robots, 404 and deployment assets).`);

function fail(message) { console.error(`❌ SEO build verification failed: ${message}`); process.exit(1); }
function collectHtml(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (["assets", "public-data"].includes(entry.name)) continue;
      files.push(...collectHtml(full));
    } else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}
function getMetaContent(html, attr, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tag = html.match(new RegExp(`<meta\\b(?=[^>]*\\b${attr}=["']${escapedName}["'])[^>]*>`, "i"))?.[0];
  if (!tag) return undefined;
  return tag.match(/\bcontent=["']([^"']*)["']/i)?.[1];
}
function getCanonical(html) {
  const tag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0];
  return tag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
}
function decodeXml(value) { return value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'"); }
function decodeHtml(value) { return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">"); }
