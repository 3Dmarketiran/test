import React from "react";
import { Link } from "react-router-dom";
import type { PublicProduct } from "../types";

export default function ProductCard({ product }: { product: PublicProduct }) {
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const has3d = product.models.some((m) => m.kind === "GLB" || m.kind === "GLTF");
  const hasAr = product.models.some((m) => m.kind === "USDZ") || has3d;

  return (
    <Link to={`/products/${product.slug}`} className="card">
      <div className="product-card__media">
        {primary ? (
          <img src={primary.url} alt={product.name} loading="lazy" />
        ) : (
          <div className="skeleton" style={{ width: "100%", height: "100%" }} />
        )}
        {has3d && (
          <span className="badge">
            <span aria-hidden>🧊</span> سه‌بعدی{hasAr ? " / AR" : ""}
          </span>
        )}
      </div>
      <div className="product-card__body">
        <h3>{product.name}</h3>
        {product.shortDescription && <p className="muted">{product.shortDescription}</p>}
        <div className="product-card__meta">
          <span className="chip">{product.seller.storeName}</span>
          {product.category && <span className="chip">{product.category.name}</span>}
        </div>
      </div>
    </Link>
  );
}
