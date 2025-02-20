import React, { useState, useEffect } from "react";
import { db } from "../Firebase/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const OrderManagement = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [selectedTab, setSelectedTab] = useState("current"); // "current" or "history"
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(""); 
  const [viewingReceipt, setViewingReceipt] = useState(false);


  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "orders");
        const ordersSnapshot = await getDocs(ordersRef);
        const currentOrdersData = [];
        const allOrdersData = [];

        ordersSnapshot.forEach((doc) => {
          const order = doc.data();
          if (order.status === "pending") {
            currentOrdersData.push({ ...order, id: doc.id });
          }
          allOrdersData.push({ ...order, id: doc.id });
        });

        setCurrentOrders(currentOrdersData);
        setOrderHistory(allOrdersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, { status: newStatus });

      // Update local state
      setCurrentOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id ? { ...order, status: newStatus } : order
        )
      );
      setOrderHistory((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id ? { ...order, status: newStatus } : order
        )
      );

      // Reset modal state
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      setNewStatus("");
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Handle modal close
  const handleCloseDetails = () => {
    setSelectedOrder(null);
    setNewStatus("");
  };

  return (
    <div className="bg-gray-50 py-10 min-h-screen mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          Admin Order Management
        </h2>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setSelectedTab("current")}
            className={`py-2 px-4 ${
              selectedTab === "current"
                ? "bg-slate-600 text-white"
                : "bg-gray-200 text-gray-800"
            } rounded-md`}
          >
            Current Orders
          </button>
          <button
            onClick={() => setSelectedTab("history")}
            className={`py-2 px-4 ${
              selectedTab === "history"
                ? "bg-slate-600 text-white"
                : "bg-gray-200 text-gray-800"
            } rounded-md ml-4`}
          >
            Order History
          </button>
        </div>

        {/* Current Orders Section */}
        {selectedTab === "current" && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Loading current orders...</p>
              </div>
            ) : currentOrders.length > 0 ? (
              <div>
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-4 mb-4 rounded-lg shadow-md cursor-pointer mx-10"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      Order ID: {order.id}
                    </h3>
                    <p className="text-lg text-gray-600">Total: ${order.totalAmount}</p>
                    <p className="text-sm text-gray-500">Status: {order.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No current orders.</p>
              </div>
            )}
          </div>
        )}

        {/* Order History Section */}
        {selectedTab === "history" && (
          <div>
            {loading ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Loading order history...</p>
              </div>
            ) : orderHistory.length > 0 ? (
              <div>
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-4 mb-4 rounded-lg shadow-md mx-10"
                  >
                    <h3 className="text-xl font-bold text-gray-800">
                      Order ID: {order.id}
                    </h3>
                    <p className="text-lg text-gray-600">Total: ${order.totalAmount}</p>
                    <p className="text-sm text-gray-500">Status: {order.status}</p>
                    <p className="text-md text-gray-600">Customer Name: {order.shippingDetails.name}</p>
                    <p className="text-md text-gray-600">Customer Address: {order.shippingDetails.address}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No past orders.</p>
              </div>
            )}
          </div>
        )}
      </div>


    {/* Modal for Viewing Order Details */}
    {selectedOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 text-black">
        <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 max-w-3xl overflow-y-auto max-h-[80vh] relative">
          <button
            onClick={handleCloseDetails}
            className="absolute top-4 right-4 text-white text-2xl text-center bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center"
          >
            X
          </button>
          <h3 className="text-3xl font-bold text-gray-700 mb-7">Order Details</h3>

          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-700">
              <span className="font-serif">Name:</span> <span className="font-thin">{selectedOrder.shippingDetails?.name}</span> 
            </p>
            <p className="text-lg font-semibold text-gray-700">
              <span className="font-serif">Address:</span> <span className="font-thin">{selectedOrder.shippingDetails?.address}</span> 
            </p>
            <p className="text-lg font-semibold text-gray-700">
              <span className="font-serif">City:</span> <span className="font-thin">{selectedOrder.shippingDetails?.city}</span> 
            </p>
            <p className="text-lg font-semibold text-gray-700">
              <span className="font-serif">Postal Code:</span> <span className="font-thin">{selectedOrder.shippingDetails?.postalCode}</span> 
            </p>

            {/* Items */}
            <div>
              <h4 className="text-lg font-bold font-serif text-gray-700 mb-2">Items:</h4>
              {selectedOrder.items?.map((item, index) => (
                <div key={index} className="mb-2">
                  <p className="text-sm text-gray-600 pl-5">
                    {item.name} (x{item.quantity}) -<span className="font-bold text-green-500"> ${item.price} </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Uploaded Receipt */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Check Receipt:</h4>
              
              {selectedOrder.payment?.receipt ? (
                <>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setViewingReceipt(true);
                    }}
                    className="text-blue-600 hover:underline py-1 px-3 m-3 bg-slate-400 rounded"
                  >
                    View Receipt
                  </a>
                  {viewingReceipt && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                      <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-full max-h-[150vh] overflow-y-auto">
                        <button
                          onClick={() => setViewingReceipt(false)}
                          className="absolute top-4 right-4 text-white text-xl bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center"
                        >
                          X
                        </button>
                        <img
                          src={selectedOrder.payment.receipt}
                          alt="Receipt"
                          className="max-w-full min-h-[80vh] rounded-md shadow-md"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">No receipt uploaded.</p>
              )}
            </div>

            {/* Update Status Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Update Status:</h4>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-4 w-full"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={handleStatusUpdate}
                className="mt-10 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    </div>
  );
};

export default OrderManagement;
