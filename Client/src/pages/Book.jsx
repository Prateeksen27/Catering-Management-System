import React, { useMemo, useState, useEffect } from "react";
import Stepper from "../components/Stepper";
import PersonalForm from "../components/PersonalForm";
import EventForm from "../components/EventForm";
import MenuForm from "../components/MenuForm";
import Review from "../components/Review";
import { STEPS, initialData } from "../assets/constants";
import { Check } from "lucide-react"; 
import { clientAuthStore } from "../store/clientStore";
import PaymentForm from "../components/PaymentForm";

export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(() => {
    return initialData;
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const {sendBooking} = clientAuthStore()
  useEffect(() => {
    localStorage.setItem("catering_booking_draft", JSON.stringify(data));
  }, [data]);

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  function update(path, value) {
    setData((prev) => {
      const next = structuredClone(prev);
      let ptr = next;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (ptr[key] == null || typeof ptr[key] !== "object") {
          ptr[key] = {};
        }
        ptr = ptr[key];
      }
      ptr[path[path.length - 1]] = value;
      return next;
    });
  }

  function validate(currentStep = step) {
    const e = {};
    if (currentStep === 0) {
      if (!data.personal.fullName.trim()) e.fullName = "Full name is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email)) e.email = "Valid email required";
      if (!/^\+?[0-9\-()\s]{7,}$/.test(data.personal.phone)) e.phone = "Valid phone required";
    }
    if (currentStep === 1) {
      if (!data.event.eventName) e.eventName = "Event name is required";
      if (!data.event.date) e.date = "Event date is required";
      if (!data.event.time) e.time = "Event time is required";
      if (!data.event.guests || Number(data.event.guests) <= 0) e.guests = "Guests must be > 0";
      if (!data.event.venue.trim()) e.venue = "Venue is required";
    }
    if (currentStep === 2) {
      const anyCategoryToggle = Object.values(data.menu.items || {}).some(Boolean);
      const anyDishPicked = Object.values(data.menu.selectedItems || {}).some(
        (arr) => Array.isArray(arr) && arr.length > 0
      );
      if (!anyCategoryToggle && !anyDishPicked) {
        e.menu = "Select at least one menu item.";
      }
    }
    if (currentStep === 4) {
      if (!data.termsAccepted) e.terms = "Please accept terms to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onNext() {
    if (!validate(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function onBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function fakeSubmit(payload) {
    await new Promise((r) => setTimeout(r, 1200));
  }

  async function onSubmit() {
    if (!validate(4)) return;
    setSubmitting(true);
    try {
      console.log(data)
      const payload = { ...data, createdAt: new Date().toISOString() };
      await fakeSubmit(payload);
       sendBooking(data)
      setSubmitted(true);
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-start md:items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold">Booking Confirmed</h1>
          <p className="text-slate-600 mt-2">We've received your request. Our team will contact you shortly to finalize details.</p>
          <button
            className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setData(initialData);
            }}
          >
            Make another booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/60">
      <header className="pt-10 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Event Booking</h1>
        <p className="text-slate-600 mt-2">Complete your booking in a few simple steps</p>
      </header>

      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* Stepper */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <Stepper step={step} />
          {/* Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-slate-600"><span>Progress</span><span>{Math.round(progress)}% Complete</span></div>
            <div className="mt-2 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-4 md:p-8">
          {step === 0 && (
            <PersonalForm data={data.personal} errors={errors} onChange={(k, v) => update(["personal", k], v)} />
          )}
          {step === 1 && (
            <EventForm data={data.event} errors={errors} onChange={(k, v) => update(["event", k], v)} />
          )}
          {step === 2 && (
            <MenuForm data={data.menu} errors={errors} onChange={(path, v) => update(["menu", ...path], v)} />
          )}
          {step==3 && (
            <PaymentForm  data={data.payment} extra={data} errors={errors} onChange={(k,v)=>update(["payment",k],v)} />
          )}
          {step === 4 && (
            <Review data={data} errors={errors} onToggleTerms={(v) => update(["termsAccepted"], v)} />
          )}
          

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-between">
            <div className="flex gap-3">
              <button
                onClick={onBack}
                disabled={step === 0}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={() => setData(initialData)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700"
              >
                Reset
              </button>
            </div>

            {step < 4 ? (
              <button onClick={onNext} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
                Continue
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Confirm Booking"}
              </button>
            )}
          </div>
        </div>

        <footer className="py-10 text-center text-xs text-slate-500">© {new Date().getFullYear()} Your Catering Co.</footer>
      </div>
    </div>
  );
}