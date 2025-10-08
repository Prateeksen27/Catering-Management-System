import React, { useState, useEffect } from "react";
import img1 from "../assets/info-bar-1.jpg";
import img2 from "../assets/info-bar-2.jpg";
import img3 from "../assets/info-bar-3.jpg";
import img4 from "../assets/info-bar-4.jpg";
import testomonial from "../assets/testimonial-img.png";
import testomonialbg from "../assets/testimonial-bg.png";

const TestimonialSection = () => {
  const testimonials = [
    {
      quote:
        "I am a person who selected Venus catering. Initially I was in a dilemma. Later I felt my decision is right. We ordered 300 breakfast and 300 lunch. Both are awesome. Thank you to Mr. Gurumurthy. Your services are great. Keep up your good work.",
      name: "Prem Kumar Kalyanasundaram",
    },
    {
      quote:
        "Amazing food and excellent service! Everything was beyond our expectations. Will definitely recommend Venus catering to everyone.",
      name: "Sita Ramesh",
    },
    {
      quote:
        "Venus catering made our event so special. The dishes were delicious and beautifully presented.",
      name: "Arun Prakash",
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // keep empty so slider auto runs; add testimonials.length if you change array runtime

  return (
    <div>
      {/* Testimonial Section with guaranteed black fallback + background image */}
      <div
        className="relative text-white flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-12"
        style={{
          // gradient overlay first so the image is darker and text remains readable
          backgroundImage: `linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(${testomonialbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000", // fallback in case image fails
          minHeight: "520px", // adjust to match your design
        }}
      >
        {/* Left Content (z-10 so it sits above background) */}
        <div className="max-w-xl relative z-10">
          <p className="text-sm uppercase tracking-wide text-gray-400">
            Testimonial
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
            What People's Say About us?
          </h2>
          <p className="text-gray-300 mb-6">{testimonials[current].quote}</p>
          <h3 className="font-semibold text-lg">{testimonials[current].name}</h3>

          {/* Arrows + Dots */}
          <div className="flex mt-6 gap-4 items-center">
            <button
              onClick={prevSlide}
              className="bg-yellow-500 text-black w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="bg-yellow-500 text-black w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold"
              aria-label="Next testimonial"
            >
              →
            </button>

            <div className="flex gap-2 ml-4">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-3 h-3 rounded-full ${
                    current === idx ? "bg-yellow-500" : "bg-gray-500"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Image (constant) */}
        <div className="mt-8 md:mt-0 relative z-10">
          <img
            src={testomonial}
            alt="Testimonial person"
            className="rounded-lg w-[300px] md:w-[400px] object-cover"
          />
        </div>

        {/* Optional decorative overlay to make edges darker (keeps background visible) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0) 60%)",
          }}
        />
      </div>

      {/* Stats Section (background images applied to each tile) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-6xl mx-auto py-10 px-6">
        {[
          { value: "25+", label: "Years Of Excellence", img: img1 },
          { value: "250+", label: "Menu Options", img: img2 },
          { value: "340", label: "Staff", img: img3 },
          { value: "125k", label: "Happy Foodies", img: img4 },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl overflow-hidden h-32 bg-cover bg-center"
            style={{ backgroundImage: `url(${stat.img})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
