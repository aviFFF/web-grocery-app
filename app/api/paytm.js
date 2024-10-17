import PaytmChecksum from "paytmchecksum";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, userId, username, email, phone, address, pincode } = req.body;

    const MID = process.env.NEXT_PUBLIC_PAYTM_MID;
    const MKEY = process.env.NEXT_PUBLIC_PAYTM_MKEY;
    const CALLBACK_URL = process.env.NEXT_PUBLIC_PAYTM_CALLBACK_URL;

    let orderId = 'ORDER_' + new Date().getTime();

    const paytmParams = {
      body: {
        requestType: 'Payment',
        mid: MID,
        websiteName: process.env.NEXT_PUBLIC_PAYTM_WEBSITE, // For staging or production
        orderId: orderId,
        callbackUrl: CALLBACK_URL,
        txnAmount: {
          value: amount,
          currency: 'INR',
        },
        userInfo: {
          custId: userId,
          email: email,
          mobile: phone,
        },
      },
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      MKEY
    );

    paytmParams.head = {
      signature: checksum,
    };

    const paytmConfig = {
      method: "post",
      url: `https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid=${MID}&orderId=${orderId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: paytmParams,
    };

    try {
      const { data } = await axios(paytmConfig);
      res.status(200).json({ txnToken: data.body.txnToken, orderId, mid: MID });
    } catch (error) {
      console.error("Error in Paytm initiation:", error);
      res.status(500).json({ error: "Payment initiation failed" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
