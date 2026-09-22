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
import Plans from "./pages/Plans";
import NotFound from "./pages/NotFound";
import { DataProvider, useData } from "./lib/data";
import { applyBranding } from "./lib/theme";

function BrandedApp() {
  const { settings } = useData();

  useEffect(() => {
    applyBranding(settings);
  }, [settings]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="products" element={<Products />} />
        <Route path="products/:slug" element={<ProductDetail />} />

        <Route path="sellers/:slug" element={<SellerStore />} />

        <Route path="categories" element={<Categories />} />

        <Route path="search" element={<Search />} />

        <Route path="plans" element={<Plans />} />

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
