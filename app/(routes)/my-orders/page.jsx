"use client";

import GlobalApi from "@/app/utils/GlobalApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import moment from "moment";
import Myorderitem from "./_compnents/Myorderitem";
import dynamic from "next/dynamic";

function MyOrders() {
  const router = useRouter();
  const [orderList, setOrderList] = useState([]);
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedJwt = sessionStorage.getItem("jwt");
      const storedUser = sessionStorage.getItem("user");

      if (!storedJwt || !storedUser) {
        router.push("/log-in");
        return;
      }

      setJwt(storedJwt);
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  useEffect(() => {
    if (jwt && user) {
      fetchOrders();
    }
  }, [jwt, user]);

  const fetchOrders = async () => {
    try {
      const orderList_ = await GlobalApi.getMyorders(user.id, jwt);
      setOrderList(orderList_);
    } catch (error) {
      setError("Failed to load orders. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamically import html2pdf for client-side PDF generation
  const generateInvoice = async (order) => {
    const html2pdf = (await import("html2pdf.js")).default;

    const invoiceContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
        <img src="/buzzat-logo.png" alt="buzzat Logo" style="display: block; margin: auto; width: 100px; height: auto; margin-bottom: 20px;" />
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
          <div style="width: 45%;">
            <h2 style="font-size: 18px; color: #333; margin-bottom: 10px;">Customer Details</h2>
            <p><strong>Name:</strong> ${order?.firstname || "N/A"}</p>
            <p><strong>Email:</strong> ${order?.email || "N/A"}</p>
            <p><strong>Address:</strong> ${order?.address}, ${
      order?.pincode || "N/A"
    }</p>
          </div>
          <div style="width: 45%; text-align: right;">
            <h2 style="font-size: 18px; color: #333; margin-bottom: 10px;">Vendor Details</h2>
            <p><strong>Name:</strong> ${
              order?.vendorName || "Shree Krishna General Store"
            }</p>
            <p><strong>GSTIN:</strong> ${order?.vendorGST || "XXXXXXXXXXX"}</p>
            <p><strong>FSSAI:</strong> ${
              order?.vendorFSSAI || "XXXXXXXXXXX"
            }</p>
          </div>
        </div>
        <div style="margin-bottom: 5px;">
          <h3>Order Summary</h3>
          <p><strong>Order Date:</strong> ${moment(order?.createdAt).format(
            "DD-MM-YYYY"
          )}</p>
          <p><strong>Order ID:</strong> ${order?.id}</p>
          <p><strong>Total Amount:</strong> ₹${order?.totalOrderValue}</p>
                    <p style="font-size: 10px; color: #999;">Total Amount is inclusive of all taxes and handling charges if applicable.</p>

        </div>
        <div>
          <h3 style="margin-bottom: 10px;">Products</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
            <thead>
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 8px; text-align: left;">Product Name</th>
                <th style="padding: 8px; text-align: center;">Price</th>
                <th style="padding: 8px; text-align: center;">Quantity</th>
                <th style="padding: 8px; text-align: center;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order?.Orderitemlist.map(
                (item) => `
                <tr>
                  <td style="padding: 8px;">${
                    item?.product?.data?.attributes?.name
                  }</td>
                  <td style="padding: 8px; text-align: center;">₹${
                    item.product.data.attributes.sellingPrice
                  }</td>
                  <td style="padding: 8px; text-align: center;">${
                    item?.quantity
                  }</td>
                  <td style="padding: 8px; text-align: center;">₹${
                    item?.quantity * item.product.data.attributes.sellingPrice
                  }</td>
                </tr>`
              ).join("")}
            </tbody>
          </table>
        </div>
        <footer style="margin-top: 20px; text-align: center;">
          Thank you for ordering from buzzat!
        </footer>
      </div>
    `;

    const options = {
      margin: 1,
      filename: `Invoice-${order.id}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(invoiceContent).set(options).save();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
        <p className="text-green-600 mt-4 font-semibold">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <>

    <Head>
        <title>My Orders | buzzat</title>
        <meta
          name="description"
          content="View your order history and download invoices."
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8540952826970534"
     crossorigin="anonymous"></script>
    </Head>
      <h2 className="p-4 bg-primary mt-[3rem] sm:mt-0 text-xl sm:text-2xl text-white font-bold text-center">
        My Orders
      </h2>
      <div className="container mx-auto py-6 px-4 sm:px-8 md:px-20">
        <h2 className="text-2xl md:text-3xl font-bold text-primary pb-6 md:pb-10">
          Order History
        </h2>
        <div className="space-y-6">
          {orderList.length > 0 ? (
            orderList
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((item, index) => (
                <Collapsible
                  key={index}
                  className="w-full mx-auto overflow-hidden"
                >
                  <CollapsibleTrigger>
                    <div className="border border-slate-200 w-full rounded-lg shadow-md p-4 flex flex-row sm:items-center justify-between gap-4 bg-white hover:shadow-lg transition">
                      <h2>
                        <span className="font-bold text-gray-700">
                          Order Date:
                        </span>{" "}
                        {moment(item?.createdAt).format("DD-MM-YYYY")}
                      </h2>
                      <h2>
                        <span className="font-bold text-gray-700">Total:</span>{" "}
                        ₹{item?.totalOrderValue}
                      </h2>
                      <span
                        className={`py-1 px-3 rounded-md ${
                          item?.status === "Completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-500"
                        }`}
                      >
                        {item?.status}
                      </span>
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        onClick={() => generateInvoice(item)}
                      >
                        Download Invoice
                      </button>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-gray-50 border border-slate-200 rounded-lg p-4 mt-2">
                      {item?.Orderitemlist.map((order, index_) => (
                        <Myorderitem orderitem={order} key={index_} />
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
          ) : (
            <p className="text-center text-gray-600 font-medium">
              No orders found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default MyOrders;
