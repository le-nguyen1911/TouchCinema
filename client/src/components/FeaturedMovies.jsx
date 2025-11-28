import { ArrowRight } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchShows } from "../redux/showSlice";

const FeaturedMovies = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const shows = useSelector((state) => state.show.shows); 

  useEffect(() => {
    dispatch(fetchShows({ getToken }));
  }, []);
  return (
    <div className="px-6 ms:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <BlurCircle top='0' right='-80px' />
        <p className="text-lg font-medium text-gray-300">Phim đang chiếu</p>
        <button onClick={()=>navigate("/movie")} className="group flex items-center gap-2 text-sm text-gray-300">Xem tất cả
            <ArrowRight className="size-4.5 group-hover:translate-x-0.5 transition" />
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mt-8">
        {shows.slice(0,4).map((show)=>(
            <MovieCard key={show._id} movie={show} />
        ))}
      </div>
      <div className=" flex px-6 py-4 items-center justify-center mt-20">
        <button onClick={()=>{{navigate("/movie"), scrollTo(0,0)}}} className="gap-1 p-4 bg-primary hover:bg-primary-dull rounded-full hover:-translate-y-2 transition-all duration-300">
            Hiển thị thêm
        </button>
      </div>
    </div>
  );
};

export default FeaturedMovies;
