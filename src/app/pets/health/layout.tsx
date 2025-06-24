"use client";
import { FaBirthdayCake, FaPaw, FaDog, FaEdit, FaStar } from "react-icons/fa";
import Image from "next/image";
import petImage from "@/assets/images/Photo (PLACE IMAGE INSIDE).png";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PetProfile({ children }: { children: ReactNode }) {
  const path = usePathname();

  return (
    <>
      {path != "/pets/health" ? (
        <div className="flex flex-col lg:flex-row bg-gray-50 p-4 md:p-6 min-h-screen gap-4 md:gap-8">
          {/* Left Panel - Pet Information */}
          <div className="w-full lg:w-1/3 bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden">
            {/* Pet Header with Image */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 text-white relative">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full border-4 border-white shadow-md overflow-hidden">
                    <Image
                      src={petImage}
                      alt="Maxi"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-1.5 sm:p-2 rounded-full shadow-md transform translate-y-1/4 group-hover:translate-y-0 transition-transform duration-200">
                    {""}
                    <FaEdit className="text-green-600 text-base sm:text-lg cursor-pointer" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold">Maxi</h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <FaDog className="text-green-200" />
                    <span className="text-green-100">Border Collie</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Details */}
            <div className="p-4 md:p-6">
              {/* Appearance */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FaPaw className="text-green-500" />
                  Appearance
                </h3>
                <p className="text-gray-600 text-xs md:text-sm bg-green-50 p-3 rounded-lg">
                  Brown-Dark-White mix, with light eyebrows shape and a
                  heart-shaped patch on the left paw.
                </p>
              </div>

              {/* Characteristics */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                  Characteristics
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-500 text-sm md:text-base">
                      Gender
                    </span>
                    <span className="font-medium text-sm md:text-base">
                      Male
                    </span>
                  </li>
                  {/* <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-500 text-sm md:text-base">
                      Size
                    </span>
                    <span className="font-medium text-sm md:text-base">
                      Medium
                    </span>
                  </li>
                  <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-gray-500 text-sm md:text-base">
                      Weight
                    </span>
                    <span className="font-medium text-sm md:text-base">
                      22.2 kg
                    </span>
                  </li> */}
                </ul>
              </div>

              {/* Important Dates */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FaStar className="text-green-500" />
                  Important Dates
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between bg-green-50 p-2 md:p-3 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-green-100 p-1.5 md:p-2 rounded-full">
                        <FaBirthdayCake className="text-green-600 text-sm md:text-base" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Birthday
                        </p>
                        <p className="font-medium text-sm md:text-base">
                          November 3, 2019
                        </p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs md:text-sm">
                      3 years
                    </span>
                  </div>
                  <div className="flex items-center bg-green-50 p-2 md:p-3 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-green-100 p-1.5 md:p-2 rounded-full">
                        <FaPaw className="text-green-600 text-sm md:text-base" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Adoption Day
                        </p>
                        <p className="font-medium text-sm md:text-base">
                          January 6, 2020
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Medical Information */}
          <div className="w-full lg:w-2/3 lg:ml-0">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <Link
                href="/pets/health/wellness"
                className={`flex-1 py-2 md:py-3 px-3 md:px-4 font-medium text-center text-sm md:text-base ${
                  path === "/pets/health/wellness"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                Wellness
              </Link>
              <Link
                href="/pets/health/medicalRecords"
                className={`flex-1 py-2 md:py-3 px-3 md:px-4 font-medium text-center text-sm md:text-base ${
                  path === "/pets/health/medicalRecords"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                Medical Records
              </Link>
            </div>

            {/* Content */}
            <div className="mt-4 md:mt-6">{children}</div>
          </div>
        </div>
      ) : (
        <div className="mt-4 md:mt-6">{children}</div>
      )}
    </>
  );
}
