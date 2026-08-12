import React from "react";
import { useAppContext } from "../context/AppContext";
import BlogCard from "./BlogCard";

const Blogs = () => {
  const { blogs, loading } = useAppContext();

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h2 className="text-center text-sm sm:text-xl font-semibold">
          Loading blogs...
        </h2>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-8">
        Latest Articles, Videos &amp; Guides
      </h2>

      {blogs.length === 0 ? (
        <div className="text-center py-6 sm:py-10">
          <h3 className="text-sm sm:text-xl text-gray-500">
            No blogs available.
          </h3>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Blogs;
