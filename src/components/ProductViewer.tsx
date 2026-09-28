import React, { useEffect, useRef, useState } from "react";
import type { PublicProduct } from "../types";
import { track } from "../lib/analytics";

interface Props { product: PublicProduct; }
type ViewMode = "image" | "3d";
type ViewerStatus = "loading" | "ready" | "error";

function Icon({ name, size = 20 }: { name: "cube" | "ar" | "zoom" | "close" | "download" | "share" | "image" | "chevron-left" | "chevron-right"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "cube") return <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>;
  if (name === "ar") return <svg {...common}><path d="M8 4H5a1 1 0 0 0-1 1v3M16 4h3a1 1 0 0 1 1 1v3M8 20H5a1 1 0 0 1-1-1v-3M16 20h3a1 1 0 0 1-1-1v-3"/><path d="m9 9 3-2 3 2v4l-3 2-3-2V9Z"/><path d="m9 9 3 2 3-2M12 11v4"/></svg>;
  if (name === "zoom") return <svg {...common}><path d="m15 15 5 5"/><circle cx="10.5" cy="10.5" r="6.5"/><path d="M10.5 7.5v6M7.5 10.5h6"/></svg>;
  if (name === "close") return <svg {...common}><path d="m6 6 12 12M18 6 6 18"/></svg>;
  if (name === "download") return <svg {...common}><path d="M12 3v11M8 10l4 4 4-4M5 20h14"/></svg>;
  if (name === "share") return <svg {...common}><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>;
  if (name === "chevron-left") return <svg {...common}><path d="m14 6-6 6 6 6"/></svg>;
  if (name === "chevron-right") return <svg {...common}><path d="m10 6 6 6-6 6"/></svg>;
  return <svg {...common}><rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m5 17 4.5-4 3 2.5 2-2 4.5 4"/></svg>;
}

