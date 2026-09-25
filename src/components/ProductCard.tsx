import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { PublicProduct } from "../types";

export default function ProductCard({ product }: { product: PublicProduct }) {
  const primary = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const has3d = product.models.some((model) => model.kind === "GLB" || model.kind === "GLTF");
  const hasAr = product.models.some((model) => model.kind === "USDZ");

  return (
    <Link to={`/products/${product.slug}`} className="card premium-product-card" aria-label={`مشاهده ${product.name}`}>
      <div className="product-card__media">
        {(has3d || hasAr) && (
          <span className={`product-card-tag ${hasAr ? "product-card-tag--ar" : "product-card-tag--3d"}`} aria-hidden="true">
            {hasAr ? "AR" : "3D"}
          </span>
        )}
        <button
          type="button"
          className="product-card-fav"
          aria-label="افزودن به علاقه‌مندی‌ها"
          onClick={(event) => event.preventDefault()}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 20.5s-7.6-4.6-10-9.2C.4 8 2.1 4.6 5.6 4c2-.3 3.9.6 5 2.2C11.7 4.6 13.6 3.7 15.6 4c3.5.6 5.2 4 3.6 7.3-2.4 4.6-10 9.2-10 9.2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {primary?.url && !imageError ? (
          <>
            {!imageLoaded && <div className="skeleton" aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />}
            <img
              src={primary.url}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => { setImageError(true); setImageLoaded(false); }}
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
          </>
        ) : (
          <div className="product-image-fallback" role="img" aria-label={`تصویر ${product.name} در دسترس نیست`}>
            <span aria-hidden="true">□</span>
            <span>تصویر در دسترس نیست</span>
          </div>
        )}
      </div>
      <div className="product-card__body">
        <div className="product-card-title-row">
          <div style={{ minWidth: 0 }}>
            <h3 title={product.name}>{product.name}</h3>
            <div className="product-card-store">{product.seller.storeName}</div>
          </div>
        </div>
        {product.price != null ? (
          <div className="product-card-price" aria-label="قیمت محصول">
            <span>{new Intl.NumberFormat("fa-IR").format(product.price)} تومان</span>
          </div>
        ) : (
          <div className="product-card-contact-price" aria-label="قیمت محصول اعلام نشده است">
            <strong>برای قیمت تماس بگیرید</strong>
          </div>
        )}
        {product.shortDescription && <p className="muted">{product.shortDescription}</p>}
        <span className="product-card-contact-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7.5 3.5 5 4.8c-.8.4-1.1 1.3-.8 2.2 1.8 5.7 6.3 10.2 12 12 .9.3 1.8 0 2.2-.8l1.3-2.5-3.4-2.1-1.7 1.7c-2.2-.9-4.4-3.1-5.3-5.3L11 8.3 8.9 4.9 7.5 3.5Z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          تماس با فروشنده
        </span>
      </div>
    </Link>
  );
}
