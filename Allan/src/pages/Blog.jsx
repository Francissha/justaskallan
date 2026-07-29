"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Highlighter, Clock, Calendar } from "lucide-react";

const SECTION_META = {
  introduction: { label: "Section One", title: "Introduction", accent: "#239962" },
  body: { label: "Section Two", title: "Body", accent: "#3B82F6" },
  conclusion: { label: "Final Section", title: "Conclusion", accent: "#F97316" },
};

const Blog = ({ blog }) => {
  const [fontSize, setFontSize] = useState(18);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlights, setHighlights] = useState({});

  const highlightsKey = `blog_highlights_${blog?.id ?? "draft"}`;

  useEffect(() => {
    const stored = localStorage.getItem(highlightsKey);
    if (stored) setHighlights(JSON.parse(stored));
  }, [highlightsKey]);

  useEffect(() => {
    localStorage.setItem(highlightsKey, JSON.stringify(highlights));
  }, [highlights, highlightsKey]);

  const toggleHighlight = (sectionKey, paraIndex) => {
    if (!highlightMode) return;
    const key = `${sectionKey}-${paraIndex}`;
    setHighlights((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Scroll-based reading progress, in keeping with the pagination progress dots
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const sections = [
    { key: "introduction", text: blog?.introduction, fallback: "No introduction available." },
    { key: "body", text: blog?.body || blog?.description, fallback: "No body content available." },
    { key: "conclusion", text: blog?.conclusion, fallback: "No conclusion available." },
  ];

  const renderParagraphs = (sectionKey, text) => {
    const paragraphs = (text || "").split(/\n+/).filter((p) => p.trim() !== "");
    if (paragraphs.length === 0) return null;

    return paragraphs.map((paragraph, index) => {
      const key = `${sectionKey}-${index}`;
      const isHighlighted = highlights[key];

      return (
        <motion.p
          key={key}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          onClick={() => toggleHighlight(sectionKey, index)}
          className={`mb-5 rounded-lg px-3 py-1 transition-all duration-300 leading-9 text-lg ${
            highlightMode ? "cursor-pointer" : ""
          } ${
            isHighlighted
              ? "bg-yellow-500/30 text-white"
              : "text-gray-300 hover:bg-gray-800/30"
          }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {paragraph}
        </motion.p>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] min-h-screen text-white py-10 px-4 sm:px-6"
    >
      {/* Reading progress rail */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          style={{ scaleX: progress, transformOrigin: "0% 50%" }}
        />
      </div>

      {/* Side Controls */}
      <div className="hidden lg:flex flex-col items-center fixed left-6 top-1/3 bg-[#1a1a1a] p-4 rounded-2xl shadow-xl space-y-3 border border-gray-800 z-40">
        <button
          onClick={() => setFontSize((f) => Math.min(32, f + 2))}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          A+
        </button>
        <button
          onClick={() => setFontSize((f) => Math.max(12, f - 2))}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          A-
        </button>
        <button
          onClick={() => setHighlightMode((m) => !m)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            highlightMode ? "bg-yellow-500 text-black" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <Highlighter className="w-4 h-4" /> {highlightMode ? "On" : "Off"}
        </button>
      </div>

      {/* Hero */}
      <div className="w-full max-w-5xl mx-auto mb-10">
        {blog?.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-64 sm:h-80 rounded-3xl overflow-hidden mb-8 border border-gray-800"
          >
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight pb-2">
            {blog?.title || "Untitled post"}
          </h1>
          <div className="mt-3 h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />

          <div className="mt-5 flex items-center justify-center gap-6 text-sm text-gray-400">
            {blog?.author && <span>{blog.author}</span>}
            {blog?.date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {blog.date}
              </span>
            )}
            {blog?.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {blog.readTime}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Reading Sections */}
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {sections.map(({ key, text, fallback }, i) => {
          const meta = SECTION_META[key];
          return (
            <motion.section
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-[#111111] rounded-3xl p-8 border border-gray-800 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0"
                  style={{ backgroundColor: meta.accent }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-gray-400">{meta.label}</p>
                  <h2 className="text-3xl font-bold text-white">{meta.title}</h2>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                {text ? renderParagraphs(key, text) : (
                  <p className="text-gray-500 text-lg">{fallback}</p>
                )}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Mobile Controls */}
      <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-2 bg-[#1a1a1a] p-3 rounded-2xl shadow-xl border border-gray-800 z-40">
        <button
          onClick={() => setFontSize((f) => Math.min(32, f + 2))}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-xs font-semibold"
        >
          A+
        </button>
        <button
          onClick={() => setFontSize((f) => Math.max(12, f - 2))}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-xs font-semibold"
        >
          A-
        </button>
        <button
          onClick={() => setHighlightMode((m) => !m)}
          className={`p-2 rounded-lg text-xs font-semibold transition-all ${
            highlightMode ? "bg-yellow-500 text-black" : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          <Highlighter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Blog;
