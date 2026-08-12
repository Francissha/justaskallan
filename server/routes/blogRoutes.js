import express from "express";
import auth from "../middlleware/auth.js";
import upload from "../middlleware/multer.js";
import {
  addBlog,
  getBlogs,
  getBlog,
  updateBlog,
  updateBlogQuiz,
  deleteBlog,
} from "../controllers/blogController.js";

const blogRouter = express.Router();

// Public Routes
blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getBlog);

// Protected Routes
blogRouter.post(
  "/add",
  auth,
  upload.single("thumbnail"),
  addBlog
);

blogRouter.put(
  "/:id",
  auth,
  upload.single("thumbnail"),
  updateBlog
);

blogRouter.put(
  "/:id/quiz",
  auth,
  updateBlogQuiz
);

blogRouter.delete(
  "/:id",
  auth,
  deleteBlog
);

export default blogRouter;
