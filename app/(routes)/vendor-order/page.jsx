"use client";
import { use, useEffect, useState } from "react";
import { fetchVendorOrders } from "@/app/utils/GlobalApi";

// Function to play a notification sound
const playNotificationSound = () => {
  const audio = new Audio("/Chin_Tapak_Dum_Dum.mp3"); // Path to your notification sound file
  audio.play();
};

const VendorOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchVendorOrders();
        console.log("Orders fetched:", response.data);
        
        // Sort orders by 'createdAt' in descending order
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
        );
        
        // Check if there are new orders and play notification
        if (sortedOrders.length > orders.length) {
          playNotificationSound();
        }

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

   
    // Fetch orders immediately
    fetchOrders();

    // Set interval to fetch orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);

    return () => {
      clearInterval(interval); // Clean up interval on component unmount
    };
  }, [orders]); // Re-run the effect if orders change

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Your Order History</h1>
      
      <div className="flex flex-col gap-8">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Order ID: {order.id}</h3>
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span><strong>Customer:</strong> {order.attributes.firstname} {order.attributes.lastname}</span>
                <span><strong>Phone:</strong> {order.attributes.phone}</span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Address:</strong> {order.attributes.address} - {order.attributes.pincode}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Total Value:</strong> ₹{order.attributes.totalOrderValue}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Order Date:</strong> {new Date(order.attributes.createdAt).toLocaleDateString()}
              </div>

              {/* Display Product Details */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Products:</h4>
                <div className="space-y-4">
                  {order.attributes.products && order.attributes.products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-16 h-16 object-cover rounded-md" 
                      />
                      <div className="text-sm text-gray-600">
                        <p><strong>{product.name}</strong></p>
                        <p>₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className={`px-3 py-1 text-xs rounded-full font-semibold ${order.attributes.Status === 'Pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                  {order.attributes.Status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-6">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default VendorOrderHistory;
