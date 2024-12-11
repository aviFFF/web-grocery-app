"use client";
import { useEffect, useState } from "react";
import { fetchVendorOrders } from "@/app/utils/GlobalApi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const VendorOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to play notification sound
  const playNotificationSound = () => {
    const audio = new Audio('/noti-sound.mp3'); // Ensure the path is correct
    audio.play();
  };

  useEffect(() => {
    const token = Cookies.get("token"); // Get token from cookies

    if (!token) {
      console.error("Token is missing"); // Debugging line
      router.push("/vendor-login"); // Redirect to login if no token
      return;
    }


    const fetchOrders = async () => {
      try {
        const response = await fetchVendorOrders();
        console.log("Orders fetched:", response.data);

        const ordersArray = response.data?.data || [];

        // Sort orders by ID in descending order (latest order first)
        const sortedOrders = ordersArray.sort((a, b) => b.id - a.id);

        // Check if the first order in the sorted array is new (compared to previous orders)
        if (orders.length > 0 && orders[0].id !== sortedOrders[0]?.id) {
          playNotificationSound(); // Play sound if new order
        }

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch orders initially
    fetchOrders();

    // Fetch orders every 5 seconds
    const interval = setInterval(fetchOrders, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [orders, router]); // Run the effect when `orders` or `router` changes

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
                  {order.attributes.Orderitemlist?.map((orderItem,idx) => (
                    <div key={idx}>
                    <h4>{orderItem.product?.data?.attributes?.name}</h4>
                    {/* <img 
                      src={orderItem.product?.data?.attributes?.image?.url || '/default-image.jpg'}
                      alt={orderItem.product?.data?.attributes?.name}
                      width={50}
                      height={50}
                    /> */}
                    <p>Price: ₹{orderItem.product?.data?.attributes?.sellingPrice}</p>
                    <p>Quantity: {orderItem.quantity}</p>
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
