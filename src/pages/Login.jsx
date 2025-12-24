import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔐 ADMIN LOGIN CHECK
      if (asAdmin) {
        if (user?.role === "admin") {
          navigate("/admin");
        } else {
          setError("This account does not have admin access.");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-[12px_16px_28px_rgba(37,99,235,0.5)] mt-20 p-6">
      <h2 className="text-2xl font-bold text-indigo-600 font-serif mb-4">
        Welcome back
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-3 border rounded focus:border-[#140c45] focus:shadow-[0_0_5px_rgba(20,12,69,0.3)] focus:outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-3 border rounded focus:border-[#140c45] focus:shadow-[0_0_5px_rgba(20,12,69,0.3)] focus:outline-none"
        />

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={asAdmin}
            onChange={(e) => setAsAdmin(e.target.checked)}
          />
          <span>Login as admin</span>
        </label>

        {error && <div className="text-red-500 font-semibold">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded font-bold font-serif hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center text-sm">
          <p>Don't have an account?</p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded font-bold font-serif hover:bg-blue-600"
          >
            Register Now!
          </button>
        </div>
      </form>
    </div>
  );
}
