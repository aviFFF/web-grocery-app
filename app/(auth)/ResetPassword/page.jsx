// "use client"; // Ensure this is a client component
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import GlobalApi from "@/app/utils/GlobalApi";

// const ResetPassword = () => {
//   const [code, setCode] = useState(""); // Store reset token
//   const [password, setPassword] = useState(""); // New password
//   const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password
//   const [loading, setLoading] = useState(false);

//   const searchParams = useSearchParams(); // Use query params
//   const router = useRouter(); // For navigation

//   useEffect(() => {
//     // Extract 'code' from query parameters
//     const resetCode = searchParams?.get("code"); // Check for query param
//     if (resetCode) {
//       setCode(resetCode); // Store the reset token
//     } else {
//       toast.error("Invalid reset link!"); // Show error for missing code
//       router.push("/forgot-password"); // Redirect to forgot password
//     }
//   }, [searchParams, router]);

//   const handleResetPassword = async () => {
//     if (!password || password !== confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Send reset password request
//       await GlobalApi.ResetPassword({ code, password });
//       toast.success("Password reset successful! You can now log in.");
//       router.push("/login"); // Redirect to login
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to reset password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center my-20">
//       <div className="flex flex-col items-center justify-center md:p-10 p-5 bg-slate-100 border border-gray-200">
//         <h1 className="text-3xl font-bold">Reset Password</h1>
//         <Input
//           type="password"
//           placeholder="New Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//         />
//         <Button onClick={handleResetPassword} disabled={loading}>
//           {loading ? "Resetting..." : "Reset Password"}
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
