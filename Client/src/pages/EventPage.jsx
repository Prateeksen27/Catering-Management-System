import React from "react";
import { events } from "../assets/eventData.js";
import EventCard from "../components/EventCard.jsx";
import CoverImage from "../components/CoverImage.jsx";

const EventsPage = () => {
  return (
  <>
   <CoverImage/>
   <section className="max-w-7xl mx-auto px-4 py-12">
         
      <div className="text-center mb-10">
        <p className="uppercase tracking-wider text-sm text-yellow-600 font-medium">What We Do</p>
        <h2 className="text-3xl md:text-4xl font-bold">Premium Catering Services</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <EventCard
            key={index}
            image={event.image}
            title={event.title}
            description={event.description}
          />
        ))}
      </div>
    </section></>
  );
};

export default EventsPage;
