// Produce crawlable static URLs and page-specific metadata for GitHub Pages.
// The live React application still owns interactions; this script also puts a
// useful HTML fallback in each route so essential content exists before JS runs.
import {
  readFileSync,
  writeFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  copyFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, "dist");
const dataDir = path.join(root, "public-data");
const baseHtmlPath = path.join(dist, "index.html");
const site = normalizeSiteUrl(process.env.PUBLIC_SITE_URL || "https://3dmarketiran.ir");
const configuredBasePath = String(process.env.PUBLIC_BASE_PATH || "/").replace(/^\/+|\/+$/g, "");
if (configuredBasePath) throw new Error("SEO route generation is configured for the custom-domain root. Set PUBLIC_BASE_PATH=/ before building this release.");

if (!existsSync(baseHtmlPath)) throw new Error("Vite output is missing dist/index.html; run this script only after vite build.");
if (!existsSync(path.join(dataDir, "catalog.json"))) throw new Error("public-data/catalog.json is missing.");

const catalog = JSON.parse(readFileSync(path.join(dataDir, "catalog.json"), "utf8"));
const products = Array.isArray(catalog.products) ? catalog.products : [];
const sellers = Array.isArray(catalog.sellers) ? catalog.sellers : [];
const validProducts = uniqueBySlug(products, "product");
const validSellers = uniqueBySlug(sellers, "seller");
const indexableProducts = validProducts.filter(isIndexableProduct);
const indexableSellers = validSellers.filter((seller) => isIndexableSeller(seller, validProducts));
const baseHtml = readFileSync(baseHtmlPath, "utf8");

// The backend's publish pipeline writes this snapshot beside src/; expose it as a stable public path.
cpSync(dataDir, path.join(dist, "public-data"), { recursive: true });

// Vite only copies files inside the configured public/ directory. These legacy root files are still referenced by index.html.
for (const file of ["CNAME", "3dmarketiran-logo.svg"]) {
  const source = path.join(root, file);
  if (existsSync(source)) copyFileSync(source, path.join(dist, file));
}

const brandDescription = "3DMarketIran بستری برای معرفی فروشگاه‌ها و محصولات با نمایش سه‌بعدی تعاملی و واقعیت افزوده است. مدل محصول را بررسی کنید و برای اطلاعات بیشتر مستقیماً با فروشنده ارتباط بگیرید.";
const staticPages = [
  {
    path: "/",
    title: "3DMarketIran | نمایش سه‌بعدی و واقعیت افزوده محصولات",
    description: "در 3DMarketIran فروشگاه‌ها و محصولات را به‌صورت سه‌بعدی و واقعیت افزوده ببینید؛ ویترینی آنلاین برای معرفی بهتر محصول و ارتباط مستقیم مشتری با فروشنده.",
    body: homeFallback(),
    schema: websiteSchema(),
  },
  {
    path: "/products/",
    title: "فروشگاه‌های سه‌بعدی ایران | 3DMarketIran",
    description: "فروشگاه‌های فعال 3DMarketIran را پیدا کنید، محصولات آن‌ها را با نمایش سه‌بعدی و واقعیت افزوده بررسی کنید و مستقیم با فروشنده در ارتباط باشید.",
    body: listingFallback(),
    schema: sellerDirectorySchema(),
    noIndex: indexableSellers.length === 0,
  },
  {
    path: "/plans/",
    title: "پلن‌های فروشندگان | 3DMarketIran",
    description: "پلن‌های اشتراک فروشندگان 3DMarketIran را بررسی کنید و برای ساخت ویترین اختصاصی و معرفی محصولات سه‌بعدی و واقعیت افزوده برنامه مناسب را انتخاب کنید.",
    body: simpleFallback("پلن‌های فروشندگان", "با پلن‌های 3DMarketIran برای ساخت ویترین اختصاصی و معرفی محصولات سه‌بعدی آشنا شوید.", [["خانه", "/"], ["تماس با ما", "/contact/"]]),
    schema: webpageSchema("پلن‌های فروشندگان", "/plans/", "پلن‌های اشتراک برای ساخت ویترین اختصاصی و معرفی محصولات سه‌بعدی."),
  },
  {
    path: "/about/",
    title: "درباره 3DMarketIran | نمایش محصول با 3D و AR",
    description: "با 3DMarketIran آشنا شوید؛ بستری برای معرفی بهتر محصولات و فروشگاه‌ها با نمایش سه‌بعدی تعاملی و واقعیت افزوده.",
    body: simpleFallback("درباره 3DMarketIran", brandDescription, [["مشاهده فروشگاه‌ها", "/products/"], ["تماس با ما", "/contact/"]]),
    schema: webpageSchema("درباره ما", "/about/", "معرفی 3DMarketIran و هدف آن برای بهبود نمایش محصولات با سه‌بعدی و واقعیت افزوده."),
  },
  {
    path: "/contact/",
    title: "تماس با 3DMarketIran",
    description: "راه‌های ارتباط با 3DMarketIran برای پشتیبانی، همکاری و پرسش‌های مربوط به نمایش سه‌بعدی و واقعیت افزوده محصولات.",
    body: simpleFallback("تماس با 3DMarketIran", "برای پرسش‌های مربوط به خدمات، همکاری یا پشتیبانی از راه‌های ارتباطی درج‌شده در سایت استفاده کنید.", [["خانه", "/"], ["پلن‌های فروشندگان", "/plans/"]]),
    schema: webpageSchema("تماس با ما", "/contact/", "اطلاعات تماس برای پشتیبانی و همکاری با 3DMarketIran."),
  },
  {
    path: "/search/",
    title: "جست‌وجوی فروشگاه‌ها | 3DMarketIran",
    description: "در فهرست فروشگاه‌ها و محصولات منتشرشده در 3DMarketIran جست‌وجو کنید و صفحه مرتبط را برای جزئیات بیشتر باز کنید.",
    body: simpleFallback("جست‌وجوی فروشگاه‌ها", "برای جست‌وجو از کادر جست‌وجوی سایت استفاده کنید.", [["رفتن به فروشگاه‌ها", "/products/"]]),
    schema: null,
    noIndex: true,
    canonicalPath: "/products/",
  },
];

