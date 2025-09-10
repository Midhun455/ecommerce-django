import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cartcontext";

const Cart = () => {
  const { cart, updateCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Handlers for +/- 
  const increaseQty = (item) => {
    if (item.quantity < item.product.stock) {
      updateCart(item.id, item.quantity + 1);
    } else {
      alert(`Only ${item.product.stock} items available in stock.`);
    }
  };

  const decreaseQty = (item) => {
    if (item.quantity > 1) {
      updateCart(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm"
            >
              {/* Product Image */}
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-md"
              />

              {/* Product Details */}
              <div className="flex-1 ml-4">
                <h4 className="font-semibold text-gray-800">
                  {item.product.name}
                </h4>
                <p className="text-gray-500">₹{item.product.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQty(item)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  ➖
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item)}
                  disabled={item.quantity >= item.product.stock}
                  className={`px-2 py-1 rounded transition ${
                    item.quantity >= item.product.stock
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  ➕
                </button>
              </div>

              {/* Item Total */}
              <div className="min-w-[100px] text-right font-medium text-gray-800">
                ₹{item.product.price * item.quantity}
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                ❌
              </button>
            </div>
          ))}

          {/* Cart Summary */}
          <div className="text-right mt-6 text-lg font-bold">
            Total: ₹{total}
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition"
          >
            ✅ Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
