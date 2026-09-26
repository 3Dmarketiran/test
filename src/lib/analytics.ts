// Best-effort, fire-and-forget analytics beacon to the private backend
// (spec section 23). Never blocks rendering and never throws — if the
// backend is offline the public site must keep working regardless
// (spec section 37). Collects no personal information: no IP, no
// identifiers, just an anonymous event type + optional product/seller id.

type EventType =
  | "PRODUCT_VIEW"
  | "PRODUCT_DETAIL_VIEW"
  | "VIEWER_3D_OPEN"
  | "AR_LAUNCH"
  | "SELLER_PAGE_VIEW"
  | "SEARCH";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

export function track(type: EventType, payload: { productId?: string; sellerId?: string; metadata?: Record<string, unknown> } = {}) {
  if (!API_URL) return; // analytics endpoint not configured for this deployment — silently skip
  try {
    const body = JSON.stringify({ type, ...payload });
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon(`${API_URL}/api/analytics/track`, blob);
    } else {
      fetch(`${API_URL}/api/analytics/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // never let analytics break the page
  }
}
