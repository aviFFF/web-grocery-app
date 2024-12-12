import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const useAuth = () => {
  const router = useRouter();

  const checkAuth = () => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/vendor");
    }
  };

  return { checkAuth };
};
