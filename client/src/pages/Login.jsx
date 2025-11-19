import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      setTimeout(() => navigate("/dashboard"), 700);

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
    
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fadeIn"
        style={{ animation: "fadeIn 0.8s ease" }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back 👋
        </h2>

    
        <div className="mb-4">
          <label className="text-gray-700 font-medium text-sm">Email</label>
          <input
            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

       
        <div className="mb-5">
          <label className="text-gray-700 font-medium text-sm">Password</label>
          <input
            className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

    
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white font-medium shadow-md transition-all transform 
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]"}
          `}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

     
        <div className="mt-5 text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </div>
      </div>

     
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
