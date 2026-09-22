import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
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

export default function Layout() {
  const { settings } = useData();
  const [navOpen, setNavOpen] = useState(false);

  const platformName =
    settings?.platformName ?? "پلتفرم نمایشگاه محصول";

  return (
    <div>
      <a href="#main-content" className="visually-hidden">
        رفتن به محتوای اصلی
      </a>

      <header className="site-header">
        <div className="container site-header__inner">

          <Link
            to="/"
            className="brand"
            onClick={() => setNavOpen(false)}
          >
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={platformName}
              />
            ) : (
              <span aria-hidden>🧊</span>
            )}

            <span>{platformName}</span>
          </Link>

          <nav
            className={`nav-links${navOpen ? " open" : ""}`}
            aria-label="منوی اصلی"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setNavOpen(false)}
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">

            <a
              href={ADMIN_URL}
              className="btn btn-primary btn-sm seller-access-btn"
            >
              ورود / ثبت‌نام فروشندگان
            </a>

            <button
              className="btn btn-outline btn-sm mobile-nav-toggle"
              onClick={() => setNavOpen((value) => !value)}
              aria-expanded={navOpen}
              aria-label="باز و بسته کردن منو"
            >
              ☰
            </button>

          </div>
        </div>
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
    settings?.platformName ?? "پلتفرم نمایشگاه محصول";

  const social = settings?.socialLinks ?? {};

  const phone =
    settings?.contactPhone || "09144142898";

  return (
    <footer className="site-footer">
      <div className="container">

        <div className="footer-grid">

          <div>
            <h4>{platformName}</h4>

            <p>
              ویترین سه‌بعدی و واقعیت افزوده محصولات.
              پلتفرم فقط مشتریان را به فروشندگان معرفی می‌کند
              و در قیمت، کیفیت، ارسال یا خدمات پس از فروش
              دخالتی ندارد.
            </p>
          </div>

          <div>
            <h4>دسترسی سریع</h4>

            <Link to="/products">
              همه محصولات
            </Link>
            <br />

            <Link to="/categories">
              دسته‌بندی‌ها
            </Link>
            <br />

            <Link to="/plans">
              اشتراک فروشندگان
            </Link>
            <br />

            <Link to="/search">
              جستجو
            </Link>
          </div>

          <div>
            <h4>پلتفرم</h4>

            <Link to="/about">
              درباره ما
            </Link>
            <br />

            <Link to="/contact">
              تماس با ما
            </Link>
            <br />

            <a href={ADMIN_URL}>
              ورود / ثبت‌نام فروشندگان
            </a>
          </div>

          <div>
            <h4>ارتباط با ما</h4>

            {settings?.contactEmail && (
              <p>{settings.contactEmail}</p>
            )}

            <p>
              📞{" "}
              <a href={`tel:${phone}`}>
                {phone}
              </a>
            </p>

            {Object.entries(social).map(
              ([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {key}
                </a>
              )
            )}
          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} {platformName}
            {" "}— تمام حقوق محفوظ است.
          </span>

          <span>
            پلتفرم مسئول کیفیت، قیمت، ارسال یا خدمات
            پس از فروش محصولات نیست.
          </span>

        </div>
      </div>
    </footer>
  );
}
