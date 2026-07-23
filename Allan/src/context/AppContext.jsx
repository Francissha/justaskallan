import { createContext, useContext, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Axios instance
  const api = axios.create({
    baseURL: backendUrl,
  });

  // Admin Token
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  // Blogs
  const [blogs, setBlogs] = useState([]);

  // Current Blog
  const [blog, setBlog] = useState(null);

  // Comments
  const [comments, setComments] = useState([]);

  // Loading
  const [loading, setLoading] = useState(false);

  // ==============================
  // Fetch All Blogs
  // ==============================
  const fetchAllBlogs = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/blog");

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Fetch Single Blog
  // ==============================
  const fetchBlog = async (id) => {
    try {
      setLoading(true);

      const { data } = await api.get(`/api/blog/${id}`);

      if (data.success) {
        setBlog(data.blog);
        return data.blog;
      }

      return null;
    } catch (error) {
      console.log(error.response?.data || error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Fetch Blog Comments
  // ==============================
  const fetchComments = async (blogId) => {
    try {
      const { data } = await api.get(`/api/comment/${blogId}`);

      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const value = {
    backendUrl,
    axios: api,

    token,
    setToken,

    blogs,
    setBlogs,

    blog,
    setBlog,

    comments,
    setComments,

    loading,
    setLoading,

    fetchAllBlogs,
    fetchBlog,
    fetchComments,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;