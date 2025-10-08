import React from "react";

export const StatCard = ({ icon, value, label }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4 text-yellow-600">{icon}</div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};
