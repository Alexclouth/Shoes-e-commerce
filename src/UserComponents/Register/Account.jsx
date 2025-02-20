import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { useAuth } from "../../Context/AuthContext"; 
import { motion } from "framer-motion";

const Account = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState({});

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Fetch user details from Firebase
    const fetchUserDetails = async () => {
      try {
        const userRef = collection(db, "users"); // Assuming you have a "users" collection
        const q = query(userRef, where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          setUserDetails(doc.data());
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();

    const fetchUserOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        const userOrders = [];
        querySnapshot.forEach((doc) => {
          userOrders.push({ id: doc.id, ...doc.data() });
        });

        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [currentUser]);

  const statusStyles = {
    pending: "bg-yellow-200 text-yellow-900",
    accepted: "bg-green-200 text-green-900",
    rejected: "bg-red-200 text-red-900",
  };

  const statusMessages = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 text-gray-900 flex justify-center items-center">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="w-[600px] h-[600px] bg-gradient-to-br from-gold-500 to-yellow-300 opacity-20 rounded-full blur-3xl absolute top-0 right-0"></div>
        <div className="w-[700px] h-[700px] bg-gradient-to-br from-gray-300 to-white opacity-20 rounded-full blur-3xl absolute bottom-10 left-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative z-0 w-full max-w-2xl p-8 bg-opacity-95 bg-white rounded-lg shadow-2xl mt-20"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gold-700">Account Overview</h2>

        {/* Account Details Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 border-b border-gray-300 pb-6"
        >
          {user ? (
            <div className="bg-gray-200 p-3 rounded-md">
              {userDetails.profilePicture && (
                <div class="flex justify-center items-center">
                  <img
                    src={userDetails.profilePicture}
                    alt="Profile"
                    className="w-36 h-32 rounded-full mb-4 justify-center"
                  />
                </div>
              )}
              <p className="text-4xl font-extrabold mb-4 text-center">
                 {userDetails.name || "N/A"}
              </p>
              <p className="text-lg mb-4 text-center">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-lg mb-4 text-center">
                <strong>User role:</strong> {userDetails.role}
              </p>
              <div class="flex justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="w-3/5 bg-red-600 text-center hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md"
                >
                  Sign Out
                </motion.button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No user is signed in.</p>
          )}
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="text-2xl font-semibold mb-4">Your Orders</h3>
          {loading ? (
            <p className="text-gray-600">Loading your orders...</p>
          ) : orders.length ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-6 rounded-lg shadow-md border ${statusStyles[order.status] || "bg-gray-100"}`}
                >
                  <h4 className="text-xl font-semibold">Order ID: {order.id}</h4>
                  <p className="mt-2">
                    Status: <strong>{statusMessages[order.status]}</strong>
                  </p>
                  {order.items && (
                    <div className="mt-4">
                      <h5 className="font-semibold">Items:</h5>
                      <ul className="list-disc list-inside">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.name} - Quantity: {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You have no orders yet.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Account;
