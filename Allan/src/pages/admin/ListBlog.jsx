import React, { useEffect } from "react";
import { Pencil, Trash2, HelpCircle, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ListBlog = () => {
  const navigate = useNavigate();
  const { blogs, fetchAllBlogs, loading, axios, backendUrl, token } =
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

  const handleEdit = (id) => {
    navigate(`/admin/edit-blog/${id}`);
  };

  const handleDynamicQuiz = (id) => {
    navigate(`/admin/blog/${id}/quiz`);
  };

  const handleFixedQuiz = (id) => {
    navigate(`/admin/blog/${id}/add-quiz`);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <h2>Loading blogs...</h2>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1B4D3E]">All Blogs</h1>
          <p className="text-gray-500 mt-1">
            View and manage all your blogs.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/add-blog")}
          className="bg-[#1B4D3E] text-white px-5 py-3 rounded-lg hover:bg-[#16382e] transition"
        >
          + Add New Blog
        </button>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Published</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <tr
                  key={blog._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  {/* Index */}
                  <td className="px-6 py-4">{index + 1}</td>

                  {/* Image */}
                  <td className="px-6 py-4">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-20 h-14 rounded-lg object-cover"
                    />
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4 font-medium">{blog.title}</td>

                  {/* Published */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        blog.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleFixedQuiz(blog._id)}
                        className="text-[#1B4D3E] hover:text-[#16382e] transition"
                        title="Add Quiz (5 Questions)"
                      >
                        <ListChecks size={18} />
                      </button>

                      <button
                        onClick={() => handleDynamicQuiz(blog._id)}
                        className="text-purple-600 hover:text-purple-800 transition"
                        title="Edit Quiz (Custom)"
                      >
                        <HelpCircle size={18} />
                      </button>

                      <button
                        onClick={() => handleEdit(blog._id)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit Blog"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete Blog"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
