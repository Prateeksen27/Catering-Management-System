import React from "react";
import founderImg from "../assets/nepa.jpg";
import ceoImg from "../assets/pikun.jpg";

const TeamSection = () => {
  return (
    <section className="py-16 bg-white">
      {/* Section Title */}
      <div className="text-center mb-12 px-4">
        <p className="text-sm font-medium uppercase text-gray-500 tracking-wider">
          Always Quality
          <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full ml-2 align-middle"></span>
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mt-2">Our Team</h2>
      </div>

      {/* Team Members */}
      <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-2">
        {/* Founder Card */}
        <div className="bg-[#f8f5f0] rounded-xl overflow-hidden shadow-md text-center">
          <div className="relative">
            <img
              src={founderImg}
              alt="Founder"
              className="w-full h-[300px] md:h-[400px] object-center"
            />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-[#7B2D26] text-white px-4 py-1 rounded-md text-sm font-bold shadow-md">
              FOUNDER
            </div>
          </div>
          <div className="mt-12 px-6 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              Nepa
            </h3>
            <p className="text-gray-600 text-sm">
              B.SC., M.B.A., M.T.M., M.Phil., Ph.D[p].
            </p>
          </div>
        </div>

        {/* CEO Card */}
        <div className="bg-[#f8f5f0] rounded-xl overflow-hidden shadow-md text-center">
          <div className="relative">
            <img
              src={ceoImg}
              alt="CEO"
              className="w-full h-[300px] md:h-[400px] object-center"
            />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-[#7B2D26] text-white px-4 py-1 rounded-md text-sm font-bold shadow-md">
              CEO
            </div>
          </div>
          <div className="mt-12 px-6 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-1">Gouranga Sahoo</h3>
            <p className="text-gray-600 text-sm">B.E</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
