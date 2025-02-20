import React, { useState } from "react";

const recommendations = [
  {
    id: 1,
    brand: "Nike",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079151/download_uhriuc.png",
  },
  {
    id: 2,
    brand: "Adidas",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079151/download_bxwcvw.jpg",
  },
  {
    id: 3,
    brand: "Puma",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079146/download_1_xelihb.png",
  },
  {
    id: 4,
    brand: "Jordan",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079146/download_1_jyjqno.jpg",
  },
  {
    id: 5,
    brand: "Converse",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079146/download_2_d0l4xp.png",
  },
  {
    id: 6,
    brand: "Under Armour",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079147/download_4_bxaewm.png",
  },
  {
    id: 7,
    brand: "New Balance",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079150/download_6_nf4guv.png",
  },
  {
    id: 8,
    brand: "Vans",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079147/download_3_frecxp.png",
  },
  {
    id: 9,
    brand: "Skechers",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079150/download_5_v8jnbf.png",
  },
  {
    id: 10,
    brand: "Reebok",
    image: "https://res.cloudinary.com/dewutmxvk/image/upload/v1740079150/download_7_gz54ad.png",
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
