import React, { useState, useEffect } from "react";
import { useCategory } from "../../../Context/CategoryContext";

const Color = () => {
  const { selectedColors, setSelectedColors } = useCategory();
  
  // Initialize with the current selected colors or default to an empty array
  const [colors, setColors] = useState([
    "black", "white", "red", "blue", "brown", "gray", "green", "pink"
  ]);
  const [selected, setSelected] = useState(selectedColors || []);

  useEffect(() => {
    if (selectedColors) {
      setSelected(selectedColors);
    }
  }, [selectedColors]);

  // Handle color selection and apply the filter
  const handleColorChange = (color) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(color)) {
        // If color is already selected, remove it
        return prevSelected.filter((item) => item !== color);
      } else {
        // Add the color to selected list
        return [...prevSelected, color];
      }
    });
  };

  const handleApplyFilter = () => {
    setSelectedColors(selected);
  };

  return (
    <div className="mb-4 bg-white shadow-lg px-2 py-2 rounded-sm">
      <h3 className="font-semibold mb-2">Color</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <div key={color} className="flex items-center">
            <input
              type="checkbox"
              id={color}
              name={color}
              value={color}
              checked={selected.includes(color)}
              onChange={() => handleColorChange(color)}
              className="mr-2"
            />
            <label htmlFor={color} className="text-gray-600 text-sm">
              {color}
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleApplyFilter}
        className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700 text-sm mt-2"
      >
        Apply
      </button>
    </div>
  );
};

export default Color;
