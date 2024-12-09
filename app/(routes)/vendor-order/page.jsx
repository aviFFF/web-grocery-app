"use client";
import { useEffect, useState } from "react";
import { fetchVendorOrders } from "@/app/utils/GlobalApi";
import { useRouter } from "next/navigation";

const VendorOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const playNotificationSound = () => {
    const audio = new Audio('/rooster-233738.mp3'); // Ensure the path is correct
    audio.play();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/vendor-login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetchVendorOrders();
        console.log("Orders fetched:", response.data);

        const ordersArray = response.data?.data || [];

        // Sort orders by ID in descending order (latest order first)
        const sortedOrders = ordersArray.sort((a, b) => b.id - a.id);

        // Check for new orders
        if (orders.length > 0 && orders[0].id !== sortedOrders[0]?.id) {
          playNotificationSound();
        }

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(); // Fetch once on load

    // Fetch orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);

    // Clean up the interval
    return () => clearInterval(interval);
  }, [orders, router]); // Depend on orders and router to track updates

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
                <strong>Order Date:</strong> {new Date(order.attributes.createdAt).toLocaleString()}
              </div>

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
