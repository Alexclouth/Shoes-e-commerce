import React from "react";
import Product from "./Product/Product";

const Home = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/dewutmxvk/video/upload/v1740046148/Shoes_com_-_Made_with_Clipchamp_1734806038207_hsnzie.mp4"
        autoPlay
        loop
        muted
      ></video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-1/6 bg-gradient-to-b from-gray-900 to-transparent"
          style={{ zIndex: 1 }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-full h-1/6 bg-gradient-to-t from-gray-700 to-transparent"
          style={{ zIndex: 1 }}
        ></div>
      </div>

      {/* Overlay and Text Content */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-amber-500 text-8xl md:text-6xl font-bold mb-4">
            Welcome to Golden Stride
          </h1>
          <p className="text-white text-lg md:text-2xl mb-6">
            Step into style, comfort, and excellence.
          </p>
          <button className="px-6 py-3 bg-amber-500 text-black text-lg font-bold rounded-lg hover:bg-opacity-10 hover:text-white">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
