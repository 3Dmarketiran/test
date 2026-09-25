import React from "react";
import { Link } from "react-router-dom";
import type { PublicProduct } from "../types";

export default function StoreGridTile({ product }: { product: PublicProduct }) {
  const primary = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const is3d = product.models.some((model) => model.kind === "GLB" || model.kind === "GLTF");
  const isAr = product.models.some((model) => model.kind === "USDZ");

  return (
    <Link to={`/products/${product.slug}`} className="ig-tile" aria-label={product.name}>
      {(is3d || isAr) && <span className="ig-tile__tag">{is3d ? "3D" : "AR"}</span>}
      {primary?.url ? (
        <img src={primary.url} alt={product.name} loading="lazy" decoding="async" />
      ) : (
        <div className="ig-tile__fallback">□ بدون تصویر</div>
      )}
      <div className="ig-tile__overlay">
        <span>{product.name}</span>
      </div>
    </Link>
  );
}
