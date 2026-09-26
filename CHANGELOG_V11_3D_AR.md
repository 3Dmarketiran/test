# V11 — 3D/AR asset delivery fix

- Legacy Supabase Storage URLs in the bundled catalog are converted to the backend public asset proxy.
- Live catalog model URLs are preserved and used directly.
- GLB/GLTF/USDZ model loading is now independent of the public site's custom domain and storage provider URL.
