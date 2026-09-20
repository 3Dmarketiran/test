import React, { useEffect, useRef, useState } from "react";
import type { PublicProduct } from "../types";
import { track } from "../lib/analytics";

interface Props {
  product: PublicProduct;
}

/**
 * Premium 3D/AR viewer built on <model-viewer> (spec section 12/13/14):
 * - Real-world scale: dimensions come from the backend already normalized
 *   to meters, and are passed to ar-scale="fixed" so the AR session opens
 *   the object at true physical size rather than an arbitrary fit-to-view
 *   scale. No manual scale slider is exposed to customers.
 * - Loading / error states, poster image, fullscreen, mobile optimization.
 * - "View in AR" only renders when the device/browser can actually launch
 *   an AR session (model-viewer's own ar-status reporting), with a clear
 *   "AR is not supported on this device" fallback otherwise.
 */
export default function ProductViewer({ product }: Props) {
  const glb = product.models.find((m) => m.kind === "GLB" || m.kind === "GLTF");
  const usdz = product.models.find((m) => m.kind === "USDZ");
  const poster = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url;

  const [activeImage, setActiveImage] = useState(poster);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(glb ? "loading" : "ready");
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const viewerRef = useRef<HTMLElement | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setActiveImage(poster);
    setStatus(glb ? "loading" : "ready");
    setArSupported(null);
    setFullscreen(false);
  }, [product.id, poster, glb?.url]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);

    const onLoad = () => setStatus("ready");
    const onError = () => setStatus("error");
    const onArStatus = (e: Event) => {
      const detail = (e as CustomEvent).detail as { status?: string } | undefined;
      if (detail?.status === "session-started") {
        setArSupported(true);
        track("AR_LAUNCH", { productId: product.id });
      } else if (detail?.status === "not-presenting") {
        setArSupported((prev) => prev ?? true);
      } else if (detail?.status === "failed") {
        setArSupported(false);
      }
    };

    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    el.addEventListener("ar-status", onArStatus);

    // model-viewer exposes canActivateAR once it has finished feature-detecting.
    const checkAr = () => {
      const canAr = (el as unknown as { canActivateAR?: boolean }).canActivateAR;
      if (typeof canAr === "boolean") setArSupported(canAr);
    };
    const t = setTimeout(checkAr, 800);

    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
      el.removeEventListener("ar-status", onArStatus);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      clearTimeout(t);
    };
  }, [glb?.url]);

  useEffect(() => {
    if (glb) track("VIEWER_3D_OPEN", { productId: product.id, sellerId: undefined });
    else track("PRODUCT_DETAIL_VIEW", { productId: product.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const dims = product.dimensions;
  const arScaleAttr = dims && dims.widthM && dims.heightM && dims.depthM ? "fixed" : "auto";

  const toggleFullscreen = async () => {
    const target = viewerRef.current?.parentElement;
    if (!target) return;
    try {
      if (!document.fullscreenElement) {
        await target.requestFullscreen();
        setFullscreen(true);
      } else {
        await document.exitFullscreen();
        setFullscreen(false);
      }
    } catch {
      setFullscreen(Boolean(document.fullscreenElement));
    }
  };

  return (
    <div className="viewer-shell">
      {glb ? (
        <>
          {status === "error" && (
            <div className="empty-state">
              <div className="icon" aria-hidden>⚠️</div>
              <p>بارگذاری مدل سه‌بعدی ناموفق بود. لطفاً بعداً دوباره تلاش کنید.</p>
            </div>
          )}
          <model-viewer
            ref={viewerRef as React.RefObject<HTMLElement>}
            src="https://github.com/3Dmarketiran/test/releases/download/3d-assets-product-cmua3nahv000nkhvtyo85k74t/glb-cc7da9130b1d7e633a3387d6f72dda4d.glb"
            ios-src={usdz?.url}
            alt={product.name}
            poster={poster}
            camera-controls
            auto-rotate
            reveal="auto"
            loading="eager"
            shadow-intensity="1"
            exposure="1"
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale={arScaleAttr}
            style={{ display: status === "error" ? "none" : "block", background: "var(--color-background)" }}
          >
            <button slot="ar-button" className="viewer-ar-button" type="button">مشاهده در AR</button>
          </model-viewer>
          <div className="viewer-actions" aria-label="کنترل‌های نمایشگر">
            <button className="viewer-action" type="button" onClick={toggleFullscreen}>
              {fullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
            </button>
          </div>
          {status === "loading" && <div className="viewer-loading" aria-live="polite">در حال بارگذاری مدل سه‌بعدی…</div>}
          {/* model-viewer closes above; this placeholder keeps the controls outside the web component. */}
        </>
      ) : activeImage ? (
        <img src={activeImage} alt={product.name} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />
      ) : (
        <div className="empty-state">
          <div className="icon" aria-hidden>🖼️</div>
          <p>تصویری برای این محصول ثبت نشده است.</p>
        </div>
      )}

      <div className="viewer-toolbar">
        {dims?.realWorldScale && (dims.widthM || dims.heightM || dims.depthM) && (
          <span className="scale-badge" title="اندازه واقعی محصول در واقعیت افزوده رعایت می‌شود">
            ✅ مقیاس واقعی
          </span>
        )}
        {glb && arSupported === false && (
          <span className="ar-note" style={{ padding: 0 }}>واقعیت افزوده روی این دستگاه پشتیبانی نمی‌شود.</span>
        )}
      </div>

      {product.images.length > 1 && (
        <div className="thumb-row" role="tablist" aria-label="تصاویر محصول">
          {product.images.map((img) => (
            <img
              key={img.url}
              src={img.url}
              alt={product.name}
              className={img.url === activeImage ? "active" : ""}
              onClick={() => setActiveImage(img.url)}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
}
