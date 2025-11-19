import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function ExpenseForm({ onClose, onSaved }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  useEffect(()=>{ API.get('/categories').then(r=>setCategories(r.data)); }, []);

  const save = async () => {
    if(!categoryId || !amount) return alert("Select category and amount");
    const res = await API.post("/expenses", { categoryId, amount: Number(amount), date });
    alert(res.data.status === "over" ? "⚠ Over budget" : "✓ Within budget");
    onSaved && onSaved();
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-md">
        <h3 className="font-bold mb-3">Add Expense</h3>
        <select className="w-full p-2 border rounded mb-2" onChange={e=>setCategoryId(e.target.value)}>
          <option value="">Select category</option>
          {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input className="w-full p-2 border rounded mb-2" placeholder="Amount" type="number" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input className="w-full p-2 border rounded mb-2" type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white p-2 rounded" onClick={save}>Save</button>
          <button className="flex-1 border p-2 rounded" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
