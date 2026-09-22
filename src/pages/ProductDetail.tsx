import React from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import ProductViewer from "../components/ProductViewer";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, loading } = useData();

  const product = products.find(
    (p) => p.slug === slug
  );

  useSeo({
    title: product
      ? `${product.name} | خرید سه‌بعدی و AR`
      : "محصول",
    description:
      product?.shortDescription ?? undefined,
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
            بازگشت به محصولات
          </Link>
        </div>
      </main>
    );
  }

  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category?.slug ===
          product.category?.slug
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

        <Link to="/products">
          محصولات
        </Link>

        {product.category && (
          <>
            <span aria-hidden="true">‹</span>

            <Link
              to={`/products?category=${encodeURIComponent(
                product.category.slug
              )}`}
            >
              {product.category.name}
            </Link>
          </>
        )}

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
            to={`/sellers/${product.seller.slug}`}
            className="seller-link"
          >
            فروشنده:{" "}
            {product.seller.storeName}
          </Link>

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
                محصولات مشابه
              </h2>

              <p>
                محصولات دیگری از همین دسته
              </p>
            </div>

            {product.category && (
              <Link
                to={`/products?category=${encodeURIComponent(
                  product.category.slug
                )}`}
                className="btn btn-outline btn-sm"
              >
                مشاهده همه
              </Link>
            )}
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

function SellerCard({
  sellerSlug,
}: {
  sellerSlug: string;
}) {
  const { sellers } = useData();

  const seller = sellers.find(
    (s) => s.slug === sellerSlug
  );

  if (!seller) {
    return null;
  }

  const hasContact =
    Boolean(seller.contactPhone) ||
    Boolean(seller.contactEmail);

  return (
    <section
      className="seller-box"
      aria-label="اطلاعات فروشنده"
    >
      {seller.logoUrl ? (
        <img
          src={seller.logoUrl}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            width: 50,
            height: 50,
            borderRadius: 15,
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #f0efff, #eef8fa)",
            fontSize: 21,
          }}
        >
          🏪
        </div>
      )}

      <div
        style={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <div
          className="name"
          style={{
            overflowWrap: "anywhere",
          }}
        >
          {seller.storeName}
        </div>

        {hasContact && (
          <div className="contact-row">
            {seller.contactPhone && (
              <a
                href={`tel:${seller.contactPhone}`}
                className="btn btn-outline btn-sm"
                aria-label={`تماس با ${seller.storeName}`}
              >
                تماس تلفنی
              </a>
            )}

            {seller.contactEmail && (
              <a
                href={`mailto:${seller.contactEmail}`}
                className="btn btn-outline btn-sm"
                aria-label={`ارسال ایمیل به ${seller.storeName}`}
              >
                ایمیل
              </a>
            )}

            <Link
              to={`/sellers/${seller.slug}`}
              className="btn btn-primary btn-sm"
            >
              فروشگاه فروشنده
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
