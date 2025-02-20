import React, { useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./UserComponents/Navigation/Navbar";
import AdminNavbar from "./AdminComponents/AdminNavbar";
import Product from "./UserComponents/Product/Product";
import Sidebar from "./UserComponents/Sidebar/Sidebar";
import SignIn from "./UserComponents/Register/Signin";
import SignUp from "./UserComponents/Register/Signup";
import SingleProduct from "./UserComponents/Product/SingleProduct";
import Recommended from "./UserComponents/Recommended/Recommended";
import CartPage from "./UserComponents/CartPage/CartPage";
import SavedItems from "./UserComponents/SavedPage/SavedItems";
import AdminDashboard from "./AdminComponents/AdminDashboard";
import OrderManagement from "./AdminComponents/OrderManagement";
import ProductManagement from "./AdminComponents/ProductManagement";
import UserManagement from "./AdminComponents/UserManagement";
import { AuthProvider } from "./Context/AuthContext";
import Account from "./UserComponents/Register/Account";
import ProductUploadForm from "./AdminComponents/ProductUpload";
import Home from "./UserComponents/Home"
import { CategoryProvider } from "./Context/CategoryContext";
import { CartProvider } from "./Context/CartContext";
import CheckoutPage from "./UserComponents/Checkout/Checkout";
import OrderConfirmation from "./UserComponents/Checkout/OrderConfirmation";
import AdminRoute from "./Context/AdminRoute";


// Layout Component: Manages Navbar based on route type
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <main>{children}</main>
    </>
  );
};

const App = () => {
  const [selectedBrand, setSelectedBrand] = useState("");

  return (
    <AuthProvider>
      <CategoryProvider>
        <CartProvider>
          <Router>
            <div className="overflow-x-hidden text-neutral-200 antialiased selection:bg-cyan-300 selection:text-cyan-900 bg-gray-100">
              <div className="container mx-auto">
                <Layout>
                  <Routes>
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute requiredRole="Admin"> <AdminDashboard /> </AdminRoute>} />
                    <Route path="/admin/adminProduct" element={<AdminRoute requiredRole="Admin"> <ProductManagement /> </AdminRoute>} />
                    <Route path="/admin/adminOrder" element={<AdminRoute requiredRole="Admin"> <OrderManagement /> </AdminRoute>} />
                    <Route path="/admin/adminUser" element={<AdminRoute requiredRole="Admin"> <UserManagement /> </AdminRoute>} />
                    <Route path="/admin/upload" element={<AdminRoute requiredRole="Admin"> <ProductUploadForm /> </AdminRoute>} />

                    {/* User Routes */}

                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation/" element={<OrderConfirmation/>} />
                    <Route path="/saved" element={<SavedItems />} />
                    <Route path="/singleProduct/:productId" element={<SingleProduct />} />

                    {/* Home Route */}
                    <Route
                      path="/"
                      element={
                        <div className="flex flex-col">
                          <div className="w-full">
                            <Home />
                          </div>
                          <div className="flex">
                            <div className="w-1/4">
                              <Sidebar />
                            </div>
                            <div className="w-3/4">
                              <Recommended setSelectedBrand={setSelectedBrand} />
                              <Product selectedBrand={selectedBrand} />
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </Routes>
                </Layout>
              </div>
            </div>
          </Router>
        </CartProvider>
      </CategoryProvider>
    </AuthProvider>
  );
};

export default App;
