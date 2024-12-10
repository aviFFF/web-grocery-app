// /app/utils/auth.js

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const router = useRouter();

  // Function to check if the user is authenticated
  const checkAuth = () => {
    // Check for a valid token in the cookies
    const token = Cookies.get('token');
    
    if (!token) {
      // If there's no token, redirect to login page
      router.push('/vendor-login');
    }
  };

  return { checkAuth };
};
