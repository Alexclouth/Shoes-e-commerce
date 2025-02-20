import React, { useEffect, useState } from "react";
import { getDocs, collection, doc, setDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../../Firebase/firebase";
import { useCategory } from "../../Context/CategoryContext";
import { useAuth } from "../../Context/AuthContext";

const Product = ({ selectedBrand }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCategory, selectedGender, selectedPriceRange, selectedColors } = useCategory();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add to Cart Functionality
  const handleAddToCart = async (product) => {
    if (!currentUser) {
      alert("You need to be logged in to add items to the cart.");
      return;
    }

    try {
      const userId = currentUser.uid;
      const cartRef = doc(db, "carts", userId);
      const cartDoc = {
        items: {
          [product.id]: {
            ...product,
            quantity: 1,
          },
        },
      };

      await setDoc(cartRef, cartDoc, { merge: true });
      alert(`${product.name} has been added to your cart.`);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred while adding the product to the cart.");
    }
  };

  // Filter products based on search query, category, gender, brand, price range, and colors
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Show All" || product.category === selectedCategory;
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesGender =
      selectedGender === "All Gender" || product.gender === selectedGender;
    const matchesPrice =
      product.price >= selectedPriceRange[0] &&
      product.price <= selectedPriceRange[1];

    const productColors = Array.isArray(product.color) ? product.color : [product.color];
    const matchesColor =
      selectedColors.length === 0 ||
      selectedColors.some((color) => productColors.includes(color));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesGender &&
      matchesPrice &&
      matchesColor
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Shoes Collection
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg p-4 transition transform hover:scale-105 cursor-pointer flex flex-col items-center"
              onClick={() => navigate(`/singleproduct/${product.id}`)}
            >
              {/* Product Image */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-fill rounded-md"
              />

              {/* Product Name */}
              <h2 className="text-lg font-semibold mt-3 text-gray-800 text-center">
                {product.name}
              </h2>

              {/* Product Description */}
              <p className="text-gray-600 text-sm text-center mt-1 px-2 line-clamp-2">
                {product.description}
              </p>

              {/* Product Price */}
              <p className="text-lg font-bold text-gray-800 mt-2">
                ${product.price}
              </p>

              {/* Add to Cart Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition w-full text-sm"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <div className="text-2xl font-bold text-yellow-500 col-span-full text-center">
            <p>No products available in this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
