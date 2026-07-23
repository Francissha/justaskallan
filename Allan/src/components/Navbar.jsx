import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="px-4 sm:px-6 mt-5">
      <nav className="bg-[#1B4D3E] rounded-2xl px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-orange-500"></div>
            

            <h1 className="text-white text-xl sm:text-2xl font-bold font-serif">
              JustAskAllan
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/watch")}
              className="text-white hover:text-yellow-300 transition"
            >
              Watch
            </button>

            <button
              onClick={() => navigate("/categories")}
              className="text-white hover:text-yellow-300 transition"
            >
              Categories
            </button>

            <button
              onClick={() => navigate("/about")}
              className="text-white hover:text-yellow-300 transition"
            >
              About Allan
            </button>

            <button
              onClick={() => navigate("/contribute")}
              className="bg-[#F2C94C] text-[#1B4D3E] px-5 py-2 rounded-full font-semibold hover:scale-105 transition"
            >
              Contribute
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="border border-white text-white px-5 py-2 rounded-full hover:bg-white hover:text-[#1B4D3E] transition"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3 border-t border-green-700 pt-4">
            <button
              onClick={() => {
                navigate("/watch");
                setMenuOpen(false);
              }}
              className="text-white text-left"
            >
              Watch
            </button>

            <button
              onClick={() => {
                navigate("/categories");
                setMenuOpen(false);
              }}
              className="text-white text-left"
            >
              Categories
            </button>

            <button
              onClick={() => {
                navigate("/about");
                setMenuOpen(false);
              }}
              className="text-white text-left"
            >
              About Allan
            </button>

            <button
              onClick={() => {
                navigate("/contribute");
                setMenuOpen(false);
              }}
              className="bg-[#F2C94C] text-[#1B4D3E] rounded-full py-2 font-semibold"
            >
              Contribute
            </button>

            <button
              onClick={() => {
                navigate("/admin");
                setMenuOpen(false);
              }}
              className="border border-white text-white rounded-full py-2"
            >
              Login
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
