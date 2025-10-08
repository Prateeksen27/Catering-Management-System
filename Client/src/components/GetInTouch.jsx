import React from "react";
import { MapPin, Mail, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="bg-[#f9f6ef] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="uppercase tracking-wide text-sm text-gray-600">Contact Us</p>
          <h2 className="text-4xl font-bold text-gray-900">Get In Touch</h2>
        </div>

        {/* Map & Details */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Google Map */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.066399050163!2d80.20114937507553!3d12.904036487404363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d1fc32f3b7d%3A0x72241b3fc0adac08!2sVenus%20Catering%20Services!5e0!3m2!1sen!2sin!4v1691412261953!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Details</h3>

              <div className="flex items-start gap-3">
                <MapPin className="text-orange-500 w-5 h-5 mt-1" />
                <p>No.1/379B, Kannagi Street, Jalladianpet, Pallikaranai,<br />
                  Medavakkam, Chennai - 600 100.</p>
              </div>

              <hr className="my-4" />

              <div className="flex items-center gap-3">
                <Mail className="text-orange-500 w-5 h-5" />
                <p>gurumurthty@gmail.com</p>
              </div>

              <hr className="my-4" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Phone className="text-orange-500 w-5 h-5" />
                  <p>+91 98409 35064</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-orange-500 w-5 h-5" />
                  <p>+91 91713 63371</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;