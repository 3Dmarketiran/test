import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";

// The search page is intentionally kept as a lightweight route entry.
// Products.tsx owns the actual search, filtering and sorting UI.
export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q")?.trim() ?? "";

  const destination = q
    ? `/products?q=${encodeURIComponent(q)}`
    : "/products";

  return <Navigate to={destination} replace />;
}
