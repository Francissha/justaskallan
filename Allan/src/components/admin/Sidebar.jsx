import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  SquarePen,
  List,
  MessageSquare,
} from "lucide-react";

const Sidebar = () => {
  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 rounded-lg mx-3 transition-all ${
      isActive
        ? "bg-[#1B4D3E] text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">

      {/* Sidebar Title */}
      <div className="px-6 py-6 border-b">
        <h2 className="text-xl font-bold text-[#1B4D3E]">
          Admin Panel
        </h2>
      </div>

      {/* Navigation */}
      <div className="py-5 space-y-2">

        <NavLink to="/admin" end className={linkStyle}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/add-blog" className={linkStyle}>
          <SquarePen size={20} />
          <span>Add Blog</span>
        </NavLink>

        <NavLink to="/admin/list-blog" className={linkStyle}>
          <List size={20} />
          <span>List Blogs</span>
        </NavLink>

        <NavLink to="/admin/comments" className={linkStyle}>
          <MessageSquare size={20} />
          <span>Comments</span>
        </NavLink>

      </div>
    </aside>
  );
};

export default Sidebar;