const generatedUrls = [];
for (const page of staticPages) {
  const relativePath = page.path === "/" ? "index.html" : path.join(page.path.slice(1), "index.html");
  writeRoute(relativePath, renderPage(baseHtml, page));
  if (!page.noIndex) generatedUrls.push({ path: page.path });
}

for (const product of validProducts) {
  const productPath = `/products/${encodeURIComponent(product.slug)}/`;
  const seller = sellers.find((item) => item.slug === product.seller?.slug);
  const placeholder = !isIndexableProduct(product);
  const description = !placeholder
    ? trimDescription(product.shortDescription || product.fullDescription)
      || `${product.name}؛ مشاهده مدل سه‌بعدی و جزئیات محصول از فروشگاه ${product.seller?.storeName || "فروشنده"} در 3DMarketIran.`
    : "این صفحه محصول در حال آماده‌سازی است و تا زمان تکمیل اطلاعات در نتایج جست‌وجو نمایش داده نمی‌شود.";
  const page = {
    path: productPath,
    title: placeholder ? "صفحه محصول در حال آماده‌سازی | 3DMarketIran" : `${product.name} | ${product.seller?.storeName || "فروشگاه"} | 3DMarketIran`,
    description,
    image: placeholder ? undefined : primaryImage(product),
    body: placeholder
      ? simpleFallback("صفحه محصول در حال آماده‌سازی", "اطلاعات این محصول هنوز برای انتشار عمومی و ایندکس‌شدن در موتورهای جست‌وجو کامل نشده است.", [["مشاهده فروشگاه‌ها", "/products/"], ["خانه", "/"]])
      : productFallback(product, seller, description),
    schema: placeholder ? null : productSchema(product, description),
    noIndex: placeholder,
  };
  writeRoute(path.join("products", safeSlug(product.slug), "index.html"), renderPage(baseHtml, page));
  if (!placeholder) generatedUrls.push({ path: productPath });
}

