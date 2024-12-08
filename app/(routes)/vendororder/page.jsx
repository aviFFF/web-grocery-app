"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GlobalApi from "@/app/utils/GlobalApi";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import moment from "moment";

function VendorOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    const vendor = sessionStorage.getItem("vendor");

    if (!jwt || !vendor) {
      router.push("/vendor/login");
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const jwt = sessionStorage.getItem("jwt");
    const vendor = JSON.parse(sessionStorage.getItem("vendor"));

    try {
      const response = await GlobalApi.getVendorOrders(vendor.id, jwt);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="p-4 bg-primary text-xl text-white font-bold">Vendor Order History</h2>
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Collapsible key={order.id}>
              <CollapsibleTrigger>
                <div className="p-4 border rounded shadow">
                  <h2>
                    Order Date: {moment(order.createdAt).format("DD-MM-YYYY")}
                    <span className="ml-4">Total: ₹{order.totalOrderValue}</span>
                  </h2>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <p>{item.product.name} - {item.quantity} pcs</p>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default VendorOrderHistory;
