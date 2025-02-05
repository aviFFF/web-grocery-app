"use client";
import { useEffect, useState } from "react";
import { fetchVendorOrders, updateOrderStatus } from "@/app/utils/GlobalApi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import InvoiceTemplate from "../../_components/InvoiceTemplate";
import { messaging, getToken, onMessage } from "@/app/utils/vfirebase";


const VendorOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => console.log("Service Worker registered:", registration))
        .catch((error) => console.error("Service Worker registration failed:", error));
    }
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");

        // Get Firebase Token
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_PUBLIC_KEY,
        });

        if (token) {
          console.log("FCM Token:", token);
          Cookies.set("fcm_token", token, { expires: 365 });
        }
      } else {
        console.warn("Notification permission denied.");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };



  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Foreground Notification Received:", payload);
      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/vendor/vendor-buzzat.png",
        });
      }
    });
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/vendor"); // Redirect to login page
  };
  

  const fetchOrders = async () => {
    try {
      const response = await fetchVendorOrders();
      const ordersArray = response.data?.data || [];
      const sortedOrders = ordersArray.sort((a, b) => b.id - a.id);

      // Check for new order and show notification
      if (notificationsEnabled && sortedOrders[0]?.id !== latestOrderId) {
        setLatestOrderId(sortedOrders[0]?.id);
        playNotificationSound();
        showNotification(
          "New Order Received",
          `Order ID: ${sortedOrders[0]?.id} - ${sortedOrders[0]?.attributes.firstname} ₹${sortedOrders[0]?.attributes.totalOrderValue}.`
        );
      }

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/vendor");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [notificationsEnabled, latestOrderId]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center bg-gray-800 text-white py-4 px-6 rounded-lg mb-8">
        <div className="text-lg font-semibold">Vendor Dashboard</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </header>

      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Your Order History
      </h1>
      <button
        onClick={requestNotificationPermission}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Enable Notifications and Sound
      </button>
      <div className="flex flex-col gap-8">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Order ID: {order.id}
              </h3>
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>
                  <strong>Customer:</strong> {order.attributes.firstname}
                </span>
                <span>
                  <strong>Phone:</strong> {order.attributes.phone}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <strong>Address:</strong>{" "}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    order.attributes.address
                  )},${encodeURIComponent(order.attributes.pincode)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {order.attributes.address} - {order.attributes.pincode}
                </a>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        order.attributes.address
                      )},${encodeURIComponent(order.attributes.pincode)}`,
                      "_blank"
                    )
                  }
                  className="ml-4 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Open in Google Maps
                </button>
              </div>

              <div className="text-sm text-gray-600 mb-3">
                <strong>Total Value:</strong> ₹
                {order.attributes.totalOrderValue}
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
                        Price: ₹
                        {orderItem.product?.data?.attributes?.sellingPrice}
                      </p>
                      <p>Quantity: {orderItem.quantity}</p>
                      <p>Payment Mode: {order.attributes.paymentid}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between gap-8 items-center mt-4">
                <InvoiceTemplate
                  order={{
                    id: order.id,
                    invoiceNumber: `INV-${order.id}`,
                    invoiceDate: order.attributes.createdAt,
                    customerName: `${order.attributes.firstname}`,
                    customerAddress: `${order.attributes.address}, ${order.attributes.pincode}`,
                    items: order.attributes.Orderitemlist.map((item) => ({
                      description:
                        item.product?.data?.attributes?.name || "Unknown",
                      mrp: item.product?.data?.attributes?.sellingPrice || 0,
                      discount: 0, // Add discount logic if available
                      quantity: item.quantity || 1,
                      taxableValue:
                        item.product?.data?.attributes?.sellingPrice || 0,
                      cgst: 0, // Add tax logic if available
                      sgst: 0, // Add tax logic if available
                      total: item.product?.data?.attributes?.sellingPrice || 0,
                    })),
                  }}
                />
                <div className="mt-4">
                  <label
                    htmlFor={`status-${order.id}`}
                    className="text-gray-600"
                  >
                    Update Status:
                  </label>
                  <select
                    id={`status-${order.id}`}
                    value={order.attributes.Status}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, e.target.value)
                    }
                    className="ml-2 border border-gray-300 rounded-lg px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="On the Way">On the Way</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default VendorOrderHistory;
