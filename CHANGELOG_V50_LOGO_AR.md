# V50 — Fixed AR scale

- Removed the custom iOS Quick Look / Android Scene Viewer launch paths that bypassed model-viewer AR configuration.
- AR now launches through model-viewer so `ar-scale="fixed"` applies consistently.
- The product viewer keeps real-world scale locked when complete dimensions exist.
