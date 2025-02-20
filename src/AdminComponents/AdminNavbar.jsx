import React, { useState } from "react";

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-black bg-opacity-50 text-white fixed w-full top-0 z-30 shadow-md">
      {/* Fixed Header */}
      <header className="bg-gray-800 text-white py-4 shadow-md fixed top-0 inset-x-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="/admin">
            <h1 className="text-2xl font-bold px-3">Admin Dashboard</h1>
          </a>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 px-3">
            <a
              href="/admin/upload"
              className="px-3 py-2 rounded-md text-md font-bold hover:bg-gray-700"
            >
              Upload
            </a>
            <a
              href="/admin/adminProduct"
              className="px-3 py-2 rounded-md text-md font-bold hover:bg-gray-700"
            >
              Products
            </a>
            <a
              href="/admin/adminOrder"
              className="px-3 py-2 rounded-md text-md font-bold hover:bg-gray-700"
            >
              Orders
            </a>
            <a
              href="/admin/adminUser"
              className="px-3 py-2 rounded-md text-md font-bold hover:bg-gray-700"
            >
              Users
            </a>
          </div>
          {/* Hamburger Icon for Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 text-white py-4">
            <a
              href="/admin/upload"
              className="block px-3 py-2 rounded-md text-md font-bold hover:bg-gray-700"
            >
              Upload
            </a>
            <a
              href="/admin/adminProduct"
              className="block px-3 py-2 rounded-md text-md font-bold hover:bg-gray-700"
            >
              Products
            </a>
            <a
              href="/admin/adminOrder"
              className="block px-3 py-2 rounded-md text-md font-bold hover:bg-gray-700"
            >
              Orders
            </a>
            <a
              href="/admin/adminUser"
              className="block px-3 py-2 rounded-md text-md font-bold hover:bg-gray-700"
            >
              Users
            </a>
          </div>
        )}
      </header>
    </nav>
  );
};

export default AdminNavbar;
