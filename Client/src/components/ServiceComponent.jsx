import React from "react";
import weddingImg from "../assets/wedding.jpg";
import corporateImg from "../assets/corporate.jpg";
import birthdayImg from "../assets/birthday.jpg";
import { ArrowRight } from "lucide-react";

const Services = () => {
  return (
    <section className="py-16 bg-white">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="uppercase tracking-wide text-gray-500 text-sm">
          What We Do.
        </p>
        <h2 className="text-4xl font-bold text-gray-900">
          Premium catering services
        </h2>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Wedding Event */}
        <div className="bg-[#f8f2e9] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
          <img
            src={weddingImg}
            alt="Wedding Event"
            className="w-full h-56 object-cover rounded-t-[1.5rem]"
          />
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3 underline underline-offset-4 decoration-yellow-700">
              Wedding Event
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Wedding. Why we have the concept of inviting all our relatives,
              friends and known ones? Its because, when a family celebrates an
              event means, its an occasion, when lot of people celebrates an
              event means, it turns as a feast. If there any feast occurs
              without food?? We are here to make a memorable experience for your
              guests by pampering their taste buds.
            </p>
          </div>
        </div>

        {/* Corporate Event */}
        <div className="bg-[#f8f2e9] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
          <img
            src={corporateImg}
            alt="Corporate Event"
            className="w-full h-56 object-cover rounded-t-[1.5rem]"
          />
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3 underline underline-offset-4 decoration-yellow-700">
              Corporate Event
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              From corporate events to business occasions or milestone
              celebrations, our event catering team captures the heart of their
              audiences on their special occasions. We focus on delivering the
              customized delicacies of different types. We make sure all the
              audience feel good about the food too and that make your event
              unique.
            </p>
          </div>
        </div>

        {/* Birthday Party */}
        <div className="bg-[#f8f2e9] rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
          <img
            src={birthdayImg}
            alt="Birthday Party"
            className="w-full h-56 object-cover rounded-t-[1.5rem]"
          />
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3 underline underline-offset-4 decoration-yellow-700">
              Birthday Party
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Make every birthday a memorable one with our birthday photography.
              Whether it’s a child's first birthday or a milestone celebration,
              we capture the joy, excitement, and love of the day and preserve
              it forever. At Venus Catering Service, we take care of the
              happiness of your guests by offering them amazing food on behalf
              of you.
            </p>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center mt-12">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-900 font-semibold hover:bg-gray-100 transition duration-300">
          View All Services
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default Services;
