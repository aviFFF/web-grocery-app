"use client";
import GlobalApi from "@/app/utils/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";

function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loder, setLoder] = useState(false);
  const [name, setName] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const router = useRouter();

  // Handles CAPTCHA token change
  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, []);

  // Create account function
  const onCreateAccount = async () => {
    if (!captchaToken) {
        toast("Please complete the CAPTCHA verification.");
        return;
    }

    setLoder(true);

    try {
        // Verify CAPTCHA before registration
        const captchaVerified = await GlobalApi.verifyCaptcha(captchaToken);
        if (!captchaVerified) {
            toast("CAPTCHA verification failed.");
            return;
        }

        // Proceed to user registration
        const resp = await GlobalApi.registeruser(username, email, password, name);
        sessionStorage.setItem("user", JSON.stringify(resp.data.user));
        sessionStorage.setItem("jwt", resp.data.jwt);

        toast("Account successfully created!");
        router.push("/");
    } catch (error) {
        console.error("Error during account creation:", error);
        toast(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
        setLoder(false);
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
        <h2 className="text-sm  text-gray-500">
          Enter Your Email/Mobile & Password to Create an Account
        </h2>
        <div className="w-full flex flex-col gap-5  mt-8">
          <Input
            placeholder="Name"
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
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          {/* reCAPTCHA Widget */}
          <ReCAPTCHA
            sitekey="6LeOTZQqAAAAAHF62ZAdRx1rTS28sigTRSDtH_tn"  
            onChange={onCaptchaChange}
          />

          <Button
            onClick={onCreateAccount}
            disabled={!username || !email || !password || !captchaToken}
          >
            {Loder ? <LoaderIcon className="animate-spin" /> : "Create an Account"}
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
