import { useEffect, useState } from "react";
import { FaRedo, FaWifi } from "react-icons/fa";

interface ErrorScreenProps {
  message: string;
  isFetching: boolean;
  onRetry: () => void;
}

export default function ErrorScreen({ message, isFetching, onRetry }: ErrorScreenProps) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      onRetry(); // Proactively refetch when connectivity returns!
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [onRetry]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white px-4">
      <div className="bg-gray-800/80 backdrop-blur border border-red-500/30 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        {!isOnline ? (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 text-yellow-500 mb-6">
              <FaWifi className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">You are Offline</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your device appears to have lost connection. We will automatically recover and refresh once your internet returns.
            </p>
            <button
              onClick={onRetry}
              disabled={isFetching}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-full shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 disabled:opacity-50"
            >
              <FaRedo className={isFetching ? "animate-spin" : ""} />
              Force Recheck
            </button>
          </>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 text-red-500 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Failed to Load Anime</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {message}
            </p>
            <button
              onClick={onRetry}
              disabled={isFetching}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
            >
              <FaRedo className={isFetching ? "animate-spin" : ""} />
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
