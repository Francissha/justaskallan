import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full aspect-video object-cover"
      />

      <span className="ml-3 sm:ml-5 mt-2 sm:mt-4 inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#239962]/10 text-[#239962] text-[10px] sm:text-xs font-semibold uppercase">
        {blog.category || "Article"}
      </span>

      <div className="p-3 sm:p-5">
        <h2 className="text-sm sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
          {blog.title}
        </h2>

        {blog.subtitle && (
          <p className="text-[#239962] text-xs sm:text-sm mb-1 sm:mb-2">
            {blog.subtitle}
          </p>
        )}

        <p className="text-xs sm:text-sm text-gray-600">
          {blog.description?.length > 120
            ? blog.description.slice(0, 120) + "..."
            : blog.description}
        </p>

        <button className="mt-2 sm:mt-4 text-xs sm:text-base text-[#239962] font-semibold hover:underline">
          Read More →
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
