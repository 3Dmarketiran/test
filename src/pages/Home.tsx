import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";

const ADMIN_URL =
  "https://3dmarketiran.github.io/frontend-admin/#/login";

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

function ModelIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m4 7.5 8 4.5 8-4.5M12 12v9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const {
    products,
    sellers,
    categories,
    settings,
    loading,
  } = useData();

  const platformName =
    settings?.platformName ?? "پلتفرم نمایشگاه محصول";

  useSeo({
    title: platformName,
    description:
      "مرور محصولات با نمایش سه‌بعدی و واقعیت افزوده، و تماس مستقیم با فروشنده.",
  });

  const featured = products.slice(0, 8);
  const featuredSellers = sellers.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <div
            style={{
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                alignSelf: "flex-start",
                gap: 7,
                marginBottom: 16,
                padding: "7px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.1)",
                color: "inherit",
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              <ModelIcon />
              تجربه محصول با 3D و AR
            </div>

            <h1>
              محصولات را پیش از خرید،
              <br />
              در فضای واقعی خودتان ببینید
            </h1>

            <p>
              {platformName} محصولات فروشندگان مختلف را
              با نمایش سه‌بعدی تعاملی و واقعیت افزوده
              (AR) در اختیار شما قرار می‌دهد؛ با مقیاس
              واقعی و مستقیم از داخل مرورگر.
            </p>

            <div className="hero__cta">
              <Link
                to="/products"
                className="btn btn-primary"
              >
                مشاهده محصولات
              </Link>

              <Link
                to="/plans"
                className="btn btn-outline"
              >
                اشتراک فروشندگان
              </Link>

              <a
                href={ADMIN_URL}
                className="btn btn-outline"
                target="_blank"
                rel="noreferrer noopener"
              >
                ورود / ثبت‌نام فروشندگان
              </a>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 18,
                marginTop: 24,
                color: "inherit",
                opacity: 0.8,
                fontSize: 13,
              }}
            >
              <span>
                ✓ نمایش مدل سه‌بعدی
              </span>
              <span>
                ✓ پشتیبانی از AR
              </span>
              <span>
                ✓ تماس مستقیم با فروشنده
              </span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div
            className="hero__visual"
            style={{
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              minHeight: 390,
              background:
                "radial-gradient(circle at 30% 20%, rgba(139,92,246,.32), transparent 38%), radial-gradient(circle at 75% 75%, rgba(34,211,238,.22), transparent 35%), linear-gradient(145deg, #111827, #312e81 55%, #0f172a)",
            }}
          >
            <div
              style={{
                width: "76%",
                maxWidth: 360,
                aspectRatio: "1",
                borderRadius: 36,
                border:
                  "1px solid rgba(255,255,255,.18)",
                background:
                  "rgba(255,255,255,.08)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow:
                  "0 30px 80px rgba(0,0,0,.28)",
                display: "grid",
                placeItems: "center",
                textAlign: "center",
                color: "#fff",
                padding: 28,
              }}
            >
              <div>
                <div
                  style={{
                    width: 86,
                    height: 86,
                    margin: "0 auto 18px",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 26,
                    background:
                      "rgba(255,255,255,.1)",
                    border:
                      "1px solid rgba(255,255,255,.12)",
                  }}
                >
                  <ModelIcon />
                </div>

                <strong
                  style={{
                    display: "block",
                    fontSize: "1.3rem",
                    marginBottom: 9,
                  }}
                >
                  سه‌بعدی + AR
                </strong>

                <span
                  style={{
                    display: "block",
                    opacity: 0.78,
                    lineHeight: 1.9,
                    fontSize: 14,
                  }}
                >
                  محصول را بچرخانید،
                  بزرگ‌نمایی کنید و در فضای
                  واقعی خودتان ببینید.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="container">
          <div
            className="section-head"
            style={{
              alignItems: "flex-end",
            }}
          >
            <div>
              <h2>محصولات ویژه</h2>
              <p>
                جدیدترین محصولات منتشرشده روی پلتفرم
              </p>
            </div>

            <Link
              to="/products"
              className="btn btn-outline btn-sm"
            >
              مشاهده همه
              <ArrowIcon />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-4">
              {Array.from({ length: 8 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="skeleton"
                    style={{
                      aspectRatio: "3 / 4",
                      borderRadius: 18,
                    }}
                  />
                )
              )}
            </div>
          ) : featured.length === 0 ? (
            <div
              className="empty-state"
              style={{
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                className="icon"
                style={{
                  marginBottom: 12,
                }}
              >
                📦
              </div>

              <p
                style={{
                  margin: 0,
                }}
              >
                هنوز محصولی منتشر نشده است.
              </p>
            </div>
          ) : (
            <div className="grid grid-4">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
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
                  محصولات را بر اساس دسته موردنظر پیدا کنید.
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

      {/* SELLERS */}
      {featuredSellers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>فروشندگان</h2>
                <p>
                  فروشگاه‌ها و محصولات فروشندگان را
                  مشاهده کنید.
                </p>
              </div>
            </div>

            <div className="grid grid-3">
              {featuredSellers.map((seller) => (
                <Link
                  key={seller.slug}
                  to={`/sellers/${seller.slug}`}
                  className="card"
                  style={{
                    padding: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    minWidth: 0,
                    textDecoration: "none",
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 16,
                      overflow: "hidden",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "var(--surface-2, #f4f4f4)",
                      flexShrink: 0,
                    }}
                  >
                    {seller.logoUrl ? (
                      <img
                        src={seller.logoUrl}
                        alt={seller.storeName}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <StoreIcon />
                    )}
                  </div>

                  <div
                    style={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 800,
                        lineHeight: 1.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {seller.storeName}
                    </div>

                    {seller.description && (
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: ".84rem",
                          lineHeight: 1.7,
                          color:
                            "var(--color-text-muted)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {seller.description}
                      </div>
                    )}
                  </div>

                  <span
                    aria-hidden="true"
                    style={{
                      width: 32,
                      height: 32,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 10,
                      background:
                        "var(--surface-2, #f5f5f5)",
                      color:
                        "var(--color-text-muted)",
                      flexShrink: 0,
                    }}
                  >
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>
                نمایش سه‌بعدی و واقعیت افزوده
                چگونه کار می‌کند؟
              </h2>

              <p>
                تجربه‌ای ساده برای بررسی محصول پیش از
                تماس با فروشنده.
              </p>
            </div>
          </div>

          <div className="steps">
            <div className="step">
              <div className="num">۱</div>
              <strong>مرور محصول</strong>
              <p className="muted">
                محصول موردنظر را در فهرست یا جستجو پیدا
                کنید.
              </p>
            </div>

            <div className="step">
              <div className="num">۲</div>
              <strong>مشاهده سه‌بعدی</strong>
              <p className="muted">
                مدل را بچرخانید، بزرگ‌نمایی کنید و از
                هر زاویه ببینید.
              </p>
            </div>

            <div className="step">
              <div className="num">۳</div>
              <strong>واقعیت افزوده</strong>
              <p className="muted">
                با دوربین گوشی، محصول را با اندازه واقعی
                در فضای خودتان قرار دهید.
              </p>
            </div>

            <div className="step">
              <div className="num">۴</div>
              <strong>تماس با فروشنده</strong>
              <p className="muted">
                در صورت تمایل، مستقیماً با فروشنده محصول
                در تماس باشید.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
