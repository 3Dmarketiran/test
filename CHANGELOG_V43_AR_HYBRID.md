# V43 — Reliable 3D/AR launch

- Kept the working 3D `model-viewer` implementation.
- Replaced the fragile slotted AR button with one direct button outside the viewer.
- iPhone/iPad with a real USDZ now launches Apple Quick Look through a native `rel="ar"` link during the actual user tap.
- Android/WebXR/Scene Viewer calls `model-viewer.activateAR()` directly from the user tap.
- If Android `activateAR()` rejects, a direct Google Scene Viewer URL is used as fallback.
- No delayed AR activation, timers, synthetic timeout-based clicks, or duplicate AR buttons.
- Existing GLB/GLTF/USDZ asset URLs are preserved and still normalized through the public backend proxy.
