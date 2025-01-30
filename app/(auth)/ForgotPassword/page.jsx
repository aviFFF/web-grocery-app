"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GlobalApi from "@/app/utils/GlobalApi";

const meta = {
  title: "Forgot Password",
  description: "Forgot your password",
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      await GlobalApi.handleForgotPassword(email);
      toast("Password reset email sent! Please check inbox.");
    } catch (error) {
      toast(error.response?.data?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-20">
      <div className="flex flex-col items-center justify-center md:p-10 p-5 gap-4 bg-slate-100 border border-gray-200">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-sm text-gray-500 mb-4">
          Enter your email to receive a password reset link.
        </p>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleForgotPassword} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
