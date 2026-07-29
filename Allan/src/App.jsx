import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAppContext } from "./context/AppContext";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contribute from "./pages/Contribute";
import CategoriesPage from "./pages/CategoriesPage";

import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import EditBlog from "./pages/admin/EditBlog";
import ListBlog from "./pages/admin/ListBlog";
import Comments from "./pages/admin/Comments";

import Login from "./components/admin/Login";

const App = () => {
  const { token } = useAppContext();

  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contribute" element={<Contribute />} />

        <Route path="/categories" element={<CategoriesPage />} />

        <Route
          path="/admin"
          element={token ? <Layout /> : <Login />}
        >
          <Route index element={<Dashboard />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="edit-blog/:id" element={<EditBlog />} />
          <Route path="list-blog" element={<ListBlog />} />
          <Route path="comments" element={<Comments />} />
        </Route>

        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
              <h1 className="text-7xl font-bold text-[#1B4D3E]">
                404
              </h1>

              <p className="mt-4 text-xl text-gray-600">
                Page Not Found
              </p>
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
