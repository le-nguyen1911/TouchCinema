import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { fetchShowById, fetchShows, image_base_url } from "../redux/showSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  fetchFavoriteMovies,
  updateFavoriteMovie,
} from "../redux/favoriteSlice";
import toast from "react-hot-toast";
import {
  addComment,
  deleteComment,
  fetchComments,
} from "../redux/commentSlice";
const MovieDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [show, setShow] = useState(null);

  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const singleShow = useSelector((state) => state.show.singleShow);
  const shows = useSelector((state) => state.show.shows);
  const favoriteMovies = useSelector((state) => state.favorite.favoriteMovies);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [filterStar, setFilterStar] = useState("all");

  const { comments } = useSelector((state) => state.comments);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavoriteMovies({ getToken }));
    }
  }, [user]);

  const handleFavorite = () => {
    if (!user) return toast.error("Vui lòng đăng nhập trước!");
    dispatch(updateFavoriteMovie({ getToken, movieId: id }));
  };
  const handleAddComment = () => {
    if (!user) return toast.error("Vui lòng đăng nhập!");

    dispatch(
      addComment({
        movieId: id,
        rating,
        comment: commentText,
        getToken,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setCommentText("");
        dispatch(fetchComments({ movieId: id }));
      }
    });
  };
  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment({ commentId, getToken }));
  };

  useEffect(() => {
    dispatch(fetchShowById({ id }));
  }, [id]);

  useEffect(() => {
    if (singleShow) {
      setShow({
        movie: singleShow.movie,
        datetime: singleShow.dateTime,
      });
    }
  }, [singleShow]);
  useEffect(() => {
    dispatch(fetchComments({ movieId: id }));
  }, [id]);

  useEffect(() => {
    dispatch(fetchShows({ getToken }));
  }, []);
  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={image_base_url + show.movie.poster_path}
          alt=""
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100p" left="-100px" />
          <p className="text-primary">TIẾNG ANH</p>
          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {show.movie.title}
          </h1>
          <div className="flex items-center gap-3 text-gray-300">
            <StarIcon className="size-5 text-primary fill-primary" />
            {show.movie.vote_average?.toFixed(1)} Đánh giá của người dùng
          </div>
          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie.overview}
          </p>
          <p>
            {timeFormat(show.movie.runtime)} •{" "}
            {show.movie.genres.map((item) => item.name).join(", ")} •{" "}
            {show.movie.release_date.split("_")[0]}
          </p>
          <div className="flex items-center flex-wrap gap-4 mt-4">
            <button className="flex items-center gap-2 px-7 py-3 text-md bg-gray-800 hover:bg-gray-900 transition-all duration-300 rounded-md font-medium cursor-pointer active:scale-95">
              <PlayCircleIcon className="size-5" />
              Xem trailer
            </button>
            <a
              href="#dateSelect"
              className="px-10 py-3 text-md bg-primary hover:bg-primary-dull transition-all duration-300 rounded-md font-medium cursor-pointer active:scale-95"
            >
              Mua vé ngay
            </a>
            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  favoriteMovies.some((movie) => movie._id === id)
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <p>Diễn viên yêu thích</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4 justify-center">
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div className="flex flex-col items-center text-center" key={index}>
              <img
                src={image_base_url + cast.profile_path}
                alt=""
                className="rounded-full h-20 md:h-20 aspect-square object-cover"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Bình luận phim</h2>

        <div className="flex gap-3 mb-6">
          {["all", 5, 4, 3, 2, 1].map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilterStar(item);
                dispatch(
                  fetchComments({
                    movieId: id,
                    star: item === "all" ? "" : item,
                  })
                );
              }}
              className={`px-4 py-2 rounded-md transition ${
                filterStar === item
                  ? "bg-primary text-black"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {item === "all" ? "Tất cả" : `${item} ⭐`}
            </button>
          ))}
        </div>

        {user ? (
          <div className="bg-gray-800 p-4 rounded-xl mb-6">
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  className={`size-6 cursor-pointer ${
                    rating >= s ? "text-primary fill-primary" : "text-gray-500"
                  }`}
                  onClick={() => setRating(s)}
                />
              ))}
            </div>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md"
              placeholder="Viết bình luận..."
              rows="3"
            />

            <button
              onClick={() => {
                if (!user) return toast.error("Vui lòng đăng nhập!");

                dispatch(
                  addComment({
                    movieId: id,
                    rating,
                    comment: commentText,
                    getToken,
                  })
                ).then((res) => {
                  if (res.meta.requestStatus === "fulfilled") {
                    setCommentText("");
                    dispatch(
                      fetchComments({
                        movieId: id,
                        star: filterStar === "all" ? "" : filterStar,
                      })
                    );
                  }
                });
              }}
              className="mt-3 px-6 py-2 bg-primary hover:bg-primary-dull rounded-md"
            >
              Gửi bình luận
            </button>
          </div>
        ) : (
          <p className="text-gray-400 mb-6">
            * Vui lòng đăng nhập để bình luận.
          </p>
        )}

        <div className="flex flex-col gap-6">
          {comments.length === 0 && (
            <p className="text-gray-400 italic">Chưa có bình luận.</p>
          )}

          {comments.map((c) => (
            <div
              key={c._id}
              className="bg-gray-900 p-4 rounded-xl flex gap-4 relative"
            >
              <img
                src={c.user?.image}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <p className="font-medium">{c.user?.name}</p>

                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      className={`size-4 ${
                        c.rating >= s
                          ? "text-primary fill-primary"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-300">{c.comment}</p>
              </div>

              {c.user?._id === user?.id && (
                <button
                  onClick={() =>
                    dispatch(
                      deleteComment({ commentId: c._id, getToken })
                    ).then(() =>
                      dispatch(
                        fetchComments({
                          movieId: id,
                          star: filterStar === "all" ? "" : filterStar,
                        })
                      )
                    )
                  }
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                >
                  Xóa
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <DateSelect datetime={show.datetime} id={id} />
      <p className="text-lg font-medium mt-2 mb-8">Phim bạn có thể thích</p>
      <div className="flex flex-wrap justify-center gap-8">
        {shows.slice(0, 4).map((item, index) => (
          <MovieCard movie={item} key={index} />
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate("/movie");
            scrollTo(0, 0);
          }}
          className="px-10 rounded-xl py-3 text-sm bg-primary hover:bg-primary-dull transition-all duration-300 font-medium cursor-pointer "
        >
          Hiển thị thêm
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};
export default MovieDetail;
