import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Reports() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [report, setReport] = useState([]);

 
  useEffect(() => {
    loadReport();
  }, [month]);

  const loadReport = async () => {
    try {
      const res = await API.get(`/reports?month=${month}`);
      setReport(res.data);
    } catch (err) {
      toast.error("Failed to load report");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">

        
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Monthly Reports
          </h1>

         
          <div className="bg-white shadow rounded-xl p-5 mb-8 flex items-center gap-4">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border p-2 rounded-lg bg-gray-100"
            />
            <button
              onClick={loadReport}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Load
            </button>
          </div>

         
          {report.length === 0 ? (
            <p className="text-gray-500 text-center">No report data available.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {report.map((item) => (
                <div key={item.categoryId} className="p-5 bg-white rounded shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ background: item.color }}
                    ></div>
                    <h2 className="font-semibold text-lg">{item.category}</h2>
                    {item.status === "over" && (
                      <span className="ml-auto text-red-600 font-bold">OVER BUDGET</span>
                    )}
                  </div>
                  <p><b>Budget:</b> ₹{item.budget}</p>
                  <p><b>Spent:</b> ₹{item.spent}</p>
                  <p><b>Remaining:</b> ₹{item.remaining}</p>

                  <div className="w-full bg-gray-200 h-2 rounded mt-2">
                    <div
                      className={`h-2 rounded ${
                        item.status === "over" ? "bg-red-500" : "bg-green-500"
                      }`}
                      style={{
                        width: `${
                          item.budget > 0
                            ? Math.min((item.spent / item.budget) * 100, 100)
                            : 0
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
