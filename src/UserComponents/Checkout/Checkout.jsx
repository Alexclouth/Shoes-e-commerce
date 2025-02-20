import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../Firebase/firebase"; 
import { collection, getDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedBank, setSelectedBank] = useState("");
  const [receipt, setReceipt] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const cartRef = doc(db, "carts", user.uid);
          const cartDoc = await getDoc(cartRef);

          if (cartDoc.exists()) {
            const cartData = cartDoc.data();
            const items = cartData.items ? Object.values(cartData.items) : [];

            setCartItems(items);

            // Calculate total price
            const totalAmount = items.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            );
            setTotal(totalAmount);
          } else {
            console.log("No cart data found for user.");
          }
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCartItems();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({ ...shippingDetails, [name]: value });
  };

  const handleBankSelection = (e) => {
    setSelectedBank(e.target.value);
  };

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handlePlaceOrder = async () => {
    // Retrieve the userId from Firebase Auth
    const userId = auth?.currentUser?.uid;
  
    if (!userId) {
      alert("You need to log in to place an order.");
      navigate("/login");
      return;
    }
  
    try {
      let receiptUrl = "";

          // Upload receipt to Cloudinary if a receipt file is selected
    if (receipt) {
      const formData = new FormData();
      formData.append("file", receipt);
      formData.append("upload_preset", "image-upload");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dewutmxvk/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        receiptUrl = data.secure_url; // Get the uploaded image URL
      } else {
        throw new Error("Failed to upload receipt");
      }
    }


      const orderRef = collection(db, "orders");
  
      // Create the order data object
      const orderData = {
        userId, // Add the userId to the order
        items: cartItems,
        shippingDetails,
        totalAmount: total,
        payment: {
          bank: selectedBank,
          receipt: receiptUrl,
        },
        status: "pending", // Initial status
        createdAt: new Date(),
      };
  
      // Save the order to Firestore
      await addDoc(orderRef, orderData);
  
      // Optionally, clear the cart after placing the order
      const cartRef = doc(db, "carts", userId);
      await updateDoc(cartRef, { items: {} }); // Clear cart
  
      alert("Your order has been placed successfully!");
  
      // Navigate to the order confirmation or thank-you page
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  

  const bankDetails = {
    "Bank Of Abyssinia": "123-456-789",
    "National Bank": "987-654-321",
    "Dashin Bank": "555-444-333",
    "Commercial Bank of Africa": "111-222-333",
  };

  return (
    <section className="bg-gray-50 py-20 min-h-screen text-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          Checkout
        </h2>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Loading your cart...</p>
          </div>
        ) : cartItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mt-4">{item.name}</h3>
                  <p className="text-lg text-gray-600">Price: ${item.price}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipping Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={shippingDetails.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="p-3 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="postalCode"
                  value={shippingDetails.postalCode}
                  onChange={handleInputChange}
                  placeholder="Postal Code"
                  className="p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment</h3>
              <div className="mb-4">
                <label htmlFor="bank" className="block text-lg text-gray-800 mb-2">
                  Select Bank
                </label>
                <select
                  id="bank"
                  value={selectedBank}
                  onChange={handleBankSelection}
                  className="p-3 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Select a Bank</option>
                  {Object.keys(bankDetails).map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBank && (
                <div className="mb-4">
                  <p className="text-lg text-gray-600">
                    Account Number: {bankDetails[selectedBank]}
                  </p>
                </div>
              )}

              {selectedBank && (
                <div className="mb-4">
                  <label htmlFor="receipt" className="block text-lg text-gray-800 mb-2">
                    Upload Payment Receipt
                  </label>
                  <input
                    type="file"
                    id="receipt"
                    onChange={handleFileChange}
                    className="p-3 border border-gray-300 rounded-md w-full"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 text-right">
              <p className="text-xl font-semibold text-gray-800">Total: ${total}</p>
              <button
                onClick={handlePlaceOrder}
                className="mt-4 inline-block bg-amber-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-amber-700"
              >
                Place Order
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Your cart is empty.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Checkout;
