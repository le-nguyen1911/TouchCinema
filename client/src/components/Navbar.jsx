import { Link, useNavigate, useLocation } from "react-router-dom";
import LOGO from "../assets/logo.png";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteMovies } from "../redux/favoriteSlice";
import { setKeyword } from "../redux/searchSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();    

  const favoriteMovies = useSelector((state) => state.favorite.favoriteMovies);

  useEffect(() => {
    dispatch(fetchFavoriteMovies({ getToken }));
  }, []);

  const isActive = (path) => location.pathname === path;

  const activeClass =
    "text-primary font-semibold border-b-2 border-primary pb-1";
  const normalClass =
    "text-white/90 hover:text-white transition-all";

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-centre justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to={"/"} className="max-md:flex-1">
        <img src={LOGO} alt="logo" className="w-44 h-auto" />
      </Link>

      <div
        className={`
          max-md:absolute max-md:top-0 max-md:left-0
          max-md:text-lg z-50
          flex flex-col md:flex-row items-center
          max-md:justify-center gap-8
          md:px-8 py-3 max-md:h-screen md:rounded-full
          backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20
          overflow-hidden transition-all duration-300
          ${isOpen ? "max-md:w-full" : "max-md:w-0"}
        `}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 size-6 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />

        <Link
          to="/"
          onClick={() => { setIsOpen(false); scrollTo(0, 0); }}
          className={isActive("/") ? activeClass : normalClass}
        >
          TRANG CHỦ
        </Link>

        <Link
          to="/movie"
          onClick={() => { setIsOpen(false); scrollTo(0, 0); }}
          className={isActive("/movie") ? activeClass : normalClass}
        >
          PHIM
        </Link>

        <Link
          to="/about"
          onClick={() => { setIsOpen(false); scrollTo(0, 0); }}
          className={isActive("/about") ? activeClass : normalClass}
        >
          GIỚI THIỆU
        </Link>

        <Link
          to="/discount"
          onClick={() => { setIsOpen(false); scrollTo(0, 0); }}
          className={isActive("/discount") ? activeClass : normalClass}
        >
          KHUYẾN MÃI
        </Link>

        {favoriteMovies.length > 0 && (
          <Link
            to="/favorite"
            onClick={() => { setIsOpen(false); scrollTo(0, 0); }}
            className={isActive("/favorite") ? activeClass : normalClass}
          >
            YÊU THÍCH
          </Link>
        )}
      </div>

      <div className="flex items-center gap-8">
        <div className="relative">
          {!searchOpen && (
            <SearchIcon
              className="size-8 cursor-pointer"
              onClick={() => setSearchOpen(true)}
            />
          )}

          {searchOpen && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20 animate-fadeIn">
              <input
                type="text"
                placeholder="Tìm phim..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    dispatch(setKeyword(searchText));
                    navigate("/movie");
                    setSearchOpen(false);
                    setSearchText("");
                  }
                }}
                className="bg-transparent outline-none text-white w-48 placeholder-gray-300"
              />

              <XIcon
                className="size-5 text-gray-300 cursor-pointer"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchText("");
                }}
              />
            </div>
          )}
        </div>

        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull rounded-full font-medium"
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
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="size-8" />
      </div>
    </div>
  );
};

export default Navbar;
