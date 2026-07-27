import React, { useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { blogs, loading, fetchAllBlogs, axios, backendUrl, token } =
    useAppContext();

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog? This cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(`${backendUrl}/api/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success("Blog deleted successfully.");
        fetchAllBlogs();
      } else {
        toast.error(data.message || "Failed to delete blog.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  const publishedCount = blogs.filter((blog) => blog.isPublished).length;
  const draftCount = blogs.filter((blog) => !blog.isPublished).length;
  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B4D3E]">Dashboard</h1>
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
            {publishedCount}
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-gray-500">Drafts</h2>
          <p className="text-3xl font-bold text-yellow-500">
            {draftCount}
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
            {recentBlogs.length > 0 ? (
              recentBlogs.map((blog) => (
                <tr key={blog._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-5">{blog.title}</td>
                  <td className="px-6 py-5">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        blog.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/edit-blog/${blog._id}`)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No blogs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
