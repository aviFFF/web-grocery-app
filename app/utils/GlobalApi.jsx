import Cookies from "js-cookie";
import { toast } from "sonner";
const { default: axios } = require("axios");

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // Retrieve token from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const getCategory = () => axiosClient.get("/categories?populate=*");

const getSliders = () =>
  axiosClient.get("/sliders?populate=*").then((resp) => {
    return resp.data.data;
  });

const getCategoryList = () =>
  axiosClient.get("/categories?populate=*").then((resp) => {
    return resp.data.data;
  });

export const getAllProducts = async (query = "") => {
  const searchParam = query
    ? `&filters[$or][0][name][$containsi]=${query}&filters[$or][1][description][$containsi]=${query}&filters[$or][2][sellingPrice][$containsi]=${query}`
    : "";

  const resp = await axiosClient.get(`/products?populate=*&${searchParam}`);
  return resp.data.data;
};

// Debounce function to limit API calls
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export const getProductsbyCategory = (category) =>
  axiosClient
    .get("/products?filters[categories][name][$in]=" + category + "&populate=*")
    .then((resp) => {
      return resp.data.data;
    });

const getProductsByCategory = async (categoryId) => {
  return axiosClient
    .get(`/products?filters[categories][id][$in]=${categoryId}&populate=*`)
    .then((resp) => resp.data.data);
};

    

const registeruser = (username, email, password, name) =>
  axiosClient.post("/auth/local/register", {
    username: username,
    email: email,
    password: password,
    name: name,
  });

const getProductBetween100to199 = () =>
  axiosClient
    .get(
      "/products?populate=*&filters[$and][0][sellingPrice][$gte]=100&filters[$and][1][sellingPrice][$lte]=199&pagination[pageSize]=1000&sort[sellingPrice]=desc"
    )
    .then((resp) => resp.data.data);

export { getProductBetween100to199 };

const getproductunderninenine = () =>
  axiosClient
    .get(
      "/products?populate=*&filters[$and][0][sellingPrice][$gte]=50&filters[$and][1][sellingPrice][$lte]=99&pagination[pageSize]=1000&sort[sellingPrice]=desc"
    )
    .then((resp) => resp.data.data);

const getproductfortynine = () =>
  axiosClient
    .get(
      "/products?populate=*&filters[$and][0][sellingPrice][$gte]=1&filters[$and][1][sellingPrice][$lte]=49&pagination[pageSize]=1000&sort[sellingPrice]=desc"
    )
    .then((resp) => resp.data.data);

const LogIn = (email, password) =>
  axiosClient.post("/auth/local", { identifier: email, password: password });

const ForgotPassword = async (email) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();
    if (res.ok) {
    } else {
      toast(data.error.message || "Failed to send reset email.");
    }
  } catch (error) {
    toast("Error sending reset email.");
  }
};

const ResetPassword = async (code, password, confirmPassword) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          password,
          passwordConfirmation: confirmPassword,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || "Failed to reset password.");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Error resetting password.");
  }
};

