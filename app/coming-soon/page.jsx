"use client"
import Link from "next/link";
import React, { useState, useEffect } from "react";

const ComingSoon = () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7); // Set launch date 7 days from now

  const calculateTimeLeft = () => {
    const difference = targetDate - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
      <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-2xl p-10 text-center max-w-md">
        <h1 className="text-4xl font-extrabold tracking-tight">We're Coming Soon 🚀</h1>
        <p className="mt-3 text-gray-300 text-lg">Stay tuned for something amazing!</p>

        {/* Countdown Timer */}
        <div className="flex justify-center gap-4 mt-6 text-2xl font-bold">
          <div className="flex flex-col items-center">
            <span className="text-5xl">{timeLeft.days}</span>
            <span className="text-sm text-gray-400">Days</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl">{timeLeft.hours}</span>
            <span className="text-sm text-gray-400">Hours</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl">{timeLeft.minutes}</span>
            <span className="text-sm text-gray-400">Minutes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl">{timeLeft.seconds}</span>
            <span className="text-sm text-gray-400">Seconds</span>
          </div>
        </div>

        {/* Email Subscription */}
        <div className="mt-6">
          <Link className="text-blue-500 hover:underline" href='/'>
          <button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">Homepage</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
