import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../index.css";

function AdminDashboard() {
    const { username, accessToken } = useAuth(); // accessToken for auth headers
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/admin/stats/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [accessToken]);

    if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Welcome back, {username} 👋
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-700">Products</h2>
                    <p className="text-3xl font-bold text-blue-600">{stats.products}</p>
                    <Link to="/admin/products" className="text-sm text-blue-500">
                        Manage Products →
                    </Link>
                </div>
                <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-700">Orders</h2>
                    <p className="text-3xl font-bold text-green-600">{stats.orders}</p>
                    <Link to="/orders" className="text-sm text-green-500">
                        Manage Orders →
                    </Link>
                </div>
                <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-700">Users</h2>
                    <p className="text-3xl font-bold text-purple-600">{stats.users}</p>
                    <Link to="/admin/users" className="text-sm text-purple-500">
                        Manage Users →
                    </Link>
                </div>
                <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
                    <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
                    <p className="text-3xl font-bold text-yellow-600">₹{(stats.revenue / 100000).toFixed(1)}M</p>
                    <span className="text-sm text-gray-500">This Month</span>
                </div>
            </div>
            {/* Quick Links */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-700">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        to="/admin/products"
                        className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 text-center"
                    >
                        🛍️ Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        className="bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 text-center"
                    >
                        📦 View Orders
                    </Link>
                    <Link
                        to="/admin/users"
                        className="bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 text-center"
                    >
                        👤 Manage Users
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
