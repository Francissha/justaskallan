import React from "react";
import { blogs } from "../../data/blogs";
import { Pencil, Trash2 } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B4D3E]">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome to the JustAskAllan Admin Panel.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">Total Blogs</h2>
          <p className="text-3xl font-bold text-[#1B4D3E]">
            {blogs.length}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">Published</h2>
          <p className="text-3xl font-bold text-green-600">
            {blogs.filter((blog) => blog.status === "Published").length}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">Drafts</h2>
          <p className="text-3xl font-bold text-yellow-500">
            {blogs.filter((blog) => blog.status === "Draft").length}
          </p>
        </div>

      </div>

      {/* Recent Blogs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-semibold text-[#1B4D3E]">
            Recent Blogs
          </h2>
        </div>

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">Blog</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            {blogs.map((blog) => (
              <tr
                key={blog._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-5">
                  {blog.title}
                </td>

                <td className="px-6 py-5">
                  {blog.date}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      blog.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {blog.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-center gap-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil size={18} />
                    </button>

                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Dashboard;
