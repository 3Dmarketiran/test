import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";
import { track } from "../lib/analytics";

type SortKey = "newest" | "popular" | "alpha";

export default function Products() {
  const { products, categories, sellers, loading } = useData();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  useSeo({ title: "همه محصولات", description: "مرور و فیلتر همه محصولات منتشرشده." });

  const activeCategory = params.get("category") ?? "";
  const activeSeller = params.get("seller") ?? "";
  const sort = (params.get("sort") as SortKey) || "newest";

  // Debounced search -> URL param (spec section 19).
  React.useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (query) next.set("q", query);
      else next.delete("q");
      setParams(next, { replace: true });
      if (query.trim().length > 1) track("SEARCH", { metadata: { q: query } });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filtered = useMemo(() => {
    let list = products;
    const q = (params.get("q") ?? "").trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeCategory) list = list.filter((p) => p.category?.slug === activeCategory);
    if (activeSeller) list = list.filter((p) => p.seller.slug === activeSeller);

    list = [...list];
    if (sort === "alpha") list.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    else if (sort === "newest") list.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
    // "popular" would use analytics view counts server-side; without that
    // data in the static snapshot we fall back to newest-first.
    return list;
  }, [products, params, activeCategory, activeSeller, sort]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>همه محصولات</h1>
            <p>{filtered.length} محصول یافت شد</p>
          </div>
          <div className="search-box" style={{ maxWidth: 320, width: "100%" }}>
            <input
              type="search"
              placeholder="جستجوی محصول..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="جستجوی محصول"
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <div className="pill-row" style={{ marginBottom: "var(--space-2)" }}>
          <button className={`pill${!activeCategory ? " active" : ""}`} onClick={() => setParam("category", "")}>همه دسته‌ها</button>
          {categories.map((c) => (
            <button key={c.id} className={`pill${activeCategory === c.slug ? " active" : ""}`} onClick={() => setParam("category", c.slug)}>
              {c.name}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "var(--space-3)" }}>
          <select value={activeSeller} onChange={(e) => setParam("seller", e.target.value)} className="btn btn-outline btn-sm" style={{ cursor: "pointer" }}>
            <option value="">همه فروشندگان</option>
            {sellers.map((s) => (
              <option key={s.slug} value={s.slug}>{s.storeName}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setParam("sort", e.target.value)} className="btn btn-outline btn-sm" style={{ cursor: "pointer" }}>
            <option value="newest">جدیدترین</option>
            <option value="popular">محبوب‌ترین</option>
            <option value="alpha">الفبایی</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ aspectRatio: "3/4" }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon" aria-hidden>🔍</div>
            <p>محصولی با این فیلترها پیدا نشد.</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
