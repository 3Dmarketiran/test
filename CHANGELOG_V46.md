# V46 — logo visibility, mobile seller logos, image loading

- Replaced the platform logo asset with a genuinely transparent PNG/WebP version derived from the supplied logo.
- Added PNG fallback for the header and preloader logo.
- Public branding now uses the local 3Dmarketiran logo consistently instead of depending on a missing/stale settings logo URL.
- Hardened seller-logo URL normalization for Supabase Storage URLs and backend public-asset URLs.
- Fixed mobile seller-logo cards so logos use a bounded `contain` box and cannot be cropped.
- Prioritized the first visible product-card images and preloaded the first product-detail images.
- Product detail now warms the first four photos in the background while keeping off-screen images lazy.

## V47
- Replaced the site/preloader logo assets with the newly supplied transparent logo.
- Fixed mobile hamburger navigation so the drawer opens from the left edge, aligned with the left-side hamburger, with a fixed mobile overlay and reliable z-index.
- Removed the opaque navy square behind the header logo so the supplied transparent logo is shown directly.
