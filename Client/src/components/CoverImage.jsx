import React from "react";
import { useLocation } from "react-router-dom"; // For detecting current route
import other from "../assets/otherpagesbg.jpg";

const AboutUs = () => {
  const location = useLocation();

  // Get the current path without leading slash
  const pathName = location.pathname.replace("/", "") || "About Us";

  // Capitalize first letter
  const pageTitle = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <img
          src={other}
          alt={`${pageTitle} Background`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl font-bold">{pageTitle}</h1>
          <p className="mt-2 text-lg">
            <span className="text-white">Home</span> /{" "}
            <span className="font-semibold">{pageTitle}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
