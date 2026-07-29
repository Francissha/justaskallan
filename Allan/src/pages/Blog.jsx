import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BlogCard from "../components/BlogCard";
import {
  ArrowLeft,
  Calendar,
  Folder,
  Share2,
} from "lucide-react";

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

  const {
    axios,
    backendUrl,
    blogs,
    fetchAllBlogs,
  } = useAppContext();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
        Blog Not Found
      </div>
    );
  }

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

  const renderContent = () => {
    const lines = blog.description.split("\n");

    return lines.map((line, index) => {
      const text = line.trim();

      if (!text) return <br key={index} />;

      // Main Heading
      if (text === text.toUpperCase() && text.length > 8) {
        return (
          <h2
            key={index}
            className="text-3xl font-bold text-[#1B4D3E] mt-10 mb-5"
          >
            {text}
          </h2>
        );
      }

      // Numbered headings
      if (/^\d+\./.test(text)) {
        return (
          <h3
            key={index}
            className="text-2xl font-bold mt-8 mb-3"
          >
            {text}
          </h3>
        );
      }

      // Bullet Points
      if (text.startsWith("-")) {
        return (
          <li
            key={index}
            className="ml-8 list-disc text-lg leading-9"
          >
            {text.replace("-", "")}
          </li>
        );
      }

      return (
        <p
          key={index}
          className="mb-5 text-lg leading-9 text-gray-700"
        >
          {text}
        </p>
      );
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Hero */}

      <div className="max-w-7xl mx-auto py-8 px-6">

        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={blog.title}
            allowFullScreen
            className="w-full h-[250px] md:h-[420px] lg:h-[520px] rounded-3xl shadow-xl"
          />
        ) : (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[250px] md:h-[420px] lg:h-[520px] object-cover rounded-3xl shadow-xl"
          />
        )}

      </div>

      {/* Content */}

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-10">

        <div className="flex flex-wrap gap-3">

          <span className="bg-[#1B4D3E] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <Folder size={15} />
            {blog.category}
          </span>

          <span className="bg-gray-100 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <Calendar size={15} />
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>

        </div>

        <h1 className="text-5xl font-bold mt-8 text-[#1B4D3E]">
          {blog.title}
        </h1>

        <p className="text-2xl text-gray-500 mt-4">
          {blog.subtitle}
        </p>

        <div className="border-b my-8"></div>

        <div className="prose prose-lg max-w-none">
          {renderContent()}
        </div>

        <div className="flex gap-4 mt-12">

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1B4D3E] text-white hover:bg-[#16382e]"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <button
            onClick={() =>
              navigator.share
                ? navigator.share({
                    title: blog.title,
                    url: window.location.href,
                  })
                : navigator.clipboard.writeText(window.location.href)
            }
            className="flex items-center gap-2 px-6 py-3 rounded-xl border hover:bg-gray-100"
          >
            <Share2 size={18} />
            Share
          </button>

        </div>

      </div>

      {relatedBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto py-16 px-6">

          <h2 className="text-4xl font-bold text-[#1B4D3E] mb-10">
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

        </section>
      )}

    </div>
  );
};

export default Blog;
