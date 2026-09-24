import type { PlatformSettings } from "../types";

/**
 * Applies white-label platform branding.
 *
 * Branding is driven entirely by the platform settings so the
 * public storefront can be customized without changing the
 * application source code.
 */
export function applyBranding(
  settings: PlatformSettings | null
) {
  if (!settings) return;

  const root = document.documentElement;

  const colorPrimary =
    settings.colorPrimary || "#111827";

  const colorSecondary =
    settings.colorSecondary || "#374151";

  const colorAccent =
    settings.colorAccent || colorPrimary;

  const colorBackground =
    settings.colorBackground || "#ffffff";

  const colorText =
    settings.colorText || "#111827";

  const fontFamily =
    settings.fontFamily?.trim() ||
    "system-ui";

  const platformName =
    settings.platformName?.trim() ||
    "3D Market";

  /* --------------------------------
   * CSS custom properties
   * -------------------------------- */

  root.style.setProperty(
    "--color-primary",
    colorPrimary
  );

  root.style.setProperty(
    "--color-secondary",
    colorSecondary
  );

  root.style.setProperty(
    "--color-accent",
    colorAccent
  );

  root.style.setProperty(
    "--color-background",
    colorBackground
  );

  root.style.setProperty(
    "--color-text",
    colorText
  );

  root.style.setProperty(
    "--font-family",
    `"${fontFamily}", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
  );

  /* Helpful aliases used by the responsive UI. */
  root.style.setProperty(
    "--brand-primary",
    colorPrimary
  );

  root.style.setProperty(
    "--brand-secondary",
    colorSecondary
  );

  root.style.setProperty(
    "--brand-accent",
    colorAccent
  );

  root.style.setProperty(
    "--brand-background",
    colorBackground
  );

  root.style.setProperty(
    "--brand-text",
    colorText
  );

  /* --------------------------------
   * Browser / document branding
   * -------------------------------- */

  document.title = platformName;

  let themeMeta =
    document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]'
    );

  if (!themeMeta) {
    themeMeta =
      document.createElement("meta");

    themeMeta.name = "theme-color";

    document.head.appendChild(themeMeta);
  }

  themeMeta.content = colorPrimary;

  /* --------------------------------
   * Favicon
   * -------------------------------- */

  if (settings.faviconUrl) {
    let favicon =
      document.querySelector<HTMLLinkElement>(
        'link[rel="icon"]'
      );

    if (!favicon) {
      favicon =
        document.createElement("link");

      favicon.rel = "icon";

      document.head.appendChild(favicon);
    }

    favicon.href = settings.faviconUrl;
  }

  /* --------------------------------
   * Apple mobile web-app branding
   * -------------------------------- */

  let appleMeta =
    document.querySelector<HTMLMetaElement>(
      'meta[name="apple-mobile-web-app-title"]'
    );

  if (!appleMeta) {
    appleMeta =
      document.createElement("meta");

    appleMeta.name =
      "apple-mobile-web-app-title";

    document.head.appendChild(appleMeta);
  }

  appleMeta.content = platformName;
}
