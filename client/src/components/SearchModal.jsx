import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, XIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const { shows, image_base_url } = useAppContext() || { shows: [] };
  const navigate = useNavigate();

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return shows.slice(0, 8);
    return shows.filter((movie) => {
      const genres = movie.genres.map((genre) => genre.name.toLowerCase()).join(" ");
      return movie.title.toLowerCase().includes(value) || genres.includes(value) || movie.overview.toLowerCase().includes(value);
    });
  }, [query, shows]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="w-full max-w-xl bg-[#151518] border border-white/10 rounded-2xl p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Superman, horror, romance, animation..."
            className="flex-1 bg-transparent outline-none text-white"
          />
          <button onClick={onClose} className="cursor-pointer">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
          {results.length === 0 && <p className="text-gray-400 text-sm py-6 text-center">No movies found</p>}
          {results.map((movie) => (
            <button
              key={movie._id}
              onClick={() => {
                onClose();
                navigate(`/movies/${movie._id}`);
                scrollTo(0, 0);
              }}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left cursor-pointer"
            >
              <img src={image_base_url + movie.poster_path} alt={movie.title} className="w-12 h-16 object-cover rounded" />
              <div>
                <p className="font-medium">{movie.title}</p>
                <p className="text-xs text-gray-400">
                  {movie.genres.map((genre) => genre.name).join(" · ")} · {movie.release_date?.slice(0, 4)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
