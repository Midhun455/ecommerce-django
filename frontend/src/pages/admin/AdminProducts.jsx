// src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function AdminProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/products/") // backend endpoint
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    const deleteProduct = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/products/${id}/`)
            .then(() => setProducts(products.filter(p => p.id !== id)))
            .catch(err => console.error(err));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                        <th className="py-2 px-4 text-left">Image</th>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4">Price</th>
                        <th className="py-2 px-4">Stock</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id} className="border-t">
                            <td className="py-2 px-4">
                                <img
                                    src={p.image || "https://via.placeholder.com/80"} // fallback image
                                    alt={p.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                            </td>
                            <td className="py-2 px-4">{p.name}</td>
                            <td className="py-2 px-4">₹{p.price}</td>
                            <td className="py-2 px-4">{p.stock}</td>
                            <td className="py-2 px-4 space-x-2">
                                <Link
                                    to={`/admin/products/edit/${p.id}`}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => deleteProduct(p.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminProducts;
