import { useEffect, useState } from "react";

interface Anime {
  id: number;
  title: string;
  episode: number;
  cover: string;
  airingAt: string;
  countdown: string;
  rawAiringAt: number;
}

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    return Math.max(0, anime.rawAiringAt - Math.floor(Date.now() / 1000));
  });

  useEffect(() => {
    // Initial sync
    setTimeLeft(Math.max(0, anime.rawAiringAt - Math.floor(Date.now() / 1000)));

    const interval = setInterval(() => {
      const remaining = anime.rawAiringAt - Math.floor(Date.now() / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [anime.rawAiringAt]);

  function getCountdownString(seconds: number) {
    if (seconds <= 0) {
      return "Aired / Airing Now";
    }
    const days = Math.floor(seconds / (3600 * 24));
    const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let str = "";
    if (days > 0) str += `${days}d `;
    if (hrs > 0 || days > 0) str += `${hrs}h `;
    if (mins > 0 || hrs > 0 || days > 0) str += `${mins}m `;
    str += `${secs}s`;
    return str;
  }

  const countdownText = getCountdownString(timeLeft);

  return (
    <div className="relative group h-full">
      {/* Dynamic blurred neon aura glow background halo */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition duration-700 group-hover:duration-200"></div>

      {/* Main glassmorphic card container */}
      <div className="relative bg-gray-950/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-purple-500/40 flex flex-col h-full">
        <div className="relative overflow-hidden">
          <img
            src={anime.cover}
            alt={anime.title}
            className="w-full h-64 object-cover object-center transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = `https://placehold.co/400x570/4F46E5/FFFFFF?text=${encodeURIComponent(
                anime.title
              )}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <div className="p-5 flex flex-col justify-between flex-grow">
          <div>
            <h2
              className="text-xl font-bold text-white mb-3 truncate"
              title={anime.title}
            >
              {anime.title}
            </h2>
            <p className="text-lg text-gray-300 mb-2">
              Episode{" "}
              <span className="font-bold text-purple-400">{anime.episode}</span>
              {" • "}
              <span className="text-gray-400">
                Airs at <span className="font-medium text-indigo-300">{anime.airingAt}</span>
              </span>
            </p>
          </div>
          <p className="text-lg mt-4 text-pink-400 font-extrabold text-right animate-pulse">
            ⏳ {countdownText}
          </p>
        </div>
      </div>
    </div>
  );
}
