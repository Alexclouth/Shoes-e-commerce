import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 mt-20 text-black">
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6 mt-16">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Upload Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4">Upload</h2>
            <p className="text-gray-600">Manage and upload new products effortlessly.</p>
            <a
              href="/admin/upload"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Upload
            </a>
          </div>

          {/* Products Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <p className="text-gray-600">View and manage the list of all products.</p>
            <a
              href="/admin/adminProduct"
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              View Products
            </a>
          </div>

          {/* Orders Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <p className="text-gray-600">Track and update order statuses seamlessly.</p>
            <a
              href="/admin/adminOrder"
              className="mt-4 inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              View Orders
            </a>
          </div>

          {/* Users Section */}
          <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold mb-4">Users</h2>
            <p className="text-gray-600">Manage user accounts and access levels.</p>
            <a
              href="/admin/adminUser"
              className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Manage Users
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Admin Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}