export default function ProductViewer({ product }: Props) {
  const glb = product.models.find((m) => m.kind === "GLB" || m.kind === "GLTF");
  const usdz = product.models.find((m) => m.kind === "USDZ");
  const images = product.images;
  const poster = images.find((i) => i.isPrimary)?.url ?? images[0]?.url;
  const initialIndex = Math.max(0, images.findIndex((i) => i.url === poster));
  const [activeImage, setActiveImage] = useState(poster);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [viewMode, setViewMode] = useState<ViewMode>("image");
  const [status, setStatus] = useState<ViewerStatus>("ready");
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arRequested, setArRequested] = useState(false);
  const modelReadyRef = useRef(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageRatio, setImageRatio] = useState(1.12);
  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveImage(poster); setActiveIndex(initialIndex); setViewMode("image"); setImageRatio(1.12); setStatus("ready"); setArSupported(null); setArRequested(false); setImageError(false); setLightboxOpen(false); modelReadyRef.current = false;
  }, [product.id, poster, initialIndex]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !glb || viewMode !== "3d") return;
    const onLoad = () => {
      modelReadyRef.current = true;
      setStatus("ready");
    };
    const onError = () => {
      modelReadyRef.current = false;
      setStatus("error");
      setArRequested(false);
    };
    const onArStatus = (event: Event) => {
      const detail = (event as CustomEvent).detail as { status?: string } | undefined;
      if (detail?.status === "session-started") {
        setArSupported(true);
        setArRequested(false);
        track("AR_LAUNCH", { productId: product.id, sellerId: product.seller.id });
      } else if (detail?.status === "failed") {
        setArSupported(false);
        setArRequested(false);
      }
    };
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    el.addEventListener("ar-status", onArStatus);
    const timer = window.setTimeout(() => {
      const canAr = (el as unknown as { canActivateAR?: boolean }).canActivateAR;
      if (typeof canAr === "boolean") setArSupported(canAr);
    }, 500);
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
      el.removeEventListener("ar-status", onArStatus);
      window.clearTimeout(timer);
    };
  }, [glb?.url, product.id, viewMode]);

  useEffect(() => {
    if (!arRequested || viewMode !== "3d" || !glb) return;
    const timer = window.setInterval(() => {
      const el = viewerRef.current as (HTMLElement & { canActivateAR?: boolean; activateAR?: () => Promise<void> }) | null;
      if (!el || !modelReadyRef.current) return;
      window.clearInterval(timer);
      if (el.canActivateAR === false) {
        setArSupported(false);
        setArRequested(false);
        return;
      }
      if (typeof el.activateAR === "function") {
        void el.activateAR().catch(() => {
          setArSupported(false);
          setArRequested(false);
        });
      } else {
        setArSupported(false);
        setArRequested(false);
      }
    }, 120);
    return () => window.clearInterval(timer);
  }, [arRequested, viewMode, glb?.url]);

  useEffect(() => { track(glb ? "VIEWER_3D_OPEN" : "PRODUCT_DETAIL_VIEW", { productId: product.id, sellerId: product.seller.id }); }, [product.id]);

  const dims = product.dimensions;
  const arScaleAttr = dims?.widthM && dims?.heightM && dims?.depthM ? "fixed" : "auto";
  const selectImage = (url: string, index = images.findIndex((item) => item.url === url)) => { setActiveImage(url); setActiveIndex(Math.max(0, index)); setImageError(false); setViewMode("image"); };
  const open3D = () => {
    if (!glb) return;
    setArRequested(false);
    setStatus("loading");
    setViewMode("3d");
  };

  const openAR = () => {
    if (!glb) return;
    setArSupported(null);
    setStatus("loading");
    setViewMode("3d");
    const el = viewerRef.current as (HTMLElement & { canActivateAR?: boolean; activateAR?: () => Promise<void> }) | null;
    if (el && modelReadyRef.current && typeof el.activateAR === "function") {
      if (el.canActivateAR === false) {
        setArSupported(false);
        return;
      }
      setArRequested(false);
      void el.activateAR().catch(() => setArSupported(false));
      return;
    }
    setArRequested(true);
    if (!modelReadyRef.current) setStatus("loading");
  };
  const previousImage = () => { if (!images.length) return; const next = (activeIndex - 1 + images.length) % images.length; selectImage(images[next].url, next); };
  const nextImage = () => { if (!images.length) return; const next = (activeIndex + 1) % images.length; selectImage(images[next].url, next); };
  const saveImage = async () => {
    const url = activeImage || poster; if (!url) return;
    try { const response = await fetch(url, { mode: "cors" }); const blob = await response.blob(); const objectUrl = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = objectUrl; link.download = `${product.slug || "product"}-image.${blob.type.includes("png") ? "png" : "webp"}`; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(objectUrl); } catch { window.open(url, "_blank", "noopener,noreferrer"); }
  };
  const shareImage = async () => {
    const url = activeImage || poster; if (!url) return;
    try { if (navigator.share) await navigator.share({ title: product.name, url }); else await navigator.clipboard.writeText(url); } catch { /* cancelled */ }
  };
  const onLightboxKey = (event: React.KeyboardEvent) => { if (event.key === "Escape") setLightboxOpen(false); if (event.key === "ArrowLeft") previousImage(); if (event.key === "ArrowRight") nextImage(); };

  return <div className="product-viewer-ref">
    <div className="product-viewer-ref__rail" aria-label="رسانه‌های محصول">
      {images.map((img, index) => <button key={`${img.url}-${index}`} type="button" className={`product-media-thumb ${viewMode === "image" && index === activeIndex ? "is-active" : ""}`} onClick={() => selectImage(img.url, index)} aria-label={`تصویر ${index + 1} محصول`}><img src={img.url} alt="" loading={index < 3 ? "eager" : "lazy"} onError={(e) => { e.currentTarget.style.opacity = "0.3"; }} /></button>)}
      {glb && <button type="button" className={`product-media-thumb product-media-thumb--tool ${viewMode === "3d" ? "is-active" : ""}`} onClick={open3D} aria-label="نمایش سه‌بعدی"><Icon name="cube" size={27} /><span>3D</span></button>}
      {glb && <button type="button" className="product-media-thumb product-media-thumb--tool product-media-thumb--ar" onClick={openAR} aria-label="نمایش واقعیت افزوده"><Icon name="ar" size={26} /><span>AR</span></button>}
    </div>
    <div className="product-viewer-ref__main" style={{ aspectRatio: `${imageRatio}` }}>
      {viewMode === "image" && activeImage && !imageError ? <button className="product-main-media" type="button" onClick={() => setLightboxOpen(true)} aria-label="بزرگ‌نمایی تصویر محصول"><img src={activeImage} alt={product.name} onLoad={(event) => { const image = event.currentTarget; if (image.naturalWidth && image.naturalHeight) setImageRatio(image.naturalWidth / image.naturalHeight); }} onError={() => setImageError(true)} /><span className="product-main-media__zoom"><Icon name="zoom" size={18} /></span></button> : null}
      {glb ? <div className={`product-main-3d${viewMode === "image" ? " product-main-3d--preloaded" : ""}`}>{status === "error" ? <div className="product-viewer-error"><strong>بارگذاری مدل سه‌بعدی ناموفق بود.</strong>{poster && <button type="button" className="viewer-action" onClick={() => { setViewMode("image"); setImageError(false); }}>نمایش تصاویر محصول</button>}</div> : <><model-viewer ref={viewerRef as React.RefObject<HTMLElement>} src={glb.url} crossorigin="anonymous" ios-src={usdz?.url} alt={product.name} camera-controls auto-rotate loading="eager" shadow-intensity="1" exposure="1" ar ar-modes="webxr scene-viewer quick-look" reveal="auto" ar-scale={arScaleAttr} touch-action="pan-y" className="product-model-viewer"></model-viewer>{status === "loading" && viewMode === "3d" && <div className="product-model-loading"><span className="product-spinner"/><strong>در حال بارگذاری مدل سه‌بعدی…</strong><small>لطفاً چند لحظه صبر کنید.</small></div>}</>}</div> : viewMode !== "image" ? <div className="product-viewer-error"><Icon name="image" size={38} /><strong>تصویر محصول در دسترس نیست.</strong></div> : null}
      <div className="product-viewer-controls">
        <div className="product-main-media__bottom">{glb && <button type="button" className={`product-mode-pill ${viewMode === "3d" ? "is-active" : ""}`} onClick={open3D}><Icon name="cube" size={19} />نمای سه‌بعدی</button>}{glb && <button type="button" className="product-ar-bottom" onClick={openAR} aria-label="AR"><Icon name="ar" size={16} />AR</button>}<div className="product-dots" aria-label="تصاویر محصول">{images.map((img, index) => <button key={`${img.url}-dot`} type="button" aria-label={`رفتن به تصویر ${index + 1}`} className={viewMode === "image" && index === activeIndex ? "is-active" : ""} onClick={() => selectImage(img.url, index)} />)}</div><button type="button" className="product-zoom-button" onClick={() => setLightboxOpen(true)} aria-label="نمایش بزرگ"><Icon name="zoom" size={19} /></button></div>
      </div>
    </div>
    {dims?.realWorldScale && (dims.widthM || dims.heightM || dims.depthM) && <span className="product-scale-badge">✓ مقیاس واقعی</span>}
    {arSupported === false && viewMode === "3d" && <span className="product-ar-note">AR روی این دستگاه پشتیبانی نمی‌شود.</span>}
    {lightboxOpen && activeImage && <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={`تصویر بزرگ ${product.name}`} onClick={() => setLightboxOpen(false)} onKeyDown={onLightboxKey} tabIndex={-1}><div className="product-lightbox__frame" onClick={(event) => event.stopPropagation()}><button className="product-lightbox__close" type="button" onClick={() => setLightboxOpen(false)} aria-label="بستن"><Icon name="close" size={22} /></button>{images.length > 1 && <><button className="product-lightbox__arrow product-lightbox__arrow--right" type="button" onClick={nextImage} aria-label="تصویر بعدی"><Icon name="chevron-right" size={28} /></button><button className="product-lightbox__arrow product-lightbox__arrow--left" type="button" onClick={previousImage} aria-label="تصویر قبلی"><Icon name="chevron-left" size={28} /></button></>}<img className="product-lightbox__image" src={activeImage} alt={product.name} /><div className="product-lightbox__actions"><button type="button" className="product-lightbox__action" onClick={saveImage}><Icon name="download" size={18} /> ذخیره تصویر</button><button type="button" className="product-lightbox__action" onClick={shareImage}><Icon name="share" size={18} /> اشتراک‌گذاری</button></div></div></div>}
  </div>;
}
