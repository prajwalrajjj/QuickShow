import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const Releases = () => {
  const { shows } = useAppContext() || { shows: [] };
  const recent = [...shows].sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

  return (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
      <BlurCircle top="150px" left="0px" />
      <h1 className="text-lg font-medium my-4">New & Recent Releases</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {recent.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  );
};

export default Releases;
