// controllers/vnpayController.js
import { VNPay } from "vnpay";
import { VnpLocale, HashAlgorithm } from "vnpay/enums";
import { dateFormat } from "vnpay/utils";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Show from "../models/Show.js";     // ⭐ cần thêm
import transporter from "../configs/mail.js";


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
  try {
    await transporter.sendMail({
      from: `"TouchCinema" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thanh toán vé thành công ✔",
      html: `
        <h2>🎉 Cảm ơn bạn đã thanh toán!</h2>

        <img 
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
          style="width:200px; border-radius:8px; margin-bottom:15px"
        />

        <p><b>🎬 Phim:</b> ${movie.title}</p>
        <p><b>Mã booking:</b> ${booking._id}</p>
        <p><b>Số tiền:</b> ${booking.amount.toLocaleString("vi-VN")}₫</p>
        <p><b>Số ghế:</b> ${booking.bookedSeats.join(", ")}</p>

        <p>📍 Địa điểm: 576/145D Đoàn Văn Bơ, Quận 4</p>
        <br/>
        <p>Chúc bạn xem phim vui vẻ cùng TouchCinema!</p>
      `,
    });

    console.log("Email sent!");
  } catch (err) {
    console.log("Gửi email lỗi:", err.message);
  }
};


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

    res.json({ success: true, paymentUrl });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


export const vnpayReturn = async (req, res) => {
  try {
    const vnpay = createVnpInstance();
    const verify = vnpay.verifyReturnUrl(req.query);

    const bookingId = req.query.vnp_TxnRef;
    const responseCode = req.query.vnp_ResponseCode;

    if (verify.isSuccess && responseCode === "00") {

 
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { isPaid: true },
        { new: true }
      );

    
      const user = await User.findById(booking.user);

     
      const show = await Show.findById(booking.show).populate("movie");

      if (user?.email && show?.movie) {
        await sendPaymentEmail(user.email, booking, show.movie);
      }

      return res.redirect("https://touchcinema.vercel.app//payment-success");
    }

    return res.redirect("https://touchcinema.vercel.app//payment-failed");

  } catch (err) {
    console.log(err);
    return res.redirect("https://touchcinema.vercel.app//payment-failed");
  }
};

export const vnpayIPN = async (req, res) => {
  try {
    const vnpay = createVnpInstance();
    const verify = vnpay.verifyIPN(req.query);

    const bookingId = req.query.vnp_TxnRef;
    const responseCode = req.query.vnp_ResponseCode;

    if (!verify.isSuccess)
      return res.json({ RspCode: "97", Message: "Fail checksum" });

    if (responseCode === "00") {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { isPaid: true },
        { new: true }
      );

      const user = await User.findById(booking.user);
      const show = await Show.findById(booking.show).populate("movie");

      if (user?.email && show?.movie) {
        await sendPaymentEmail(user.email, booking, show.movie);
      }

      return res.json({ RspCode: "00", Message: "Success" });
    }

    return res.json({ RspCode: "00", Message: "Payment Failed" });

  } catch (err) {
    return res.json({ RspCode: "99", Message: err.message });
  }
};
