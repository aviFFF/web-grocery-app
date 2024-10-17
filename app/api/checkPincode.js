// pages/api/checkPincode.js
export default async function checkPincode(req, res) {
    const { pincode } = req.query;
  
    if (!pincode) {
      return res.status(400).json({ message: 'Pincode is required' });
    }
  
    try {
      // Fetch the pincodes from Strapi
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/pincodes?populate=*`
      );
      const data = await response.json();
  
      // Check if the pincode exists in the data
      const isDeliverable = data?.data?.some((item) => item.attributes.pins === pincode);
  
      if (isDeliverable) {
        return res.status(200).json({ deliverable: true, message: 'Delivery available.' });
      } else {
        return res.status(200).json({ deliverable: false, message: 'Delivery not available.' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error checking pincode' });
    }
  }
  