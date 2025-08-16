import React from "react";
// Import Link for SPA-friendly navigation
import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-t from-[#1a0e2e] to-[#2e1a47] text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Column 1: Logo and About */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/images/Club_logo.JPG.png"
                alt="InQuizitive Logo"
                className="rounded-full border-2 border-purple-400 w-20 h-20"
              />
              <div>
                <h2 className="text-2xl font-bold">InQuizitive Club</h2>
                <p className="text-sm text-gray-400">IIIT Dharwad</p>
              </div>
            </div>
            <p className="text-gray-300 max-w-xs">
              The official quizzing society of the Indian Institute of
              Information Technology, Dharwad.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 tracking-wider uppercase">
              Quick Links
            </h3>
            <div className="flex flex-col items-center md:items-start space-y-3">
              {/* Use Link component for internal navigation */}
              <Link
                to="/"
                className="text-gray-300 hover:text-yellow-300 transition-colors duration-300"
              >
                Home
              </Link>
              <Link
                to="/event"
                className="text-gray-300 hover:text-yellow-300 transition-colors duration-300"
              >
                Events
              </Link>
              <Link
                to="/aboutus"
                className="text-gray-300 hover:text-yellow-300 transition-colors duration-300"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 tracking-wider uppercase">
              Follow Us
            </h3>
            <p className="text-gray-400 mb-4">
              Stay updated with our latest events and announcements.
            </p>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://www.instagram.com/inquizitive.iiitdwd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-500 transform hover:scale-125 transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="text-3xl" />
              </a>
              <a
                href="https://www.linkedin.com/company/inquizitive-iiit-dharwad/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transform hover:scale-125 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-3xl" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Copyright */}
        <div className="text-center text-gray-500 border-t border-gray-700 mt-12 pt-6">
          © {new Date().getFullYear()} InQuizitive IIIT Dharwad. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
