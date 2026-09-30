import React, { useEffect, useRef } from "react";
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

function Hero3DScene() {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let raf = 0;
    let scrollY = window.scrollY;
    let targetX = 0;
    let targetY = 0;

    const render = () => {
      const progress = Math.min(scrollY / Math.max(window.innerHeight, 1), 1);
      const rotateY = targetX + progress * 34;
      const rotateX = targetY - progress * 10;
      scene.style.setProperty("--hero-rx", `${rotateX}deg`);
      scene.style.setProperty("--hero-ry", `${rotateY}deg`);
      scene.style.setProperty("--hero-scroll", `${progress}`);
      raf = 0;
    };

    const schedule = () => {
      scrollY = window.scrollY;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const move = (event: MouseEvent) => {
      const rect = scene.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 18;
      targetY = -y * 12;
      if (!raf) raf = requestAnimationFrame(render);
    };

    const leave = () => {
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(render);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    scene.addEventListener("mousemove", move);
    scene.addEventListener("mouseleave", leave);
    render();

    return () => {
      window.removeEventListener("scroll", schedule);
      scene.removeEventListener("mousemove", move);
      scene.removeEventListener("mouseleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hero-3d-stage" ref={sceneRef} aria-label="نمایش سه‌بعدی تعاملی 3DMarketIran">
      <div className="hero-3d-stage__stars" aria-hidden="true" />
      <div className="hero-3d-stage__halo hero-3d-stage__halo--a" aria-hidden="true" />
      <div className="hero-3d-stage__halo hero-3d-stage__halo--b" aria-hidden="true" />
      <div className="hero-3d-orbit hero-3d-orbit--one" aria-hidden="true" />
      <div className="hero-3d-orbit hero-3d-orbit--two" aria-hidden="true" />
      <div className="hero-3d-object">
        <div className="hero-3d-object__shadow" aria-hidden="true" />
        <div className="hero-3d-object__core">
          <span className="hero-3d-face hero-3d-face--front">3D</span>
          <span className="hero-3d-face hero-3d-face--back">AR</span>
          <span className="hero-3d-face hero-3d-face--top" />
          <span className="hero-3d-face hero-3d-face--bottom" />
          <span className="hero-3d-face hero-3d-face--left" />
          <span className="hero-3d-face hero-3d-face--right" />
        </div>
        <div className="hero-3d-object__wire hero-3d-object__wire--one" />
        <div className="hero-3d-object__wire hero-3d-object__wire--two" />
      </div>
      <div className="hero-3d-label hero-3d-label--one"><b>01</b><span>Interactive 3D</span></div>
      <div className="hero-3d-label hero-3d-label--two"><b>02</b><span>AR Ready</span></div>
      <div className="hero-3d-scroll" aria-hidden="true"><span /> SCROLL</div>
    </div>
  );
}

export default function Home() {
  const {
    sellers,
    products,
    settings,
    loading,
  } = useData();

  const platformName =
    settings?.platformName ?? "3Dmarketiran";

  useSeo({
    title: platformName,
    description:
      "فروشگاه‌های مختلف را مشاهده کنید، وارد فروشگاه شوید و محصولات سه‌بعدی و واقعیت افزوده آن را ببینید.",
  });

  const featuredSellers = sellers.slice(0, 8);

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
              <StoreIcon />
              AR + 3D + فروشگاه‌های معتبر
            </div>

            <h1>
              فروشگاه موردنظر خود را پیدا کنید،
              <br />
              محصولات را سه‌بعدی ببینید
            </h1>

            <p>
              {platformName} بستری برای معرفی فروشگاه‌ها
              و محصولات آن‌ها با نمایش سه‌بعدی تعاملی و
              واقعیت افزوده است. وارد فروشگاه شوید،
              محصولات آن را بررسی کنید و در صورت تمایل
              مستقیماً با فروشنده تماس بگیرید.
            </p>

            <div className="hero__cta">
              <Link
                to="/products"
                className="btn btn-primary"
              >
                مشاهده فروشگاه‌ها
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
                ✓ فروشگاه‌های اختصاصی
              </span>

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

          {/* HERO VISUAL — abstract interactive 3D scene; intentionally not a catalog product */}
          <div className="hero__visual hero-showcase">
            <Hero3DScene />
          </div>
        </div>
      </section>

      {/* STORES */}
      <section className="section">
        <div className="container">
          <div
            className="section-head"
            style={{
              alignItems: "flex-end",
            }}
          >
            <div>
              <h2>فروشگاه‌ها</h2>

              <p>
                فروشگاه‌های فعال را ببینید و وارد فضای
                اختصاصی هر فروشنده شوید.
              </p>
            </div>

            <Link
              to="/products"
              className="btn btn-outline btn-sm"
            >
              مشاهده همه فروشگاه‌ها
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
                      aspectRatio: "1 / .82",
                      borderRadius: 18,
                    }}
                  />
                )
              )}
            </div>
          ) : featuredSellers.length === 0 ? (
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
                🏪
              </div>

              <p
                style={{
                  margin: 0,
                }}
              >
                هنوز فروشگاه فعالی ثبت نشده است.
              </p>
            </div>
          ) : (
            <div className="grid grid-4">
              {featuredSellers.map((seller) => (
                <Link
                  key={seller.slug}
                  to={`/sellers/${seller.slug}`}
                  className="card featured-store-card"
                  style={{
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    minWidth: 0,
                    textDecoration: "none",
                    height: "100%",
                  }}
                >
                  <div
                    className="featured-store-logo-wrap"
                    style={{
                      width: "100%",
                      aspectRatio: "1.65 / 1",
                      borderRadius: 16,
                      overflow: "hidden",
                      display: "grid",
                      placeItems: "center",
                      background: "#fff",
                      marginBottom: 14,
                      ["--seller-logo-theme" as string]: seller.themeColor || "#eef2f6",
                    }}
                  >
                    {getSellerLogoUrl(seller.logoUrl) ? (
                      <img
                        src={getSellerLogoUrl(seller.logoUrl) || undefined}
                        alt={seller.storeName}
                        loading={seller === featuredSellers[0] || seller === featuredSellers[1] ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={seller === featuredSellers[0] ? "high" : "auto"}
                        className="featured-store-logo"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = "grid";
                        }}
                      />
                    ) : null}
                    <div className="seller-logo-fallback" style={{width:92,height:92,borderRadius:24,display:getSellerLogoUrl(seller.logoUrl)?"none":"grid",placeItems:"center",fontSize:24,fontWeight:900,letterSpacing:".03em"}}>{sellerInitials(seller.storeName)}</div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
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
                            marginTop: 3,
                            fontSize: ".82rem",
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
                فروشگاه موردنظر خود را از طریق جستجو یا فهرست فروشگاه‌ها پیدا کنید.
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
