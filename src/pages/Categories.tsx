import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../lib/data";
import { useSeo } from "../lib/seo";

function CategoryIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="14"
        y="4"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="4"
        y="14"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="14"
        y="14"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
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
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Categories() {
  const { categories, products, loading } = useData();

  useSeo({
    title: "دسته‌بندی‌ها",
    description: "مرور محصولات بر اساس دسته‌بندی.",
  });

  const counts = new Map<string, number>();

  for (const product of products) {
    if (product.category) {
      counts.set(
        product.category.slug,
        (counts.get(product.category.slug) ?? 0) + 1
      );
    }
  }

  return (
    <section className="section categories-page">
      <div className="container">
        <div
          style={{
            marginBottom: 26,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 9,
                padding: "6px 10px",
                borderRadius: 999,
                background: "var(--surface-2, #f5f5f5)",
                color: "var(--text-muted, #666)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <CategoryIcon />
              دسته‌بندی محصولات
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(1.7rem, 4vw, 2.2rem)",
                lineHeight: 1.25,
                fontWeight: 850,
                letterSpacing: "-0.02em",
              }}
            >
              دسته‌بندی‌ها
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "var(--text-muted, #777)",
                fontSize: 14,
              }}
            >
              محصولات را بر اساس دسته‌بندی پیدا کنید.
            </p>
          </div>

          {!loading && categories.length > 0 && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                background: "var(--surface-2, #f5f5f5)",
                color: "var(--text-muted, #666)",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {categories.length} دسته‌بندی
            </div>
          )}
        </div>

        {loading ? (
          <div
            className="grid grid-4"
            style={{
              gap: 16,
            }}
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="skeleton"
                style={{
                  height: 150,
                  borderRadius: 18,
                }}
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div
            className="empty-state"
            style={{
              minHeight: 300,
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
              style={{
                width: 60,
                height: 60,
                display: "grid",
                placeItems: "center",
                borderRadius: 18,
                marginBottom: 14,
              }}
            >
              <CategoryIcon />
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              هنوز دسته‌بندی‌ای ثبت نشده است
            </h2>

            <p
              style={{
                margin: 0,
                color: "var(--text-muted, #777)",
                fontSize: 14,
              }}
            >
              بعد از ایجاد دسته‌بندی، محصولات اینجا نمایش داده
              می‌شوند.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-4"
            style={{
              gap: 16,
            }}
          >
            {categories.map((category) => {
              const productCount =
                counts.get(category.slug) ?? 0;

              return (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(
                    category.slug
                  )}`}
                  className="card"
                  style={{
                    position: "relative",
                    minHeight: 150,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 18,
                    textDecoration: "none",
                    overflow: "hidden",
                    transition:
                      "transform .2s ease, box-shadow .2s ease",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 14,
                      background:
                        "var(--surface-2, #f4f4f4)",
                      color: "var(--color-primary, currentColor)",
                    }}
                  >
                    <CategoryIcon />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: "1.05rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {category.name}
                      </div>

                      <div
                        style={{
                          marginTop: 5,
                          color: "var(--color-text-muted, #777)",
                          fontSize: 13,
                        }}
                      >
                        {productCount} محصول
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      style={{
                        width: 34,
                        height: 34,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 10,
                        background:
                          "var(--surface-2, #f5f5f5)",
                        color:
                          "var(--color-text-muted, #666)",
                      }}
                    >
                      <ArrowIcon />
                    </span>
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
