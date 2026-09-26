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

function StoreIcon() {
  return (
    <svg
      width="18"
      height="18"
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
    </svg>
  );
}

export default function Categories() {
  const { categories, sellers, loading } = useData();

  useSeo({
    title: "دسته‌بندی‌ها",
    description:
      "دسته‌بندی‌ها را ببینید و فروشگاه‌های مرتبط با هر دسته را پیدا کنید.",
  });

  // Public site must never expose inactive categories.
  // The backend publisher already exports active categories only,
  // but this extra guard keeps the frontend safe if stale public data exists.
  const activeCategories = categories.filter(
    (category) => category.isActive !== false
  );

   const storeCounts = new Map<string, number>();

  for (const seller of sellers) {
    const categorySlug = seller.category?.slug;

    if (!categorySlug) {
      continue;
    }

    storeCounts.set(
      categorySlug,
      (storeCounts.get(categorySlug) ?? 0) + 1
    );
  }

 return (
    <section className="section categories-page">
      <div className="container">
        <div
          style={{
            marginBottom: 28,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div>
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
              <CategoryIcon />
              دسته‌بندی فروشگاه‌ها
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
              دسته‌بندی‌ها
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
              دسته‌بندی موردنظر خود را انتخاب کنید و فروشگاه‌های مرتبط با
              آن را پیدا کنید.
            </p>
          </div>

          {!loading && activeCategories.length > 0 && (
            <div
              style={{
                padding: "9px 13px",
                borderRadius: 11,
                background: "var(--surface-2, #f5f5f5)",
                color: "var(--text-muted, #666)",
                fontSize: 13,
                fontWeight: 750,
              }}
            >
              {activeCategories.length} دسته‌بندی فعال
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
                  height: 180,
                  borderRadius: 18,
                }}
              />
            ))}
          </div>
        ) : activeCategories.length === 0 ? (
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
                lineHeight: 1.8,
              }}
            >
              دسته‌بندی‌های فعال پس از ایجاد در این بخش نمایش داده می‌شوند.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-4"
            style={{
              gap: 16,
            }}
          >
            {activeCategories.map((category) => {
              const storeCount =
                storeCounts.get(category.slug) ?? 0;

              return (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(
                    category.slug
                  )}`}
                  className="card"
                  style={{
                    position: "relative",
                    minHeight: 180,
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: 18,
                    textDecoration: "none",
                    overflow: "hidden",
                    transition:
                      "transform .2s ease, box-shadow .2s ease, border-color .2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 14,
                        background: "var(--surface-2, #f4f4f4)",
                        color: "var(--color-primary, currentColor)",
                      }}
                    >
                      <CategoryIcon />
                    </div>

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 9px",
                        borderRadius: 999,
                        background: "var(--surface-2, #f5f5f5)",
                        color: "var(--text-muted, #777)",
                        fontSize: 11,
                        fontWeight: 750,
                      }}
                    >
                      <StoreIcon />
                      فروشگاه‌ها
                    </span>
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
                          fontWeight: 850,
                          fontSize: "1.05rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {category.name}
                      </div>

                      <div
                        style={{
                          marginTop: 6,
                          color: "var(--color-text-muted, #777)",
                          fontSize: 13,
                        }}
                      >
                        {storeCount} فروشگاه مرتبط
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      style={{
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 10,
                        background: "var(--surface-2, #f5f5f5)",
                        color: "var(--color-text-muted, #666)",
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

        {!loading && activeCategories.length > 0 && (
          <div
            style={{
              marginTop: 24,
              padding: "15px 17px",
              borderRadius: 14,
              background: "var(--surface-2, #f7f7f7)",
              color: "var(--text-muted, #777)",
              fontSize: 13,
              lineHeight: 1.9,
              textAlign: "center",
            }}
          >
            با انتخاب هر دسته، فروشگاه‌های مرتبط با آن را بررسی کنید و سپس
            برای مشاهده محصولات وارد فروشگاه شوید.
          </div>
        )}
      </div>
    </section>
  );
}
