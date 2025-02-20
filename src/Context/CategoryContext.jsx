import React, { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState("Show All");
  const [selectedGender, setSelectedGender] = useState("All Gender");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 1000]);
  const [selectedColors, setSelectedColors] = useState([]); // To store selected colors

  return (
    <CategoryContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedGender,
        setSelectedGender,
        selectedPriceRange,
        setSelectedPriceRange,
        selectedColors,
        setSelectedColors, // Providing set function to update colors
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
