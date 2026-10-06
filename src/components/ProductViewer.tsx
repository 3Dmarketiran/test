import React, { useEffect, useRef, useState } from "react";
import type { PublicProduct } from "../types";
import { track } from "../lib/analytics";

interface Props { product: PublicProduct; }
type ViewMode = "image" | "3d";
type ViewerStatus = "loading" | "ready" | "error";
type ARPreparation = "idle" | "preparing" | "prepared" | "failed";

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
  const [status, setStatus] = useState<ViewerStatus>(glb ? "ready" : "ready");
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [isIOSBrowser] = useState(() => typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent));
  const [arReady, setArReady] = useState(false);
  const [arPreparation, setArPreparation] = useState<ARPreparation>("idle");
  const [arMessage, setArMessage] = useState("");
  const arWaitRef = useRef<number | null>(null);
  const modelReadyRef = useRef(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 4, height: 3 });
  const arSessionStartedRef = useRef(false);
  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveImage(poster); setActiveIndex(initialIndex); setViewMode("image"); setStatus("ready"); setArSupported(null); setArReady(false); setArPreparation("idle"); setArMessage(""); if (arWaitRef.current) window.clearTimeout(arWaitRef.current); setImageError(false); setImageNaturalSize({ width: 4, height: 3 }); setLightboxOpen(false); modelReadyRef.current = false;
  }, [product.id, poster, initialIndex]);

  // Do not prefetch additional product photos: only the visible image and
  // near-viewport thumbnails should transfer bytes. This is intentionally
  // conservative for mobile data plans and egress-sensitive deployments.

  useEffect(() => {
    const el = viewerRef.current as (HTMLElement & { loaded?: boolean; updateComplete?: Promise<unknown> }) | null;
    if (!el || !glb) return;
    const syncLoaded = () => {
      const loaded = Boolean(el.loaded);
      modelReadyRef.current = loaded;
      if (loaded) {
        setStatus("ready");
        const canAr = (el as unknown as { canActivateAR?: boolean }).canActivateAR;
        if (canAr === true) setArSupported(true);
        setArReady(true);
      }
    };
    syncLoaded();
    const onLoad = () => {
      modelReadyRef.current = true;
      setStatus("ready");
      const canAr = (el as unknown as { canActivateAR?: boolean }).canActivateAR;
      if (canAr === true) setArSupported(true);
      setArReady(true);
    };
    const onError = () => {
      modelReadyRef.current = false;
      setStatus("error");
      setArReady(false);
    };
    const onArStatus = (event: Event) => {
      const detail = (event as CustomEvent).detail as { status?: string } | undefined;
      if (detail?.status === "session-started") {
        arSessionStartedRef.current = true;
        setArSupported(true);
        setArReady(true);
        track("AR_LAUNCH", { productId: product.id, sellerId: product.seller.id });
      } else if (detail?.status === "not-presenting") {
        // Do not remount model-viewer here. Remounting during the AR lifecycle
        // can leave the next click without a valid user-gesture target.
        arSessionStartedRef.current = false;
        const canAr = (el as unknown as { canActivateAR?: boolean }).canActivateAR;
        if (canAr === true) setArSupported(true);
        if (modelReadyRef.current) setArReady(true);
      } else if (detail?.status === "failed") {
        // A failed launch must not permanently disable the AR control.
        const canAr = (el as unknown as { canActivateAR?: boolean }).canActivateAR;
        if (canAr === true) setArSupported(true);
        if (modelReadyRef.current) setArReady(true);
      }
    };
    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    el.addEventListener("ar-status", onArStatus);
    const timer = window.setTimeout(() => {
      syncLoaded();
      const canAr = (el as unknown as { canActivateAR?: boolean }).canActivateAR;
      if (canAr === true) setArSupported(true);
      if (modelReadyRef.current) setArReady(true);
    }, 500);
    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
      el.removeEventListener("ar-status", onArStatus);
      window.clearTimeout(timer);
    };
  }, [glb?.url, product.id]);

  useEffect(() => { track(glb ? "VIEWER_3D_OPEN" : "PRODUCT_DETAIL_VIEW", { productId: product.id, sellerId: product.seller.id }); }, [product.id]);

  const dims = product.dimensions;
  const arScaleAttr = dims?.widthM && dims?.heightM && dims?.depthM ? "fixed" : "auto";
  const selectImage = (url: string, index = images.findIndex((item) => item.url === url)) => { setActiveImage(url); setActiveIndex(Math.max(0, index)); setImageError(false); setImageNaturalSize({ width: 4, height: 3 }); setViewMode("image"); };
  const open3D = () => {
    if (!glb) return;
    setViewMode("3d");
    const el = viewerRef.current as (HTMLElement & { loaded?: boolean }) | null;
    if (modelReadyRef.current || Boolean(el?.loaded)) {
      modelReadyRef.current = true;
      setStatus("ready");
      const canAr = (el as unknown as { canActivateAR?: boolean }).canActivateAR;
      if (canAr === true) setArSupported(true);
      setArReady(true);
    } else {
      setStatus("ready");
    }
  };



  // Preparation is deliberately separate from launch: browsers may revoke the
  // transient user gesture after an async wait. A second explicit tap launches AR.
  const prepareAR = () => {
    if (!glb) return;
    setViewMode("3d");
    setArPreparation("preparing");
    setArMessage("در حال آماده‌سازی مدل برای واقعیت افزوده؛ لطفاً صفحه را باز نگه دارید…");
    const el = viewerRef.current as (HTMLElement & { loaded?: boolean; activateAR?: () => Promise<void> | void }) | null;
    if (!el) {
      setArPreparation("failed");
      setArMessage("نمایشگر سه‌بعدی در دسترس نیست. دوباره تلاش کنید.");
      return;
    }
    if (Boolean(el.loaded) || modelReadyRef.current) {
      modelReadyRef.current = true;
      setArReady(true);
      setArPreparation("prepared");
      setArMessage("مدل آماده است. برای ورود به AR دوباره روی دکمه بزنید.");
      return;
    }
    const onLoad = () => {
      cleanup();
      modelReadyRef.current = true;
      setArReady(true);
      setArPreparation("prepared");
      setArMessage("مدل آماده است. برای ورود به AR دوباره روی دکمه بزنید.");
    };
    const onError = () => {
      cleanup();
      setArPreparation("failed");
      setArMessage("دریافت یا آماده‌سازی مدل ناموفق بود. اتصال اینترنت را بررسی و دوباره تلاش کنید.");
    };
    const cleanup = () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
      if (arWaitRef.current) window.clearTimeout(arWaitRef.current);
      arWaitRef.current = null;
    };
    el.addEventListener("load", onLoad, { once: true });
    el.addEventListener("error", onError, { once: true });
    arWaitRef.current = window.setTimeout(() => {
      cleanup();
      if (Boolean(el.loaded)) onLoad();
      else {
        setArPreparation("failed");
        setArMessage("آماده‌سازی بیش از ۲۵ ثانیه طول کشید. اینترنت یا دسترسی به فایل مدل را بررسی کنید.");
      }
    }, 25000);
  };

  const openAR = () => {
    const el = viewerRef.current as (HTMLElement & { activateAR?: () => Promise<void> | void }) | null;
    if (!el || !modelReadyRef.current || arPreparation !== "prepared") return;
    try {
      const result = el.activateAR?.();
      if (result && typeof (result as Promise<void>).catch === "function") {
        void (result as Promise<void>).catch(() => {
          setArMessage("اجرای AR انجام نشد. سازگاری مرورگر و مجوزهای دستگاه را بررسی کنید و دوباره بزنید.");
          setArPreparation("prepared");
        });
      }
    } catch {
      setArMessage("اجرای AR انجام نشد. دوباره تلاش کنید یا مدل سه‌بعدی را مشاهده کنید.");
    }
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
      {images.map((img, index) => <button key={`${img.url}-${index}`} type="button" className={`product-media-thumb ${viewMode === "image" && index === activeIndex ? "is-active" : ""}`} onClick={() => selectImage(img.url, index)} aria-label={`تصویر ${index + 1} محصول`}><img src={img.url} alt="" loading={index === 0 ? "eager" : "lazy"} decoding="async" width={76} height={76} onError={(e) => { e.currentTarget.style.opacity = "0.3"; }} /></button>)}
      {glb && <button type="button" className={`product-media-thumb product-media-thumb--tool ${viewMode === "3d" ? "is-active" : ""}`} onClick={open3D} aria-label="نمایش سه‌بعدی"><Icon name="cube" size={27} /><span>3D</span></button>}
      
    </div>
    {(usdz?.url || glb) && <div className="product-platform-choice" role="group" aria-label="انتخاب روش مشاهده محصول" style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
      {usdz?.url && <a className="btn btn-outline" href={usdz.url} rel="ar" aria-label="باز کردن مدل در واقعیت افزوده iOS" style={{display:"inline-flex",alignItems:"center",gap:8}}><img src={poster || "/favicon.ico"} alt="" width="22" height="22" style={{objectFit:"cover",borderRadius:5}} /> iOS · مشاهده در AR</a>}
      {glb && <button type="button" className={`btn ${viewMode === "3d" ? "btn-primary" : "btn-outline"}`} onClick={open3D} aria-label="بارگذاری مدل سه‌بعدی GLB برای Android" style={{display:"inline-flex",alignItems:"center",gap:8}}><Icon name="cube" size={18}/> Android · نمایش 3D</button>}
    </div>}
    <div className={`product-viewer-ref__main ${viewMode === "image" ? "is-image-mode" : "is-3d-mode"}`} style={{ "--product-image-ratio": `${imageNaturalSize.width} / ${imageNaturalSize.height}` } as React.CSSProperties}>
      {viewMode === "image" && activeImage && !imageError ? <button className="product-main-media" type="button" onClick={() => setLightboxOpen(true)} aria-label="بزرگ‌نمایی تصویر محصول"><img src={activeImage} alt={product.name} loading="eager" decoding="async" fetchPriority="high" onLoad={(event) => { const image = event.currentTarget; if (image.naturalWidth > 0 && image.naturalHeight > 0) setImageNaturalSize({ width: image.naturalWidth, height: image.naturalHeight }); }} onError={() => setImageError(true)} /><span className="product-main-media__zoom"><Icon name="zoom" size={18} /></span></button> : null}
      {viewMode === "image" && imageError ? <div className="product-viewer-error"><Icon name="image" size={38} /><strong>تصویر انتخاب‌شده بارگذاری نشد.</strong><button type="button" className="viewer-action" onClick={() => { setImageError(false); if (images.length > 1) nextImage(); }}>تصویر بعدی</button></div> : null}
      {glb ? <div className={`product-main-3d ${viewMode === "3d" ? "is-visible" : "is-preloaded"}`}>
        <model-viewer ref={viewerRef as React.RefObject<HTMLElement>} src={viewMode === "3d" ? glb.url : undefined} crossorigin="anonymous" ios-src={viewMode === "3d" ? usdz?.url : undefined} alt={product.name} poster={poster} camera-controls auto-rotate loading="lazy" shadow-intensity="1" exposure="1" ar ar-modes="scene-viewer webxr quick-look" reveal="auto" interaction-prompt="none" ar-scale={arScaleAttr} scale="1 1 1" touch-action="pan-y" className="product-model-viewer" onLoad={() => { modelReadyRef.current = true; setStatus("ready"); setArReady(true); }} onError={() => { modelReadyRef.current = false; setStatus("error"); setArReady(false); }}>
          
        </model-viewer>
        {viewMode === "3d" && arPreparation !== "prepared" ? (
          <button type="button" className="viewer-ar-button viewer-ar-button--direct" onClick={prepareAR} disabled={arPreparation === "preparing"} aria-live="polite">
            <Icon name="ar" size={15} />{arPreparation === "preparing" ? "در حال آماده‌سازی…" : arPreparation === "failed" ? "تلاش دوباره برای AR" : "آماده‌سازی AR"}
          </button>
        ) : null}
        {viewMode === "3d" && arPreparation === "prepared" ? (isIOSBrowser && usdz?.url ?
          <a className="viewer-ar-button viewer-ar-button--direct viewer-ar-button--quicklook" rel="ar" href={usdz.url} aria-label="باز کردن واقعیت افزوده در iPhone"><img src={poster || "/favicon.ico"} alt="" /><Icon name="ar" size={15} />ورود به AR</a> :
          <button type="button" className="viewer-ar-button viewer-ar-button--direct" onClick={openAR} aria-label="ورود به واقعیت افزوده"><Icon name="ar" size={15} />ورود به AR</button>
        ) : null}
        {viewMode === "3d" && arMessage ? <div className="ar-preparation-status" role="status" aria-live="polite">{arMessage}{arPreparation === "failed" && <button type="button" onClick={prepareAR}>تلاش مجدد</button>}</div> : null}
        {viewMode === "3d" && status === "error" && <div className="product-viewer-error"><strong>بارگذاری مدل سه‌بعدی ناموفق بود.</strong>{poster && <button type="button" className="viewer-action" onClick={() => { setViewMode("image"); setImageError(false); }}>نمایش تصاویر محصول</button>}</div>}
      </div> : viewMode !== "image" ? <div className="product-viewer-error"><Icon name="image" size={38} /><strong>تصویر محصول در دسترس نیست.</strong></div> : null}
      <div className="product-viewer-controls">
        <div className="product-main-media__bottom">{glb && <button type="button" className={`product-mode-pill ${viewMode === "3d" ? "is-active" : ""}`} onClick={open3D}><Icon name="cube" size={19} />نمای سه‌بعدی</button>}<div className="product-dots" aria-label="تصاویر محصول">{images.map((img, index) => <button key={`${img.url}-dot`} type="button" aria-label={`رفتن به تصویر ${index + 1}`} className={viewMode === "image" && index === activeIndex ? "is-active" : ""} onClick={() => selectImage(img.url, index)} />)}</div></div>
      </div>
    </div>
    {dims?.realWorldScale && (dims.widthM || dims.heightM || dims.depthM) && <span className="product-scale-badge">✓ مقیاس واقعی</span>}
    
    {lightboxOpen && activeImage && <div className="product-lightbox" role="dialog" aria-modal="true" aria-label={`تصویر بزرگ ${product.name}`} onClick={() => setLightboxOpen(false)} onKeyDown={onLightboxKey} tabIndex={-1}><div className="product-lightbox__frame" onClick={(event) => event.stopPropagation()}><button className="product-lightbox__close" type="button" onClick={() => setLightboxOpen(false)} aria-label="بستن"><Icon name="close" size={22} /></button>{images.length > 1 && <><button className="product-lightbox__arrow product-lightbox__arrow--right" type="button" onClick={nextImage} aria-label="تصویر بعدی"><Icon name="chevron-right" size={28} /></button><button className="product-lightbox__arrow product-lightbox__arrow--left" type="button" onClick={previousImage} aria-label="تصویر قبلی"><Icon name="chevron-left" size={28} /></button></>}<img className="product-lightbox__image" src={activeImage} alt={product.name} /><div className="product-lightbox__actions"><button type="button" className="product-lightbox__action" onClick={saveImage}><Icon name="download" size={18} /> ذخیره تصویر</button><button type="button" className="product-lightbox__action" onClick={shareImage}><Icon name="share" size={18} /> اشتراک‌گذاری</button></div></div></div>}
  </div>;
}
