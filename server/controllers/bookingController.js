import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import show from "../models/Show.js";

const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected Seats are not available.",
      });
    }

    const showData = await Show.findById(showId).populate("movie");

    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    selectedSeats.map((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");

    await showData.save();
    res.json({ success: true, message: "booking successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    const showData = await Show.findById(booking.show);
    if (!showData) {
      return res.json({ success: false, message: "Show not found" });
    }

    booking.bookedSeats.forEach((seat) => {
      delete showData.occupiedSeats[seat];
    });

    showData.markModified("occupiedSeats");
    await showData.save();

    await Booking.findByIdAndDelete(bookingId);

    res.json({
      success: true,
      message: "Booking canceled successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
 
export const updateBookingByAdmin = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { selectedSeats, isPaid } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    const showData = await Show.findById(booking.show);
    if (!showData) {
      return res.json({ success: false, message: "Show not found" });
    }


    booking.bookedSeats.forEach((seat) => {
      delete showData.occupiedSeats[seat];
    });


    if (selectedSeats && selectedSeats.length > 0) {
      const isAvailable = selectedSeats.every(
        (seat) => !showData.occupiedSeats[seat]
      );

      if (!isAvailable) {
        return res.json({
          success: false,
          message: "Ghế đã có người đặt",
        });
      }

      selectedSeats.forEach((seat) => {
        showData.occupiedSeats[seat] = booking.user;
      });

      booking.bookedSeats = selectedSeats;
      booking.amount = showData.showPrice * selectedSeats.length;
    }

    if (typeof isPaid === "boolean") {
      booking.isPaid = isPaid;
    }

    showData.markModified("occupiedSeats");
    await showData.save();
    await booking.save();

    res.json({
      success: true,
      message: "Admin cập nhật booking thành công",
      booking,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
