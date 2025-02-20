// src/Sidebar/Category/Category.js
import React from "react";

const Category = ({ setSelectedCategory, selectedCategory }) => {
  const categories = ["Show All", "Sneakers", "Boots", "Sandals", "Flat Shoes", "Football Boots", "Chunky Shoes", "Heel"];

  const handleRadioChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="mb-4 bg-white shadow-lg px-2 py-2 rounded-sm">
      <h3 className="font-semibold mb-2">Category</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                name="category"
                value={category}
                className="mr-2"
                checked={selectedCategory === category}
                onChange={() => handleRadioChange(category)}
              />
              {category}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
