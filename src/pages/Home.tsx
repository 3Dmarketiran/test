import React from "react";
import { Link } from "react-router-dom";
import { getSellerLogoUrl, sellerInitials, useData } from "../lib/data";
import { useSeo } from "../lib/seo";
import { ADMIN_URL } from "../lib/config";

function ArrowIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10.5V20h16v-9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 10.5h18L19 4H5l-2 6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 20v-5h8v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const {
    sellers,
    products,
    categories,
    settings,
    loading,
  } = useData();

  const platformName =
    settings?.platformName ?? "پلتفرم نمایشگاه محصول";

  useSeo({
    title: platformName,
    description:
      "فروشگاه‌های مختلف را مشاهده کنید، وارد فروشگاه شوید و محصولات سه‌بعدی و واقعیت افزوده آن را ببینید.",
  });

  // Store-first: every seller is a "post" in the feed, shown with a
  // small preview of their own products — never products compared
  // side by side across different stores.
  const feedSellers = sellers.slice(0, 20);
  const productsBySeller = (slug: string) =>
    products.filter((product) => product.seller.slug === slug);

  return (
    <>
      {/* STORY ROW — quick jump into a store, Instagram-style */}
      {sellers.length > 0 && (
        <section style={{ paddingTop: 18 }}>
          <div className="container">
            <div className="story-row">
              {sellers.map((seller) => {
                const logo = getSellerLogoUrl(seller.logoUrl, seller.slug);
                return (
                  <Link key={seller.slug} to={`/sellers/${seller.slug}`} className="story-item">
                    <div className="story-item__ring">
                      <div className="story-item__hole">
                        {logo ? <img src={logo} alt={seller.storeName} loading="lazy" /> : sellerInitials(seller.storeName)}
                      </div>
                    </div>
                    <span>{seller.storeName}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* STORE FEED — store first, then its products; find a store, then browse inside it */}
      <section className="section" style={{ paddingTop: 20 }}>
        <div className="container">
          {loading ? (
            <div className="store-feed">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="skeleton" style={{ height: 320, borderRadius: 22 }} />
              ))}
            </div>
          ) : feedSellers.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 240, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
              <div className="icon" style={{ marginBottom: 12 }}>🏪</div>
              <p style={{ margin: 0 }}>هنوز فروشگاه فعالی ثبت نشده است.</p>
            </div>
          ) : (
            <div className="store-feed">
              {feedSellers.map((seller) => {
                const logo = getSellerLogoUrl(seller.logoUrl, seller.slug);
                const sellerProducts = productsBySeller(seller.slug).slice(0, 3);
                return (
                  <article key={seller.slug} className="card store-post">
                    <div className="store-post__head">
                      <div className="store-post__avatar">
                        {logo ? <img src={logo} alt={seller.storeName} loading="lazy" /> : sellerInitials(seller.storeName)}
                      </div>
                      <div className="store-post__who">
                        <div className="store-post__name">{seller.storeName}</div>
                        <div className="store-post__cat">{seller.category?.name ?? "فروشگاه"} · {productsBySeller(seller.slug).length} محصول</div>
                      </div>
                      <Link to={`/sellers/${seller.slug}`} className="btn btn-outline btn-sm">مشاهده فروشگاه</Link>
                    </div>

                    {seller.description && <p className="store-post__bio">{seller.description}</p>}

                    <Link to={`/sellers/${seller.slug}`} className="store-post__media" aria-label={`محصولات ${seller.storeName}`}>
                      {Array.from({ length: 3 }).map((_, index) => {
                        const product = sellerProducts[index];
                        const image = product?.images.find((img) => img.isPrimary) ?? product?.images[0];
                        const is3d = product?.models.some((m) => m.kind === "GLB" || m.kind === "GLTF");
                        const isAr = product?.models.some((m) => m.kind === "USDZ");
                        return (
                          <div key={index} className="store-post__ph">
                            {image?.url ? (
                              <>
                                {(is3d || isAr) && <span className="store-post__tag">{is3d ? "3D" : "AR"}</span>}
                                <img src={image.url} alt={product?.name ?? ""} loading="lazy" />
                              </>
                            ) : (
                              <div className="store-post__ph--empty">□</div>
                            )}
                          </div>
                        );
                      })}
                    </Link>

                    <div className="store-post__foot">
                      <div className="store-post__stat"><b>{seller.contactPhone ? "پاسخگو" : "—"}</b> برای مشتریان</div>
                      <Link to={`/sellers/${seller.slug}`} className="btn btn-primary btn-sm">ورود به فروشگاه</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>دسته‌بندی‌ها</h2>

                <p>
                  دسته‌بندی موردنظر را انتخاب کنید و
                  فروشگاه‌های مرتبط را پیدا کنید.
                </p>
              </div>

              <Link
                to="/categories"
                className="btn btn-outline btn-sm"
              >
                همه دسته‌بندی‌ها
                <ArrowIcon />
              </Link>
            </div>

            <div
              className="pill-row"
              style={{
                marginBottom: 0,
              }}
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(
                    category.slug
                  )}`}
                  className="pill"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SELLER CTA */}
      <section className="section">
        <div className="container">
          <div
            className="card"
            style={{
              padding: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                minWidth: 0,
                flex: "1 1 420px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  fontSize: 13,
                  fontWeight: 750,
                  color:
                    "var(--color-primary)",
                }}
              >
                <StoreIcon />
                فروشنده هستید؟
              </div>

              <h2
                style={{
                  margin: "0 0 8px",
                }}
              >
                فروشگاه خودتان را در {platformName} بسازید
              </h2>

              <p
                style={{
                  margin: 0,
                  color:
                    "var(--color-text-muted)",
                  lineHeight: 1.9,
                }}
              >
                محصولاتتان را با تصاویر، مدل سه‌بعدی
                و واقعیت افزوده معرفی کنید و مشتریان را
                مستقیماً به فروشگاه خودتان هدایت کنید.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/plans"
                className="btn btn-primary"
              >
                مشاهده پلن‌ها
              </Link>

              <a
                href={ADMIN_URL}
                className="btn btn-outline"
                target="_blank"
                rel="noreferrer noopener"
              >
                ورود فروشندگان
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>
                تجربه فروشگاه و محصول چگونه کار می‌کند؟
              </h2>

              <p>
                مسیر ساده‌ای برای پیدا کردن فروشگاه،
                بررسی محصولات و تماس با فروشنده.
              </p>
            </div>
          </div>

          <div className="steps">
            <div className="step">
              <div className="num">۱</div>

              <strong>پیدا کردن فروشگاه</strong>

              <p className="muted">
                فروشگاه موردنظر خود را از طریق جستجو،
                دسته‌بندی‌ها یا فهرست فروشگاه‌ها پیدا کنید.
              </p>
            </div>

            <div className="step">
              <div className="num">۲</div>

              <strong>ورود به فروشگاه</strong>

              <p className="muted">
                وارد صفحه اختصاصی فروشگاه شوید و
                محصولات همان فروشنده را ببینید.
              </p>
            </div>

            <div className="step">
              <div className="num">۳</div>

              <strong>مشاهده سه‌بعدی و AR</strong>

              <p className="muted">
                مدل محصول را بچرخانید، بزرگ‌نمایی کنید
                و در صورت پشتیبانی، آن را در فضای واقعی
                خودتان مشاهده کنید.
              </p>
            </div>

            <div className="step">
              <div className="num">۴</div>

              <strong>تماس با فروشنده</strong>

              <p className="muted">
                در صورت تمایل، مستقیماً با فروشنده
                همان فروشگاه در تماس باشید.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
