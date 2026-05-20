export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
      <p className="mt-8 text-2xl font-semibold tracking-wide text-purple-200 animate-pulse">
        Loading upcoming episodes...
      </p>
    </div>
  );
}
