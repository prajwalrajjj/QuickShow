import logo from "./logo.svg";
import marvelLogo from "./marvelLogo.svg";
import googlePlay from "./googlePlay.svg";
import appStore from "./appStore.svg";
import screenImage from "./screenImage.svg";
import chartIcon from "./chartIcon.svg";
import { dummyShowsData as catalogMovies } from "./moviesCatalog";

export const assets = { logo, marvelLogo, googlePlay, appStore, screenImage, chartIcon };
export const dummyTrailers = [
  { image: "https://img.youtube.com/vi/u3V5KDHRQvk/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=u3V5KDHRQvk" },
  { image: "https://img.youtube.com/vi/Ox8ZLF6cGM0/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=Ox8ZLF6cGM0" },
  { image: "https://img.youtube.com/vi/Way9Dexny3w/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=Way9Dexny3w" },
  { image: "https://img.youtube.com/vi/73_1ayVwzqY/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=73_1ayVwzqY" },
];
export const dummyShowsData = catalogMovies;
const createUpcomingDates = () => {
  const data = {};
  const times = [10, 13, 16, 19];
  for (let day = 0; day < 7; day++) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + day);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    data[key] = times.map((hour, index) => {
      const showTime = new Date(date);
      showTime.setHours(hour, 0, 0, 0);
      return { time: showTime.toISOString(), showId: `${key}-${index}` };
    });
  }
  return data;
};
export const dummyDateTimeData = createUpcomingDates();
export const dummyDashboardData = {
  totalBookings: 14,
  totalRevenue: 1517,
  totalUser: 5,
  activeShows: dummyShowsData.slice(0, 6).map((movie, index) => ({
    _id: `show-${movie._id}`,
    movie,
    showDateTime: dummyDateTimeData[Object.keys(dummyDateTimeData)[0]][0].time,
    showPrice: [59, 81, 81, 81, 49, 79][index],
    occupiedSeats: {},
  })),
};
export const dummyBookingData = [];
