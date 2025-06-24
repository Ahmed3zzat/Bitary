"use client";
import Link from "next/link";
import { FaCalendarAlt, FaUserMd, FaSyringe } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { useState } from "react";

export default function MedicalRecords() {
  const [vaccinesExpanded, setVaccinesExpanded] = useState(true);
  const [treatmentsExpanded, setTreatmentsExpanded] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link
          href="/pets/health/wellness"
          className="p-2 rounded-full hover:bg-gray-200 mr-4"
        >
          <IoIosArrowBack className="text-gray-600 text-xl" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
      </div>

      {/* Vaccines Section */}
      <div
        className="bg-white rounded-xl shadow-sm p-6 pb-1 mb-8 cursor-pointer"
        onClick={() => setVaccinesExpanded(!vaccinesExpanded)}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaSyringe className="text-green-500" />
            Post Vaccines
          </h2>
          <div className="text-green-500 hover:text-green-700">
            {vaccinesExpanded ? (
              <AiFillMinusCircle className="text-xl" />
            ) : (
              <AiFillPlusCircle className="text-xl" />
            )}
          </div>
        </div>

        {vaccinesExpanded && (
          <>
            {/* 2023 Vaccines */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">2023</h3>
              <div className="space-y-4 pl-6 border-l-2 border-green-200">
                <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Nobivac KV</h4>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <FaCalendarAlt className="text-xs" />
                      11.03.2023
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUserMd className="text-gray-400" />
                    <span>dr. Martha Roth</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2022 Vaccines */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">2022</h3>
              <div className="space-y-4 pl-6 border-l-2 border-green-200">
                <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Rabisin</h4>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <FaCalendarAlt className="text-xs" />
                      20.08.2022
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUserMd className="text-gray-400" />
                    <span>dr. Martha Roth</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Nobivac Parvo-C</h4>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <FaCalendarAlt className="text-xs" />
                      20.08.2022
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUserMd className="text-gray-400" />
                    <span>dr. Martha Roth</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Treatments Section */}
      <div
        className="bg-white rounded-xl shadow-sm p-6 pb-1 cursor-pointer"
        onClick={() => setTreatmentsExpanded(!treatmentsExpanded)}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaSyringe className="text-red-500" />
            Post Treatments
          </h2>
          <div className="text-green-500 hover:text-green-700">
            {treatmentsExpanded ? (
              <AiFillMinusCircle className="text-xl" />
            ) : (
              <AiFillPlusCircle className="text-xl" />
            )}
          </div>
        </div>

        {treatmentsExpanded && (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg hover:shadow-xs transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Dental Cleaning</h4>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  <FaCalendarAlt className="text-xs" />
                  15.05.2023
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaUserMd className="text-gray-400" />
                <span>dr. Martha Roth</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}