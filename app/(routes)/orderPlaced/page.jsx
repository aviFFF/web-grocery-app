// OrderSuccess.js
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Head from 'next/head';

const OrderSuccess = () => {
    const router = useRouter();
    const handleGoHome = () => {
        router.replace('/my-orders');
    };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Order Placed Successfully</title>
        <meta
          name="description"
          content="Thank you for your purchase. Your order is being processed."
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8540952826970534"
     crossorigin="anonymous"></script>
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg">
        <h1 className="text-3xl font-bold mb-4 animate-bounce">Order Placed Successfully!</h1>
        <p className="mb-4">Thank you for your purchase. Your order is being processed.</p>
        <p className="mb-6">You will receive a confirmation email shortly.</p>
        <Button className="bg-primary text-white" onClick={handleGoHome}>
          Track Your Order
        </Button>
      </div>
    </div>
  );
};

export default OrderSuccess;
