import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {
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
      const res = await API.post("/auth/register", { email, password });

      localStorage.setItem("token", res.data.token);
      toast.success("Registered successfully!");

      setTimeout(() => {
        window.location = "/dashboard";
      }, 600);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 p-4">
      <div
        className="bg-white w-full max-w-md shadow-xl rounded-2xl p-8 animate-fadeIn transform transition-all duration-500 hover:scale-[1.01]"
        style={{ animation: "fadeIn 0.6s ease-in-out" }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Join Budget Tracker to manage your expenses smartly.
        </p>

      
        <div className="mb-4">
          <label className="text-gray-700 font-medium">Email</label>
          <input
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            placeholder="Enter your email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

       
        <div className="mb-4">
          <label className="text-gray-700 font-medium">Password</label>
          <input
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            placeholder="Create password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition transform ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

      
        <div className="my-5 text-center text-gray-400 text-sm">or</div>

        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
