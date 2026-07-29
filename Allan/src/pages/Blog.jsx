import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

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

const sectionIcons = ["📖", "🧠", "📚", "🏁"];

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
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
        Loading...
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
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

  const sections = blog.description
    .split(/📖|🧠|📚|🏁/)
    .filter(Boolean);

  const toggleHighlight = (key) => {
    if (!highlightMode) return;

    setHighlights((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  return (
  <div className="bg-[#080808] min-h-screen text-white">

    {/* Reading Progress */}

    <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
      <div
        className="h-full bg-[#239962] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>

    {/* Floating Reader Controls */}

    <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">

      <button
        onClick={() =>
          setFontSize((prev) => prev + 2)
        }
        className="w-12 h-12 rounded-xl bg-[#1B1B1B] hover:bg-[#239962] flex items-center justify-center shadow-lg transition"
      >
        <Plus />
      </button>

      <button
        onClick={() =>
          setFontSize((prev) =>
            Math.max(14, prev - 2)
          )
        }
        className="w-12 h-12 rounded-xl bg-[#1B1B1B] hover:bg-[#239962] flex items-center justify-center shadow-lg transition"
      >
        <Minus />
      </button>

      <button
        onClick={() =>
          setHighlightMode(!highlightMode)
        }
        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition ${
          highlightMode
            ? "bg-yellow-500 text-black"
            : "bg-[#1B1B1B] hover:bg-[#239962]"
        }`}
      >
        <Highlighter />
      </button>

    </div>

    {/* Top Navigation */}

    <div className="max-w-6xl mx-auto pt-8 px-6">

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

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
          className="w-full h-[250px] md:h-[450px] lg:h-[550px] rounded-3xl shadow-2xl"
        />
      ) : (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-[250px] md:h-[450px] lg:h-[550px] rounded-3xl object-cover shadow-2xl"
        />
      )}

      {/* Article Header */}

      <div className="mt-10 text-center">

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

        <h1 className="text-4xl md:text-6xl font-extrabold mt-8 leading-tight">

          {blog.title}

        </h1>

        <p className="text-2xl text-gray-400 mt-5 max-w-4xl mx-auto leading-relaxed">

          {blog.subtitle}

        </p>

      </div>

    </div>

    {/* Reader */}

    <div className="max-w-5xl mx-auto mt-14 px-6 pb-20">
      {/* Reader */}

<div className="space-y-10">

  {[
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
  ].map((section, index) => {

    const paragraphs = blog.description
      .split("\n\n")
      .filter((item) => item.trim() !== "");

    const quarter = Math.ceil(paragraphs.length / 4);

    const content = paragraphs.slice(
      index * quarter,
      (index + 1) * quarter
    );

    return (

      <section
        key={index}
        className="bg-[#111111] rounded-3xl border border-gray-800 shadow-xl overflow-hidden"
      >

        {/* Header */}

        <div
          className="px-8 py-6 border-b border-gray-800"
          style={{
            background: section.color,
          }}
        >

          <div className="flex items-center gap-5">

            <div className="text-5xl">

              {section.emoji}

            </div>

            <div>

              <p className="uppercase tracking-[0.3em] text-white/80 text-sm">

                {section.title}

              </p>

              <h2 className="text-3xl font-bold text-white">

                {section.heading}

              </h2>

            </div>

          </div>

        </div>

        {/* Body */}

        <div className="px-10 py-10">

          {content.map((paragraph, i) => (

            <p
              key={i}
              onClick={() =>
                highlightMode &&
                setHighlights({
                  ...highlights,
                  [`${index}-${i}`]:
                    !highlights[`${index}-${i}`],
                })
              }
              style={{
                fontSize: `${fontSize}px`,
              }}
              className={`mb-7 leading-10 rounded-xl px-3 py-2 transition-all duration-300 cursor-default
              ${
                highlights[`${index}-${i}`]
                  ? "bg-yellow-500/30"
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
        </div>
);

};

export default Blog;
