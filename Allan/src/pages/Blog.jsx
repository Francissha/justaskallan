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

    const pos = blog.description.indexOf(m, startContent);

    if (pos !== -1 && pos < end) {
      end = pos;
    }
  });

  return blog.description.substring(startContent, end).trim();
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
    color: "#F97316",
    content: getSection("#CONCLUSION"),
  },
];.map((section, sectionIndex) => {

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
        
