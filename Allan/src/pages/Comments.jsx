import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Comments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, backendUrl } = useAppContext();

  const [comments, setComments] = useState([]);
  const [otherComments, setOtherComments] = useState([]);
  const [blog, setBlog] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const fetchBlog = async () => {
    const { data } = await axios.get(`${backendUrl}/api/blog/${id}`);
    if (data.success) setBlog(data.blog);
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/comment/${id}`);
      if (data.success) setComments(data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOtherComments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/comment/admin/all`);
      if (data.success) {
        setOtherComments(data.comments.filter((c) => c.blog._id !== id).slice(0, 6));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchComments();
    fetchOtherComments();
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${backendUrl}/api/comment/add`, {
        blog: id,
        ...form,
      });

      if (data.success) {
        alert("Comment submitted successfully. It will appear after approval.");
        setForm({ name: "", email: "", comment: "" });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex justify-between items-center mb-6 sm:mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#181818] hover:bg-[#239962] px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base"
          >
            <ArrowLeft size={15} className="sm:hidden" />
            <ArrowLeft size={18} className="hidden sm:block" />
            Back
          </button>

          <h1 className="text-lg sm:text-3xl md:text-4xl font-black flex items-center gap-2 sm:gap-3">
            <MessageSquare size={18} className="sm:hidden" />
            <MessageSquare size={28} className="hidden sm:block" />
            Comments
          </h1>

          <div></div>
        </div>

        {blog && (
          <div className="mb-6 sm:mb-10">
            <h2 className="text-base sm:text-2xl md:text-3xl font-bold">{blog.title}</h2>
            <p className="text-text-muted text-xs sm:text-base mt-1 sm:mt-2">
              Join the discussion below.
            </p>
          </div>
        )}

        <form
          onSubmit={submitComment}
          className="bg-[#111111] rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-800"
        >
          <h3 className="text-base sm:text-2xl font-bold mb-4 sm:mb-6">Leave a Comment</h3>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5">
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-[#1B1B1B] rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-base outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-[#1B1B1B] rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-base outline-none"
            />
          </div>

          <textarea
            rows={4}
            placeholder="Write your comment..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full bg-[#1B1B1B] rounded-lg sm:rounded-xl p-3 sm:p-4 text-xs sm:text-base mt-3 sm:mt-5 outline-none resize-none"
          />

          <button className="mt-4 sm:mt-6 bg-[#239962] px-5 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base flex items-center gap-2">
            <Send size={15} className="sm:hidden" />
            <Send size={18} className="hidden sm:block" />
            Post Comment
          </button>
        </form>

        <div className="mt-10 sm:mt-16">
          <h3 className="text-base sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-8">
            Community Comments ({comments.length})
          </h3>

          {comments.length === 0 ? (
            <div className="bg-[#111111] rounded-xl sm:rounded-2xl border border-gray-800 p-4 sm:p-8 text-center text-xs sm:text-base text-gray-400">
              No comments yet. Be the first to comment.
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-6">
              {comments.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#111111] border border-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-sm sm:text-lg">{item.name}</h4>
                      <p className="text-gray-500 text-[10px] sm:text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 sm:mt-4 leading-6 sm:leading-8 text-xs sm:text-base text-gray-300">
                    {item.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 sm:mt-20">
          <h3 className="text-base sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-8">
            Recent Comments
          </h3>

          <div className="space-y-3 sm:space-y-5">
            {otherComments.map((item) => (
              <div
                key={item._id}
                className="bg-[#111111] border border-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-5"
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-xs sm:text-base">{item.name}</h4>
                    <p className="text-[#239962] text-[10px] sm:text-sm mt-0.5 sm:mt-1">
                      {item.blog?.title}
                    </p>
                  </div>

                  <span className="text-[10px] sm:text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="mt-1.5 sm:mt-3 text-xs sm:text-base text-gray-300 line-clamp-2">
                  {item.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
