import React from "react";
import SectionTitle from "../components/Share/SectionTitle";
import Field from "../components/Share/Field";

export default function PersonalForm({ data, errors, onChange }) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <SectionTitle
        title="Personal Information"
        subtitle="Tell us how we can reach you"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Field label="Full Name" error={errors.fullName} required>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="w-full rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all px-4 py-2 text-slate-700 placeholder-slate-400"
            placeholder="e.g., Gouranga Sahoo"
          />
        </Field>
        <Field label="Email" error={errors.email} required>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all px-4 py-2 text-slate-700 placeholder-slate-400"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Phone" error={errors.phone} required>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="w-full rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all px-4 py-2 text-slate-700 placeholder-slate-400"
            placeholder="+91 98765 43210"
          />
        </Field>
      </div>
    </div>
  );
}