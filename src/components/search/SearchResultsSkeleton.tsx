export default function SearchResultsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Posts skeleton */}
      <div>
        <div className="h-7 w-24 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded mt-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded mt-2"></div>
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users skeleton */}
      <div>
        <div className="h-7 w-24 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded mt-2"></div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex space-x-4">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 