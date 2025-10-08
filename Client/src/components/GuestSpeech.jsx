import React from "react";
import n1 from "../assets/n1.png";
import n2 from "../assets/n2.png";
import n3 from "../assets/n3.png";
import n4 from "../assets/n4.png";

const WhyChooseUs = () => {
  const features = [
    {
      icon: n1,
      title: "Authentic Taste",
      description: "Enjoy our traditional recipes, inspired by rich culinary heritage.",
    },
    {
      icon: n2,
      title: "Service Excellence",
      description: "Outstanding service and unforgettable experiences.",
    },
    {
      icon: n3,
      title: "Best Quality",
      description: "Top quality standards, excellence in every bite.",
    },
    {
      icon: n4,
      title: "Heritage",
      description: "Venus caterings blends food and heart, rooted in family traditions.",
    },
  ];

  return (
    <div className="flex flex-col items-center py-16 px-6 bg-white">
      <p className="text-sm uppercase tracking-wide text-gray-500">
        Why Choose Us
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-center mt-2 mb-12">
        Leave Your Guests Speechless With <br /> Our Fabulous Food!
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full">
        {features.map((feature, index) => (
          <div
            key={index}
            className="border-4 rounded-md p-6 text-center border-gradient bg-white" // Changed border-2 to border-4
          >
            <div className="flex justify-center mb-4">
              <img src={feature.icon} alt={feature.title} className="h-14" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .border-gradient {
          border-image: linear-gradient(to right, #f59e0b, #c026d3) 1;
          border-style: solid;
          border-width: 4px; /* Thicker border */
        }
      `}</style>
    </div>
  );
};

export default WhyChooseUs;
