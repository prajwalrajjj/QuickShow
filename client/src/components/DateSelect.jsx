import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import BlurCircle from "./BlurCircle";
import { parseDateKey } from "../lib/dateKey";

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();
  const dates = Object.keys(dateTime || {});
  const [selected, setSelected] = useState(dates[0] || null);
  const scroller = useRef(null);

  const onBookHandler = () => {
    if (!selected) {
      return toast.error("Please select a date");
    }
    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  };

  const scrollDates = (direction) => {
    scroller.current?.scrollBy({ left: direction * 160, behavior: "smooth" });
  };

  return (
    <div id="dateSelect" className="pt-30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        <div>
          <p className="text-lg font-semibold">Choose Date</p>
          <div className="flex items-center gap-6 text-sm mt-5">
            <button type="button" onClick={() => scrollDates(-1)} className="cursor-pointer">
              <ChevronLeftIcon width={28} />
            </button>
            <span ref={scroller} className="grid grid-cols-3 md:flex flex-nowrap md:max-w-lg gap-4 overflow-x-auto no-scrollbar">
              {dates.map((date) => {
                const localDate = parseDateKey(date);
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelected(date)}
                    className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${
                      selected === date ? "bg-primary text-white" : "border border-primary/70"
                    }`}
                  >
                    <span>{localDate.getDate()}</span>
                    <span>{localDate.toLocaleDateString("en-US", { month: "short" })}</span>
                  </button>
                );
              })}
            </span>
            <button type="button" onClick={() => scrollDates(1)} className="cursor-pointer">
              <ChevronRightIcon width={28} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onBookHandler}
          className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary-dull transition-all cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