const deleteCartItem = (id, jwt) =>
  axiosClient.delete("/user-carts/" + id, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

const addToCart = (data, jwt) =>
  axiosClient.post("/user-carts", data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

const updateCartItem = (id, data, jwt) =>
  axiosClient.put(`/user-carts/${id}`, data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });

const getCartItems = (userId, jwt) =>
  axiosClient
    .get(
      `/user-carts?filters[userId][$eq]=${userId}&[populate][products][populate][image][populate][0]=url`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
    .then((resp) => {
      const data = resp.data.data;
      return data.map((item) => ({
        name: item.attributes.products.data.attributes?.name,
        quantity: item.attributes.quantity,
        amount: item.attributes.amount,
        image:
          item.attributes.products.data?.attributes?.image?.data?.[0]
            ?.attributes?.url ?? "default-image-url",
        sellingPrice: item.attributes.products.data.attributes.mrp,
        id: item.id,
        product: item.attributes.products.data.id,
        quantityType: item.attributes.products.data.attributes?.quantityType,
      }));
    });


    

const createOrder = (data, jwt) =>
  axiosClient.post("/Orders", data, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });


export const sendNotification = async (fcmToken, title, body) => {
  try {
    const response = await axios.post("/notifications/send", {
      fcmToken,
      title,
      body,
    });
    console.log("Notification sent:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

async function verifyCaptcha(token) {
  const secretKey = process.env.NEXT_PUBLIC_RECAPTCHA_SECRET; // Replace with your reCAPTCHA secret key
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );
    return response.data.success;
  } catch (error) {
    console.error("CAPTCHA verification error:", error);
    return false;
  }
}

const getMyorders = (userid, jwt) =>
  axiosClient
    .get(
      "orders?filters[userid][$eq]=" +
        userid +
        "&populate[Orderitemlist][populate][product][populate][image]=url"
    )
    .then((resp) => {
      const response = resp.data.data;
      const orderList = response.map((item, index) => ({
        id: item.id,
        totalOrderValue: item.attributes.totalOrderValue,
        paymentid: item.attributes.paymentid,
        Orderitemlist: item.attributes.Orderitemlist,
        firstname: item.attributes.firstname,
        lastname: item.attributes.lastname,
        email: item.attributes.email,
        phone: item.attributes.phone,
        address: item.attributes.address,
        pincode: item.attributes.pincode,
        createdAt: item.attributes.createdAt,
        status: item.attributes.Status,
      }));
      return orderList;
    });

// Vendor Signup API
export const vendorSignup = (name, email, password, phone) =>
  axiosClient.post("/vendor/signup", { name, email, password, phone });

// Vendor Login API
export const vendorLogin = async (phone, password) => {
  const response = await axiosClient.post("/vendor/login", { phone, password });

  // Store token in a secure cookie
  Cookies.set("token", response.data.jwt, {
    expires: 30, // Token valid for 7 days
    secure: true, // Only sent over HTTPS
    sameSite: "Lax", // Protect against CSRF
  });

  return response;
};

// Example function to get vendor data after login
export const fetchVendorOrders = async () => {
  const token = Cookies.get("token"); // Get token from cookies
  console.log("Token from cookies:", token); // Debugging line

  if (!token) {
    console.error("No token available!"); // Log the error
    throw new Error("Token is missing");
  }

  return axiosClient.get(
    "/orders?populate[Orderitemlist][populate]=product.image",
    {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token in Authorization header
      },
    }
  );
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const token = Cookies.get("token");
  if (!token) {
    console.error("No token available!");
    throw new Error("Token is missing");
  }

  return axiosClient.put(
    `/orders/${orderId}`,
    { data: { Status: newStatus } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getAllPincodes = async () => {
  try {
    const resp = await axiosClient.get("/vendors-all-pincodes"); // New API
    return resp.data; // Adjust based on response
  } catch (error) {
    console.error("Error fetching pincodes:", error);
    return [];
  }
};


export const getVendorsByPincode = async (pincode) => {
  try {
    const formattedPincode = String(pincode); // Ensure pincode is a string
    const resp = await axiosClient.get(`/vendors-by-pincode?pincode=${formattedPincode}`);
    return {
      vendors: resp.data.vendors || [],
      categories: resp.data.categories || [],
      products: resp.data.products || [],
    };
  } catch (error) {
    console.error("Error fetching vendors by pincode:", error);
    return { vendors: [], categories: [], products: [] };
  }
};


// utils/GlobalApi.js
export const getProductsByPincode = async (pincode) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products-by-pincode?pincode=${pincode}`
    );

    const data = await response.json();

    // Extract products from the response
    const products = data.products || [];

    return products;
  } catch (error) {
    console.error("Error fetching products by pincode:", error);
    return [];
  }
};






export default {
  getCategory,
  getSliders,
  getCategoryList,
  getAllProducts,
  getProductsbyCategory,
  registeruser,
  LogIn,
  addToCart,
  getCartItems,
  deleteCartItem,
  getAllPincodes,
  createOrder,
  getMyorders,
  verifyCaptcha,
  fetchVendorOrders,
  vendorSignup,
  vendorLogin,
  ForgotPassword,
  ResetPassword,
  updateCartItem,
  getproductunderninenine,
  getproductfortynine,
  getProductBetween100to199,
  getProductsByCategory,
  updateOrderStatus,
  getVendorsByPincode,
  getProductsByPincode,
};
