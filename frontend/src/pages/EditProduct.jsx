import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState("");

    // Fetch product details
    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/products/${id}/`)
            .then((res) => {
                setFormData({
                    name: res.data.name,
                    description: res.data.description,
                    price: res.data.price,
                    stock: res.data.stock,
                });
            })
            .catch((err) => console.error("❌ Fetch product error:", err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("stock", formData.stock);
        if (image) {
            data.append("image", image);
        }

        try {
            await axios.patch(`http://localhost:8000/api/products/${id}/`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMessage("✅ Product updated successfully!");
            navigate("/products");
        } catch (error) {
            console.error("❌ Update error:", error.response?.data || error);
            setMessage("❌ Failed to update product.");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-gray-50 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                ✏️ Edit Product
            </h2>

            {message && (
                <p
                    className={`text-center font-semibold mb-4 ${message.includes("✅") ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-y min-h-[100px] focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-green-600 hover:file:bg-green-700 cursor-pointer"
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
