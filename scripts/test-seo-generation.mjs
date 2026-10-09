import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const tempRoot = mkdtempSync(path.join(tmpdir(), "3dmarketiran-seo-test-"));
const dist = path.join(tempRoot, "dist");
const scripts = path.join(tempRoot, "scripts");
const dataDir = path.join(tempRoot, "public-data");

try {
  mkdirSync(dist, { recursive: true });
  mkdirSync(scripts, { recursive: true });
  mkdirSync(dataDir, { recursive: true });
  for (const script of ["postbuild.mjs", "verify-seo-build.mjs"]) {
    copyFileSync(path.join(projectRoot, "scripts", script), path.join(scripts, script));
  }
  for (const file of ["CNAME", "3dmarketiran-logo.svg"]) {
    const source = path.join(projectRoot, file);
    if (existsSync(source)) copyFileSync(source, path.join(tempRoot, file));
  }
  for (const file of ["robots.txt", "llms.txt"]) {
    const source = path.join(projectRoot, "public", file);
    if (existsSync(source)) copyFileSync(source, path.join(dist, file));
  }

  const catalog = {
    schemaVersion: 2,
    generatedAt: "2026-10-09T00:00:00.000Z",
    version: "seo-fixture-v1",
    products: [
      {
        id: "fixture-real-product",
        slug: "modern-chair-3d",
        name: "صندلی مدرن سه‌بعدی",
        shortDescription: "صندلی مدرن با طراحی مینیمال برای مشاهده مدل سه‌بعدی و بررسی جزئیات ظاهری پیش از تماس با فروشنده.",
        fullDescription: "مدل سه‌بعدی صندلی مدرن با طراحی مینیمال.",
        tags: ["صندلی", "مبلمان", "مدل سه‌بعدی"],
        price: 1290000,
        seller: { id: "fixture-real-seller", slug: "aria-furniture", storeName: "مبلمان آریا" },
        images: [{ url: "https://cdn.3dmarketiran.ir/fixtures/modern-chair.webp", isPrimary: true }],
        models: [{ kind: "GLB", url: "https://cdn.3dmarketiran.ir/fixtures/modern-chair.glb" }],
        publishedAt: "2026-10-01T00:00:00.000Z"
      },
      {
        id: "fixture-test-product",
        slug: "test-product-fixture",
        name: "test",
        shortDescription: "test",
        fullDescription: null,
        tags: [],
        price: null,
        seller: { id: "fixture-test-seller", slug: "test-store-fixture", storeName: "test" },
        images: [],
        models: [],
        publishedAt: null
      }
    ],
    sellers: [
      { id: "fixture-real-seller", slug: "aria-furniture", storeName: "مبلمان آریا", description: "فروشگاه مبلمان آریا؛ معرفی مبلمان و محصولات با طراحی مدرن و نمایش سه‌بعدی تعاملی.", logoUrl: "https://cdn.3dmarketiran.ir/fixtures/aria-logo.webp" },
      { id: "fixture-test-seller", slug: "test-store-fixture", storeName: "test", description: null, logoUrl: null }
    ],
    settings: { platformName: "3DMarketIran" },
    plans: [],
    planCategories: []
  };
  writeFileSync(path.join(dataDir, "catalog.json"), JSON.stringify(catalog, null, 2));
  writeFileSync(path.join(dist, "index.html"), `<!doctype html><html lang="fa-IR" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>SEO fixture</title><meta name="description" content="یک توضیح آزمایشی با طول کافی برای اعتبارسنجی عنوان و توضیح صفحه اصلی سایت."><meta name="robots" content="index,follow"><meta property="og:title" content="SEO fixture"><meta property="og:description" content="SEO fixture description"><meta property="og:url" content="https://3dmarketiran.ir/"><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><link rel="canonical" href="https://3dmarketiran.ir/"><link rel="icon" href="/3dmarketiran-logo.svg"><script defer src="/assets/app-fixture.js"></script></head><body><div id="root"></div></body></html>`);
  mkdirSync(path.join(dist, "assets"), { recursive: true });
  writeFileSync(path.join(dist, "assets", "app-fixture.js"), "// synthetic built asset for testing static SEO route generation\n");

  runNode(path.join(scripts, "postbuild.mjs"));
  runNode(path.join(scripts, "verify-seo-build.mjs"));

  const sitemap = readFileSync(path.join(dist, "sitemap.xml"), "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (!sitemapUrls.includes("https://3dmarketiran.ir/products/modern-chair-3d/")) throw new Error("A valid product is missing from sitemap.xml");
  if (!sitemapUrls.includes("https://3dmarketiran.ir/sellers/aria-furniture/")) throw new Error("A valid seller is missing from sitemap.xml");
  if (sitemapUrls.some((url) => /test-product-fixture|test-store-fixture/.test(url))) throw new Error("A fixture/test route was incorrectly included in sitemap.xml");
  const productHtml = readFileSync(path.join(dist, "products", "modern-chair-3d", "index.html"), "utf8");
  if (!productHtml.includes('"price":"12900000"') || !productHtml.includes('"priceCurrency":"IRR"')) throw new Error("Product Offer price conversion is missing or incorrect");
  const testProductHtml = readFileSync(path.join(dist, "products", "test-product-fixture", "index.html"), "utf8");
  if (!/name="robots" content="noindex,follow"/.test(testProductHtml)) throw new Error("Test product must be marked noindex");
  console.log(`✅ SEO generation fixture passed: ${sitemapUrls.length} canonical URLs; valid product/seller routes indexed; test records excluded; toman→IRR offer verified.`);
} catch (error) {
  console.error(`❌ SEO generation fixture failed: ${error?.stack || error}`);
  process.exitCode = 1;
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

function runNode(script) {
  const result = spawnSync(process.execPath, [script], {
    cwd: tempRoot,
    encoding: "utf8",
    env: { ...process.env, PUBLIC_SITE_URL: "https://3dmarketiran.ir", PUBLIC_BASE_PATH: "/" },
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) throw new Error(`${path.basename(script)} exited with status ${result.status}`);
}
