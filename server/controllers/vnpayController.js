// controllers/vnpayController.js
import { VNPay } from "vnpay";
import { VnpLocale, HashAlgorithm } from "vnpay/enums";
import { dateFormat } from "vnpay/utils";
import Booking from "../models/Booking.js";

/* ============================
   TẠO INSTANCE VNPay DÙNG CHUNG
============================ */
const createVnpInstance = () =>
  new VNPay({
    tmnCode: process.env.VNP_TMN_CODE,
    secureSecret: process.env.VNP_HASH_SECRET,
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: false,
  });

/* ===========================================================
   1) CREATE PAYMENT URL  (POST /api/payment/create)
   - Nhận bookingId
   - Lấy amount từ DB (booking.amount)
   - Trả về paymentUrl
=========================================================== */
export const createPaymentVnpay = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.json({ success: false, message: "Booking not found" });

    const vnpay = createVnpInstance();

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: booking.amount ,
      vnp_IpAddr: req.ip || "127.0.0.1",
      vnp_TxnRef: booking._id.toString(),
      vnp_OrderInfo: `Thanh toán vé #${booking._id}`,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
    });

    return res.json({
      success: true,
      paymentUrl,
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: err.message });
  }
};


export const vnpayReturn = async (req, res) => {
  try {
    const vnpay = createVnpInstance();
    const verify = vnpay.verifyReturnUrl(req.query);

    const bookingId = req.query.vnp_TxnRef;
    const responseCode = req.query.vnp_ResponseCode;

    if (verify.isSuccess && responseCode === "00") {
      await Booking.findByIdAndUpdate(bookingId, { isPaid: true });
      return res.redirect("http://localhost:5173/payment-success");
    }

    return res.redirect("http://localhost:5173/payment-failed");
  } catch (err) {
    console.log(err);
    return res.redirect("http://localhost:5173/payment-failed");
  }
};


export const vnpayIPN = async (req, res) => {
  try {
    const vnpay = createVnpInstance();
    const verify = vnpay.verifyIPN(req.query);

    const bookingId = req.query.vnp_TxnRef;
    const responseCode = req.query.vnp_ResponseCode;

    if (!verify.isSuccess) {
      return res.json({ RspCode: "97", Message: "Fail checksum" });
    }

    if (responseCode === "00") {
      await Booking.findByIdAndUpdate(bookingId, { isPaid: true });
      return res.json({ RspCode: "00", Message: "Success" });
    }

    return res.json({ RspCode: "00", Message: "Payment Failed" });
  } catch (err) {
    console.log(err);
    return res.json({ RspCode: "99", Message: err.message });
  }
};
