"use client"
import GoogleLoginButton from '@/app/_components/GoogleLoginButton'
import GlobalApi from '@/app/utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function LogIn() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const router= useRouter();
    const[Loder,setLoder]=useState()

    useEffect(() => {
        const jwt = sessionStorage.getItem('jwt')
        if(jwt){
            router.push('/')
        }
    }, [])
    const onLogIn = () => {
        setLoder(true)
        GlobalApi.LogIn(email,password).then(resp=>{
            sessionStorage.setItem("user", JSON.stringify(resp.data.user))
            sessionStorage.setItem("jwt", resp.data.jwt)
            console.log(resp);
            toast("Wah bhai Wah! Bhut Badhiya")
            router.push("/")
            setLoder(false)
        } , (e) => {
            toast(" Na Na Na Na Na Re Na Re Na")
            setLoder(false)
        }

    )
    }
  return (
    <div className='flex flex-col items-baseline justify-center my-20'>
      <div className="flex flex-col items-center justify-center md:p-10 p-1 w-screen bg-slate-100 border border-gray-200">
      <Link href ="/" > <Image src="/newlogo.png" className='rounded-2xl' alt="logo" width={100} height={50} /></Link>
        <h1 className='text-3xl font-bold'>Sign In Your Account</h1>
            <h2 className='text-sm text-nowrap text-gray-500'>Enter Your Email/Mobile & Password to SignIn Your Account</h2>
            <div className='w-full flex flex-col gap-5  mt-8'>
                <Input placeholder="Mobile/Email" onChange={(e)=>setEmail(e.target.value)} />
                <Input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
                <Button onClick ={()=>onLogIn()}
                disabled={!email || !password}
                >
                    {Loder ?<LoaderIcon className="animate-spin" />  : "Log In"}
                    </Button>
                    
                <p>
                    Don't have an account?
                    <Link href="/create-a-account " className='text-blue-500 text-wrap'> Create an Account</Link>
                </p>
            </div>
        </div>
        
      
    </div>
  )
}

export default LogIn
