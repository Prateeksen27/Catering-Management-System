import React from "react";
import SectionTitle from "../components/Share/SectionTitle";
import { jsPDF } from "jspdf";

export default function Review({ data, errors, onToggleTerms }) {
  const picked =
    data.menu?.selectedItems &&
    Object.entries(data.menu.selectedItems)
      .flatMap(([cat, arr]) =>
        arr && arr.length ? arr.map((x) => `${x} (${cat})`) : []
      )
      .join(", ");

  const handleDownload = () => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Review & Confirm", 105, 15, { align: "center" });

    let y = 30;

    const addSection = (title) => {
      doc.setFillColor(230, 230, 230);
      doc.rect(10, y - 6, 190, 8, "F");
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.setFont("helvetica", "bold");
      doc.text(title, 12, y);
      y += 10;
    };

    const addField = (label, value) => {
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.text(`${label}:`, 12, y);

      doc.setFont("helvetica", "bold");
      let textLines = doc.splitTextToSize(value || "—", 140);
      doc.text(textLines, 50, y);
      y += textLines.length * 6;
    };

    // Sections
    addSection("Personal Details");
    addField("Full Name", data.personal.fullName);
    addField("Email", data.personal.email);
    addField("Phone", data.personal.phone);

    y += 2;
    addSection("Event Details");
    addField("Event Name", data.event.eventName);
    addField("Guests", String(data.event.guests));
    addField(
      "Date & Time",
      `${data.event.date || "—"} ${data.event.time || ""}`
    );
    addField("Venue", data.event.venue);
    addField("Notes", data.event.notes);

    y += 2;
    addSection("Menu Details")

    if (picked) addField("Selected Dishes", picked);
    if (data.menu.specialRequests)
      addField("Special Requests", data.menu.specialRequests);
    y+=2
    addSection("Estimated Price")
    addField("Price(Approx): ",data.menu.estimatedPrice*(data.event.guests+10))
    y +=2;
    addSection("Amount Paid");
    addField("Total Amount Paid: ", data.payment.totalPricePaid);
    addField("Payment Method: ", data.payment.paymentMethod);
    addField("Transaction ID: ", data.payment.transactionId);
    addField("Percentage Paid: ", ((data.payment.totalPricePaid/(data.menu.estimatedPrice*(data.event.guests+10)))*100).toFixed(2)+"% ");

    doc.save("review_form.pdf");
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Review & Confirm"
        subtitle="Check all details before submitting"
      />

      {/* Personal Details */}
      <div>
        <h3 className="text-lg font-semibold">Personal Details</h3>
        <p><strong>Full Name:</strong> {data.personal.fullName}</p>
        <p><strong>Email:</strong> {data.personal.email}</p>
        <p><strong>Phone:</strong> {data.personal.phone}</p>
      </div>

      {/* Event Details */}
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

      {/* Menu Details */}
      <div>
        <h3 className="text-lg font-semibold">Menu Details</h3>
        {picked && <p><strong>Selected Dishes:</strong> {picked}</p>}
        {data.menu.specialRequests && (
          <p><strong>Special Requests:</strong> {data.menu.specialRequests}</p>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold">Pricing Details</h3>
       
          <p><strong>Estimated Price:</strong> {data.menu.estimatedPrice*(data.event.guests+10)}</p>
      
      </div>
      {/* Payment Details */}
      <div>
        <h3 className="text-lg font-semibold">Payment Details</h3>
        <p><strong>Total Amount Paid:</strong> {data.payment.totalPricePaid}</p>
        <p><strong>Payment Method:</strong> {data.payment.paymentMethod}</p>
        <p><strong>Transaction ID:</strong> {data.payment.transactionId}</p>
        <p><strong>Percentage Paid:</strong> {((data.payment.totalPricePaid/(data.menu.estimatedPrice*(data.event.guests+10)))*100).toFixed(2)}%</p>
      </div>

      {/* Terms Checkbox */}
      <label className="flex items-start gap-3 mt-6">
        <input
          type="checkbox"
          checked={data.termsAccepted}
          onChange={(e) => onToggleTerms(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-slate-300"
        />
        <span className="text-sm text-slate-700">
          I confirm the above details are correct and agree to the terms of
          service & privacy policy.
        </span>
      </label>
      {errors.terms && (
        <p className="text-rose-600 text-sm mt-2">{errors.terms}</p>
      )}

      {/* Download Button at Bottom */}
      <div className="pt-4 border-t mt-6">
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}