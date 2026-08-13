import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

const TOTAL_QUESTIONS = 5;
const OPTIONS_PER_QUESTION = 4;

const buildEmptyQuiz = () =>
  Array.from({ length: TOTAL_QUESTIONS }, () => ({
    question: "",
    options: Array.from({ length: OPTIONS_PER_QUESTION }, () => ""),
    correctAnswer: 0,
  }));

const AddQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, backendUrl } = useAppContext();

  const [blogTitle, setBlogTitle] = useState("");
  const [quiz, setQuiz] = useState(buildEmptyQuiz());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load blog title + existing quiz (if any)
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/blog/${id}`);

        if (data.success) {
          setBlogTitle(data.blog.title);

          if (data.blog.quiz?.length) {
            // Pad or trim to exactly 5 questions / 4 options each
            const existing = data.blog.quiz.slice(0, TOTAL_QUESTIONS).map((q) => ({
              question: q.question || "",
              options: Array.from(
                { length: OPTIONS_PER_QUESTION },
                (_, i) => q.options?.[i] || ""
              ),
              correctAnswer: q.correctAnswer ?? 0,
            }));

            while (existing.length < TOTAL_QUESTIONS) {
              existing.push(buildEmptyQuiz()[0]);
            }

            setQuiz(existing);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const updateQuestionText = (qIndex, value) => {
    setQuiz((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, question: value } : q))
    );
  };

  const updateOptionText = (qIndex, oIndex, value) => {
    setQuiz((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = [...q.options];
        options[oIndex] = value;
        return { ...q, options };
      })
    );
  };

  const setCorrectAnswer = (qIndex, oIndex) => {
    setQuiz((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, correctAnswer: oIndex } : q))
    );
  };

  const validateQuiz = () => {
    for (let i = 0; i < quiz.length; i++) {
      const q = quiz[i];
      if (!q.question.trim()) return `Question ${i + 1} needs text.`;
      if (q.options.some((opt) => !opt.trim())) {
        return `All 4 options for Question ${i + 1} need text.`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateQuiz();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/blog/${id}/quiz`, {
        quiz,
      });

      if (data.success) {
        alert("Quiz saved successfully.");
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to save quiz.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-base sm:text-2xl font-bold text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white px-4 sm:px-6 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/admin/list-blog")}
          className="flex items-center gap-1.5 sm:gap-2 bg-[#181818] hover:bg-[#239962] px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base mb-4 sm:mb-6 transition"
        >
          <ArrowLeft size={15} className="sm:hidden" />
          <ArrowLeft size={18} className="hidden sm:block" />
          Back to Blogs
        </button>

        <h1 className="text-lg sm:text-2xl font-bold mb-1">Add Quiz — 5 Questions</h1>
        {blogTitle && (
          <p className="text-text-muted text-xs sm:text-sm mb-6">{blogTitle}</p>
        )}

        <div className="space-y-4 sm:space-y-6">
          {quiz.map((q, qIndex) => (
            <div
              key={qIndex}
              className="bg-[#111111] border border-gray-800 rounded-xl p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#239962] text-[10px] sm:text-xs font-bold shrink-0">
                  {qIndex + 1}
                </span>

                <input
                  value={q.question}
                  onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                  placeholder={`Question ${qIndex + 1}`}
                  className="flex-1 bg-[#1B1B1B] rounded-lg p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#239962]"
                />
              </div>

              <div className="space-y-2 pl-8 sm:pl-9">
                {q.options.map((opt, oIndex) => {
                  const isCorrect = q.correctAnswer === oIndex;

                  return (
                    <div key={oIndex} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCorrectAnswer(qIndex, oIndex)}
                        className={`flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 shrink-0 transition ${
                          isCorrect
                            ? "bg-[#239962] border-[#239962]"
                            : "border-gray-600 hover:border-[#239962]"
                        }`}
                        title="Mark as correct answer"
                      >
                        {isCorrect && <CheckCircle2 size={14} className="text-white" />}
                      </button>

                      <input
                        value={opt}
                        onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1}`}
                        className={`flex-1 bg-[#1B1B1B] rounded-lg p-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#239962] ${
                          isCorrect ? "ring-1 ring-[#239962]" : ""
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              <p className="pl-8 sm:pl-9 mt-2 text-[10px] sm:text-xs text-text-muted">
                Tap the circle next to the correct option.
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 sm:mt-8 w-full flex items-center justify-center gap-2 bg-[#239962] hover:bg-[#1d7c4d] disabled:opacity-50 px-6 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold transition"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Quiz"}
        </button>
      </div>
    </div>
  );
};

export default AddQuiz;
