import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useData } from "../lib/data";
import { useSeo } from "../lib/seo";
import { track } from "../lib/analytics";

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M21 21l-4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 10l2-6h14l2 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M3 10c.5 1.3 1.5 2 3 2s2.5-.7 3-2c.5 1.3 1.5 2 3 2s2.5-.7 3-2c.5 1.3 1.5 2 3 2s2.5-.7 3-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 20v-5h6v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Products() {
  const { sellers, loading } = useData();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  useSeo({
    title: "فروشگاه‌ها",
    description:
      "فروشگاه‌های فعال را پیدا کنید و برای مشاهده محصولات وارد فروشگاه موردنظر شوید.",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQuery = params.get("q") ?? "";

      if (query === currentQuery) return;

      const next = new URLSearchParams(params);

      if (query.trim()) {
        next.set("q", query.trim());
      } else {
        next.delete("q");
      }

      setParams(next, { replace: true });

      if (query.trim().length > 1) {
        track("SEARCH", {
          metadata: {
            q: query.trim(),
            scope: "stores",
          },
        });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, params, setParams]);

  const filteredSellers = useMemo(() => {
    const q = (params.get("q") ?? "").trim().toLocaleLowerCase("fa");

    if (!q) {
      return sellers;
    }

    return sellers.filter((seller) => {
      const storeName = seller.storeName?.toLocaleLowerCase("fa") ?? "";
      const slug = seller.slug?.toLocaleLowerCase("fa") ?? "";

      return (
        storeName.includes(q) ||
        slug.includes(q)
      );
    });
  }, [sellers, params]);

  function clearSearch() {
    setQuery("");

    const next = new URLSearchParams(params);
    next.delete("q");

    setParams(next, { replace: true });
  }

  const hasSearch = Boolean(query.trim());

  return (
    <section className="section products-page">
      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 10,
                  padding: "7px 11px",
                  borderRadius: 999,
                  background: "var(--surface-2, #f5f5f5)",
                  color: "var(--text-muted, #666)",
                  fontSize: 13,
                  fontWeight: 750,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "currentColor",
                  }}
                />
                بازار فروشگاه‌ها
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                  lineHeight: 1.2,
                  fontWeight: 900,
                  letterSpacing: "-0.025em",
                }}
              >
                فروشگاه‌ها
              </h1>

              <p
                style={{
                  margin: "9px 0 0",
                  maxWidth: 620,
                  color: "var(--text-muted, #777)",
                  fontSize: 14,
                  lineHeight: 1.9,
                }}
              >
                فروشگاه موردنظر خود را پیدا کنید و برای مشاهده محصولات،
                اطلاعات و مدل‌های سه‌بعدی وارد فروشگاه شوید.
              </p>
            </div>

            <div
              className="search-box"
              style={{
                width: "100%",
                maxWidth: 400,
                position: "relative",
              }}
            >
              <SearchIcon />

              <input
                type="search"
                placeholder="جستجوی نام فروشگاه..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="جستجوی فروشگاه"
                style={{
                  paddingLeft: query ? 42 : 16,
                  paddingRight: 44,
                }}
              />

              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="پاک کردن جستجو"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 30,
                    height: 30,
                    border: 0,
                    borderRadius: 8,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    background: "var(--surface-2, #f3f3f3)",
                    color: "var(--text-muted, #666)",
                  }}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              padding: "14px 16px",
              borderRadius: 14,
              border: "1px solid var(--border, #e8e8e8)",
              background: "var(--surface, #fff)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                color: "var(--text-muted, #777)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <StoreIcon />

              <span>
                {loading
                  ? "در حال بارگذاری فروشگاه‌ها..."
                  : hasSearch
                    ? `${filteredSellers.length} فروشگاه پیدا شد`
                    : `${filteredSellers.length} فروشگاه فعال`}
              </span>
            </div>

            {hasSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="btn btn-outline btn-sm"
                style={{
                  minHeight: 36,
                  whiteSpace: "nowrap",
                }}
              >
                حذف جستجو
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(230px, 1fr))",
              gap: 18,
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="skeleton"
                style={{
                  minHeight: 270,
                  borderRadius: 20,
                }}
              />
            ))}
          </div>
        ) : filteredSellers.length === 0 ? (
          <div
            className="empty-state"
            style={{
              minHeight: 320,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: 32,
            }}
          >
            <div
              className="icon"
              aria-hidden="true"
              style={{
                width: 64,
                height: 64,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 18,
                marginBottom: 16,
                background: "var(--surface-2, #f4f4f4)",
                color: "var(--text-muted, #777)",
              }}
            >
              <SearchIcon />
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "1.15rem",
                fontWeight: 850,
              }}
            >
              فروشگاهی پیدا نشد
            </h2>

            <p
              style={{
                margin: "0 0 20px",
                maxWidth: 430,
                color: "var(--text-muted, #777)",
                fontSize: 14,
                lineHeight: 1.9,
              }}
            >
              نام فروشگاه را بررسی کنید یا عبارت جستجو را تغییر دهید.
            </p>

            {hasSearch && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={clearSearch}
              >
                نمایش همه فروشگاه‌ها
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(230px, 1fr))",
              gap: 18,
            }}
          >
            {filteredSellers.map((seller) => {
              const logoUrl =
                "logoUrl" in seller && seller.logoUrl
                  ? seller.logoUrl
                  : "";

              const storeName =
                seller.storeName || "فروشگاه بدون نام";

              return (
                <Link
                  key={seller.id ?? seller.slug}
                  to={`/sellers/${seller.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 270,
                    overflow: "hidden",
                    textDecoration: "none",
                    color: "inherit",
                    borderRadius: 20,
                    border:
                      "1px solid var(--border, #e8e8e8)",
                    background:
                      "var(--surface, #fff)",
                    transition:
                      "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform =
                      "translateY(-3px)";
                    event.currentTarget.style.boxShadow =
                      "0 14px 34px rgba(0,0,0,.08)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform =
                      "translateY(0)";
                    event.currentTarget.style.boxShadow =
                      "none";
                  }}
                >
                  <div
                    style={{
                      minHeight: 175,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 28,
                      background:
                        "var(--surface-2, #f7f7f7)",
                    }}
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={storeName}
                        loading="lazy"
                        style={{
                          width: 108,
                          height: 108,
                          objectFit: "contain",
                          borderRadius: 22,
                          background:
                            "var(--surface, #fff)",
                          border:
                            "1px solid var(--border, #e8e8e8)",
                          padding: 12,
                        }}
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";

                          const fallback =
                            event.currentTarget
                              .nextElementSibling as HTMLElement | null;

                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      aria-hidden="true"
                      style={{
                        width: 108,
                        height: 108,
                        display: logoUrl ? "none" : "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 22,
                        background:
                          "var(--surface, #fff)",
                        border:
                          "1px solid var(--border, #e8e8e8)",
                        color:
                          "var(--text-muted, #777)",
                      }}
                    >
                      <StoreIcon />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      gap: 12,
                      padding: "17px 18px 18px",
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <h2
                        style={{
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "1.05rem",
                          fontWeight: 850,
                        }}
                      >
                        {storeName}
                      </h2>

                      <p
                        style={{
                          margin: "6px 0 0",
                          color:
                            "var(--text-muted, #777)",
                          fontSize: 12,
                          direction: "ltr",
                          textAlign: "right",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        /{seller.slug}
                      </p>
                    </div>

                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        color: "var(--text-muted, #777)",
                        fontSize: 13,
                        fontWeight: 750,
                      }}
                    >
                      <span>مشاهده فروشگاه</span>

                      <span
                        style={{
                          width: 34,
                          height: 34,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 10,
                          background:
                            "var(--surface-2, #f3f3f3)",
                        }}
                      >
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
