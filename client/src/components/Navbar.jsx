import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { DemoUserButton, useAuth } from "../context/AuthContext";
import SearchModal from "./SearchModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, openSignIn, mode } = useAuth();
  const { favoriteMovies } = useAppContext();
  const navigate = useNavigate();

  const closeMenu = () => {
    scrollTo(0, 0);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link to="/" className="max-md:flex-1">
        <img src={assets.logo} alt="QuickShow by Prajwal Raj" className="w-36 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
          isOpen ? "max-md:w-full" : "max-md:w-0"
        }`}
      >
        <XIcon
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <Link onClick={closeMenu} to="/">
          Home
        </Link>
        <Link onClick={closeMenu} to="/movies">
          Movies
        </Link>
        <Link onClick={closeMenu} to="/theaters">
          Theaters
        </Link>
        <Link onClick={closeMenu} to="/releases">
          Releases
        </Link>
        <Link onClick={closeMenu} to="/favorite">
          Favorites {favoriteMovies.length > 0 ? `(${favoriteMovies.length})` : ""}
        </Link>
        <Link onClick={closeMenu} to="/my-bookings">
          Bookings
        </Link>
        <button
          onClick={() => {
            setIsOpen(false);
            setSearchOpen(true);
          }}
          className="md:hidden cursor-pointer"
        >
          Search
        </button>
      </div>

      <div className="flex items-center gap-8">
        <button onClick={() => setSearchOpen(true)} className="cursor-pointer" aria-label="Search movies">
          <SearchIcon className="w-6 h-6" />
        </button>
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
          >
            Login / Sign up
          </button>
        ) : mode === "clerk" ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus width={15} />}
                onClick={() => navigate("/my-bookings")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <DemoUserButton />
        )}
      </div>

      <MenuIcon
        className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      />

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
};

export default Navbar;
