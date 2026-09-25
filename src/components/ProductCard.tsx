import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { PublicProduct } from "../types";

export default function ProductCard({ product }: { product: PublicProduct }) {
  const primary = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link to={`/products/${product.slug}`} className="card premium-product-card" aria-label={`مشاهده ${product.name}`}>
      <div className="product-card__media">
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
        <span className="product-card-view" aria-hidden="true">مشاهده</span>
      </div>
      <div className="product-card__body">
        <div className="product-card-store">{product.seller.storeName}</div>
        <div className="product-card-title-row">
          <h3 title={product.name}>{product.name}</h3>
          <div className="product-card-capabilities" aria-label="قابلیت‌های محصول">
            {product.models.some((model) => model.kind === "GLB" || model.kind === "GLTF") && <span>3D</span>}
            {product.models.some((model) => model.kind === "USDZ") && <span>AR</span>}
          </div>
        </div>
        {product.price != null ? (
          <div className="product-card-price" aria-label="قیمت محصول">
            <span>{new Intl.NumberFormat("fa-IR").format(product.price)} تومان</span>
          </div>
        ) : (
          <div className="product-card-contact-price" aria-label="قیمت محصول اعلام نشده است">
            <span>برای اطلاع از قیمت</span>
            <strong>با فروشنده تماس بگیرید</strong>
          </div>
        )}
        {product.shortDescription && <p className="muted">{product.shortDescription}</p>}
      </div>
    </Link>
  );
}
