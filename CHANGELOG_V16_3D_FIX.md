# Public Site V16 — 3D viewer reliability fix

- 3D viewer now loads eagerly and reveals the model automatically after it is ready.
- Added a 45-second timeout so a stalled model request cannot leave an infinite spinner.
- Added a retry action that remounts the model viewer cleanly.
- Existing V15 design, catalog and seller UX remain unchanged.
