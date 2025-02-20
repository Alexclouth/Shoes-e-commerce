// src/Context/CategoryContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context for managing category state
const CategoryContext = createContext();

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("Show All");

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};
