import CryptoJS from "crypto-js";

export async function POST(request) {
  // Extract request data
  const { key, txnid, amount, productinfo, firstname, email, salt } = await request.json();

  // Include optional UDF fields as empty strings
  const udf1 = "";
  const udf2 = "";
  const udf3 = "";
  const udf4 = "";
  const udf5 = "";

  // Generate the hash string with empty UDF placeholders
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

  // Hash the string using SHA-512
  const hash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);

  // Return the hash
  return new Response(JSON.stringify({ hash }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
