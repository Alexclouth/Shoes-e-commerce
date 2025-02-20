import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBookmark, faUser, faSignOutAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > scrollY) {
        setIsVisible(false); // Hide navbar on scroll down
      } else {
        setIsVisible(true); // Show navbar on scroll up
      }
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  const handleUserClick = () => {
    if (currentUser) {
      navigate("/account"); // Navigate to account page if signed in
    } else {
      navigate("/signin"); // Navigate to sign-in page if not signed in
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setCurrentUser(null);
      navigate("/signin");
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav
      className={`bg-black bg-opacity-50 text-white fixed w-full top-0 z-10 shadow-md transition-transform duration-1000 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <img
                src="src/assets/download-removebg-preview.png"
                alt="Logo"
                className="h-14 w-16 object-fill shadow-lg"
              />
              <h1 className="text-amber-500 text-lg font-bold">Golden Strides</h1>
            </div>
          </a>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative w-2/6">
            <div className="relative w-full">
              {/* Search Icon */}
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-100 pointer-events-none px-1">
                <FontAwesomeIcon icon={faSearch} />
              </span>

              {/* Input Field */}
              <input
                type="text"
                placeholder="Search shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black bg-opacity-60 text-white shadow-sm shadow-gray-100 rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </form>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <a href="/cart" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                <FontAwesomeIcon icon={faShoppingCart} />
              </a>
              <a href="/saved" className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700">
                <FontAwesomeIcon icon={faBookmark} />
              </a>
              <button
                onClick={handleUserClick}
                className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faUser} />
              </button>
            </div>
          </div>

          {/* Hamburger Icon */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/cart" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              <FontAwesomeIcon icon={faShoppingCart} /> <span className="px-1">Cart</span>
            </a>
            <a href="/saved" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              <FontAwesomeIcon icon={faBookmark} /> <span className="px-1">Saved</span>
            </a>
            <button
              onClick={currentUser ? handleLogout : handleUserClick}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={currentUser ? faSignOutAlt : faUser} />{" "}
              <span className="px-1">{currentUser ? "Logout" : "Account"}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
