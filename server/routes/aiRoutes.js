import express from "express";
import OpenAI from "openai";
import { detectIntent } from "../services/intentService.js";

import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import Booking from "../models/Booking.js";

const router = express.Router();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


async function findMovieByName(name) {
  if (!name) return null;
  return Movie.findOne({ title: new RegExp(name, "i") });
}


function safe(val, def = null) {
  return val !== undefined && val !== null ? val : def;
}


function formatData(intent, data, extra = {}) {
  try {
    switch (intent) {
      case "SHOW_TODAY":
        return {
          type: "today_show",
          movies: safe(data, []).map((m) => ({
            id: m._id,
            title: m.title,
            rating: m.vote_average,
            genres: m.genres,
          })),
        };

      case "SHOWTIME":
        return {
          type: "showtime",
          movieName: extra.movieName,
          shows: safe(data, []).map((s) => ({
            id: s._id,
            utc: s.showDateTime,
            local: new Date(s.showDateTime).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
            price: s.showPrice,
          })),
        };

      case "SEATS":
        return {
          type: "seats",
          movieName: extra.movieName,
          occupiedSeats: Object.keys(safe(data?.occupiedSeats, {})),
          availableSeats:
            100 - Object.keys(safe(data?.occupiedSeats, {})).length,
          showDateTime: safe(data?.showDateTime, null),
        };

      case "PAYMENT_PAID":
      case "PAYMENT_UNPAID":
        return {
          type: "bookings",
          status: intent === "PAYMENT_PAID" ? "paid" : "unpaid",
          bookings: safe(data, []).map((b) => ({
            id: b._id,
            movie: b?.show?.movie?.title,
            dateTime: b?.show?.showDateTime,
            seats: b.bookedSeats,
            amount: b.amount,
          })),
        };

      case "MOVIE_RATING":
      case "MOVIE_SUMMARY":
        return data
          ? {
              type: "movie",
              title: data.title,
              rating: data.vote_average,
              overview: data.overview,
              genres: data.genres,
              runtime: data.runtime,
            }
          : { type: "movie", found: false };

      case "MOVIE_RECOMMEND":
      case "POPULAR_MOVIE":
      case "BY_GENRE":
        return {
          type: "recommend",
          movies: safe(data, []).map((m) => ({
            id: m._id,
            title: m.title,
            rating: m.vote_average,
            genres: m.genres,
          })),
        };

      case "PAYMENT_GUIDE":
        return { type: "payment_guide" };

      case "NAVIGATE":
        return { type: "navigate", navTarget: extra.navTarget };

      default:
        return { type: "other" };
    }
  } catch (e) {
    console.log("FORMAT ERROR:", e);
    return { type: "other" };
  }
}


router.post("/ask", async (req, res) => {
  try {
    const { message, userId } = req.body;

    const intent = await detectIntent(message);
    let formatted = null;


    switch (intent.intent) {
      case "SHOW_TODAY": {
        const today = new Date();
        const start = new Date(today.setHours(0, 0, 0, 0));
        const end = new Date(today.setHours(23, 59, 59, 999));

        const shows = await Show.find({
          showDateTime: { $gte: start, $lte: end },
        });

        const ids = [...new Set(shows.map((s) => s.movie))];
        const movies = await Movie.find({ _id: { $in: ids } });

        formatted = formatData("SHOW_TODAY", movies);
        break;
      }

      case "SHOWTIME": {
        const movie = await findMovieByName(intent.movieName);
        if (!movie) {
          formatted = { type: "not_found" };
          break;
        }

        const shows = await Show.find({ movie: movie._id }).sort(
          "showDateTime"
        );

        formatted = formatData("SHOWTIME", shows, { movieName: movie.title });
        break;
      }

      case "SEATS": {
        const movie = await findMovieByName(intent.movieName);
        if (!movie) {
          formatted = { type: "not_found" };
          break;
        }

        const firstShow = await Show.findOne({ movie: movie._id }).sort(
          "showDateTime"
        );

        formatted = formatData("SEATS", firstShow, { movieName: movie.title });
        break;
      }

      case "PAYMENT_PAID":
      case "PAYMENT_UNPAID": {
        const flag = intent.intent === "PAYMENT_PAID";

        const bookings = await Booking.find({
          user: userId,
          isPaid: flag,
        }).populate({
          path: "show",
          populate: { path: "movie" },
        });

        formatted = formatData(intent.intent, bookings);
        break;
      }

      case "MOVIE_RATING":
      case "MOVIE_SUMMARY": {
        const movie = await findMovieByName(intent.movieName);
        formatted = formatData(intent.intent, movie);
        break;
      }

      case "MOVIE_RECOMMEND":
      case "POPULAR_MOVIE":
      case "BY_GENRE": {
        const movies = await Movie.find({});
        formatted = formatData(intent.intent, movies);
        break;
      }

      case "NAVIGATE":
        formatted = formatData("NAVIGATE", null, {
          navTarget: intent.navTarget,
        });
        break;

      default:
        formatted = { type: "other" };
    }

    const aiReply = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Bạn là trợ lý AI TouchCinema.

⚠️ QUY TẮC:
- KHÔNG BAO GIỜ tự tạo giờ chiếu hoặc phim.
- Chỉ trả lời theo Data cung cấp.
- Dùng Markdown đẹp.
- Dùng emoji.

🎬 Với showtime → Format:
- 🕒 18:00 • 12/01/2025 — 💵 75.000đ

🪑 Với ghế → Liệt kê số ghế đã đặt + số ghế còn lại.

🎫 Với booking → Trả lời rõ ràng, từng vé 1.

🌈 Luôn trả lời thân thiện.
`,
        },
        {
          role: "user",
          content: `Câu hỏi: ${message}\nData: ${JSON.stringify(formatted)}`,
        },
      ],
    });

    return res.json({ reply: aiReply.choices[0].message.content });
  } catch (err) {
    console.log("AI ERROR:", err);
    return res.json({
      reply: "Xin lỗi, hệ thống đang gặp lỗi kỹ thuật. Bạn thử lại sau nhé!",
    });
  }
});

export default router;
