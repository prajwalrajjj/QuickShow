import { useMemo, useState } from "react";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import { allGenres } from "../assets/moviesCatalog";

const Movies = () => {
  const { shows } = useAppContext();
  const [genre, setGenre] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shows
      .filter((movie) => genre === "All" || movie.genres.some((item) => item.name === genre))
      .filter((movie) => {
        if (!q) return true;
        return (
          movie.title.toLowerCase().includes(q) ||
          movie.overview.toLowerCase().includes(q) ||
          movie.genres.some((item) => item.name.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sort === "rating") return b.vote_average - a.vote_average;
        if (sort === "title") return a.title.localeCompare(b.title);
        return new Date(b.release_date) - new Date(a.release_date);
      });
  }, [shows, genre, query, sort]);

  return (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-4">
        <h1 className="text-lg font-medium">Now Showing ({filtered.length})</h1>
        <div className="flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or genre..."
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 outline-none"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#151518] border border-white/10 rounded-full px-3 py-2"
          >
            <option value="newest">Newest</option>
            <option value="rating">Top rated</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {["All", ...allGenres].map((item) => (
          <button
            key={item}
            onClick={() => setGenre(item)}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
              genre === item ? "bg-primary" : "bg-white/5 border border-white/10"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {filtered.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
      {filtered.length === 0 && <p className="text-gray-400 mt-10">No movies match that search.</p>}
    </div>
  );
};

export default Movies;
