"use client";
import { useEffect, useState } from "react";
import { fetchVendorOrders } from "@/app/utils/GlobalApi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { io } from "socket.io-client"; // Import socket.io-client
import {subscribeToPushNotifications} from "@/app/utils/GlobalApi";

const VendorOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState(null);
  const [socket, setSocket] = useState(null); // WebSocket state
  const router = useRouter();


  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };


  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
        } else {
          console.warn("Notification permission denied");
        }
      });
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/vendor/service-worker.js").then((registration) => {
        console.log("Service Worker registered:", registration);
      });
    }
  }, []);
  
  // Function to enable notifications and sound
  const enableNotificationsAndSound = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationsEnabled(true);
          console.log("Notifications enabled");
        } else {
          console.warn("Notifications permission denied");
        }
      });
    } else {
      setNotificationsEnabled(true);
    }
  };

  // Function to play notification sound
  const playNotificationSound = () => {
    const audio = new Audio("/notific.mp3");
    audio.play().catch((err) => {
      console.error("Audio play failed:", err);
    });
  };

  // Function to show browser notification
  const showNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/vendor/vendor-buzzat.png", // Optional: Path to notification icon
      });
    }
  };

  // Logout function
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/vendor");
  };

  // Connect to WebSocket and listen for new orders
  useEffect(() => {
    const token = Cookies.get("token");
    if(!token){
      router.push("/vendor");
    }

    // Initialize WebSocket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL); // Replace with your Strapi server URL
    setSocket(socketInstance);

    // Subscribe to vendor notifications using their ID
    const vendorId = 1; // Replace this with the logged-in vendor's ID
    socketInstance.emit("subscribe", vendorId);

    // Listen for 'new-order' event from the server
    socketInstance.on("new-order", (data) => {
      console.log("New order received:", data);

      // Trigger the notification if permissions are granted
      if (notificationsEnabled) {
        playNotificationSound();
        showNotification("New Order Received", `Order ID: ${data.orderId} - ${data.message}`);
      }

      // Optionally fetch the latest orders if you want to refresh the list on new order
      fetchOrders();
    });

    // Cleanup WebSocket on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [router, notificationsEnabled]);

  const fetchOrders = async () => {
    try {
      const response = await fetchVendorOrders();
      const ordersArray = response.data?.data || [];
      const sortedOrders = ordersArray.sort((a, b) => b.id - a.id);

      // Check for new order and show notification
      if (notificationsEnabled && sortedOrders[0]?.id !== latestOrderId) {
        setLatestOrderId(sortedOrders[0]?.id); // Update latest order ID
        playNotificationSound();
        showNotification(
          "New Order Received",
          `Order ID: ${sortedOrders[0]?.id} - ${sortedOrders[0]?.attributes.firstname} ${sortedOrders[0]?.attributes.lastname}.`
        );
      }

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders initially and every 5 seconds
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, [notificationsEnabled, latestOrderId]); // Dependencies are notifications and latestOrderId

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Dashboard */}
      <header className="flex justify-between items-center bg-gray-800 text-white py-4 px-6 rounded-lg mb-8">
        <div className="text-lg font-semibold">Vendor Dashboard</div>
        <nav className="space-x-4">
        </nav>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      {/* Order History */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Your Order History
      </h1>
      <button
        onClick={enableNotificationsAndSound}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Enable Notifications and Sound
      </button>
      <div className="flex flex-col gap-8">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Order ID: {order.id}
              </h3>
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>
                  <strong>Customer:</strong> {order.attributes.firstname}{" "}
                  {order.attributes.lastname}
                </span>
                <span>
                  <strong>Phone:</strong> {order.attributes.phone}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Address:</strong> {order.attributes.address} -{" "}
                {order.attributes.pincode}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Total Value:</strong> ₹{order.attributes.totalOrderValue}
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Order Date:</strong>{" "}
                {new Date(order.attributes.createdAt).toLocaleString()}
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Products:
                </h4>
                <div className="space-y-4">
                  {order.attributes.Orderitemlist?.map((orderItem, idx) => (
                    <div key={idx}>
                      <h4>{orderItem.product?.data?.attributes?.name}</h4>
                      <p>
                        Price: ₹{orderItem.product?.data?.attributes?.sellingPrice}
                      </p>
                      <p>Quantity: {orderItem.quantity}</p>
                      <p>Payment Mode: {order.attributes.paymentid}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${
                    order.attributes.Status === "Pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
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
