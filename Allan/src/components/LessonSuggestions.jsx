import React from "react";
import { ArrowUp } from "lucide-react";
import { lessonSuggestions } from "../data/lessonSuggestions";

const LessonSuggestions = () => {
  return (
    <section className="bg-[#12170f] py-16 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[#e7b635] tracking-[0.25em] font-bold text-sm mb-4">
            JUST ASK ALLAN
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#f5f0df] mb-4">
            What should Allan learn next?
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Suggest a question or a lesson topic. Vote up the ones you're
            most curious about — the top five move to the front of the line.
          </p>
        </div>

        {/* Decorative line */}
        <div className="flex gap-5 mb-10 overflow-hidden">
          {Array.from({ length: 16 }).map((_, index) => (
            <span
              key={index}
              className={`w-8 h-2 shrink-0 -skew-x-12 ${
                index % 2 === 0
                  ? "bg-[#e7b635]"
                  : "bg-[#71956c]"
              }`}
            />
          ))}
        </div>

        {/* Up next */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-[#f5f0df]">
            Up next
          </h3>

          <button
            type="button"
            className="flex items-center gap-3 border-2 border-[#e7b635] text-[#e7b635] px-5 py-3 rounded-full font-semibold hover:bg-[#e7b635] hover:text-[#12170f] transition"
          >
            <span className="text-2xl leading-none">+</span>
            Suggest a lesson
          </button>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          {lessonSuggestions.map((lesson, index) => {
            const maxVotes = Math.max(
              ...lessonSuggestions.map((item) => item.votes)
            );

            const progress =
              (lesson.votes / maxVotes) * 100;

            return (
              <div
                key={lesson.id}
                className="relative border border-gray-700 rounded-2xl p-5 md:p-6 bg-[#1b2418] hover:border-gray-500 transition"
              >
                <div className="flex items-center gap-5">

                  {/* Number */}
                  <div className="text-3xl md:text-4xl font-bold text-gray-600 w-14 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Main content */}
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
                    <h4 className="text-lg md:text-2xl font-medium text-[#f5f0df] leading-relaxed">
                      {lesson.title}
                    </h4>

                    {/* Progress */}
                    <div className="mt-5 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e7b635] rounded-full transition-all"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Vote button */}
                  <button
                    type="button"
                    className="shrink-0 w-20 h-20 rounded-xl border border-gray-600 flex flex-col items-center justify-center text-gray-300 hover:border-[#e7b635] hover:text-[#e7b635] transition"
                  >
                    <ArrowUp size={22} />
                    <span className="font-bold text-lg">
                      {lesson.votes}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LessonSuggestions;
