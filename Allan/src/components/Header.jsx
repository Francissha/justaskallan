import React from "react";
import { FaPlay } from "react-icons/fa";
import { videos } from "../data/videos";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // Get the featured video
  const featuredVideo =
    videos.find((video) => video.featured) || videos[0];

    const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Search */}
      <form className="flex items-center gap-4">
        <input
          type="text"
          placeholder='Search "How to build a fire"...'
          className="flex-1 h-14 rounded-full border border-gray-300 px-6 outline-none focus:ring-2 focus:ring-[#239962]"
        />

        <button
          type="submit"
          className="bg-[#239962] text-white px-8 h-14 rounded-full font-semibold hover:bg-[#1c7d4e] transition"
        >
          Ask a Question
        </button>
      </form>

      {/* Featured Video */}
      <div className="grid md:grid-cols-2 gap-10 mt-12 items-center">
        {/* Thumbnail */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">

          <img
            src={featuredVideo.thumbnail}
            alt={featuredVideo.title}
            className="w-full h-[360px] object-cover"
          />

          {/* Play Button */}
          <a
            href={`https://www.youtube.com/watch?v=${featuredVideo.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex justify-center items-center"
          >
            <div className="bg-[#239962] p-6 rounded-full hover:scale-110 transition">
              <FaPlay className="text-white text-3xl ml-1" />
            </div>
          </a>

          {/* Duration */}
          <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg font-semibold shadow">
            FEATURED VIDEO • {featuredVideo.duration}
          </div>
        </div>

        {/* Video Information */}
        <div>
          <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold uppercase">
            {featuredVideo.category}
          </span>

          <h1 className="text-5xl font-bold mt-5">
            {featuredVideo.title}
          </h1>

          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            {featuredVideo.description}
          </p>

          <a
            href={`https://www.youtube.com/watch?v=${featuredVideo.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 bg-[#239962] text-white px-8 py-3 rounded-full hover:bg-[#1c7d4e] transition"
          >
            Watch on YouTube
          </a>
        </div>
      </div>

      {/* Weekly Cause */}
      <div className="mt-12 bg-green-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="font-bold text-lg">This Week's Cause</h2>

          <p className="text-gray-800  mt-1">
            New library books for St. Stephen Primary School — KES 34,000 of
            50,000 raised.
          </p>
        </div>

        <button
        onClick={() =>navigate("/contribute")}
        className="border border-red-500 text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-500 hover:text-white transition">
          Give →
        </button>
      </div>
    </div>
  );
};

export default Header;