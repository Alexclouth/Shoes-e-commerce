import React, { useState } from "react";
import axios from "axios";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../Firebase/firebase";
import { useNavigate } from "react-router-dom";

const ProductUploadForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageFile: null,
    sizes: [],
    colors: [],
    brand: "Nike",
    category: "Sneakers",
    gender: "men",
    stock: "",
    userId: auth?.currentUser?.uid,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState({
    sizes: false,
    colors: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Separate loading state for the upload button

  const sizeOptions = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "others"];
  const colorOptions = ["red", "white", "black", "gray", "yellow", "brown", "green", "blue", "others"];
  const brandOptions = ["Nike", "Adidas", "Puma", "Jordan", "Converse", "Under Armour", "New Balance", "Vans", "Skechers", "Reebok", "others"];
  const categories = ["Sneakers", "Boots", "Sandals", "Flat Shoes", "Football Boots", "Chunky Shoes", "Heel", "Others"];
  const toggleDropdown = (field) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const validateForm = () => {
    if (!formData.name || !formData.description || !formData.price || !formData.stock || !formData.imageFile) {
      alert("Please fill out all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, imageFile, sizes, colors, brand, category, gender, stock } = formData;

    if (!validateForm()) return;

    setIsLoading(true); // Set loading to true when starting the upload process

    try {
      // Upload image to Cloudinary
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);
      uploadFormData.append("upload_preset", "image-upload"); // Replace with your Cloudinary preset

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dewutmxvk/upload`, // Replace with your Cloudinary URL
        uploadFormData
      );

      const imageUrl = cloudinaryResponse.data.secure_url;

      // Save product data to Firebase
      await addDoc(collection(db, "products"), {
        name,
        description,
        price: parseFloat(price),
        sizes,
        colors,
        brand,
        category,
        gender,
        stock: parseInt(stock, 10),
        imageUrl,
        createdAt: new Date(),
      });

      alert("Product uploaded successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        imageFile: null,
        sizes: [],
        colors: [],
        brand: "Nike",
        category: "men",
        stock: "",
      });

      // Redirect to the home page after the success message
      navigate("/");

      setImagePreview(null);
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Failed to upload product. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white text-gray-600 p-10 rounded shadow-lg shadow-slate-400 mx-40 my-20">
      <h2 className="text-xl font-bold mb-9">Upload New Product</h2>

      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Product Name"
        className="border p-2 rounded w-full"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Description"
        className="border p-2 rounded w-full"
        required
      />

      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        placeholder="Price"
        className="border p-2 rounded w-full"
        required
      />

      <label className="block font-medium">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="border p-2 rounded w-full"
        required
      />
      {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mt-4" />}

      {/* Sizes Dropdown */}
      <div className="relative z-10">
        <button
          type="button"
          onClick={() => toggleDropdown("sizes")}
          className="border p-2 rounded w-full text-left"
        >
          Select Sizes
        </button>
        {dropdownOpen.sizes && (
          <div className="absolute bg-gray-50 shadow-lg border rounded mt-1 w-full max-h-48 overflow-y-scroll">
            {sizeOptions.map((size) => (
              <label key={size} className="block px-4 py-2 hover:bg-blue-700">
                <input
                  type="checkbox"
                  value={size}
                  checked={formData.sizes.includes(size)}
                  onChange={(e) => handleCheckboxChange(e, "sizes")}
                  className="mr-4"
                />
                {size}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Colors Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown("colors")}
          className="border p-2 rounded w-full text-left"
        >
          Select Colors
        </button>
        {dropdownOpen.colors && (
          <div className="absolute bg-gray-50 shadow-lg border rounded mt-1 w-full max-h-48 overflow-y-scroll">
            {colorOptions.map((color) => (
              <label key={color} className="block px-4 py-2 hover:bg-blue-700">
                <input
                  type="checkbox"
                  value={color}
                  checked={formData.colors.includes(color)}
                  onChange={(e) => handleCheckboxChange(e, "colors")}
                  className="mr-4"
                />
                {color}
              </label>
            ))}
          </div>
        )}
      </div>

      <select
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
        required
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        name="brand"
        value={formData.brand}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
      >
        {brandOptions.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <select
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
      >
        <option value="men">Men</option>
        <option value="women">Women</option>
        <option value="unisex">Unisex</option>
      </select>

      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleInputChange}
        placeholder="Available quantity (Stock)"
        className="border p-2 rounded w-full"
        required
      />

      <button
        type="submit"
        className={`font-semibold px-4 py-2 !mt-20 rounded ${isLoading ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700"} text-black`}
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "Upload Product"}
      </button>
    </form>
  );
};

export default ProductUploadForm;
