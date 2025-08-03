const axios = require("axios");
const FormData = require("form-data");
const crypto = require("crypto");

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const uploadToCloudinary = async (base64DataUri) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureString = `folder=AI-Chat&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto
    .createHash("sha1")
    .update(signatureString)
    .digest("hex");

  const form = new FormData();
  form.append("file", base64DataUri); // base64 string
  form.append("api_key", CLOUDINARY_API_KEY);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("folder", "AI-Chat");

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    form,
    { headers: form.getHeaders() }
  );

  return res.data;
};
module.exports = uploadToCloudinary;
