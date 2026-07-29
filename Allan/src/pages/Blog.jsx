import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Folder,
  Share2,
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

const sectionData = [
  {
    emoji: "📖",
    title: "PART ONE",
    heading: "Introduction",
    color: "#239962",
  },
  {
    emoji: "🧠",
    title: "PART TWO",
    heading: "Main Discussion",
    color: "#3B82F6",
  },
  {
    emoji: "📚",
    title: "PART THREE",
    heading: "Examples & Explanation",
    color: "#8B5CF6",
  },
  {
    emoji: "🏁",
    title: "PART FOUR",
    heading: "Summary",
    color: "#F97316",
  },
];

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

  const [fontSize, setFontSize] = useState(19);

  const [highlightMode, setHighlightMode] =
    useState(false);

  const [highlights, setHighlights] =
    useState({});

  const [progress, setProgress] =
    useState(0);

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/blog/${id}`
      );

      if (data.success) {
        setBlog(data.blog);
      }
    } catch (error) {
      console.log(error);
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

      const current =
        document.documentElement.scrollTop;

      setProgress((current / total) * 100);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-[#080808]">
        Loading...
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex justify-center items-center text-white bg-[#080808]">
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

  const paragraphs = blog.description
    .split("\n\n")
    .filter((item) => item.trim() !== "");

  const quarter = Math.ceil(
    paragraphs.length / 4
  );

  return (
    <div className="bg-[#080808] min-h-screen text-white">

      {/* Reading Progress */}

      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div
          className="h-full bg-[#239962] transition-all duration-200"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
      {/* Floating Reader Controls */}

      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">

        <button
          onClick={() => setFontSize((prev) => prev + 2)}
          className="w-12 h-12 rounded-xl bg-[#181818] hover:bg-[#239962] transition flex items-center justify-center shadow-lg"
        >
          <Plus size={20} />
        </button>

        <button
          onClick={() =>
            setFontSize((prev) => Math.max(14, prev - 2))
          }
          className="w-12 h-12 rounded-xl bg-[#181818] hover:bg-[#239962] transition flex items-center justify-center shadow-lg"
        >
          <Minus size={20} />
        </button>

        <button
          onClick={() =>
            setHighlightMode(!highlightMode)
          }
          className={`w-12 h-12 rounded-xl transition flex items-center justify-center shadow-lg ${
            highlightMode
              ? "bg-yellow-500 text-black"
              : "bg-[#181818] hover:bg-[#239962]"
          }`}
        >
          <Highlighter size={20} />
        </button>

      </div>

      {/* Page Container */}

      <div className="max-w-6xl mx-auto px-6 pt-8">

        {/* Navigation */}

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

          <div className="flex gap-4">

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-[#181818] hover:bg-[#239962] transition px-5 py-3 rounded-xl"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              className="flex items-center gap-2 bg-[#181818] hover:bg-[#239962] transition px-5 py-3 rounded-xl"
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
            className="flex items-center gap-2 bg-[#181818] hover:bg-[#239962] transition px-5 py-3 rounded-xl"
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
            className="w-full h-[260px] md:h-[420px] lg:h-[540px] rounded-3xl shadow-2xl"
          />

        ) : (

          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[260px] md:h-[420px] lg:h-[540px] object-cover rounded-3xl shadow-2xl"
          />

        )}

        {/* Blog Header */}

        <div className="mt-10 text-center">

          <div className="flex justify-center flex-wrap gap-3">

            <span className="bg-[#239962] px-5 py-2 rounded-full flex items-center gap-2 text-sm">

              <Folder size={15} />

              {blog.category}

            </span>

            <span className="bg-[#202020] px-5 py-2 rounded-full flex items-center gap-2 text-sm">

              <Calendar size={15} />

              {new Date(
                blog.createdAt
              ).toLocaleDateString()}

            </span>

          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mt-8 leading-tight">

            {blog.title}

          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mt-6 max-w-4xl mx-auto leading-relaxed">

            {blog.subtitle}

          </p>

        </div>

        {/* Reader */}

        <div className="mt-16 space-y-12">
          {/* =========================
    PART ONE
========================= */}

<section className="bg-[#111111] rounded-3xl border border-gray-800 overflow-hidden shadow-xl">

  <div
    className="px-8 py-6"
    style={{ background: "#239962" }}
  >

    <div className="flex items-center gap-5">

      <div className="text-5xl">
        📖
      </div>

      <div>

        <p className="uppercase tracking-[0.3em] text-white/80 text-sm">
          PART ONE
        </p>

        <h2 className="text-3xl font-bold">
          Introduction
        </h2>

      </div>

    </div>

  </div>

  <div className="px-10 py-10">

    {paragraphs
      .slice(0, quarter)
      .map((paragraph, i) => (

        <p
          key={i}
          onClick={() => {
            if (!highlightMode) return;

            setHighlights({
              ...highlights,
              [`p1-${i}`]:
                !highlights[`p1-${i}`],
            });
          }}
          style={{
            fontSize: `${fontSize}px`,
          }}
          className={`leading-10 mb-7 px-3 py-2 rounded-xl transition-all duration-300 ${
            highlights[`p1-${i}`]
              ? "bg-yellow-500/30"
              : ""
          }`}
        >

          {paragraph}

        </p>

      ))}

  </div>

</section>

{/* =========================
    PART TWO
========================= */}

<section className="bg-[#111111] rounded-3xl border border-gray-800 overflow-hidden shadow-xl">

  <div
    className="px-8 py-6"
    style={{ background: "#3B82F6" }}
  >

    <div className="flex items-center gap-5">

      <div className="text-5xl">
        🧠
      </div>

      <div>

        <p className="uppercase tracking-[0.3em] text-white/80 text-sm">
          PART TWO
        </p>

        <h2 className="text-3xl font-bold">
          Main Discussion
        </h2>

      </div>

    </div>

  </div>

  <div className="px-10 py-10">

    {paragraphs
      .slice(quarter, quarter * 2)
      .map((paragraph, i) => (

        <p
          key={i}
          onClick={() => {
            if (!highlightMode) return;

            setHighlights({
              ...highlights,
              [`p2-${i}`]:
                !highlights[`p2-${i}`],
            });
          }}
          style={{
            fontSize: `${fontSize}px`,
          }}
          className={`leading-10 mb-7 px-3 py-2 rounded-xl transition-all duration-300 ${
            highlights[`p2-${i}`]
              ? "bg-yellow-500/30"
              : ""
          }`}
        >

          {paragraph}

        </p>

      ))}

  </div>

</section>

          {/* =========================
    PART THREE
========================= */}

<section className="bg-[#111111] rounded-3xl border border-gray-800 overflow-hidden shadow-xl">

  <div
    className="px-8 py-6"
    style={{ background: "#8B5CF6" }}
  >

    <div className="flex items-center gap-5">

      <div className="text-5xl">
        📚
      </div>

      <div>

        <p className="uppercase tracking-[0.3em] text-white/80 text-sm">
          PART THREE
        </p>

        <h2 className="text-3xl font-bold">
          Examples & Explanation
        </h2>

      </div>

    </div>

  </div>

  <div className="px-10 py-10">

    {paragraphs
      .slice(quarter * 2, quarter * 3)
      .map((paragraph, i) => (

        <p
          key={i}
          onClick={() => {
            if (!highlightMode) return;

            setHighlights({
              ...highlights,
              [`p3-${i}`]:
                !highlights[`p3-${i}`],
            });
          }}
          style={{
            fontSize: `${fontSize}px`,
          }}
          className={`leading-10 mb-7 px-3 py-2 rounded-xl transition-all duration-300 ${
            highlights[`p3-${i}`]
              ? "bg-yellow-500/30"
              : ""
          }`}
        >

          {paragraph}

        </p>

      ))}

  </div>

</section>

{/* =========================
    PART FOUR
========================= */}

<section className="bg-[#111111] rounded-3xl border border-gray-800 overflow-hidden shadow-xl">

  <div
    className="px-8 py-6"
    style={{ background: "#F97316" }}
  >

    <div className="flex items-center gap-5">

      <div className="text-5xl">
        🏁
      </div>

      <div>

        <p className="uppercase tracking-[0.3em] text-white/80 text-sm">
          PART FOUR
        </p>

        <h2 className="text-3xl font-bold">
          Summary
        </h2>

      </div>

    </div>

  </div>

  <div className="px-10 py-10">

    {paragraphs
      .slice(quarter * 3)
      .map((paragraph, i) => (

        <p
          key={i}
          onClick={() => {
            if (!highlightMode) return;

            setHighlights({
              ...highlights,
              [`p4-${i}`]:
                !highlights[`p4-${i}`],
            });
          }}
          style={{
            fontSize: `${fontSize}px`,
          }}
          className={`leading-10 mb-7 px-3 py-2 rounded-xl transition-all duration-300 ${
            highlights[`p4-${i}`]
              ? "bg-yellow-500/30"
              : ""
          }`}
        >

          {paragraph}

        </p>

      ))}

  </div>

</section>

</div>
              {/* =========================
          Related Articles
      ========================= */}

      {relatedBlogs.length > 0 && (
        <section className="mt-20">

          <div className="flex items-center justify-between mb-8">

            <h2 className="text-4xl font-bold">
              Related Articles
            </h2>

            <button
              onClick={() => navigate("/blogs")}
              className="text-[#239962] hover:underline"
            >
              View All →
            </button>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {relatedBlogs.map((item) => (
              <BlogCard
                key={item._id}
                blog={item}
              />
            ))}

          </div>

        </section>
      )}

    </div>

    {/* =========================
        Mobile Reader Controls
    ========================= */}

    <div className="fixed lg:hidden bottom-6 right-6 flex flex-col gap-3 z-50">

      <button
        onClick={() =>
          setFontSize((prev) => prev + 2)
        }
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
