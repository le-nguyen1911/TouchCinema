import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchShows } from "../redux/showSlice";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { setKeyword } from "../redux/searchSlice";

const Movie = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const { shows, loading } = useSelector((state) => state.show);
  const { keyword } = useSelector((state) => state.search);

  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    dispatch(fetchShows({ getToken }));
  }, []);

  useEffect(() => {
    if (!shows || shows.length === 0) return;

    let result = [...shows];

    const normalize = (str) => str?.toLowerCase().trim() || "";

    const key = normalize(keyword);

    if (key !== "") {
      result = result.filter((item) => {
        const title1 = normalize(item?.movie?.title);
        const title2 = normalize(item?.title);

        return title1.includes(key) || title2.includes(key);
      });
    }

    setFiltered(result);
  }, [shows, keyword]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Đang tải phim...
      </div>
    );
  }

  return (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0" />
      <BlurCircle bottom="50px" right="50px" />

      <h1 className="text-lg font-medium my-4 text-white">
        {keyword ? `Kết quả tìm kiếm cho: "${keyword}"` : "Phim Đang Chiếu"}
      </h1>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-300">
          <h2 className="text-xl">Không tìm thấy phim phù hợp</h2>
          <button
            onClick={() => dispatch(setKeyword(""))}
            className="mt-4 px-5 py-2 bg-primary text-white rounded-full"
          >
            Xóa tìm kiếm
          </button>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap justify-center gap-8">
            {filtered.map((item) => (
              <MovieCard movie={item} key={item._id} />
            ))}
          </div>

          {keyword && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => dispatch(setKeyword(""))}
                className="px-5 py-2 bg-primary text-white rounded-full"
              >
                Xóa tìm kiếm
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Movie;
