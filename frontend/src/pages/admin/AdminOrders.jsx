import { useEffect, useState } from "react";
import API from "../../api/axios";

function AdminOrders() {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await API.get("admin/orders/", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setOrders(res.data);
        } catch (err) {
            console.error("❌ Error fetching orders:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            try {
                const res = await API.patch(`admin/orders/${id}/`, { status });
                console.log(res.data);
                setOrders((prev) =>
                    prev.map((o) =>
                        o.id === id ? { ...o, status: res.data.status } : o
                    )
                );
            } catch (err) {
                console.error("❌ Update failed:", err.response?.data || err.message);
            }

        } catch (err) {
            console.error("❌ Update failed:", err);
        }
    };


    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-indigo-600">
                Manage Orders
            </h2>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">User</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Items</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Change Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {orders.map((o) => (
                            <tr
                                key={o.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-2">{o.id}</td>
                                <td className="px-4 py-2 capitalize">
                                    {o.user?.username || o.user}
                                </td>
                                <td className="px-4 py-2 capitalize font-medium text-gray-700">
                                    {o.status}
                                </td>
                                <td className="px-4 py-2">
                                    {o.items?.map((i) => (
                                        <div
                                            key={i.id}
                                            className="text-sm text-gray-600"
                                        >
                                            {i.product?.name} × {i.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td className="px-4 py-2 capitalize font-medium text-gray-700">
                                    ₹ {o.total}
                                </td>
                                <td className="px-4 py-2">
                                    <select
                                        value={o.status}
                                        onChange={(e) => updateStatus(o.id, e.target.value)}
                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminOrders;
