import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { image_base_url } from "../redux/showSlice";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition-all duration-300 w-72">
      <img
        src={image_base_url + movie.backdrop_path}
        alt={movie.title}
        onClick={() => {
          navigate(`/movie/${movie._id}`);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="rounded-lg h-52 w-full object-cover object-bottom-right cursor-pointer"
      />

      <p className="font-semibold truncate mt-2">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres?.slice(0, 2).map((g) => g.name).join(" | ")} • {" "}
        {timeFormat(movie.runtime)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          className=" px-4 py-2 text-lg bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer mt-2"
          onClick={() => {
            navigate(`/movie/${movie._id}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Mua vé ngay
        </button>

        <p className="flex items-center gap-1 text-lg text-gray-400 mt-3 pr-1">
          <StarIcon className="size-4 text-primary fill-primary" />
          {movie.vote_average?.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
