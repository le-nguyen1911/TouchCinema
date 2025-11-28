import { useAuth } from "@clerk/clerk-react";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteMovies } from "../redux/favoriteSlice";
import { useEffect } from "react";

const Favorite = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();


  const favoriteMovies = useSelector(
    (state) => state.favorite.favoriteMovies
  );

  useEffect(() => {
    dispatch(fetchFavoriteMovies({ getToken }));
  }, []);

  return favoriteMovies.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] flex flex-col justify-center">
      <BlurCircle top="150px" left="0" />
      <BlurCircle bottom="50px" right="50px" />
      <h1 className="text-lg font-medium my-4">Phim yêu thích</h1>

      <div className="flex flex-wrap justify-center gap-8">
        {favoriteMovies.map((item) => (
          <MovieCard movie={item} key={item._id || item.id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Hiện chưa có phim yêu thích nào</h1>
    </div>
  );
};

export default Favorite;
