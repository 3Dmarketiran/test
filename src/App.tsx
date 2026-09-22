import React, { useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

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

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname, location.search]);

  return null;
}

function BrandedApp() {
  const { settings } = useData();

  useEffect(() => {
    if (!settings) return;

    applyBranding(settings);
  }, [settings]);

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<Layout />}>
          {/* Home */}
          <Route
            index
            element={<Home />}
          />

          {/* Products */}
          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="products/:slug"
            element={<ProductDetail />}
          />

          {/* Sellers */}
          <Route
            path="sellers/:slug"
            element={<SellerStore />}
          />

          {/* Categories */}
          <Route
            path="categories"
            element={<Categories />}
          />

          {/* Search */}
          <Route
            path="search"
            element={<Search />}
          />

          {/* Seller Plans */}
          <Route
            path="plans"
            element={<Plans />}
          />

          {/* About */}
          <Route
            path="about"
            element={<About />}
          />

          {/* Contact */}
          <Route
            path="contact"
            element={<Contact />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>
      </Routes>
    </>
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
