import React, { useState } from "react";

const recommendations = [
  {
    id: 1,
    brand: "Nike",
    image: "src/assets/recommended/download.png",
  },
  {
    id: 2,
    brand: "Adidas",
    image: "src/assets/recommended/download.jpg",
  },
  {
    id: 3,
    brand: "Puma",
    image: "src/assets/recommended/download (1).png",
  },
  {
    id: 4,
    brand: "Jordan",
    image: "src/assets/recommended/download (1).jpg",
  },
  {
    id: 5,
    brand: "Converse",
    image: "src/assets/recommended/download (2).png",
  },
  {
    id: 6,
    brand: "Under Armour",
    image: "src/assets/recommended/download (4).png",
  },
  {
    id: 7,
    brand: "New Balance",
    image: "src/assets/recommended/download (6).png",
  },
  {
    id: 8,
    brand: "Vans",
    image: "src/assets/recommended/download (3).png",
  },
  {
    id: 9,
    brand: "Skechers",
    image: "src/assets/recommended/download (5).png",
  },
  {
    id: 10,
    brand: "Reebok",
    image: "src/assets/recommended/download (7).png",
  },
];

const Recommended = ({ setSelectedBrand }) => {
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  return (
    <section className="bg-gray-100 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended for You</h2>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6">
            {recommendations.map((item) => (
              <div
                key={item.id}
                onClick={() => handleBrandClick(item.brand)} // Pass selected brand to parent
                className="min-w-[90px] hover:bg-yellow-50 p-2 m-2 bg-white rounded-lg hover:shadow-lg shadow-md transition h-25 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={`${item.brand} Shoe`}
                  className="w-full h-full object-fill rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recommended;
