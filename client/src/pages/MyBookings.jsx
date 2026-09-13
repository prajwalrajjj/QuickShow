import { useEffect } from "react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import dateFormat from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const { bookings, fetchBookings, payBooking, image_base_url } = useAppContext();
  const { user, openSignIn } = useAuth();

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-semibold">Login to view your bookings</h1>
        <button onClick={openSignIn} className="px-6 py-2 bg-primary rounded-full">
          Login
        </button>
      </div>
    );
  }

  if (!bookings) return <Loading />;

  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="text-lg font-semibold mb-4">My Bookings</h1>

      {bookings.length === 0 && (
        <p className="text-gray-400 mt-10">No bookings yet. Pick a movie and reserve your seats.</p>
      )}

      {bookings.map((item) => (
        <div
          key={item._id + item.bookedSeats.join("-")}
          className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
        >
          <div className="flex flex-col md:flex-row">
            <img
              src={image_base_url + item.show.movie.poster_path}
              alt={item.show.movie.title}
              className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded"
            />
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{item.show.movie.title}</p>
              <p className="text-gray-400 text-sm">{item.show.movie.runtime} min</p>
              <p className="text-gray-400 text-sm mt-auto">{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end md:text-right justify-between p-4">
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold mb-3">
                {currency}
                {item.amount}
              </p>
              {!item.isPaid && (
                <button
                  onClick={() => payBooking(item._id)}
                  className="bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer"
                >
                  Pay Now
                </button>
              )}
            </div>
            <div className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets:</span> {item.bookedSeats.length}
              </p>
              <p>
                <span className="text-gray-400">Seat Number:</span> {item.bookedSeats.join(", ")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
