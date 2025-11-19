import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));

  useEffect(() => {
    loadDashboard();
    loadCategories();
  }, [month]);

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const loadDashboard = async () => {
    try {
      const res = await API.get(`/reports?month=${month}`);
      setData(res.data);
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  const saveExpense = async () => {
    if (!category || !amount) return toast.error("Fill all fields");

    try {
      const res = await API.post("/expenses", {
        categoryId: category,
        amount,
        date
      });

      toast.success(res.data.status === "over" ? "Over Budget!" : "Expense Added");
      setShowModal(false);
      setAmount("");
      setCategory("");
      loadDashboard();
    } catch {
      toast.error("Failed to add expense");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-6">

       
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="month"
              className="border p-2 rounded w-full sm:w-auto"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 w-full sm:w-auto"
            >
              + Add Expense
            </button>
          </div>
        </div>

      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map(item => {
            const pct = item.budget > 0
              ? Math.min((item.spent / item.budget) * 100, 100)
              : 0;

            return (
              <div
                key={item.categoryId}
                className="p-5 bg-white rounded shadow break-words"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: item.color }}
                  ></div>
                  <h2 className="font-semibold text-lg">{item.category || "Unknown"}</h2>
                </div>

                <p><b>Budget:</b> ₹{item.budget}</p>
                <p><b>Spent:</b> ₹{item.spent}</p>

                <div className="w-full bg-gray-200 h-2 rounded mt-2 overflow-hidden">
                  <div
                    className={`h-2 rounded ${
                      item.spent > item.budget ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-w-full">

            <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

            <label className="block mb-2">Category</label>
            <select
              className="border p-2 rounded w-full mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <label className="block mb-2">Amount</label>
            <input
              type="number"
              className="border p-2 rounded w-full mb-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <label className="block mb-2">Date</label>
            <input
              type="date"
              className="border p-2 rounded w-full mb-4"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={saveExpense}
                className="px-4 py-2 rounded bg-blue-600 text-white shadow"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
