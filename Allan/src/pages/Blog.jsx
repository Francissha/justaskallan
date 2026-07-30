import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Calendar,
  Folder,
  MessageSquare,
  Plus,
  Minus,
  Highlighter,
} from "lucide-react";

import BlogCard from "../components/BlogCard";
import { useAppContext } from "../context/AppContext";

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : null;
};

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    axios,
    backendUrl,
    blogs,
    fetchAllBlogs,
  } = useAppContext();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reader Controls
  const [fontSize, setFontSize] = useState(18);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlights, setHighlights] = useState({});
  const [progress, setProgress] = useState(0);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/blog/${id}`
      );

      if (data.success) {
        setBlog(data.blog);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();

    if (blogs.length === 0) {
      fetchAllBlogs();
    }
  }, [id]);

  // Reading Progress
  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const current =
        document.documentElement.scrollTop;

      setProgress((current / total) * 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#080808] text-white flex justify-center items-center text-2xl font-bold">
        Loading...
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen bg-[#080808] text-white flex justify-center items-center text-2xl font-bold">
        Blog Not Found
      </div>
    );

  const embedUrl =
    blog.type === "Video"
      ? getYoutubeEmbedUrl(blog.youtubeLink)
      : null;

  const relatedBlogs = blogs
    .filter(
      (item) =>
        item._id !== blog._id &&
        item.category === blog.category
    )
    .slice(0, 3);

  const toggleHighlight = (index) => {
    if (!highlightMode) return;

    setHighlights((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Automatic article renderer
  const renderContent = () => {
    const lines = blog.description
      .split("\n")
      .filter((line) => line.trim() !== "");

    return lines.map((line, index) => {
      const text = line.trim();

      // Numbered heading
      if (/^\d+\./.test(text)) {
        return (
          <h2
            key={index}
            className="text-4xl font-black text-[#239962] mt-14 mb-6"
          >
            {text}
          </h2>
        );
      }

      return (
        <p
          key={index}
          onClick={() => toggleHighlight(index)}
          style={{
            fontSize: `${fontSize}px`,
          }}
          className={`leading-10 mb-6 rounded-xl px-3 py-2 transition duration-300 ${
            highlights[index]
              ? "bg-yellow-400/20 border-l-4 border-yellow-400"
              : "hover:bg-white/5"
          }`}
        >
          {text}
        </p>
      );
    });
  };

  return (
    <div className="bg-[#080808] text-white min-h-screen">

      {/* Reading Progress */}

      <div className="fixed top-0 left-0 h-1 w-full bg-gray-800 z-50">
        <div
          className="h-full bg-[#239962] transition-all"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Reader Controls */}

      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-40">

        <button
          onClick={() => setFontSize((prev) => prev + 2)}
          className="w-12 h-12 rounded-xl bg-[#1B1B1B] hover:bg-[#239962] flex justify-center items-center"
        >
          <Plus />
        </button>

        <button
          onClick={() =>
            setFontSize((prev) =>
              Math.max(14, prev - 2)
            )
          }
          className="w-12 h-12 rounded-xl bg-[#1B1B1B] hover:bg-[#239962] flex justify-center items-center"
        >
          <Minus />
        </button>

        <button
          onClick={() =>
            setHighlightMode(!highlightMode)
          }
          className={`w-12 h-12 rounded-xl flex justify-center items-center ${
            highlightMode
              ? "bg-yellow-500 text-black"
              : "bg-[#1B1B1B] hover:bg-[#239962]"
          }`}
        >
          <Highlighter />
        </button>

      </div>

      {/* Page Container */}

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Navigation */}

        <div className="flex justify-between items-center mb-8">

          <div className="flex gap-4">

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-[#181818] hover:bg-[#239962] px-5 py-3 rounded-xl transition"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              className="flex items-center gap-2 bg-[#181818] hover:bg-[#239962] px-5 py-3 rounded-xl transition"
            >
              <MessageSquare size={18} />
              Reviews
            </button>

          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: blog.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(
                  window.location.href
                );
              }
            }}
            className="flex items-center gap-2 bg-[#181818] hover:bg-[#239962] px-5 py-3 rounded-xl transition"
          >
            <Share2 size={18} />
            Share
          </button>

        </div>

        {/* Hero */}

        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={blog.title}
            allowFullScreen
            className="w-full h-[260px] md:h-[460px] rounded-3xl shadow-2xl"
          />
        ) : (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[260px] md:h-[460px] object-cover rounded-3xl shadow-2xl"
          />
        )}

        {/* Article Header */}

        <div className="mt-10 text-center">

          <div className="flex justify-center gap-3 flex-wrap">

            <span className="bg-[#239962] px-5 py-2 rounded-full flex items-center gap-2">
              <Folder size={15} />
              {blog.category}
            </span>

            <span className="bg-[#1B1B1B] px-5 py-2 rounded-full flex items-center gap-2">
              <Calendar size={15} />
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>

          </div>

          <h1 className="text-5xl md:text-6xl font-black mt-8">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="text-2xl text-gray-400 mt-6 max-w-4xl mx-auto">
              {blog.subtitle}
            </p>
          )}

        </div>
        <div className="max-w-4xl mx-auto mt-16">

          {renderContent()}

        </div>
        {relatedBlogs.length > 0 && (

          <div className="mt-24">

            <div className="border-t border-gray-800 pt-16">

              <h2 className="text-4xl font-black mb-10">

                Related Articles

              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {relatedBlogs.map((item) => (

                  <BlogCard
                    key={item._id}
                    blog={item}
                  />

                ))}

              </div>

            </div>

          </div>

        )}

      </div>


      <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-50">

        <button
          onClick={() => setFontSize((prev) => prev + 2)}
          className="w-12 h-12 rounded-full bg-[#239962] flex items-center justify-center shadow-xl"
        >
          <Plus />
        </button>

        <button
          onClick={() =>
            setFontSize((prev) =>
              Math.max(14, prev - 2)
            )
          }
          className="w-12 h-12 rounded-full bg-[#239962] flex items-center justify-center shadow-xl"
        >
          <Minus />
        </button>

        <button
          onClick={() =>
            setHighlightMode(!highlightMode)
          }
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl ${
            highlightMode
              ? "bg-yellow-500 text-black"
              : "bg-[#239962]"
          }`}
        >
          <Highlighter />
        </button>

      </div>

    </div>

  );

};

export default Blog;
