interface PaginationProps {
  page: number;
  lastPage: number;
  isFetching: boolean;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({ page, lastPage, isFetching, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center mt-12 gap-6">
      {/* Only show Previous if not on first page */}
      {page > 1 && (
        <button
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isFetching}
          onClick={() => onPageChange(page - 1)}
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
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isFetching}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
}
