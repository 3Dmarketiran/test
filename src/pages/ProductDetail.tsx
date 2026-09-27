import React from "react";
import { Link, useParams } from "react-router-dom";
import { getSellerLogoUrl, sellerInitials, useData } from "../lib/data";
import ProductViewer from "../components/ProductViewer";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, sellers, loading } = useData();

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
        <div
          className="product-detail"
          aria-busy="true"
          aria-label="در حال بارگذاری محصول"
        >
          <div
            className="skeleton"
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              minHeight: 320,
              borderRadius:
                "var(--radius-lg)",
            }}
          />

          <div
            style={{
              minWidth: 0,
              paddingTop: 8,
            }}
          >
            <div
              className="skeleton"
              style={{
                height: 38,
                width: "72%",
                marginBottom: 14,
              }}
            />

            <div
              className="skeleton"
              style={{
                height: 16,
                width: "35%",
                marginBottom: 24,
              }}
            />

            <div
              className="skeleton"
              style={{
                height: 15,
                width: "100%",
                marginBottom: 9,
              }}
            />

            <div
              className="skeleton"
              style={{
                height: 15,
                width: "92%",
                marginBottom: 9,
              }}
            />

            <div
              className="skeleton"
              style={{
                height: 15,
                width: "78%",
              }}
            />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container section">
        <div className="empty-state">
          <div
            className="icon"
            aria-hidden="true"
            style={{ fontSize: 40 }}
          >
            ❓
          </div>

          <p>
            این محصول یافت نشد یا دیگر در دسترس
            نیست.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
            style={{ marginTop: 12 }}
          >
            بازگشت به فروشگاه‌ها
          </Link>
        </div>
      </main>
    );
  }

  const seller = sellers.find(
    (item) => item.slug === product.seller.slug
  );

  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.seller.slug === product.seller.slug
    )
    .slice(0, 4);

  const dims = product.dimensions;

  const hasDimensions = Boolean(
    dims?.widthM ||
      dims?.heightM ||
      dims?.depthM
  );

  return (
    <main className="container section">
      <nav
        className="breadcrumbs"
        aria-label="مسیر صفحه"
      >
        <Link to="/">خانه</Link>

        <span aria-hidden="true">‹</span>

        <Link
          to={`/sellers/${encodeURIComponent(
            product.seller.slug
          )}`}
        >
          {product.seller.storeName}
        </Link>

        <span aria-hidden="true">‹</span>

        <span
          style={{
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={product.name}
        >
          {product.name}
        </span>
      </nav>

      <div className="product-detail">
        <ProductViewer product={product} />

        <article className="product-info">
          <h1>{product.name}</h1>

          <Link
            to={`/sellers/${encodeURIComponent(
              product.seller.slug
            )}`}
            className="seller-link"
          >
            فروشگاه: {product.seller.storeName}
          </Link>

          {product.price != null ? (
            <div className="product-detail-price" aria-label="قیمت محصول">
              <span>قیمت</span>
              <strong>{new Intl.NumberFormat("fa-IR").format(product.price)} تومان</strong>
            </div>
          ) : (
            <div className="product-detail-contact-price" aria-label="قیمت محصول اعلام نشده است">
              <strong>برای اطلاع از قیمت با فروشنده تماس بگیرید</strong>
              <Link to={`/sellers/${encodeURIComponent(product.seller.slug)}`} className="btn btn-outline btn-sm">مشاهده فروشگاه و اطلاعات تماس</Link>
            </div>
          )}

          {product.shortDescription && (
            <p className="desc">
              {product.shortDescription}
            </p>
          )}

          {hasDimensions && (
            <section
              aria-label="ابعاد محصول"
            >
              <table className="spec-table">
                <tbody>
                  {dims?.widthM && (
                    <tr>
                      <td>عرض</td>
                      <td>
                        {formatMeters(
                          dims.widthM
                        )}
                      </td>
                    </tr>
                  )}

                  {dims?.heightM && (
                    <tr>
                      <td>ارتفاع</td>
                      <td>
                        {formatMeters(
                          dims.heightM
                        )}
                      </td>
                    </tr>
                  )}

                  {dims?.depthM && (
                    <tr>
                      <td>عمق</td>
                      <td>
                        {formatMeters(
                          dims.depthM
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}

          {(product.material || (product.colors && product.colors.length > 0)) && (
            <section className="product-attributes-card" aria-label="ویژگی‌های محصول">
              {product.material && (
                <div className="product-attribute-row">
                  <div className="product-attribute-icon">✦</div>
                  <div><strong>جنس متریال</strong><span>{product.material}</span></div>
                </div>
              )}
              {product.colors && product.colors.length > 0 && (
                <div className="product-attribute-row product-color-attribute">
                  <div className="product-attribute-icon">●</div>
                  <div><strong>رنگ</strong><div className="product-detail-colors">{product.colors.map((color, index) => <span key={`${color.name}-${index}`} className="product-detail-color"><i style={{ background: color.value }} aria-hidden="true" />{color.name}</span>)}</div></div>
                </div>
              )}
            </section>
          )}

          {product.tags.length > 0 && (
            <div
              className="tag-row"
              aria-label="برچسب‌های محصول"
            >
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="chip"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {product.fullDescription && (
            <section>
              <p className="desc">
                {product.fullDescription}
              </p>
            </section>
          )}

          <SellerCard
            seller={seller}
            sellerSlug={product.seller.slug}
          />
        </article>
      </div>

      {related.length > 0 && (
        <section
          className="section"
          aria-labelledby="related-products-title"
        >
          <div className="section-head">
            <div>
              <h2 id="related-products-title">
                محصولات دیگر این فروشگاه
              </h2>

              <p>
                محصولات دیگری که این فروشگاه
                منتشر کرده است
              </p>
            </div>

            <Link
              to={`/sellers/${encodeURIComponent(
                product.seller.slug
              )}`}
              className="btn btn-outline btn-sm"
            >
              مشاهده فروشگاه
            </Link>
          </div>

          <div className="grid grid-4">
            {related.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function formatMeters(meters: number) {
  if (meters < 1) {
    return `${Math.round(
      meters * 100
    )} سانتی‌متر`;
  }

  return `${meters.toFixed(2)} متر`;
}

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
