import { useEffect } from "react";
import { PUBLIC_SITE_URL } from "./config";

interface SeoOptions {
  /** Keep pre-rendered metadata untouched while async product/store data is loading. */
  enabled?: boolean;
  title: string;
  description?: string;
  image?: string | null;
  canonicalPath?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | null;
}

/** Keep metadata correct during client-side navigation; the postbuild step emits the same metadata in each crawlable HTML route. */
export function useSeo({
  enabled = true,
  title,
  description,
  image,
  canonicalPath,
  noIndex = false,
  structuredData,
}: SeoOptions) {
  useEffect(() => {
    if (!enabled) return;
    const canonicalUrl = new URL(canonicalPath || window.location.pathname, `${PUBLIC_SITE_URL}/`);
    canonicalUrl.search = "";
    canonicalUrl.hash = "";
    const canonicalHref = canonicalUrl.href;

    const safeTitle = compactTitle(title);
    document.title = safeTitle;
    const safeDescription = compactDescription(description || "بازارگاه 3DMarketIran برای معرفی فروشگاه‌ها و مشاهده محصولات سه‌بعدی و واقعیت افزوده.");
    setMeta("description", safeDescription);
    setMeta("robots", noIndex ? "noindex,follow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    setMeta("og:title", safeTitle, "property");
    setMeta("og:description", safeDescription, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", canonicalHref, "property");
    setMeta("og:image", image || undefined, "property");
    setMeta("twitter:card", image ? "summary_large_image" : "summary");
    setMeta("twitter:title", safeTitle);
    setMeta("twitter:description", safeDescription);
    setMeta("twitter:image", image || undefined);
    setCanonical(canonicalHref);
    const schema = structuredData === undefined
      ? noIndex
        ? null
        : {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${canonicalHref}#webpage`,
            url: canonicalHref,
            name: safeTitle,
            description: safeDescription,
            inLanguage: "fa-IR",
            isPartOf: { "@id": `${PUBLIC_SITE_URL}/#website` },
          }
      : structuredData;
    setStructuredData(schema);
  }, [enabled, title, description, image, canonicalPath, noIndex, structuredData]);
}

function setMeta(name: string, content?: string, attr: "name" | "property" = "name") {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

function setStructuredData(data?: Record<string, unknown> | null) {
  // Reuse the static JSON-LD generated at build time instead of leaving two
  // competing Product/Organization entities after client-side rendering.
  const existing = document.getElementById("app-seo-jsonld")
    || document.querySelector<HTMLScriptElement>('script[data-seo-jsonld="true"]');
  if (!data) {
    existing?.remove();
    return;
  }
  const script = existing instanceof HTMLScriptElement
    ? existing
    : document.createElement("script");
  script.id = "app-seo-jsonld";
  script.removeAttribute("data-seo-jsonld");
  script.type = "application/ld+json";
  // Escape HTML-significant characters to ensure JSON-LD cannot terminate its script element.
  script.textContent = JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
  if (!script.isConnected) document.head.appendChild(script);
}

function compactDescription(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 160) return normalized;
  return `${normalized.slice(0, 157).trimEnd()}…`;
}

function compactTitle(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= 70) return normalized;
  const suffix = " | 3DMarketIran";
  if (normalized.endsWith(suffix)) return `${normalized.slice(0, 70 - suffix.length - 1).trimEnd()}…${suffix}`;
  return `${normalized.slice(0, 69).trimEnd()}…`;
}
