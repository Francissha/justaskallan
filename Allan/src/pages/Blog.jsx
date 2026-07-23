import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import BlogCard from "../components/BlogCard";

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
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

  const fetchBlog = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/blog/${id}`);

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

  if (loading) {
    return (
      <div className="py-32 text-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-32 text-center text-2xl font-semibold">
        Blog not found.
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

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="w-full  py-6">
  <div className="max-w-6xl mx-auto px-6">

    {embedUrl ? (
      <iframe
        src={embedUrl}
        title={blog.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-[220px] md:h-[340px] lg:h-[420px] rounded-2xl shadow-lg"
      />
    ) : (
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-[220px] md:h-[340px] lg:h-[420px] object-cover rounded-2xl shadow-lg"
      />
    )}

  </div>
</section>

      {/* Blog Content */}

      <section className="max-w-4xl mx-auto px-6 py-6">

        {blog.category && (
          <span className="inline-block bg-[#1B4D3E] text-white px-4 py-2 rounded-full text-sm">
            {blog.category}
          </span>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-[#1B4D3E] mt-2 leading-tight">
          {blog.title}
        </h1>

        {blog.subtitle && (
          <p className="text-xl text-gray-500 mt-4">
            {blog.subtitle}
          </p>
        )}

        <div className="flex gap-3 mt-6 text-gray-500 border-b pb-6">
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>JustAskAllan</span>
        </div>

        <article className="mt-10 text-lg leading-9 text-gray-700 whitespace-pre-line">
          {blog.description}
        </article>

      </section>

      {/* Related Blogs */}

      {relatedBlogs.length > 0 && (
        <section className="bg-gray-100 py-16">

          <div className="max-w-7xl mx-auto px-6">

            <h2 className="text-3xl font-bold text-[#1B4D3E] mb-8">
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

        </section>
      )}

    </div>
  );
};

export default Blog;