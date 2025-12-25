import React from "react";
import { STEPS } from "../assets/constants";

export default function Stepper({ step }) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-center">
      {STEPS.map((s, idx) => {
        const Icon = s.icon;
        const state = idx < step ? "done" : idx === step ? "current" : "todo";

        return (
          <div
            key={s.key}
            className="relative flex md:flex-1 items-start md:items-center"
          >
            {/* Step */}
            <div className="flex items-start md:items-center gap-3">
              <div
                className={
                  "h-11 w-11 shrink-0 rounded-full grid place-items-center border z-10 " +
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
                <div className="text-sm font-medium">{s.title}</div>
                <div className="text-xs text-slate-500 md:block">
                  {s.subtitle}
                </div>
              </div>
            </div>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <>
                {/* Desktop horizontal line */}
                <div className="hidden md:block flex-1 h-px mx-4 bg-slate-200" />

                {/* Mobile vertical line */}
                <div className="absolute left-[22px] top-11 h-full w-px bg-slate-200 md:hidden" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
