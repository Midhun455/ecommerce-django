// src/components/admin/AdminLayout.jsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login"); // Redirect to login page
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Navbar */}
            <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
                <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>
                <ul className="flex items-center space-x-6">
                    <li>
                        <Link
                            to="/admin-dashboard"
                            className="hover:text-indigo-400 transition-colors"
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/products"
                            className="hover:text-indigo-400 transition-colors"
                        >
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/orders"
                            className="hover:text-indigo-400 transition-colors"
                        >
                            Orders
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/users"
                            className="hover:text-indigo-400 transition-colors"
                        >
                            Users
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Main content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
