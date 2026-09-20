import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";

// A dedicated /search route simply forwards to /products with the query,
// since Products.tsx already implements full search + filter + sort.
export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  return <Navigate to={`/products${q ? `?q=${encodeURIComponent(q)}` : ""}`} replace />;
}
