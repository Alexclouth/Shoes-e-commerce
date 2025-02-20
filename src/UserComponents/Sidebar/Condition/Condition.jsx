import React, { useState } from "react";

const Condition = () => {
  const categories = ["Brand New", "Used"]; // Define categories as an array

  // Initialize the state to include the first category as selected by default
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const handleCheckboxChange = (category) => {
    setSelectedCategory(category); // Set the selected category, replacing the previous selection
  };

  return (
    <div className="mb-4 bg-white shadow-lg px-2 py-2 rounded-sm">
      <h3 className="font-semibold mb-2">Condition</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index}> {/* Use key to ensure each list item is uniquely identified */}
            <label>
              <input
                type="checkbox"
                value={category}
                className="mr-2"
                checked={selectedCategory === category} // Check if category is selected
                onChange={() => handleCheckboxChange(category)} // Handle checkbox change
              />
              {category}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Condition;