for (const seller of validSellers) {
  // Only link to pages that are themselves eligible for indexing. This avoids
  // making thin/placeholder product URLs look like first-class catalog items.
  const sellerProducts = indexableProducts.filter((product) => product.seller?.slug === seller.slug);
  const sellerPath = `/sellers/${encodeURIComponent(seller.slug)}/`;
  const placeholder = !isIndexableSeller(seller, validProducts);
  const description = !placeholder
    ? trimDescription(seller.description)
      || `مشاهده ویترین ${seller.storeName} و محصولات منتشرشده آن در 3DMarketIran؛ محصولات را سه‌بعدی بررسی کنید و برای اطلاعات بیشتر با فروشنده ارتباط بگیرید.`
    : "این صفحه فروشگاه در حال آماده‌سازی است و تا زمان تکمیل اطلاعات در نتایج جست‌وجو نمایش داده نمی‌شود.";
  const page = {
    path: sellerPath,
    title: placeholder ? "صفحه فروشگاه در حال آماده‌سازی | 3DMarketIran" : `${seller.storeName} | فروشگاه سه‌بعدی | 3DMarketIran`,
    description,
    image: !placeholder && validHttpUrl(seller.logoUrl) ? seller.logoUrl : undefined,
    body: placeholder
      ? simpleFallback("صفحه فروشگاه در حال آماده‌سازی", "اطلاعات این فروشگاه هنوز برای انتشار عمومی و ایندکس‌شدن در موتورهای جست‌وجو کامل نشده است.", [["مشاهده فروشگاه‌ها", "/products/"], ["خانه", "/"]])
      : sellerFallback(seller, sellerProducts),
    schema: placeholder ? null : sellerSchema(seller, sellerPath, description),
    noIndex: placeholder,
  };
  writeRoute(path.join("sellers", safeSlug(seller.slug), "index.html"), renderPage(baseHtml, page));
  if (!placeholder) generatedUrls.push({ path: sellerPath });
}

// GitHub Pages uses this as its static 404 response; do not let it be indexed as a real page.
const notFound = {
  path: "/404.html",
  title: "صفحه پیدا نشد | 3DMarketIran",
  description: "صفحه‌ای که به دنبال آن هستید پیدا نشد یا دیگر منتشر نشده است؛ می‌توانید از خانه یا فهرست فروشگاه‌ها ادامه دهید.",
  noIndex: true,
  canonicalPath: "/404.html",
  body: simpleFallback("صفحه پیدا نشد", "صفحه موردنظر پیدا نشد یا ممکن است دیگر منتشر نشده باشد.", [["بازگشت به خانه", "/"], ["مشاهده فروشگاه‌ها", "/products/"]]),
  schema: null,
};
writeFileSync(path.join(dist, "404.html"), renderPage(baseHtml, notFound), "utf8");

