# V41 — Final 3D/AR behavior fix

- Kept the current visual design.
- 3D model-viewer is mounted eagerly from the product page (`loading="eager"`) instead of being created only after the 3D button is clicked. This prevents the first 3D click from being stuck in loading while the model starts downloading.
- Restored the native `model-viewer` AR button via `slot="ar-button"`.
- Removed the custom `activateAR()` flow and the explicit bottom AR button. This preserves the real user gesture required by iOS Quick Look / Android Scene Viewer and their system permission flow.
- Kept `ar`, `ar-modes="webxr scene-viewer quick-look"`, and `ios-src`.
- The native AR button is visible only while the 3D viewer is active; it is not shown while the model is preloading invisibly.
- Public data validation: PASS.
- Public asset validation: PASS (6 references).
- Full Vite build not run successfully in this environment because dependencies/node_modules are unavailable (`vite: not found`).
