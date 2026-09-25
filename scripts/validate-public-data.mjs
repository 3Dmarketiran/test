// Runs in GitHub Actions before the site is built (spec section 39:
// "Validate the build"). If the backend ever commits malformed
// public-data JSON, this fails the workflow instead of deploying a
// broken public site.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = path.join(root, "public-data");

const files = {
  "products.json": validateProducts,
  "sellers.json": validateSellers,
  "categories.json": validateArray,
  "settings.json": validateSettings,
  "catalog.json": validateCatalog,
  "plans.json": validatePlans,
};

let hadError = false;

for (const [file, validator] of Object.entries(files)) {
  const filePath = path.join(dataDir, file);
  try {
    const raw = readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    validator(data, file);
    console.log(`✅ ${file} is valid (${Array.isArray(data) ? data.length + " items" : "object"})`);
  } catch (err) {
    hadError = true;
    console.error(`❌ ${file} failed validation: ${err.message}`);
  }
}

if (hadError) {
  console.error("\nBuild validation failed — aborting before deploy.");
  process.exit(1);
}

function validateArray(data, file) {
  if (!Array.isArray(data)) throw new Error(`${file} must be a JSON array`);
}

function validateProducts(data) {
  validateArray(data, "products.json");
  for (const p of data) {
    if (!p.slug || !p.name || !p.seller?.slug) {
      throw new Error(`product missing required fields: ${JSON.stringify(p).slice(0, 120)}`);
    }
  }
}

function validateSellers(data) {
  validateArray(data, "sellers.json");
  for (const s of data) {
    if (!s.slug || !s.storeName) {
      throw new Error(`seller missing required fields: ${JSON.stringify(s).slice(0, 120)}`);
    }
  }
}

function validateSettings(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("settings.json must be a JSON object");
  }
}


function validateCatalog(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("catalog.json must be an object");
  if (!Array.isArray(data.products) || !Array.isArray(data.sellers) || !Array.isArray(data.categories)) throw new Error("catalog.json arrays are missing");
  if (!data.settings || typeof data.settings !== "object") throw new Error("catalog.json settings are missing");
  if (!Array.isArray(data.plans)) throw new Error("catalog.json plans are missing");
  if (!data.version || !data.generatedAt) throw new Error("catalog.json version metadata is missing");
}

function validatePlans(data) { validateArray(data, "plans.json"); for (const plan of data) { if (!plan.id || !plan.name || !Number.isFinite(plan.durationDays) || !Number.isFinite(plan.price)) throw new Error(`invalid plan: ${JSON.stringify(plan).slice(0,120)}`); } }
