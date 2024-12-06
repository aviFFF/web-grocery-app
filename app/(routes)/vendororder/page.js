"use client";
import GlobalApi from "@/app/utils/GlobalApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import moment from "moment";

function VendorOrders() {
    const router = useRouter();
    const [orderList, setOrderList] = useState([]);
    const [jwt, setJwt] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedJwt = sessionStorage.getItem("jwt");
        const storedVendor = sessionStorage.getItem("vendor");
        if (!storedJwt || !storedVendor) {
            router.push("/log-in");
            return;
        }
        setJwt(storedJwt);
        setVendor(JSON.parse(storedVendor));
    }, [router]);

    useEffect(() => {
        if (jwt && vendor) {
            fetchVendorOrders();
        }
    }, [jwt, vendor]);

    const fetchVendorOrders = async () => {
        try {
            const orderList_ = await GlobalApi.getVendorOrders(vendor.id, jwt);
            setOrderList(orderList_);
        } catch (error) {
            console.error("Error fetching vendor orders:", error);
            setError("Failed to load vendor orders. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                <p className="text-blue-600 mt-4 font-semibold">Loading orders...</p>
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
        <div className="container mx-auto py-6 px-4 sm:px-8 md:px-20">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Vendor Orders</h1>
            {orderList.length > 0 ? (
                <div className="space-y-4">
                    {orderList
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((item, index) => (
                            <div
                                key={index}
                                className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-sm sm:text-lg font-bold">
                                            Order Date:{" "}
                                            <span className="text-gray-600">
                                                {moment(item?.createdAt).format("DD-MM-YYYY")}
                                            </span>
                                        </h2>
                                        <h2 className="text-sm sm:text-lg font-bold">
                                            Customer Name:{" "}
                                            <span className="text-gray-600">{item?.customerName}</span>
                                        </h2>
                                    </div>
                                    <span
                                        className={`text-sm sm:text-base font-semibold py-1 px-3 rounded-md ${item?.status === "Completed"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-yellow-100 text-yellow-500"
                                            }`}
                                    >
                                        {item?.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 font-medium">No orders found.</p>
            )}
        </div>
    );
}

export default VendorOrders;
