
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";

const Layout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Later you'll clear the token here
    // localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <>
      <nav className="bg-[#1B4D3E] shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo & Name */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            {/* Logo */}
            <div className="w-10 h-10 rounded-full bg-[#F2C94C] flex items-center justify-center text-[#1B4D3E] font-bold text-xl">
              J
            </div>

            <div>
              <h1 className="text-white text-2xl font-bold">
                JustAskAllan
              </h1>

              <p className="text-green-100 text-sm">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-[#F2C94C] text-[#1B4D3E] px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
          >
            Log Out
          </button>

        </div>
      </nav>

      <div className="flex h-[calc(100vh-70px)]">
        <Sidebar />
        <Outlet/>
      </div>
    </>
  );
};

export default Layout;