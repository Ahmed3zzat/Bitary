'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4.5rem)] bg-white text-gray-800 px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold text-red-500 drop-shadow-md">Error!</h1>
      <p className="text-xl md:text-2xl mt-4 font-semibold text-gray-600 text-center">Something went wrong</p>
      <p className="text-lg mt-2 text-gray-500 text-center max-w-md">
        We apologize for the inconvenience. Our team has been notified.
      </p>

      <div className="mt-4 text-6xl animate-bounce">🐾</div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          Try again
        </button>
        
        <Link
          href="/"
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg text-center"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
} 