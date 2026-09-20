import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";
import { track } from "../lib/analytics";

export default function SellerStore() {
  const { slug } = useParams();
  const { sellers, products, loading } = useData();
  const seller = sellers.find((s) => s.slug === slug);
  const sellerProducts = products.filter((p) => p.seller.slug === slug);

  useSeo({
    title: seller ? `${seller.storeName} | فروشگاه فروشنده` : "فروشگاه فروشنده",
    description: seller?.description ?? undefined,
    canonicalPath: `/sellers/${slug}`,
  });

  useEffect(() => {
    if (seller) track("SELLER_PAGE_VIEW", { sellerId: undefined, metadata: { sellerSlug: seller.slug } });
  }, [seller]);

  if (loading) return <div className="container section"><div className="skeleton" style={{ height: 200 }} /></div>;

  if (!seller) {
    return (
      <div className="container section empty-state">
        <div className="icon" aria-hidden>🏬</div>
        <p>این فروشگاه یافت نشد یا در حال حاضر در دسترس نیست (ممکن است اشتراک فروشنده منقضی شده باشد).</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 12 }}>مشاهده محصولات دیگر</Link>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="seller-box" style={{ marginBottom: "var(--space-4)" }}>
        <img src={seller.logoUrl ?? undefined} alt={seller.storeName} style={{ width: 72, height: 72 }} />
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "1.5rem" }}>{seller.storeName}</h1>
          {seller.description && <p className="muted" style={{ color: "var(--color-text-muted)", margin: "0 0 8px" }}>{seller.description}</p>}
          <div className="contact-row">
            {seller.contactPhone && <a href={`tel:${seller.contactPhone}`} className="btn btn-outline btn-sm">تماس تلفنی</a>}
            {seller.contactEmail && <a href={`mailto:${seller.contactEmail}`} className="btn btn-outline btn-sm">ایمیل</a>}
            {Object.entries(seller.socialLinks ?? {}).map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noreferrer noopener" className="btn btn-outline btn-sm">{k}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="section-head"><h2>محصولات این فروشنده ({sellerProducts.length})</h2></div>
      {sellerProducts.length === 0 ? (
        <div className="empty-state"><p>این فروشنده هنوز محصولی منتشر نکرده است.</p></div>
      ) : (
        <div className="grid grid-4">
          {sellerProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
