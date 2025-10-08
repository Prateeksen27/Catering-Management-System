import { useState } from 'react'
import Header from "./components/Header.jsx";
import LandingPage from './pages/LandingPage.jsx';
import EventsPage from './pages/EventPage.jsx';
import { Routes, Route } from 'react-router-dom';
import About from './pages/AboutPage.jsx';
import Footer from './components/Footer.jsx';
import Gallery from './pages/Gallery.jsx';
import ContactUsPage from './pages/ContactUsPage.jsx';
import BookingWizard from './pages/Book.jsx';
import Menu from './pages/Menu.jsx';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <MantineProvider>
      <Toaster />
    <div className="min-h-screen">
      <Header />
      <Routes>

        <Route path="/" element={<LandingPage/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/services" element={<EventsPage/>}/>
         <Route path="/gallery" element={<Gallery/>}/>
         <Route path="/contact" element={<ContactUsPage />}/>
         <Route path="/book" element={< BookingWizard/>}/>
         <Route path="/menu" element={< Menu/>}/>
      </Routes>
      <Footer />
    </div>
    </MantineProvider>
  );
}

export default App;
