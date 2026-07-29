import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";

const CategoriesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-[#1B4D3E] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white">
            Explore Categories
          </h1>

          <p className="text-green-100 mt-4 max-w-3xl mx-auto">
            Choose any category below and start learning with
            articles, videos and step-by-step guides.
          </p>
        </div>
      </div>

      {/* Categories Buttons */}
      <div className="max-w-7xl mx-auto px-6 py-14">

        <h2 className="text-3xl font-bold text-center mb-10">
          Choose a Category
        </h2>

        <div className="flex flex-wrap justify-center gap-5">

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                onClick={() => navigate(category.route)}
                className="group flex items-center gap-4 px-7 py-4 bg-white rounded-full border border-gray-200 shadow-md hover:bg-[#239962] hover:text-white hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color} group-hover:bg-white`}
                >
                  <Icon
                    size={24}
                    className="group-hover:text-[#239962]"
                  />
                </div>

                <span className="font-semibold text-lg">
                  {category.name}
                </span>
              </button>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default CategoriesPage;
