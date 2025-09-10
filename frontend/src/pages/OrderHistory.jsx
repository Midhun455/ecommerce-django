import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/orders/", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setOrders(res.data);
            } catch (err) {
                setError("Failed to load orders.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading)
        return (
            <p className="text-center text-gray-600 mt-6">Loading your orders...</p>
        );

    if (error)
        return <p className="text-center text-red-500 font-medium mt-6">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-center mb-6">Your Orders</h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-700">
                    No orders yet.{" "}
                    <Link to="/products" className="text-blue-600 hover:underline">
                        Start Shopping
                    </Link>
                </p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
                        >
                            {/* Order Header */}
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Order #{order.id}
                                </h3>
                                <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full uppercase  ${order.status === "delivered"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600">
                                Order Date:{" "}
                                {new Date(order.created_at).toLocaleDateString("en-IN")}
                            </p>
                            <p className="font-medium text-gray-800 mt-1">
                                Total: ₹{order.total}
                            </p>

                            {/* Order Items */}
                            <div className="mt-4 space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                                    >
                                        <img
                                            src={item.product.image || "https://via.placeholder.com/80"}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {item.product.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                ₹{item.product.price} × {item.quantity}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-700">
                                                Subtotal: ₹{item.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
