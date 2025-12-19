import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  const location = useLocation();

  // Hide Navbar on login, register, or admin pages
  const hideNavbar =
    location.pathname.includes("/login") ||
    location.pathname.includes("/Register") ||
    location.pathname.includes("/admin");

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-pink-50">
      {!hideNavbar && <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
