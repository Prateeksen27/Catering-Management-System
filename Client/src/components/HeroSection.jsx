import heroBackground from "../assets/homebanner.jpg";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroBackground})`
      }}
    >
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Welcome Text */}
        <p className="text-white text-sm md:text-base font-medium tracking-wider uppercase mb-4 opacity-90">
          Welcome to Venus Catering Service
        </p>
        
        {/* Main Heading */}
        <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
          Hello!
        </h1>
        
        {/* Description */}
        <p className="text-white text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed opacity-95">
          We are the top vegetarian wedding caterer in Tamil Nadu. We have completed over 2,000+ 
          weddings, supported by a professional team of 340 members.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
          <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300 px-8 py-3 rounded-full font-semibold backdrop-blur-sm flex items-center">
            Explore
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white transition-all duration-300 px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl flex items-center">
            Contact
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center animate-bounce">
          <svg className="h-6 w-6 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;