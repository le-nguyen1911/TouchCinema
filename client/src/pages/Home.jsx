import FeaturedMovies from "../components/FeaturedMovies"
import Heromovies from "../components/Heromovies"
import TrailerMovie from "../components/TrailerMovie"

const Home = () => {
    return (
        <>
            <Heromovies/>
            <FeaturedMovies />
            <TrailerMovie />
        </>
    )
}
export default Home