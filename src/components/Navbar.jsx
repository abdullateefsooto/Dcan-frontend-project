import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch, FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // Load cart from localStorage
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Dispatch event so home page can listen
    const event = new CustomEvent("searchChange", { detail: value });
    window.dispatchEvent(event);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg py-3 px-6 flex items-center justify-between sticky top-0 z-50 transition-all">
      {/* Logo */}
      <div
        className="text-3xl font-bold font-serif text-indigo-600 cursor-pointer hover:text-indigo-700 transition-colors"
        onClick={() => navigate("/")}
      >
        DcanMart
      </div>

      {/* Search bar */}
      <div className="flex-1 mx-6 relative max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      {/* Cart + Profile */}
      <div className="flex items-center gap-4 relative" ref={profileRef}>
        {/* Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="relative p-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition shadow-sm"
        >
          <FaShoppingCart className="text-xl text-indigo-600" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow">
              {cart.length}
            </span>
          )}
        </button>

        {/* Profile */}
     {/* Profile */}
{user ? (
  <>
    <div className="relative">
      <button
        onClick={() => setShowProfile((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition shadow-sm"
      >
        <FaUserCircle className="text-2xl" />
        <span className="hidden capitalize font-serif md:block font-medium">{user.name}</span>
      </button>

      {showProfile && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-2xl z-50 overflow-hidden animate-slideDown">
          {/* Profile Header */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <FaUserCircle className="text-3xl text-indigo-500" />
            <div>
              <div className="font-semibold capitalize text-xl  font-serif text-gray-800">{user.name}</div>
              <div className="text-lg font-serif text-gray-500 truncate">{user.email}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col">
          
            <button
              onClick={handleLogout}
              className="px-4 py-3 text-left hover:bg-red-50 transition font-serif text-xl font-medium text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>

          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition shadow-sm font-medium"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
