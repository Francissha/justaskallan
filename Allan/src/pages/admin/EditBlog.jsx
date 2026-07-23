
import React, { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, backendUrl, token, fetchAllBlogs } = useAppContext();

  const [thumbnail, setThumbnail] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    category: "",
    type: "Article",
    youtubeLink: "",
    status: "Draft",
    content: "",
  });

  // Load the existing blog
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/blog/${id}`);

        if (data.success) {
          const blog = data.blog;
          setBlogData({
            title: blog.title || "",
            subtitle: blog.subtitle || "",
            category: blog.category || "",
            type: blog.type || "Article",
            youtubeLink: blog.youtubeLink || "",
            status: blog.isPublished ? "Published" : "Draft",
            content: blog.description || "",
          });
          setExistingImage(blog.image || "");
        } else {
          toast.error(data.message || "Blog not found.");
          navigate("/admin/list-blog");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load blog."
        );
        navigate("/admin/list-blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    setBlogData({
      ...blogData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!blogData.category.trim()) {
      toast.error("Please enter a category.");
      return;
    }

    if (blogData.type === "Video" && !blogData.youtubeLink.trim()) {
      toast.error("Please add a YouTube link for video content.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("subtitle", blogData.subtitle);
      formData.append("description", blogData.content);
      formData.append("category", blogData.category.trim());
      formData.append("type", blogData.type);
      formData.append(
        "youtubeLink",
        blogData.type === "Video" ? blogData.youtubeLink : ""
      );
      formData.append("isPublished", blogData.status === "Published");

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const { data } = await axios.put(
        `${backendUrl}/api/blog/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Blog updated successfully!");
        await fetchAllBlogs();
        navigate("/admin/list-blog");
      } else {
        toast.error(data.message || "Failed to update blog.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <h2>Loading blog...</h2>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B4D3E]">Edit Blog</h1>
        <p className="text-gray-500 mt-2">Update this blog's details.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-8 space-y-7"
      >
        {/* Thumbnail */}
        <div>
          <label className="block mb-3 font-semibold">Blog Thumbnail</label>

          <label className="border-2 border-dashed border-gray-300 rounded-xl h-56 flex flex-col justify-center items-center cursor-pointer hover:border-[#1B4D3E] transition">
            {thumbnail ? (
              <img
                src={URL.createObjectURL(thumbnail)}
                alt=""
                className="w-full h-full object-cover rounded-xl"
              />
            ) : existingImage ? (
              <img
                src={existingImage}
                alt=""
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <>
                <ImagePlus size={45} className="text-gray-400" />
                <p className="mt-3 text-gray-500">
                  Click to upload thumbnail
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImage}
            />
          </label>
          <p className="text-xs text-gray-400 mt-2">
            Leave unchanged to keep the current thumbnail.
          </p>
        </div>

        {/* Title */}
        <div>
          <label className="block mb-2 font-semibold">Blog Title</label>
          <input
            type="text"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            placeholder="Enter blog title"
            className="w-full border rounded-lg p-3 outline-none focus:border-[#1B4D3E]"
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block mb-2 font-semibold">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={blogData.subtitle}
            onChange={handleChange}
            placeholder="Short subtitle"
            className="w-full border rounded-lg p-3 outline-none focus:border-[#1B4D3E]"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-semibold">Category</label>
          <input
            type="text"
            name="category"
            list="category-options"
            value={blogData.category}
            onChange={handleChange}
            placeholder="e.g. Chess, Survival, Travelling..."
            className="w-full border rounded-lg p-3 outline-none focus:border-[#1B4D3E]"
            required
          />
          <datalist id="category-options">
            <option value="Chess" />
            <option value="Survival" />
            <option value="Travelling" />
            <option value="Technology" />
            <option value="Cooking" />
            <option value="Fitness" />
            <option value="Business" />
            <option value="Education" />
            <option value="Lifestyle" />
            <option value="Finance" />
          </datalist>
        </div>

        {/* Content Type */}
        <div>
          <label className="block mb-2 font-semibold">Content Type</label>
          <select
            name="type"
            value={blogData.type}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none"
          >
            <option>Article</option>
            <option>Video</option>
            <option>Guide</option>
          </select>
        </div>

        {/* YouTube Link - only shown when type is Video */}
        {blogData.type === "Video" && (
          <div>
            <label className="block mb-2 font-semibold">
              YouTube Link
            </label>
            <input
              type="url"
              name="youtubeLink"
              value={blogData.youtubeLink}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full border rounded-lg p-3 outline-none focus:border-[#1B4D3E]"
              required
            />
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block mb-2 font-semibold">Status</label>
          <select
            name="status"
            value={blogData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 outline-none"
          >
            <option>Draft</option>
            <option>Published</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block mb-2 font-semibold">Blog Content</label>
          <textarea
            rows="12"
            name="content"
            value={blogData.content}
            onChange={handleChange}
            placeholder="Write your blog..."
            className="w-full border rounded-lg p-4 outline-none resize-none focus:border-[#1B4D3E]"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#1B4D3E] text-white px-8 py-3 rounded-lg hover:bg-[#16382e] disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/list-blog")}
            className="border border-[#1B4D3E] text-[#1B4D3E] px-8 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;