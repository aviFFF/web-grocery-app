"use client";
import { useState } from "react";
import { vendorLogin } from "@/app/utils/GlobalApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const VendorLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [token, setToken] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await vendorLogin(formData.email, formData.password);
      console.log("Login Success:", response.data);
      setToken(response.data.jwt); // Save JWT token
      toast("Login successful!");
      router.push("/vendor-order");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      toast("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-blue-50">
      <form
        className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Vendor Login
        </h1>
        <Link href="/">
          <Image
            src="/newblogo.png"
            className="rounded-2xl md:w-32 w-24"
            alt="logo"
            width={100}
            height={50}
          />
        </Link>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
        <p className="mt-4 text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <a href="/vendor-signup" className="text-blue-500 hover:underline">
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
};

export default VendorLogin;
