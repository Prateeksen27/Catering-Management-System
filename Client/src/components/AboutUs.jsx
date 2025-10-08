import React from "react";
import paneerTikkaImage from "../assets/about3.jpg";
import indianFeastImage from "../assets/aboutus.jpg";
import newabout from "../assets/newabout.jpg";
import newabout1 from "../assets/newabout1.jpg";


const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Images */}
          <div className="relative">
            {/* Since 1998 Badge */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-[#7B2D26] text-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-lg border-[6px] border-yellow-400">
                <span className="text-sm">Since</span>
                <span className="text-2xl font-bold">1998</span>
              </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4 mt-16">
              <div className="h-[240px] md:h-[500px] rounded-3xl overflow-hidden shadow-md">
                <img
                  src={newabout}
                  alt="Event catering table"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-8 h-[240px] md:h-[500px] rounded-3xl overflow-hidden shadow-md">
                <img
                  src={newabout1}
                  alt="Catering event"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="space-y-6">
            <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
              About Us
              <span className="inline-block ml-2 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </p>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Indulge in a celebration with great food!
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              Venus Catering Service is a professional catering company that was
              established in 1998, offering comprehensive services to meet all
              your culinary needs. Our primary goal is to provide a unique and
              memorable dining experience with each meal we serve.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              We are committed to maintaining uncompromised quality, exceptional
              hygiene standards, meticulous presentation, and attention to
              detail to ensure the utmost satisfaction of our customers.
            </p>

            {/* CTA Button */}
            <div>
              <button className="flex items-center gap-2 border-2 border-gray-900 px-6 py-3 rounded-full text-gray-900 font-medium hover:bg-gray-100 transition">
                Book Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
