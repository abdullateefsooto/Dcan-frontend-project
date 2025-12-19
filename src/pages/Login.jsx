import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await api.post("/auth/login", { email, password });
      // backend should return token + user info including isAdmin flag
      // example response: { token, user: { id, email, isAdmin } }
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if(asAdmin){
        if(user?.role === "admin"){
          navigate("/admin");
        } else {
          setError("This account is not an admin.");
        }
      } else {
        navigate("/");
      }
    }catch(err){
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-[12px_16px_28px_rgba(37,99,235,0.5)] mt-20 p-6">
      <h2 className="text-2xl font-bold text-indigo-600 font-serif mb-4">Welcome back</h2>
      <form onSubmit={submit} className="space-y-4">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded focus:border-[#140c45] focus:shadow-[0_0_5px_rgba(20,12,69,0.3)] focus:outline-none"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 border rounded focus:border-[#140c45] focus:shadow-[0_0_5px_rgba(20,12,69,0.3)] focus:outline-none"/>
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={asAdmin} onChange={e=>setAsAdmin(e.target.checked)} />
          <span>Login as admin</span>
        </label>
        {error && <div className="text-red-500">{error}</div>}
        <button className="w-full py-3 bg-indigo-600 text-white rounded font-bold font-serif hover:bg-blue-600">Login</button>
        <p>
            Don't have an account? 
        </p>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded font-bold font-serif hover:bg-blue-600" onClick={() => navigate("/Register")}>Register Now! </button>
      </form>
    </div>
  )
}
