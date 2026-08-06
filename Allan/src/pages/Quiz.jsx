import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

import { useAppContext } from "../context/AppContext";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { axios, backendUrl } = useAppContext();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/blog/${id}`);

        if (data.success) {
          setBlog(data.blog);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    setAnswers({});
    setSubmitted(false);
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#080808] text-white flex justify-center items-center text-2xl font-bold">
        Loading...
      </div>
    );

  const hasQuiz = blog && Array.isArray(blog.quiz) && blog.quiz.length > 0;

  if (!blog || !hasQuiz)
    return (
      <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-center items-center gap-6 text-2xl font-bold">
        Quiz Not Found
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-[#181818] hover:bg-[#239962] px-5 py-3 rounded-xl transition text-base font-semibold"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>
    );

  const selectAnswer = (questionIndex, optionIndex) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);

    requestAnimationFrame(() => {
      document.getElementById("quiz-score")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const score = blog.quiz.reduce(
    (total, q, index) => (answers[index] === q.correctAnswer ? total + 1 : total),
    0
  );

  const allAnswered = blog.quiz.every((_, index) => answers[index] !== undefined);

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(`/blog/${blog._id}`)}
            className="flex items-center gap-2 bg-[#181818] hover:bg-[#239962] px-5 py-3 rounded-xl transition"
          >
            <ArrowLeft size={18} />
            Back to Article
          </button>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="bg-[#239962] px-5 py-2 rounded-full text-sm font-semibold">
            Quiz
          </span>

          <h1 className="text-4xl md:text-5xl font-black mt-6">{blog.title}</h1>

          <p className="text-gray-400 mt-4">
            {blog.quiz.length} question{blog.quiz.length > 1 ? "s" : ""} — answer them all, then submit to see your score.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {blog.quiz.map((q, qIndex) => {
            const selected = answers[qIndex];
            const isCorrect = selected === q.correctAnswer;

            return (
              <div key={qIndex} className="bg-[#111111] border border-gray-800 rounded-2xl p-6">
                <p className="text-lg font-semibold mb-4">
                  {qIndex + 1}. {q.question}
                </p>

                <div className="space-y-3">
                  {q.options.map((option, oIndex) => {
                    const isSelected = selected === oIndex;
                    const isRightAnswer = oIndex === q.correctAnswer;

                    let optionClasses =
                      "flex items-center justify-between gap-3 w-full text-left px-4 py-3 rounded-xl border transition duration-200 ";

                    if (!submitted) {
                      optionClasses += isSelected
                        ? "bg-[#239962]/20 border-[#239962]"
                        : "bg-[#181818] border-gray-800 hover:border-gray-600";
                    } else if (isRightAnswer) {
                      optionClasses += "bg-green-500/15 border-green-500";
                    } else if (isSelected && !isRightAnswer) {
                      optionClasses += "bg-red-500/15 border-red-500";
                    } else {
                      optionClasses += "bg-[#181818] border-gray-800 opacity-60";
                    }

                    return (
                      <button
                        key={oIndex}
                        type="button"
                        onClick={() => selectAnswer(qIndex, oIndex)}
                        disabled={submitted}
                        className={optionClasses}
                      >
                        <span>{option}</span>

                        {submitted && isRightAnswer && (
                          <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                        )}

                        {submitted && isSelected && !isRightAnswer && (
                          <XCircle size={20} className="text-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <p
                    className={`mt-4 text-sm font-semibold ${
                      isCorrect ? "text-green-500" : "text-red-400"
                    }`}
                  >
                    {isCorrect
                      ? "Correct!"
                      : `Incorrect — correct answer: ${q.options[q.correctAnswer]}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit / Score */}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="mt-8 w-full sm:w-auto bg-[#239962] hover:bg-[#1d7c4d] disabled:opacity-40 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full font-semibold transition"
          >
            {allAnswered ? "Submit Answers" : `Answer All ${blog.quiz.length} Questions`}
          </button>
        ) : (
          <div
            id="quiz-score"
            className="mt-8 bg-[#111111] border border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <p className="text-2xl font-black text-[#239962]">
                You scored {score} / {blog.quiz.length}
              </p>
              <p className="text-gray-400 mt-1">
                {score === blog.quiz.length
                  ? "Perfect score — great work!"
                  : "Review the highlighted answers above to see where you went wrong."}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="bg-[#181818] hover:bg-[#239962] px-6 py-3 rounded-xl font-semibold transition"
              >
                Retry Quiz
              </button>

              <button
                onClick={() => navigate(`/blog/${blog._id}`)}
                className="bg-[#239962] hover:bg-[#1d7c4d] px-6 py-3 rounded-xl font-semibold transition"
              >
                Back to Article
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
