import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { PublicProduct } from "../types";

export default function ProductCard({
  product,
}: {
  product: PublicProduct;
}) {
  const primary =
    product.images.find((i) => i.isPrimary) ??
    product.images[0];

  const has3d = product.models.some(
    (m) => m.kind === "GLB" || m.kind === "GLTF"
  );

  const hasAr =
    product.models.some((m) => m.kind === "USDZ") ||
    has3d;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showImage =
    Boolean(primary?.url) && !imageError;

  return (
    <Link
      to={`/products/${product.slug}`}
      className="card"
      aria-label={`مشاهده ${product.name}`}
    >
      <div className="product-card__media">
        {showImage ? (
          <>
            {!imageLoaded && (
              <div
                className="skeleton"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: 0,
                }}
              />
            )}

            <img
              src={primary.url}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
              style={{
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity .2s ease",
              }}
            />
          </>
        ) : (
          <div
            className="product-image-fallback"
            role="img"
            aria-label={`تصویر ${product.name} در دسترس نیست`}
            style={{
              width: "100%",
              height: "100%",
              minHeight: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
              background:
                "linear-gradient(145deg, #f5f6fa, #eceef5)",
              color: "#8b93a7",
            }}
          >
            <span
              aria-hidden="true"
              style={{ fontSize: 32 }}
            >
              🖼️
            </span>

            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              تصویر موجود نیست
            </span>
          </div>
        )}

        {has3d && (
          <span className="badge">
            <span aria-hidden="true">🧊</span>{" "}
            سه‌بعدی{hasAr ? " / AR" : ""}
          </span>
        )}
      </div>

      <div className="product-card__body">
        <h3 title={product.name}>
          {product.name}
        </h3>

        {product.shortDescription && (
          <p className="muted">
            {product.shortDescription}
          </p>
        )}

        <div className="product-card__meta">
          {product.seller?.storeName && (
            <span
              className="chip"
              title={product.seller.storeName}
            >
              {product.seller.storeName}
            </span>
          )}

          {product.category?.name && (
            <span
              className="chip"
              title={product.category.name}
            >
              {product.category.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
