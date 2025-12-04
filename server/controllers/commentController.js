import Comment from "../models/Comment.js";
import Booking from "../models/Booking.js";

export const addComment = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    const { userId } = req.auth();

    const bookings = await Booking.find({ user: userId }).populate("show");

    const hasPurchased = bookings.some(
      (b) => b.show?.movie?.toString() === movieId
    );

    if (!hasPurchased) {
      return res.json({
        success: false,
        message: "Bạn cần đặt vé xem phim này trước khi đánh giá.",
      });
    }

    const newComment = await Comment.create({
      movie: movieId,
      user: userId,
      rating,
      comment,
    });

    res.json({
      success: true,
      message: "Thêm bình luận thành công",
      comment: newComment,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCommentsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { star } = req.query;

    const filter = { movie: movieId };
    if (star) filter.rating = Number(star);

    const comments = await Comment.find(filter)
      .populate("user", "name image")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth();

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.json({ success: false, message: "Comment không tồn tại" });
    }

    if (comment.user.toString() !== userId && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền xóa bình luận này" });
    }

    await comment.deleteOne();

    res.json({ success: true, message: "Xóa bình luận thành công" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name image")
      .populate("movie", "title poster_path")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

