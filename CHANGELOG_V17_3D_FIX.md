# V17 — 3D Viewer Loading Fix

This version is based directly on the V15 public site and keeps the visual design unchanged.

Only the model-viewer loading behavior was changed:
- `loading="lazy"` -> `loading="eager"` so the GLB starts immediately when the viewer is shown.
- `reveal="interaction"` -> `reveal="auto"` so the viewer does not wait for a user interaction before revealing the loaded model.

No layout, colors, typography, navigation, cards, seller pages, or other public-site UI were changed.

Backend remains the stable V12 build.
