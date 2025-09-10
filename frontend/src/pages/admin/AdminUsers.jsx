import { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminUsers() {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await API.get("admin/users/");
            setUsers(res.data);
        } catch (err) {
            console.error("❌ Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await API.delete(`admin/users/${id}/`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            console.error("❌ Delete failed:", err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">Admin - Manage Users</h2>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Username</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Staff</th>
                            <th className="px-4 py-2 text-left">Joined</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-2">{u.id}</td>
                                <td className="px-4 py-2 capitalize">{u.username}</td>
                                <td className="px-4 py-2">{u.email}</td>
                                <td className="px-4 py-2">{u.is_staff ? "✅ Yes" : "❌ No"}</td>
                                <td className="px-4 py-2">{new Date(u.date_joined).toLocaleDateString()}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => deleteUser(u.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsers;
