import express from "express";
import {
  createPaymentVnpay,
  vnpayReturn,
  vnpayIPN,
} from "../controllers/vnpayController.js";

const router = express.Router();

router.post("/create", createPaymentVnpay);
router.get("/vnpay-return", vnpayReturn);
router.get("/vnpay-ipn", vnpayIPN);

export default router;
