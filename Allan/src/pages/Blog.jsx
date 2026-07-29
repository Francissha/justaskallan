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

  // Reader controls
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

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const total =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const current =
        document.documentElement.scrollTop;

      setProgress((current / total) * 100);
    };

    window.addEventListener("scroll", onScroll);

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center text-2xl">
        Loading...
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center text-2xl">
        Blog not found.
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

  const toggleHighlight = (key) => {
    if (!highlightMode) return;

    setHighlights((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
  <div className="min-h-screen bg-[#090909] text-white">

    {/* Reading Progress */}

    <div className="fixed top-0 left-0 w-full h-1 bg-[#202020] z-50">
      <div
        className="h-full bg-[#239962] transition-all duration-150"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>

    {/* Floating Reader Controls */}

    <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-40">

      <button
        onClick={() => setFontSize(fontSize + 2)}
        className="w-12 h-12 rounded-xl bg-[#181818] hover:bg-[#239962] transition flex justify-center items-center shadow-xl"
      >
        <Plus size={20} />
      </button>

      <button
        onClick={() =>
          setFontSize(Math.max(14, fontSize - 2))
        }
        className="w-12 h-12 rounded-xl bg-[#181818] hover:bg-[#239962] transition flex justify-center items-center shadow-xl"
      >
        <Minus size={20} />
      </button>

      <button
        onClick={() =>
          setHighlightMode(!highlightMode)
        }
        className={`w-12 h-12 rounded-xl transition flex justify-center items-center shadow-xl
        ${
          highlightMode
            ? "bg-yellow-500 text-black"
            : "bg-[#181818] hover:bg-[#239962]"
        }`}
      >
        <Highlighter size={20} />
      </button>

    </div>

    {/* Container */}

    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Top Buttons */}

      <div className="flex justify-between items-center flex-wrap gap-4">

        <div className="flex gap-4">

          <button
            onClick={() => navigate(-1)}
            className="bg-[#181818] hover:bg-[#239962] transition px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            className="bg-[#181818] hover:bg-[#239962] transition px-6 py-3 rounded-xl flex items-center gap-2"
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
          className="bg-[#181818] hover:bg-[#239962] transition px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Share2 size={18} />
          Share
        </button>

      </div>

      {/* Hero */}

      <div className="mt-10">

        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={blog.title}
            allowFullScreen
            className="w-full h-[250px] md:h-[420px] lg:h-[540px] rounded-3xl shadow-2xl"
          />
        ) : (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[250px] md:h-[420px] lg:h-[540px] object-cover rounded-3xl shadow-2xl"
          />
        )}

      </div>

      {/* Title */}

      <div className="text-center mt-12">

        <div className="flex justify-center gap-3 flex-wrap">

          <span className="bg-[#239962] px-5 py-2 rounded-full flex items-center gap-2 text-sm">

            <Folder size={15} />

            {blog.category}

          </span>

          <span className="bg-[#181818] px-5 py-2 rounded-full flex items-center gap-2 text-sm">

            <Calendar size={15} />

            {new Date(blog.createdAt).toLocaleDateString()}

          </span>

        </div>

        <h1 className="text-5xl lg:text-6xl font-black mt-8 leading-tight">

          {blog.title}

        </h1>

        <p className="text-gray-400 text-2xl mt-6 max-w-4xl mx-auto">

          {blog.subtitle}

        </p>

      </div>

      {/* Reader Starts */}

      <div className="mt-16">  
        {/* =========================
      ARTICLE READER
========================= */}

<div className="mt-20 max-w-4xl mx-auto">

  {[
    {
      number: "01",
      emoji: "📖",
      title: "Introduction",
      color: "bg-emerald-600",
    },
    {
      number: "02",
      emoji: "🧠",
      title: "Body",
      color: "bg-blue-600",
    },
    {
      number: "03",
      emoji: "📚",
      title: "Examples",
      color: "bg-purple-600",
    },
    {
      number: "04",
      emoji: "🏁",
      title: "Conclusion",
      color: "bg-orange-500",
    },
  ].map((section, sectionIndex) => {

    const paragraphs = blog.description
      .split("\n\n")
      .filter((item) => item.trim() !== "");

    const chunk = Math.ceil(paragraphs.length / 4);

    const currentSection = paragraphs.slice(
      sectionIndex * chunk,
      (sectionIndex + 1) * chunk
    );

    return (

      <section
        key={section.number}
        className="mb-20"
      >

        {/* Section Header */}

        <div className="flex items-center gap-6 mb-10">

          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${section.color}`}
          >
            {section.emoji}
          </div>

          <div>

            <p className="uppercase tracking-[0.4em] text-gray-400 text-sm">

              PART {section.number}

            </p>

            <h2 className="text-4xl font-bold">

              {section.title}

            </h2>

          </div>

        </div>

        {/* Section Body */}

        <div className="space-y-7">

          {currentSection.map((paragraph, i) => {

            const key = `${sectionIndex}-${i}`;

            return (

              <p
                key={key}
                onClick={() => toggleHighlight(key)}
                style={{
                  fontSize: `${fontSize}px`,
                }}
                className={`leading-10 rounded-xl px-3 py-2 transition duration-300 ${
                  highlights[key]
                    ? "bg-yellow-400/20 border-l-4 border-yellow-400"
                    : "hover:bg-white/5"
                }`}
              >
                {paragraph}
              </p>

            );

          })}

        </div>

      </section>

    );

  })}

</div>
        {/* ==================== ARTICLE SECTIONS ==================== */}

<div className="max-w-5xl mx-auto mt-16 px-6 pb-24">

  {[
    {
      title: "INTRODUCTION",
      number: "01",
      emoji: "📖",
      color: "#239962",
    },
    {
      title: "BODY",
      number: "02",
      emoji: "🧠",
      color: "#2563EB",
    },
    {
      title: "EXAMPLES",
      number: "03",
      emoji: "📚",
      color: "#7C3AED",
    },
    {
      title: "CONCLUSION",
      number: "04",
      emoji: "🏁",
      color: "#EA580C",
    },
  ].map((section, index) => {

    const paragraphs = blog.description
      .split("\n\n")
      .filter((p) => p.trim() !== "");

    const size = Math.ceil(paragraphs.length / 4);

    const content = paragraphs.slice(
      index * size,
      (index + 1) * size
    );

    return (

      <section
        key={index}
        className="mb-14 overflow-hidden rounded-3xl bg-[#111111] border border-[#232323] shadow-2xl"
      >

        {/* Header */}

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

          {content.map((paragraph, i) => (

            <p
              key={i}
              onClick={() =>
                highlightMode &&
                setHighlights((prev) => ({
                  ...prev,
                  [`${index}-${i}`]:
                    !prev[`${index}-${i}`],
                }))
              }
              style={{
                fontSize: `${fontSize}px`,
              }}
              className={`leading-[2.2] mb-8 rounded-xl px-3 py-2 transition-all duration-300 ${
                highlights[`${index}-${i}`]
                  ? "bg-yellow-500/25"
                  : ""
              }`}
            >

              {paragraph}

            </p>

          ))}

        </div>

      </section>

    );

  })}

</div>
        
