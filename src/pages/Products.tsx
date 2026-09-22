import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";
import { track } from "../lib/analytics";

type SortKey = "newest" | "popular" | "alpha";

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

function FilterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Products() {
  const { products, categories, sellers, loading } = useData();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  useSeo({
    title: "همه محصولات",
    description: "مرور و فیلتر همه محصولات منتشرشده.",
  });

  const activeCategory = params.get("category") ?? "";
  const activeSeller = params.get("seller") ?? "";
  const sort = (params.get("sort") as SortKey) || "newest";

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
          },
        });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query, params, setParams]);

  const filtered = useMemo(() => {
    let list = [...products];

    const q = (params.get("q") ?? "").trim().toLowerCase();

    if (q) {
      list = list.filter((p) => {
        const name = p.name?.toLowerCase() ?? "";
        const description = p.shortDescription?.toLowerCase() ?? "";
        const tags = Array.isArray(p.tags)
          ? p.tags.map((tag) => tag.toLowerCase())
          : [];

        return (
          name.includes(q) ||
          description.includes(q) ||
          tags.some((tag) => tag.includes(q))
        );
      });
    }

    if (activeCategory) {
      list = list.filter(
        (p) => p.category?.slug === activeCategory
      );
    }

    if (activeSeller) {
      list = list.filter(
        (p) => p.seller.slug === activeSeller
      );
    }

    if (sort === "alpha") {
      list.sort((a, b) =>
        a.name.localeCompare(b.name, "fa")
      );
    } else if (sort === "newest") {
      list.sort((a, b) =>
        (b.publishedAt ?? "").localeCompare(
          a.publishedAt ?? ""
        )
      );
    } else {
      // Analytics view counts are not available in the
      // static product snapshot, so popular falls back
      // to newest-first.
      list.sort((a, b) =>
        (b.publishedAt ?? "").localeCompare(
          a.publishedAt ?? ""
        )
      );
    }

    return list;
  }, [
    products,
    params,
    activeCategory,
    activeSeller,
    sort,
  ]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setParams(next, { replace: true });
  }

  function clearFilters() {
    const next = new URLSearchParams();

    if (query.trim()) {
      setQuery("");
    }

    setParams(next, { replace: true });
  }

  const hasFilters =
    Boolean(query.trim()) ||
    Boolean(activeCategory) ||
    Boolean(activeSeller) ||
    sort !== "newest";

  return (
    <section className="section products-page">
      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginBottom: 24,
          }}
        >
          <div
            style={{
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
                  marginBottom: 8,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "var(--surface-2, #f5f5f5)",
                  color: "var(--text-muted, #666)",
                  fontSize: 13,
                  fontWeight: 700,
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
                فروشگاه محصولات
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
                همه محصولات
              </h1>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "var(--text-muted, #777)",
                  fontSize: 14,
                }}
              >
                {loading
                  ? "در حال بارگذاری محصولات..."
                  : `${filtered.length} محصول یافت شد`}
              </p>
            </div>

            <div
              className="search-box"
              style={{
                width: "100%",
                maxWidth: 380,
                position: "relative",
              }}
            >
              <SearchIcon />

              <input
                type="search"
                placeholder="جستجوی محصول، دسته یا ویژگی..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="جستجوی محصول"
                style={{
                  paddingLeft: query ? 42 : 16,
                  paddingRight: 44,
                }}
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
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
                    background:
                      "var(--surface-2, #f3f3f3)",
                    color:
                      "var(--text-muted, #666)",
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
              gap: 8,
              color: "var(--text-muted, #777)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <FilterIcon />
            فیلتر و مرتب‌سازی
          </div>

          <div
            className="pill-row"
            style={{
              margin: 0,
              paddingBottom: 2,
              overflowX: "auto",
              flexWrap: "nowrap",
              scrollbarWidth: "none",
            }}
          >
            <button
              type="button"
              className={`pill${
                !activeCategory ? " active" : ""
              }`}
              onClick={() => setParam("category", "")}
              style={{ flexShrink: 0 }}
            >
              همه دسته‌ها
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`pill${
                  activeCategory === category.slug
                    ? " active"
                    : ""
                }`}
                onClick={() =>
                  setParam("category", category.slug)
                }
                style={{ flexShrink: 0 }}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            <select
              value={activeSeller}
              onChange={(e) =>
                setParam("seller", e.target.value)
              }
              className="btn btn-outline btn-sm"
              aria-label="فیلتر فروشنده"
              style={{
                width: "100%",
                minHeight: 42,
                cursor: "pointer",
                textAlign: "right",
              }}
            >
              <option value="">همه فروشندگان</option>

              {sellers.map((seller) => (
                <option
                  key={seller.slug}
                  value={seller.slug}
                >
                  {seller.storeName}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) =>
                setParam("sort", e.target.value)
              }
              className="btn btn-outline btn-sm"
              aria-label="مرتب‌سازی محصولات"
              style={{
                width: "100%",
                minHeight: 42,
                cursor: "pointer",
                textAlign: "right",
              }}
            >
              <option value="newest">جدیدترین</option>
              <option value="popular">محبوب‌ترین</option>
              <option value="alpha">الفبایی</option>
            </select>

            {hasFilters && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={clearFilters}
                style={{
                  minHeight: 42,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="skeleton"
                style={{
                  aspectRatio: "3 / 4",
                  borderRadius: 16,
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
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
              aria-hidden="true"
              style={{
                width: 58,
                height: 58,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                marginBottom: 14,
                background:
                  "var(--surface-2, #f4f4f4)",
              }}
            >
              <SearchIcon />
            </div>

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "1.1rem",
                fontWeight: 800,
              }}
            >
              محصولی پیدا نشد
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                color: "var(--text-muted, #777)",
                fontSize: 14,
              }}
            >
              با تغییر عبارت جستجو یا حذف فیلترها دوباره
              امتحان کنید.
            </p>

            {hasFilters && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={clearFilters}
              >
                نمایش همه محصولات
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
