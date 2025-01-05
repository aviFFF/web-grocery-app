import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:1337/connect/google';
  };

  return (
    <div className='cursor-pointer w-full'>


        <Image src={"/google-sigin.png"} width={100} height={100} alt="Login with Google" onclick={handleGoogleLogin} className='object-contain w-full' />

    </div>
  );
}
