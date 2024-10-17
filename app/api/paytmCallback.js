import PaytmChecksum from "paytmchecksum";

export default async function handler(req, res) {
  const receivedData = req.body;

  const paytmChecksum = receivedData.CHECKSUMHASH;
  const isVerifySignature = PaytmChecksum.verifySignature(receivedData, process.env.NEXT_PUBLIC_PAYTM_MKEY, paytmChecksum);

  if (isVerifySignature) {
    // Check transaction status from Paytm
    const paytmParams = {
      mid: process.env.NEXT_PUBLIC_PAYTM_MID,
      orderId: receivedData.ORDERID,
    };

    try {
      const checksum = await PaytmChecksum.generateSignature(paytmParams, process.env.NEXT_PUBLIC_PAYTM_MKEY);
      paytmParams.CHECKSUMHASH = checksum;

      const response = await axios.post(
        `https://securegw-stage.paytm.in/order/status`,
        paytmParams,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const paymentStatus = response.data;

      if (paymentStatus.STATUS === "TXN_SUCCESS") {
        // Payment successful, handle accordingly
        res.status(200).json({ success: true, paymentStatus });
      } else {
        // Payment failed
        res.status(400).json({ success: false, paymentStatus });
      }
    } catch (error) {
      console.error("Error verifying Paytm transaction:", error);
      res.status(500).json({ error: "Payment verification failed" });
    }
  } else {
    res.status(400).json({ error: "Checksum Mismatch" });
  }
}
