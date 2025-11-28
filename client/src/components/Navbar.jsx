import { Link, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteMovies } from "../redux/favoriteSlice";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const favoriteMovies = useSelector((state) => state.favorite.favoriteMovies);

  useEffect(() => {
    dispatch(fetchFavoriteMovies({ getToken }));
  }, []);
  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-centre justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to={"/"} className="max-md:flex-1">
        <img src={LOGO} alt="logo" className="w-44  h-auto" />
      </Link>
      <div
        className={`
    max-md:absolute max-md:top-0 max-md:left-0
    max-md:font-medium max-md:text-lg z-50
    flex flex-col md:flex-row items-center
    max-md:justify-center gap-8
    md:px-8 py-3 max-md:h-screen md:rounded-full
    backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20
    overflow-hidden transition-all duration-300
    ${isOpen ? "max-md:w-full" : "max-md:w-0"}
  `}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 size-6 cursor-pointer "
          onClick={() => setIsOpen(!isOpen)}
        />
        <Link
          to={"/"}
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
        >
          TRANG CHỦ
        </Link>
        <Link
          to={"/movie"}
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
        >
          PHIM
        </Link>
        <Link
          to={"/"}
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
        >
          RẠP
        </Link>

        <Link
          to={"/"}
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
        >
          SẮP CHIẾU
        </Link>
      {favoriteMovies.length > 0  &&  <Link
          to={"/favorite"}
          onClick={() => {
            scrollTo(0, 0), setIsOpen(false);
          }}
        >
          YÊU THÍCH
        </Link> }
      </div>
      <div className="flex items-center gap-8">
        <SearchIcon className="size-8 max-md:hidden cursor-pointer" />
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer  "
          >
            Đăng nhập
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Booking"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-booking")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>
      <div
        className="flex items-center justify-center md:hidden max-md:ml-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuIcon className="size-8  " />
      </div>
    </div>
  );
};
export default Navbar;
