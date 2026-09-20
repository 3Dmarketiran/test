import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";

export default function Home() {
  const { products, sellers, categories, settings, loading } = useData();
  const platformName = settings?.platformName ?? "پلتفرم نمایشگاه محصول";

  useSeo({
    title: platformName,
    description: "مرور محصولات با نمایش سه‌بعدی و واقعیت افزوده، و تماس مستقیم با فروشنده.",
  });

  const featured = products.slice(0, 8);
  const featuredSellers = sellers.slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <h1>محصولات را پیش از خرید، در فضای واقعی خودتان ببینید</h1>
            <p>
              {platformName} محصولات فروشندگان مختلف را با نمایش سه‌بعدی تعاملی و واقعیت افزوده (AR)
              در اختیار شما قرار می‌دهد — با مقیاس واقعی، مستقیم از داخل مرورگر شما.
            </p>
            <div className="hero__cta">
              <Link to="/products" className="btn btn-primary">مشاهده محصولات</Link>
              <Link to="/about" className="btn btn-outline">چگونه کار می‌کند؟</Link>
            </div>
          </div>
          <div className="hero__visual">
            {featured[0]?.images[0] ? (
              <img src={featured[0].images[0].url} alt={featured[0].name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div className="skeleton" style={{ width: "100%", height: "100%" }} />
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>محصولات ویژه</h2>
              <p>جدیدترین محصولات منتشرشده روی پلتفرم</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">مشاهده همه</Link>
          </div>

          {loading ? (
            <div className="grid grid-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ aspectRatio: "3/4" }} />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <div className="icon" aria-hidden>📦</div>
              <p>هنوز محصولی منتشر نشده است.</p>
            </div>
          ) : (
            <div className="grid grid-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <h2>دسته‌بندی‌ها</h2>
            </div>
            <div className="pill-row">
              {categories.map((c) => (
                <Link key={c.id} to={`/products?category=${c.slug}`} className="pill">{c.name}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredSellers.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>فروشندگان</h2>
            </div>
            <div className="grid grid-3">
              {featuredSellers.map((s) => (
                <Link key={s.slug} to={`/sellers/${s.slug}`} className="card" style={{ padding: "var(--space-2)", display: "flex", alignItems: "center", gap: 12 }}>
                  <img src={s.logoUrl ?? undefined} alt={s.storeName} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", background: "var(--color-background)" }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{s.storeName}</div>
                    {s.description && <div className="muted" style={{ fontSize: ".85rem", color: "var(--color-text-muted)" }}>{s.description.slice(0, 60)}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>نمایش سه‌بعدی و واقعیت افزوده چگونه کار می‌کند؟</h2>
          </div>
          <div className="steps">
            <div className="step"><div className="num">۱</div><strong>مرور محصول</strong><p className="muted">محصول موردنظر را در فهرست یا جستجو پیدا کنید.</p></div>
            <div className="step"><div className="num">۲</div><strong>مشاهده سه‌بعدی</strong><p className="muted">مدل را بچرخانید، بزرگ‌نمایی کنید و از هر زاویه ببینید.</p></div>
            <div className="step"><div className="num">۳</div><strong>واقعیت افزوده</strong><p className="muted">با دوربین گوشی، محصول را با اندازه واقعی در فضای خودتان قرار دهید.</p></div>
            <div className="step"><div className="num">۴</div><strong>تماس با فروشنده</strong><p className="muted">در صورت تمایل، مستقیماً با فروشنده محصول در تماس باشید.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
