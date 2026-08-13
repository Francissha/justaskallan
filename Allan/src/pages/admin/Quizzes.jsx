import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ListChecks,
  HelpCircle,
  CheckCircle2,
  Save,
  X,
  Circle,
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
  Array.from({ length: TOTAL_QUESTIONS }, createEmptyQuestion);

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

  // -----------------------------------------
  // OPEN / CLOSE QUIZ EDITOR
  // -----------------------------------------
  const toggleExpand = (blog) => {
    if (expandedBlogId === blog._id) {
      setExpandedBlogId(null);
      setQuiz(buildEmptyQuiz());
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

  // -----------------------------------------
  // UPDATE QUESTION
  // -----------------------------------------
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

  // -----------------------------------------
  // UPDATE OPTION
  // -----------------------------------------
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

  // -----------------------------------------
  // SELECT CORRECT ANSWER
  // -----------------------------------------
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

  // -----------------------------------------
  // VALIDATE QUIZ
  // -----------------------------------------
  const validateQuiz = () => {
    if (!token) {
      return "You are not logged in. Please login again.";
    }

    if (quiz.length !== TOTAL_QUESTIONS) {
      return `Quiz must contain exactly ${TOTAL_QUESTIONS} questions.`;
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
        typeof q.correctAnswer !== "number" ||
        q.correctAnswer < 0 ||
        q.correctAnswer >= OPTIONS_PER_QUESTION
      ) {
        return `Question ${i + 1} needs a correct answer.`;
      }
    }

    return null;
  };

  // -----------------------------------------
  // SAVE QUIZ
  // -----------------------------------------
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

        options: q.options.map((option) =>
          option.trim()
        ),

        correctAnswer: Number(q.correctAnswer),
      }));

      console.log("Saving quiz...");
      console.log("Blog ID:", blogId);
      console.log("Quiz:", cleanQuiz);
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

  // -----------------------------------------
  // LOADING
  // -----------------------------------------
  if (loading) {
    return (
      <div className="flex-1 p-8">
        <h2>Loading blogs...</h2>
      </div>
    );
  }

  // -----------------------------------------
  // UI
  // -----------------------------------------
  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B4D3E]">
          Quizzes
        </h1>

        <p className="text-gray-500 mt-1">
          Manage quiz questions and correct answers
          for each blog.
        </p>
      </div>

      {/* BLOG TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
                #
              </th>

              <th className="px-6 py-4 text-left">
                Image
              </th>

              <th className="px-6 py-4 text-left">
                Title
              </th>

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

                const hasQuiz =
                  questionCount > 0;

                const isExpanded =
                  expandedBlogId === blog._id;

                return (
                  <React.Fragment key={blog._id}>

                    {/* BLOG ROW */}
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
                            {questionCount > 1
                              ? "s"
                              : ""}

                          </span>

                        ) : (

                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500">

                            No Quiz

                          </span>

                        )}

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-center gap-3">

                          {/* ADD / EDIT QUESTIONS */}
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
                                : "Add / Edit Questions"
                            }
                          >

                            {isExpanded ? (
                              <X size={18} />
                            ) : (
                              <ListChecks size={18} />
                            )}

                          </button>

                          {/* FULL QUIZ PAGE */}
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

                    {/* QUIZ EDITOR */}
                    {isExpanded && (

                      <tr>

                        <td
                          colSpan="5"
                          className="bg-gray-50 px-6 py-6"
                        >

                          <div className="max-w-4xl">

                            {/* EDITOR HEADER */}
                            <div className="mb-5">

                              <p className="text-lg font-bold text-[#1B4D3E]">
                                {blog.title}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                Add 5 questions, 4 options
                                for each question, then
                                select the correct answer.
                              </p>

                            </div>

                            {/* QUESTIONS */}
                            <div className="space-y-5">

                              {quiz.map(
                                (q, qIndex) => (

                                  <div
                                    key={qIndex}
                                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
                                  >

                                    {/* QUESTION HEADER */}
                                    <div className="flex items-center gap-3 mb-4">

                                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B4D3E] text-white text-sm font-bold shrink-0">

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
                                        placeholder={`Enter Question ${
                                          qIndex + 1
                                        }`}
                                        className="flex-1 border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-[#1B4D3E]"
                                      />

                                    </div>

                                    {/* CORRECT ANSWER INSTRUCTION */}
                                    <div className="ml-11 mb-3">

                                      <p className="text-sm font-semibold text-gray-700">
                                        Select the correct answer:
                                      </p>

                                      <p className="text-xs text-gray-400 mt-1">
                                        Click the circle beside
                                        the correct option.
                                      </p>

                                    </div>

                                    {/* OPTIONS */}
                                    <div className="space-y-3 ml-11">

                                      {q.options.map(
                                        (
                                          option,
                                          oIndex
                                        ) => {

                                          const isCorrect =
                                            q.correctAnswer ===
                                            oIndex;

                                          return (

                                            <div
                                              key={oIndex}
                                              className={`flex items-center gap-3 p-2 rounded-lg border transition ${
                                                isCorrect
                                                  ? "border-green-500 bg-green-50"
                                                  : "border-transparent hover:border-gray-200"
                                              }`}
                                            >

                                              {/* CORRECT ANSWER BUTTON */}
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setCorrectAnswer(
                                                    qIndex,
                                                    oIndex
                                                  )
                                                }
                                                className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 transition ${
                                                  isCorrect
                                                    ? "bg-green-600 border-green-600"
                                                    : "border-gray-300 bg-white hover:border-green-500"
                                                }`}
                                                title={
                                                  isCorrect
                                                    ? "Correct answer selected"
                                                    : "Select as correct answer"
                                                }
                                              >

                                                {isCorrect ? (

                                                  <CheckCircle2
                                                    size={16}
                                                    className="text-white"
                                                  />

                                                ) : (

                                                  <Circle
                                                    size={16}
                                                    className="text-gray-400"
                                                  />

                                                )}

                                              </button>

                                              {/* OPTION INPUT */}
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
                                                className={`flex-1 border rounded-lg p-3 text-sm outline-none transition ${
                                                  isCorrect
                                                    ? "border-green-400 focus:ring-2 focus:ring-green-400"
                                                    : "border-gray-300 focus:ring-2 focus:ring-[#1B4D3E]"
                                                }`}
                                              />

                                              {/* CORRECT LABEL */}
                                              {isCorrect && (

                                                <span className="text-xs font-bold text-green-600 whitespace-nowrap">
                                                  ✓ Correct
                                                </span>

                                              )}

                                            </div>

                                          );
                                        }
                                      )}

                                    </div>

                                  </div>

                                )
                              )}

                            </div>

                            {/* BUTTONS */}
                            <div className="flex gap-3 mt-6">

                              <button
                                onClick={() =>
                                  handleSave(blog._id)
                                }
                                disabled={saving}
                                className="flex items-center gap-2 bg-[#1B4D3E] hover:bg-[#16382e] disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold text-sm transition"
                              >

                                <Save size={17} />

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
                                disabled={saving}
                                className="px-6 py-3 rounded-lg font-semibold text-sm text-gray-600 hover:bg-gray-200 transition"
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
