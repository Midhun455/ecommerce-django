// src/components/Layout.jsx
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";        // normal user navbar
import AdminNavbar from "./AdminNavbar"; // admin-only navbar

function Layout({ children }) {
    const { isAdmin } = useAuth();
    return (
        <div>
            {isAdmin ? <AdminNavbar /> : <Navbar />}
            <main className="min-h-screen">{children}</main>
        </div>
    );
}

export default Layout;
