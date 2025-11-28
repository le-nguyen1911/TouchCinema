import { useNavigate } from "react-router-dom";
import { dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchShows } from "../redux/showSlice";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
const Movie = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const shows = useSelector((state) => state.show.shows);

  useEffect(() => {
    dispatch(fetchShows({ getToken }));
  }, []);
  return shows.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0" />
      <BlurCircle bottom="50px" right="50px" />
      <h1 className="text-lg font-medium my-4">Phim Đang Chiếu</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {shows.map((item) => (
          <MovieCard movie={item} key={item._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col  items-center justify-center h-screen">
      <h1>Hiện Chưa Có phim nào được chiếu</h1>
    </div>
  );
};
export default Movie;
