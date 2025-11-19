import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Categories() {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#3b82f6");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await API.get("/categories");
      setList(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  async function add() {
    if (!name.trim()) {
      return toast.error("Category name is required");
    }

    try {
      await API.post("/categories", { name, color });
      toast.success("Category added successfully");
      setName("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  }

  async function remove(id) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await API.delete(`/categories/${id}`);
      toast.success("Category deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="max-w-2xl mx-auto">

       
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Categories</h1>

       
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Category</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category Name
                </label>
                <input
                  className="w-full p-2 border bg-gray-100 rounded-lg focus:ring focus:ring-blue-200"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  className="w-full h-[42px] rounded cursor-pointer border"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

        
            <div className="mt-4 flex justify-end">
              <button
                onClick={add}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Add Category
              </button>
            </div>
          </div>

        
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Categories</h2>

          {loading ? (
            <p className="text-gray-500 text-center">Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-gray-500 text-center">No categories added yet.</p>
          ) : (
            <div className="grid gap-3">
              {list.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-xl shadow p-4 flex items-center justify-between hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        background: c.color,
                        borderRadius: 6,
                      }}
                    />
                    <div className="text-gray-800 font-medium">{c.name}</div>
                  </div>

                  <button
                    className="text-red-600 font-medium hover:underline"
                    onClick={() => remove(c._id)}
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
