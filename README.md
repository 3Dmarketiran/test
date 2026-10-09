# 3DMarketIran — Public storefront

The public storefront is published to GitHub Pages on the custom domain `https://3dmarketiran.ir/`. The backend publishes a catalog snapshot into `public-data/` and dispatches the site workflow; the deployed HTML and sitemap are generated from that exact snapshot.

## SEO and GEO

The public build generates crawlable path-based HTML for the home page, seller directory, information pages, and eligible product/seller details. Each generated page receives its own title, meta description, canonical URL, robots directives, Open Graph metadata, and schema.org JSON-LD. The XML sitemap contains only canonical URLs that have an HTML file and are eligible for indexing. Obvious test/placeholder or incomplete detail records remain in the public snapshot but are excluded from the sitemap and marked `noindex`; they are not silently deleted.

Product prices are displayed in toman in the UI. Where a real public price is available, Product structured data expresses the equivalent amount in Iranian rial (`IRR`, 10 rial per toman). The build checks that this conversion remains consistent. Availability, ratings, warranties, shipping and other facts are not inferred when the catalog does not provide them.

## Local build

Use Node.js 20+ and npm 10+:

```sh
npm ci --no-audit --no-fund
npm run build
```

`npm run build` validates the public catalog and asset references, runs the TypeScript semantic type-check, builds the Vite production bundle, prerenders HTML routes, generates `sitemap.xml` and validates metadata, canonicals, indexation rules, JSON-LD, product price conversion, 404, `robots.txt`, and deploy files. GitHub Actions executes the same build before deployment.

## After deployment

1. Open `https://3dmarketiran.ir/robots.txt` and `https://3dmarketiran.ir/sitemap.xml` and verify they return successfully.
2. Submit `https://3dmarketiran.ir/sitemap.xml` in Google Search Console.
3. Use URL Inspection on one product URL and one seller URL; check crawling, indexing and the selected canonical.
4. Review Page Indexing and Core Web Vitals reports after Google has recrawled the site.

Static HTML and structured data improve crawlability and eligibility; they do not guarantee indexing, rich-result display, or ranking position. Rankings additionally depend on useful unique product/store descriptions, internal/external links, competitors, user experience, and ongoing maintenance. See `SEO_GEO_RELEASE_V102_FA.md` for the implementation notes.
