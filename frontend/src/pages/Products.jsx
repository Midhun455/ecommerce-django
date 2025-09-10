import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useCart } from "../context/Cartcontext";

function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("products/")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`products/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Product deleted successfully!");
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err.message);
      alert("❌ Failed to delete product.");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      alert("✅ Added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data || err.message);
      const message =
        err.response?.data?.product?.[0] ||
        err.response?.data?.quantity?.[0] ||
        "Failed to add to cart.";
      alert(`❌ ${message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-8">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition transform text-center"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-52 object-cover rounded-md"
            />
            <h3 className="mt-3 text-lg font-semibold text-gray-800">{p.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{p.description}</p>
            <p className="font-medium text-gray-800 mt-2">₹{p.price}</p>
            <p className="text-sm text-gray-500">Available - {p.stock}</p>

            {p.owner === localStorage.getItem("username") ? (
              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => navigate(`/edit-product/${p.id}`)}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  🖋️ Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  🗑️ Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddToCart(p.id)}
                className="mt-3 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
