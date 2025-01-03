"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GlobalApi from "@/app/utils/GlobalApi";

const ResetPassword = () => {
  const searchParams = useSearchParams();  // Extract query params from URL
  const router = useRouter();
  
  const [code, setCode] = useState("");  // Store the reset token
  const [password, setPassword] = useState("");  // New password
  const [confirmPassword, setConfirmPassword] = useState("");  // Password confirmation
  const [loading, setLoading] = useState(false);

  // When the component mounts, extract the 'code' from the URL
  useEffect(() => {
    const resetCode = searchParams.get("code");  // Extract 'code' from query params
    if (resetCode) {
      setCode(resetCode);  // Store the reset token
    } else {
      toast("Invalid reset link!");  // In case the code is not present
      router.push("/forgot-password");  // Redirect to forgot password
    }
  }, [searchParams, router]);

  const handleResetPassword = async () => {
    if (!password || password !== confirmPassword) {
      toast("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // Send the reset request with the reset code and new password
      await GlobalApi.ResetPassword(code, password, confirmPassword);
      toast("Password reset successful! You can now log in.");
      router.push("/login");
    } catch (error) {
      toast(error.response?.data?.message || "Failed to reset password.");
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

export default ResetPassword;
