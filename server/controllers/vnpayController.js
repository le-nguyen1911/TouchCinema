import { VNPay } from "vnpay";
import { VnpLocale, HashAlgorithm } from "vnpay/enums";
import { dateFormat } from "vnpay/utils";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Show from "../models/Show.js";
import transporter from "../configs/mail.js";
import { generateQrPng } from "../utils/generateQrPng.js";
import path from "path";

const createVnpInstance = () =>
  new VNPay({
    tmnCode: process.env.VNP_TMN_CODE,
    secureSecret: process.env.VNP_HASH_SECRET,
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: false,
  });

const sendPaymentEmail = async (email, booking, movie) => {
  if (!booking.qrCode) return;

  const qrPath = path.join(process.cwd(), booking.qrCode);

  await transporter.sendMail({
    from: `"TouchCinema" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "🎟 Vé xem phim TouchCinema",
    html: `
      <h2>🎉 Thanh toán thành công!</h2>
      <p><b>🎬 Phim:</b> ${movie.title}</p>
      <p><b>Mã vé:</b> ${booking._id}</p>
      <p><b>Ghế:</b> ${booking.bookedSeats.join(", ")}</p>
      <p><b>Số tiền:</b> ${booking.amount.toLocaleString("vi-VN")}₫</p>
      <p>👉 Vui lòng xuất trình mã QR khi vào rạp.</p>
      <p>Chúc quý khách xem phim vui vẻ</p>
    `,
    attachments: [
      {
        filename: `ticket-${booking._id}.png`,
        path: qrPath,
        contentType: "image/png",
      },
    ],
  });
};

export const createPaymentVnpay = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

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

    res.json({ success: true, paymentUrl });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const vnpayReturn = async (req, res) => {
  try {
    const bookingId = req.query.vnp_TxnRef;
    const responseCode = req.query.vnp_ResponseCode;

    if (responseCode !== "00") {
      return res.redirect("https://touchcinema.vercel.app/payment-failed");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.redirect("https://touchcinema.vercel.app/payment-failed");
    }

    if (!booking.isPaid) {
      booking.isPaid = true;
      booking.qrCode = await generateQrPng(
        { ticketId: booking._id.toString() },
        `ticket-${booking._id}.png`
      );
      await booking.save();
    }

    const user = await User.findById(booking.user);
    const show = await Show.findById(booking.show).populate("movie");

    if (user?.email && show?.movie) {
      await sendPaymentEmail(user.email, booking, show.movie);
    }

    return res.redirect("https://touchcinema.vercel.app/payment-success");
  } catch (err) {
    console.error("vnpayReturn error:", err);
    return res.redirect("https://touchcinema.vercel.app/payment-failed");
  }
};

export const vnpayIPN = async (req, res) => {
  try {
    const vnpay = createVnpInstance();
    const verify = vnpay.verifyIPN(req.query);

    if (!verify.isSuccess) {
      return res.json({ RspCode: "97", Message: "Fail checksum" });
    }

    if (req.query.vnp_ResponseCode === "00") {
      await Booking.findByIdAndUpdate(req.query.vnp_TxnRef, {
        isPaid: true,
      });
      return res.json({ RspCode: "00", Message: "Success" });
    }

    return res.json({ RspCode: "00", Message: "Payment Failed" });
  } catch (err) {
    return res.json({ RspCode: "99", Message: err.message });
  }
};
