const { default: axios } = require("axios");

const axiosClient = axios.create({
    baseURL:'https://groapp-admin.onrender.com/api/',
});

const getCategory =()=>axiosClient.get('/categories?populate=*');

const getSliders=()=>axiosClient.get('/sliders?populate=*').then(resp=>{
    return resp.data.data
})

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Gets the list of categories from the server.
 * @returns {Promise<Array<Category>>} - A promise that resolves to an array of categories.
 */const getCategoryList =()=>axiosClient.get('/categories?populate=*').then(resp=>{
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

const deleteCartItem =(id,jwt)=>axiosClient.delete('/user-carts/'+id,{
    headers:{
        Authorization: `Bearer ${jwt}`,
    },
});

const LogIn =(email,password)=>axiosClient.post('/auth/local', { identifier: email, password: password })

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

  const saveSubscription = async (subscription) => {
    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: subscription }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save subscription");
      }
  
      console.log("Subscription saved successfully");
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  };

  const verifyCaptcha = async (req, res) => {
    const { token } = req.body;  // Make sure the token is in the request body

    if (!token) {
        console.error("Captcha token is missing in the request body.");
        return res.status(400).send({ message: "Captcha token is missing." });
    }

    try {
        const response = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
                params: {
                    secret: "6LeOTZQqAAAAABdsQMuEcBX11VglgBhiZaqGSe_E", // Replace with your reCAPTCHA secret key
                    response: token,  // Send the token here
                },
            }
        );

        if (response.data.success) {
            return res.status(200).send({ message: "Captcha verified successfully." });
        } else {
            return res.status(400).send({ message: "Captcha verification failed." });
        }
    } catch (error) {
        console.error("Error verifying CAPTCHA:", error);
        return res.status(500).send({ message: "Internal server error." });
    }
};

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

  })

  const getVendorOrders = (vendorId, jwt) =>
    axiosClient.get(`orders?filters[vendor][$eq]=${vendorId}&populate=*`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }).then(resp => resp.data.data.map((item) => ({
      id: item.id,
      createdAt: item.attributes.createdAt,
      customerName:
        item.attributes.customer.data.attributes.firstname +
        ' ' +
        item.attributes.customer.data.attributes.lastname,
      totalOrderValue: item.attributes.totalOrderValue,
      paymentid: item.attributes.paymentid,
      Orderitemlist: item.attributes.Orderitemlist,
      firstname: item.attributes.customer.data.attributes.firstname,
      lastname: item.attributes.customer.data.attributes.lastname,
      email: item.attributes.customer.data.attributes.email,
      phone: item.attributes.customer.data.attributes.phone,
      address: item.attributes.customer.data.attributes.address,
      pincode: item.attributes.customer.data.attributes.pincode,
      status: item.attributes.Status,
    })));


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
    saveSubscription,
    verifyCaptcha,
    getVendorOrders
}
