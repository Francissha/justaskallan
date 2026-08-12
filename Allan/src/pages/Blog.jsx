import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  MessageCircle,
  PlayCircle,
  HelpCircle,
  Calendar,
  User,
} from "lucide-react";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch blog");
        }

        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blog?.title,
          text: blog?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary font-semibold">
          Loading...
        </p>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-bold text-accent">
          Blog Not Found
        </h1>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-background transition hover:opacity-90"
        >
          <ArrowLeft size={18} />
          Back Home
        </button>
      </main>
    );
  }

  const hasQuiz =
    Array.isArray(blog.quiz) && blog.quiz.length > 0;

  const embedUrl = blog.youtubeId
    ? `https://www.youtube.com/embed/${blog.youtubeId}`
    : blog.videoUrl || null;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">

        {/* Navigation */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-accent transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("comments")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-accent transition hover:border-primary hover:text-primary"
          >
            <MessageCircle size={17} />
            Comments
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-accent transition hover:border-primary hover:text-primary"
          >
            <Share2 size={17} />
            Share
          </button>
        </div>

        {/* Video / Image */}
        <div className="overflow-hidden rounded-2xl bg-surface shadow-lg">
          {embedUrl ? (
            <div className="relative aspect-video w-full">
              <iframe
                src={embedUrl}
                title={blog.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : blog.image ? (
            <img
              src={blog.image}
              alt={blog.title}
              className="h-auto max-h-[650px] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-video items-center justify-center bg-surface text-text-muted">
              No media available
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="mt-7 flex flex-wrap items-center gap-5">
          {blog.category && (
            <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
              {blog.category}
            </span>
          )}

          {blog.createdAt && (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Calendar size={16} />
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>
          )}

          {blog.author && (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <User size={16} />
              {blog.author}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mt-6 max-w-4xl">
          <h1 className="text-3xl font-bold leading-tight text-accent md:text-5xl">
            {blog.title}
          </h1>

          {blog.description && (
            <p className="mt-5 text-base leading-7 text-text-muted md:text-lg">
              {blog.description}
            </p>
          )}
        </div>

        {/* Article Content */}
        {blog.content && (
          <article className="prose prose-lg mt-10 max-w-none text-text-muted">
            {typeof blog.content === "string"
              ? blog.content.split("\n").map((paragraph, index) =>
                  paragraph.trim() ? (
                    <p key={index}>{paragraph}</p>
                  ) : null
                )
              : blog.content}
          </article>
        )}

        {/* Take Quiz */}
        {hasQuiz && (
          <section className="mt-14">
            <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-[#10251C] p-6 shadow-lg md:p-8">

              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">

                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary">
                    <HelpCircle
                      size={26}
                      className="text-background"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Quick Quiz
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white md:text-2xl">
                      Test Your Knowledge
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      {blog.quiz.length}{" "}
                      {blog.quiz.length === 1
                        ? "question"
                        : "questions"}{" "}
                      based on this topic.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/quiz/${blog._id || blog.id}`)
                  }
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-bold text-background transition-all duration-300 hover:-translate-y-1 hover:opacity-90 hover:shadow-lg"
                >
                  <PlayCircle
                    size={20}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />

                  Take Quiz
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Comments */}
        <section
          id="comments"
          className="mt-14 border-t border-border pt-10"
        >
          <div className="flex items-center gap-3">
            <MessageCircle
              size={22}
              className="text-primary"
            />

            <h2 className="text-2xl font-bold text-accent">
              Comments
            </h2>
          </div>

          <p className="mt-3 text-sm text-text-muted">
            Share your thoughts about this topic.
          </p>
        </section>

      </div>
    </main>
  );
};

export default BlogDetails;
