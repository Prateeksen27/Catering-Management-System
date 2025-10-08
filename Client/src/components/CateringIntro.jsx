import React from "react";
import chefImage from "../assets/aboutcater.png"

const CateringIntro = () => {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            A Quality-Driven<br />
            Catering Company
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            We have been one of the successful names in the business when it
            comes to providing catering and services. Our team has completed all
            the events on large and medium scales just the way it has been asked
            by the client. Whether you need service indoors or outdoors, we can
            take care of it just the way you want.
          </p>

          {/* CTA Button */}
          <button className="flex items-center gap-3 border-2 border-gray-800 px-6 py-3 rounded-full text-gray-800 font-semibold hover:bg-gray-100 transition">
            OUR MENU
            <span className="bg-[#7B2D26] text-white w-6 h-6 flex items-center justify-center rounded-full">
              →
            </span>
          </button>
        </div>

        {/* Right: Image */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={chefImage}
            alt="Chef serving Indian food"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CateringIntro;
