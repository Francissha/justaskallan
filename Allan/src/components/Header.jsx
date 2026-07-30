import React, { useMemo, useState } from "react";
import { FaPlay, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const getYoutubeThumbnail = (url) => {
  if (!url) return "";

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : "";
};

const Header = () => {
  const navigate = useNavigate();

  const { blogs } = useAppContext();

  const [search, setSearch] = useState("");

  // Random Featured Video
  const featuredVideo = useMemo(() => {
    const videos = blogs.filter(
      (blog) =>
        blog.type === "Video" &&
        blog.youtubeLink
    );

    if (!videos.length) return null;

    return videos[
      Math.floor(Math.random() * videos.length)
    ];
  }, [blogs]);

  // Search Results
  const filteredBlogs = useMemo(() => {
    if (!search.trim()) return [];

    const keyword = search.toLowerCase();

    return blogs
      .filter((blog) => {
        return (
          blog.title?.toLowerCase().includes(keyword) ||
          blog.subtitle?.toLowerCase().includes(keyword) ||
          blog.category?.toLowerCase().includes(keyword) ||
          blog.description?.toLowerCase().includes(keyword)
        );
      })
      .slice(0, 8);
  }, [search, blogs]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (filteredBlogs.length > 0) {
      navigate(`/blog/${filteredBlogs[0]._id}`);
      setSearch("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* SEARCH */}

      <form
        onSubmit={handleSubmit}
        className="relative"
      >

        <div className="flex gap-4">

          <div className="relative flex-1">

            <FaSearch
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              type="text"
              placeholder="Search articles, videos or categories..."
              className="w-full h-14 rounded-full border border-gray-300 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#239962]"
            />

            {search && (

              <div className="absolute left-0 right-0 top-16 bg-white rounded-2xl shadow-2xl border z-50 overflow-hidden">

                {filteredBlogs.length > 0 ? (

                  filteredBlogs.map((blog) => (

                    <div
                      key={blog._id}
                      onClick={() => {
                        navigate(`/blog/${blog._id}`);
                        setSearch("");
                      }}
                      className="flex gap-4 p-4 cursor-pointer hover:bg-gray-100 transition"
                    >

                      <img
                        src={
                          blog.type === "Video"
                            ? getYoutubeThumbnail(
                                blog.youtubeLink
                              )
                            : blog.image
                        }
                        alt={blog.title}
                        className="w-20 h-20 rounded-xl object-cover"
                      />

                      <div className="flex-1">

                        <h3 className="font-bold text-[#1B4D3E]">

                          {blog.title}

                        </h3>

                        <p className="text-gray-500 text-sm line-clamp-2 mt-1">

                          {blog.subtitle}

                        </p>

                        <div className="mt-2">

                          <span className="bg-[#239962]/10 text-[#239962] px-3 py-1 rounded-full text-xs font-semibold">

                            {blog.category}

                          </span>

                        </div>

                      </div>

                    </div>

                  ))

                ) : (

                  <div className="p-6 text-center text-gray-500">

                    No articles found.

                  </div>

                )}

              </div>

            )}

          </div>

          <button
            type="submit"
            className="bg-[#239962] text-white px-8 rounded-full font-semibold hover:bg-[#1d7c4d] transition"
          >

            Search

          </button>

        </div>

      </form>   
            {/* FEATURED VIDEO */}

      {featuredVideo && (
        <div className="grid md:grid-cols-2 gap-10 mt-12 items-center">

          {/* Thumbnail */}

          <div className="relative rounded-3xl overflow-hidden shadow-2xl">

            <img
              src={getYoutubeThumbnail(featuredVideo.youtubeLink)}
              alt={featuredVideo.title}
              className="w-full h-[380px] object-cover"
            />

            <a
              href={featuredVideo.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="bg-[#239962] p-6 rounded-full shadow-2xl group-hover:scale-110 transition duration-300">

                <FaPlay className="text-white text-3xl ml-1" />

              </div>
            </a>

            <div className="absolute bottom-5 left-5 bg-white px-5 py-2 rounded-xl shadow-lg font-semibold">

              🎬 Featured Video

            </div>

          </div>

          {/* Video Details */}

          <div>

            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold uppercase">

              {featuredVideo.category}

            </span>

            <h1 className="text-5xl font-extrabold mt-6 leading-tight text-[#1B4D3E]">

              {featuredVideo.title}

            </h1>

            <p className="mt-6 text-xl text-gray-600 leading-relaxed">

              {featuredVideo.subtitle}

            </p>

            <a
              href={featuredVideo.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-8 bg-[#239962] hover:bg-[#1d7c4d] text-white px-8 py-4 rounded-full font-semibold transition"
            >

              <FaPlay />

              Watch on YouTube

            </a>

          </div>

        </div>
      )}

      {/* WEEKLY CAUSE */}

      <div className="mt-16 bg-gradient-to-r from-green-100 to-green-200 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">

        <div>

          <h2 className="text-2xl font-bold text-[#1B4D3E]">

            📚 This Week's Cause

          </h2>

          <p className="text-gray-700 mt-3 max-w-2xl">

            Help provide new books to St. Stephen Primary School.
            Together we have raised

            <span className="font-bold text-[#239962]">

              {" "}KES 34,000

            </span>

            {" "}towards our goal of

            <span className="font-bold">

              {" "}KES 50,000.

            </span>

          </p>

        </div>

        <button
          onClick={() => navigate("/contribute")}
          className="border-2 border-red-500 text-red-600 px-8 py-4 rounded-full font-bold hover:bg-red-500 hover:text-white transition"
        >

          ❤️ Contribute

        </button>

      </div>

    </div>
  );
};

export default Header;
