import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSellerLogoUrl, sellerInitials, useData } from "../lib/data";
import ProductViewer from "../components/ProductViewer";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, sellers, loading } = useData();
  const [detailTab, setDetailTab] = useState<"description" | "technical">("description");

  const product = products.find(
    (p) => p.slug === slug
  );

  useSeo({
    title: product
      ? `${product.name} | ${product.seller.storeName}`
      : "محصول",
    description:
      product?.shortDescription ??
      product?.fullDescription ??
      undefined,
    image: product?.images[0]?.url,
    canonicalPath: `/products/${slug}`,
  });

  if (loading) {
    return (
      <main className="container section">
        <div className="product-detail" aria-busy="true" aria-label="در حال بارگذاری محصول">
          <div className="skeleton" style={{ width: "100%", aspectRatio: "1 / 1", minHeight: 320, borderRadius: "var(--radius-lg)" }} />
          <div style={{ minWidth: 0, paddingTop: 8 }}>
            <div className="skeleton" style={{ height: 38, width: "72%", marginBottom: 14 }} />
            <div className="skeleton" style={{ height: 16, width: "35%", marginBottom: 24 }} />
            <div className="skeleton" style={{ height: 15, width: "100%", marginBottom: 9 }} />
            <div className="skeleton" style={{ height: 15, width: "92%", marginBottom: 9 }} />
            <div className="skeleton" style={{ height: 15, width: "78%" }} />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container section">
        <div className="empty-state">
          <div className="icon" aria-hidden="true" style={{ fontSize: 40 }}>❓</div>
          <p>این محصول یافت نشد یا دیگر در دسترس نیست.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 12 }}>بازگشت به محصولات</Link>
        </div>
      </main>
    );
  }

  const seller = sellers.find((item) => item.slug === product.seller.slug);
  const related = products
    .filter((p) => p.id !== product.id && p.seller.slug === product.seller.slug)
    .slice(0, 4);
  const dims = product.dimensions;
  const hasDimensions = Boolean(dims?.widthM || dims?.heightM || dims?.depthM);
  const subtitle = product.shortDescription && product.shortDescription !== product.fullDescription
    ? product.shortDescription
    : `محصولی از ${product.seller.storeName}`;
  return (
    <main className="container section product-page-ref">
      <div className="product-detail-ref-grid">
        <section className="product-detail-main-col">
          <ProductViewer product={product} />

          <section className="product-description-ref" aria-labelledby="product-description-title">
            <div className="product-tabs-ref" role="tablist" aria-label="اطلاعات محصول">
              <button type="button" className={detailTab === "description" ? "is-active" : ""} role="tab" aria-selected={detailTab === "description"} onClick={() => setDetailTab("description")}>توضیحات</button>
              <button type="button" className={detailTab === "technical" ? "is-active" : ""} role="tab" aria-selected={detailTab === "technical"} onClick={() => setDetailTab("technical")}>مشخصات فنی</button>
            </div>
            {detailTab === "description" ? (
              <div className="product-description-copy">
                <h2 id="product-description-title">توضیحات محصول</h2>
                <p>{product.fullDescription || product.shortDescription || "توضیحات این محصول توسط فروشنده ثبت نشده است."}</p>
              </div>
            ) : (
              <div className="product-technical-grid" role="tabpanel">
                <div><span>ابعاد</span><strong>{hasDimensions ? [dims?.widthM && `عرض: ${formatMeters(dims.widthM)}`, dims?.heightM && `ارتفاع: ${formatMeters(dims.heightM)}`, dims?.depthM && `عمق: ${formatMeters(dims.depthM)}`].filter(Boolean).join("  |  ") : "ثبت نشده"}</strong></div>
                <div><span>جنس متریال</span><strong>{product.material || "ثبت نشده"}</strong></div>
                {product.colors && product.colors.length > 0 && <div><span>رنگ</span><strong className="product-technical-colors">{product.colors.map((color, index) => <span key={`${color.name}-${index}`}><i style={{ background: color.value }} />{color.name}</span>)}</strong></div>}
              </div>
            )}
          </section>
        </section>

        <aside className="product-detail-sidebar">
          <article className="product-info product-info-ref">
            <h1>{product.name}</h1>
            <p className="product-subtitle-ref">{subtitle}</p>
            <div className="product-info-divider" />
            <div className="product-detail-price" aria-label="قیمت محصول">
              <span>قیمت</span>
              <strong>{product.price != null ? formatPrice(product.price) : "تماس با فروشنده"}</strong>
            </div>
            <section className="product-spec-card-ref" aria-label="مشخصات محصول">
              <div className="product-spec-row-ref">
                <span className="product-spec-icon-ref"><IconCube /></span>
                <div><strong>ابعاد</strong><span>{hasDimensions ? [dims?.widthM && `عرض: ${formatMeters(dims.widthM)}`, dims?.heightM && `ارتفاع: ${formatMeters(dims.heightM)}`, dims?.depthM && `عمق: ${formatMeters(dims.depthM)}`].filter(Boolean).join("  |  ") : "ثبت نشده"}</span></div>
              </div>
              <div className="product-spec-row-ref">
                <span className="product-spec-icon-ref"><IconLayers /></span>
                <div><strong>جنس متریال</strong><span>{product.material || "ثبت نشده"}</span></div>
              </div>
              {product.colors && product.colors.length > 0 && (
                <div className="product-spec-row-ref">
                  <span className="product-spec-icon-ref"><IconPalette /></span>
                  <div><strong>رنگ</strong><span className="product-color-list-ref">{product.colors.map((color, index) => <span key={`${color.name}-${index}`}><i style={{ background: color.value }} />{color.name}</span>)}</span></div>
                </div>
              )}
            </section>
          </article>

          <SellerCard seller={seller} sellerSlug={product.seller.slug} />
        </aside>
      </div>

      {related.length > 0 && (
        <section className="section related-products-ref" aria-labelledby="related-products-title">
          <div className="section-head">
            <div><h2 id="related-products-title">محصولات دیگر این فروشگاه</h2><p>محصولات دیگری که این فروشگاه منتشر کرده است</p></div>
            <Link to={`/sellers/${encodeURIComponent(product.seller.slug)}`} className="btn btn-outline btn-sm">مشاهده فروشگاه</Link>
          </div>
          <div className="grid grid-4">{related.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={relatedProduct} />)}</div>
        </section>
      )}
    </main>
  );
}

