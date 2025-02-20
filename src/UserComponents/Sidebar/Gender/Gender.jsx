import React from "react";
import { useCategory } from "../../../Context/CategoryContext";

const Gender = () => {
  const categories = ["All Gender", "men", "women", "unisex"];
  const { selectedGender, setSelectedGender } = useCategory();

  const handleRadioChange = (category) => {
    setSelectedGender(category);
  };

  return (
    <div className="mb-4 bg-white shadow-lg px-2 py-2 rounded-sm">
      <h3 className="font-semibold mb-2">Gender</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                value={category}
                className="mr-2"
                checked={selectedGender === category}
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

export default Gender;
