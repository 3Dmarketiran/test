import type { PlatformSettings } from "../types";

/** Writes white-label branding (spec section 16) onto CSS custom properties + document head. */
export function applyBranding(settings: PlatformSettings | null) {
  if (!settings) return;
  const root = document.documentElement.style;
  root.setProperty("--color-primary", settings.colorPrimary);
  root.setProperty("--color-secondary", settings.colorSecondary);
  root.setProperty("--color-accent", settings.colorAccent);
  root.setProperty("--color-background", settings.colorBackground);
  root.setProperty("--color-text", settings.colorText);
  root.setProperty("--font-family", `"${settings.fontFamily}", system-ui, sans-serif`);

  document.title = settings.platformName;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", settings.colorPrimary);

  if (settings.faviconUrl) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link) link.href = settings.faviconUrl;
  }
}
