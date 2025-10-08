import React from 'react'
import HeroSection from "../components/HeroSection.jsx"
import AboutUs from "../components/AboutUsComponent.jsx";
import Service from "../components/ServiceComponent.jsx";
import GuestSpeech from "../components/GuestSpeech.jsx";
import Testomonial from "../components/Testomonial.jsx";
import Footer from "../components/Footer.jsx";



const LandingPage = () => {
 
  return (
    <div>
    <HeroSection/>
    <AboutUs />
    <Service/>
    <GuestSpeech/>
    <Testomonial/>
    </div>
  )
}

export default LandingPage;