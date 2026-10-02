# V62 — AR handoff and browser media routing

- Replaced the detached React AR launcher with the documented `model-viewer` `slot="ar-button"` integration for Android/native viewer handoff. This lets model-viewer select Scene Viewer/WebXR and own its gesture lifecycle instead of bypassing its internal AR button handler.
- Prioritized `scene-viewer` before `webxr` for Android, with Quick Look retained as the iOS mode.
- Added a real user-activated `<a rel="ar" href="...USDZ">` path on iOS when a USDZ asset exists. This follows Apple's web Quick Look link pattern and avoids depending only on the model-viewer synthesized handoff.
- Kept lazy media behavior and existing browser cache policy; no new service, database, migration, or paid dependency was introduced.

## Verification
- Public JSON and asset-reference validators passed.
- Full Vite build could not be completed in this environment because the Vite executable/dependencies were absent; dependency installation timed out. Real-device iOS/Android tests and Iran-network tests remain required before claiming universal AR success.
