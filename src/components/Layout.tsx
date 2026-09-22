import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useData } from "../lib/data";

const ADMIN_URL =
  "https://3dmarketiran.github.io/frontend-admin/#/login";

const NAV = [
  { to: "/", label: "خانه", end: true },
  { to: "/products", label: "محصولات" },
  { to: "/categories", label: "دسته‌بندی‌ها" },
  { to: "/plans", label: "اشتراک فروشندگان" },
  { to: "/about", label: "درباره ما" },
  { to: "/contact", label: "تماس با ما" },
];

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
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
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Layout() {
  const { settings } = useData();
  const location = useLocation();

  const [navOpen, setNavOpen] = useState(false);

  const platformName =
    settings?.platformName ??
    "پلتفرم نمایشگاه محصول";

  const phone =
    settings?.contactPhone ||
    "09144142898";

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!navOpen) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        originalOverflow;
    };
  }, [navOpen]);

  const handleNavToggle = () => {
    setNavOpen((value) => !value);
  };

  const closeNav = () => {
    setNavOpen(false);
  };

  return (
    <div className="app-shell">
      <a
        href="#main-content"
        className="visually-hidden"
      >
        رفتن به محتوای اصلی
      </a>

      <header
        className="site-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="container site-header__inner">
          {/* BRAND */}
          <Link
            to="/"
            className="brand"
            onClick={closeNav}
            aria-label={`رفتن به صفحه اصلی ${platformName}`}
          >
            <span
              className="brand__logo"
              aria-hidden="true"
              style={{
                width: 42,
                height: 42,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                overflow: "hidden",
                borderRadius: 12,
              }}
            >
              {settings?.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: 23,
                  }}
                >
                  🧊
                </span>
              )}
            </span>

            <span
              className="brand__name"
              style={{
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {platformName}
            </span>
          </Link>

          {/* DESKTOP / MOBILE NAV */}
          <nav
            className={`nav-links${
              navOpen ? " open" : ""
            }`}
            aria-label="منوی اصلی"
          >
            <div
              className="nav-links__inner"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={closeNav}
                  className={({ isActive }) =>
                    isActive ? "active" : ""
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* MOBILE CTA */}
            <div
              className="mobile-nav-cta"
              style={{
                display: "none",
              }}
            >
              <a
                href={ADMIN_URL}
                className="btn btn-primary"
                onClick={closeNav}
              >
                ورود / ثبت‌نام فروشندگان
                <ArrowIcon />
              </a>

              <a
                href={`tel:${phone}`}
                className="btn btn-outline"
                onClick={closeNav}
              >
                <PhoneIcon />
                تماس با ما
              </a>
            </div>
          </nav>

          {/* HEADER ACTIONS */}
          <div
            className="header-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <a
              href={ADMIN_URL}
              className="btn btn-primary btn-sm seller-access-btn"
            >
              <span className="seller-access-full">
                ورود / ثبت‌نام فروشندگان
              </span>

              <span className="seller-access-mobile">
                ورود فروشندگان
              </span>
            </a>

            <button
              type="button"
              className="btn btn-outline btn-sm mobile-nav-toggle"
              onClick={handleNavToggle}
              aria-expanded={navOpen}
              aria-controls="main-navigation"
              aria-label={
                navOpen
                  ? "بستن منوی اصلی"
                  : "باز کردن منوی اصلی"
              }
            >
              <MenuIcon open={navOpen} />
            </button>
          </div>
        </div>

        {/* MOBILE BACKDROP */}
        {navOpen && (
          <button
            type="button"
            aria-label="بستن منو"
            onClick={closeNav}
            className="mobile-nav-backdrop"
            style={{
              display: "none",
              position: "fixed",
              inset: "var(--header-height, 72px) 0 0",
              zIndex: -1,
              border: 0,
              background:
                "rgba(0,0,0,.28)",
            }}
          />
        )}
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  const { settings } = useData();

  const platformName =
    settings?.platformName ??
    "پلتفرم نمایشگاه محصول";

  const social = settings?.socialLinks ?? {};

  const phone =
    settings?.contactPhone ||
    "09144142898";

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* ABOUT */}
          <div className="footer-column">
            <h4>{platformName}</h4>

            <p>
              ویترین سه‌بعدی و واقعیت افزوده
              محصولات. این پلتفرم مشتریان را به
              فروشندگان معرفی می‌کند و در قیمت،
              کیفیت، ارسال یا خدمات پس از فروش
              دخالتی ندارد.
            </p>

            <a
              href={ADMIN_URL}
              className="footer-seller-link"
            >
              ورود / ثبت‌نام فروشندگان
              <ArrowIcon />
            </a>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">
            <h4>دسترسی سریع</h4>

            <Link to="/products">
              همه محصولات
            </Link>

            <Link to="/categories">
              دسته‌بندی‌ها
            </Link>

            <Link to="/plans">
              اشتراک فروشندگان
            </Link>

            <Link to="/search">
              جستجو
            </Link>
          </div>

          {/* PLATFORM */}
          <div className="footer-column">
            <h4>پلتفرم</h4>

            <Link to="/about">
              درباره ما
            </Link>

            <Link to="/contact">
              تماس با ما
            </Link>

            <Link to="/plans">
              پلن‌های فروشندگان
            </Link>
          </div>

          {/* CONTACT */}
          <div className="footer-column">
            <h4>ارتباط با ما</h4>

            {settings?.contactEmail && (
              <a
                href={`mailto:${settings.contactEmail}`}
                style={{
                  direction: "ltr",
                  textAlign: "right",
                  unicodeBidi: "plaintext",
                }}
              >
                {settings.contactEmail}
              </a>
            )}

            <a
              href={`tel:${phone}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                direction: "ltr",
                justifyContent: "flex-start",
              }}
            >
              <PhoneIcon />
              <span>{phone}</span>
            </a>

            {Object.entries(social).map(
              ([key, url]) =>
                url ? (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                      overflow: "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {key}
                  </a>
                ) : null
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {platformName} — تمام حقوق
            محفوظ است.
          </span>

          <span>
            پلتفرم مسئول کیفیت، قیمت، ارسال یا
            خدمات پس از فروش محصولات نیست.
          </span>
        </div>
      </div>
    </footer>
  );
}
