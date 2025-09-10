import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthContext, useAuth } from "./context/AuthContext";
import { setupInterceptors } from "./api/axios";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import "./index.css";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Home from "./pages/home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AddProduct from "./pages/AddProduct";
import Products from "./pages/Products";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import { CartProvider } from "./context/Cartcontext";
import OrderHistory from "./pages/OrderHistory";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";

const stripePromise = loadStripe("pk_test_51S5OKBFZXhUOwaMYFjTN8ur2TK7LV59XAtHjUYuRdgUhj2LhdnhPuvqmktRebe86v9zxAC01JxgDFrIWvTDjY8ZA00jMIsb5Hn");


function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          🛍️ <span>Minimal Shop</span>
        </h1>

        {/* Links */}
        <nav className="flex items-center gap-6 text-gray-700 font-medium">
          <Link
            to="/"
            className="hover:text-indigo-600 transition-colors duration-200"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/add-product"
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                Add Product
              </Link>
              <Link
                to="/products"
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                to="/cart"
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                Cart
              </Link>
              <Link
                to="/orders"
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                Orders
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer duration-200 shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function App() {
  const { logout, isAdmin } = useAuth();  // 👈 also grab isAdmin

  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);

  return (
    <CartProvider>
      <Router>
        {/* Show normal navbar only if NOT admin */}
        {!isAdmin && <Navbar />}

        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/products" element={<Products />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <Elements stripe={stripePromise}>
                  <Checkout />
                </Elements>
              }
            />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/orders" element={<OrderHistory />} />

            {/* Admin routes (these already include AdminLayout with its own navbar) */}
            <Route element={<AdminLayout />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/add" element={<AddProduct />} />
              <Route path="/admin/products/edit/:id" element={<EditProduct />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </main>
      </Router>
    </CartProvider>
  );
}


export default App;
