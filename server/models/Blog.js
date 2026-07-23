import mongoose from "mongoose";

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
    "Travel",
    "Programming",
    "Technology",
    "Music",
    "Sports",
    "Education",
    "Survival",
    "Lifestyle",
    "Business"
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
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
