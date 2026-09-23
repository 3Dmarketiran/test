import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("public-data");

async function read(name) {
  return JSON.parse(await fs.readFile(path.join(ROOT, name), "utf8"));
}

function assertAbsoluteUrl(value, label) {
  if (!value) return;
  let url;
  try { url = new URL(value); } catch { throw new Error(`${label} URL is invalid: ${value}`); }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`${label} must use http(s): ${value}`);
  }
}

const products = await read("products.json");
const sellers = await read("sellers.json");

let refs = 0;
for (const seller of sellers) {
  assertAbsoluteUrl(seller.logoUrl, `seller ${seller.slug} logo`);
  refs += seller.logoUrl ? 1 : 0;
}

for (const product of products) {
  for (const image of product.images ?? []) {
    assertAbsoluteUrl(image.url, `product ${product.slug} image`);
    refs++;
  }
  for (const model of product.models ?? []) {
    assertAbsoluteUrl(model.url, `product ${product.slug} ${model.kind}`);
    refs++;
    const expected = model.kind.toLowerCase();
    const actual = model.url.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();
    if (actual && expected !== actual && !(model.kind === "GLTF" && actual === "gltf")) {
      console.warn(`⚠️ ${product.slug}: ${model.kind} URL extension looks like .${actual}`);
    }
  }
}

console.log(`✅ public asset references checked: ${refs}`);
