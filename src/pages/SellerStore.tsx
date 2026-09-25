import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getSellerLogoUrl, sellerInitials, useData } from "../lib/data";
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

  const logo = getSellerLogoUrl(seller.logoUrl, seller.slug);
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
      <section className="seller-profile-card card fade-in-up" style={{"--seller-theme": seller.themeColor || "#2e6fce"} as React.CSSProperties}>
        <div className="seller-profile-cover" aria-hidden="true" />
        <div className="seller-profile-inner">
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
              <div className="seller-profile-overline">فروشگاه رسمی</div>
              <h1>{seller.storeName}</h1>
              <div className="seller-profile-handle">@{seller.slug}</div>
              {seller.category && <span className="seller-category-pill">{seller.category.name}</span>}
              <p>{seller.description || "این فروشگاه هنوز معرفی کوتاهی برای مشتریان ثبت نکرده است."}</p>
            </div>
            <div className="seller-profile-actions">
              {seller.contactPhone && <a href={`tel:${seller.contactPhone}`} className="btn btn-primary"><PhoneIcon />تماس با فروشگاه</a>}
              {seller.contactEmail && <a href={`mailto:${seller.contactEmail}`} className="btn btn-outline"><MailIcon />ارسال ایمیل</a>}
            </div>
          </div>

          <div className="seller-profile-stats">
            <div><strong>{sellerProducts.length}</strong><span>محصول منتشرشده</span></div>
            <div><strong>{seller.category?.name || "فروشگاه"}</strong><span>دسته‌بندی فروشگاه</span></div>
            <div className="seller-contact-stat"><strong>{seller.contactPhone || "ثبت نشده"}</strong><span>شماره تماس</span></div>
            <div className="seller-contact-stat seller-address-stat"><strong>{seller.address || "آدرس ثبت نشده"}</strong><span>آدرس فروشگاه</span></div>
          </div>

          <div className="seller-profile-highlights">
            <span>فروشگاه تخصصی</span>
            <span>{sellerProducts.length} محصول فعال</span>
            {sellerProducts.some((product) => product.models.some((model) => model.kind === "GLB" || model.kind === "GLTF")) && <span>مدل سه‌بعدی</span>}
            {sellerProducts.some((product) => product.models.some((model) => model.kind === "USDZ")) && <span>واقعیت افزوده</span>}
          </div>

          <div className="seller-profile-contact-row">
            {seller.contactPhone && <a href={`tel:${seller.contactPhone}`}><PhoneIcon />{seller.contactPhone}</a>}
            {seller.contactEmail && <a href={`mailto:${seller.contactEmail}`}><MailIcon />{seller.contactEmail}</a>}
            {seller.address && <span><PinIcon />{seller.address}</span>}
            {Object.entries(seller.socialLinks ?? {}).map(([key, value]) => value ? <a key={key} href={value} target="_blank" rel="noreferrer noopener"><ExternalIcon />{key}</a> : null)}
          </div>
        </div>
      </section>

      <section className="seller-social-nav" aria-label="بخش‌های فروشگاه">
        <a href="#featured" className="active">منتخب فروشگاه</a>
        <a href="#popular">محبوب‌ترین‌ها</a>
        <a href="#all-products">همه محصولات</a>
      </section>

      {pinnedProducts.length > 0 && (
        <section id="featured" className="section seller-products-section seller-featured-section" aria-labelledby="seller-featured-title">
          <div className="section-head">
            <div><div className="page-eyebrow">منتخب فروشگاه</div><h2 id="seller-featured-title">محصولات پین‌شده</h2><p>محصولاتی که فروشنده برای نمایش در ابتدای فروشگاه انتخاب کرده است.</p></div>
          </div>
          <div className="seller-pinned-grid">
            {pinnedProducts.map((product, index) => <div key={product.id} className={`seller-pinned-item seller-pinned-${index + 1}`}><ProductCard product={product} /></div>)}
          </div>
        </section>
      )}

      {popularProducts.length > 0 && (
        <section id="popular" className="section seller-products-section" aria-labelledby="seller-popular-title">
          <div className="section-head">
            <div><div className="page-eyebrow">محبوب‌ترین‌ها</div><h2 id="seller-popular-title">محصولات محبوب این فروشگاه</h2><p>بر اساس بازدید و تعامل ثبت‌شده در سایت.</p></div>
          </div>
          <div className="grid grid-4 seller-product-grid">
            {popularProducts.map((product, index) => <div key={product.id} className="fade-in-up" style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}><ProductCard product={product} /></div>)}
          </div>
        </section>
      )}

      <section id="all-products" className="section seller-products-section" aria-labelledby="seller-products-title">
        <div className="section-head">
          <div><div className="page-eyebrow">کاتالوگ</div><h2 id="seller-products-title">همه محصولات</h2><p>{sellerProducts.length} محصول منتشرشده برای مشاهده و بررسی</p></div>
          <Link to="/products" className="btn btn-outline btn-sm">مشاهده کاتالوگ</Link>
        </div>

        {sellerProducts.length === 0 ? (
          <div className="empty-state seller-empty-state"><div className="icon"><StoreIcon /></div><h3>هنوز محصولی منتشر نشده است</h3><p>محصولات این فروشگاه پس از انتشار در اینجا نمایش داده می‌شوند.</p></div>
        ) : (
          <div className="grid grid-4 seller-product-grid">
            {sellerProducts.map((product, index) => <div key={product.id} className="fade-in-up" style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}><ProductCard product={product} /></div>)}
          </div>
        )}
      </section>
    </div>
  );
}
