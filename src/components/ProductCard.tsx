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
        <div className="product-card__title-row">
          <div className="product-card__title-copy">
            <h3 title={product.name}>{product.name}</h3>
            {product.shortDescription && <p className="muted">{product.shortDescription}</p>}
          </div>
          <div className="product-card__price">
            {product.price != null ? `${new Intl.NumberFormat("fa-IR").format(product.price)} تومان` : "تماس برای قیمت"}
          </div>
        </div>
        <div className="product-card__action-row">
          <span className="product-card__action">افزودن به سبد</span>
          <span className="product-card__detail">مشاهده محصول</span>
        </div>
      </div>
    </Link>
  );
}
