# V60 — Android AR readiness and backend media routing

- Do not treat a transient `canActivateAR === false` during custom-element hydration/reload as a definitive unsupported-device result. The AR action remains available after the GLB is loaded and can be retried from a direct user gesture.
- New product image/model URLs with storage keys are now exposed through the existing public backend asset endpoint rather than returning direct provider URLs to visitors. This removes direct browser dependence on Supabase reachability.
- Legacy ZIP package URLs remain on the existing compatibility endpoint.

## Validation limits
- Public JSON/assets validation scripts passed in the working copy.
- Full Vite build could not be run because npm dependency installation did not complete in this environment (`vite: not found`).
- No physical Android/iPhone or Iranian carrier network test was available.
- Backend media proxy still reads full objects into memory and sends them through Render; this is a compatibility path, not a zero-egress-cost CDN. Measure Render bandwidth after deployment.
