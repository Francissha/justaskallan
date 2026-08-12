import React, { useMemo, useState } from "react";
import { FaPlay, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const getYoutubeThumbnail = (url) => {
  if (!url) return "";

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
};
const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : "";
};

const Header = () => {
  const navigate = useNavigate();
  const { blogs } = useAppContext();
  const [search, setSearch] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  // Most Recently Uploaded Video
  const featuredVideo = useMemo(() => {
    const videos = blogs
      .filter((blog) => blog.type === "Video" && blog.youtubeLink)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return videos[0] || null;
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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-10">
      {/* SEARCH */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2 sm:gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-base" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search articles, videos or categories..."
              className="w-full h-9 sm:h-14 rounded-full border border-gray-300 pl-9 sm:pl-14 pr-3 sm:pr-6 text-xs sm:text-base outline-none focus:ring-2 focus:ring-[#239962]"
            />

            {search && (
              <div className="absolute left-0 right-0 top-11 sm:top-16 bg-white rounded-xl sm:rounded-2xl shadow-2xl border z-50 overflow-hidden">
                {filteredBlogs.length > 0 ? (
                  filteredBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      onClick={() => {
                        navigate(`/blog/${blog._id}`);
                        setSearch("");
                      }}
                      className="flex gap-2 sm:gap-4 p-2 sm:p-4 cursor-pointer hover:bg-gray-100 transition"
                    >
                      <img
                        src={
                          blog.type === "Video"
                            ? getYoutubeThumbnail(blog.youtubeLink)
                            : blog.image
                        }
                        alt={blog.title}
                        className="w-10 h-10 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#1B4D3E] text-xs sm:text-base truncate">
                          {blog.title}
                        </h3>

                        <p className="text-gray-500 text-[10px] sm:text-sm line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1">
                          {blog.subtitle}
                        </p>

                        <div className="mt-1 sm:mt-2">
                          <span className="bg-[#239962]/10 text-[#239962] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 sm:p-6 text-center text-gray-500 text-xs sm:text-sm">
                    No articles found.
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#239962] text-white px-3 sm:px-8 rounded-full font-semibold text-xs sm:text-base hover:bg-[#1d7c4d] transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* FEATURED VIDEO — plays inline on the home page */}
      {featuredVideo && (
        <div className="grid md:grid-cols-2 gap-4 sm:gap-10 mt-5 sm:mt-12 items-center">
          {/* Player / Thumbnail */}
          <div className="relative rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl aspect-video">
            {isPlaying ? (
              <iframe
                src={getYoutubeEmbedUrl(featuredVideo.youtubeLink)}
                title={featuredVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <>
                <img
                  src={getYoutubeThumbnail(featuredVideo.youtubeLink)}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover"
                />

                <div
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                >
                  <div className="bg-[#239962] p-2.5 sm:p-6 rounded-full shadow-2xl group-hover:scale-110 transition duration-300">
                    <FaPlay className="text-white text-sm sm:text-3xl ml-0.5 sm:ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 sm:bottom-5 sm:left-5 bg-white px-2 sm:px-5 py-1 sm:py-2 rounded-md sm:rounded-xl shadow-lg font-semibold text-[10px] sm:text-base">
                  🎬 Featured Video
                </div>
              </>
            )}
          </div>

          {/* Video Details */}
          <div>
            <span className="bg-red-100 text-red-700 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] sm:text-sm font-bold uppercase">
              {featuredVideo.category}
            </span>

            <h1 className="text-lg sm:text-4xl lg:text-5xl font-extrabold mt-2 sm:mt-6 leading-tight text-[#1B4D3E]">
              {featuredVideo.title}
            </h1>

            <p className="mt-2 sm:mt-6 text-xs sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
              {featuredVideo.subtitle}
            </p>

            {!isPlaying && (
              <button
                onClick={() => setIsPlaying(true)}
                className="inline-flex flex-row-reverse sm:flex-row items-center gap-1.5 sm:gap-3 mt-3 sm:mt-8 bg-[#239962] hover:bg-[#1d7c4d] text-white px-3.5 sm:px-8 py-1.5 sm:py-4 rounded-full font-semibold text-xs sm:text-base transition"
              >
                <FaPlay className="text-[10px] sm:text-base" />
                Watch Video
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
