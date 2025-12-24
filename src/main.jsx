import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AddProductPage from "./pages/admin/AddProductPage";
import ProductsPage from "./pages/admin/ProductsPage";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import "./index.css";
import AdminUsers from "./pages/admin/AdminUsers";

// 🔥 ADD THIS
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

// 🔥 Automatically attach token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* User pages wrapped in App layout (with Navbar) */}
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="Register" element={<Register />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>

        {/* Admin pages (no Navbar) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/upload" element={<AddProductPage />} />
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
