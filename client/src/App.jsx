import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import MovieDetail from "./pages/MovieDetail";
import SeatLayout from "./pages/SeatLayout";
import MyBooking from "./pages/MyBooking";
import Favorite from "./pages/Favorite";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddShow from "./pages/admin/AddShow";
import ListBookings from "./pages/admin/ListBookings";
import ListShows from "./pages/admin/ListShows";
import { SignIn, useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchIsAdmin } from "./redux/adminSlice";

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith("/admin");
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useUser();
  const { getToken } = useAuth();

  const dispatch = useDispatch();

  // Gọi API kiểm tra admin mỗi khi user thay đổi hoặc đổi route
  useEffect(() => {
    if (user) {
      dispatch(fetchIsAdmin({ getToken, location, navigate }));
    }
  }, [user, location.pathname]);
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie" element={<Movie />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movie/:id/:date" element={<SeatLayout />} />
        <Route path="/my-booking" element={<MyBooking />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route
          path="/admin/*"
          element={
            user ? (
              <Layout />
            ) : (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl={"/admin"} />
              </div>
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-show" element={<AddShow />} />
          <Route path="list-show" element={<ListShows />} />
          <Route path="list-booking" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};
export default App;
