import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";
import { track } from "../lib/analytics";

function StoreIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10.5V20h16v-9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 10.5h18L19 4H5l-2 6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 20v-5h8v5"
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
      width="17"
      height="17"
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

function MailIcon() {
  return (
    <svg
      width="17"
      height="17"
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
        strokeWidth="1.7"
      />
      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="9.5"
        r="2.3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 5h5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m19 5-8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StoreSkeleton() {
  return (
    <div className="container section">
      <div
        className="skeleton"
        style={{
          height: 230,
          borderRadius: 20,
          marginBottom: 24,
        }}
      />

      <div
        className="skeleton"
        style={{
          height: 34,
          width: 220,
          borderRadius: 10,
          marginBottom: 18,
        }}
      />

      <div className="grid grid-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="skeleton"
            style={{
              height: 330,
              borderRadius: 18,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SellerStore() {
  const { slug } = useParams();
  const { sellers, products, loading } = useData();

  const seller = sellers.find((item) => item.slug === slug);

  const sellerProducts = seller
    ? products.filter(
        (product) => product.seller.slug === seller.slug
      )
    : [];

  useSeo({
    title: seller
      ? `${seller.storeName} | فروشگاه`
      : "فروشگاه پیدا نشد",
    description:
      seller?.description ??
      "مشاهده فروشگاه و محصولات منتشرشده فروشنده",
    canonicalPath: `/sellers/${slug}`,
  });

  useEffect(() => {
    if (!seller) return;

    track("SELLER_PAGE_VIEW", {
      sellerId: undefined,
      metadata: {
        sellerSlug: seller.slug,
      },
    });
  }, [seller]);

  if (loading) {
    return <StoreSkeleton />;
  }

  if (!seller) {
    return (
      <div className="container section">
        <div
          className="empty-state"
          style={{
            minHeight: 360,
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
              width: 64,
              height: 64,
              display: "grid",
              placeItems: "center",
              borderRadius: 18,
              marginBottom: 16,
            }}
          >
            <StoreIcon />
          </div>

          <h1
            style={{
              margin: "0 0 9px",
              fontSize: "1.3rem",
              fontWeight: 850,
            }}
          >
            فروشگاه پیدا نشد
          </h1>

          <p
            style={{
              maxWidth: 520,
              margin: 0,
              color: "var(--color-text-muted, #777)",
              lineHeight: 1.9,
              fontSize: 14,
            }}
          >
            این فروشگاه یافت نشد یا در حال حاضر در دسترس نیست.
          </p>

          <Link
            to="/products"
            className="btn btn-primary"
            style={{
              marginTop: 20,
            }}
          >
            مشاهده فروشگاه‌ها
          </Link>
        </div>
      </div>
    );
  }

  const logo = seller.logoUrl;

  return (
    <div className="container section">
      <div
        className="seller-box fade-in-up"
        style={{
          marginBottom: "var(--space-5)",
          padding: 20,
          borderRadius: 22,
          display: "flex",
          alignItems: "center",
          gap: 18,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
            borderRadius: 20,
            background: "var(--surface-2, #f4f4f4)",
            border:
              "1px solid var(--border, rgba(0,0,0,.08))",
          }}
        >
          {logo ? (
            <img
              src={logo}
              alt={seller.storeName}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <StoreIcon />
          )}
        </div>

        <div
          style={{
            minWidth: 0,
            flex: "1 1 280px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 7,
              color: "var(--color-text-muted, #777)",
              fontSize: 12,
              fontWeight: 750,
            }}
          >
            <StoreIcon />
            فروشگاه
          </div>

          <h1
            style={{
              margin: "0 0 7px",
              fontSize: "clamp(1.45rem, 4vw, 1.9rem)",
              lineHeight: 1.35,
              fontWeight: 850,
              wordBreak: "break-word",
            }}
          >
            {seller.storeName}
          </h1>

          {seller.description && (
            <p
              className="muted"
              style={{
                color: "var(--color-text-muted)",
                margin: "0 0 14px",
                lineHeight: 1.9,
                maxWidth: 760,
                fontSize: 14,
              }}
            >
              {seller.description}
            </p>
          )}

          <div
            className="contact-row"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {seller.contactPhone && (
              <a
                href={`tel:${seller.contactPhone}`}
                className="btn btn-outline btn-sm"
              >
                <PhoneIcon />
                تماس تلفنی
              </a>
            )}

            {seller.contactEmail && (
              <a
                href={`mailto:${seller.contactEmail}`}
                className="btn btn-outline btn-sm"
              >
                <MailIcon />
                ایمیل
              </a>
            )}

            {seller.address && (
              <span
                className="btn btn-outline btn-sm"
                style={{ cursor: "default" }}
              >
                <PinIcon />
                {seller.address}
              </span>
            )}

            {Object.entries(seller.socialLinks ?? {}).map(
              ([key, value]) => {
                if (!value) return null;

                return (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-outline btn-sm"
                  >
                    <ExternalIcon />
                    {key}
                  </a>
                );
              }
            )}
          </div>
        </div>
      </div>

      <div
        className="section-head"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
              fontWeight: 850,
            }}
          >
            محصولات این فروشگاه
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "var(--color-text-muted, #777)",
              fontSize: 13,
            }}
          >
            {sellerProducts.length} محصول منتشرشده
          </p>
        </div>
      </div>

      {sellerProducts.length === 0 ? (
        <div
          className="empty-state"
          style={{
            minHeight: 260,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 28,
          }}
        >
          <div
            className="icon"
            aria-hidden="true"
            style={{
              width: 58,
              height: 58,
              display: "grid",
              placeItems: "center",
              borderRadius: 17,
              marginBottom: 14,
            }}
          >
            <StoreIcon />
          </div>

          <h3
            style={{
              margin: "0 0 7px",
              fontSize: "1.05rem",
              fontWeight: 800,
            }}
          >
            هنوز محصولی منتشر نشده است
          </h3>

          <p
            style={{
              margin: 0,
              color: "var(--color-text-muted, #777)",
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            محصولات این فروشگاه پس از انتشار در این بخش
            نمایش داده می‌شوند.
          </p>
        </div>
      ) : (
        <div className="grid grid-4">
          {sellerProducts.map((product, index) => (
            <div
              key={product.id}
              className="fade-in-up"
              style={{
                animationDelay: `${Math.min(index, 8) * 0.05}s`,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
