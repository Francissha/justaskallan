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
    <footer className="bg-[#1B4D3E] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top */}
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold">
              JustAskAllan
            </h2>

            <p className="mt-4 text-gray-300 leading-7">
              Learn something new every day through engaging
              articles, practical guides, and educational videos.
              Your place to ask, learn and grow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-300">
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
            <h3 className="text-xl font-semibold mb-5">
              Categories
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>♟ Chess</li>
              <li>🔥 Survival</li>
              <li>✈ Travelling</li>
              <li>📚 Education</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-5">
              Connect
            </h3>

            <p className="text-gray-300">
              Email
            </p>

            <p className="text-[#F2C94C]">
              hello@justaskallan.com
            </p>

            <div className="flex gap-4 mt-6">

              <a href="#">
                <FaFacebookF className="text-2xl hover:text-[#F2C94C] transition" />
              </a>

              <a href="#">
                <FaYoutube className="text-2xl hover:text-[#F2C94C] transition" />
              </a>

              <a href="#">
                <FaInstagram className="text-2xl hover:text-[#F2C94C] transition" />
              </a>

              <a href="#">
                <FaLinkedinIn className="text-2xl hover:text-[#F2C94C] transition" />
              </a>

              <a href="#">
                <FaGithub className="text-2xl hover:text-[#F2C94C] transition" />
              </a>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-white/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">

          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Just Ask Allan. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-300 mt-4 md:mt-0">

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
