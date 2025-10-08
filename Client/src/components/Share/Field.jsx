import React from "react";

export default function Field({ label, error, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="text-rose-600 text-sm mt-1">{error}</p>}
    </label>
  );
}