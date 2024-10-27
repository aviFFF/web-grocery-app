import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';

export default function AuthCallback() {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    const authenticateUser = async () => {
      if (query.access_token) {
        // Make a request to Strapi to get user details
        try {
          const response = await axios.get('http://localhost:1337/users/me', {
            headers: {
              Authorization: `Bearer ${query.access_token}`,
            },
          });

          // Save the user details and token to your context or localStorage
          console.log(response.data);

          // Redirect user to dashboard or homepage
          router.push('/dashboard');
        } catch (error) {
          console.error('Authentication failed', error);
        }
      }
    };

    if (query.access_token) {
      authenticateUser();
    }
  }, [query, router]);

  return <div>Loading...</div>;
}
