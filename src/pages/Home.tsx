import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";

const ADMIN_URL =
  "https://3dmarketiran.github.io/frontend-admin/#/login";

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

          <div>

            <h1>
              محصولات را پیش از خرید،
              در فضای واقعی خودتان ببینید
            </h1>

            <p>
              {platformName} محصولات فروشندگان مختلف را
              با نمایش سه‌بعدی تعاملی و واقعیت افزوده
              (AR) در اختیار شما قرار می‌دهد — با مقیاس
              واقعی، مستقیم از داخل مرورگر شما.
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
              >
                ورود / ثبت‌نام فروشندگان
              </a>

            </div>

          </div>

          {/* HERO VISUAL */}

          <div
            className="hero__visual"
            style={{
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              background:
                "radial-gradient(circle at 30% 20%, rgba(139,92,246,.28), transparent 38%), radial-gradient(circle at 75% 75%, rgba(34,211,238,.20), transparent 35%), linear-gradient(145deg, #111827, #312e81 55%, #0f172a)",
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
                    fontSize: "4.5rem",
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  ◈
                </div>

                <strong
                  style={{
                    display: "block",
                    fontSize: "1.25rem",
                    marginBottom: 8,
                  }}
                >
                  سه‌بعدی + AR
                </strong>

                <span
                  style={{
                    opacity: 0.78,
                    lineHeight: 1.9,
                  }}
                >
                  محصول را بچرخانید،
                  بزرگ‌نمایی کنید و در فضای
                  واقعی ببینید.
                </span>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* FEATURED PRODUCTS */}

      <section className="section">
        <div className="container">

          <div className="section-head">

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
                      aspectRatio: "3/4",
                    }}
                  />
                )
              )}

            </div>
          ) : featured.length === 0 ? (

            <div className="empty-state">
              <div className="icon">📦</div>
              <p>
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
              <h2>دسته‌بندی‌ها</h2>
            </div>

            <div className="pill-row">

              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
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
              <h2>فروشندگان</h2>
            </div>

            <div className="grid grid-3">

              {featuredSellers.map((seller) => (

                <Link
                  key={seller.slug}
                  to={`/sellers/${seller.slug}`}
                  className="card"
                  style={{
                    padding: "var(--space-2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >

                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "grid",
                      placeItems: "center",
                      background:
                        "var(--color-background)",
                      flexShrink: 0,
                    }}
                  >

                    {seller.logoUrl ? (

                      <img
                        src={seller.logoUrl}
                        alt={seller.storeName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />

                    ) : (

                      <span aria-hidden>
                        🏪
                      </span>

                    )}

                  </div>

                  <div>

                    <div
                      style={{
                        fontWeight: 700,
                      }}
                    >
                      {seller.storeName}
                    </div>

                    {seller.description && (
                      <div
                        style={{
                          fontSize: ".85rem",
                          color:
                            "var(--color-text-muted)",
                        }}
                      >
                        {seller.description.slice(
                          0,
                          60
                        )}
                      </div>
                    )}

                  </div>

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
            <h2>
              نمایش سه‌بعدی و واقعیت افزوده
              چگونه کار می‌کند؟
            </h2>
          </div>

          <div className="steps">

            <div className="step">
              <div className="num">۱</div>
              <strong>مرور محصول</strong>
              <p className="muted">
                محصول موردنظر را در فهرست یا
                جستجو پیدا کنید.
              </p>
            </div>

            <div className="step">
              <div className="num">۲</div>
              <strong>مشاهده سه‌بعدی</strong>
              <p className="muted">
                مدل را بچرخانید، بزرگ‌نمایی کنید
                و از هر زاویه ببینید.
              </p>
            </div>

            <div className="step">
              <div className="num">۳</div>
              <strong>واقعیت افزوده</strong>
              <p className="muted">
                با دوربین گوشی، محصول را با
                اندازه واقعی در فضای خودتان
                قرار دهید.
              </p>
            </div>

            <div className="step">
              <div className="num">۴</div>
              <strong>تماس با فروشنده</strong>
              <p className="muted">
                در صورت تمایل، مستقیماً با
                فروشنده محصول در تماس باشید.
              </p>
            </div>

          </div>

        </div>

      </section>
    </>
  );
}
