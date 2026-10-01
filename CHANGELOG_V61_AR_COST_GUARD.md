# V61 AR reliability and cost-conscious loading

- Prioritize Android Scene Viewer before in-browser WebXR so the native Android AR handoff is attempted first.
- When launching AR, check the live model-viewer `loaded` state as well as the React readiness ref; this covers route/refresh timing where the custom element has loaded before the React listener state catches up.
- No new paid provider, database migration, or storage migration is introduced.
- Existing backend asset proxy cache headers remain `public, max-age=31536000, immutable`; asset URLs should remain content/version-specific for safe long-lived caching.

Validation status: public data and asset-reference validators pass. Full Vite build could not be completed in this environment because the Vite executable/dependencies were not installed; `npm ci` timed out. No real Android/iOS device or Iran-network test was performed.
