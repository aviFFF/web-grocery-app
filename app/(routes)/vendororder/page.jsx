"use client";
import GlobalApi from "@/app/utils/GlobalApi"; // Assuming this is the path
import Image from "next/image";
import { useState, useEffect } from "react";

function VendorOrderHistory() {
  const [orderList, setOrderList] = useState([]);
  const [pincode, setPincode] = useState(""); // State for pincode filter
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Initially not loading
  const vendorId = 1; // Example vendor ID, replace with actual vendor ID
  const jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMzNTYxOTYzLCJleHAiOjE3MzYxNTM5NjN9.QVc8ez4dzRE307VdWEA_IczEp7dQQtFCCechltbEfvw"; // Example JWT token, replace with actual token

  // Fetch vendor orders when the button is clicked
  const fetchVendorOrders = async () => {
    if (!pincode) {
      setError("Please enter a pincode.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const orders = await GlobalApi.getVendorOrders(vendorId, pincode, jwt);
      setOrderList(orders);
    } catch (err) {
      console.error("Error fetching vendor orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 mx-auto max-w-4xl">
      <h2 className="text-3xl font-semibold text-center text-primary mb-6">Vendor Order History</h2>
      
      <div className="flex items-center justify-center mb-6">
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
          className="p-2 border rounded-lg shadow-md w-60 sm:w-80 mr-4"
        />
        <button
          onClick={fetchVendorOrders}
          className="bg-primary text-white p-2 rounded-lg shadow-md hover:bg-primary-dark transition duration-300"
        >
          Get Orders
        </button>
      </div>

      {/* Display loading spinner if data is being fetched */}
      {isLoading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-primary"></div>
          <span className="text-primary font-semibold">Loading...</span>
        </div>
      )}

      {/* Display error message */}
      {error && <div className="text-red-600 text-center font-semibold">{error}</div>}

      {/* Display order list */}
      <div className="space-y-6">
        {orderList.length > 0 ? (
          orderList.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
              <h3 className="text-xl font-semibold text-primary">Order Date: {order.createdAt}</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="text-lg text-gray-700">Total: ₹{order.totalOrderValue}</p>
                <p
                  className={`text-sm font-semibold py-1 px-3 rounded-md ${
                    order.status === "Completed" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.status}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-gray-700"><strong>Customer:</strong> {order.firstname} {order.lastname}</p>
                <p className="text-gray-700"><strong>Email:</strong> {order.email}</p>
                <p className="text-gray-700"><strong>Phone:</strong> {order.phone}</p>
                <p className="text-gray-700"><strong>Address:</strong> {order.address}, Pincode: {order.pincode}</p>
              </div>

              {/* You can display the order items here, such as */}
              <div className="mt-4">
                <h4 className="font-semibold text-lg text-primary">Items</h4>
                {order.Orderitemlist.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center">
                      <Image
                        width={50}
                        height={50}
                        src={item.product.data.attributes.image.data[0].attributes.url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <span className="ml-4">{item.product.name}</span>
                    </div>
                    <span className="text-gray-600">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 font-medium">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default VendorOrderHistory;
