import React from "react";
import { useData } from "../lib/data";
import { useSeo } from "../lib/seo";

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

function EyeIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 3.5 5 4.8c-.8.4-1.1 1.3-.8 2.2 1.8 5.7 6.3 10.2 12 12 .9.3 1.8 0 2.2-.8l1.3-2.5-3.4-2.1-1.7 1.7c-2.2-.9-4.4-3.1-5.3-5.3L11 8.3 8.9 4.9 7.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function About() {
  const { settings } = useData();

  const platformName =
    settings?.platformName ?? "پلتفرم نمایشگاه محصول";

  useSeo({
    title: "درباره ما",
    description: `درباره ${platformName}`,
  });

  return (
    <div className="container section">
      {/* Header */}
      <div
        style={{
          maxWidth: 850,
          margin: "0 auto 28px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 16px",
            display: "grid",
            placeItems: "center",
            borderRadius: 20,
            background: "var(--surface-2, #f4f4f4)",
          }}
        >
          <ModelIcon />
        </div>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "clamp(1.7rem, 4vw, 2.3rem)",
            lineHeight: 1.3,
            fontWeight: 850,
          }}
        >
          درباره {platformName}
        </h1>

        <p
          style={{
            maxWidth: 680,
            margin: "0 auto",
            color: "var(--color-text-muted, #777)",
            fontSize: 15,
            lineHeight: 2,
          }}
        >
          تجربه‌ای متفاوت برای مشاهده و بررسی محصولات
          با استفاده از فناوری سه‌بعدی و واقعیت افزوده.
        </p>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gap: 16,
        }}
      >
        <article
          className="card"
          style={{
            padding: "clamp(20px, 4vw, 32px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 14,
                background:
                  "var(--surface-2, #f4f4f4)",
              }}
            >
              <EyeIcon />
            </div>

            <div>
              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "1.15rem",
                  fontWeight: 850,
                }}
              >
                هدف ما چیست؟
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "var(--color-text-muted, #666)",
                  lineHeight: 2,
                  fontSize: 14,
                }}
              >
                {platformName} یک ویترین چندفروشنده برای
                نمایش محصولات به‌صورت سه‌بعدی و واقعیت
                افزوده (AR) است. هدف ما این است که پیش
                از هر تصمیم خرید، مشتریان بتوانند محصول
                را از هر زاویه ببینند و با اندازه واقعی
                در فضای خودشان تجسم کنند.
              </p>
            </div>
          </div>
        </article>

        <article
          className="card"
          style={{
            padding: "clamp(20px, 4vw, 32px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 14,
                background:
                  "var(--surface-2, #f4f4f4)",
              }}
            >
              <ModelIcon />
            </div>

            <div>
              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "1.15rem",
                  fontWeight: 850,
                }}
              >
                چگونه کار می‌کند؟
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "var(--color-text-muted, #666)",
                  lineHeight: 2,
                  fontSize: 14,
                }}
              >
                فروشندگان محصولات خود را در پلتفرم
                معرفی می‌کنند و در صورت وجود، مدل
                سه‌بعدی محصول را نیز در اختیار مشتری
                قرار می‌دهند. مشتری می‌تواند مدل را
                مشاهده، چرخش و بزرگ‌نمایی کند و در
                دستگاه‌های سازگار، محصول را با استفاده
                از واقعیت افزوده در محیط واقعی خود قرار
                دهد.
              </p>
            </div>
          </div>
        </article>

        <article
          className="card"
          style={{
            padding: "clamp(20px, 4vw, 32px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 14,
                background:
                  "var(--surface-2, #f4f4f4)",
              }}
            >
              <PhoneIcon />
            </div>

            <div>
              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: "1.15rem",
                  fontWeight: 850,
                }}
              >
                ارتباط با فروشنده
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "var(--color-text-muted, #666)",
                  lineHeight: 2,
                  fontSize: 14,
                }}
              >
                این پلتفرم صرفاً محل معرفی و نمایش
                محصولات فروشندگان مختلف است و امکان
                ثبت سفارش، پرداخت آنلاین یا
                تسویه‌حساب از طریق آن وجود ندارد.
                برای خرید یا دریافت اطلاعات بیشتر،
                لطفاً مستقیماً از طریق اطلاعات تماس
                موجود در صفحه هر فروشنده با او در
                ارتباط باشید.
              </p>
            </div>
          </div>
        </article>

        {/* Responsibility notice */}
        <div
          style={{
            padding: "20px 22px",
            borderRadius: 18,
            background: "var(--surface-2, #f7f7f7)",
            border:
              "1px solid var(--border, rgba(0,0,0,.07))",
          }}
        >
          <strong
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: 14,
            }}
          >
            مسئولیت اطلاعات و خدمات
          </strong>

          <p
            style={{
              margin: 0,
              color: "var(--color-text-muted, #777)",
              lineHeight: 1.95,
              fontSize: 13,
            }}
          >
            قیمت‌گذاری، کیفیت، زمان تحویل، گارانتی،
            مرجوعی و خدمات پس از فروش کاملاً بر عهده
            هر فروشنده است و پلتفرم در این موارد
            مسئولیتی نمی‌پذیرد.
          </p>
        </div>
      </div>
    </div>
  );
}
