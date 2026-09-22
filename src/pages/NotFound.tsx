import React from "react";
import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";

function SearchIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m3.5 10.5 8.5-7 8.5 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9.5v10h13v-10M9.5 19.5v-6h5v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NotFound() {
  useSeo({
    title: "صفحه پیدا نشد",
    description: "صفحه‌ای که به دنبال آن هستید پیدا نشد.",
  });

  return (
    <main
      className="container section"
      style={{
        minHeight: "calc(100vh - 180px)",
        display: "grid",
        placeItems: "center",
        paddingTop: 40,
        paddingBottom: 60,
      }}
    >
      <section
        className="card"
        style={{
          width: "100%",
          maxWidth: 680,
          margin: "0 auto",
          padding: "clamp(28px, 7vw, 56px)",
          textAlign: "center",
          overflow: "hidden",
          position: "relative",
        }}
        aria-labelledby="not-found-title"
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            top: -100,
            right: -80,
            background:
              "var(--surface-2, rgba(0,0,0,.04))",
            pointerEvents: "none",
          }}
        />

        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            bottom: -90,
            left: -70,
            background:
              "var(--surface-2, rgba(0,0,0,.04))",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 82,
              height: 82,
              margin: "0 auto 22px",
              display: "grid",
              placeItems: "center",
              borderRadius: 24,
              background:
                "var(--surface-2, #f4f4f4)",
            }}
          >
            <SearchIcon />
          </div>

          <div
            style={{
              fontSize:
                "clamp(4rem, 16vw, 7rem)",
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: "-0.06em",
              opacity: 0.12,
              marginBottom: 14,
              userSelect: "none",
            }}
            aria-hidden="true"
          >
            404
          </div>

          <h1
            id="not-found-title"
            style={{
              margin: "0 0 12px",
              fontSize:
                "clamp(1.45rem, 4vw, 2rem)",
              lineHeight: 1.4,
              fontWeight: 850,
            }}
          >
            صفحه موردنظر پیدا نشد
          </h1>

          <p
            style={{
              maxWidth: 500,
              margin: "0 auto",
              color:
                "var(--color-text-muted, #777)",
              fontSize: 14,
              lineHeight: 2,
            }}
          >
            ممکن است آدرس صفحه اشتباه باشد یا
            این صفحه دیگر در دسترس نباشد.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 26,
            }}
          >
            <Link
              to="/"
              className="btn btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                minHeight: 46,
                padding: "0 22px",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              <HomeIcon />
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
