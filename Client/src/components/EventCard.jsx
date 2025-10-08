import React from "react";

const EventCard = ({ image, title, description }) => {
  return (
    <div className="bg-[#f8f5ef] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <img src={image} alt={title} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
