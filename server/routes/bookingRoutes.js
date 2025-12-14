import express from "express";
import {
  cancelBooking,
  createBooking,
  getOccupiedSeats,
  updateBookingByAdmin,
} from "../controllers/bookingController.js";
import { protectAdmin } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", createBooking);
bookingRouter.get("/seats/:showId", getOccupiedSeats);
bookingRouter.delete("/cancel/:bookingId", cancelBooking);
bookingRouter.put("/admin/update/:bookingId", protectAdmin, updateBookingByAdmin);

export default bookingRouter;
