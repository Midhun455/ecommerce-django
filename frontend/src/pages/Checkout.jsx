import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  // ✅ Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/cart/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCartItems(res.data);
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ Calculate total
  useEffect(() => {
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    setTotal(totalPrice);
  }, [cartItems]);

  // ✅ Create PaymentIntent on backend
  useEffect(() => {
    if (total > 0) {
      axios
        .post(
          "http://localhost:8000/api/create-payment-intent/",
          { amount: total * 100 }, // Stripe expects amount in paise
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        )
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.error("PaymentIntent error:", err));
    }
  }, [total]);

  // ✅ Handle Payment
  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setMessage("");

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setMessage(`❌ Payment failed: ${error.message}`);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // ✅ Prepare order data for API
        const orderItems = cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        }));

        await axios.post(
          "http://localhost:8000/api/orders/",
          { items: orderItems },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        // ✅ Clear the cart
        await axios.post(
          "http://localhost:8000/api/cart/clear/",
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        // ✅ Update UI state
        setCartItems([]);
        setTotal(0);

        setMessage("✅ Payment successful! Order placed.");
        navigate("/order-confirmation");
      }
    } catch (err) {
      console.error("Order creation failed:", err.response?.data || err.message);
      setMessage("Payment done but order failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-5 text-center">Checkout</h2>
      {message && (
        <p className="text-center font-semibold text-green-600 mb-4">{message}</p>
      )}

      {cartItems.length === 0 ? (
        <p className="text-center text-lg text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {/* ✅ Cart Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">Qty</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="p-2">{item.product.name}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">₹{item.product.price}</td>
                    <td className="p-2">₹{item.product.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-right text-xl font-bold text-green-600 mb-5">
            Total: ₹{total}
          </h3>

          {/* ✅ Stripe Card Element */}
          <div className="p-3 border border-gray-300 rounded-lg mb-4 bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#32325d",
                    "::placeholder": { color: "#aab7c4" },
                  },
                },
              }}
            />
          </div>

          {/* ✅ Pay Button */}
          <button
            onClick={handlePayment}
            disabled={!stripe || !clientSecret || loading}
            className={`w-full py-3 font-semibold text-white rounded-lg transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Processing..." : `Pay ₹${total}`}
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;
