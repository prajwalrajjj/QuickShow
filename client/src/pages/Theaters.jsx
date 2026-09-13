import { MapPinIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const theaters = [
  { name: "PVR Koramangala", city: "Bengaluru", address: "Forum Mall, Koramangala" },
  { name: "INOX Mantri Square", city: "Bengaluru", address: "Malleshwaram" },
  { name: "Cinepolis Nexus", city: "Bengaluru", address: "Whitefield" },
];

const Theaters = () => {
  const { shows, dummyDateTimeData, image_base_url } = useAppContext() || {};
  const navigate = useNavigate();
  const firstDate = dummyDateTimeData ? Object.keys(dummyDateTimeData)[0] : "";

  return (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 overflow-hidden min-h-[80vh]">
      <BlurCircle top="100px" left="0px" />
      <h1 className="text-lg font-medium my-4">Theaters</h1>
      <div className="space-y-6">
        {theaters.map((theater) => (
          <div key={theater.name} className="p-5 rounded-xl bg-primary/8 border border-primary/20">
            <div className="flex items-start gap-3 mb-4">
              <MapPinIcon className="w-5 h-5 text-primary mt-1" />
              <div>
                <p className="font-semibold text-lg">{theater.name}</p>
                <p className="text-sm text-gray-400">
                  {theater.address}, {theater.city}
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(shows || []).slice(0, 3).map((movie) => (
                <button
                  key={`${theater.name}-${movie._id}`}
                  onClick={() => {
                    navigate(`/movies/${movie._id}/${firstDate}`);
                    scrollTo(0, 0);
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-black/30 hover:bg-black/50 text-left cursor-pointer"
                >
                  <img
                    src={(image_base_url || "") + movie.poster_path}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium line-clamp-1">{movie.title}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <ClockIcon className="w-3 h-3" /> Book seats
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Theaters;
