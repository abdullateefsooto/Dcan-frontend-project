import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  // Remove item from cart
  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Update item quantity
  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: qty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Calculate total price
  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Helper to get image with fallback
  const getImage = (item) => item.image || "https://via.placeholder.com/100";

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {cart.length === 0 ? (
        <div className="text-center mt-20">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-center border p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 flex-1 w-full">
                  <img
                    src={getImage(item)}
                    alt={item.title || item.name}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">{item.title || item.name}</h2>
                    <p className="text-indigo-600 font-bold mt-1">
                      ₦{(item.price || 0).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end mt-4 sm:mt-0">
                  <span className="font-semibold">
                    ₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total and Checkout */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold">Total: ₦{total.toLocaleString()}</h2>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}


