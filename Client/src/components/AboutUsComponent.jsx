import { Button } from "./Button.jsx";
import { StatCard } from "./stat-card.jsx";
import { ArrowRight } from "lucide-react";
import paneerTikkaImage from "../assets/about3.jpg";
import indianFeastImage from "../assets/aboutus.jpg";
import wcu1 from "../assets/wcu1.png";
import wcu2 from "../assets/wcu2.png";
import wcu3 from "../assets/wcu3.png";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Images */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-[#7B2D26] text-white rounded-full w-28 h-28 flex flex-col items-center justify-center shadow-lg border-4 border-yellow-400">
                <span className="text-xs font-medium">Since</span>
                <span className="text-xl font-bold">1998</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-16">
              <div className="h-[240px] md:h-[520px] rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={paneerTikkaImage}
                  alt="Grilled paneer tikka kebabs with vegetables"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-8 h-[240px] md:h-[520px] rounded-3xl overflow-hidden shadow-lg">
                <img
                  src={indianFeastImage}
                  alt="Traditional Indian feast with curry dishes and rice"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <p className="text-gray-500 font-medium tracking-wider uppercase text-sm">
                ABOUT US
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Elevating Your Events with Exceptional Food.
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Venus is The Place where Food is Celebrated over 25 Years. We
                Love to Create Unforgettable Culinary Experiences.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<img src={wcu1} alt="Experience" className="w-10 h-10" />}
                value="25"
                label="Years of Experience"
              />
              <StatCard
                icon={<img src={wcu2} alt="Marriages" className="w-10 h-10" />}
                value="2000+"
                label="Successful Marriages"
              />
              <StatCard
                icon={<img src={wcu3} alt="Customers" className="w-10 h-10" />}
                value="98%"
                label="Repeated Customers"
              />
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button variant="burgundy" size="lg" className="gap-2">
                More About Us
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