function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value)} تومان`;
}

function formatMeters(meters: number) {
  if (meters < 1) {
    return `${Math.round(
      meters * 100
    )} سانتی‌متر`;
  }

  return `${meters.toFixed(2)} متر`;
}

function IconCube(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>}
function IconLayers(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 4-8 4-8-4 8-4Z"/><path d="m4 12 8 4 8-4M4 16l8 4 8-4"/></svg>}
function IconPalette(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="8.5" cy="10" r=".9"/><circle cx="12" cy="7.8" r=".9"/><circle cx="15.5" cy="10" r=".9"/><path d="M16.5 15.5c0 1.1-.8 1.8-1.8 1.8h-1.2c-.8 0-1.4-.5-1.4-1.2 0-.6.4-1.1 1-1.3 1.4-.4 3.4-.1 3.4.7Z"/></svg>}

function SellerCard({ seller, sellerSlug }: { seller: { slug: string; storeName: string; description: string | null; logoUrl: string | null; contactEmail: string | null; contactPhone: string | null; address?: string | null; socialLinks: Record<string,string> | null } | undefined; sellerSlug: string; }) {
  if (!seller) return null;
  const logo = getSellerLogoUrl(seller.logoUrl);
  return (
    <section className="seller-box seller-box--detail" aria-label="اطلاعات فروشگاه">
      <div className="seller-box__head">
        {logo ? <img src={logo} alt={seller.storeName} loading="lazy" /> : <div className="seller-box__fallback">{sellerInitials(seller.storeName)}</div>}
        <div><span className="page-eyebrow">اطلاعات فروشگاه</span><h3>{seller.storeName}</h3></div>
      </div>
      {seller.description && <p className="seller-box__description">{seller.description}</p>}
      <div className="seller-box__contact-list">
        {seller.contactPhone && <a href={`tel:${seller.contactPhone}`}><span className="seller-box__contact-icon">⌕</span><span><small>شماره تماس</small><strong>{seller.contactPhone}</strong></span></a>}
        {seller.address && <div><span className="seller-box__contact-icon">⌖</span><span><small>آدرس</small><strong>{seller.address}</strong></span></div>}
      </div>
      <Link to={`/sellers/${encodeURIComponent(sellerSlug)}`} className="btn btn-primary seller-box__button">مشاهده فروشگاه</Link>
    </section>
  );
}
