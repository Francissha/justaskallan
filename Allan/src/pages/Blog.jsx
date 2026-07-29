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
  const [fontSize, setFontSize] = useState(20);
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

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white text-2xl">
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

  // ------------------------
  // Auto Detect Sections
  // ------------------------

  const getSection = (marker) => {
    const markers = [
      "#INTRODUCTION",
      "#BODY",
      "#EXAMPLES",
      "#CONCLUSION",
    ];

    const start = blog.description.indexOf(marker);

    if (start === -1) return "";

    const startContent = start + marker.length;

    let end = blog.description.length;

    markers.forEach((m) => {
      if (m === marker) return;

      const pos = blog.description.indexOf(
        m,
        startContent
      );

      if (pos !== -1 && pos < end) {
        end = pos;
      }
    });

    return blog.description
      .substring(startContent, end)
      .trim();
  };

  const sections = [
    {
      number: "01",
      emoji: "📖",
      title: "Introduction",
      color: "#239962",
      content: getSection("#INTRODUCTION"),
    },
    {
      number: "02",
      emoji: "🧠",
      title: "Body",
      color: "#2563EB",
      content: getSection("#BODY"),
    },
    {
      number: "03",
      emoji: "📚",
      title: "Examples",
      color: "#8B5CF6",
      content: getSection("#EXAMPLES"),
    },
    {
      number: "04",
      emoji: "🏁",
      title: "Conclusion",
      color: "#EA580C",
      content: getSection("#CONCLUSION"),
    },
  ];

  const toggleHighlight = (key) => {
    if (!highlightMode) return;

    setHighlights((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
  <div className="min-h-screen bg-[#080808] text-white">

    {/* Reading Progress */}

    <div className="fixed top-0 left-0 w-full h-1 bg-[#1b1b1b] z-50">

      <div
        className="h-full bg-[#239962] transition-all duration-150"
        style={{
          width: `${progress}%`,
        }}
      />

    </div>

    {/* Reader Controls */}

    <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-40">

      <button
        onClick={() => setFontSize((prev) => prev + 2)}
        className="w-12 h-12 rounded-xl bg-[#181818] hover:bg-[#239962] transition flex items-center justify-center"
      >
        <Plus />
      </button>

      <button
        onClick={() =>
          setFontSize((prev) =>
            Math.max(14, prev - 2)
          )
        }
        className="w-12 h-12 rounded-xl bg-[#181818] hover:bg-[#239962] transition flex items-center justify-center"
      >
        <Minus />
      </button>

      <button
        onClick={() =>
          setHighlightMode(!highlightMode)
        }
        className={`w-12 h-12 rounded-xl transition flex items-center justify-center ${
          highlightMode
            ? "bg-yellow-500 text-black"
            : "bg-[#181818] hover:bg-[#239962]"
        }`}
      >
        <Highlighter />
      </button>

    </div>

    {/* Top Navigation */}

    <div className="max-w-6xl mx-auto px-6 pt-8">

      <div className="flex flex-wrap justify-between items-center gap-4">

        <div className="flex gap-3">

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

      <div className="mt-8">

        {embedUrl ? (

          <iframe
            src={embedUrl}
            title={blog.title}
            allowFullScreen
            className="w-full h-[260px] md:h-[450px] lg:h-[560px] rounded-3xl shadow-2xl"
          />

        ) : (

          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[260px] md:h-[450px] lg:h-[560px] rounded-3xl object-cover shadow-2xl"
          />

        )}

      </div>

      {/* Article Header */}

      <div className="text-center mt-12">

        <div className="flex justify-center gap-3 flex-wrap">

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

        <h1 className="text-4xl md:text-6xl font-black mt-8 leading-tight">

          {blog.title}

        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mt-6 leading-relaxed">

          {blog.subtitle}

        </p>

      </div>

    </div>

    {/* Reader Starts Here */}

    <div className="max-w-5xl mx-auto px-6 mt-16 pb-24"> 
      {sections.map((section, sectionIndex) => (

  <section
    key={section.number}
    className="mb-16 overflow-hidden rounded-3xl border border-[#222] bg-[#111111] shadow-2xl"
  >

    {/* Section Header */}

    <div
      className="px-10 py-8"
      style={{
        background: section.color,
      }}
    >

      <div className="flex items-center gap-6">

        <div className="text-6xl">

          {section.emoji}

        </div>

        <div>

          <p className="uppercase tracking-[0.45em] text-white/70 text-sm font-semibold">

            PART {section.number}

          </p>

          <h2 className="text-4xl font-black text-white mt-1">

            {section.title}

          </h2>

        </div>

      </div>

    </div>

    {/* Reader */}

    <div className="px-12 py-12">

      {section.content
        .split("\n\n")
        .filter((item) => item.trim() !== "")
        .map((paragraph, index) => {

          const key = `${sectionIndex}-${index}`;

          // Main Heading
          if (
            paragraph === paragraph.toUpperCase() &&
            paragraph.length > 8
          ) {
            return (
              <h2
                key={key}
                className="text-4xl font-black mt-10 mb-6 text-white"
              >
                {paragraph}
              </h2>
            );
          }

          // Numbered Heading
          if (/^\d+\./.test(paragraph)) {
            return (
              <h3
                key={key}
                className="text-2xl font-bold mt-8 mb-5 text-[#239962]"
              >
                {paragraph}
              </h3>
            );
          }

          // Bullet List
          if (
            paragraph.startsWith("-") ||
            paragraph.startsWith("•")
          ) {
            return (
              <li
                key={key}
                onClick={() => toggleHighlight(key)}
                style={{
                  fontSize: `${fontSize}px`,
                }}
                className={`ml-8 mb-4 leading-10 cursor-pointer rounded-lg px-3 py-2 transition-all duration-300 ${
                  highlights[key]
                    ? "bg-yellow-500/20 border-l-4 border-yellow-500"
                    : "hover:bg-white/5"
                }`}
              >
                {paragraph
                  .replace("-", "")
                  .replace("•", "")
                  .trim()}
              </li>
            );
          }

          // Normal Paragraph

          return (

            <p
              key={key}
              onClick={() => toggleHighlight(key)}
              style={{
                fontSize: `${fontSize}px`,
              }}
              className={`leading-[2.2] mb-8 rounded-xl px-3 py-2 transition-all duration-300 cursor-pointer ${
                highlights[key]
                  ? "bg-yellow-500/20 border-l-4 border-yellow-500"
                  : "hover:bg-white/5"
              }`}
            >

              {paragraph}

            </p>

          );

        })}

    </div>

  </section>

))}
          </div>

    {/* ================= RELATED ARTICLES ================= */}

    {relatedBlogs.length > 0 && (

      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="border-t border-[#222] pt-16">

          <div className="flex items-center justify-between mb-10">

            <div>

              <p className="uppercase tracking-[0.4em] text-sm text-gray-500">

                Continue Reading

              </p>

              <h2 className="text-4xl font-black mt-2">

                Related Articles

              </h2>

            </div>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {relatedBlogs.map((item) => (

              <BlogCard
                key={item._id}
                blog={item}
              />

            ))}

          </div>

        </div>

      </section>

    )}

    {/* ================= MOBILE READER CONTROLS ================= */}

    <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-50">

      <button
        onClick={() => setFontSize((prev) => prev + 2)}
        className="w-12 h-12 rounded-xl bg-[#1B1B1B] shadow-lg flex items-center justify-center hover:bg-[#239962] transition"
      >
        <Plus size={18} />
      </button>

      <button
        onClick={() =>
          setFontSize((prev) =>
            Math.max(14, prev - 2)
          )
        }
        className="w-12 h-12 rounded-xl bg-[#1B1B1B] shadow-lg flex items-center justify-center hover:bg-[#239962] transition"
      >
        <Minus size={18} />
      </button>

      <button
        onClick={() =>
          setHighlightMode(!highlightMode)
        }
        className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition ${
          highlightMode
            ? "bg-yellow-500 text-black"
            : "bg-[#1B1B1B] hover:bg-[#239962]"
        }`}
      >
        <Highlighter size={18} />
      </button>

    </div>

  </div>

);

};

export default Blog;
