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
  const [name, setName] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loader, setLoader] = useState(false);

  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, []);

  const validateInputs = () => {
    const errors = {};
    if (!name) errors.name = "Name is required.";
    if (!username || !/^\d{10}$/.test(username)) {
      errors.username = "Please enter a valid 10-digit mobile number.";
    }
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }
    if (!captchaToken) {
      errors.captcha = "Please complete the CAPTCHA verification.";
    }
    return errors;
  };

  const onCreateAccount = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoader(true);

    try {
      const resp = await GlobalApi.registeruser(username, email, password, name);

      if (resp?.data?.user && resp?.data?.jwt) {
        sessionStorage.setItem("user", JSON.stringify(resp.data.user));
        sessionStorage.setItem("jwt", resp.data.jwt);

        toast("Account successfully created!");
        router.replace("/");
      } else {
        toast("Unexpected error occurred during registration.");
      }
    } catch (error) {
      console.error("Error during account creation:", error);
      toast(error?.response?.data?.message || "You are already registered with us.");
    } finally {
      setLoader(false);
    }
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
    setErrors((prev) => ({ ...prev, captcha: null }));
  };

  return (
    <div className="flex items-center justify-center my-20">
      <div className="flex flex-col items-center justify-center md:p-10 p-1 md:w-auto w-screen bg-slate-100 border border-gray-200">
        <Link href="/">
          <Image
            src={"/newblogo.png"}
            className="rounded-2xl md:w-32 w-24"
            alt="logo"
            width={100}
            height={50}
          />
        </Link>
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <h2 className="text-sm text-gray-500">
          Enter Your Email/Mobile & Password to Create an Account
        </h2>
        <div className="w-full flex flex-col gap-5 mt-8">
          <div>
            <Input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <Input
              placeholder="Mobile Number"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              maxLength={10}
              required
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>
          <div>
            <Input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <ReCAPTCHA
              sitekey="6LeOTZQqAAAAAHF62ZAdRx1rTS28sigTRSDtH_tn"
              onChange={onCaptchaChange}
            />
            {errors.captcha && <p className="text-red-500 text-sm">{errors.captcha}</p>}
          </div>
          <Button
            onClick={onCreateAccount}
            disabled={!captchaToken || !name || !username || !email || !password}
          >
            {loader ? <LoaderIcon className="animate-spin" /> : "Create an Account"}
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