const sitemapXml = buildSitemap(generatedUrls);
writeFileSync(path.join(dist, "sitemap.xml"), sitemapXml, "utf8");
if (!existsSync(path.join(dist, "robots.txt"))) {
  writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`, "utf8");
} else {
  const robotsPath = path.join(dist, "robots.txt");
  let robots = readFileSync(robotsPath, "utf8").replace(/^Sitemap:\s*.*$/gim, "").trim();
  robots = `${robots}\n\nSitemap: ${site}/sitemap.xml\n`;
  writeFileSync(robotsPath, robots, "utf8");
}
if (!existsSync(path.join(dist, ".nojekyll"))) writeFileSync(path.join(dist, ".nojekyll"), "", "utf8");

validateOutput(generatedUrls);
console.log(`✅ postbuild: generated ${generatedUrls.length} indexable URLs, ${indexableProducts.length} indexable product pages, ${indexableSellers.length} indexable seller pages; non-indexable placeholder routes were excluded. Sitemap/robots validated.`);

function normalizeSiteUrl(value) {
  const url = new URL(value);
  if (!/^https?:$/.test(url.protocol)) throw new Error(`PUBLIC_SITE_URL must use http(s): ${value}`);
  return url.origin.replace(/\/$/, "");
}
function safeSlug(value) {
  const slug = String(value || "").trim();
  if (!slug || slug === "." || slug === ".." || /[\\/\0?#]/.test(slug)) throw new Error(`Unsafe route slug: ${value}`);
  return slug;
}
function uniqueBySlug(items, type) {
  const seen = new Set();
  return items.filter((item) => {
    const slug = safeSlug(item.slug);
    if (seen.has(slug)) throw new Error(`Duplicate ${type} slug in public catalog: ${slug}`);
    seen.add(slug);
    return true;
  });
}
function validHttpUrl(value) {
  try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; }
}
function primaryImage(product) {
  const image = (product.images || []).find((item) => item.isPrimary) || (product.images || [])[0];
  return image && validHttpUrl(image.url) ? image.url : undefined;
}
function trimDescription(value) {
  if (!value) return "";
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
}
function metaDescription(value) {
  const normalized = trimDescription(value);
  return normalized.length <= 160 ? normalized : `${normalized.slice(0, 157).trimEnd()}…`;
}
function compactTitle(value) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= 70) return normalized;
  const suffix = " | 3DMarketIran";
  if (normalized.endsWith(suffix)) return `${normalized.slice(0, 70 - suffix.length - 1).trimEnd()}…${suffix}`;
  return `${normalized.slice(0, 69).trimEnd()}…`;
}
function htmlEscape(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function absoluteUrl(route) { return new URL(route, `${site}/`).href; }
function safeJson(data) { return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026"); }
function listLinks(links) { return `<p>${links.map(([label, href]) => `<a href="${htmlEscape(href)}">${htmlEscape(label)}</a>`).join(" · ")}</p>`; }
function homeFallback() {
  const featuredProducts = indexableProducts.slice(0, 12);
  const productLinks = featuredProducts.length
    ? `<section><h2>محصولات سه‌بعدی منتشرشده</h2><ul>${featuredProducts.map((product) => {
      const seller = product.seller?.storeName ? ` — ${htmlEscape(product.seller.storeName)}` : "";
      return `<li><a href="/products/${encodeURIComponent(product.slug)}/">${htmlEscape(product.name)}</a>${seller}</li>`;
    }).join("")}</ul></section>`
    : "";
  const featuredSellers = indexableSellers.slice(0, 8);
  const sellerLinks = featuredSellers.length
    ? `<section><h2>ویترین فروشگاه‌ها</h2><ul>${featuredSellers.map((seller) => `<li><a href="/sellers/${encodeURIComponent(seller.slug)}/">${htmlEscape(seller.storeName)}</a>${seller.description ? ` — ${htmlEscape(trimDescription(seller.description))}` : ""}</li>`).join("")}</ul></section>`
    : "";
  return `<main class="seo-fallback"><h1>محصولات را سه‌بعدی ببینید؛ بهتر انتخاب کنید</h1><p>${htmlEscape(brandDescription)}</p>${listLinks([["مشاهده فروشگاه‌ها", "/products/"], ["پلن‌های فروشندگان", "/plans/"], ["درباره ما", "/about/"], ["تماس با ما", "/contact/"]])}<h2>چرا نمایش سه‌بعدی محصول؟</h2><p>نمایش تعاملی به مشتری کمک می‌کند شکل و جزئیات ظاهری محصول را بهتر بررسی کند. در محصولات سازگار، واقعیت افزوده امکان مشاهده مدل در محیط پیرامون را نیز فراهم می‌کند.</p>${productLinks}${sellerLinks}</main>`;
}
function listingFallback() {
  const visibleSellers = validSellerPreview();
  const links = visibleSellers.length
    ? `<ul>${visibleSellers.map((seller) => `<li><a href="/sellers/${encodeURIComponent(seller.slug)}/">${htmlEscape(seller.storeName)}</a>${seller.description ? ` — ${htmlEscape(trimDescription(seller.description))}` : ""}</li>`).join("")}</ul>`
    : `<p>فروشگاه‌های منتشرشده پس از تکمیل اطلاعات عمومی، در این بخش نمایش داده می‌شوند.</p>`;
  return `<main class="seo-fallback"><h1>فروشگاه‌های سه‌بعدی ایران</h1><p>فروشگاه‌ها را مرور کنید، محصولات منتشرشده را ببینید و برای جزئیات بیشتر وارد ویترین اختصاصی هر فروشنده شوید.</p>${links}</main>`;
}
function validSellerPreview() { return indexableSellers.slice(0, 30); }
function isPlaceholderName(value) { return /^(?:test(?:\s*\d+)?|testing|demo|sample|example|placeholder|تست(?:\s*\d+)?|نمونه\s*آزمایشی)$/iu.test(String(value || "").trim()); }
function isPlaceholderProduct(product) {
  const description = trimDescription(product.shortDescription || product.fullDescription);
  return isPlaceholderName(product.name) && (!description || isPlaceholderName(description));
}
function isPlaceholderSeller(seller, allProducts) {
  if (!trimDescription(seller.storeName) || trimDescription(seller.storeName).length < 2) return true;
  if (!isPlaceholderName(seller.storeName) || trimDescription(seller.description)) return false;
  return allProducts.filter((product) => product.seller?.slug === seller.slug).every(isPlaceholderProduct);
}
function isIndexableProduct(product) {
  if (isPlaceholderProduct(product)) return false;
  const productName = trimDescription(product.name);
  const sellerName = trimDescription(product.seller?.storeName);
  if (productName.length < 3 || !product.seller?.slug || sellerName.length < 2 || isPlaceholderName(sellerName)) return false;
  const description = trimDescription(product.shortDescription || product.fullDescription);
  const hasImage = (product.images || []).some((image) => validHttpUrl(image?.url));
  const hasModel = (product.models || []).some((model) => validHttpUrl(model?.url));
  // Unique text is preferred; a real titled product with media is acceptable
  // because the model/image itself is the core public content of this marketplace.
  return description.length >= 30 || hasImage || hasModel;
}
function isIndexableSeller(seller, allProducts) {
  const name = trimDescription(seller.storeName);
  if (name.length < 2 || isPlaceholderName(name)) return false;
  if (isPlaceholderSeller(seller, allProducts)) return false;
  if (trimDescription(seller.description).length >= 40) return true;
  return allProducts.some((product) => product.seller?.slug === seller.slug && isIndexableProduct(product));
}
function simpleFallback(heading, description, links) { return `<main class="seo-fallback"><h1>${htmlEscape(heading)}</h1><p>${htmlEscape(description)}</p>${listLinks(links)}</main>`; }
function productFallback(product, seller, description) {
  const image = primaryImage(product);
  const imageHtml = image ? `<p><img src="${htmlEscape(image)}" alt="${htmlEscape(product.name)}" loading="eager" decoding="async"></p>` : "";
  const sellerLink = product.seller?.slug ? `<p>فروشنده: <a href="/sellers/${encodeURIComponent(product.seller.slug)}/">${htmlEscape(seller?.storeName || product.seller.storeName || "مشاهده فروشگاه")}</a></p>` : "";
  const price = Number.isFinite(product.price) && product.price !== null ? `<p>قیمت اعلام‌شده: ${htmlEscape(new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(product.price))} تومان</p>` : "<p>برای اطلاع از قیمت با فروشنده تماس بگیرید.</p>";
  const tags = Array.isArray(product.tags) && product.tags.length ? `<p>کلیدواژه‌ها: ${product.tags.map(htmlEscape).join("، ")}</p>` : "";
  return `<main class="seo-fallback"><nav aria-label="مسیر صفحه"><a href="/">خانه</a> ← <a href="/products/">فروشگاه‌ها</a></nav><article><h1>${htmlEscape(product.name)}</h1>${imageHtml}<p>${htmlEscape(description)}</p>${sellerLink}${price}${tags}<p><a href="/products/">مشاهده سایر فروشگاه‌ها</a></p></article></main>`;
}
function sellerFallback(seller, sellerProducts) {
  const logo = validHttpUrl(seller.logoUrl) ? `<p><img src="${htmlEscape(seller.logoUrl)}" alt="لوگوی ${htmlEscape(seller.storeName)}" loading="eager" decoding="async"></p>` : "";
  const productsHtml = sellerProducts.length
    ? `<h2>محصولات این فروشگاه</h2><ul>${sellerProducts.map((product) => `<li><a href="/products/${encodeURIComponent(product.slug)}/">${htmlEscape(product.name)}</a>${product.shortDescription ? ` — ${htmlEscape(trimDescription(product.shortDescription))}` : ""}</li>`).join("")}</ul>`
    : "<p>محصول منتشرشده‌ای برای این فروشگاه در کاتالوگ فعلی ثبت نشده است.</p>";
  return `<main class="seo-fallback"><nav aria-label="مسیر صفحه"><a href="/">خانه</a> ← <a href="/products/">فروشگاه‌ها</a></nav><article><h1>${htmlEscape(seller.storeName)}</h1>${logo}<p>${htmlEscape(trimDescription(seller.description) || `ویترین ${seller.storeName} در 3DMarketIran؛ محصولات این فروشگاه را بررسی کنید و برای اطلاعات بیشتر با فروشنده ارتباط بگیرید.`)}</p>${productsHtml}<p><a href="/products/">بازگشت به فهرست فروشگاه‌ها</a></p></article></main>`;
}
function websiteSchema() {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${site}/#organization`, name: "3DMarketIran", url: `${site}/`, logo: `${site}/3dmarketiran-logo.svg`, description: brandDescription },
    { "@type": "WebSite", "@id": `${site}/#website`, name: "3DMarketIran", url: `${site}/`, inLanguage: "fa-IR", publisher: { "@id": `${site}/#organization` } },
    { "@type": "WebPage", "@id": `${site}/#webpage`, url: `${site}/`, name: "3DMarketIran | نمایش سه‌بعدی و واقعیت افزوده محصولات", description: brandDescription, inLanguage: "fa-IR", isPartOf: { "@id": `${site}/#website` } },
  ] };
}
function webpageSchema(name, route, description) {
  return { "@context": "https://schema.org", "@type": "WebPage", "@id": `${absoluteUrl(route)}#webpage`, url: absoluteUrl(route), name, description, inLanguage: "fa-IR", isPartOf: { "@id": `${site}/#website` } };
}
function sellerDirectorySchema() {
  const items = indexableSellers.slice(0, 30).map((seller, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: seller.storeName,
    url: absoluteUrl(`/sellers/${encodeURIComponent(seller.slug)}/`),
  }));
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", "@id": `${absoluteUrl("/products/")}#webpage`, url: absoluteUrl("/products/"), name: "فروشگاه‌های سه‌بعدی ایران", description: "فهرست ویترین فروشگاه‌هایی که محصولات سه‌بعدی و واقعیت افزوده را در 3DMarketIran معرفی می‌کنند.", inLanguage: "fa-IR", isPartOf: { "@id": `${site}/#website` } },
    ...(items.length ? [{ "@type": "ItemList", name: "فروشگاه‌های 3DMarketIran", itemListElement: items }] : []),
  ] };
}
function productSchema(product, description) {
  const route = `/products/${encodeURIComponent(product.slug)}/`;
  const image = (product.images || []).filter((item) => validHttpUrl(item.url)).map((item) => item.url);
  // The public UI expresses product.price in toman. schema.org uses the ISO 4217
  // currency code IRR, whose rial value is 10 times the displayed toman amount.
  const numericToman = product.price != null ? Number(product.price) : NaN;
  const offers = Number.isFinite(numericToman) && numericToman >= 0
    ? { "@type": "Offer", price: String(Math.round(numericToman) * 10), priceCurrency: "IRR", url: absoluteUrl(route), ...(product.seller?.storeName ? { seller: { "@type": "Organization", name: product.seller.storeName } } : {}) }
    : undefined;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Product", "@id": `${absoluteUrl(route)}#product`, name: product.name, description, sku: String(product.id || product.slug), url: absoluteUrl(route), ...(image.length ? { image } : {}), ...(offers ? { offers } : {}), inLanguage: "fa-IR" },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: "فروشگاه‌ها", item: `${site}/products/` },
      { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(route) },
    ] },
  ] };
}
function sellerSchema(seller, route, description) {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "ProfilePage", "@id": `${absoluteUrl(route)}#profile`, url: absoluteUrl(route), name: `${seller.storeName} | فروشگاه سه‌بعدی | 3DMarketIran`, description, inLanguage: "fa-IR", mainEntity: { "@type": "Organization", name: seller.storeName, url: absoluteUrl(route), ...(seller.description ? { description: trimDescription(seller.description) } : {}), ...(validHttpUrl(seller.logoUrl) ? { logo: seller.logoUrl } : {}) } },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: `${site}/` },
      { "@type": "ListItem", position: 2, name: "فروشگاه‌ها", item: `${site}/products/` },
      { "@type": "ListItem", position: 3, name: seller.storeName, item: absoluteUrl(route) },
    ] },
  ] };
}
function renderPage(html, page) {
  const canonical = absoluteUrl(page.canonicalPath || page.path);
  const title = htmlEscape(compactTitle(page.title));
  const description = htmlEscape(metaDescription(page.description));
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = replaceMeta(html, "name", "description", description);
  html = replaceMeta(html, "name", "robots", page.noIndex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
  html = replaceMeta(html, "property", "og:title", title);
  html = replaceMeta(html, "property", "og:description", description);
  html = replaceMeta(html, "property", "og:url", canonical);
  html = replaceMeta(html, "property", "og:type", "website");
  html = replaceMeta(html, "property", "og:site_name", "3DMarketIran");
  html = replaceMeta(html, "property", "og:locale", "fa_IR");
  html = replaceMeta(html, "property", "og:image", page.image ? htmlEscape(page.image) : undefined);
  html = replaceMeta(html, "name", "twitter:card", page.image ? "summary_large_image" : "summary");
  html = replaceMeta(html, "name", "twitter:title", title);
  html = replaceMeta(html, "name", "twitter:description", description);
  html = replaceMeta(html, "name", "twitter:image", page.image ? htmlEscape(page.image) : undefined);
  const canonicalTag = `<link rel="canonical" href="${htmlEscape(canonical)}" />`;
  if (/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\/?\s*>/i.test(html)) {
    html = html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\/?\s*>/i, canonicalTag);
  } else {
    html = html.replace(/<\/head>/i, `  ${canonicalTag}\n</head>`);
  }
  html = html.replace(/<script\b[^>]*data-seo-jsonld=["']true["'][^>]*>[\s\S]*?<\/script>/gi, "");
  if (page.schema) html = html.replace(/<\/head>/i, `<script type="application/ld+json" data-seo-jsonld="true">${safeJson(page.schema)}</script>\n</head>`);
  const rootMarkup = `<div id="root">${page.body}</div>`;
  html = html.replace(/<div\s+id=["']root["']\s*>[\s\S]*?<\/div>/i, rootMarkup);
  return html;
}
function replaceMeta(html, attr, name, content) {
  const regex = new RegExp(`<meta\\b(?=[^>]*\\b${attr}=["']${escapeRegex(name)}["'])[^>]*\\/?\\s*>`, "i");
  if (!content) return html.replace(regex, "");
  const tag = `<meta ${attr}="${name}" content="${content}" />`;
  return regex.test(html) ? html.replace(regex, tag) : html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}
function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function writeRoute(relativePath, contents) {
  const output = path.join(dist, relativePath);
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, contents, "utf8");
}
function buildSitemap(urls) {
  const seen = new Set();
  const rows = urls.map(({ path: route, lastmod }) => {
    if (route.includes("#") || route.includes("?")) throw new Error(`Sitemap URL cannot include query/hash: ${route}`);
    const loc = absoluteUrl(route);
    if (seen.has(loc)) throw new Error(`Duplicate sitemap URL: ${loc}`);
    seen.add(loc);
    return `  <url><loc>${xmlEscape(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows.join("\n")}\n</urlset>\n`;
}
function xmlEscape(value) { return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;"); }
function validateOutput(urls) {
  const sitemap = readFileSync(path.join(dist, "sitemap.xml"), "utf8");
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = match[1].replace(/&amp;/g, "&");
    if (/[#?]/.test(new URL(loc).hash + new URL(loc).search) || /[#?]/.test(loc)) throw new Error(`Sitemap URL contains a fragment or query: ${loc}`);
  }
  if (indexableSellers.length > 0 && !sitemap.includes(`${site}/products/`)) throw new Error("Sitemap is missing the indexable products directory.");
  const robots = readFileSync(path.join(dist, "robots.txt"), "utf8");
  if (!robots.includes(`${site}/sitemap.xml`)) throw new Error("robots.txt does not reference the generated sitemap.");
  for (const { path: route } of urls) {
    const relative = route === "/" ? "index.html" : path.join(route.slice(1), "index.html");
    if (!existsSync(path.join(dist, relative))) throw new Error(`Generated sitemap route is missing on disk: ${route}`);
  }
  const productHtmlPaths = validProducts.map((p) => path.join(dist, "products", safeSlug(p.slug), "index.html"));
  for (const [index, file] of productHtmlPaths.entries()) {
    const html = readFileSync(file, "utf8");
    const expectedCanonical = `<link rel="canonical" href="${htmlEscape(absoluteUrl(`/products/${encodeURIComponent(validProducts[index].slug)}/`))}" />`;
    if (!/<h1[\s>]/i.test(html) || !html.includes(expectedCanonical)) throw new Error(`Product page is missing H1/canonical: ${file}`);
    if (isIndexableProduct(validProducts[index]) && !/application\/ld\+json/.test(html)) throw new Error(`Product page is missing JSON-LD: ${file}`);
  }
}
