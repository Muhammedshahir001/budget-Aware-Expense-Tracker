import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Expenses() {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [monthFilter, setMonthFilter] = useState("");

  useEffect(() => {
    loadCategories();
    loadExpenses();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const loadExpenses = async (month) => {
    try {
      let url = "/expenses";
      if (month) url += `?month=${month}`;
      const res = await API.get(url);
      setList(res.data);
    } catch {
      toast.error("Failed to load expenses");
    }
  };

  const save = async () => {
    if (!categoryId || !amount) {
      toast.error("All fields required");
      return;
    }

    try {
      await API.post("/expenses", { categoryId, amount, date });
      toast.success("Expense Added");
      setAmount("");
      setCategoryId("");
      loadExpenses(monthFilter);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add expense");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await API.delete("/expenses/" + id);
      toast.success("Expense deleted");
      loadExpenses(monthFilter);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Expenses</h1>

          
        <div className="card p-5 mb-6">
          <h2 className="text-xl font-semibold mb-3">Add Expense</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="border p-2 rounded"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="border p-2 rounded"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              type="date"
              className="border p-2 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={save}
          >
            Save Expense
          </button>
        </div>

    
        <div className="mb-4 flex gap-2 items-center">
          <label>Filter by Month:</label>
          <input
            type="month"
            className="border p-2 rounded"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          />
          <button
            onClick={() => loadExpenses(monthFilter)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Apply
          </button>
          <button
            onClick={() => { setMonthFilter(""); loadExpenses(); }}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Show All
          </button>
        </div>

        
        <div className="grid gap-3">
          {list.map((item) => (
            <div key={item._id} className="card p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.categoryId?.name || "Unknown Category"}</p>
                <p className="text-sm text-gray-500">{new Date(item.date).toISOString().substr(0,10)}</p>
                <p className="font-bold mt-1">₹{item.amount}</p>
              </div>
              <button
                className="text-red-600 font-semibold"
                onClick={() => remove(item._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
