import React from "react";
import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";

export default function NotFound() {
  useSeo({ title: "صفحه پیدا نشد" });
  return (
    <div className="container section empty-state">
      <div className="icon" aria-hidden>🚫</div>
      <h1 style={{ fontSize: "1.4rem" }}>صفحه موردنظر پیدا نشد</h1>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 12 }}>بازگشت به خانه</Link>
    </div>
  );
}
