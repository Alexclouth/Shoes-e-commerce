import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebase'; // Adjust the path to your Firebase config
import { useAuth } from '../../Context/AuthContext'; 
import { deleteField } from 'firebase/firestore';


const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); // Assuming `currentUser` contains the authenticated user's info
  const navigate = useNavigate(); // Set up navigation


  const cartDocRef = currentUser ? doc(db, 'carts', currentUser.uid) : null;

  // Fetch cart from Firestore on mount
  useEffect(() => {
    if (!currentUser) return;

    console.log('Listening to cart changes for user:', currentUser.uid);

    const unsubscribe = onSnapshot(cartDocRef, (doc) => {
      if (doc.exists()) {
        const itemsMap = doc.data().items || {};
        const itemsArray = Object.entries(itemsMap).map(([id, item]) => ({
          ...item,
          id,
        }));
        setCartItems(itemsArray);
      } else {
        console.log('No cart document found, initializing empty cart');
        setCartItems([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching cart data:', error);
      setLoading(false); // Stop loading on error
    });

    return () => unsubscribe();
  }, [currentUser, cartDocRef]);

  // Save cart to Firestore
  const saveCartToFirestore = async (updatedCart) => {
    try {
      const updatedItemsMap = updatedCart.reduce((acc, item) => {
        acc[item.id] = { ...item };
        delete acc[item.id].id; // Remove the `id` field as it's redundant in Firestore
        return acc;
      }, {});

      await setDoc(cartDocRef, { items: updatedItemsMap }, { merge: true });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    saveCartToFirestore(updatedCart);
  };

  // Updated removeItem function
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);

    // Remove the item from Firestore using FieldValue.delete()
    updateDoc(cartDocRef, {
      [`items.${id}`]: deleteField(), // Use deleteField to remove the item
    }).catch((error) => console.error('Error removing item:', error));
  };

  // Calculate total price and ensure price is valid before calling toFixed
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price); // Ensure price is a number
      const quantity = item.quantity || 0; // Default to 0 if quantity is not present
      return total + (isNaN(price) ? 0 : price * quantity); // Check if price is a valid number
    }, 0).toFixed(2);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout'); // Navigate to checkout page when button is clicked
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-bold text-gray-600">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 mt-20">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">Your Shopping Cart</h2>

      {cartItems.length > 0 ? (
        <div className="max-w-4xl mx-auto bg-gray-100 rounded-lg border- p-6">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4 mb-4 bg-white p-5 shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-fill rounded"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      {item.name || 'Unnamed Product'}
                    </h3>
                    <p className="text-sm text-gray-500">{item.brand || 'Unknown Brand'}</p>
                    <p className="text-sm text-gray-500">
                      ${isNaN(parseFloat(item.price)) ? 'N/A' : parseFloat(item.price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-4 text-gray-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:bg-red-200 bg-red-100 p-3 rounded-md shadow-md"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right mt-6">
            <p className="text-xl font-bold text-gray-800">
              Total: ${calculateTotal()}
            </p>
            <button onClick={handleProceedToCheckout} className="mt-4 px-6 py-2 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700">
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-700">Your cart is empty. Start shopping!</p>
      )}
    </div>
  );
};

export default CartPage;
