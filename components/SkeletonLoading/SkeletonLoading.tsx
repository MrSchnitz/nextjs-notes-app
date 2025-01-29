export const NotesSkeletonLoader = () => {
  return (
    <div className="w-full">
      <div className="columns-1 md:columns-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <div className="bg-gray-200 rounded-lg animate-pulse h-48" />
          </div>
        ))}
      </div>
    </div>
  );
};
