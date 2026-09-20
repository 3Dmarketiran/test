import React, { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SellerStore from "./pages/SellerStore";
import Categories from "./pages/Categories";
import Search from "./pages/Search";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { DataProvider, useData } from "./lib/data";
import { applyBranding } from "./lib/theme";

// HashRouter is used deliberately: GitHub Pages serves purely static files
// with no server-side rewrite, so a BrowserRouter deep link (e.g. a
// customer refreshing /products/my-product) would 404 at the CDN before
// React ever loads. Hash-based routes (/#/products/my-product) always
// resolve to index.html first. Product/seller URLs remain stable per
// spec section 46 even though they live after the hash.
function BrandedApp() {
  const { settings } = useData();
  useEffect(() => applyBranding(settings), [settings]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="sellers/:slug" element={<SellerStore />} />
        <Route path="categories" element={<Categories />} />
        <Route path="search" element={<Search />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <DataProvider>
        <BrandedApp />
      </DataProvider>
    </HashRouter>
  );
}
