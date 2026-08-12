import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Calendar,
  Folder,
  MessageSquare,
  HelpCircle,
  Plus,
  Minus,
  Highlighter,
  PlayCircle,
} from "lucide-react";

import BlogCard from "../components/BlogCard";
import { useAppContext } from "../context/AppContext";

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { axios, backendUrl, blogs, fetchAllBlogs } = useAppContext();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fontSize, setFontSize] = useState(18);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlights, setHighlights] = useState({});
  const [progress, setProgress] = useState(0);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/blog/${id}`);

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

  useEffect(() => {
    const handleScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const current = document.documentElement.scrollTop;

      if (total <= 0) {
        setProgress(0);
        return;
      }

      setProgress((current / total) * 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center text-2xl font-bold">
        Blog Not Found
      </div>
    );
  }

  const embedUrl =
    blog.type === "Video"
      ? getYoutubeEmbedUrl(blog.youtubeLink)
      : null;

  const hasQuiz = Array.isArray(blog.quiz) && blog.quiz.length > 0;

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

  const renderContent = () => {
    const lines = blog.description
      .split("\n")
      .filter((line) => line.trim() !== "");

    return lines.map((line, index) => {
      const text = line.trim();

      if (/^\d+\./.test(text)) {
        return (
          <h2
            key={index}
            className="mt-8 mb-3 text-3xl font-black text-[#239962]"
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
          className={`mb-3 rounded-xl px-3 py-1 leading-7 transition duration-300 ${
            highlights[index]
              ? "border-l-4 border-yellow-400 bg-yellow-400/20"
              : "hover:bg-white/5"
          }`}
        >
          {text}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-gray-800">
        <div
          className="h-full bg-[#239962] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
        <button
          onClick={() => setFontSize((prev) => prev + 2)}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B1B1B] transition hover:bg-[#239962]"
          aria-label="Increase font size"
        >
          <Plus />
        </button>

        <button
          onClick={() =>
            setFontSize((prev) => Math.max(14, prev - 2))
          }
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B1B1B] transition hover:bg-[#239962]"
          aria-label="Decrease font size"
        >
          <Minus />
        </button>

        <button
          onClick={() => setHighlightMode(!highlightMode)}
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition ${
            highlightMode
              ? "bg-yellow-500 text-black"
              : "bg-[#1B1B1B] hover:bg-[#239962]"
          }`}
          aria-label="Highlight mode"
        >
          <Highlighter />
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-xl bg-[#181818] px-5 py-3 transition hover:bg-[#239962]"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              onClick={() => navigate(`/comments/${blog._id}`)}
              className="flex items-center gap-2 rounded-xl bg-[#181818] px-5 py-3 transition hover:bg-[#239962]"
            >
              <MessageSquare size={18} />
              Comments
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
                navigator.clipboard.writeText(window.location.href);
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-[#181818] px-5 py-3 transition hover:bg-[#239962]"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>

        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={blog.title}
            allowFullScreen
            className="h-[260px] w-full rounded-3xl shadow-2xl md:h-[460px]"
          />
        ) : (
          <img
            src={blog.image}
            alt={blog.title}
            className="h-[260px] w-full rounded-3xl object-cover shadow-2xl md:h-[460px]"
          />
        )}

        {hasQuiz && (
          <div className="mx-auto mt-8 max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-[#239962]/40 bg-gradient-to-r from-[#10251C] to-[#111111] p-5 shadow-xl md:p-6">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#239962]/10 blur-2xl" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#239962]">
                    <HelpCircle size={24} />
                  </div>

                  <div>
                    <p className="text-lg font-bold">
                      Test Your Knowledge
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Take a quick quiz based on this lesson.
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#239962]">
                      {blog.quiz.length}{" "}
                      {blog.quiz.length === 1
                        ? "Question"
                        : "Questions"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/quiz/${blog._id}`)}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#239962] px-7 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#1d7c4d] hover:shadow-[#239962]/30"
                >
                  <PlayCircle
                    size={20}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  Take Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <span className="flex items-center gap-2 rounded-full bg-[#239962] px-5 py-2">
              <Folder size={15} />
              {blog.category}
            </span>

            <span className="flex items-center gap-2 rounded-full bg-[#1B1B1B] px-5 py-2">
              <Calendar size={15} />
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black md:text-6xl">
            {blog.title}
          </h1>

          {blog.subtitle && (
            <p className="mx-auto mt-4 max-w-4xl text-2xl text-gray-400">
              {blog.subtitle}
            </p>
          )}
        </div>

        <div className="mx-auto mt-8 max-w-4xl">
          {renderContent()}
        </div>

        {relatedBlogs.length > 0 && (
          <div className="mt-16">
            <div className="border-t border-gray-800 pt-10">
              <h2 className="mb-8 text-4xl font-black">
                Related Articles
              </h2>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedBlogs.map((item) => (
                  <BlogCard key={item._id} blog={item} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 lg:hidden">
        <button
          onClick={() => setFontSize((prev) => prev + 2)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#239962] shadow-xl"
        >
          <Plus />
        </button>

        <button
          onClick={() =>
            setFontSize((prev) => Math.max(14, prev - 2))
          }
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#239962] shadow-xl"
        >
          <Minus />
        </button>

        <button
          onClick={() => setHighlightMode(!highlightMode)}
          className={`flex h-12 w-12 items-center justify-center rounded-full shadow-xl ${
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
