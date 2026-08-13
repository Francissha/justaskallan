import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import LessonSuggestionCard from "../components/LessonSuggestionCard";
import { lessonSuggestions } from "../data/lessonSuggestions";

const LessonSuggestions = () => {
  const [lessons, setLessons] = useState(lessonSuggestions);

  const maxVotes = useMemo(() => {
    return Math.max(
      ...lessons.map((lesson) => lesson.votes),
      1
    );
  }, [lessons]);

  const sortedLessons = useMemo(() => {
    return [...lessons].sort(
      (a, b) => b.votes - a.votes
    );
  }, [lessons]);

  const handleVote = (id) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id
          ? {
              ...lesson,
              votes: lesson.votes + 1,
            }
          : lesson
      )
    );
  };

  const handleSuggestLesson = () => {
    console.log("Open suggest lesson modal");
  };

  return (
    <section className="bg-[#151a12] text-[#f3edda]">
      <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8 sm:py-16">

        {/* Header */}
        <div>
          <p className="text-sm font-bold tracking-[0.25em] text-[#e0ad31]">
            JUST ASK ALLAN
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-[#f3edda] sm:text-5xl">
            What should Allan learn next?
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-[#b8b5a7] sm:text-lg">
            Suggest a question or a lesson topic. Vote up
            the ones you're most curious about — the top
            five move to the front of the line.
          </p>

          {/* Decorative divider */}
          <div className="mt-10 flex gap-5 overflow-hidden">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className={`h-2 min-w-8 -skew-x-12 ${
                  index % 2 === 0
                    ? "bg-[#dcae32]"
                    : "bg-[#71916b]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Up next */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Up next
          </h2>

          <button
            type="button"
            onClick={handleSuggestLesson}
            className="flex shrink-0 items-center gap-2 rounded-full border-2 border-[#dcae32] px-5 py-3 font-semibold text-[#dcae32] transition hover:bg-[#dcae32] hover:text-[#151a12] active:scale-95 sm:px-7"
          >
            <Plus size={22} />
            <span>Suggest a lesson</span>
          </button>
        </div>

        {/* Lesson list */}
        <section className="mt-7 space-y-4">
          {sortedLessons.map((lesson, index) => (
            <LessonSuggestionCard
              key={lesson.id}
              lesson={lesson}
              rank={index + 1}
              maxVotes={maxVotes}
              onVote={handleVote}
            />
          ))}
        </section>

      </main>
    </section>
  );
};

export default LessonSuggestions;
