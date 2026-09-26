# 3D Viewer Fix

In `src/components/ProductViewer.tsx`:
- `reveal="interaction"` -> `reveal="auto"`
- `loading="lazy"` -> `loading="eager"`

This makes model-viewer start loading the GLB immediately.
It does not alter the stored model URL or Storage configuration.
