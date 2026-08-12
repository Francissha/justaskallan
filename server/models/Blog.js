import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 2,
        message: "Each question needs at least 2 options",
      },
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Chess",
        "Survival",
        "Travel",
        "Mathematics",
        "Chemistry",
        "Physics",
        "Biology",
        "Programming",
        "Artificial Intelligence",
        "Web Development",
        "Education",
        "Music",
        "Photography",
        "Cooking",
        "Sports",
        "Languages",
        "Geography",
        "Business",
        "Graphic Design",
        "Pet Care",
      ],
    },
    type: {
      type: String,
      enum: ["Article", "Video", "Guide"],
      default: "Article",
    },
    youtubeLink: {
      type: String,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    quiz: {
      type: [quizQuestionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
