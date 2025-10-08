import React from "react";
import SectionTitle from "../components/Share/SectionTitle";
import Field from "../components/Share/Field";

export default function EventForm({ data, errors, onChange }) {
  return (
    <div>
      <SectionTitle
        title="Event Information"
        subtitle="Tell us about your event so we can prepare accordingly"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Field label="Event Name" error={errors.type} required>
          <input
            type="text"
            value={data.eventName}
            onChange={(e) => onChange("eventName",e.target.value)}
            placeholder="Enter your event name"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
          />
        </Field>

        <Field label="Number of Guests" error={errors.guests} required>
          <input
            type="number"
            min={1}
            value={data.guests}
            onChange={(e) => onChange("guests", Number(e.target.value))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
          />
        </Field>

        <Field label="Event Date" error={errors.date} required>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
          />
        </Field>

        <Field label="Event Time" error={errors.time} required>
          <input
            type="time"
            value={data.time}
            onChange={(e) => onChange("time", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
          />
        </Field>

        <Field label="Venue Address" error={errors.venue} required>
          <input
            type="text"
            value={data.venue}
            onChange={(e) => onChange("venue", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Hall/Address, City"
          />
        </Field>

        <Field label="Notes (Optional)">
          <textarea
            rows={3}
            value={data.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition resize-none"
            placeholder="Any special instructions"
          />
        </Field>
      </div>
    </div>
  );
}