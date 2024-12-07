"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VendorLogin() {
  const [userid, setUserid] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!userid || !pincode) {
      setError("Please provide both User ID and Pincode.");
      return;
    }

    // Save to session storage (can be replaced with proper auth)
    sessionStorage.setItem("vendorUserid", userid);
    sessionStorage.setItem("vendorPincode", pincode);

    router.push("/vendororder");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-md shadow-md max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-primary">
          Vendor Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            User ID
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Pincode
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark disabled:bg-green-100"
          disabled={!userid || !pincode}
        >
          Login
        </button>
      </form>
    </div>
  );
}
