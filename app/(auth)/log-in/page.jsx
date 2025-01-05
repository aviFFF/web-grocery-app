"use client";
import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GlobalApi from "@/app/utils/GlobalApi";
import Link from "next/link";
import Image from "next/image";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onLogIn = async () => {
    if (!captchaToken) {
      toast("Please complete the CAPTCHA verification.");
      return;
    }

    setLoader(true);

    try {
      console.log("Sending Login Request...");
      const resp = await GlobalApi.LogIn(email, password); // Assuming you have this method
      console.log("Login Response:", resp);

      sessionStorage.setItem("user", JSON.stringify(resp.data.user));
      sessionStorage.setItem("jwt", resp.data.jwt);

      toast("Login Successful!");
      router.push("/");
    } catch (loginError) {
      console.error(
        "Login API Error:",
        loginError.response?.data || loginError.message
      );
      toast(loginError.response?.data?.message || "Something went wrong!");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-20">
      <div className="flex flex-col items-center justify-center md:p-10 p-1 md:w-auto w-screen bg-slate-100 border border-gray-200">
        <Link href="/">
          {" "}
          <Image
            src={"/newblogo.png"}
            className="rounded-2xl md:w-32 w-24"
            alt="logo"
            width={100}
            height={50}
          />
        </Link>
        <h1 className="text-3xl font-bold">Sign in Your Account</h1>
        <h2 className="text-sm  text-gray-500">
          Enter Your Email/Mobile & Password to Signin an Account
        </h2>
        <div className="w-full flex flex-col gap-5 mt-8">
          <Input
            placeholder="Mobile/Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <ReCAPTCHA
            sitekey="6LeOTZQqAAAAAHF62ZAdRx1rTS28sigTRSDtH_tn"
            onChange={onCaptchaChange}
          />
          <Button
            onClick={onLogIn}
            disabled={!email || !password || !captchaToken}
            className="mb-4"
          >
            {loader ? "Please wait..." : "Log In"}
          </Button>
        </div>
        <div>
        <div className="flex flex-row text-sm items-center justify-around gap-4"> 
          <Link href="/create-a-account " className="text-blue-500 text-wrap">
            {" "}
            Create an Account
          </Link>
          <Link href="/ForgotPassword" className="text-blue-500 text-wrap">
            Forgot Password?
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
