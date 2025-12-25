import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItemClass = ({ isActive, path }) =>
    `text-gray-700 transition-all duration-300 font-medium ${
      isActive || location.pathname === path ? "text-red-600" : "hover:text-red-600"
    }`;

  return (
    <header className="w-full bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg shadow-md">
              <span className="text-white font-bold text-xl">CS</span>
            </div>
            <div className="text-gray-800">
              <div className="font-bold text-lg leading-none"> CATERING</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                SERVICE
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink to="/" className={navItemClass({ path: "/" })}>
              Home
            </NavLink>
            <NavLink to="/about" className={navItemClass({ path: "/about" })}>
              About
            </NavLink>
            <NavLink to="/services" className={navItemClass({ path: "/services" })}>
              Services
            </NavLink>
            <NavLink to="/gallery" className={navItemClass({ path: "/gallery" })}>
              Gallery
            </NavLink>
            <NavLink to="/contact" className={navItemClass({ path: "/contact" })}>
              Contact
            </NavLink>
          </nav>

          {/* Book Now Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/book")}
              className="hidden md:inline-flex bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl items-center"
            >
              Book Now
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 pt-4">
              <NavLink
                to="/"
                className={navItemClass({ path: "/" })}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={navItemClass({ path: "/about" })}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/services"
                className={navItemClass({ path: "/services" })}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </NavLink>
              <NavLink
                to="/menu"
                className={navItemClass({ path: "/menu" })}
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </NavLink>
              <NavLink
                to="/gallery"
                className={navItemClass({ path: "/gallery" })}
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </NavLink>
              <NavLink
                to="/blogs"
                className={navItemClass({ path: "/blogs" })}
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </NavLink>
              <NavLink
                to="/contact"
                className={navItemClass({ path: "/contact" })}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/book");
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors w-fit"
              >
                Book Now
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
