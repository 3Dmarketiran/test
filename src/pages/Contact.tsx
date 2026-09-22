import React from "react";
import { useData } from "../lib/data";
import { useSeo } from "../lib/seo";

function MailIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="22"
      height="22"
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

function LinkIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 13.5a4 4 0 0 0 5.7.2l2-2a4 4 0 0 0-5.7-5.7l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 10.5a4 4 0 0 0-5.7-.2l-2 2A4 4 0 0 0 8 18l1.1-1.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Contact() {
  const { settings } = useData();

  const platformName =
    settings?.platformName ?? "پلتفرم نمایشگاه محصول";

  const phone =
    settings?.contactPhone || "09144142898";

  const socialLinks = Object.entries(
    settings?.socialLinks ?? {}
  ).filter(([, value]) => Boolean(value));

  useSeo({
    title: "تماس با ما",
    description: `اطلاعات تماس ${platformName}`,
  });

  return (
    <div className="container section">
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 28,
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
              background:
                "var(--surface-2, #f4f4f4)",
            }}
          >
            <PhoneIcon />
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize:
                "clamp(1.7rem, 4vw, 2.3rem)",
              lineHeight: 1.3,
              fontWeight: 850,
            }}
          >
            تماس با ما
          </h1>

          <p
            style={{
              maxWidth: 680,
              margin: "0 auto",
              color:
                "var(--color-text-muted, #777)",
              lineHeight: 2,
              fontSize: 14,
            }}
          >
            برای ارتباط با {platformName} از
            اطلاعات تماس زیر استفاده کنید.
          </p>
        </div>

        {/* Product support notice */}
        <div
          className="card"
          style={{
            padding:
              "clamp(20px, 4vw, 28px)",
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "1.1rem",
              fontWeight: 850,
            }}
          >
            درباره محصولات
          </h2>

          <p
            style={{
              margin: 0,
              color:
                "var(--color-text-muted, #666)",
              lineHeight: 2,
              fontSize: 14,
            }}
          >
            برای پرسش درباره یک محصول خاص،
            لطفاً مستقیماً با فروشنده همان محصول
            از طریق صفحه فروشگاه فروشنده تماس
            بگیرید. اطلاعات تماس هر فروشنده در
            صفحه فروشگاه او قرار دارد.
          </p>
        </div>

        {/* Contact methods */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 14,
          }}
        >
          {settings?.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="card"
              style={{
                padding: 20,
                display: "flex",
                alignItems: "center",
                gap: 14,
                textDecoration: "none",
                minWidth: 0,
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
                <MailIcon />
              </div>

              <div
                style={{
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    marginBottom: 4,
                    fontSize: 12,
                    color:
                      "var(--color-text-muted, #777)",
                    fontWeight: 700,
                  }}
                >
                  ایمیل
                </div>

                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 750,
                    direction: "ltr",
                    textAlign: "left",
                  }}
                >
                  {settings.contactEmail}
                </div>
              </div>
            </a>
          )}

          <a
            href={`tel:${phone}`}
            className="card"
            style={{
              padding: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
              textDecoration: "none",
              minWidth: 0,
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

            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  marginBottom: 4,
                  fontSize: 12,
                  color:
                    "var(--color-text-muted, #777)",
                  fontWeight: 700,
                }}
              >
                تلفن پشتیبانی
              </div>

              <div
                style={{
                  fontWeight: 750,
                  direction: "ltr",
                  textAlign: "left",
                }}
              >
                {phone}
              </div>
            </div>
          </a>

          {socialLinks.map(([key, value]) => (
            <a
              key={key}
              href={value}
              target="_blank"
              rel="noreferrer noopener"
              className="card"
              style={{
                padding: 20,
                display: "flex",
                alignItems: "center",
                gap: 14,
                textDecoration: "none",
                minWidth: 0,
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
                <LinkIcon />
              </div>

              <div
                style={{
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    marginBottom: 4,
                    fontSize: 12,
                    color:
                      "var(--color-text-muted, #777)",
                    fontWeight: 700,
                  }}
                >
                  {key}
                </div>

                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 750,
                    direction: "ltr",
                    textAlign: "left",
                  }}
                >
                  {value}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Empty contact state */}
        {!settings?.contactEmail &&
          !phone &&
          socialLinks.length === 0 && (
            <div
              className="empty-state"
              style={{
                marginTop: 16,
                minHeight: 220,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 28,
              }}
            >
              <p
                style={{
                  margin: 0,
                  color:
                    "var(--color-text-muted, #777)",
                  fontSize: 14,
                }}
              >
                اطلاعات تماس هنوز ثبت نشده است.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
