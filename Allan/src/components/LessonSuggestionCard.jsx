import React from "react";
import { ChevronUp } from "lucide-react";

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
    <div className="group relative rounded-2xl border border-[#68705f]/50 bg-[#20261b]/80 px-5 py-5 transition-all duration-200 hover:border-[#dcae32]/50 hover:bg-[#252b20]">
      <div className="flex items-center gap-4">

        {/* Ranking */}
        <div className="w-8 shrink-0">
          <span className="text-3xl font-semibold text-[#60675a]">
            {String(rank).padStart(2, "0")}
          </span>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">

          {/* Category */}
          <span
            className={`inline-flex rounded-full border px-4 py-1 text-xs font-bold tracking-widest ${
              lesson.category === "TECH"
                ? "border-[#6ba7d1] text-[#6ba7d1]"
                : "border-[#9bc184] text-[#9bc184]"
            }`}
          >
            {lesson.category}
          </span>

          {/* Title */}
          <h3 className="mt-3 pr-2 text-lg font-medium leading-7 text-[#f3edda]">
            {lesson.title}
          </h3>

          {/* Progress bar */}
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#42483d]">
            <div
              className="h-full rounded-full bg-[#e0ad31] transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Vote button */}
        <button
          onClick={() => onVote(lesson.id)}
          className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#5b6254] text-[#f3edda] transition hover:border-[#dcae32] hover:bg-[#30362a] active:scale-95"
        >
          <ChevronUp
            size={28}
            strokeWidth={2.5}
          />

          <span className="text-lg font-semibold">
            {lesson.votes}
          </span>
        </button>
      </div>
    </div>
  );
};

export default LessonSuggestionCard;
