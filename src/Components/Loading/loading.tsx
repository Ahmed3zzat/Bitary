import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="flex items-center justify-center fixed top-0 bottom-0 right-0 left-0 bg-gradient-to-br from-gray-300 via-gray-100 to-gray-200">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-7xl font-extrabold tracking-wider text-gray-300">
          {[..."Bitary"].map((letter, index) => (
            <span
              key={index}
              className="inline-block animate-pulse hover:scale-110 text-gray-800 transition-transform"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <AiOutlineLoading3Quarters className="animate-spin text-5xl text-gray-800" />
      </div>
    </div>
  );
};

export default Loading;
