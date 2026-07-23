import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import Categories from "../components/Categories";
import Blogs from "../components/Blogs";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";

const Home = () => {
  const { fetchAllBlogs } = useAppContext();

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <>
      <Navbar />
      <Header />
      <Categories />
      <Blogs />
      <Footer />
    </>
  );
};

export default Home;