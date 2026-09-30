import React, { useEffect, useState } from "react";
import { VISITOR_COUNTRY_API } from "../lib/config";

export default function IranVpnNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2200);

    fetch(VISITOR_COUNTRY_API, { signal: controller.signal, cache: "no-store", headers: { Accept: "application/json" } })
      .then((response) => response.ok ? response.json() : null)
      .then((data: { country?: string } | null) => {
        if (cancelled || data?.country !== "IR") return;
        try {
          if (window.sessionStorage.getItem("3dm-iran-vpn-notice-dismissed") === "1") return;
        } catch { /* storage can be unavailable in private browsing */ }
        setVisible(true);
      })
      .catch(() => undefined)
      .finally(() => window.clearTimeout(timer));

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  const close = () => {
    try { window.sessionStorage.setItem("3dm-iran-vpn-notice-dismissed", "1"); } catch { /* ignore */ }
    setVisible(false);
  };

  return (
    <div className="iran-vpn-notice" role="status">
      <div className="iran-vpn-notice__icon" aria-hidden="true">⚡</div>
      <div className="iran-vpn-notice__copy">
        <strong>برای تجربه‌ی بهتر سایت</strong>
        <span>اگر در ایران هستید، لطفاً VPN خود را روشن کنید تا سرعت و دسترسی بهتری داشته باشید.</span>
      </div>
      <button type="button" onClick={close} aria-label="بستن پیام">×</button>
    </div>
  );
}
