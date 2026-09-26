import { useEffect } from "react";
import { PUBLIC_SITE_URL } from "./config";

interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
}

/** Sets document title + meta tags per-page (spec section 33 — SEO for the static site). */
export function useSeo({ title, description, image, canonicalPath }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", image, "property");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (canonicalPath) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = new URL(canonicalPath.replace(/^\//, ""), `${PUBLIC_SITE_URL}/`).href;
    }
  }, [title, description, image, canonicalPath]);
}

function setMeta(name: string, content?: string, attr: "name" | "property" = "name") {
  if (!content) return;
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
