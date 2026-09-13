import { useState } from "react";
import { PlayCircleIcon } from "lucide-react";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";
import { youtubeId } from "../lib/youtube";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <p className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">Trailers</p>

      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-100px" />
        <div className="mx-auto w-full max-w-[960px] aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            key={currentTrailer.videoUrl}
            src={`https://www.youtube.com/embed/${youtubeId(currentTrailer.videoUrl)}`}
            title="Trailer"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="group grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
        {dummyTrailers.map((trailer) => (
          <button
            key={trailer.image}
            type="button"
            className="relative hover:-translate-y-1 duration-300 transition cursor-pointer"
            onClick={() => setCurrentTrailer(trailer)}
          >
            <img
              src={trailer.image}
              alt="Trailer"
              className="rounded-lg w-full h-24 md:h-32 object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
