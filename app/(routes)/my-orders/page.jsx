"use client";
import GlobalApi from "@/app/utils/GlobalApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import moment from "moment";
import Myorderitem from "./_compnents/Myorderitem";

function MyOrders() {
    const router = useRouter();
    const [orderList, setOrderList] = useState([]);
    const [jwt, setJwt] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loader state
    const [error, setError] = useState(null); // Error state

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
            console.error("Error fetching orders:", error);
            setError("Failed to load orders. Please try again later.");
        } finally {
            setIsLoading(false); // Stop loader after fetching
        }
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
            <h2 className="p-4 bg-primary mt-10 sm:mt-0 text-xl sm:text-2xl text-white font-bold text-center">
                My Orders
            </h2>

            <div className="py-6 px-4 sm:px-8 md:px-20">
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
                                        <div className="border border-slate-200 w-full rounded-lg shadow-md p-4 flex flex-row sm:flex-row sm:items-center sm:justify-between gap-4 bg-white hover:shadow-lg transition">
                                            <h2 className="text-sm sm:text-base">
                                                <span className="font-bold text-gray-700">Order Date:</span>{" "}
                                                {moment(item?.createdAt).format("DD-MM-YYYY")}
                                            </h2>
                                            <h2 className="text-sm sm:text-base">
                                                <span className="font-bold text-gray-700">Total Amount:</span>{" "}
                                                ₹{item?.totalOrderValue}
                                            </h2>
                                            <h2 className="text-sm sm:text-base">
                                                <span className="font-bold text-gray-700"></span>{" "}
                                                <span
                                                    className={`text-sm sm:text-base font-semibold text-center py-1 px-3 rounded-md ${item?.status === "Completed"
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-yellow-100 text-yellow-500"
                                                        } w-[100px]`}
                                                >
                                                    {item?.status}
                                                </span>
                                            </h2>
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
