import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSellerLogoUrl, sellerInitials, useData } from "../lib/data";
import ProductCard from "../components/ProductCard";
import { useSeo } from "../lib/seo";
import { isIndexableSeller } from "../lib/contentQuality";
import { track } from "../lib/analytics";

function readableThemeInk(hex: string | null | undefined) {
  const value = String(hex || "#eef3f8").replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return "#173a63";
  const rgb = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const linear = rgb.map((c) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  return luminance < 0.38 ? "#ffffff" : "#173a63";
}

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

      <div className="grid grid-4 seller-product-grid">
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
  const [addressOpen, setAddressOpen] = useState(false);

  const seller = sellers.find((item) => item.slug === slug);

  const sellerProducts = seller
    ? products.filter(
        (product) => product.seller.slug === seller.slug
      )
    : [];

  const sellerDescription = seller
    ? (seller.description?.trim() || `مشاهده محصولات و ویترین ${seller.storeName} در 3DMarketIran؛ محصولات را به‌صورت سه‌بعدی بررسی کنید و برای اطلاعات بیشتر با فروشنده ارتباط بگیرید.`)
    : "فروشگاه موردنظر در 3DMarketIran پیدا نشد.";
  const indexableSeller = Boolean(seller && isIndexableSeller(seller, products));
  const sellerStructuredData = useMemo(() => seller ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `https://3dmarketiran.ir/sellers/${encodeURIComponent(seller.slug)}/#profile`,
        url: `https://3dmarketiran.ir/sellers/${encodeURIComponent(seller.slug)}/`,
        name: `${seller.storeName} | فروشگاه سه‌بعدی | 3DMarketIran`,
        description: sellerDescription,
        inLanguage: "fa-IR",
        mainEntity: {
          "@type": "Organization",
          name: seller.storeName,
          url: `https://3dmarketiran.ir/sellers/${encodeURIComponent(seller.slug)}/`,
          ...(seller.description ? { description: seller.description } : {}),
          ...(getSellerLogoUrl(seller.logoUrl) ? { logo: getSellerLogoUrl(seller.logoUrl) } : {}),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "خانه", item: "https://3dmarketiran.ir/" },
          { "@type": "ListItem", position: 2, name: "فروشگاه‌ها", item: "https://3dmarketiran.ir/products/" },
          { "@type": "ListItem", position: 3, name: seller.storeName, item: `https://3dmarketiran.ir/sellers/${encodeURIComponent(seller.slug)}/` },
        ],
      },
    ],
  } : null, [seller, sellerDescription]);

  useSeo({
    title: seller
      ? `${seller.storeName} | فروشگاه سه‌بعدی | 3DMarketIran`
      : "فروشگاه پیدا نشد | 3DMarketIran",
    description: sellerDescription,
    enabled: !loading,
    image: seller ? getSellerLogoUrl(seller.logoUrl) : undefined,
    canonicalPath: `/sellers/${encodeURIComponent(slug || "")}/`,
    noIndex: !loading && (!seller || !indexableSeller),
    structuredData: seller && indexableSeller ? sellerStructuredData : null,
  });

  useEffect(() => {
    if (!seller) return;

    track("SELLER_PAGE_VIEW", {
      sellerId: seller.id,
      metadata: {
        sellerSlug: seller.slug,
      },
    });
  }, [seller]);

  if (loading && (!seller || !indexableSeller)) {
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
            to="/products/"
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

  const logo = getSellerLogoUrl(seller.logoUrl);
  const pinnedProducts = [...sellerProducts]
    .filter((product) => product.isPinned)
    .sort((a, b) => (a.pinOrder ?? 99) - (b.pinOrder ?? 99))
    .slice(0, 3);
  const popularProducts = [...sellerProducts]
    .filter((product) => !product.isPinned)
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 4);

  return (
    <div className="container section seller-store-page">
      <section
        className="seller-profile-card seller-profile-card--clean card fade-in-up"
        style={{ "--seller-theme": seller.themeColor || "#eef3f8", "--seller-theme-ink": readableThemeInk(seller.themeColor) } as React.CSSProperties}
      >
        <div className="seller-profile-inner">
          <div className="seller-profile-topline">
            <div className="seller-profile-main-row">
              <div className={`seller-profile-avatar${logo ? " has-logo" : ""}`}>
                {logo ? (
                  <img
                    src={logo}
                    alt={seller.storeName}
                    loading="eager"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback = event.currentTarget.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = "grid";
                    }}
                  />
                ) : null}
                <span
                  className="seller-profile-avatar__fallback"
                  style={{ display: logo ? "none" : "grid" }}
                  aria-hidden="true"
                >
                  {sellerInitials(seller.storeName)}
                </span>
              </div>

              <div className="seller-profile-copy">
                <div className="seller-profile-handle">@{seller.slug}</div>
                <h1>{seller.storeName}</h1>
                {seller.description && <p>{seller.description}</p>}
              </div>
            </div>

            <div className="seller-profile-actions seller-profile-actions--compact">
              {seller.contactPhone && (
                <a href={`tel:${seller.contactPhone}`} className="seller-profile-action" aria-label="تماس با فروشگاه" title="تماس با فروشگاه">
                  <PhoneIcon />
                </a>
              )}
              {seller.address && (
                <button type="button" className="seller-profile-action" onClick={() => setAddressOpen(true)} aria-label="مشاهده آدرس فروشگاه" title="مشاهده آدرس فروشگاه">
                  <PinIcon />
                </button>
              )}
            </div>
          </div>

          <div className="seller-profile-stats seller-profile-stats--social">
            <div className="seller-profile-stat seller-profile-stat--metric">
              <strong>{sellerProducts.length}</strong>
              <span>محصول</span>
            </div>
            <div className="seller-profile-stat seller-profile-stat--metric">
            </div>
            <div className="seller-profile-stat seller-profile-stat--metric">
              <strong>{sellerProducts.filter((product) => product.models.length > 0).length}</strong>
              <span>مدل سه‌بعدی</span>
            </div>
          </div>

        </div>
      </section>

      <section className="seller-social-nav" aria-label="بخش‌های فروشگاه">
        {[
          { id: "featured", label: "منتخب فروشگاه", show: pinnedProducts.length > 0 },
          { id: "popular", label: "محبوب‌ترین‌ها", show: popularProducts.length > 0 },
          { id: "all-products", label: "همه محصولات", show: true },
        ]
          .filter((item) => item.show)
          .map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={index === 0 ? "active" : undefined}
              onClick={(event) => {
                // Keep this interaction as an in-page scroll without changing route state.
                event.preventDefault();
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {item.label}
            </a>
          ))}
      </section>

      {pinnedProducts.length > 0 && (
        <section id="featured" className="section seller-products-section seller-featured-section" aria-labelledby="seller-featured-title">
          <div className="section-head">
            <div><div className="page-eyebrow">منتخب فروشگاه</div><h2 id="seller-featured-title">محصولات پین‌شده</h2><p>محصولاتی که فروشنده برای نمایش در ابتدای فروشگاه انتخاب کرده است.</p></div>
          </div>
          <div className="seller-pinned-grid">
            {pinnedProducts.map((product, index) => <div key={product.id} className={`seller-pinned-item seller-pinned-${index + 1}`}><ProductCard product={product} priority={index < 4} /></div>)}
          </div>
        </section>
      )}

      {popularProducts.length > 0 && (
        <section id="popular" className="section seller-products-section" aria-labelledby="seller-popular-title">
          <div className="section-head">
            <div><div className="page-eyebrow">محبوب‌ترین‌ها</div><h2 id="seller-popular-title">محصولات محبوب این فروشگاه</h2><p>بر اساس بازدید و تعامل ثبت‌شده در سایت.</p></div>
          </div>
          <div className="grid grid-4 seller-product-grid">
            {popularProducts.map((product, index) => <div key={product.id} className="fade-in-up" style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}><ProductCard product={product} priority={index < 4} /></div>)}
          </div>
        </section>
      )}

      <section id="all-products" className="section seller-products-section" aria-labelledby="seller-products-title">
        <div className="section-head">
          <div><div className="page-eyebrow">کاتالوگ</div><h2 id="seller-products-title">همه محصولات</h2><p>{sellerProducts.length} محصول منتشرشده برای مشاهده و بررسی</p></div>
          <Link to="/products/" className="btn btn-outline btn-sm">مشاهده کاتالوگ</Link>
        </div>

        {sellerProducts.length === 0 ? (
          <div className="empty-state seller-empty-state"><div className="icon"><StoreIcon /></div><h3>هنوز محصولی منتشر نشده است</h3><p>محصولات این فروشگاه پس از انتشار در اینجا نمایش داده می‌شوند.</p></div>
        ) : (
          <div className="grid grid-4 seller-product-grid">
            {sellerProducts.map((product, index) => <div key={product.id} className="fade-in-up" style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}><ProductCard product={product} priority={index < 4} /></div>)}
          </div>
        )}
      </section>

      {addressOpen && (
        <div className="address-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAddressOpen(false); }}>
          <div className="address-dialog" role="dialog" aria-modal="true" aria-labelledby="seller-address-title">
            <div className="address-dialog__head">
              <div><div className="page-eyebrow">موقعیت فروشگاه</div><h2 id="seller-address-title" style={{margin:"4px 0 0",fontSize:"1.15rem"}}>آدرس فروشگاه</h2></div>
              <button type="button" className="address-dialog__close" onClick={() => setAddressOpen(false)} aria-label="بستن">×</button>
            </div>
            <div style={{marginTop:18,padding:16,borderRadius:16,background:"var(--neo-surface-2)",border:"1px solid var(--neo-border)",lineHeight:2}}>
              <PinIcon /> <span style={{marginInlineStart:8}}>{seller.address || "آدرسی برای این فروشگاه ثبت نشده است."}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
