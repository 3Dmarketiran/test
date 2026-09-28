# V39 — Final AR correction

- Restored the V11 rendering architecture for the 3D viewer: `<model-viewer>` is mounted only while `viewMode === "3d"`.
- Restored the V11 attribute order/behavior: `ios-src`, `poster`, `ar`, and `ar-modes="webxr scene-viewer quick-look"`.
- Kept the current design and compact `AR` label.
- Removed the preloaded hidden 3D instance from the image view; this prevents the native AR slot from being initialized while hidden.
- Added a final CSS rule that keeps the native `slot="ar-button"` visible and clickable without replacing its click behavior.
- Hamburger behavior remains current; only `public` needs to be uploaded.
