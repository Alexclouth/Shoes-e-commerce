import React, { useState } from "react";
import Category from "./Category/Category";
import Price from "./Price/Price";
import Gender from "./Gender/Gender";
import { useCategory } from "../../Context/CategoryContext"; 

const Sidebar = () => {
  const { selectedCategory, setSelectedCategory } = useCategory();
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state

  return (
    <>
      {/* Toggle Button for Small Screens */}
      <button
        className="md:hidden mx-4 my-20 top-20 left-4  bg-amber-500 text-black font-extrabold p-2 py-10 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✖ Close" : "☰ Filters"}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 text-black w-64 h-full md:h-auto bg-gray-50 p-4 shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block overflow-y-auto z-40`}
      >
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <Category
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        <Gender />
        <Price />
      </aside>

      {/* Overlay for Mobile (closes sidebar when clicked) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
