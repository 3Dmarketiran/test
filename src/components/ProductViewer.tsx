import React, { useEffect, useRef, useState } from "react";
import type { PublicProduct } from "../types";
import { track } from "../lib/analytics";

interface Props {
  product: PublicProduct;
}

type ViewerStatus = "loading" | "ready" | "error";

export default function ProductViewer({ product }: Props) {
  const glb = product.models.find(
    (m) => m.kind === "GLB" || m.kind === "GLTF"
  );

  const usdz = product.models.find((m) => m.kind === "USDZ");

  const poster =
    product.images.find((i) => i.isPrimary)?.url ??
    product.images[0]?.url;

  const [activeImage, setActiveImage] = useState(poster);
  const [status, setStatus] = useState<ViewerStatus>(
    glb ? "loading" : "ready"
  );
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [viewMode, setViewMode] = useState<"3d" | "image">(glb ? "3d" : "image");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveImage(poster);
    setStatus(glb ? "loading" : "ready");
    setArSupported(null);
    setFullscreen(false);
    setImageError(false);
    setViewMode(glb ? "3d" : "image");
    setLightboxOpen(false);
  }, [product.id, poster, glb?.url]);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el || !glb) return;

    const onLoad = () => {
      setStatus("ready");
    };

    const onError = () => {
      setStatus("error");
    };

    const onArStatus = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { status?: string }
        | undefined;

      if (detail?.status === "session-started") {
        setArSupported(true);

        track("AR_LAUNCH", {
          productId: product.id,
          sellerId: product.seller.id,
        });
      } else if (detail?.status === "not-presenting") {
        setArSupported((prev) => prev ?? true);
      } else if (detail?.status === "failed") {
        setArSupported(false);
      }
    };

    el.addEventListener("load", onLoad);
    el.addEventListener("error", onError);
    el.addEventListener("ar-status", onArStatus);

    const checkAr = () => {
      const canAr = (
        el as unknown as {
          canActivateAR?: boolean;
        }
      ).canActivateAR;

      if (typeof canAr === "boolean") {
        setArSupported(canAr);
      }
    };

    const arTimer = window.setTimeout(checkAr, 800);


    return () => {
      el.removeEventListener("load", onLoad);
      el.removeEventListener("error", onError);
      el.removeEventListener("ar-status", onArStatus);

      window.clearTimeout(arTimer);
    };
  }, [glb?.url, product.id]);

  useEffect(() => {
    if (glb) {
      track("VIEWER_3D_OPEN", {
        productId: product.id,
        sellerId: product.seller.id,
      });
    } else {
      track("PRODUCT_DETAIL_VIEW", {
        productId: product.id,
        sellerId: product.seller.id,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const dims = product.dimensions;

  const arScaleAttr =
    dims &&
    dims.widthM &&
    dims.heightM &&
    dims.depthM
      ? "fixed"
      : "auto";

  const toggleFullscreen = () => {
    setFullscreen(true);
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

  const handleImageError = () => {
    setImageError(true);
  };

  const selectImage = (url: string) => {
    setActiveImage(url);
    setImageError(false);
  };

  const showImage =
    Boolean(activeImage) && !imageError;

  return (
    <div
      className="viewer-shell"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {glb && viewMode === "3d" ? (
        <>
          {status !== "error" && (
            <model-viewer
              ref={
                viewerRef as React.RefObject<HTMLElement>
              }
              src={glb.url}
              crossorigin="anonymous"
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
              touch-action="pan-y"
              style={{
                display: "block",
                width: "100%",
                minHeight: "420px",
                background:
                  "var(--color-background)",
                touchAction: "pan-y",
              }}
            >
              <button
                slot="ar-button"
                className="viewer-ar-button"
                type="button"
              >
                مشاهده در AR
              </button>
            </model-viewer>
          )}

          {status === "loading" && (
            <div
              className="viewer-loading"
              aria-live="polite"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 14,
                padding: 24,
                textAlign: "center",
                background:
                  "color-mix(in srgb, var(--color-background) 92%, transparent)",
                backdropFilter: "blur(6px)",
              }}
            >
              <div
                aria-hidden
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "4px solid rgba(127,127,127,.22)",
                  borderTopColor:
                    "currentColor",
                  animation:
                    "productViewerSpin .8s linear infinite",
                }}
              />

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                در حال بارگذاری مدل سه‌بعدی…
              </div>

              <div
                style={{
                  fontSize: 12,
                  opacity: 0.65,
                  maxWidth: 260,
                }}
              >
                لطفاً چند لحظه صبر کنید تا مدل کامل
                بارگذاری شود.
              </div>
            </div>
          )}

          {status === "error" && (
            <div
              className="empty-state"
              style={{
                minHeight: 420,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                padding: 24,
              }}
            >
              <div
                className="icon"
                aria-hidden
                style={{ fontSize: 38 }}
              >
                ⚠️
              </div>

              <p>
                بارگذاری مدل سه‌بعدی ناموفق بود.
              </p>

              {poster && (
                <button
                  type="button"
                  className="viewer-action"
                  onClick={() => {
                    setViewMode("image");
                    setImageError(false);
                  }}
                >
                  نمایش تصویر محصول
                </button>
              )}
            </div>
          )}

          <div
            className="viewer-actions"
            aria-label="کنترل‌های نمایشگر"
          >
            {status !== "error" && (
              <button
                className="viewer-action"
                type="button"
                onClick={toggleFullscreen}
              >
                {fullscreen
                  ? "بستن نمایش بزرگ"
                  : "نمایش بزرگ"}
              </button>
            )}

            {poster && (
              <button
                className="viewer-action"
                type="button"
                onClick={() => {
                  setImageError(false);
                  setViewMode("image");
                }}
              >
                مشاهده تصاویر محصول
              </button>
            )}
          </div>

          <style>
            {`
              @keyframes productViewerSpin {
                from {
                  transform: rotate(0deg);
                }
                to {
                  transform: rotate(360deg);
                }
              }
            `}
          </style>
        </>
      ) : showImage ? (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1 / 1",
            overflow: "hidden",
            background:
              "var(--color-background)",
          }}
        >
          <button
            type="button"
            className="viewer-image-button"
            onClick={() => setLightboxOpen(true)}
            aria-label={`بزرگ‌نمایی تصویر ${product.name}`}
          >
            <img
              src={activeImage}
              alt={product.name}
              onError={handleImageError}
              loading="eager"
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <span>بزرگ‌نمایی تصویر</span>
          </button>
        </div>
      ) : (
        <div
          className="empty-state"
          style={{
            minHeight: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: 24,
          }}
        >
          <div
            className="icon"
            aria-hidden
            style={{ fontSize: 38 }}
          >
            🖼️
          </div>

          <p>
            تصویر محصول در حال حاضر قابل نمایش نیست.
          </p>
        </div>
      )}

      <div
        className="viewer-toolbar"
        aria-live="polite"
      >
        {glb && viewMode === "image" && (
          <button
            className="viewer-action"
            type="button"
            onClick={() => setViewMode("3d")}
          >
            مشاهده سه‌بعدی و AR
          </button>
        )}

        {dims?.realWorldScale &&
          (dims.widthM ||
            dims.heightM ||
            dims.depthM) && (
            <span
              className="scale-badge"
              title="اندازه واقعی محصول در واقعیت افزوده رعایت می‌شود"
            >
              ✅ مقیاس واقعی
            </span>
          )}

        {glb && arSupported === false && (
          <span
            className="ar-note"
            style={{
              padding: 0,
            }}
          >
            واقعیت افزوده روی این دستگاه
            پشتیبانی نمی‌شود.
          </span>
        )}
      </div>

      {product.images.length > 1 && (
        <div
          className="thumb-row"
          role="tablist"
          aria-label="تصاویر محصول"
        >
          {product.images.map((img) => (
            <button
              key={img.url}
              type="button"
              role="tab"
              aria-selected={
                img.url === activeImage
              }
              onClick={() => {
                selectImage(img.url);
                setViewMode("image");
              }}
              style={{
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <img
                src={img.url}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className={
                  img.url === activeImage
                    ? "active"
                    : ""
                }
                onError={(event) => {
                  event.currentTarget.style.opacity =
                    "0.35";
                }}
              />
            </button>
          ))}
        </div>
      )}
      {fullscreen && (
        <div className="viewer-modal" role="dialog" aria-modal="true" aria-label={`نمایش بزرگ ${product.name}`}>
          <div className="viewer-modal__frame">
            <div className="viewer-modal__topbar">
              <span>{product.name}</span>
              <button type="button" className="viewer-modal__close" onClick={() => setFullscreen(false)} aria-label="بستن">×</button>
            </div>
            <div className="viewer-modal__body">
              <div className="viewer-modal__stage">
                {viewMode === "3d" && glb ? (
                  <model-viewer
                    className="viewer-modal__model"
                    src={glb.url}
                    crossorigin="anonymous"
                    ios-src={usdz?.url}
                    alt={product.name}
                    camera-controls
                    auto-rotate
                    reveal="auto"
                    loading="eager"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                  />
                ) : activeImage ? (
                  <img src={activeImage} alt={product.name} />
                ) : null}
              </div>
            </div>
            <div className="viewer-modal__bottombar">
              <button type="button" className="viewer-action" onClick={saveImage}>Save Image</button>
              {glb && <button type="button" className="viewer-action" onClick={() => setViewMode(viewMode === "3d" ? "image" : "3d")}>{viewMode === "3d" ? "نمایش تصویر" : "نمایش سه‌بعدی"}</button>}
            </div>
          </div>
        </div>
      )}

      {lightboxOpen && activeImage && (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={`تصویر بزرگ ${product.name}`} onClick={() => setLightboxOpen(false)}>
          <div className="viewer-modal__frame" onClick={(event) => event.stopPropagation()}>
            <div className="viewer-modal__topbar">
              <span>{product.name}</span>
              <button type="button" className="viewer-modal__close" aria-label="بستن تصویر" onClick={() => setLightboxOpen(false)}>×</button>
            </div>
            <div className="viewer-modal__body">
              <div className="viewer-modal__stage">
                <img src={activeImage} alt={product.name} />
              </div>
            </div>
            <div className="viewer-modal__bottombar">
              <button type="button" className="viewer-action" onClick={saveImage}>Save Image</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
