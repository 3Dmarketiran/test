import React from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import ProductViewer from "../components/ProductViewer";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, loading } = useData();
  const product = products.find((p) => p.slug === slug);

  useSeo({
    title: product ? `${product.name} | خرید سه‌بعدی و AR` : "محصول",
    description: product?.shortDescription ?? undefined,
    image: product?.images[0]?.url,
    canonicalPath: `/products/${slug}`,
  });

  if (loading) {
    return (
      <div className="container section">
        <div className="product-detail">
          <div className="skeleton" style={{ aspectRatio: "1/1", borderRadius: "var(--radius-lg)" }} />
          <div>
            <div className="skeleton" style={{ height: 32, width: "70%", marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 16, width: "100%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 16, width: "90%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container section empty-state">
        <div className="icon" aria-hidden>❓</div>
        <p>این محصول یافت نشد یا دیگر در دسترس نیست.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 12 }}>بازگشت به محصولات</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.id !== product.id && p.category?.slug === product.category?.slug).slice(0, 4);
  const dims = product.dimensions;

  return (
    <div className="container section">
      <nav className="breadcrumbs" aria-label="مسیر صفحه">
        <Link to="/">خانه</Link> ‹ <Link to="/products">محصولات</Link>
        {product.category && <> ‹ <Link to={`/products?category=${product.category.slug}`}>{product.category.name}</Link></>}
        {" "}‹ <span>{product.name}</span>
      </nav>

      <div className="product-detail">
        <ProductViewer product={product} />

        <div className="product-info">
          <h1>{product.name}</h1>
          <Link to={`/sellers/${product.seller.slug}`} className="seller-link">فروشنده: {product.seller.storeName}</Link>

          {product.shortDescription && <p className="desc">{product.shortDescription}</p>}

          {(dims?.widthM || dims?.heightM || dims?.depthM) && (
            <table className="spec-table">
              <tbody>
                {dims.widthM && <tr><td>عرض</td><td>{formatMeters(dims.widthM)}</td></tr>}
                {dims.heightM && <tr><td>ارتفاع</td><td>{formatMeters(dims.heightM)}</td></tr>}
                {dims.depthM && <tr><td>عمق</td><td>{formatMeters(dims.depthM)}</td></tr>}
              </tbody>
            </table>
          )}

          {product.tags.length > 0 && (
            <div className="tag-row">
              {product.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          )}

          {product.fullDescription && <p className="desc">{product.fullDescription}</p>}

          <SellerCard sellerSlug={product.seller.slug} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head"><h2>محصولات مشابه</h2></div>
          <div className="grid grid-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function formatMeters(m: number) {
  return m < 1 ? `${Math.round(m * 100)} سانتی‌متر` : `${m.toFixed(2)} متر`;
}

function SellerCard({ sellerSlug }: { sellerSlug: string }) {
  const { sellers } = useData();
  const seller = sellers.find((s) => s.slug === sellerSlug);
  if (!seller) return null;

  return (
    <div className="seller-box">
      <img src={seller.logoUrl ?? undefined} alt={seller.storeName} />
      <div>
        <div className="name">{seller.storeName}</div>
        <div className="contact-row">
          {seller.contactPhone && <a href={`tel:${seller.contactPhone}`} className="btn btn-outline btn-sm">تماس تلفنی</a>}
          {seller.contactEmail && <a href={`mailto:${seller.contactEmail}`} className="btn btn-outline btn-sm">ایمیل</a>}
          <Link to={`/sellers/${seller.slug}`} className="btn btn-primary btn-sm">فروشگاه فروشنده</Link>
        </div>
      </div>
    </div>
  );
}
