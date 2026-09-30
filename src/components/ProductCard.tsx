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
    <Link to={`/products/${product.slug}`} className="card premium-product-card screenshot-product-card" aria-label={`مشاهده ${product.name}`}>
      <div className="product-card__media">
        {primary?.url && !imageError ? (
          <>
            {!imageLoaded && <div className="skeleton" aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />}
            <img src={primary.url} alt={product.name} loading="lazy" decoding="async" onLoad={() => setImageLoaded(true)} onError={() => { setImageError(true); setImageLoaded(false); }} style={{ opacity: imageLoaded ? 1 : 0 }} />
          </>
        ) : (
          <div className="product-image-fallback" role="img" aria-label={`تصویر ${product.name} در دسترس نیست`}><span aria-hidden="true">□</span><span>تصویر در دسترس نیست</span></div>
        )}
        <div className="product-card-capabilities product-card-capabilities--overlay" aria-label="قابلیت‌های محصول">
          {has3d && <span>◈ 3D</span>}
          {hasAr && <span>⌁ AR</span>}
        </div>
      </div>
      <div className="product-card__body">
        <h3 title={product.name}>{product.name}</h3>
        <div className="product-card-store">{product.seller?.storeName || "فروشگاه"}</div>
        {product.price != null ? (
          <div className="product-card-price">{formatPrice(product.price)}</div>
        ) : (
          <div className="product-card-contact-price"><strong>قیمت</strong>برای استعلام با فروشنده تماس بگیرید</div>
        )}
        <div className="product-card-detail-link">مشاهده جزئیات <span aria-hidden="true">←</span></div>
      </div>
    </Link>
  );
}


function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value)} تومان`;
}
