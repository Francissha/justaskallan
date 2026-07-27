import Blog from "../models/Blog.js";
import imagekit from "../configs/imagekit.js";

// =============================
// Add Blog
// =============================
export const addBlog = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      type,
      youtubeLink,
      isPublished,
    } = req.body;

    if (!title || !subtitle || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    let image = "";

    if (req.file) {
      try {
        console.log("Uploading image to ImageKit...");

        const uploadedImage = await imagekit.upload({
          file: req.file.buffer.toString("base64"),
          fileName: `${Date.now()}-${req.file.originalname}`,
          folder: "/blogs",
        });

        console.log("Image uploaded successfully.");
        image = uploadedImage.url;
      } catch (err) {
        console.error("========== IMAGEKIT ERROR ==========");
        console.error(err);

        return res.status(500).json({
          success: false,
          message: err.message,
          error: err,
        });
      }
    }

    const blog = await Blog.create({
      title,
      subtitle,
      description,
      image,
      category,
      type,
      youtubeLink,
      isPublished:
        isPublished === "true" || isPublished === true,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      blog,
    });
  } catch (error) {
    console.error("ADD BLOG ERROR");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Blogs
// =============================
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Blog
// =============================
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Blog
// =============================
export const updateBlog = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      type,
      youtubeLink,
      isPublished,
    } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    if (req.file) {
      try {
        console.log("Uploading new image to ImageKit...");

        const uploadedImage = await imagekit.upload({
          file: req.file.buffer.toString("base64"),
          fileName: `${Date.now()}-${req.file.originalname}`,
          folder: "/blogs",
        });

        blog.image = uploadedImage.url;
      } catch (err) {
        console.error("========== IMAGEKIT ERROR ==========");
        console.error(err);

        return res.status(500).json({
          success: false,
          message: err.message,
          error: err,
        });
      }
    }

    blog.title = title || blog.title;
    blog.subtitle = subtitle || blog.subtitle;
    blog.description = description || blog.description;
    blog.category = category || blog.category;
    blog.type = type || blog.type;
    blog.youtubeLink = youtubeLink || blog.youtubeLink;

    if (typeof isPublished !== "undefined") {
      blog.isPublished =
        isPublished === "true" || isPublished === true;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      blog,
    });
  } catch (error) {
    console.error("UPDATE BLOG ERROR");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Blog
// =============================
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
