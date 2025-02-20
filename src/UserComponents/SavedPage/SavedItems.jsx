import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase"; // Update path if necessary
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom

const SavedItems = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize useNavigate

  // Fetch saved items and product details
  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const savedSnapshot = await getDocs(collection(db, "saved"));
        const savedItemsData = savedSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch product details for each saved item
        const products = await Promise.all(
          savedItemsData.map(async (item) => {
            const productRef = doc(db, "products", item.productId);
            const productDoc = await getDoc(productRef);
            if (productDoc.exists()) {
              return { ...item, ...productDoc.data() };
            } else {
              console.error(`Product with ID ${item.productId} not found.`);
              return null;
            }
          })
        );

        // Filter out null items (in case of missing products)
        setSavedItems(products.filter((product) => product !== null));
      } catch (error) {
        console.error("Error fetching saved items or products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, []);

  // Remove item from Firestore and UI
  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, "saved", id));
      setSavedItems(savedItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Navigate to the single product page
  const handleItemClick = (id) => {
    navigate(`/singleproduct/${id}`);  // Navigate to the SingleProduct page with the item id
  };

  return (
    <section className="bg-gray-50 py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Your Saved Items</h2>
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Loading your saved items...</p>
          </div>
        ) : savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedItems.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 p-2"
                onClick={() => handleItemClick(item.id)}  // Handle click to navigate to SingleProduct
              >
                <img
                  src={item.imageUrl || "/path/to/fallback-image.jpg"}
                  alt={`${item.brand} Shoe`}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="mt-4 px-3">
                  <h3 className="text-xl font-bold text-gray-800">{item.brand}</h3>
                  <p className="text-lg text-gray-600">{item.price}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();  // Prevent navigation on button click
                    removeItem(item.id);
                  }}
                  className="absolute text-xl bottom-2 right-2 text-red-600 p-2 rounded-full transition"
                  aria-label="Remove Item"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">You have no saved items.</p>
            <p className="text-gray-500">Start exploring and save your favorite shoes!</p>
            <img
              src="/path/to/illustration.png" // Replace with an actual path
              alt="No items illustration"
              className="mt-6 mx-auto w-1/2 sm:w-1/3"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedItems;
