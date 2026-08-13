import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListChecks,
  HelpCircle,
  CheckCircle2,
  Save,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const TOTAL_QUESTIONS = 5;
const OPTIONS_PER_QUESTION = 4;

const createEmptyQuestion = () => ({
  question: "",
  options: Array(OPTIONS_PER_QUESTION).fill(""),
  correctAnswer: 0,
});

const buildEmptyQuiz = () =>
  Array.from(
    { length: TOTAL_QUESTIONS },
    createEmptyQuestion
  );

const Quizzes = () => {
  const navigate = useNavigate();

  const {
    blogs,
    fetchAllBlogs,
    loading,
    axios,
    token,
  } = useAppContext();

  const [expandedBlogId, setExpandedBlogId] = useState(null);
  const [quiz, setQuiz] = useState(buildEmptyQuiz());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const toggleExpand = (blog) => {
    if (expandedBlogId === blog._id) {
      setExpandedBlogId(null);
      return;
    }

    if (blog.quiz?.length) {
      const existing = blog.quiz
        .slice(0, TOTAL_QUESTIONS)
        .map((q) => ({
          question: q.question || "",
          options: Array.from(
            { length: OPTIONS_PER_QUESTION },
            (_, i) => q.options?.[i] || ""
          ),
          correctAnswer:
            typeof q.correctAnswer === "number"
              ? q.correctAnswer
              : 0,
        }));

      while (existing.length < TOTAL_QUESTIONS) {
        existing.push(createEmptyQuestion());
      }

      setQuiz(existing);
    } else {
      setQuiz(buildEmptyQuiz());
    }

    setExpandedBlogId(blog._id);
  };

  const updateQuestionText = (qIndex, value) => {
    setQuiz((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              question: value,
            }
          : q
      )
    );
  };

  const updateOptionText = (qIndex, oIndex, value) => {
    setQuiz((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;

        const options = [...q.options];
        options[oIndex] = value;

        return {
          ...q,
          options,
        };
      })
    );
  };

  const setCorrectAnswer = (qIndex, oIndex) => {
    setQuiz((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              correctAnswer: oIndex,
            }
          : q
      )
    );
  };

  const validateQuiz = () => {
    if (!token) {
      return "You are not logged in. Please login again.";
    }

    for (let i = 0; i < quiz.length; i++) {
      const q = quiz[i];

      if (!q.question.trim()) {
        return `Question ${i + 1} needs text.`;
      }

      if (q.options.length !== OPTIONS_PER_QUESTION) {
        return `Question ${i + 1} must have 4 options.`;
      }

      if (q.options.some((option) => !option.trim())) {
        return `All 4 options for Question ${i + 1} need text.`;
      }

      if (
        q.correctAnswer < 0 ||
        q.correctAnswer >= OPTIONS_PER_QUESTION
      ) {
        return `Question ${i + 1} needs a correct answer.`;
      }
    }

    return null;
  };

  const handleSave = async (blogId) => {
    const validationError = validateQuiz();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);

    try {
      const cleanQuiz = quiz.map((q) => ({
        question: q.question.trim(),
        options: q.options.map((option) => option.trim()),
        correctAnswer: Number(q.correctAnswer),
      }));

      console.log("Saving quiz...");
      console.log("Blog ID:", blogId);
      console.log("Token exists:", !!token);

      const { data } = await axios.put(
        `/api/blog/${blogId}/quiz`,
        {
          quiz: cleanQuiz,
        }
      );

      if (data.success) {
        toast.success("Quiz saved successfully.");

        await fetchAllBlogs();

        setExpandedBlogId(null);
        setQuiz(buildEmptyQuiz());
      } else {
        toast.error(
          data.message || "Failed to save quiz."
        );
      }
    } catch (error) {
      console.error("SAVE QUIZ ERROR:", error);

      if (error.response?.status === 401) {
        toast.error(
          "Your admin session has expired. Please login again."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to save quiz."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <h2>Loading blogs...</h2>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B4D3E]">
          Quizzes
        </h1>

        <p className="text-gray-500 mt-1">
          Manage quiz questions for each blog.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">#</th>
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">
                Quiz Status
              </th>
              <th className="px-6 py-4 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {blogs.length > 0 ? (
              blogs.map((blog, index) => {
                const questionCount =
                  blog.quiz?.length || 0;

                const hasQuiz = questionCount > 0;

                const isExpanded =
                  expandedBlogId === blog._id;

                return (
                  <React.Fragment key={blog._id}>
                    <tr className="border-t hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-20 h-14 rounded-lg object-cover"
                        />
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {blog.title}
                      </td>

                      <td className="px-6 py-4">
                        {hasQuiz ? (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            {questionCount} Question
                            {questionCount > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">
                            No Quiz
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              toggleExpand(blog)
                            }
                            className={`transition ${
                              isExpanded
                                ? "text-red-500 hover:text-red-700"
                                : "text-[#1B4D3E] hover:text-[#16382e]"
                            }`}
                            title={
                              isExpanded
                                ? "Close"
                                : "Add / Edit 5 Questions"
                            }
                          >
                            {isExpanded ? (
                              <X size={18} />
                            ) : (
                              <ListChecks size={18} />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              navigate(
                                `/admin/blog/${blog._id}/quiz`
                              )
                            }
                            className="text-purple-600 hover:text-purple-800 transition"
                            title="Edit Quiz"
                          >
                            <HelpCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td
                          colSpan="5"
                          className="bg-gray-50 px-6 py-6"
                        >
                          <div className="max-w-3xl">
                            <p className="text-sm font-semibold text-[#1B4D3E] mb-4">
                              Editing 5 questions for:{" "}
                              {blog.title}
                            </p>

                            <div className="space-y-4">
                              {quiz.map((q, qIndex) => (
                                <div
                                  key={qIndex}
                                  className="bg-white border border-gray-200 rounded-xl p-4"
                                >
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1B4D3E] text-white text-xs font-bold shrink-0">
                                      {qIndex + 1}
                                    </span>

                                    <input
                                      value={q.question}
                                      onChange={(e) =>
                                        updateQuestionText(
                                          qIndex,
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Question ${
                                        qIndex + 1
                                      }`}
                                      className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B4D3E]"
                                    />
                                  </div>

                                  <div className="space-y-2 pl-8">
                                    {q.options.map(
                                      (option, oIndex) => {
                                        const isCorrect =
                                          q.correctAnswer ===
                                          oIndex;

                                        return (
                                          <div
                                            key={oIndex}
                                            className="flex items-center gap-2"
                                          >
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setCorrectAnswer(
                                                  qIndex,
                                                  oIndex
                                                )
                                              }
                                              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 shrink-0 transition ${
                                                isCorrect
                                                  ? "bg-green-600 border-green-600"
                                                  : "border-gray-300 hover:border-green-500"
                                              }`}
                                              title="Mark as correct"
                                            >
                                              {isCorrect && (
                                                <CheckCircle2
                                                  size={13}
                                                  className="text-white"
                                                />
                                              )}
                                            </button>

                                            <input
                                              value={option}
                                              onChange={(e) =>
                                                updateOptionText(
                                                  qIndex,
                                                  oIndex,
                                                  e.target.value
                                                )
                                              }
                                              placeholder={`Option ${
                                                oIndex + 1
                                              }`}
                                              className={`flex-1 border border-gray-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-[#1B4D3E] ${
                                                isCorrect
                                                  ? "ring-1 ring-green-500"
                                                  : ""
                                              }`}
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-3 mt-5">
                              <button
                                onClick={() =>
                                  handleSave(blog._id)
                                }
                                disabled={saving}
                                className="flex items-center gap-2 bg-[#1B4D3E] hover:bg-[#16382e] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition"
                              >
                                <Save size={16} />

                                {saving
                                  ? "Saving..."
                                  : "Save Quiz"}
                              </button>

                              <button
                                onClick={() => {
                                  setExpandedBlogId(null);
                                  setQuiz(
                                    buildEmptyQuiz()
                                  );
                                }}
                                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-gray-600 hover:bg-gray-200 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-500"
                >
                  No blogs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Quizzes;
