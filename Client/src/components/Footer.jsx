import React from "react";
import {
  Facebook,
  Instagram,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  MessageCircle
} from "lucide-react";

import logo from "../assets/logo.jpeg"; // Change to your actual logo path

const Footer = () => {
  const mainIconStyle = {
    backgroundColor: "#e6c200", // slightly softer golden
    padding: "8px", // slightly less padding to match smaller size
    borderRadius: "50%",
    color: "#000",
    width: "36px", // smaller circle
    height: "36px"
  };

  const servicesCol1 = [
    "Wedding Event",
    "60th Wedding Event",
    "70th Wedding Event",
    "80th Wedding Event",
    "Engagement",
    "Seemantham"
  ];

  const servicesCol2 = [
    "Annaprasana",
    "Birthday Party",
    "House Warming",
    "Mehndi Function",
    "Corporate Events",
    "Retirement Function"
  ];

  return (
    <div>
      {/* Marquee Section */}
      <div
        style={{
          background: "#a31641",
          color: "white",
          height: "40px",
          display: "flex",
          alignItems: "center"
        }}
      >
        <marquee
          behavior="scroll"
          direction="left"
          scrollAmount="6"
          style={{ fontSize: "18px", fontWeight: "600" }}
        >
          House warming • Mehndi • Corporate • Retirement • Wedding • Anniversary
          • Engagement • Seemantham • Annaprasana • Birthday
        </marquee>
      </div>

      {/* Footer Section */}
      <footer style={{ backgroundColor: "#000", color: "#fff", padding: "50px 20px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            maxWidth: "1200px",
            margin: "auto",
            gap: "30px"
          }}
        >
          {/* Left Section */}
          <div style={{ flex: "1 1 300px", textAlign: "center" }}>
            <img
              src={logo}
              alt="VS Logo"
              style={{ width: "100px", height: "auto", marginBottom: "20px" }}
            />
            <p style={{ fontSize: "15px", lineHeight: "1.6" }}>
              Let Venus Catering transform your special occasion into a masterpiece
              with our professional touch.
            </p>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                gap: "15px"
              }}
            >
              <a href="#"><Facebook size={20} style={mainIconStyle} /></a>
              <a href="#"><Instagram size={20} style={mainIconStyle} /></a>
              <a href="#"><MessageCircle size={20} style={mainIconStyle} /></a>
            </div>
          </div>

          {/* Middle Section (Two Columns for Services) */}
          <div style={{ flex: "1 1 250px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>Our Services</h3>
            <div style={{ display: "flex", gap: "20px" }}>
              <ul style={{ listStyle: "none", padding: 0, fontSize: "15px" }}>
                {servicesCol1.map((service, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      lineHeight: "2"
                    }}
                  >
                    <ArrowRight size={16} /> {service}
                  </li>
                ))}
              </ul>
              <ul style={{ listStyle: "none", padding: 0, fontSize: "15px" }}>
                {servicesCol2.map((service, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      lineHeight: "2"
                    }}
                  >
                    <ArrowRight size={16} /> {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div style={{ flex: "1 1 300px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "15px" }}>Contact Now</h3>
            <p style={{ fontSize: "15px", lineHeight: "2", display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={20} style={mainIconStyle} /> No.1/379B, Kannagi Street, Jalladianpet,
              Pallikaranai, Medavakkam, Chennai - 600 100.
            </p>
            <p style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Phone size={20} style={mainIconStyle} /> +91 98409 35064
            </p>
            <p style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Phone size={20} style={mainIconStyle} /> +91 91713 63371
            </p>
            <p style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={20} style={mainIconStyle} /> gurumurthy@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "14px",
            borderTop: "1px solid #333",
            paddingTop: "12px"
          }}
        >
          © 2024 <strong>Venus Caterings</strong> All rights reserved | Designed
          By <span style={{ color: "orange" }}>Olivegrapes</span>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
