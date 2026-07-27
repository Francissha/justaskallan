import React, { useState } from "react";
import { ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const AddBlog = () => {
  const navigate = useNavigate();

  const { axios, backendUrl, token, fetchAllBlogs } = useAppContext();

  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    category: "",
    type: "Article",
    youtubeLink: "",
    status: "Draft",
    content: "",
  });

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

    if (!thumbnail) {
      toast.error("Please upload a thumbnail");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", blogData.title);
      formData.append("subtitle", blogData.subtitle);
      formData.append("description", blogData.content);
      formData.append("category", blogData.category);
      formData.append("type", blogData.type);
      formData.append("youtubeLink", blogData.youtubeLink);
      formData.append(
        "isPublished",
        blogData.status === "Published"
      );
      formData.append("thumbnail", thumbnail);

      const { data } = await axios.post(
        `${backendUrl}/api/blog`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Blog added successfully");

        fetchAllBlogs();

        navigate("/admin/list-blog");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B4D3E]">
          Add Blog
        </h1>

        <p className="text-gray-500">
          Publish a new article, guide or video.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-8 space-y-6"
      >
        <div>
          <label className="block mb-3 font-semibold">
            Thumbnail
          </label>

          <label className="border-2 border-dashed rounded-xl h-56 flex flex-col items-center justify-center cursor-pointer">
            {thumbnail ? (
              <img
                src={URL.createObjectURL(thumbnail)}
                className="w-full h-full object-cover rounded-xl"
                alt=""
              />
            ) : (
              <>
                <ImagePlus
                  size={45}
                  className="text-gray-400"
                />
                <p className="mt-3 text-gray-500">
                  Upload Thumbnail
                </p>
              </>
            )}

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
            />
          </label>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={blogData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Subtitle
          </label>

          <input
            type="text"
            name="subtitle"
            value={blogData.subtitle}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={blogData.category}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Type
          </label>

          <select
            name="type"
            value={blogData.type}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option>Article</option>
            <option>Guide</option>
            <option>Video</option>
          </select>
        </div>

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
              className="w-full border rounded-lg p-3"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 font-semibold">
            Status
          </label>

          <select
            name="status"
            value={blogData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option>Draft</option>
            <option>Published</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Content
          </label>

          <textarea
            rows="10"
            name="content"
            value={blogData.content}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#1B4D3E] text-white px-8 py-3 rounded-lg"
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
