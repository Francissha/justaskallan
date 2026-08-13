import { createContext, useContext, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const api = axios.create({
    baseURL: backendUrl,
  });

  api.interceptors.request.use(
    (config) => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/blog");

      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.log(
        "Fetch blogs error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

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
      console.log(
        "Fetch blog error:",
        error.response?.data || error.message
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (blogId) => {
    try {
      const { data } = await api.get(`/api/comment/${blogId}`);

      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.log(
        "Fetch comments error:",
        error.response?.data || error.message
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  const value = {
    backendUrl,
    axios: api,
    token,
    setToken,
    logout,
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
