import React from "react";

export default function CategoryCard({ item }) {
  const percentage =
    item.total && item.budget
      ? Math.min((item.total / item.budget) * 100, 100)
      : 0;

  return (
    <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {item.categoryName}
        </h3>
        <span className="text-sm text-gray-500">{item.month}</span>
      </div>

      <div className="text-gray-700 mb-1">
        <strong>Budget:</strong> ₹{item.budget || 0}
      </div>

      <div className="text-gray-700 mb-2">
        <strong>Spent:</strong> ₹{item.total || 0}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className={`h-full rounded-full bg-blue-600`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
