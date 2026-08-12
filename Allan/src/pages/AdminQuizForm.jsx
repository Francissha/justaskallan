import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const emptyQuestion = () => ({
  question: "",
  options: ["", ""],
  correctAnswer: 0,
});

const AdminQuizForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, backendUrl } = useAppContext();

  const [blogTitle, setBlogTitle] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing blog + quiz
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/blog/${id}`);

        if (data.success) {
          setBlogTitle(data.blog.title);
          setQuestions(data.blog.quiz?.length ? data.blog.quiz : [emptyQuestion()]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const updateQuestion = (qIndex, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qIndex, oIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = [...q.options];
        options[oIndex] = value;
        return { ...q, options };
      })
    );
  };

  const addOption = (qIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  const removeOption = (qIndex, oIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = q.options.filter((_, idx) => idx !== oIndex);
        const correctAnswer = q.correctAnswer >= options.length ? 0 : q.correctAnswer;
        return { ...q, options, correctAnswer };
      })
    );
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const removeQuestion = (qIndex) => {
    setQuestions((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== qIndex) : prev));
  };

  // Basic client-side check before hitting the API
  const validateQuestions = () => {
    for (const q of questions) {
      if (!q.question.trim()) return "Every question needs text.";
      if (q.options.some((opt) => !opt.trim())) return "Every option needs text.";
      if (q.options.length < 2) return "Each question needs at least 2 options.";
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateQuestions();
    if (validationError) {
      alert(validationError);
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/blog/${id}/quiz`, {
        quiz: questions,
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
          onClick={() => navigate(`/blog/${id}`)}
          className="flex items-center gap-1.5 sm:gap-2 bg-[#181818] hover:bg-[#239962] px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base mb-4 sm:mb-6 transition"
        >
          <ArrowLeft size={15} className="sm:hidden" />
          <ArrowLeft size={18} className="hidden sm:block" />
          Back to Article
        </button>

        <h1 className="text-lg sm:text-2xl font-bold mb-1">Edit Quiz Questions</h1>
        {blogTitle && (
          <p className="text-text-muted text-xs sm:text-sm mb-6">{blogTitle}</p>
        )}

        <div className="space-y-4 sm:space-y-6">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="bg-[#111111] border border-gray-800 rounded-xl p-4 sm:p-6"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <input
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                  placeholder={`Question ${qIndex + 1}`}
                  className="flex-1 bg-[#1B1B1B] rounded-lg p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#239962]"
                />

                {questions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-400 hover:text-red-300 shrink-0 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === oIndex}
                      onChange={() => updateQuestion(qIndex, "correctAnswer", oIndex)}
                      className="accent-[#239962] shrink-0"
                    />

                    <input
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-1 bg-[#1B1B1B] rounded-lg p-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#239962]"
                    />

                    {q.options.length > 2 && (
                      <button
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-gray-500 hover:text-red-400 shrink-0 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => addOption(qIndex)}
                className="mt-3 flex items-center gap-1.5 text-[#239962] text-xs sm:text-sm font-semibold"
              >
                <Plus size={14} />
                Add Option
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addQuestion}
          className="mt-4 sm:mt-6 flex items-center gap-2 bg-[#181818] hover:bg-[#239962] px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-base transition"
        >
          <Plus size={16} />
          Add Question
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 sm:mt-6 w-full flex items-center justify-center gap-2 bg-[#239962] hover:bg-[#1d7c4d] disabled:opacity-50 px-6 py-3 sm:py-4 rounded-full text-sm sm:text-base font-semibold transition"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Quiz"}
        </button>
      </div>
    </div>
  );
};

export default AdminQuizForm;
