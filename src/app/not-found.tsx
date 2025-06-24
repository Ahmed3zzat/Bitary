import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4.5rem)] bg-white text-gray-800">
     
      <h1 className="text-9xl font-extrabold text-red-500 drop-shadow-md">404</h1>
      <p className="text-2xl mt-2 font-semibold text-gray-600">Page Not Found</p>
      <p className="text-lg mt-2 text-gray-500">Oops! Looks like this page wandered off...</p>

      <div className="mt-4 text-7xl animate-bounce">🐾</div>

      <Link
        href="/"
        className="mt-6 inline-block bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
      >
        Go To Home
      </Link>
    </div>
  );
}