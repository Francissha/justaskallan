import React from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1B4D3E] text-white mt-10 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">

        {/* Top */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              JustAskAllan
            </h2>

            <p className="mt-2 sm:mt-4 text-xs sm:text-base text-gray-300 leading-6 sm:leading-7">
              Learn something new every day through engaging
              articles, practical guides, and educational videos.
              Your place to ask, learn and grow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 sm:mb-5">
              Quick Links
            </h3>

            <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-base text-gray-300">
              <li
                onClick={() => navigate("/")}
                className="cursor-pointer hover:text-[#F2C94C]"
              >
                Home
              </li>

              <li
                onClick={() => navigate("/about")}
                className="cursor-pointer hover:text-[#F2C94C]"
              >
                About Allan
              </li>

              <li
                onClick={() => navigate("/categories")}
                className="cursor-pointer hover:text-[#F2C94C]"
              >
                Categories
              </li>

              <li
                onClick={() => navigate("/contribute")}
                className="cursor-pointer hover:text-[#F2C94C]"
              >
                Contribute
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 sm:mb-5">
              Categories
            </h3>

            <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-base text-gray-300">
              <li>♟ Chess</li>
              <li>🔥 Survival</li>
              <li>✈ Travelling</li>
              <li>📚 Education</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-2 sm:mb-5">
              Connect
            </h3>

            <p className="text-xs sm:text-base text-gray-300">
              Email
            </p>

            <p className="text-xs sm:text-base text-[#F2C94C] break-all">
              hello@justaskallan.com
            </p>

            <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-6">

              <a href="#">
                <FaFacebookF className="text-base sm:text-2xl hover:text-[#F2C94C] transition" />
              </a>

              <a href="#">
                <FaYoutube className="text-base sm:text-2xl hover:text-[#F2C94C] transition" />
              </a>

              <a href="#">
                <FaInstagram className="text-base sm:text-2xl hover:text-[#F2C94C] transition" />
              </a>

              <a href="#">
                <FaLinkedinIn className="text-base sm:text-2xl hover:text-[#F2C94C] transition" />
              </a>

              <a href="#">
                <FaGithub className="text-base sm:text-2xl hover:text-[#F2C94C] transition" />
              </a>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-white/20 mt-6 sm:mt-12 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">

          <p className="text-gray-300 text-[10px] sm:text-sm text-center md:text-left">
            © {new Date().getFullYear()} Just Ask Allan. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-[10px] sm:text-sm text-gray-300">

            <span className="cursor-pointer hover:text-[#F2C94C]">
              Privacy Policy
            </span>

            <span className="cursor-pointer hover:text-[#F2C94C]">
              Terms of Service
            </span>

            <span className="cursor-pointer hover:text-[#F2C94C]">
              Contact
            </span>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
