# V37 — AR rollback to V16–V19 behavior

- Preserved the current V36 public design.
- Restored the native `model-viewer` AR slot button behavior used in the V16–V19 family.
- Root cause found in the current CSS: later rules explicitly hid `.viewer-ar-button`, including a desktop-wide hide and a final `.viewer-ar-button{display:none!important}` override.
- Added a final scoped rule so the native slot button is visible whenever the 3D viewer is active.
- Kept `ar`, `ar-modes="webxr scene-viewer quick-look"`, and `ios-src` unchanged.
- Hamburger behavior/layout remains from the current design.
