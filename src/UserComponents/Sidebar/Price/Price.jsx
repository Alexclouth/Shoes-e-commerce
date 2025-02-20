import React, { useState, useEffect } from "react";
import { useCategory } from "../../../Context/CategoryContext";

const Price = () => {
  const { selectedPriceRange, setSelectedPriceRange } = useCategory();
  
  // Initialize with the current selected price range or default to [0, 1000]
  const [minPrice, setMinPrice] = useState(selectedPriceRange ? selectedPriceRange[0] : 0);
  const [maxPrice, setMaxPrice] = useState(selectedPriceRange ? selectedPriceRange[1] : 1000);

  useEffect(() => {
    if (selectedPriceRange && selectedPriceRange.length === 2) {
      setMinPrice(selectedPriceRange[0]);
      setMaxPrice(selectedPriceRange[1]);
    }
  }, [selectedPriceRange]);

  // Apply filter with validation for max and min price limits
  const handleApplyFilter = () => {
    // Ensure minPrice is not below 0 and maxPrice is not above 1000
    const validMinPrice = Math.max(minPrice, 0);
    const validMaxPrice = Math.min(maxPrice, 1000);

    // Apply the filter with the corrected values
    setSelectedPriceRange([validMinPrice, validMaxPrice]);
  };

  return (
    <div className="mb-4 bg-white shadow-lg px-2 py-2 rounded-sm">
      <h3 className="font-semibold mb-2">Price Range</h3>
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="block text-gray-600 text-sm">Min</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
            className="w-20 border border-gray-300 rounded-sm p-1"
          />
        </div>
        <div>
          <label className="block text-gray-600 text-sm">Max</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.min(1000, Number(e.target.value)))}
            className="w-20 border border-gray-300 rounded-sm p-1"
          />
        </div>
      </div>
      <button
        onClick={handleApplyFilter}
        className="bg-yellow-600 text-white px-4 py-1 rounded hover:bg-yellow-700 text-sm"
      >
        Apply
      </button>
    </div>
  );
};

export default Price;
