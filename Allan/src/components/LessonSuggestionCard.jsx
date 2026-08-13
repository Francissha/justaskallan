import React from "react";
import { ArrowUp } from "lucide-react";

const LessonSuggestionCard = ({
  lesson,
  rank,
  maxVotes,
  onVote,
}) => {
  const progress =
    maxVotes > 0
      ? (lesson.votes / maxVotes) * 100
      : 0;

  return (
    <div className="border border-gray-700 rounded-2xl p-5 md:p-6 bg-[#1b2418] hover:border-gray-500 transition">
      <div className="flex items-center gap-5">

        {/* Rank */}
        <div className="text-3xl md:text-4xl font-bold text-gray-600 w-14 shrink-0">
          {String(rank).padStart(2, "0")}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Category */}
          <span
            className={`inline-block px-4 py-1 rounded-full border text-xs font-bold tracking-wider mb-3 ${
              lesson.category === "TECH"
                ? "border-blue-400 text-blue-400"
                : "border-[#8db47e] text-[#8db47e]"
            }`}
          >
            {lesson.category}
          </span>

          {/* Title */}
          <h3 className="text-lg md:text-2xl font-medium text-[#f5f0df] leading-relaxed">
            {lesson.title}
          </h3>

          {/* Progress */}
          <div className="mt-5 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#e7b635] rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Vote */}
        <button
          type="button"
          onClick={() => onVote(lesson.id)}
          className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl border border-gray-600 flex flex-col items-center justify-center text-gray-300 hover:border-[#e7b635] hover:text-[#e7b635] transition"
        >
          <ArrowUp size={22} />

          <span className="font-bold text-lg">
            {lesson.votes}
          </span>
        </button>

      </div>
    </div>
  );
};

export default LessonSuggestionCard;
