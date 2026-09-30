import React, { useEffect, useState } from "react";

const LOGO_SRC = `${import.meta.env.BASE_URL || "/"}assets/3dmarketiran-logo-transparent.webp`;

export default function SitePreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    const minVisibleMs = 420;
    const maxVisibleMs = 1800;

    const logo = new Image();
    logo.src = LOGO_SRC;
    const logoReady = typeof logo.decode === "function"
      ? logo.decode().catch(() => undefined)
      : new Promise<void>((resolve) => { logo.onload = () => resolve(); logo.onerror = () => resolve(); });

    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const hide = () => {
      if (cancelled) return;
      const elapsed = performance.now() - startedAt;
      const wait = Math.max(0, minVisibleMs - elapsed);
      window.setTimeout(() => {
        if (cancelled) return;
        setLeaving(true);
        window.setTimeout(() => {
          if (!cancelled) setVisible(false);
        }, 320);
      }, wait);
    };

    Promise.all([logoReady, pageReady]).then(hide).catch(hide);
    const fallback = window.setTimeout(hide, maxVisibleMs);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`site-preloader${leaving ? " is-leaving" : ""}`} aria-label="در حال آماده‌سازی سایت" role="status">
      <div className="site-preloader__content">
        <div className="site-preloader__logo-wrap">
          <img
            className="site-preloader__logo"
            src={LOGO_SRC}
            alt="3Dmarketiran"
            width={210}
            height={212}
            decoding="async"
            fetchPriority="high"
            onError={(event) => {
              const target = event.currentTarget;
              if (!target.src.endsWith(".png")) target.src = `${import.meta.env.BASE_URL || "/"}assets/3dmarketiran-logo-transparent.png`;
            }}
          />
        </div>
        <div className="site-preloader__line" aria-hidden="true"><span /></div>
        <span className="site-preloader__label">3Dmarketiran</span>
      </div>
    </div>
  );
}
