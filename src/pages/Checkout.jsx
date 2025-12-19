import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const payWithPaystack = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/paystack/initialize", {
        amount: totalAmount * 100, // in kobo
        email: "customer@example.com", // replace with logged-in user email
      });

      const { authorization_url } = res.data.data;
      window.location.href = authorization_url;
    } catch (err) {
      setMessage(
        "Payment error: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Checkout</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-indigo-600">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-lg flex items-center justify-between">
              <p className="text-xl font-bold">Total:</p>
              <p className="text-2xl font-bold text-indigo-700">
                ₦{totalAmount.toLocaleString()}
              </p>
            </div>

            <button
              onClick={payWithPaystack}
              disabled={loading}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg text-lg font-semibold shadow"
            >
              {loading ? "Processing..." : "Pay with Paystack"}
            </button>

            {message && (
              <p className="mt-4 text-center text-red-500">{message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}


fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add <name> <url>

and then push using the remote name

    git push <name>

PS C:\Users\PC\Desktop\dcan-project> ^C             
PS C:\Users\PC\Desktop\dcan-project> ^C
PS C:\Users\PC\Desktop\dcan-project> ^C