import React from "react";
import { useData } from "../lib/data";
import { useSeo } from "../lib/seo";
import { ADMIN_URL, SUPPORT_PHONE, API_URL } from "../lib/config";

type Plan = {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  discountPct?: number | null;
  productLimit?: number | null;
  storageLimitMb?: number | null;
  trafficLimitGb?: number | null;
  categoryId?: string | null;
  sortOrder?: number;
  isPublic?: boolean;
  features?: Record<string, unknown> | null;
};

function formatPrice(value: number) {
  return (
    new Intl.NumberFormat("fa-IR").format(value) +
    " تومان"
  );
}

function durationLabel(days: number) {
  if (days === 30) return "ماهانه";
  if (days === 90) return "۳ ماهه";
  if (days === 180) return "۶ ماهه";
  if (days === 365) return "۱ ساله";
  if (days === 1095) return "۳ ساله";

  return `${days} روزه`;
}

function storageLabel(mb: number) {
  if (mb >= 1024) {
    const gb = mb / 1024;

    return Number.isInteger(gb)
      ? `${gb} GB`
      : `${gb.toFixed(1)} GB`;
  }

  return `${mb} MB`;
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 22,
        height: 22,
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        borderRadius: "50%",
        background:
          "rgba(34, 197, 94, 0.12)",
        color: "#16a34a",
        fontSize: 13,
        fontWeight: 900,
      }}
    >
      ✓
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 3.5 5 4.8c-.8.4-1.1 1.3-.8 2.2 1.8 5.7 6.3 10.2 12 12 .9.3 1.8 0 2.2-.8l1.3-2.5-3.4-2.1-1.7 1.7c-2.2-.9-4.4-3.1-5.3-5.3L11 8.3 8.9 4.9 7.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
        d="M5 12h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Plans() {
  const { settings, plans: catalogPlans, planCategories: catalogCategories, loading: catalogLoading, error: catalogError } = useData();
  const [trafficBundles, setTrafficBundles] = React.useState<Array<{id:string;name:string;gigabytes:number;priceToman:number}>>([]);
  React.useEffect(() => { const controller = new AbortController(); fetch(`${API_URL}/api/traffic/bundles`, { signal: controller.signal, headers: { Accept: "application/json" } }).then(r => r.ok ? r.json() : Promise.reject(new Error("traffic fetch failed"))).then(data => setTrafficBundles(Array.isArray(data.bundles) ? data.bundles : [])).catch(() => setTrafficBundles([])); return () => controller.abort(); }, []);

  const plans = catalogPlans as Plan[];
  const baseCategories = catalogCategories || [];
  const hasUncategorized = plans.some((plan) => !plan.categoryId);
  const categories = baseCategories.length > 0
    ? [...baseCategories, ...(hasUncategorized ? [{ id: "__uncategorized", name: "سایر پلن‌ها", slug: "uncategorized", description: "پلن‌هایی که هنوز دسته‌بندی نشده‌اند", sortOrder: 999, isActive: true }] : [])]
    : (plans.length > 0 ? [{ id: "general", name: "پلن‌های فروشندگان", slug: "general", description: "پلن‌های فعلی فروشندگان", sortOrder: 0, isActive: true }] : []);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string>(categories[0]?.id || "");

  React.useEffect(() => {
    if (!selectedCategoryId && categories[0]?.id) setSelectedCategoryId(categories[0].id);
    if (selectedCategoryId && !categories.some((category) => category.id === selectedCategoryId)) setSelectedCategoryId(categories[0]?.id || "");
  }, [categories, selectedCategoryId]);
  const loading = catalogLoading;
  const error = Boolean(catalogError);

  const phone =
    settings?.contactPhone || SUPPORT_PHONE;

  const platformName =
    settings?.platformName || "3D Market";

  useSeo({
    title: "اشتراک فروشندگان",
    description:
      "پلن‌های اشتراک فروشندگان برای ساخت ویترین سه‌بعدی و واقعیت افزوده.",
  });



  return (
    <main className="container section">
      {/* HERO */}
      <section
        style={{
          maxWidth: 820,
          margin: "0 auto 30px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 12px",
            marginBottom: 14,
            borderRadius: 999,
            background:
              "var(--surface-2, rgba(0,0,0,.04))",
            color:
              "var(--color-primary)",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          پلن‌های فروشندگان
        </div>

        <h1
          style={{
            margin: "0 0 12px",
            fontSize:
              "clamp(1.8rem, 5vw, 2.7rem)",
            lineHeight: 1.3,
            fontWeight: 900,
          }}
        >
          ویترین سه‌بعدی فروشگاهت را بساز
        </h1>

        <p
          style={{
            maxWidth: 650,
            margin: "0 auto",
            color:
              "var(--color-text-muted, #777)",
            lineHeight: 2,
            fontSize: 14,
          }}
        >
          با انتخاب یک پلن، محصولات فروشگاهت
          را در {platformName} معرفی کن و امکان
          مشاهده سه‌بعدی و واقعیت افزوده را در
          اختیار مشتریان قرار بده.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 22,
          }}
        >
          <a
            href={ADMIN_URL}
            className="btn btn-primary"
            style={{
              minHeight: 44,
              padding: "0 20px",
            }}
          >
            ورود / ثبت‌نام فروشنده
          </a>

          <a
            href={`tel:${phone}`}
            className="btn"
            style={{
              minHeight: 44,
              padding: "0 18px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <PhoneIcon />
            تماس با پشتیبانی
          </a>
        </div>
      </section>

      {/* SUPPORT NOTICE */}
      <section
        className="card"
        style={{
          maxWidth: 1000,
          margin: "0 auto 28px",
          padding:
            "clamp(18px, 4vw, 24px)",
          background:
            "linear-gradient(135deg, rgba(99,91,255,.08), rgba(34,211,238,.07))",
          border:
            "1px solid rgba(99,91,255,.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 13,
              background:
                "rgba(99,91,255,.12)",
              color:
                "var(--color-primary)",
            }}
          >
            <PhoneIcon />
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 220,
            }}
          >
            <strong
              style={{
                display: "block",
                marginBottom: 5,
              }}
            >
              فعال‌سازی اشتراک از طریق پشتیبانی
            </strong>

            <p
              style={{
                margin: 0,
                color:
                  "var(--color-text-muted, #777)",
                fontSize: 13,
                lineHeight: 1.9,
              }}
            >
              در حال حاضر پرداخت آنلاین نداریم.
              برای فعال‌سازی یا تمدید پلن موردنظر
              با پشتیبانی تماس بگیرید.
            </p>
          </div>

          <a
            href={`tel:${phone}`}
            className="btn btn-primary btn-sm"
            style={{
              whiteSpace: "nowrap",
            }}
          >
            تماس با {phone}
          </a>
        </div>
      </section>

      {/* LOADING */}
      {loading ? (
        <div
          className="grid grid-3"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: 24,
                  minHeight: 390,
                }}
              >
                <div
                  className="skeleton"
                  style={{
                    width: 90,
                    height: 16,
                    marginBottom: 18,
                  }}
                />

                <div
                  className="skeleton"
                  style={{
                    width: "65%",
                    height: 28,
                    marginBottom: 18,
                  }}
                />

                <div
                  className="skeleton"
                  style={{
                    width: "80%",
                    height: 38,
                    marginBottom: 26,
                  }}
                />

                <div
                  style={{
                    display: "grid",
                    gap: 12,
                  }}
                >
                  {Array.from({
                    length: 4,
                  }).map((__, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="skeleton"
                      style={{
                        width:
                          itemIndex % 2 === 0
                            ? "85%"
                            : "70%",
                        height: 15,
                      }}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : error ? (
        <div
          className="empty-state"
          style={{
            maxWidth: 650,
            margin: "0 auto",
            padding: 36,
          }}
        >
          <div
            className="icon"
            aria-hidden="true"
          >
            ⚠️
          </div>

          <h2
            style={{
              margin: "12px 0 8px",
            }}
          >
            دریافت پلن‌ها انجام نشد
          </h2>

          <p>
            در حال حاضر امکان دریافت اطلاعات
            اشتراک‌ها وجود ندارد. برای دریافت
            اطلاعات می‌توانید با پشتیبانی تماس
            بگیرید.
          </p>

          <a
            href={`tel:${phone}`}
            className="btn btn-primary btn-sm"
          >
            تماس با پشتیبانی
          </a>
        </div>
      ) : plans.length === 0 ? (
        <div
          className="empty-state"
          style={{
            maxWidth: 650,
            margin: "0 auto",
            padding: 36,
          }}
        >
          <div
            className="icon"
            aria-hidden="true"
          >
            💳
          </div>

          <h2
            style={{
              margin: "12px 0 8px",
            }}
          >
            هنوز پلنی ثبت نشده است
          </h2>

          <p>
            در حال حاضر پلن فعالی برای فروشندگان
            وجود ندارد.
          </p>
        </div>
      ) : (
        <>
          {/* PLAN CATEGORIES + PLANS */}
          {categories.length > 0 && (
            <section style={{ maxWidth: 1100, margin: "0 auto 24px" }}>
              <div
                role="tablist"
                aria-label="دسته‌بندی پلن‌ها"
                style={{
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                  padding: 5,
                  marginBottom: 18,
                  borderRadius: 16,
                  background: "var(--surface-2, #f5f6fa)",
                  scrollbarWidth: "none",
                }}
              >
                {categories.map((category) => {
                  const active = category.id === selectedCategoryId;
                  const count = plans.filter((plan) => category.id === "__uncategorized" ? !plan.categoryId : plan.categoryId === category.id).length;
                  return (
                    <button
                      key={category.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategoryId(category.id)}
                      style={{
                        flex: "0 0 auto",
                        minHeight: 46,
                        padding: "0 16px",
                        borderRadius: 12,
                        border: active ? "1px solid var(--color-primary)" : "1px solid transparent",
                        background: active ? "var(--color-primary)" : "transparent",
                        color: active ? "#fff" : "var(--color-text)",
                        font: "inherit",
                        fontWeight: 850,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {category.name}
                      <span style={{ opacity: .72, marginInlineStart: 6, fontSize: 11 }}>({count})</span>
                    </button>
                  );
                })}
              </div>

              {categories.map((category) => {
                if (category.id !== selectedCategoryId) return null;
                const categoryPlans = plans
                  .filter((plan) => category.id === "__uncategorized" ? !plan.categoryId : (plan.categoryId === category.id || (category.id === "general" && !plan.categoryId)))
                  .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.durationDays - b.durationDays);
                return (
                  <div key={category.id}>
                    <div style={{ marginBottom: 16, textAlign: "center" }}>
                      <h2 style={{ margin: 0, fontSize: "clamp(1.3rem, 4vw, 1.65rem)", fontWeight: 900 }}>{category.name}</h2>
                      {category.description && (
                        <p style={{ margin: "6px auto 0", maxWidth: 650, color: "var(--color-text-muted, #777)", fontSize: 13, lineHeight: 1.9 }}>
                          {category.description}
                        </p>
                      )}
                    </div>

                    {categoryPlans.length === 0 ? (
                      <div className="card" style={{ textAlign: "center", padding: 28, color: "var(--color-text-muted, #777)" }}>
                        هنوز پلنی در این دسته قرار نگرفته است.
                      </div>
                    ) : (
                      <div
                        className="plans-single-column"
                        style={{ maxWidth: 1100, margin: "0 auto", alignItems: "stretch" }}
                      >
                        {categoryPlans.map((plan, index) => {
                          const isLongTerm = plan.durationDays >= 365;
                          const hasDiscount = Boolean(plan.discountPct);
                          return (
                            <article key={plan.id} className="card" style={{ padding: "clamp(20px, 4vw, 26px)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", border: isLongTerm ? "1px solid rgba(99,91,255,.28)" : undefined, boxShadow: isLongTerm ? "0 12px 35px rgba(99,91,255,.09)" : undefined }}>
                              {isLongTerm && <div style={{ position: "absolute", top: 16, left: 16, padding: "5px 10px", borderRadius: 999, background: "rgba(99,91,255,.1)", color: "var(--color-primary)", fontSize: 11, fontWeight: 850 }}>بلندمدت</div>}
                              {hasDiscount && <div style={{ position: "absolute", top: 16, right: 16, padding: "5px 10px", borderRadius: 999, background: "rgba(34,197,94,.1)", color: "#16a34a", fontSize: 11, fontWeight: 850 }}>{plan.discountPct}% تخفیف</div>}
                              <div style={{ width: 48, height: 48, display: "grid", placeItems: "center", marginBottom: 16, borderRadius: 15, background: "var(--surface-2, #f4f4f4)", color: "var(--color-primary)", fontWeight: 900 }}>{index + 1}</div>
                              <div style={{ color: "var(--color-primary)", fontSize: 12, fontWeight: 850, marginBottom: 7 }}>{durationLabel(plan.durationDays)}</div>
                              <h2 style={{ margin: "0 0 14px", fontSize: "1.25rem", lineHeight: 1.5, fontWeight: 850 }}>{plan.name}</h2>
                              <div style={{ marginBottom: 24 }}><div style={{ fontSize: "clamp(1.45rem, 5vw, 1.8rem)", lineHeight: 1.3, fontWeight: 950, letterSpacing: "-0.02em" }}>{formatPrice(plan.price)}</div><div style={{ marginTop: 5, color: "var(--color-text-muted, #777)", fontSize: 11 }}>برای مدت {durationLabel(plan.durationDays)}</div></div>
                              <div style={{ display: "grid", gap: 12, flex: 1 }}>
                                {plan.productLimit ? <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}><CheckIcon /><span>تا {plan.productLimit.toLocaleString("fa-IR")} محصول</span></div> : null}
                                {plan.storageLimitMb ? <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}><CheckIcon /><span>فضای {storageLabel(plan.storageLimitMb)}</span></div> : null}
                                {plan.trafficLimitGb ? <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}><CheckIcon /><span>ترافیک ماهانه {plan.trafficLimitGb} GB</span></div> : null}
                                {hasDiscount ? <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}><CheckIcon /><span>{plan.discountPct}% تخفیف</span></div> : null}
                                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}><CheckIcon /><span>نمایش سه‌بعدی و AR</span></div>
                                <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}><CheckIcon /><span>فعال‌سازی دستی توسط پشتیبانی</span></div>
                              </div>
                              <a href={`tel:${phone}`} className="btn btn-primary" style={{ marginTop: 24, minHeight: 46, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>درخواست فعال‌سازی<ArrowIcon /></a>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          {categories.length === 0 && (
            <section className="plans-single-column" style={{ maxWidth: 1100, margin: "0 auto", alignItems: "stretch" }}>
              {plans.map((plan, index) => (
                <article key={plan.id} className="card" style={{ padding: 24 }}>
                  <strong>{index + 1}. {plan.name}</strong>
                  <div style={{ marginTop: 8, fontWeight: 900 }}>{formatPrice(plan.price)}</div>
                  <div style={{ marginTop: 8, color: "var(--color-text-muted, #777)" }}>{durationLabel(plan.durationDays)}</div>
                  <a href={`tel:${phone}`} className="btn btn-primary" style={{ marginTop: 18 }}>درخواست فعال‌سازی</a>
                </article>
              ))}
            </section>
          )}

          <section style={{ maxWidth: 1100, margin: "38px auto 0" }} aria-labelledby="traffic-bundles-title">
            <div style={{ textAlign: "center", marginBottom: 18 }}><h2 id="traffic-bundles-title" style={{ marginBottom: 6 }}>بسته‌های ترافیک اضافه</h2><p style={{ color: "var(--color-text-muted, #777)", fontSize: 13 }}>برای مصرف بیشتر از ترافیک همراه پلن، بسته جداگانه درخواست کنید.</p></div>
            {trafficBundles.length ? <div className="plans-single-column" style={{ alignItems: "stretch" }}>{trafficBundles.map(bundle => <article className="card" key={bundle.id} style={{ padding: 22, textAlign: "center" }}><h3 style={{ margin: 0 }}>{bundle.name}</h3><div style={{ margin: "12px 0 4px", fontSize: 28, fontWeight: 900 }}>{bundle.gigabytes} GB</div><div style={{ fontWeight: 750 }}>{formatPrice(bundle.priceToman)}</div><a href={`tel:${phone}`} className="btn btn-primary" style={{ marginTop: 16 }}>درخواست خرید</a></article>)}</div> : <p style={{ textAlign: "center", color: "var(--color-text-muted, #777)", fontSize: 13 }}>در حال حاضر بسته ترافیک اضافه‌ای برای نمایش ثبت نشده است.</p>}
          </section>

          {/* FOOTNOTE */}
          <div
            style={{
              maxWidth: 900,
              margin: "28px auto 0",
              textAlign: "center",
              color:
                "var(--color-text-muted, #777)",
              fontSize: 12,
              lineHeight: 2,
            }}
          >
            قیمت و امکانات هر پلن توسط مدیریت
            پلتفرم قابل تنظیم است. برای فعال‌سازی،
            ابتدا حساب فروشنده خود را ایجاد کنید و
            سپس با پشتیبانی تماس بگیرید.
          </div>
        </>
      )}
    </main>
  );
}
