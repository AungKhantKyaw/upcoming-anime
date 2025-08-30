import { useEffect, useState } from "react";
import { FaTv } from "react-icons/fa"; // Ensure `npm install react-icons` is run

export default function UpcomingAnime() {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder] = useState("soonest");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  async function fetchUpcoming(currentPage = 1) {
    setLoading(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5002";
      const res = await fetch(
        `${API_BASE_URL}/api/anime/upcoming?page=${currentPage}&perPage=42`
      );
      const data = await res.json();

      const formatted = data.airingSchedules.map((item: any) => ({
        id: item.media.id,
        title: item.media.title.english || item.media.title.romaji,
        episode: item.episode,
        cover: item.media.coverImage.large,
        airingAt: new Date(item.airingAt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        rawAiringAt: item.airingAt,
        countdown: formatCountdown(item.timeUntilAiring),
      }));

      setAnimeList(formatted);
      setLastPage(data.pageInfo.lastPage);
      setPage(data.pageInfo.currentPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUpcoming(page);
  }, [page]);

  function formatCountdown(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs === 0 && mins === 0) {
      return `${seconds}s`;
    }
    return `${hrs}h ${mins}m`;
  }

  const sortedList = [...animeList].sort((a, b) => {
    return sortOrder === "soonest"
      ? a.rawAiringAt - b.rawAiringAt
      : b.rawAiringAt - a.rawAiringAt;
  });

  // Group anime by date
  function groupByDate(list: any[]) {
    return list.reduce((groups: Record<string, any[]>, anime) => {
      const dateKey = new Date(anime.rawAiringAt * 1000).toLocaleDateString(
        undefined,
        {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(anime);
      return groups;
    }, {});
  }

  const groupedAnime = groupByDate(sortedList);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
        <p className="mt-8 text-2xl font-semibold tracking-wide text-purple-200 animate-pulse">
          Loading upcoming episode...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 lg:px-12 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header + Sort Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center sm:text-left flex items-center gap-4 text-white">
            <FaTv className="w-14 h-14 text-purple-500 animate-pulse" />
            Upcoming Episode List
          </h1>
        </div>

        {/* Grouped by Date */}
        {Object.entries(groupedAnime).map(([date, items]) => (
          <div key={date} className="mb-12">
            {/* Sticky Date Header */}
            <h2 className="sticky top-0 z-20 text-2xl font-bold text-purple-300 mb-6 bg-gray-900/80 backdrop-blur border-b border-purple-700 py-2 px-3 rounded-lg shadow-md">
              {date}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((anime) => (
                <div
                  key={anime.id}
                  className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 group"
                >
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
                      ⏳ {anime.countdown}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-center mt-12 gap-6">
          {/* Only show Previous if not on first page */}
          {page > 1 && (
            <button
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
          )}

          <span className="px-6 py-3 text-lg font-semibold text-white bg-gray-800 rounded-full shadow-md flex items-center">
            Page {page} of {lastPage}
          </span>

          {/* Only show Next if not on last page */}
          {page < lastPage && (
            <button
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              onClick={() => setPage((prev) => Math.min(prev + 1, lastPage))}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
