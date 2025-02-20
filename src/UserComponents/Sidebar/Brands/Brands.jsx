import React, { useState } from "react";

const Brands = () => {
  const brands = ["All Brands" ,"Adidas", "Air Jordan", "Converse", "Vans", "Reebok", "Nike", "Skechers"]; // Define categories as an array

  const [selectedBrand, setSelectedBrand] = useState(brands[0]);

  const handleRadioChange = (brand) => {
    setSelectedBrand(brand); // Set the selected brand, replacing the previous selection
  };

  return (
    <div className="mb-4 bg-white px-2 py-2 rounded-sm">
      <h3 className="font-semibold mb-2">Brands</h3>
      <ul>
        {brands.map((brand, index) => (
          <li key={index}> {/* Use key to ensure each list item is uniquely identified */}
            <label>
              <input
                type="radio" // Use radio buttons for single selection
                value={brand}
                className="mr-2"
                checked={selectedBrand === brand} // Check if brand is selected
                onChange={() => handleRadioChange(brand)} // Handle radio button change
              />
              {brand}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Brands;
