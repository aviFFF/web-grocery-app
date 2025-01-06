import Cookies from "js-cookie";
const { default: axios } = require("axios");

const axiosClient = axios.create({
    baseURL:'https://api.buzzat.in/api',
});
axiosClient.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // Retrieve token from cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const getCategory =()=>axiosClient.get('/categories?populate=*');

const getSliders=()=>axiosClient.get('/sliders?populate=*').then(resp=>{
    return resp.data.data
})


const getCategoryList =()=>axiosClient.get('/categories?populate=*').then(resp=>{
    return resp.data.data
})

export const getAllProducts = async (query = '') => {
    const searchParam = query
      ? `&filters[$or][0][name][$containsi]=${query}&filters[$or][1][categories][name][$containsi]=${query}`
      : '';
    
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
  

const getProductsbyCategory =(category)=>axiosClient.get('/products?filters[categories][name][$in]='+category+"&populate=*").then(resp=>{
    return resp.data.data
})

const registeruser =(username,email,password,name)=>axiosClient.post('/auth/local/register',
  {
    username:username,
    email:email,
    password:password,
    name:name
});

const LogIn =(email,password)=>axiosClient.post('/auth/local', { identifier: email, password: password })

const ForgotPassword = (email) => {
  return axiosClient.post('/auth/forgot-password', {
    email: email,  // User's email
  });
};


const ResetPassword = (code, password, passwordConfirmation) =>
  axiosClient.post('/auth/reset-password', {
    code, // Token from the reset link
    password,
    passwordConfirmation,
  });






const deleteCartItem =(id,jwt)=>axiosClient.delete('/user-carts/'+id,{
    headers:{
        Authorization: `Bearer ${jwt}`,
    },
});


const addToCart =(data,jwt)=>axiosClient.post('/user-carts',data,{
    headers:{
         Authorization: `Bearer ${jwt}`,
    },
});

const getCartItems=(userId,jwt)=>axiosClient.get('/user-carts?filters[userId][$eq]='+userId+'&[populate][products][populate][image][populate][0]=url',
    {
        headers:{
            Authorization: `Bearer ${jwt}`,
        },
    }
).then(resp=>{
    const data = resp.data.data
    const cartItemList = data.map((item,index)=>({
        name:item.attributes.products.data.attributes?.name,
        quantity:item.attributes.quantity,
        amount:item.attributes.amount,
        image:item.attributes.products.data.attributes.image.data[0].attributes.url,
        selingPrice:item.attributes.products.data.attributes.mrp, 
        id:item.id,
        product:item.attributes.products.data.id,


    }))
    return cartItemList
})

export const getPincodes = async () => {
    const resp = await axiosClient.get('/pincodes?populate=*');
    return resp.data.data;
  };

  const createOrder = (data,jwt)=>axiosClient.post('/Orders',data,{
    headers:{
         Authorization: `Bearer ${jwt}`,
    },
  });

  const getPromocodes =()=>axiosClient.get('/promocodes?populate=*').then(resp=>{
    return resp.data.data
  })


const sendNotification = async (fcmToken, title, body) => {
  try {
    const response = await axios.post('/notifications/send', {
      fcmToken,
      title,
      body,
    });
    console.log('Notification sent:', response.data);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

 async function verifyCaptcha(token) {
    const secretKey = '6LcfP5QqAAAAACAP3RHVeioVCirG6BEo5EHrpTlg'; // Replace with your reCAPTCHA secret key
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null, {
                params: {
                    secret: secretKey,
                    response: token
                }
            }
        );
        return response.data.success;
    } catch (error) {
        console.error('CAPTCHA verification error:', error);
        return false;
    }
}

  const getMyorders = (userid,jwt)=>axiosClient.get('orders?filters[userid][$eq]='+userid+'&populate[Orderitemlist][populate][product][populate][image]=url').then(resp=>{
      const response = resp.data.data
      const orderList = response.map((item,index)=>({
          id:item.id,
          totalOrderValue:item.attributes.totalOrderValue,
          paymentid:item.attributes.paymentid,
          Orderitemlist:item.attributes.Orderitemlist,
          firstname:item.attributes.firstname,
          lastname:item.attributes.lastname,
          email:item.attributes.email,
          phone:item.attributes.phone,
          address:item.attributes.address,
          pincode:item.attributes.pincode,
          createdAt:item.attributes.createdAt,
          status:item.attributes.Status
      }));
      return orderList

  });

 // Vendor Signup API
export const vendorSignup = (name, email, password, phone) =>
  axiosClient.post('/vendor/signup', { name, email, password, phone });

// Vendor Login API
export const vendorLogin = async (email, password) => {
  const response = await axiosClient.post('/vendor/login', { email, password });
  
  // Store token in a secure cookie
  Cookies.set("token", response.data.jwt, {
    expires: 7, // Token valid for 7 days
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

  return axiosClient.get("/orders?populate[Orderitemlist][populate]=product.image", {
    headers: {
      Authorization: `Bearer ${token}`, // Pass token in Authorization header
    },
  });
};

const subscribeToPushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY; // Replace this with the Base64 URL-safe public key
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    console.log("Push Subscription:", subscription);

    // Send subscription to your backend
    await fetch(process.env.NEXT_PUBLIC_API_URL + "/save-subscription", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
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
    getPincodes,
    createOrder,
    getMyorders,
    getPromocodes,
    verifyCaptcha,
    fetchVendorOrders,
    vendorSignup,
    vendorLogin,
    subscribeToPushNotifications,
    sendNotification,
    ForgotPassword,
    ResetPassword,
}
