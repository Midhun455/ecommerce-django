// CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const CartContext = createContext();
const API_URL = "http://127.0.0.1:8000/api/cart/";

// ✅ Helper: get token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch cart items
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: getAuthHeaders(),
      });
      setCart(response.data);
    } catch (error) {
      console.error("❌ Error fetching cart:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post(
        API_URL,
        { product: productId, quantity },
        { headers: getAuthHeaders() }
      );
      setCart((prev) => [...prev, response.data]); // update state
    } catch (error) {
      console.error("❌ Error adding to cart:", error.response?.data || error);
    }
  };

  // 🔄 Update quantity
  const updateCart = async (itemId, quantity) => {
    try {
      const response = await axios.patch(
        `${API_URL}${itemId}/`,
        { quantity },
        { headers: getAuthHeaders() }
      );
      setCart((prev) =>
        prev.map((item) => (item.id === itemId ? response.data : item))
      );
    } catch (error) {
      console.error("❌ Error updating cart:", error.response?.data || error);
    }
  };

  // ❌ Remove from cart
  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`${API_URL}${itemId}/`, {
        headers: getAuthHeaders(),
      });
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("❌ Error removing from cart:", error.response?.data || error);
    }
  };

  // Load cart when component mounts
  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, loading, fetchCart, addToCart, updateCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);