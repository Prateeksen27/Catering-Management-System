import React from "react";
import SectionTitle from "../components/Share/SectionTitle";
import { jsPDF } from "jspdf";

export default function Review({ data, errors, onToggleTerms }) {

  /* =========================
     Predefined menu items
  ========================= */
  const picked =
    data.menu?.selectedItems &&
    Object.entries(data.menu.selectedItems)
      .flatMap(([cat, arr]) =>
        arr && arr.length ? arr.map((x) => `${x} (${cat})`) : []
      )
      .join(", ");

  /* =========================
     Custom menu items (grouped)
  ========================= */
  const customPicked =
    data.menu?.customMenuItems &&
    Object.entries(
      data.menu.customMenuItems.reduce((acc, item) => {
        acc[item.category] = acc[item.category] || [];
        acc[item.category].push(item.name);
        return acc;
      }, {})
    )
      .flatMap(([cat, items]) =>
        items.map((name) => `${name} (${cat})`)
      )
      .join(", ");

  /* =========================
     PDF Download
  ========================= */
  const handleDownload = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  let y = 20;

  /* =========================
     Helpers
  ========================= */
  const addTitle = (text) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(33, 37, 41);
    doc.text(text, pageWidth / 2, y, { align: "center" });
    y += 12;
  };

  const addDivider = () => {
    doc.setDrawColor(200);
    doc.line(10, y, pageWidth - 10, y);
    y += 6;
  };

  const addSection = (title) => {
    doc.setFillColor(240, 245, 255);
    doc.rect(10, y - 6, pageWidth - 20, 9, "F");

    doc.setFontSize(14);
    doc.setTextColor(13, 110, 253);
    doc.setFont("helvetica", "bold");
    doc.text(title, 14, y);
    y += 12;
  };

  const addField = (label, value) => {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60);
    doc.text(label, 14, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(20);
    const lines = doc.splitTextToSize(value || "—", pageWidth - 70);
    doc.text(lines, 70, y);
    y += lines.length * 6;
  };

  const addList = (items) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(20);

    items.forEach((item) => {
      doc.circle(16, y - 1.5, 1, "F");
      const lines = doc.splitTextToSize(item, pageWidth - 40);
      doc.text(lines, 20, y);
      y += lines.length * 6;
    });
  };

  /* =========================
     PDF Content
  ========================= */
  addTitle("Review & Confirmation");
  addDivider();

  addSection("Personal Details");
  addField("Full Name", data.personal.fullName);
  addField("Email", data.personal.email);
  addField("Phone", data.personal.phone);

  addSection("Event Details");
  addField("Event Name", data.event.eventName);
  addField("Guests", String(data.event.guests));
  addField(
    "Date & Time",
    `${data.event.date || "—"} ${data.event.time || ""}`
  );
  addField("Venue", data.event.venue);
  addField("Notes", data.event.notes);

  addSection("Menu Details");

  if (picked) {
    addField("Selected Dishes", "");
    addList(picked.split(", "));
  }

  if (customPicked) {
    y += 2;
    addField("Custom Menu Items", "");
    addList(customPicked.split(", "));
  }

  if (data.menu.specialRequests) {
    addField("Special Requests", data.menu.specialRequests);
  }

  /* =========================
     Pricing Summary
  ========================= */
  const estimatedTotal =
    data.menu.estimatedPrice * (data.event.guests + 10);

  y += 4;
  addSection("Pricing Summary");

  doc.setFillColor(230, 250, 240);
  doc.rect(14, y - 6, pageWidth - 28, 14, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20, 120, 80);
  doc.text(
    `Estimated Total Amount: ₹${estimatedTotal}`,
    pageWidth / 2,
    y + 3,
    { align: "center" }
  );

  y += 18;

  addSection("Payment Details");
  addField("Amount Paid", `₹${data.payment.totalPricePaid}`);
  addField("Payment Method", data.payment.paymentMethod);
  addField("Transaction ID", data.payment.transactionId);
  addField(
    "Percentage Paid",
    `${(
      (data.payment.totalPricePaid / estimatedTotal) *
      100
    ).toFixed(2)}%`
  );

  /* =========================
     Footer
  ========================= */
  y = doc.internal.pageSize.height - 15;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "This is a system-generated document. Prices are approximate and subject to confirmation.",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  doc.save("review_form.pdf");
};


  return (
    <div className="space-y-6">
      <SectionTitle
        title="Review & Confirm"
        subtitle="Check all details before submitting"
      />

      {/* Personal */}
      <div>
        <h3 className="text-lg font-semibold">Personal Details</h3>
        <p><strong>Full Name:</strong> {data.personal.fullName}</p>
        <p><strong>Email:</strong> {data.personal.email}</p>
        <p><strong>Phone:</strong> {data.personal.phone}</p>
      </div>

      {/* Event */}
      <div>
        <h3 className="text-lg font-semibold">Event Details</h3>
        <p><strong>Event Name:</strong> {data.event.eventName}</p>
        <p><strong>Guests:</strong> {data.event.guests}</p>
        <p>
          <strong>Date & Time:</strong>{" "}
          {data.event.date} {data.event.time}
        </p>
        <p><strong>Venue:</strong> {data.event.venue}</p>
        <p><strong>Notes:</strong> {data.event.notes}</p>
      </div>

      {/* Menu */}
      <div>
        <h3 className="text-lg font-semibold">Menu Details</h3>
        {picked && (
          <p><strong>Selected Dishes:</strong> {picked}</p>
        )}
        {customPicked && (
          <p><strong>Custom Menu Items:</strong> {customPicked}</p>
        )}
        {data.menu.specialRequests && (
          <p>
            <strong>Special Requests:</strong>{" "}
            {data.menu.specialRequests}
          </p>
        )}
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-lg font-semibold">Pricing Details</h3>
        <p>
          <strong>Estimated Price:</strong>{" "}
          ₹{data.menu.estimatedPrice * (data.event.guests + 10)}
        </p>
      </div>

      {/* Payment */}
      <div>
        <h3 className="text-lg font-semibold">Payment Details</h3>
        <p><strong>Total Paid:</strong> ₹{data.payment.totalPricePaid}</p>
        <p><strong>Payment Method:</strong> {data.payment.paymentMethod}</p>
        <p><strong>Transaction ID:</strong> {data.payment.transactionId}</p>
        <p>
          <strong>Percentage Paid:</strong>{" "}
          {(
            (data.payment.totalPricePaid /
              (data.menu.estimatedPrice * (data.event.guests + 10))) *
            100
          ).toFixed(2)}
          %
        </p>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 mt-6">
        <input
          type="checkbox"
          checked={data.termsAccepted}
          onChange={(e) => onToggleTerms(e.target.checked)}
          className="mt-1 h-5 w-5"
        />
        <span className="text-sm text-slate-700">
          I confirm the above details are correct and agree to the terms.
        </span>
      </label>

      {errors.terms && (
        <p className="text-rose-600 text-sm">{errors.terms}</p>
      )}

      {/* Download */}
      <div className="pt-4 border-t">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
