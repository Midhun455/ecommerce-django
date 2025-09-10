import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminNavbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login"); // Redirect to login page
    };

    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <ul className="flex gap-6 items-center">
                <li><Link to="/admin/dashboard">Dashboard</Link></li>
                <li><Link to="/admin/products">Products</Link></li>
                <li><Link to="/admin/orders">Orders</Link></li>
                <li><Link to="/admin/users">Users</Link></li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="text-red-500 hover:text-red-400 font-medium"
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default AdminNavbar;
