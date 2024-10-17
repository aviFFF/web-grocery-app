const { default: axios } = require("axios");

const axiosClient = axios.create({
    baseURL:'http://localhost:1337/api',
});

const getCategory =()=>axiosClient.get('/categories?populate=*');

const getSliders=()=>axiosClient.get('/sliders?populate=*').then(resp=>{
    return resp.data.data
})

const getCategoryList =()=>axiosClient.get('/categories?populate=*').then(resp=>{
    return resp.data.data
})

const getAllProducts =()=>axiosClient.get('/products?populate=*').then(resp=>{
    return resp.data.data
})

const getProductsbyCategory =(category)=>axiosClient.get('/products?filters[categories][name][$in]='+category+"&populate=*").then(resp=>{
    return resp.data.data
})

const registeruser =(username,email,password)=>axiosClient.post('/auth/local/register',{username:username,
    email:email,
    password:password
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
        id:item.id


    }))
    return cartItemList
})

const getPincodes=()=>axiosClient.get('/pincodes?populate=*').then(resp=>{
    return resp.data.data
})


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
    getPincodes
}