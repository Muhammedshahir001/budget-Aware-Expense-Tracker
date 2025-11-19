import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  return (
    <nav className="bg-white shadow mb-4">
      <div className="container flex items-center justify-between py-3">
        <Link to="/dashboard" className="font-bold text-lg">
          Budget Tracker
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/reports" className="text-sm">
            Reports
          </Link>
          <Link to="/categories" className="text-sm">
            Categories
          </Link>
          <Link to="/budgets" className="text-sm">
            Budgets
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
