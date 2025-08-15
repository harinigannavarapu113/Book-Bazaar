
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const BookSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton className="h-64 w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BookSkeletonGrid = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <BookSkeleton key={index} />
        ))}
    </div>
  );
};
