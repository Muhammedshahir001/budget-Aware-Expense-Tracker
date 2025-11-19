import React, { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function Budgets() {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [monthFilter, setMonthFilter] = useState(""); // for month-wise filter
  const [monthInput, setMonthInput] = useState(new Date().toISOString().slice(0, 7)); // for adding budgets


  useEffect(() => {
    loadCategories();
    loadBudgets();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const loadBudgets = async () => {
    try {
      let url = "/budgets";
      if (monthFilter) url += `?month=${monthFilter}`;
      const res = await API.get(url);
      setBudgets(res.data);
    } catch (err) {
      toast.error("Failed to load budgets");
    }
  };

  const saveBudget = async () => {
    if (!categoryId || !amount || !monthInput) {
      return toast.error("Please select category, amount, and month");
    }
    try {
      await API.post("/budgets", { categoryId, amount, month: monthInput });
      toast.success("Budget saved successfully");
      setCategoryId("");
      setAmount("");
      loadBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving budget");
    }
  };


  const handleFilterChange = (e) => {
    setMonthFilter(e.target.value);
  };


  const applyFilter = () => {
    loadBudgets();
  };


  const deleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      await API.delete(`/budgets/${id}`);
      toast.success("Budget deleted");
      loadBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete budget");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Budgets</h1>

       
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Add / Update Budget</h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-100 focus:ring focus:ring-blue-200"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-100 focus:ring focus:ring-blue-200"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Month</label>
                <input
                  type="month"
                  value={monthInput}
                  onChange={(e) => setMonthInput(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-100 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={saveBudget}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Save Budget
              </button>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Filter by Month:</label>
            <input
              type="month"
              value={monthFilter}
              onChange={handleFilterChange}
              className="p-2 border rounded bg-gray-100"
            />
            <button
              onClick={applyFilter}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Apply
            </button>
            <button
              onClick={() => { setMonthFilter(""); loadBudgets(); }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Show All
            </button>
          </div>

      
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {monthFilter ? `Budgets for ${monthFilter}` : "All Budgets"}
          </h2>

          {budgets.length === 0 ? (
            <p className="text-gray-500 text-center">No budgets added.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {budgets.map((b) => (
                <div
                  key={b._id}
                  className="bg-white rounded-xl shadow p-4 flex flex-col transition hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {b.categoryId?.name || "Unknown Category"}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Amount:</span> ₹{b.amount}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{b.month}</p>

               
                  <button
                    onClick={() => deleteBudget(b._id)}
                    className="mt-3 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
