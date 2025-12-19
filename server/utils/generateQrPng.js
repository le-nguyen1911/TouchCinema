import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export const generateQrPng = async (data, fileName) => {
  const outputPath = path.join("uploads/qrcode", fileName);

  await QRCode.toFile(outputPath, JSON.stringify(data), {
    type: "png",
    width: 300,
    margin: 2,
  });

  return `/uploads/qrcode/${fileName}`;
};
