import React from "react";
import { STEPS } from "../assets/constants";

export default function Stepper({ step }) {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
      {STEPS.map((s, idx) => {
        const Icon = s.icon;
        const state = idx < step ? "done" : idx === step ? "current" : "todo";
        return (
          <div key={s.key} className="flex items-center w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div
                className={
                  "h-11 w-11 shrink-0 rounded-full grid place-items-center border " +
                  (state === "done"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : state === "current"
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                    : "bg-slate-50 text-slate-500 border-slate-200")
                }
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-medium leading-tight">{s.title}</div>
                <div className="text-xs text-slate-500">{s.subtitle}</div>
              </div>
            </div>
            {idx < STEPS.length - 1 && (
              <div className="hidden md:block h-px w-28 mx-4 bg-slate-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}