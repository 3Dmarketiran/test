# V54 — Reliable AR launch

- AR button no longer waits asynchronously inside the click handler before calling `model-viewer.activateAR()`.
- The button is enabled only after `model-viewer` reports that AR can actually be activated.
- This preserves the browser/iOS transient user-activation gesture required by AR launch.
- Removed the intermittent first-click race between React mounting, model loading, and AR activation.
- Existing fixed AR scale behavior is unchanged.
