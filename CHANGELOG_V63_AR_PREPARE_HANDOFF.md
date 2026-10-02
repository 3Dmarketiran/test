# V63 — AR preparation and explicit handoff

- AR action now enters a visible preparation state before launch.
- Model readiness is awaited with load/error handling and a 25-second timeout; no fabricated download percentage is shown.
- Once prepared, the UI requires a second explicit user tap to preserve browser user-activation requirements.
- iOS with USDZ uses a real `rel="ar"` Quick Look anchor after preparation; other supported browsers invoke model-viewer's `activateAR()` directly from the user click.
- Failure displays a Persian explanation and retry control; the 3D viewer and product images remain available.
- This preflight confirms the GLB/GLTF model-viewer load, not a guaranteed Quick Look cache/download completion for USDZ (the OS controls that handoff).

Validation: public data and asset validation passed. Full Vite build could not run in this environment because dependencies were unavailable (`vite: not found` after install timed out). Real iPhone/Android browser testing remains required.
