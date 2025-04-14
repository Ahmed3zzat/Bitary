"use client";
import { useRouter } from "next/navigation";
import React from "react";

export default function PaymentForm() {
  const router = useRouter();

  function sendData() {
    return router.push("/all-orders");
  }

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Complete Payment
      </h1>

      <form className="space-y-6">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <input
            type="text"
            placeholder="City"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={sendData}
            className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105 cursor-pointer"
          >
            Cash Payment
          </button>
          <button
            type="button"
            className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105 cursor-pointer"
          >
            Online Payment
          </button>
        </div>
      </form>
    </div>
  );
}