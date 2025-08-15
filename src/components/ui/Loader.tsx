
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  fullPage?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 24, fullPage = false, message = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className={`h-${size} w-${size} text-blue-600 animate-spin`} />
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
};

export default Loader;
