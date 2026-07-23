import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

// =========================
// Add Comment
// =========================
export const addComment = async (req, res) => {
  try {
    const { blog, name, email, comment } = req.body;

    if (!blog || !name || !email || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const blogExists = await Blog.findById(blog);

    if (!blogExists) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    const newComment = await Comment.create({
      blog,
      name,
      email,
      comment,
      isApproved: true, // Change to false if you want moderation
    });

    res.status(201).json({
      success: true,
      message: "Comment submitted successfully.",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Approved Comments
// =========================
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      blog: req.params.blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Comments (Admin)
// =========================
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Approve Comment
// =========================
export const approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    comment.isApproved = true;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment approved successfully.",
      comment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Comment (Admin)
// =========================
export const updateComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        success: false,
        message: "Comment is required.",
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { comment },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment updated successfully.",
      comment: updatedComment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Comment
// =========================
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};