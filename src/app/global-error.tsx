'use client';

import { useEffect } from 'react';
 
export default function GlobalError({
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
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-red-500 drop-shadow-md">Critical Error</h1>
          <p className="text-xl md:text-2xl mt-4 font-semibold text-gray-600 text-center">
            Something went very wrong
          </p>
          <p className="text-lg mt-2 text-gray-500 text-center max-w-md">
            We apologize for the inconvenience. Please try refreshing the page.
          </p>

          <div className="mt-4 text-6xl">🐾</div>

          <button
            onClick={() => reset()}
            className="mt-8 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
} 