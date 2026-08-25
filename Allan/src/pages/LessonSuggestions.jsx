import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import LessonSuggestionCard from "../components/LessonSuggestionCard";
import { lessonSuggestions } from "../data/lessonSuggestions";

const LessonSuggestions = () => {
  const [lessons, setLessons] = useState(lessonSuggestions);

  const maxVotes = useMemo(() => {
    return Math.max(...lessons.map((lesson) => lesson.votes), 1);
  }, [lessons]);

  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => b.votes - a.votes).slice(0, 3);
  }, [lessons]);

  const handleVote = (id) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id ? { ...lesson, votes: lesson.votes + 1 } : lesson
      )
    );
  };

  const handleSuggestLesson = () => {
    console.log("Open suggest lesson modal");
  };

  return (
    <section className="bg-white text-gray-900">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Header */}
        <div>
          <p className="text-xs font-bold tracking-widest text-[#e0ad31] uppercase">
            Just Ask Allan
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-3xl">
            What should Allan learn next?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Suggest a topic and vote up the ones you're most curious about — the top three move to the front of the line.
          </p>
          {/* Decorative divider */}
          <div className="mt-5 flex gap-3 overflow-hidden">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className={`h-1.5 min-w-6 -skew-x-12 ${
                  index % 2 === 0 ? "bg-[#dcae32]" : "bg-[#71916b]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Up next row */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
            Up next
          </h3>
          <button
            type="button"
            onClick={handleSuggestLesson}
            className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-[#dcae32] px-4 py-2 text-sm font-semibold text-[#dcae32] transition hover:bg-[#dcae32] hover:text-white active:scale-95"
          >
            <Plus size={16} />
            <span>Suggest a lesson</span>
          </button>
        </div>

        {/* Lesson list */}
        <div className="mt-4 space-y-3">
          {sortedLessons.map((lesson, index) => (
            <LessonSuggestionCard
              key={lesson.id}
              lesson={lesson}
              rank={index + 1}
              maxVotes={maxVotes}
              onVote={handleVote}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LessonSuggestions;
