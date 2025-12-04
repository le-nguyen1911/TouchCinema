import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;

    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }

    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    } else {
      user.privateMetadata.favorites = user.privateMetadata.favorites.filter(
        (item) => item != movieId
      );
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({
      success: true,
      message: "Favorite added successfully.",
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favorites = user.privateMetadata.favorites;

    const movies = await Movie.find({ _id: { $in: favorites } });

    res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const users = await clerkClient.users.getUserList({
      limit: Number(limit),
      offset: Number(offset),
    });

    const userData = users.data.map((u) => ({
      id: u.id,
      email: u.emailAddresses?.[0]?.emailAddress || null,
      name: u.fullName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    }));

    res.json({
      success: true,
      total: users.totalCount,
      users: userData,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await clerkClient.users.deleteUser(id);
    await Booking.deleteMany({ user: id });

    res.json({
      success: true,
      message: "Xóa người dùng thành công.",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
