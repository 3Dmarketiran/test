# V57 — 3D AR Logo Hero

- Removed the SCROLL indicator from the hero.
- Removed scroll-position rotation; page scrolling no longer changes the hero cube.
- Reworked the hero core into a more geometrically cubic form with matched face/depth proportions.
- Replaced the generic `3D` / `AR` cube concept with a 3D AR logo treatment: `3D` + `AR` on the main face and mirrored treatment on the back face.
- Removed the rotating wire overlays that caused visual noise/flicker on small screens.
- Reduced mobile perspective/animation intensity and added backface visibility controls for more stable rendering.
- Kept the hero fully abstract; it does not load a catalog product or add any dependency/infrastructure.
