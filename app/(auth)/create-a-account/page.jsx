"use client";
import GlobalApi from "@/app/utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null); // Store CAPTCHA token
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handle reCAPTCHA change event
  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, [router]);

  // Function to create the account
  const onCreateAccount = async () => {
    if (!captchaToken) {
      toast("Please complete the CAPTCHA verification.");
      return;
    }

    setLoading(true);

    try {
      // Verify CAPTCHA before proceeding with registration
      console.log("Verifying CAPTCHA...");
      await GlobalApi.verifyCaptcha(captchaToken);
      console.log("CAPTCHA Verified.");

      // Call the registration API
      console.log("Registering User...");
      const resp = await GlobalApi.registeruser(username, email, password, name);
      console.log("Registration Response:", resp);

      // Store user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(resp.data.user));
      sessionStorage.setItem("jwt", resp.data.jwt);

      // Show success message and redirect to homepage
      toast("Account successfully created!");
      router.push("/");

    } catch (error) {
      console.error("Error during account creation:", error.message);

      if (error.response) {
        // Display backend error messages
        toast(error.response.data.message || "Please Enter Valid Details");
      } else {
        // Handle network or unknown errors
        toast("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-20">
      <div className="flex flex-col items-center justify-center md:p-10 p-1 md:w-auto w-screen bg-slate-100 border border-gray-200">
        <Link href="/">
          <Image
            src="/newblogo.png"
            className="rounded-2xl md:w-32 w-24"
            alt="logo"
            width={100}
            height={50}
          />
        </Link>
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <h2 className="text-sm text-gray-500">
          Enter Your Details to Create an Account
        </h2>
        <div className="w-full flex flex-col gap-5 mt-8">
          <Input
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Input
            placeholder="Mobile Number"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            maxLength={10}
          />
          <Input
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          
          {/* reCAPTCHA Component */}
          <ReCAPTCHA
            sitekey="6LeOTZQqAAAAAHF62ZAdRx1rTS28sigTRSDtH_tn" // Replace with your actual site key
            onChange={onCaptchaChange}
          />
          
          <Button
            onClick={onCreateAccount}
            disabled={!username || !email || !password || !name || !captchaToken || loading}
          >
            {loading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              "Create an Account"
            )}
          </Button>
          <p>
            Already have an account?
            <Link href="/log-in" className="text-blue-500">
              {" "}
              Click here to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
