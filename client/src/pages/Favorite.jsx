import { dummyShowsData } from "../assets/assets"
import BlurCircle from "../components/BlurCircle"
import MovieCard from "../components/MovieCard"
const Favorite = () => {
    return dummyShowsData.length > 0 ? (
        <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] flex flex-col justify-center">
            <BlurCircle top="150px" left="0" />
            <BlurCircle bottom="50px" right="50px" />
            <h1 className="text-lg font-medium my-4">Phim yêu thích</h1>
            <div className="flex flex-wrap justify-center gap-8">
                {dummyShowsData.map((item)=>(
                    <MovieCard movie={item} key={item._id} />
                ))}
            </div>
        </div>
    ) : ( 
        <div className="flex flex-col  items-center justify-center h-screen">
            <h1>Hiện Chưa Có phim nào được chiếu</h1>
        </div>
    )
}
export default Favorite