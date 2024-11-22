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

    useEffect(() => {
        // Ensure this only runs on the client
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
            getMyOrders();
        }
    }, [jwt, user]);

    const getMyOrders = async () => {
        const orderList_ = await GlobalApi.getMyorders(user.id, jwt);
        console.log(orderList_);
        setOrderList(orderList_);
    };

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
                    {orderList.map((item, index) => (
                        <Collapsible key={index} className="w-full max-w-[800px] mx-auto overflow-hidden">
                            {/* Collapsible Trigger */}
                            <CollapsibleTrigger>
                                <div className="border border-slate-200 w-full rounded-lg shadow-md p-4 flex flex-row sm:flex-row sm:items-center sm:justify-between gap-4 bg-white hover:shadow-lg transition">
                                    <h2 className="text-sm sm:text-base">
                                        <span className="font-bold text-gray-700">Order Date:</span>{" "}
                                        {moment(item?.createdAt).format("DD-MM-YYYY")}
                                    </h2>
                                    <h2 className="text-sm sm:text-base">
                                        <span className="font-bold text-gray-700">Total Amount:</span>{" "}
                                        ${item?.totalOrderValue}
                                    </h2>
                                    <h2 className="text-sm sm:text-base">
                                        <span className="font-bold text-gray-700">Status:</span>{" "}
                                        <span
                                            className={`text-sm sm:text-base font-semibold text-center py-1 px-3 rounded-md ${
                                                item?.status === "Completed"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-500"
                                            } w-[100px]`}
                                        >
                                            {item?.status}
                                        </span>
                                    </h2>
                                </div>
                            </CollapsibleTrigger>

                            {/* Collapsible Content */}
                            <CollapsibleContent>
                                <div className="bg-gray-50 border border-slate-200 rounded-lg p-4 mt-2">
                                    {item?.Orderitemlist.map((order, index_) => (
                                        <Myorderitem orderitem={order} key={index_} />
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            </div>
        </>
    );
}

export default MyOrders;
