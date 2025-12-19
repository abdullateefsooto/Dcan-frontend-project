import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role: isAdmin ? "admin" : "user",
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mt-20 mx-auto bg-white rounded-xl shadow-[12px_16px_30px_rgba(37,99,235,0.5)]
 p-6">
      <h2 className="text-2xl font-bold text-indigo-600 font-serif capitalize mb-4">Create account</h2>
      <form onSubmit={submit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full focus:border-[#140c45] focus:shadow-[0_0_5px_rgba(20,12,69,0.3)] focus:outline-none p-3 border rounded" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded focus:border-[#140c45] focus:shadow-[0_0_5px_rgba(20,12,69,0.3)] focus:outline-none" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 border rounded focus:border-[#140c45] focus:shadow-[0_0_5px_rgba(20,12,69,0.3)] focus:outline-none" />
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
          <span>Register as Admin</span>
        </label>
        {error && <div className="text-red-500">{error}</div>}
        <button className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 font-bold font-serif">Register</button>
      </form>
    </div>
  );
}
