import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";

export const isAdmin = async (req, res) => {
  res.json({ success: true, isAdmin: true });
};

export const getDashboardData = async (req, res) => {
  try {
    const paidBookings = await Booking.find({ isPaid: true });

    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie");

    const totalUser = await User.countDocuments();

    const totalBookings = paidBookings.reduce(
      (acc, b) => acc + b.bookedSeats.length,
      0
    );

    const totalRevenue = paidBookings.reduce(
      (acc, b) => acc + b.amount,
      0
    );

    const revenueByDate = await Booking.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
        },
      },
    ]);

    const bookingsByDate = await Booking.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          total: 1,
        },
      },
    ]);

    const topMovies = await Booking.aggregate([
      { $match: { isPaid: true } },
      {
        $lookup: {
          from: "shows",
          localField: "show",
          foreignField: "_id",
          as: "show",
        },
      },
      { $unwind: "$show" },
      {
        $group: {
          _id: "$show.movie",
          revenue: { $sum: "$amount" },
          tickets: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          movieTitle: "$movie.title",
          revenue: 1,
          tickets: 1,
        },
      },
    ]);

    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        activeShows,
        totalUser,
        revenueByDate,
        bookingsByDate,
        topMovies,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user")
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
