import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../lib/data";
import { useSeo } from "../lib/seo";

export default function Categories() {
  const { categories, products, loading } = useData();
  useSeo({ title: "دسته‌بندی‌ها", description: "مرور محصولات بر اساس دسته‌بندی." });

  const counts = new Map<string, number>();
  for (const p of products) {
    if (p.category) counts.set(p.category.slug, (counts.get(p.category.slug) ?? 0) + 1);
  }

  return (
    <div className="container section">
      <div className="section-head"><h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>دسته‌بندی‌ها</h1></div>
      {loading ? (
        <div className="grid grid-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}</div>
      ) : categories.length === 0 ? (
        <div className="empty-state"><p>هنوز دسته‌بندی‌ای ثبت نشده است.</p></div>
      ) : (
        <div className="grid grid-4">
          {categories.map((c) => (
            <Link key={c.id} to={`/products?category=${c.slug}`} className="card" style={{ padding: "var(--space-3)", textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{c.name}</div>
              <div className="muted" style={{ color: "var(--color-text-muted)", marginTop: 6 }}>{counts.get(c.slug) ?? 0} محصول</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
