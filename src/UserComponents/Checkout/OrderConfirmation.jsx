import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase"; // Adjust the path to your Firebase configuration
import { useAuth } from "../../Context/AuthContext";

const OrderConfirmation = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); // Assuming `currentUser` contains the authenticated user's info

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

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
    pending: "bg-yellow-200 text-yellow-700",
    confirmed: "bg-green-200 text-green-700",
    rejected: "bg-red-200 text-red-700",
  };

  const statusMessages = {
    pending: "Pending",
    confirmed: "Confirmed",
    rejected: "Rejected",
  };

  if (loading) {
    return <p className="text-gray-500">Loading your orders...</p>;
  }

  if (!orders.length) {
    return <p className="text-gray-700">You have no orders yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 text-black p-10">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`p-4 rounded-md shadow-md ${
              statusStyles[order.status] || "bg-gray-200 text-gray-700"
            }`}
          >
            <h2 className="text-lg font-semibold">Order ID: {order.id}</h2>
            <p className="mt-2">
              Status: <strong>{statusMessages[order.status]}</strong>
            </p>
            {order.items && (
              <div className="mt-4">
                <h3 className="font-semibold">Items:</h3>
                <ul className="list-disc list-inside">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderConfirmation;
