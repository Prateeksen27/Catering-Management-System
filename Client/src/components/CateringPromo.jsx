import React from "react";
import { ArrowRight } from "lucide-react";

const CateringPromo = () => {
  return (
    <div className="bg-white w-full py-16 px-6 flex justify-center">
      <div className="max-w-5xl">
        {/* Small Heading */}
        <p className="uppercase tracking-widest text-sm font-medium text-gray-700 flex items-center gap-1">
          Hello Everyone <span className="text-yellow-500">•</span>
        </p>

        {/* Main Heading */}
        <h2 className="text-3xl md:text-5xl font-bold mt-3 leading-snug">
          We prepare food just like your home in large quantities. Thats it.{" "}
          <span>Do book us and relax.</span>
        </h2>

        {/* Description */}
        <p className="text-gray-600 mt-4 max-w-3xl">
          We offer personalized catering solutions for all events, ensuring
          every detail is perfect. Contact us for exceptional service and
          exquisite culinary experiences tailored to your needs. Your
          satisfaction is our top priority.
        </p>

        {/* Book Now Button */}
        <div className="mt-6">
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-800 rounded-full hover:bg-gray-100 transition">
            <span className="font-medium">Book Now</span>
            <span className="bg-purple-800 text-white p-2 rounded-full">
              <ArrowRight size={16} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CateringPromo;