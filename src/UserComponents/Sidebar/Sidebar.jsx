// src/Sidebar/Sidebar.js
import React from "react";
import Category from "./Category/Category";
import Price from "./Price/Price";
import Color from "./Color/Color";
import Gender from "./Gender/Gender";
import Condition from "./Condition/Condition";
import { useCategory } from "../../Context/CategoryContext";  // Import the useCategory hook

const Sidebar = () => {
  const { selectedCategory, setSelectedCategory } = useCategory(); // Get selectedCategory and setSelectedCategory

  return (
    <aside className="w-64 bg-gray-50 rounded-md text-black p-4 h-auto overflow-y-scroll shadow-lg scrollbar-hide">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <Category setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} /> {/* Pass context values as props */}
      <Gender />
      <Price />
    </aside>
  );
};

export default Sidebar;
