import React from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../data/categories";

const Categories = () => {
  const navigate = useNavigate();

  // Show only the first 3 categories
  const featuredCategories = categories.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Browse Categories
        </h2>

        <button
          onClick={() => navigate("/categories")}
          className="text-[#239962] font-semibold hover:underline"
        >
          View All →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCategories.map((category) => {
          const Icon = category.icon;

          return (
            <div
              key={category.id}
              onClick={() => navigate(category.route)}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer p-8"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${category.color}`}
              >
                <Icon size={32} />
              </div>

              <h3 className="mt-6 text-2xl font-semibold">
                {category.name}
              </h3>

              <p className="mt-2 text-gray-500">
                Explore videos, guides and tutorials about{" "}
                {category.name.toLowerCase()}.
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
