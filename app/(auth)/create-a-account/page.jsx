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

function CreateAccount() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [Loder, setLoder] = useState();
  const [name, setName] = useState();

  const router = useRouter();

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      router.push("/");
    }
  }, []);

  const onCreateAccount = () => {
    setLoder(true);
    GlobalApi.registeruser(username, email, password, name).then(
      (resp) => {
        sessionStorage.setItem("user", JSON.stringify(resp.data.user));
        sessionStorage.setItem("jwt", resp.data.jwt);
        toast("Ban gaya Account");
        router.push("/");
        setLoder(false);
      },
      (e) => {
        toast("Please Enter Valid Details");
        setLoder(false);
      }
    );
  };
  return (
    <div className="flex items-center justify-center my-20">
      <div className="flex flex-col items-center justify-center md:p-10 p-1 md:w-auto w-screen bg-slate-100 border border-gray-200">
        <Link href="/">
          {" "}
          <Image
            src="/newlogo.png"
            className="rounded-2xl"
            alt="logo"
            width={100}
            height={50}
          />
        </Link>
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <h2 className="text-sm text-nowrap text-gray-500">
          Enter Your Email/Mobile & Password to Create an Account
        </h2>
        <div className="w-full flex flex-col gap-5  mt-8">
          <Input
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Mobile Number"
            onChange={(e) => setUsername(e.target.value)}
            maxLength={10}
            
          />
          <Input
            placeholder="name@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={() => onCreateAccount()}
            disabled={!username || !email || !password}
          >
            {" "}
            {Loder ? (
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
