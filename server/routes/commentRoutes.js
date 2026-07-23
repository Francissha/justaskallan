import express from "express";
import auth from "../middlleware/auth.js";

import {
  addComment,
  getComments,
  getAllComments,
  approveComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";

const commentRouter = express.Router();

/* ---------- Public Routes ---------- */

// Add a comment
// POST /api/comment/add
commentRouter.post("/add", addComment);

// Get approved comments for a blog
// GET /api/comment/:blogId
commentRouter.get("/:blogId", getComments);

/* ---------- Admin Routes ---------- */

// Get all comments
// GET /api/comment/admin/all
commentRouter.get("/admin/all", auth, getAllComments);

// Approve a comment
// PUT /api/comment/approve/:id
commentRouter.put("/approve/:id", auth, approveComment);

// Edit a comment
// PUT /api/comment/edit/:id
commentRouter.put("/edit/:id", auth, updateComment);

// Delete a comment
// DELETE /api/comment/:id
commentRouter.delete("/:id", auth, deleteComment);

export default commentRouter;