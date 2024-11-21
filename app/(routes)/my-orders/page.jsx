"use client";
import GlobalApi from "@/app/utils/GlobalApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import moment from "moment";
import Myorderitem from "./_compnents/Myorderitem";


function MyOrders() {
    const jwt = sessionStorage.getItem('jwt');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const router = useRouter();
    const [orderList, setOrderList] = useState([]);
    useEffect(() => {
        if (!jwt) {
            router.push('/log-in')
        };
        getMyorders();
    }, []);

    const getMyorders = async () => {
        const orderList_ = await GlobalApi.getMyorders(user.id, jwt);
        console.log(orderList_);
        setOrderList(orderList_);
    }
    return (
        <>
           <h2 className="p-4 bg-primary text-xl sm:text-2xl text-white font-bold text-center">
    My Orders
</h2>

<div className="py-6 px-4 sm:px-8 md:px-20">
    <h2 className="text-2xl md:text-3xl font-bold text-primary pb-6 md:pb-10">
        Order History
    </h2>
    <div className="space-y-6">
        {orderList.map((item, index) => (
            <Collapsible key={index}>
                {/* Collapsible Trigger */}
                <CollapsibleTrigger>
                    <div className="border border-slate-200 rounded-lg shadow-md p-4 flex flex-row sm:flex-row sm:items-center sm:justify-between gap-4 bg-white hover:shadow-lg transition">
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
                                className={`${
                                    item?.status === "Completed"
                                        ? "text-green-600"
                                        : "text-yellow-500"
                                } font-semibold`}
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