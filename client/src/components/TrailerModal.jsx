import { XIcon } from "lucide-react";
import { youtubeEmbed } from "../lib/youtube";

const TrailerModal = ({ videoUrl, onClose }) => {
  if (!videoUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white cursor-pointer"
        >
          <XIcon className="w-7 h-7" />
        </button>
        <iframe
          src={youtubeEmbed(videoUrl)}
          title="Movie trailer"
          className="w-full h-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default TrailerModal;
