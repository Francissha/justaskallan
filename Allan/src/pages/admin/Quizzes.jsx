import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ListChecks, HelpCircle } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const Quizzes = () => {
  const navigate = useNavigate();
  const { blogs, fetchAllBlogs, loading } = useAppContext();

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <h2>Loading blogs...</h2>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B4D3E]">Quizzes</h1>
        <p className="text-gray-500 mt-1">
          Manage quiz questions for each blog.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Quiz Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => {
                const questionCount = blog.quiz?.length || 0;
                const hasQuiz = questionCount > 0;

                return (
                  <tr
                    key={blog._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-20 h-14 rounded-lg object-cover"
                      />
                    </td>

                    <td className="px-6 py-4 font-medium">{blog.title}</td>

                    <td className="px-6 py-4">
                      {hasQuiz ? (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          {questionCount} Question{questionCount > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">
                          No Quiz
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/admin/blog/${blog._id}/add-quiz`)}
                          className="text-[#1B4D3E] hover:text-[#16382e] transition"
                          title="Add Quiz (5 Questions)"
                        >
                          <ListChecks size={18} />
                        </button>

                        <button
                          onClick={() => navigate(`/admin/blog/${blog._id}/quiz`)}
                          className="text-purple-600 hover:text-purple-800 transition"
                          title="Edit Quiz (Custom)"
                        >
                          <HelpCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
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

export default Quizzes;
