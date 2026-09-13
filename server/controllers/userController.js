import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import { clerkClient } from "@clerk/express";

export const getUserBookings = async (req, res) => {
  try {
    const user = req.auth().userId;
    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.auth().userId;
    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favorites || [];

    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
    } else {
      favorites.splice(favorites.indexOf(movieId), 1);
    }

    await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { favorites } });
    res.json({ success: true, message: "Favorite movies updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favorites = user.privateMetadata.favorites || [];
    const movies = await Movie.find({ _id: { $in: favorites } });
    res.json({ success: true, movies });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
