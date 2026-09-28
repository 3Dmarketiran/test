import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useData } from "../lib/data";
import { ADMIN_URL } from "../lib/config";

const NAV = [
  { to: "/", label: "خانه", end: true },
  { to: "/products", label: "فروشگاه‌ها" },
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

  const platformName = settings?.platformName ?? "3Dmarketiran";
  const phone = settings?.contactPhone || "09144142898";

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!navOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [navOpen]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="visually-hidden">رفتن به محتوای اصلی</a>

      <header className="site-header clean-header">
        <div className="container clean-header__inner">
          <button
            type="button"
            className="clean-header__menu"
            onClick={() => setNavOpen(v => !v)}
            aria-expanded={navOpen}
            aria-controls="main-navigation"
            aria-label={navOpen ? "بستن منو" : "باز کردن منو"}
          >
            <MenuIcon open={navOpen} />
          </button>

          <Link to="/" className="clean-header__brand" onClick={() => setNavOpen(false)} aria-label={`صفحه اصلی ${platformName}`}>
            <span className="clean-header__brand-mark" aria-hidden="true">
              {settings?.logoUrl ? <img src={settings.logoUrl} alt="" /> : <span>3D</span>}
            </span>
            <span className="clean-header__brand-name">{platformName}</span>
          </Link>

          <div className="clean-header__actions">
            <a href={ADMIN_URL} className="clean-header__seller">ورود فروشندگان</a>
          </div>

          {navOpen && (
            <>
              <button type="button" className="clean-header__backdrop" aria-label="بستن منو" onClick={() => setNavOpen(false)} />
              <nav className="clean-header__menu-panel" id="main-navigation" aria-label="منوی اصلی">
                <div className="clean-header__menu-list">
                  {NAV.map(item => (
                    <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setNavOpen(false)} className={({isActive}) => isActive ? "active" : ""}>
                      {item.label}
                    </NavLink>
                  ))}
                  <a href={`tel:${phone}`} onClick={() => setNavOpen(false)} className="clean-header__menu-contact">
                    <PhoneIcon /> تماس با ما
                  </a>
                </div>
              </nav>
            </>
          )}
        </div>
      </header>

      <main id="main-content"><Outlet /></main>
      <Footer />
    </div>
  );
}

function Footer() {
  const { settings } = useData();

  const platformName =
    settings?.platformName ??
    "3Dmarketiran";

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
              ورود فروشندگان
              <ArrowIcon />
            </a>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-column">
            <h4>دسترسی سریع</h4>

            <Link to="/products">
              فروشگاه‌ها
            </Link>


            <Link to="/plans">
              اشتراک فروشندگان
            </Link>

            <Link to="/search">
              جستجوی فروشگاه
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
