import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing?language=vi-VN&region=VN",
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      }
    );

    const movies = data.results;
    res.json({ success: true, movies: movies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?language=vi-VN`,
          {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          }
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=vi-VN`,
          {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
          }
        ),
      ]);
      const movieApiData = movieDetailsResponse.data;
      const movieCreditData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview || "khong co",
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };


      movie = await Movie.create(movieDetails);
    }
    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });
    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Show Added successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() }
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const movieMap = new Map();

    shows.forEach((show) => {
      if (!movieMap.has(show.movie._id)) {
        movieMap.set(show.movie._id, show.movie);
      }
    });

    res.json({
      success: true,
      shows: Array.from(movieMap.values())
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() }
    }).sort({ showDateTime: 1 });

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.json({ success: false, message: "Movie not found" });
    }

    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];

      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      const timeString = show.showDateTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      dateTime[date].push({
        time: timeString,
        showId: show._id,
      });
    });

    Object.keys(dateTime).forEach(date => {
      dateTime[date].sort((a, b) => a.time.localeCompare(b.time));
    });

    res.json({
      success: true,
      movie,
      dateTime,
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
export const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, showPrice } = req.body;

    const show = await Show.findById(id);
    if (!show) {
      return res.json({ success: false, message: "Show not found" });
    }

    if (show.occupiedSeats && Object.keys(show.occupiedSeats).length > 0) {
      return res.json({
        success: false,
        message: "Show này đã có người đặt vé, không thể chỉnh sửa."
      });
    }

    if (showPrice !== undefined) {
      show.showPrice = Number(showPrice);
    }

    if (date && time) {
      const newDate = new Date(`${date}T${time}`);

      if (isNaN(newDate.getTime())) {
        return res.json({
          success: false,
          message: "Ngày giờ không hợp lệ!"
        });
      }

      show.showDateTime = newDate;
    }

    await show.save();

    res.json({
      success: true,
      message: "Cập nhật suất chiếu thành công.",
      show
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findById(id);
    if (!show) {
      return res.json({ success: false, message: "Show không tồn tại" });
    }

    if (show.occupiedSeats && Object.keys(show.occupiedSeats).length > 0) {
      return res.json({
        success: false,
        message: "Show đã có người đặt vé, không thể xoá!"
      });
    }

    await show.deleteOne();

    res.json({ success: true, message: "Đã xoá suất chiếu thành công." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
