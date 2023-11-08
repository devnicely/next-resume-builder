export default function LoadingSkeleton() {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) => (
        <li
          key={index}
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
        >
          <div className="flex w-full items-center justify-between space-x-6 p-6 animate-pulse">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3 h-5 bg-gray-300 rounded w-1/4"></div>
              <div className="mt-1 h-4 bg-gray-300 rounded w-2/4"></div>
            </div>
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"></div>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <div className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg py-4 bg-gray-300 animate-pulse"></div>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <div className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg py-4 bg-gray-300 animate-pulse"></div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
