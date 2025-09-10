import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to Minimal Shop 🛒
      </h2>
      <p className="text-gray-600 mb-6">
        Your one-stop store for awesome products at fair prices.
      </p>
      <Link to="/products">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition duration-300">
          Shop Now →
        </button>
      </Link>
    </div>
  );
}

export default Home;
