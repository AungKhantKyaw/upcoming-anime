import { useState } from "react";
import { FaTv } from "react-icons/fa";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";
import AnimeCard from "./AnimeCard";
import Pagination from "./Pagination";

function formatCountdown(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs === 0 && mins === 0) {
    return `${seconds}s`;
  }
  return `${hrs}h ${mins}m`;
}

async function fetchUpcoming(currentPage = 1) {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5002";
  const res = await fetch(
    `${API_BASE_URL}/api/anime/upcoming?page=${currentPage}&perPage=42`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch upcoming episodes. Please check your connection.");
  }
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

  return {
    animeList: formatted,
    pageInfo: data.pageInfo,
  };
}

export default function UpcomingAnime() {
  const [page, setPage] = useState(1);
  const [sortOrder] = useState("soonest");

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["upcomingAnime", page],
    queryFn: () => fetchUpcoming(page),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000, // cache for 30s before considering stale
  });

  const animeList = data?.animeList || [];
  const lastPage = data?.pageInfo?.lastPage || 1;

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isError) {
    return (
      <ErrorScreen
        message={error instanceof Error ? error.message : "An unexpected error occurred while fetching upcoming episodes."}
        isFetching={isFetching}
        onRetry={refetch}
      />
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
        <div className={`transition-opacity duration-300 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
          {Object.entries(groupedAnime).map(([date, items]) => (
            <div key={date} className="mb-12">
              {/* Sticky Date Header */}
              <h2 className="sticky top-0 z-20 text-2xl font-bold text-purple-300 mb-6 bg-gray-900/80 backdrop-blur border-b border-purple-700 py-2 px-3 rounded-lg shadow-md">
                {date}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          lastPage={lastPage}
          isFetching={isFetching}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
