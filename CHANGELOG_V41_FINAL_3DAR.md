# V41 — Final 3D loading + native AR fix

- Restored a real `slot="ar-button"` child inside `model-viewer`; AR clicks now go through model-viewer native handling for Quick Look / Scene Viewer / WebXR.
- Removed the separate external AR button and the manual async `activateAR()` flow, which can lose the browser's user-gesture context.
- Set model loading to `eager` (not lazy).
- Reattached load/error listeners whenever the conditional 3D viewer mounts by including `viewMode` in the listener effect dependencies; initial `loaded` state is checked on attach.
- Overrode legacy CSS that hid the native AR button.

Only `public` changed.
