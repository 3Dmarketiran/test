import React, { useEffect, useRef, useState } from "react";
import type { PublicProduct } from "../types";
import { track } from "../lib/analytics";

interface Props {
  product: PublicProduct;
}

type ViewMode = "image" | "3d";
type ViewerStatus = "loading" | "ready" | "error";

function Icon({ name, size = 20 }: { name: "cube" | "ar" | "zoom" | "close" | "download" | "image" | "layers" | "chevron"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "cube") return <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>;
  if (name === "ar") return <svg {...common}><path d="M8 4H5a1 1 0 0 0-1 1v3M16 4h3a1 1 0 0 1 1 1v3M8 20H5a1 1 0 0 1-1-1v-3M16 20h3a1 1 0 0 0 1-1v-3"/><path d="m9 9 3-2 3 2v4l-3 2-3-2V9Z"/><path d="m9 9 3 2 3-2M12 11v4"/></svg>;
  if (name === "zoom") return <svg {...common}><path d="m15 15 5 5"/><circle cx="10.5" cy="10.5" r="6.5"/><path d="M10.5 7.5v6M7.5 10.5h6"/></svg>;
  if (name === "close") return <svg {...common}><path d="m6 6 12 12M18 6 6 18"/></svg>;
  if (name === "download") return <svg {...common}><path d="M12 3v11M8 10l4 4 4-4M5 20h14"/></svg>;
  if (name === "layers") return <svg {...common}><path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4M4 16l8 4 8-4"/></svg>;
  if (name === "chevron") return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
  return <svg {...common}><rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m5 17 4.5-4 3 2.5 2-2 4.5 4"/></svg>;
}

