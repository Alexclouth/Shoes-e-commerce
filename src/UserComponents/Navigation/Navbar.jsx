import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faBookmark,
  faUser,
  faSignOutAlt,
  faSearch,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
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

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= scrollY);
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);

  const handleUserClick = () => {
    navigate(currentUser ? "/account" : "/signin");
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
      className={`bg-black bg-opacity-50 text-white fixed w-full top-0 z-50 shadow-md transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/dewutmxvk/image/upload/v1740079496/logo_l6boqg.png"
              alt="Logo"
              className="h-12 w-14 object-fill shadow-lg"
            />
            <h1 className="text-amber-500 text-lg font-bold">Golden Strides</h1>
          </a>

          {/* Search Form (Hidden on Small Screens) */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex relative w-1/3"
          >
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-100">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input
              type="text"
              placeholder="Search shoes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black bg-opacity-60 text-white shadow-sm rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-white"
            />
          </form>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/cart" className="p-2 rounded-md hover:bg-gray-700">
              <FontAwesomeIcon icon={faShoppingCart} />
            </a>
            <a href="/saved" className="p-2 rounded-md hover:bg-gray-700">
              <FontAwesomeIcon icon={faBookmark} />
            </a>
            <button
              onClick={handleUserClick}
              className="p-2 rounded-md hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faUser} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white focus:outline-none"
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-3 space-y-2">
          <a href="/cart" className="block py-2 rounded-md hover:bg-gray-700">
            <FontAwesomeIcon icon={faShoppingCart} /> <span className="px-1">Cart</span>
          </a>
          <a href="/saved" className="block py-2 rounded-md hover:bg-gray-700">
            <FontAwesomeIcon icon={faBookmark} /> <span className="px-1">Saved</span>
          </a>
          <button
            onClick={currentUser ? handleLogout : handleUserClick}
            className="block w-full text-left py-2 rounded-md hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={currentUser ? faSignOutAlt : faUser} />{" "}
            <span className="px-1">{currentUser ? "Logout" : "Account"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
