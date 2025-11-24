import { use, useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { Heart, PlayCircle, PlayCircleIcon, StarIcon } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";

const MovieDetail = () => {

  const navigate = useNavigate()
  const { id } = useParams();
  
  const [show, setShow] = useState(null);
  const getshow = async () => {
    const show = dummyShowsData.find((show) => show._id === id);
    if(show){
    setShow({
      movie: show,
      datetime: dummyDateTimeData
    })
  }
  };
  useEffect(() => {
    getshow();
    console.log(show);
  }, [id]);
  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={show.movie.poster_path}
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
            <button className="bg-gray-700 p-2.5 rounded-full transition-all duration-300 cursor-pointer active:scale-95">
              <Heart className="size-6" />
            </button>
          </div>
        </div>
      </div>

      <p>Diễn viên yêu thích</p>
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4 justify-center">
            {show.movie.casts.slice(0,12).map((cast, index)=>(
             <div className="flex flex-col items-center text-center" key={index}>
              <img src={cast.profile_path} alt="" className="rounded-full h-20 md:h-20 aspect-square object-cover"/>
              <p className="font-medium text-xs mt-3">{cast.name}</p>
             </div> 
            ))}
        </div>
      </div>
      <DateSelect datetime={show.datetime} id={id} />
      <p className="text-lg font-medium mt-2 mb-8">Phim bạn có thể thích</p>
      <div className="flex flex-wrap justify-center gap-8">
            {dummyShowsData.slice(0,4).map((item,index)=>(
              <MovieCard movie={item} key={index} />
            ))}
      </div>
      <div className="flex justify-center mt-20">
          <button onClick={()=>{navigate('/movie'); scrollTo(0,0)}} className="px-10 rounded-xl py-3 text-sm bg-primary hover:bg-primary-dull transition-all duration-300 font-medium cursor-pointer ">Hiển thị thêm</button>
      </div>
    </div>
  ) : (
   <Loading />
  );
};
export default MovieDetail;