export default function ProductViewer({ product }: Props) {
  const glb = product.models.find((m) => m.kind === "GLB" || m.kind === "GLTF");
  const usdz = product.models.find((m) => m.kind === "USDZ");
  const images = product.images;
  const poster = images.find((i) => i.isPrimary)?.url ?? images[0]?.url;

  const [activeImage, setActiveImage] = useState(poster);
  const [viewMode, setViewMode] = useState<ViewMode>("image");
  const [status, setStatus] = useState<ViewerStatus>(glb ? "ready" : "ready");
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveImage(poster);
    setViewMode("image");
    setStatus("ready");
    setArSupported(null);
    setImageError(false);
    setLightboxOpen(false);
  }, [product.id, poster]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !glb || viewMode !== "3d") return;
    const onLoad = () => setStatus("ready");
    const onError = () => setStatus("error");
    const onArStatus = (event: Event) => {
      const detail = (event as CustomEvent).detail as { status?: string } | undefined;
      if (detail?.status === "session-started") {
        setArSupported(true);
        track("AR_LAUNCH", { productId: product.id, sellerId: product.seller.id });
      } else if (detail?.status === "failed") setArSupported(false);
    };
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    el.addEventListener("ar-status", onArStatus);
    const timer = window.setTimeout(() => {
      const canAr = (el as unknown as { canActivateAR?: boolean }).canActivateAR;
      if (typeof canAr === "boolean") setArSupported(canAr);
    }, 800);
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
      el.removeEventListener("ar-status", onArStatus);
      window.clearTimeout(timer);
    };
  }, [glb?.url, product.id, viewMode]);

  useEffect(() => {
    track(glb ? "VIEWER_3D_OPEN" : "PRODUCT_DETAIL_VIEW", { productId: product.id, sellerId: product.seller.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const dims = product.dimensions;
  const arScaleAttr = dims?.widthM && dims?.heightM && dims?.depthM ? "fixed" : "auto";

  const selectImage = (url: string) => {
    setActiveImage(url);
    setImageError(false);
    setViewMode("image");
  };

  const open3D = () => {
    if (!glb) return;
    setStatus("loading");
    setViewMode("3d");
  };

  const saveImage = async () => {
    const url = activeImage || poster;
    if (!url) return;
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${product.slug || "product"}-image.${blob.type.includes("png") ? "png" : "webp"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="product-viewer-ref">
      <div className="product-viewer-ref__rail" aria-label="رسانه‌های محصول">
        {images.map((img, index) => (
          <button
            key={`${img.url}-${index}`}
            type="button"
            className={`product-media-thumb ${viewMode === "image" && img.url === activeImage ? "is-active" : ""}`}
            onClick={() => selectImage(img.url)}
            aria-label={`تصویر ${index + 1} محصول`}
          >
            <img src={img.url} alt="" loading={index < 3 ? "eager" : "lazy"} onError={(e) => { e.currentTarget.style.opacity = "0.3"; }} />
          </button>
        ))}
        {glb && (
          <button type="button" className={`product-media-thumb product-media-thumb--tool ${viewMode === "3d" ? "is-active" : ""}`} onClick={open3D} aria-label="نمایش سه‌بعدی">
            <Icon name="cube" size={27} />
            <span>3D</span>
          </button>
        )}
        {glb && (
          <button type="button" className="product-media-thumb product-media-thumb--tool" onClick={open3D} aria-label="نمایش واقعیت افزوده">
            <Icon name="ar" size={26} />
            <span>AR</span>
          </button>
        )}
      </div>

      <div className="product-viewer-ref__main">
        {viewMode === "image" && activeImage && !imageError ? (
          <button className="product-main-media" type="button" onClick={() => setLightboxOpen(true)} aria-label="بزرگ‌نمایی تصویر محصول">
            <img src={activeImage} alt={product.name} onError={() => setImageError(true)} />
            <span className="product-main-media__zoom"><Icon name="zoom" size={18} /></span>
          </button>
        ) : viewMode === "3d" && glb ? (
          <div className="product-main-3d">
            {status === "error" ? (
              <div className="product-viewer-error">
                <strong>بارگذاری مدل سه‌بعدی ناموفق بود.</strong>
                {poster && <button type="button" className="viewer-action" onClick={() => { setViewMode("image"); setImageError(false); }}>نمایش تصاویر محصول</button>}
              </div>
            ) : (
              <>
                <model-viewer
                  ref={viewerRef as React.RefObject<HTMLElement>}
                  src={glb.url}
                  crossorigin="anonymous"
                  ios-src={usdz?.url}
                  alt={product.name}
                  camera-controls
                  auto-rotate
                  reveal="auto"
                  loading="eager"
                  shadow-intensity="1"
                  exposure="1"
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  ar-scale={arScaleAttr}
                  touch-action="pan-y"
                  className="product-model-viewer"
                >
                  <button slot="ar-button" className="viewer-ar-button" type="button"><Icon name="ar" size={18} /> مشاهده در واقعیت افزوده</button>
                </model-viewer>
                {status === "loading" && <div className="product-model-loading"><span className="product-spinner"/><strong>در حال بارگذاری مدل سه‌بعدی…</strong><small>لطفاً چند لحظه صبر کنید.</small></div>}
              </>
            )}
          </div>
        ) : (
          <div className="product-viewer-error"><Icon name="image" size={38} /><strong>تصویر محصول در دسترس نیست.</strong></div>
        )}

        <div className="product-main-media__bottom">
          {glb && <button type="button" className={`product-mode-pill ${viewMode === "3d" ? "is-active" : ""}`} onClick={open3D}><Icon name="cube" size={19} />نمای سه‌بعدی</button>}
          <div className="product-dots" aria-label="تصاویر محصول">
            {images.map((img, index) => <button key={`${img.url}-dot`} type="button" aria-label={`رفتن به تصویر ${index + 1}`} className={viewMode === "image" && img.url === activeImage ? "is-active" : ""} onClick={() => selectImage(img.url)} />)}
          </div>
          <button type="button" className="product-zoom-button" onClick={() => setLightboxOpen(true)} aria-label="نمایش بزرگ"><Icon name="zoom" size={19} /></button>
        </div>
      </div>

      {dims?.realWorldScale && (dims.widthM || dims.heightM || dims.depthM) && <span className="product-scale-badge">✓ مقیاس واقعی</span>}

      {arSupported === false && viewMode === "3d" && <span className="product-ar-note">AR روی این دستگاه پشتیبانی نمی‌شود.</span>}

      {lightboxOpen && activeImage && (
        <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={`تصویر بزرگ ${product.name}`} onClick={() => setLightboxOpen(false)}>
          <div className="product-lightbox__frame" onClick={(event) => event.stopPropagation()}>
            <div className="product-lightbox__topbar"><strong>{product.name}</strong><button type="button" onClick={() => setLightboxOpen(false)} aria-label="بستن"><Icon name="close" size={22} /></button></div>
            <div className="product-lightbox__body"><img src={activeImage} alt={product.name} /></div>
            <div className="product-lightbox__bottom"><button type="button" className="viewer-action viewer-action--primary" onClick={saveImage}><Icon name="download" size={18} /> Save Image</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
