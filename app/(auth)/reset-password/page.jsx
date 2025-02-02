"use client"; // Ensure this component runs only on the client side

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GlobalApi from "@/app/utils/GlobalApi";

const meta = {
    title: "Reset Password",
    description: "Reset your password",
    };

const ResetPasswordForm = () => {
  const searchParams = useSearchParams(); // Extract query params from URL
  const router = useRouter();

  const [code, setCode] = useState(""); // Store reset token
  const [password, setPassword] = useState(""); // New password
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password
  const [loading, setLoading] = useState(false);

  // Extract 'code' from URL when the component mounts
  useEffect(() => {
    const resetCode = searchParams?.get("code");
    if (resetCode) {
      setCode(resetCode);
    } else {
      toast.error("Invalid reset link!");
      router.push("/ForgotPassword");
    }
  }, [searchParams, router]);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please enter a new password.");
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
  
    setLoading(true);
    try {
      await GlobalApi.ResetPassword(code, password, confirmPassword);
      toast.success("Password reset successful! You can now log in.");
      router.push("/log-in");
    } catch (error) {
      toast.error(error.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center my-20">
      <div className="flex flex-col items-center justify-center md:p-10 p-5 bg-slate-100 border border-gray-200">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button onClick={handleResetPassword} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </div>
  );
};

// Wrap the page in a Suspense boundary to avoid hydration errors
const ResetPassword = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
};

export default ResetPassword;
