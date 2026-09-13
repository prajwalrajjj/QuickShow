import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { dummyBookingData, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import { useAuth } from "./AuthContext";
import { profile } from "../lib/profile";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const AppContext = createContext();

const OCCUPIED_KEY = "quickshow-occupied";
const userKey = (base, user) => `${base}-${user?.id || "guest"}`;

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState(dummyShowsData);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || "";
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const { user, getToken, mode } = useAuth();

  const fetchIsAdmin = async () => {
    if (mode === "demo") {
      setIsAdmin(Boolean(user));
      return;
    }

    try {
      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setIsAdmin(data.success);
    } catch {
      setIsAdmin(false);
    }
  };

  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success && data.shows?.length) {
        setShows(data.shows);
        return;
      }
    } catch {
      // Frontend works with dummy movies until the backend is connected
    }
    setShows(dummyShowsData);
  };

  const fetchFavoriteMovies = async () => {
    if (!user) {
      setFavoriteMovies([]);
      return;
    }

    const ids = readJson(userKey("quickshow-favorites", user), []);
    setFavoriteMovies(shows.filter((movie) => ids.includes(movie._id)));

    if (mode === "clerk") {
      try {
        const { data } = await axios.get("/api/user/favorites", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if (data.success) setFavoriteMovies(data.movies);
      } catch {
        // keep local favorites
      }
    }
  };

  const fetchBookings = async () => {
    if (!user) {
      setBookings([]);
      return;
    }

    setBookings(readJson(userKey("quickshow-bookings", user), dummyBookingData));

    if (mode === "clerk") {
      try {
        const { data } = await axios.get("/api/user/bookings", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if (data.success) setBookings(data.bookings);
      } catch {
        // keep local bookings
      }
    }
  };

  const toggleFavorite = async (movieId) => {
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    const ids = readJson(userKey("quickshow-favorites", user), []);
    const next = ids.includes(movieId) ? ids.filter((id) => id !== movieId) : [...ids, movieId];
    localStorage.setItem(userKey("quickshow-favorites", user), JSON.stringify(next));
    setFavoriteMovies(shows.filter((movie) => next.includes(movie._id)));
    toast.success(next.includes(movieId) ? "Added to favorites" : "Removed from favorites");

    if (mode === "clerk") {
      try {
        await axios.post(
          "/api/user/update-favorite",
          { movieId },
          { headers: { Authorization: `Bearer ${await getToken()}` } }
        );
      } catch {
        // keep local favorites
      }
    }
  };

  const getOccupiedSeats = (showId) => readJson(OCCUPIED_KEY, {})[showId] || {};

  const createBooking = ({ movie, dateTime, selectedSeats, showId }) => {
    const amount = selectedSeats.length * 59;
    const booking = {
      _id: `booking-${Date.now()}`,
      user: { name: user?.fullName || "Guest" },
      show: {
        _id: showId,
        movie,
        showDateTime: dateTime,
        showPrice: 59,
      },
      amount,
      bookedSeats: selectedSeats,
      isPaid: false,
      createdAt: new Date().toISOString(),
    };

    const nextBookings = [booking, ...readJson(userKey("quickshow-bookings", user), [])];
    localStorage.setItem(userKey("quickshow-bookings", user), JSON.stringify(nextBookings));
    setBookings(nextBookings);

    const occupied = readJson(OCCUPIED_KEY, {});
    occupied[showId] = {
      ...(occupied[showId] || {}),
      ...Object.fromEntries(selectedSeats.map((seat) => [seat, user?.id || "demo-user"])),
    };
    localStorage.setItem(OCCUPIED_KEY, JSON.stringify(occupied));

    return booking;
  };

  const payBooking = (bookingId) => {
    const next = readJson(userKey("quickshow-bookings", user), []).map((booking) =>
      booking._id === bookingId ? { ...booking, isPaid: true } : booking
    );
    localStorage.setItem(userKey("quickshow-bookings", user), JSON.stringify(next));
    setBookings(next);
    toast.success("Payment successful. Confirmation email would be sent via Inngest.");
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
      fetchIsAdmin();
      fetchFavoriteMovies();
      fetchBookings();
    } else {
      setIsAdmin(false);
      setFavoriteMovies([]);
      setBookings([]);
    }
  }, [user]);

  const value = {
    axios,
    fetchIsAdmin,
    user,
    getToken,
    shows,
    favoriteMovies,
    fetchFavoriteMovies,
    isAdmin,
    image_base_url,
    currency,
    bookings,
    fetchBookings,
    toggleFavorite,
    dummyDateTimeData,
    getOccupiedSeats,
    createBooking,
    payBooking,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () =>
  useContext(AppContext) || {
    shows: dummyShowsData,
    favoriteMovies: [],
    bookings: [],
    dummyDateTimeData,
    image_base_url: "",
    currency: "$",
    user: null,
    getToken: async () => "",
    toggleFavorite: () => {},
    getOccupiedSeats: () => ({}),
    createBooking: () => ({}),
    payBooking: () => {},
    fetchBookings: () => {},
    fetchFavoriteMovies: () => {},
    axios,
  };
