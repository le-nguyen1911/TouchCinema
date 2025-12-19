import QRCode from "qrcode";
import cloudinary from "../configs/cloudinary.js";

export const generateQrAndUpload = async (data) => {
  const qrBase64 = await QRCode.toDataURL(JSON.stringify(data), {
    width: 300,
    margin: 2,
  });

  const upload = await cloudinary.uploader.upload(qrBase64, {
    folder: "touchcinema_qr",
    resource_type: "image",
  });

  return upload.secure_url;
};
