import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import toast from "react-hot-toast";
import isoTimeFormat from "../lib/isoTimeFormat";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I"],
  ];
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const navigate = useNavigate();
  const { shows, dummyDateTimeData, getOccupiedSeats, createBooking } = useAppContext();
  const { user, openSignIn } = useAuth();

  useEffect(() => {
    const movie = shows.find((item) => String(item._id) === String(id) || String(item.id) === String(id));
    if (!movie) return;

    const dateTime = dummyDateTimeData;
    const times = dateTime[date] || Object.values(dateTime)[0] || [];
    setShow({ movie, dateTime });
    if (times.length) {
      setSelectedTime(times[0]);
      setOccupiedSeats(Object.keys(getOccupiedSeats(times[0].showId)));
    }
  }, [id, date, shows, dummyDateTimeData]);

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast.error("Please select a time first");
    }
    if (occupiedSeats.includes(seatId)) {
      return toast.error("This seat is already booked");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast.error("You can only select 5 seats");
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);
          return (
            <button
              key={seatId}
              type="button"
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer text-[10px] ${
                isSelected ? "bg-primary text-white" : ""
              } ${isOccupied ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const bookTickets = () => {
    if (!selectedTime) {
      return toast.error("Please select a show time");
    }
    if (!selectedSeats.length) {
      return toast.error("Please select at least one seat");
    }
    if (!user) {
      toast.error("Please login or sign up to book tickets");
      openSignIn();
      return;
    }

    createBooking({
      movie: show.movie,
      dateTime: selectedTime.time,
      selectedSeats,
      showId: selectedTime.showId,
    });
    toast.success("Seats reserved. Pay now on My Bookings to confirm.");
    navigate("/my-bookings");
  };

  if (!show) return <Loading />;

  const timings = show.dateTime[date] || Object.values(show.dateTime)[0] || [];

  return (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      <div className="w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {timings.map((item) => (
            <div
              key={item.time}
              onClick={() => {
                setSelectedTime(item);
                setSelectedSeats([]);
                setOccupiedSeats(Object.keys(getOccupiedSeats(item.showId)));
              }}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center max-md:mt-16">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className="text-2xl font-semibold mb-4">Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className="text-gray-400 text-sm mb-6">SCREEN SIDE</p>
        <p className="text-sm text-gray-400 mb-2">
          {selectedSeats.length ? `Selected: ${selectedSeats.join(", ")}` : "Tap a seat to select it"}
        </p>
        <div className="flex flex-col items-center mt-6 text-xs text-gray-300">
          <div className="grid flex-col grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={bookTickets}
          className="flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95"
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SeatLayout;
