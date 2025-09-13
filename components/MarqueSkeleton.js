export default function MarqueSkeleton() {
  return (
    <div className="bg-white overflow-hidden rounded-lg border border-gray-200 animate-pulse">
      <div className="relative">
        <div className="w-full h-64 bg-gray-300"></div>
      </div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  );
}

