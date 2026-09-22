import React, { useEffect, useState } from "react";
import { useData } from "../lib/data";
import { useSeo } from "../lib/seo";

type Plan = {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  discountPct?: number | null;
  productLimit?: number | null;
  storageLimitMb?: number | null;
};

const API_URL =
  "https://threedmarketiran-backend.onrender.com";

const ADMIN_URL =
  "https://3dmarketiran.github.io/frontend-admin/#/login";

const SUPPORT_PHONE = "09144142898";

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

export default function Plans() {
  const { settings } = useData();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const phone =
    settings?.contactPhone || SUPPORT_PHONE;

  useSeo({
    title: "اشتراک فروشندگان",
    description:
      "پلن‌های اشتراک فروشندگان برای ساخت ویترین سه‌بعدی و واقعیت افزوده.",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/subscriptions/plans`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("plans");
        }

        return response.json();
      })
      .then((data) => {
        setPlans(
          Array.isArray(data.plans)
            ? data.plans
            : []
        );
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container section">

      {/* HEADER */}

      <div
        className="section-head"
        style={{
          alignItems: "flex-end",
          gap: 20,
        }}
      >

        <div>

          <h1
            style={{
              marginBottom: 8,
            }}
          >
            اشتراک فروشندگان
          </h1>

          <p>
            ویترین اختصاصی، محصولات سه‌بعدی
            و تجربه واقعیت افزوده برای فروشگاه
            شما.
          </p>

        </div>

        <a
          href={ADMIN_URL}
          className="btn btn-primary"
        >
          ورود / ثبت‌نام فروشنده
        </a>

      </div>

      {/* SUPPORT */}

      <div
        className="card"
        style={{
          marginBottom: 24,
          padding: 20,
          background:
            "linear-gradient(135deg, rgba(99,91,255,.08), rgba(34,211,238,.08))",
        }}
      >

        <strong>
          فعال‌سازی اشتراک از طریق پشتیبانی
        </strong>

        <p
          style={{
            margin: "8px 0 14px",
            color: "var(--color-text-muted)",
          }}
        >
          در حال حاضر پرداخت آنلاین نداریم.
          برای فعال‌سازی یا تمدید هر پلن
          با پشتیبانی تماس بگیرید.
        </p>

        <a
          className="btn btn-primary btn-sm"
          href={`tel:${phone}`}
        >
          📞 تماس با {phone}
        </a>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="grid grid-3">

          {Array.from({ length: 5 }).map(
            (_, index) => (
              <div
                key={index}
                className="skeleton"
                style={{
                  height: 310,
                }}
              />
            )
          )}

        </div>

      ) : error ? (

        /* ERROR */

        <div className="empty-state">

          <div
            className="icon"
            aria-hidden
          >
            ⚠️
          </div>

          <p>
            دریافت پلن‌ها موقتاً با مشکل
            روبه‌رو شد.
          </p>

          <a
            href={`tel:${phone}`}
            className="btn btn-primary btn-sm"
          >
            تماس با پشتیبانی
          </a>

        </div>

      ) : plans.length === 0 ? (

        /* EMPTY */

        <div className="empty-state">

          <div
            className="icon"
            aria-hidden
          >
            💳
          </div>

          <p>
            در حال حاضر پلن فعالی ثبت نشده است.
          </p>

        </div>

      ) : (

        /* PLANS */

        <div className="grid grid-3">

          {plans.map(
            (plan, index) => (

              <article
                key={plan.id}
                className="card"
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                }}
              >

                {index ===
                  plans.length - 1 && (

                  <span
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      padding: "5px 9px",
                      borderRadius: 999,
                      background:
                        "rgba(99,91,255,.12)",
                      color:
                        "var(--color-primary)",
                      fontSize: ".75rem",
                      fontWeight: 800,
                    }}
                  >
                    بلندمدت
                  </span>

                )}

                <div
                  style={{
                    color:
                      "var(--color-primary)",
                    fontWeight: 800,
                    marginBottom: 8,
                  }}
                >
                  {durationLabel(
                    plan.durationDays
                  )}
                </div>

                <h2
                  style={{
                    margin: "0 0 12px",
                  }}
                >
                  {plan.name}
                </h2>

                <div
                  style={{
                    fontSize: "1.65rem",
                    fontWeight: 900,
                    marginBottom: 20,
                  }}
                >
                  {formatPrice(plan.price)}
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    color:
                      "var(--color-text-muted)",
                    flex: 1,
                  }}
                >

                  {plan.productLimit && (
                    <div>
                      ✓ تا {plan.productLimit} محصول
                    </div>
                  )}

                  {plan.storageLimitMb && (
                    <div>
                      ✓ فضای{" "}
                      {storageLabel(
                        plan.storageLimitMb
                      )}
                    </div>
                  )}

                  {plan.discountPct ? (
                    <div>
                      ✓ تخفیف{" "}
                      {plan.discountPct}٪
                    </div>
                  ) : null}

                  <div>
                    ✓ نمایش سه‌بعدی و AR
                  </div>

                  <div>
                    ✓ فعال‌سازی دستی توسط
                    پشتیبانی
                  </div>

                </div>

                <a
                  href={`tel:${phone}`}
                  className="btn btn-primary"
                  style={{
                    marginTop: 22,
                  }}
                >
                  درخواست فعال‌سازی
                </a>

              </article>

            )
          )}

        </div>

      )}

    </div>
  );
}
