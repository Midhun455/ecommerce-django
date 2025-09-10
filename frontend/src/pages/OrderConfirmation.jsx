const OrderConfirmation = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          🎉 Thank you! Your order has been placed.
        </h2>
        <p className="text-gray-700">
          You will receive an email confirmation shortly.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
